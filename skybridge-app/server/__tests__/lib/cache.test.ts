/**
 * Cache Tests
 */

import { generateCacheKey, cacheGet, cacheSet, cacheDelete, CACHE_CONFIG } from "../../src/lib/cache.js";

describe("Cache", () => {
  describe("generateCacheKey", () => {
    it("should generate consistent keys", () => {
      const key1 = generateCacheKey("exa", "enrich", "Acme Corp");
      const key2 = generateCacheKey("exa", "enrich", "Acme Corp");

      expect(key1).toBe(key2);
    });

    it("should normalize identifiers", () => {
      const key1 = generateCacheKey("exa", "enrich", "Acme Corp");
      const key2 = generateCacheKey("exa", "enrich", "acme corp");

      expect(key1).toBe(key2);
    });

    it("should include service and operation in key", () => {
      const key = generateCacheKey("lightpanda", "scrape", "example.com");

      expect(key).toContain("leadswap");
      expect(key).toContain("lightpanda");
      expect(key).toContain("scrape");
    });
  });

  describe("cacheSet and cacheGet", () => {
    it("should store and retrieve values", async () => {
      const testKey = "test:cache:1";
      const testValue = { data: "test", number: 42 };

      await cacheSet(testKey, testValue, 60);
      const result = await cacheGet<typeof testValue>(testKey);

      expect(result).toEqual(testValue);
    });

    it("should return null for missing keys", async () => {
      const result = await cacheGet("nonexistent:key");

      expect(result).toBeNull();
    });

    it("should handle complex objects", async () => {
      const testKey = "test:complex:1";
      const testValue = {
        enrichment: {
          companyDescription: "Test company",
          industry: "SaaS",
        },
        intentSignals: [
          { type: "funding", score: 10 },
          { type: "hiring", score: 5 },
        ],
      };

      await cacheSet(testKey, testValue, 60);
      const result = await cacheGet<typeof testValue>(testKey);

      expect(result).toEqual(testValue);
    });
  });

  describe("cacheDelete", () => {
    it("should delete cached values", async () => {
      const testKey = "test:delete:1";

      await cacheSet(testKey, { data: "test" }, 60);
      await cacheDelete(testKey);
      const result = await cacheGet(testKey);

      expect(result).toBeNull();
    });
  });

  describe("CACHE_CONFIG", () => {
    it("should have appropriate TTL values", () => {
      expect(CACHE_CONFIG.EXA_COMPANY_TTL).toBe(3600); // 1 hour
      expect(CACHE_CONFIG.EXA_INTENT_TTL).toBe(86400); // 24 hours
      expect(CACHE_CONFIG.LIGHTPANDA_TTL).toBe(86400); // 24 hours
      expect(CACHE_CONFIG.FULLENRICH_TTL).toBe(604800); // 7 days
    });
  });
});
