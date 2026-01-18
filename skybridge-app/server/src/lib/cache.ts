/**
 * Caching Layer
 *
 * Redis-based caching with in-memory fallback
 * Supports TTL and cache key generation
 */

import Redis from "ioredis";
import { logger } from "./logger.js";

// Cache configuration
const CACHE_CONFIG = {
  // TTL in seconds
  EXA_COMPANY_TTL: 3600, // 1 hour for company data
  EXA_INTENT_TTL: 86400, // 24 hours for intent signals
  LIGHTPANDA_TTL: 86400, // 24 hours for web scraping
  FULLENRICH_TTL: 604800, // 7 days for email verification
  DEFAULT_TTL: 3600, // 1 hour default
};

// In-memory cache for fallback
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

let redisClient: Redis | null = null;
let redisAvailable = false;

/**
 * Initialize Redis connection
 */
export async function initializeCache(): Promise<void> {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    logger.warn("REDIS_URL not set, using in-memory cache");
    return;
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          logger.error("Redis connection failed after 3 retries");
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    redisClient.on("error", (err) => {
      logger.error("Redis error", { error: err.message });
      redisAvailable = false;
    });

    redisClient.on("connect", () => {
      logger.info("Redis connected");
      redisAvailable = true;
    });

    await redisClient.connect();
    redisAvailable = true;
  } catch (error) {
    logger.error("Failed to initialize Redis", { error });
    redisAvailable = false;
  }
}

/**
 * Generate cache key
 */
export function generateCacheKey(
  service: string,
  operation: string,
  identifier: string
): string {
  // Normalize identifier (lowercase, remove special chars)
  const normalizedId = identifier.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return `leadswap:${service}:${operation}:${normalizedId}`;
}

/**
 * Get value from cache
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    // Try Redis first
    if (redisAvailable && redisClient) {
      const value = await redisClient.get(key);
      if (value) {
        logger.debug("Cache hit (Redis)", { key });
        return JSON.parse(value) as T;
      }
    }

    // Fallback to memory cache
    const memEntry = memoryCache.get(key);
    if (memEntry && memEntry.expiresAt > Date.now()) {
      logger.debug("Cache hit (memory)", { key });
      return JSON.parse(memEntry.value) as T;
    }

    // Clean up expired entry
    if (memEntry) {
      memoryCache.delete(key);
    }

    logger.debug("Cache miss", { key });
    return null;
  } catch (error) {
    logger.error("Cache get error", { key, error });
    return null;
  }
}

/**
 * Set value in cache
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number = CACHE_CONFIG.DEFAULT_TTL
): Promise<void> {
  const serialized = JSON.stringify(value);

  try {
    // Set in Redis if available
    if (redisAvailable && redisClient) {
      await redisClient.setex(key, ttlSeconds, serialized);
      logger.debug("Cache set (Redis)", { key, ttl: ttlSeconds });
    }

    // Also set in memory cache as backup
    memoryCache.set(key, {
      value: serialized,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });

    // Cleanup old entries if memory cache is too large
    if (memoryCache.size > 10000) {
      cleanupMemoryCache();
    }
  } catch (error) {
    logger.error("Cache set error", { key, error });
  }
}

/**
 * Delete value from cache
 */
export async function cacheDelete(key: string): Promise<void> {
  try {
    if (redisAvailable && redisClient) {
      await redisClient.del(key);
    }
    memoryCache.delete(key);
    logger.debug("Cache delete", { key });
  } catch (error) {
    logger.error("Cache delete error", { key, error });
  }
}

/**
 * Check if cache is healthy
 */
export async function checkCacheHealth(): Promise<{
  redis: boolean;
  memory: boolean;
  memorySize: number;
}> {
  let redisHealthy = false;

  if (redisAvailable && redisClient) {
    try {
      await redisClient.ping();
      redisHealthy = true;
    } catch {
      redisHealthy = false;
    }
  }

  return {
    redis: redisHealthy,
    memory: true,
    memorySize: memoryCache.size,
  };
}

/**
 * Cleanup expired entries from memory cache
 */
function cleanupMemoryCache(): void {
  const now = Date.now();
  let deleted = 0;

  for (const [key, entry] of memoryCache) {
    if (entry.expiresAt <= now) {
      memoryCache.delete(key);
      deleted++;
    }
  }

  // If still too large, remove oldest entries
  if (memoryCache.size > 5000) {
    const entries = Array.from(memoryCache.entries())
      .sort((a, b) => a[1].expiresAt - b[1].expiresAt)
      .slice(0, 2500);

    for (const [key] of entries) {
      memoryCache.delete(key);
      deleted++;
    }
  }

  logger.debug("Memory cache cleanup", { deleted, remaining: memoryCache.size });
}

/**
 * Close cache connections
 */
export async function closeCache(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    logger.info("Redis connection closed");
  }
  memoryCache.clear();
}

// Export configuration for use in services
export { CACHE_CONFIG };
