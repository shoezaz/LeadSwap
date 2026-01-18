import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import cors from "cors";
import express, { type Express, type Request, type Response, type NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { widgetsDevServer } from "skybridge/server";
import type { ViteDevServer } from "vite";
import { mcpAuthMetadataRouter } from "@modelcontextprotocol/sdk/server/auth/router.js";
import { mcp } from "./middleware.js";
import server from "./server.js";
import { logger, createRequestLogger } from "./lib/logger.js";
import { initializeCache, checkCacheHealth, closeCache } from "./lib/cache.js";
import { checkDatabaseHealth, disconnectDatabase } from "./lib/db.js";
import { getCircuitBreakerStates } from "./lib/resilience.js";
import { costTracker } from "./services/cost-tracker.js";

const app = express() as Express & { vite: ViteDevServer };

// ====================================
// Configuration
// ====================================
const PORT = parseInt(process.env.PORT || "3000", 10);
const ALPIC_URL = process.env.ALPIC_URL || "https://leadswap-9dfc21db.alpic.live";
const env = process.env.NODE_ENV || "development";

// ====================================
// Request ID Middleware
// ====================================
app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers["x-request-id"] as string) || randomUUID();
  req.headers["x-request-id"] = requestId;
  res.setHeader("x-request-id", requestId);

  // Attach logger to request
  (req as any).log = createRequestLogger(requestId);

  next();
});

// ====================================
// Rate Limiting
// ====================================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests, please try again later.",
    retryAfter: 15,
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === "/health" || req.path === "/ready";
  },
  handler: (req, res) => {
    logger.warn("Rate limit exceeded", {
      ip: req.ip,
      path: req.path,
      requestId: req.headers["x-request-id"],
    });
    res.status(429).json({
      error: "Too many requests, please try again later.",
      retryAfter: 15,
    });
  },
});

// Stricter rate limit for expensive operations - exported for use in specific routes
export const scoringLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 scoring requests per minute
  message: {
    error: "Scoring rate limit exceeded. Please wait before scoring more leads.",
  },
});

app.use(apiLimiter);
app.use(express.json({ limit: "10mb" }));

