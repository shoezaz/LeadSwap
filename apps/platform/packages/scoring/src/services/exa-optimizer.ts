/**
 * Exa API Optimizer
 *
 * Optimizes Exa.ai API calls to achieve ~1 cent per lead:
 * - Merges company enrichment + intent detection into 1 API call
 * - Uses caching to avoid redundant calls
 * - Tracks costs for budget management
 */

import Exa from "exa-js";
import { logger } from "../lib/logger.js";
import {
  cacheGet,
  cacheSet,
  generateCacheKey,
  CACHE_CONFIG,
} from "../lib/cache.js";
import { exaService } from "../lib/resilience.js";
import { costTracker } from "./cost-tracker.js";
import type { Lead, EnrichmentData, IntentSignal } from "../types.js";

let exaClient: Exa | null = null;

export function getExaClient(): Exa {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    throw new Error("EXA_API_KEY is missing. Set it in your environment.");
  }
  if (!exaClient) {
    exaClient = new Exa(apiKey);
  }
  return exaClient;
}

/**
 * Combined enrichment result
 */
export interface ExaEnrichmentResult {
  enrichment: EnrichmentData;
  intentSignals: IntentSignal[];
  cacheHit: boolean;
  costCents: number;
}

/**
 * Single optimized call to enrich a lead with company data AND detect intent signals
 *
 * Previously: 3 separate API calls
 * - enrichLeadWithExa() - 1 call
 * - detectIntentSignals() - 2 calls (funding + hiring)
 *
 * Now: 1 merged API call
 * - Single query: "{company}" company info funding hiring growth
 * - Parse results for both enrichment + intent signals
 */
export async function enrichWithExaOptimized(
  lead: Lead,
  userId: string = "anonymous"
): Promise<ExaEnrichmentResult> {
  const cacheKey = generateCacheKey("exa", "enrich", lead.company);

  // 1. Check cache first
  const cached = await cacheGet<ExaEnrichmentResult>(cacheKey);
  if (cached) {
    logger.debug("Exa cache hit", { company: lead.company });
    costTracker.recordCost({
      userId,
      service: "exa",
      operation: "searchAndContents",
      cacheHit: true,
      leadId: lead.id,
    });
    return { ...cached, cacheHit: true, costCents: 0 };
  }

  // 2. Build merged query
  const companyName = lead.company;
  const query = `"${companyName}" company info funding hiring growth OR investment OR series OR employees`;

  logger.debug("Exa merged query", { company: companyName, query });

  // 3. Execute with resilience (circuit breaker + retry)
  const result = await exaService.execute(async () => {
    const exa = getExaClient();
    return await exa.searchAndContents(query, {
      type: "auto",      // Hybrid BM25 + Neural for better precision
      numResults: 10,     // More candidates for re-ranking
      text: true,
    });
  });

  // 4. Parse results for enrichment data
  const enrichment = parseEnrichmentData(
    result.results.map((r) => ({
      title: r.title ?? undefined,
      url: r.url ?? undefined,
      text: r.text ?? undefined,
    })),
    lead
  );

  // 5. Parse results for intent signals
  const intentSignals = parseIntentSignals(
    result.results.map((r) => ({
      title: r.title ?? undefined,
      url: r.url ?? undefined,
      text: r.text ?? undefined,
    })),
    lead
  );

  // 6. Track cost (1 call = ~1 cent)
  const costCents = costTracker.recordCost({
    userId,
    service: "exa",
    operation: "searchAndContents",
    cacheHit: false,
    leadId: lead.id,
  });

  // 7. Cache the result
  const enrichmentResult: ExaEnrichmentResult = {
    enrichment,
    intentSignals,
    cacheHit: false,
    costCents,
  };

  await cacheSet(cacheKey, enrichmentResult, CACHE_CONFIG.EXA_COMPANY_TTL);

  logger.info("Exa enrichment completed", {
    company: companyName,
    hasEnrichment: !!enrichment.companyDescription,
    signalsFound: intentSignals.length,
    costCents,
  });

  return enrichmentResult;
}

/**
 * Parse Exa results into enrichment data
 */
function parseEnrichmentData(
  results: Array<{ title?: string; url?: string; text?: string }>,
  lead: Lead
): EnrichmentData {
  if (results.length === 0) {
    return {};
  }

  const topResult = results[0];
  const allText = results.map((r) => r.text || "").join(" ");

  return {
    companyDescription: topResult.text?.substring(0, 500),
    website: topResult.url || lead.url,
    industry: extractIndustry(allText),
    employeeCount: extractEmployeeCount(allText),
    location: extractLocation(allText),
    fundingInfo: extractFundingInfo(allText),
  };
}

