/**
 * Cost Tracker Tests
 */

import { costTracker, COST_TABLE } from "../../src/services/cost-tracker.js";

describe("Cost Tracker", () => {
  beforeEach(() => {
    // Reset internal state
    costTracker.resetDailyCounters();
  });

  describe("recordCost", () => {
    it("should record cost for Exa API call", () => {
      const cost = costTracker.recordCost({
        userId: "user-1",
        service: "exa",
        operation: "searchAndContents",
        leadId: "lead-1",
      });

      expect(cost).toBe(COST_TABLE.exa.searchAndContents);
    });

    it("should record zero cost for cache hits", () => {
      const cost = costTracker.recordCost({
        userId: "user-1",
        service: "exa",
        operation: "searchAndContents",
        cacheHit: true,
      });

      expect(cost).toBe(0);
    });

    it("should track user daily totals", () => {
      costTracker.recordCost({
        userId: "user-1",
        service: "exa",
        operation: "searchAndContents",
      });
      costTracker.recordCost({
        userId: "user-1",
        service: "exa",
        operation: "searchAndContents",
      });

      const userCost = costTracker.getUserDailyCost("user-1");
      expect(userCost).toBe(COST_TABLE.exa.searchAndContents * 2);
    });
  });

  describe("estimateCost", () => {
    it("should estimate cost for lead enrichment", () => {
      const estimate = costTracker.estimateCost({
        leadCount: 100,
        enrichWithExa: true,
        enrichWithLightpanda: true,
        cacheHitRateEstimate: 0,
      });

      expect(estimate.estimatedCostCents).toBeGreaterThan(0);
      expect(estimate.breakdown.exa).toBeDefined();
      expect(estimate.breakdown.lightpanda).toBeDefined();
    });

    it("should reduce cost estimate based on cache hit rate", () => {
      const noCacheEstimate = costTracker.estimateCost({
        leadCount: 100,
        enrichWithExa: true,
        cacheHitRateEstimate: 0,
      });

      const withCacheEstimate = costTracker.estimateCost({
        leadCount: 100,
        enrichWithExa: true,
        cacheHitRateEstimate: 0.5,
      });

      expect(withCacheEstimate.estimatedCostCents).toBeLessThan(
        noCacheEstimate.estimatedCostCents
      );
    });

    it("should calculate cost per lead", () => {
      const estimate = costTracker.estimateCost({
        leadCount: 100,
        enrichWithExa: true,
        enrichWithLightpanda: true,
        enrichWithFullEnrich: true,
        cacheHitRateEstimate: 0,
      });

      expect(estimate.costPerLead).toBeGreaterThan(0);
      expect(estimate.estimatedCostCents).toBe(estimate.costPerLead * 100);
    });
  });

  describe("getStatistics", () => {
    it("should return daily statistics", () => {
      // Reset first
      costTracker.resetDailyCounters();

      costTracker.recordCost({
        userId: "stat-user-1",
        service: "exa",
        operation: "searchAndContents",
      });

      const stats = costTracker.getStatistics("stat-user-1");

      expect(stats.dailyTotal).toBeGreaterThan(0);
      expect(stats.callsByService.exa).toBeGreaterThanOrEqual(1);
    });

    it("should calculate cache hit rate correctly", () => {
      // Use a completely unique user ID for isolation
      const testUserId = `cache-rate-test-${Date.now()}-${Math.random()}`;

      // First record some cache misses
      costTracker.recordCost({
        userId: testUserId,
        service: "exa",
        operation: "searchAndContents",
        cacheHit: false,
      });
      costTracker.recordCost({
        userId: testUserId,
        service: "exa",
        operation: "searchAndContents",
        cacheHit: false,
      });

      // Then record some cache hits
      costTracker.recordCost({
        userId: testUserId,
        service: "exa",
        operation: "searchAndContents",
        cacheHit: true,
      });
      costTracker.recordCost({
        userId: testUserId,
        service: "exa",
        operation: "searchAndContents",
        cacheHit: true,
      });

      // Cache hit rate should be calculated correctly
      // The implementation filters by userId so this should work
      const stats = costTracker.getStatistics(testUserId);

      // With 2 hits and 2 misses = 50% hit rate
      // But since it filters by todayStart and entries, just check it's reasonable
      expect(stats.cacheHitRate).toBeGreaterThanOrEqual(0);
      expect(stats.cacheHitRate).toBe(0.5);
    });

    it("should calculate ROI correctly", () => {
      // 10 leads, 50 cents cost
      const result = costTracker.calculateROI(50, 10);

      // Manual: 10 leads * 15 mins = 150 mins = 2.5 hours
      // Cost: 2.5h * €40 = €100
      // Auto: €0.50

      expect(result.manualTimeSavedHours).toBe(2.5);
      expect(result.manualCostSavedCurrency).toBe(100);
      expect(result.automatedCostCurrency).toBe(0.5);
      expect(result.roiMultiplier).toBe(200); // 100 / 0.5
    });

    it("should handle zero leads for ROI", () => {
      const result = costTracker.calculateROI(0, 0);
      expect(result.roiMultiplier).toBe(0);
    });
  });
});
