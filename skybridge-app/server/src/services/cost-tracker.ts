/**
 * Cost Tracking Service
 *
 * Monitors API usage costs across all external services
 * Provides real-time cost tracking and alerts
 */

import { logger } from "../lib/logger.js";

// Cost per operation in cents (approximate)
const COST_TABLE = {
  exa: {
    search: 0.5, // ~$0.005 per search
    searchAndContents: 1.0, // ~$0.01 per search with contents
  },
  lightpanda: {
    scrape: 0.2, // ~$0.002 per scrape (local is free)
  },
  fullenrich: {
    enrich: 5.0, // ~$0.05 per enrichment
  },
} as const;

// Alert thresholds (in cents)
const ALERT_THRESHOLDS = {
  perLeadMax: 30, // 30 cents = €0.30 per lead
  dailyBudget: 10000, // $100 daily budget
  hourlySpike: 1000, // $10/hour spike warning
};

// In-memory tracking (would be replaced by database in production)
interface CostEntry {
  timestamp: Date;
  userId: string;
  service: keyof typeof COST_TABLE;
  operation: string;
  costCents: number;
  cacheHit: boolean;
  leadId?: string;
}

class CostTracker {
  private entries: CostEntry[] = [];
  private dailyTotals = new Map<string, number>(); // date -> total cents
  private hourlyTotals = new Map<string, number>(); // date-hour -> total cents
  private userTotals = new Map<string, number>(); // userId -> total cents today

  /**
   * Record an API call cost
   */
  recordCost(params: {
    userId: string;
    service: keyof typeof COST_TABLE;
    operation: string;
    cacheHit?: boolean;
    leadId?: string;
  }): number {
    const { userId, service, operation, cacheHit = false, leadId } = params;

    // Determine cost (0 if cache hit)
    let costCents = 0;

    if (cacheHit) {
      logger.debug("Cache hit - no cost", { service, operation, userId });
    } else {
      const serviceCosts = COST_TABLE[service] as Record<string, number>;
      costCents = serviceCosts?.[operation] ?? 0;
    }

    const entry: CostEntry = {
      timestamp: new Date(),
      userId,
      service,
      operation,
      costCents,
      cacheHit,
      leadId,
    };

    this.entries.push(entry);

    // Update totals
    const dateKey = this.getDateKey();
    const hourKey = this.getHourKey();

    this.dailyTotals.set(dateKey, (this.dailyTotals.get(dateKey) ?? 0) + costCents);
    this.hourlyTotals.set(hourKey, (this.hourlyTotals.get(hourKey) ?? 0) + costCents);
    this.userTotals.set(userId, (this.userTotals.get(userId) ?? 0) + costCents);

    // Log the cost only if > 0
    if (costCents > 0) {
      logger.info("API cost recorded", {
        service,
        operation,
        costCents,
        userId,
        leadId,
        dailyTotal: this.dailyTotals.get(dateKey),
      });

      // Check for alerts
      this.checkAlerts(userId);
    }

    return costCents;
  }

  /**
   * Get cost for a batch of leads
   */
  getCostForLeads(
    _userId: string,
    leadCount: number,
    options: { exa?: boolean; lightpanda?: boolean; fullenrich?: boolean }
  ): number {
    let costPerLead = 0;

    if (options.exa) {
      // Optimized: 1 call per lead (merged query)
      costPerLead += COST_TABLE.exa.searchAndContents;
    }

    if (options.lightpanda) {
      costPerLead += COST_TABLE.lightpanda.scrape;
    }

    if (options.fullenrich) {
      costPerLead += COST_TABLE.fullenrich.enrich;
    }

    return costPerLead * leadCount;
  }

  /**
   * Get user's daily cost
   */
  getUserDailyCost(userId: string): number {
    return this.userTotals.get(userId) ?? 0;
  }

  /**
   * Get total daily cost
   */
  getDailyCost(): number {
    return this.dailyTotals.get(this.getDateKey()) ?? 0;
  }

  /**
   * Get cost statistics
   */
  getStatistics(userId?: string): {
    dailyTotal: number;
    hourlyTotal: number;
    userTotal: number;
    averageCostPerLead: number;
    callsByService: Record<string, number>;
    cacheHitRate: number;
  } {
    const dateKey = this.getDateKey();
    const hourKey = this.getHourKey();

    // Filter entries for today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEntries = this.entries.filter((e) => e.timestamp >= todayStart);
    const userEntries = userId
      ? todayEntries.filter((e) => e.userId === userId)
      : todayEntries;

    // Calculate stats
    const totalCost = userEntries.reduce((sum, e) => sum + e.costCents, 0);
    const uniqueLeads = new Set(userEntries.filter((e) => e.leadId).map((e) => e.leadId)).size;
    const cacheHits = userEntries.filter((e) => e.cacheHit).length;

    const callsByService: Record<string, number> = {};
    for (const entry of userEntries) {
      callsByService[entry.service] = (callsByService[entry.service] ?? 0) + 1;
    }

    return {
      dailyTotal: this.dailyTotals.get(dateKey) ?? 0,
      hourlyTotal: this.hourlyTotals.get(hourKey) ?? 0,
      userTotal: userId ? (this.userTotals.get(userId) ?? 0) : totalCost,
      averageCostPerLead: uniqueLeads > 0 ? totalCost / uniqueLeads : 0,
      callsByService,
      cacheHitRate: userEntries.length > 0 ? cacheHits / userEntries.length : 0,
    };
  }