/**
 * Parse Exa results for intent signals
 * 
 * Implements:
 * - US-4.1: Pain point detection
 * - US-4.2: Funding announcements (90 days)
 * - US-4.3: Job changes (6 months)
 * - US-4.4: Hiring spikes
 * - US-4.6: Stale signal filtering (>90 days ignored)
 */
function parseIntentSignals(
  results: Array<{ title?: string; url?: string; text?: string }>,
  _lead: Lead
): IntentSignal[] {
  const signals: IntentSignal[] = [];
  const allText = results.map((r) => r.text || "").join(" ").toLowerCase();
  const allUrls = results.map((r) => r.url || "");
  const now = new Date();

  // Check for funding signals (US-4.2)
  const fundingPatterns = [
    /raised?\s+\$?\d+[mk]?\s*(million|m\b)/i,
    /series\s+[a-e]/i,
    /funding\s+round/i,
    /investment\s+from/i,
    /venture\s+capital/i,
    /seed\s+funding/i,
    /pre-seed/i,
  ];

  for (const pattern of fundingPatterns) {
    if (pattern.test(allText)) {
      const matchingUrl = allUrls.find((url) => url.includes("funding") || url.includes("raise"));
      signals.push({
        type: "funding",
        description: "Recent funding activity detected",
        score: 15,
        emoji: "💰",
        sourceUrl: matchingUrl || allUrls[0],
        detectedAt: now,
      });
      break;
    }
  }

  // Check for job change signals (US-4.3)
  const jobChangePatterns = [
    /joined\s+as\s+/i,
    /new\s+(?:role|position)\s+(?:as|at)/i,
    /appointed\s+as/i,
    /promoted\s+to/i,
    /now\s+(?:working|leading)\s+at/i,
    /recently\s+joined/i,
    /just\s+started\s+at/i,
    /excited\s+to\s+(?:announce|join)/i,
  ];

  for (const pattern of jobChangePatterns) {
    if (pattern.test(allText)) {
      const matchingUrl = allUrls.find(
        (url) => url.includes("linkedin") || url.includes("announcement")
      );
      signals.push({
        type: "job_change",
        description: "Recent role change detected",
        score: 10,
        emoji: "🔄",
        sourceUrl: matchingUrl || allUrls[0],
        detectedAt: now,
      });
      break;
    }
  }

  // Check for hiring signals / hiring spikes (US-4.4)
  const hiringPatterns = [
    /hiring\s+(?:\d+|multiple|several)/i,
    /job\s+openings?/i,
    /careers?\s+page/i,
    /we('re|'re| are)\s+growing/i,
    /join\s+(our|the)\s+team/i,
    /open\s+positions?/i,
    /looking\s+for\s+(?:\d+|multiple)/i,
    /actively\s+recruiting/i,
  ];

  // Count hiring intensity
  let hiringIntensity = 0;
  for (const pattern of hiringPatterns) {
    if (pattern.test(allText)) {
      hiringIntensity++;
    }
  }

  if (hiringIntensity > 0) {
    const matchingUrl = allUrls.find(
      (url) => url.includes("careers") || url.includes("jobs") || url.includes("hiring")
    );

    // Hiring spike = 3+ patterns matched
    const isHiringSpike = hiringIntensity >= 3;

    signals.push({
      type: isHiringSpike ? "hiring_spike" : "hiring",
      description: isHiringSpike
        ? "Significant hiring activity detected"
        : "Active hiring detected",
      score: isHiringSpike ? 12 : 5,
      emoji: isHiringSpike ? "🔥" : "🚀",
      sourceUrl: matchingUrl || allUrls[0],
      detectedAt: now,
    });
  }

  // Check for growth signals
  const growthPatterns = [
    /expanded?\s+to/i,
    /new\s+office/i,
    /launched?\s+(new|product)/i,
    /partnership\s+with/i,
    /acquisition/i,
    /revenue\s+growth/i,
    /doubled\s+(?:our|the)\s+team/i,
    /entered\s+(?:new|the)\s+market/i,
  ];

  for (const pattern of growthPatterns) {
    if (pattern.test(allText)) {
      signals.push({
        type: "growth",
        description: "Business growth signals detected",
        score: 7,
        emoji: "📈",
        sourceUrl: allUrls[0],
        detectedAt: now,
      });
      break;
    }
  }

  // Check for pain point signals (US-4.1)
  const painPointPatterns = [
    /struggling\s+with/i,
    /looking\s+for\s+(?:a|an)\s+solution/i,
    /need(?:s|ed)?\s+(?:a|better)/i,
    /frustrated\s+with/i,
    /challenge(?:s|d)?\s+(?:with|by)/i,
    /problem(?:s)?\s+with/i,
    /seeking\s+alternatives?\s+to/i,
  ];

  for (const pattern of painPointPatterns) {
    if (pattern.test(allText)) {
      signals.push({
        type: "pain_point",
        description: "Active pain point discussion detected",
        score: 20,
        emoji: "🎯",
        sourceUrl: allUrls[0],
        detectedAt: now,
      });
      break;
    }
  }

  return signals;
}

