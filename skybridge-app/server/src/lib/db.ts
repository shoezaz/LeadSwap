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

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
    ],
  });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// Log slow queries
prisma.$on("query" as never, (e: any) => {
  if (e.duration > 100) {
    logger.warn("Slow query detected", {
      query: e.query,
      params: e.params,
      duration: e.duration,
    });
  }
});

prisma.$on("error" as never, (e: any) => {
  logger.error("Database error", { error: e.message });
});

/**
 * Check database connection health
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
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
  await prisma.$disconnect();
  logger.info("Database disconnected");
}