  /**
   * Check and trigger alerts
   */
  private checkAlerts(userId: string): void {
    const hourKey = this.getHourKey();
    const hourlyTotal = this.hourlyTotals.get(hourKey) ?? 0;

    // Hourly spike warning
    if (hourlyTotal > ALERT_THRESHOLDS.hourlySpike) {
      logger.warn("Hourly cost spike detected", {
        hourlyTotal,
        threshold: ALERT_THRESHOLDS.hourlySpike,
        userId,
      });
    }

    // Daily budget warning
    const dailyTotal = this.dailyTotals.get(this.getDateKey()) ?? 0;
    if (dailyTotal > ALERT_THRESHOLDS.dailyBudget * 0.8) {
      logger.warn("Approaching daily budget limit", {
        dailyTotal,
        budget: ALERT_THRESHOLDS.dailyBudget,
        percentUsed: (dailyTotal / ALERT_THRESHOLDS.dailyBudget) * 100,
      });
    }
  }

  /**
   * Estimate cost before running
   */
  estimateCost(params: {
    leadCount: number;
    enrichWithExa?: boolean;
    enrichWithLightpanda?: boolean;
    enrichWithFullEnrich?: boolean;
    cacheHitRateEstimate?: number;
  }): {
    estimatedCostCents: number;
    costPerLead: number;
    breakdown: Record<string, number>;
  } {
    const {
      leadCount,
      enrichWithExa = false,
      enrichWithLightpanda = false,
      enrichWithFullEnrich = false,
      cacheHitRateEstimate = 0.3, // Assume 30% cache hit rate
    } = params;

    const breakdown: Record<string, number> = {};
    let totalPerLead = 0;

    if (enrichWithExa) {
      const exaCost = COST_TABLE.exa.searchAndContents * (1 - cacheHitRateEstimate);
      breakdown.exa = exaCost * leadCount;
      totalPerLead += exaCost;
    }

    if (enrichWithLightpanda) {
      const lpCost = COST_TABLE.lightpanda.scrape * (1 - cacheHitRateEstimate);
      breakdown.lightpanda = lpCost * leadCount;
      totalPerLead += lpCost;
    }

    if (enrichWithFullEnrich) {
      const feCost = COST_TABLE.fullenrich.enrich * (1 - cacheHitRateEstimate);
      breakdown.fullenrich = feCost * leadCount;
      totalPerLead += feCost;
    }

    return {
      estimatedCostCents: totalPerLead * leadCount,
      costPerLead: totalPerLead,
      breakdown,
    };
  }

  /**
   * Reset daily counters (call at midnight)
   */
  resetDailyCounters(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split("T")[0];

    // Archive yesterday's data before clearing
    const yesterdayTotal = this.dailyTotals.get(yesterdayKey);
    if (yesterdayTotal) {
      logger.info("Daily cost summary", {
        date: yesterdayKey,
        totalCents: yesterdayTotal,
        totalDollars: yesterdayTotal / 100,
      });
    }

    // Clear user totals
    this.userTotals.clear();

    // Cleanup old entries (keep last 24 hours)
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.entries = this.entries.filter((e) => e.timestamp > cutoff);

    logger.info("Daily counters reset", { entriesKept: this.entries.length });
  }

  private getDateKey(): string {
    return new Date().toISOString().split("T")[0];
  }

  private getHourKey(): string {
    const now = new Date();
    return `${now.toISOString().split("T")[0]}-${now.getHours()}`;
  }
  /**
   * Calculate ROI for a batch of leads
   * Base assumptions:
   * - Manual research: 15 mins (0.25h) per lead
   * - Manual hourly rate: €40/h (SDR cost)
   * - Manual cost per lead: €10.00
   */
  calculateROI(
    actualCostCents: number,
    leadCount: number
  ): {
    manualTimeSavedHours: number;
    manualCostSavedCurrency: number;
    automatedCostCurrency: number;
    roiMultiplier: number;
  } {
    if (leadCount === 0) {
      return {
        manualTimeSavedHours: 0,
        manualCostSavedCurrency: 0,
        automatedCostCurrency: 0,
        roiMultiplier: 0,
      };
    }

    // Constants
    const MANUAL_MINS_PER_LEAD = 15;
    const HOURLY_RATE_EUR = 40;

    // Calculations
    const manualTimeHours = (leadCount * MANUAL_MINS_PER_LEAD) / 60;
    const manualCostEur = manualTimeHours * HOURLY_RATE_EUR;
    const automatedCostEur = actualCostCents / 100;

    // ROI Multiplier (e.g. 10€ manual / 0.10€ auto = 100x)
    // Avoid division by zero
    const effectiveAutoCost = Math.max(automatedCostEur, 0.01);
    const roiMultiplier = Math.round((manualCostEur / effectiveAutoCost) * 10) / 10;

    return {
      manualTimeSavedHours: Math.round(manualTimeHours * 10) / 10,
      manualCostSavedCurrency: Math.round(manualCostEur * 100) / 100,
      automatedCostCurrency: Math.round(automatedCostEur * 100) / 100,
      roiMultiplier,
    };
  }
}

// Singleton instance
export const costTracker = new CostTracker();

// Export for convenience
export { COST_TABLE, ALERT_THRESHOLDS };
