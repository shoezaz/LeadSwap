/**
 * Database Client
 *
 * Prisma client singleton for database access
 */

import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let _prisma: PrismaClient | null = null;

/**
 * Get Prisma client (lazy initialization)
 * Only initializes if DATABASE_URL is set
 */
export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!_prisma) {
    _prisma = globalThis.prisma ?? new PrismaClient({
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
    _prisma.$on("query" as never, (e: any) => {
      if (e.duration > 100) {
        logger.warn("Slow query detected", {
          query: e.query,
          params: e.params,
          duration: e.duration,
        });
      }
    });

    _prisma.$on("error" as never, (e: any) => {
      logger.error("Database error", { error: e.message });
    });
  }

  return _prisma;
}

// Legacy export for compatibility
export const prisma = { get: getPrisma };

/**
 * Check database connection health
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  const client = getPrisma();
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
  const client = getPrisma();
  if (client) {
    await client.$disconnect();
    logger.info("Database disconnected");
  }
}
