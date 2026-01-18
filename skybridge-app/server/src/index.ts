import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express, { type Express } from "express";
import { widgetsDevServer } from "skybridge/server";
import type { ViteDevServer } from "vite";
import { mcpAuthMetadataRouter } from "@modelcontextprotocol/sdk/server/auth/router.js";
// import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";
import { mcp } from "./middleware.js";
import server from "./server.js";

const app = express() as Express & { vite: ViteDevServer };

app.use(express.json());

// Auth0 Configuration
const auth0Domain = process.env.AUTH0_DOMAIN;
const auth0ClientId = process.env.AUTH0_CLIENT_ID;
// The deployed URL of the server (hardcoded for hackathon speed, or from env)
const ALPIC_URL = "https://leadswap-9dfc21db.alpic.live";

if (auth0Domain && auth0ClientId) {
  console.log("🔒 Enabling OAuth with Auth0...");
  
  // 1. Publish OAuth Metadata (Required by ChatGPT)
  app.use(mcpAuthMetadataRouter({
    oauthMetadata: {
      issuer: `https://${auth0Domain}/`,
      authorization_endpoint: `https://${auth0Domain}/authorize`,
      token_endpoint: `https://${auth0Domain}/oauth/token`,
      token_endpoint_auth_methods_supported: ["client_secret_post"],
      response_types_supported: ["code"],
      code_challenge_methods_supported: ["S256"],
      // Use Auth0 OIDC registration endpoint for DCR simulation or compatibility
      registration_endpoint: `https://${auth0Domain}/oidc/register`, 
      scopes_supported: ["openid", "profile", "email", "offline_access"]
    },
    resourceServerUrl: new URL(ALPIC_URL)
  }));

  // Note: For full protection, we would use requireBearerAuth here.
  // However, Skybridge's mcp() middleware likely handles the endpoint definition.
  // To strictly enforce auth, we'd need to wrap the verify function.
  // For the hackathon "Connection" phase, publishing metadata is the critical step for the error you saw.
}

app.use(mcp(server));

const env = process.env.NODE_ENV || "development";

if (env !== "production") {
  const { devtoolsStaticServer } = await import("@skybridge/devtools");
  app.use(await devtoolsStaticServer());
  app.use(await widgetsDevServer());
}

if (env === "production") {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use("/assets", cors());
  app.use("/assets", express.static(path.join(__dirname, "assets")));
}

app.listen(3000, (error) => {
  if (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  console.log("Server shutdown complete");
  process.exit(0);
});
