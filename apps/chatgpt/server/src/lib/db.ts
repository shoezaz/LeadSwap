/**
 * Database Client
 *
 * Prisma client singleton for database access
 * Uses dynamic import to prevent startup blocking
 */

import type { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let _prisma: PrismaClient | null = null;

/**
 * Get Prisma client (lazy initialization with dynamic import)
 * Only initializes if DATABASE_URL is set
 */
export async function getPrisma(): Promise<PrismaClient | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!_prisma) {
    if (globalThis.prisma) {
      _prisma = globalThis.prisma;
    } else {
      // Dynamic import to prevent blocking startup
      const { PrismaClient } = await import("@prisma/client");

      _prisma = new PrismaClient({
        log: [
          { emit: "event", level: "query" },
          { emit: "event", level: "error" },
          { emit: "event", level: "warn" },
        ],
      });

      if (process.env.NODE_ENV !== "production") {
        globalThis.prisma = _prisma;
      }

      // Log slow queries
      // @ts-ignore - Types might be tricky with dynamic import
      _prisma.$on("query", (e: any) => {
        if (e.duration > 100) {
          logger.warn("Slow query detected", {
            query: e.query,
            params: e.params,
            duration: e.duration,
          });
        }
      });

      // @ts-ignore
      _prisma.$on("error", (e: any) => {
        logger.error("Database error", { error: e.message });
      });
    }
  }

  return _prisma;
}

// Legacy export for compatibility - Note: this mock object won't work for synchronous calls
// but we verified no synchronous callers exist.
export const prisma = {
  get: getPrisma
};

/**
 * Check database connection health
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  // Now awaits the dynamic import
  const client = await getPrisma();
  if (!client) {
    // No database configured, that's OK
    return true;
  }

  try {
    // Timeout of 1500ms for health check
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DB check timed out")), 1500)
    );

    await Promise.race([
      client.$queryRaw`SELECT 1`,
      timeout
    ]);
    return true;
  } catch (error) {
    logger.error("Database health check failed", { error });
    return false;
  }
}

/**
 * Gracefully disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
  const client = await getPrisma();
  if (client) {
    await client.$disconnect();
    logger.info("Database disconnected");
  }
}