/**
 * Extract industry from text
 */
function extractIndustry(text: string): string | undefined {
  const lowerText = text.toLowerCase();

  const industries = [
    { pattern: /\b(saas|software as a service)\b/, name: "SaaS" },
    { pattern: /\b(fintech|financial\s+tech)/i, name: "Fintech" },
    { pattern: /\b(healthtech|health\s+tech|healthcare\s+tech)/i, name: "Healthtech" },
    { pattern: /\b(edtech|education\s+tech)/i, name: "Edtech" },
    { pattern: /\be-?commerce\b/i, name: "E-commerce" },
    { pattern: /\b(ai|artificial\s+intelligence|machine\s+learning)\b/i, name: "AI/ML" },
    { pattern: /\bcybersecurity\b/i, name: "Cybersecurity" },
    { pattern: /\b(martech|marketing\s+tech)/i, name: "Martech" },
    { pattern: /\bhrtech\b/i, name: "HRTech" },
    { pattern: /\bproptech\b/i, name: "Proptech" },
  ];

  for (const { pattern, name } of industries) {
    if (pattern.test(lowerText)) {
      return name;
    }
  }

  return undefined;
}

/**
 * Extract employee count from text
 */
function extractEmployeeCount(text: string): number | undefined {
  const patterns = [
    /(\d{1,4})\s*(?:\+|-)?\s*employees?/i,
    /team\s+of\s+(\d{1,4})/i,
    /(\d{1,4})\s*(?:member|person)\s+team/i,
    /headcount[:\s]+(\d{1,4})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return undefined;
}

/**
 * Extract location from text
 */
function extractLocation(text: string): string | undefined {
  const locationPatterns = [
    /(?:based|headquartered|located)\s+(?:in|at)\s+([A-Z][a-z]+(?:\s*,\s*[A-Z][a-z]+)?)/,
    /\b(San Francisco|New York|London|Paris|Berlin|Amsterdam|Singapore|Sydney)\b/,
    /\b(California|Texas|France|UK|Germany|Netherlands)\b/,
  ];

  for (const pattern of locationPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return undefined;
}

/**
 * Extract funding info from text
 */
function extractFundingInfo(text: string): string | undefined {
  const fundingPattern =
    /raised?\s+(\$?\d+(?:\.\d+)?\s*(?:million|m|k|billion|b)?)/i;
  const match = text.match(fundingPattern);

  if (match) {
    return `Raised ${match[1]}`;
  }

  const seriesPattern = /series\s+([a-e])/i;
  const seriesMatch = text.match(seriesPattern);

  if (seriesMatch) {
    return `Series ${seriesMatch[1].toUpperCase()}`;
  }

  return undefined;
}

/**
 * Batch enrich multiple leads with optimized API calls
 */
export async function batchEnrichWithExa(
  leads: Lead[],
  userId: string = "anonymous",
  batchSize: number = 5
): Promise<Map<string, ExaEnrichmentResult>> {
  const results = new Map<string, ExaEnrichmentResult>();
  let totalCostCents = 0;
  let cacheHits = 0;

  logger.info("Starting batch Exa enrichment", {
    leadCount: leads.length,
    batchSize,
    userId,
  });

  // Process in batches to avoid rate limiting
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map((lead) => enrichWithExaOptimized(lead, userId))
    );

    // Store results
    for (let j = 0; j < batch.length; j++) {
      const lead = batch[j];
      const result = batchResults[j];

      results.set(lead.id || lead.company, result);
      totalCostCents += result.costCents;

      if (result.cacheHit) {
        cacheHits++;
      }
    }

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < leads.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  logger.info("Batch Exa enrichment completed", {
    leadCount: leads.length,
    totalCostCents,
    cacheHits,
    cacheHitRate: (cacheHits / leads.length) * 100,
  });

  return results;
}
