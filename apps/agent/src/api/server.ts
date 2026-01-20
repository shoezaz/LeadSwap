/**
 * LeadSwap API Server
 * 
 * Express server exposing endpoints for ChatGPT GPT Actions:
 * - POST /api/icp - Define ICP
 * - GET /api/icp/:userId - Get ICP
 * - POST /api/upload - Upload CSV
 * - POST /api/validate - Validate leads
 * - GET /api/results/:id - Get validation results
 */

import express, { Request, Response, NextFunction, Express } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import icpRoutes from "./routes/icp";
import uploadRoutes from "./routes/upload";
import validateRoutes from "./routes/validate";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Health check
app.get("/health", (_req: Request, res: Response) => {
    res.json({
        status: "ok",
        service: "LeadSwap API",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
    });
});

// API info
app.get("/api", (_req: Request, res: Response) => {
    res.json({
        name: "LeadSwap API",
        version: "1.0.0",
        description: "AI-powered B2B lead validation API",
        endpoints: {
            "/api/icp": {
                POST: "Define an Ideal Customer Profile",
                "GET /:userId": "Get ICP for a user",
            },
            "/api/upload": {
                POST: "Upload and parse a CSV file of leads",
            },
            "/api/validate": {
                POST: "Validate leads against an ICP",
            },
            "/api/results/:id": {
                GET: "Get validation results",
            },
        },
    });
});

// Mount routes
app.use("/api/icp", icpRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/validate", validateRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        error: "Not Found",
        message: "The requested endpoint does not exist",
    });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[Server Error]", err);
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
    });
});

// Start server
export function startServer(): void {
    app.listen(PORT, () => {
        console.log(`\n🚀 LeadSwap API Server running on http://localhost:${PORT}`);
        console.log(`📚 API docs: http://localhost:${PORT}/api`);
        console.log(`❤️ Health: http://localhost:${PORT}/health\n`);
    });
}

// Export app for testing
export { app };

// Start if run directly
if (require.main === module) {
    startServer();
}
