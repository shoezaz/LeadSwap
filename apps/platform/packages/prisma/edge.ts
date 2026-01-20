import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// Configure for Supabase Transaction Pooler (port 6543)
// Disable features that are Neon-specific
neonConfig.fetchConnectionCache = true;
neonConfig.pipelineConnect = false;

// For PostgreSQL (Supabase Transaction Pooler) in Edge Runtime
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const prismaEdge = new PrismaClient({
  adapter,
  log: process.env.PRISMA_LOG_LEVEL === 'debug' ? ['query', 'error', 'warn'] : ['error'],
});