// ====================================
// Health Check Endpoints
// ====================================
app.get("/health", async (_req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const [dbHealth, cacheHealth] = await Promise.all([
      checkDatabaseHealth().catch(() => false),
      checkCacheHealth().catch(() => ({ redis: false, memory: true, memorySize: 0 })),
    ]);

    const circuitBreakers = getCircuitBreakerStates();
    const costStats = costTracker.getStatistics();

    const health = {
      status: dbHealth ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "0.1.0",
      checks: {
        database: dbHealth ? "ok" : "error",
        cache: {
          redis: cacheHealth.redis ? "ok" : "unavailable",
          memory: "ok",
          memorySize: cacheHealth.memorySize,
        },
        circuitBreakers,
      },
      costs: {
        dailyTotalCents: costStats.dailyTotal,
        averageCostPerLead: costStats.averageCostPerLead,
        cacheHitRate: costStats.cacheHitRate,
      },
      responseTimeMs: Date.now() - startTime,
    };

    const statusCode = dbHealth ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error("Health check failed", { error });
    res.status(503).json({
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});

app.get("/ready", async (_req: Request, res: Response) => {
  // Kubernetes readiness probe - only checks if server can handle requests
  try {
    res.status(200).json({ ready: true, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ ready: false });
  }
});

app.get("/metrics", async (_req: Request, res: Response) => {
  // Prometheus-compatible metrics endpoint
  const costStats = costTracker.getStatistics();
  const cacheHealth = await checkCacheHealth();
  const circuitBreakers = getCircuitBreakerStates();

  // Output in Prometheus format
  const metrics = [
    `# HELP leadswap_uptime_seconds Server uptime in seconds`,
    `# TYPE leadswap_uptime_seconds gauge`,
    `leadswap_uptime_seconds ${process.uptime()}`,
    ``,
    `# HELP leadswap_cost_daily_cents Total daily API cost in cents`,
    `# TYPE leadswap_cost_daily_cents gauge`,
    `leadswap_cost_daily_cents ${costStats.dailyTotal}`,
    ``,
    `# HELP leadswap_cache_hit_rate Cache hit rate`,
    `# TYPE leadswap_cache_hit_rate gauge`,
    `leadswap_cache_hit_rate ${costStats.cacheHitRate}`,
    ``,
    `# HELP leadswap_cache_memory_size In-memory cache size`,
    `# TYPE leadswap_cache_memory_size gauge`,
    `leadswap_cache_memory_size ${cacheHealth.memorySize}`,
    ``,
    ...Object.entries(costStats.callsByService).map(([service, count]) => [
      `# HELP leadswap_api_calls_total Total API calls by service`,
      `# TYPE leadswap_api_calls_total counter`,
      `leadswap_api_calls_total{service="${service}"} ${count}`,
    ]).flat(),
    ``,
    ...Object.entries(circuitBreakers).map(([service, state]) => [
      `# HELP leadswap_circuit_breaker_state Circuit breaker state (0=closed, 1=open, 2=half-open)`,
      `# TYPE leadswap_circuit_breaker_state gauge`,
      `leadswap_circuit_breaker_state{service="${service}"} ${state.state === "closed" ? 0 : state.state === "open" ? 1 : 2}`,
    ]).flat(),
  ].join("\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.send(metrics);
});

// ====================================
// Auth0 OAuth Configuration
// ====================================
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0ClientId = process.env.AUTH0_CLIENT_ID;

if (auth0Domain && auth0ClientId) {
  logger.info("Enabling OAuth with Auth0", { domain: auth0Domain });

  app.use(mcpAuthMetadataRouter({
    oauthMetadata: {
      issuer: `https://${auth0Domain}/`,
      authorization_endpoint: `https://${auth0Domain}/authorize`,
      token_endpoint: `https://${auth0Domain}/oauth/token`,
      token_endpoint_auth_methods_supported: ["client_secret_post"],
      response_types_supported: ["code"],
      code_challenge_methods_supported: ["S256"],
      registration_endpoint: `https://${auth0Domain}/oidc/register`,
      scopes_supported: ["openid", "profile", "email", "offline_access"]
    },
    resourceServerUrl: new URL(ALPIC_URL)
  }));
}

// ====================================
// MCP Server
// ====================================
app.use(mcp(server));

// ====================================
// Development Tools
// ====================================
if (env !== "production") {
  const { devtoolsStaticServer } = await import("@skybridge/devtools");
  app.use(await devtoolsStaticServer());
  app.use(await widgetsDevServer());
}

// ====================================
// Production Static Assets
// ====================================
if (env === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use("/assets", cors());
  app.use("/assets", express.static(path.join(__dirname, "assets")));
}

// ====================================
// Error Handling Middleware
// ====================================
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const requestId = req.headers["x-request-id"];

  logger.error("Unhandled error", {
    error: err.message,
    stack: err.stack,
    requestId,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    error: "Internal server error",
    requestId,
    message: env !== "production" ? err.message : undefined,
  });
});

// ====================================
// Server Startup
// ====================================
async function startServer() {
  try {
    // Initialize cache
    await initializeCache();
    logger.info("Cache initialized");

    // Start listening
    app.listen(PORT, () => {
      logger.info(`Server started`, {
        port: PORT,
        env,
        nodeVersion: process.version,
      });
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

// ====================================
// Graceful Shutdown
// ====================================
async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}, starting graceful shutdown`);

  try {
    // Close cache connections
    await closeCache();

    // Disconnect database
    await disconnectDatabase();

    logger.info("Graceful shutdown complete");
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown", { error });
    process.exit(1);
  }
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { error: error.message, stack: error.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", { reason });
});

// Start the server
startServer();
