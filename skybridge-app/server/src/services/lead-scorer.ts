import Exa from "exa-js";
import { visitAndScrape } from "./lightpanda.js";
import { enrichPerson } from "./fullenrich.js";
import { enrichWithExaOptimized } from "./exa-optimizer.js";
import { rerankLeads } from "./reranker.js";
import { generateHyDEQuery } from "./hyde.js";
import { searchPublicActivity } from "./activity-search.js";
import { logger, createTimer } from "../lib/logger.js";
import { lightpandaService, fullenrichService } from "../lib/resilience.js";
import { cacheGet, cacheSet, generateCacheKey, CACHE_CONFIG } from "../lib/cache.js";
import { costTracker } from "./cost-tracker.js";
import type {
  ICP,
  Lead,
  ScoredLead,
  MatchDetails,
  EnrichmentData,
  TierBreakdown,
  IntentSignal,
  RejectionPattern,
  ScoringResult
} from "../types.js";

let exaClient: Exa | null = null;
const CREDIT_VALUE_PER_LEAD = 5; // €5 per rejected lead

function getExaClient(): Exa {
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
 * Enrich a lead with company data from Exa.ai
 * @deprecated Use enrichWithExaOptimized from exa-optimizer.ts instead
 */
export async function enrichLeadWithExa(lead: Lead): Promise<EnrichmentData | undefined> {
  // Delegate to optimized version
  try {
    const result = await enrichWithExaOptimized(lead);
    return result.enrichment;
  } catch (error) {
    logger.error("Exa enrichment failed", { company: lead.company, error });
    return undefined;
  }
}


/**
 * Enrich a lead with company data from Lightpanda (Scraping)
 * Now with caching and resilience patterns
 */
export async function enrichLeadWithLightpanda(
  lead: Lead,
  userId: string = "anonymous"
): Promise<EnrichmentData | undefined> {
  const url = lead.url || (lead.company ? `https://${lead.company.toLowerCase().replace(/\s+/g, '')}.com` : undefined);

  if (!url) return undefined;

  const cacheKey = generateCacheKey("lightpanda", "scrape", url);

  // Check cache first
  const cached = await cacheGet<EnrichmentData>(cacheKey);
  if (cached) {
    logger.debug("Lightpanda cache hit", { url });
    costTracker.recordCost({
      userId,
      service: "lightpanda",
      operation: "scrape",
      cacheHit: true,
      leadId: lead.id,
    });
    return cached;
  }

  try {
    const timer = createTimer(`Lightpanda scrape: ${url}`);

    // Use resilience wrapper
    const result = await lightpandaService.execute(async () => {
      return await visitAndScrape(url);
    });

    timer.end({ url, success: !!result });

    if (!result) return undefined;

    const enrichment: EnrichmentData = {
      companyDescription: result.title,
      website: url,
      techStack: result.techStack,
      socialLinks: result.socialLinks,
      industry: result.techStack.includes('shopify') ? 'E-commerce' : undefined
    };

    // Cache the result
    await cacheSet(cacheKey, enrichment, CACHE_CONFIG.LIGHTPANDA_TTL);

    // Track cost
    costTracker.recordCost({
      userId,
      service: "lightpanda",
      operation: "scrape",
      cacheHit: false,
      leadId: lead.id,
    });

    return enrichment;
  } catch (error) {
    logger.error("Lightpanda enrichment failed", { company: lead.company, url, error });
    return undefined;
  }
}


/**
 * Calculate match score between a lead and an ICP
 */
function calculateMatchScore(lead: Lead, enrichment: EnrichmentData | undefined, icp: ICP): MatchDetails {
  let industryMatch = 0;
  let sizeMatch = 0;
  let geoMatch = 0;
  let titleMatch = 0;
  let keywordMatch = 0;

  const searchText = [
    lead.company,
    lead.title,
    enrichment?.companyDescription,
    enrichment?.industry,
    enrichment?.location,
  ].filter(Boolean).join(" ").toLowerCase();

  // Industry match (0-30 points)
  if (icp.industries.length > 0) {
    const matchedIndustries = icp.industries.filter(ind =>
      searchText.includes(ind.toLowerCase())
    );
    industryMatch = Math.min(30, (matchedIndustries.length / icp.industries.length) * 30);
  } else {
    industryMatch = 15;
  }

  // Size match (0-20 points)
  if (enrichment?.employeeCount !== undefined) {
    const count = enrichment.employeeCount;
    const minOk = !icp.companySizeMin || count >= icp.companySizeMin;
    const maxOk = !icp.companySizeMax || count <= icp.companySizeMax;
    sizeMatch = minOk && maxOk ? 20 : 0;
  } else {
    sizeMatch = 10;
  }

  // Geography match (0-20 points)
  if (icp.geographies.length > 0) {
    const matchedGeos = icp.geographies.filter(geo =>
      searchText.includes(geo.toLowerCase())
    );
    geoMatch = matchedGeos.length > 0 ? 20 : 0;
  } else {
    geoMatch = 10;
  }

  // Title match (0-20 points)
  if (icp.titles.length > 0 && lead.title) {
    const leadTitle = lead.title.toLowerCase();
    const matchedTitles = icp.titles.filter(title =>
      leadTitle.includes(title.toLowerCase()) ||
      title.toLowerCase().includes(leadTitle)
    );
    titleMatch = matchedTitles.length > 0 ? 20 : 5;
  } else {
    titleMatch = 10;
  }

  // Keyword match (0-10 points)
  if (icp.keywords.length > 0) {
    const matchedKeywords = icp.keywords.filter(kw =>
      searchText.includes(kw.toLowerCase())
    );
    keywordMatch = Math.min(10, (matchedKeywords.length / icp.keywords.length) * 10);
  } else {
    keywordMatch = 5;
  }

  return {
    industryMatch: Math.round(industryMatch),
    sizeMatch: Math.round(sizeMatch),
    geoMatch: Math.round(geoMatch),
    titleMatch: Math.round(titleMatch),
    keywordMatch: Math.round(keywordMatch),
  };
}

/**
 * Determine tier based on score
 */
function getTier(score: number): "A" | "B" | "C" {
  if (score >= 80) return "A";
  if (score >= 50) return "B";
  return "C";
}

/**
 * Score a single lead
 * Now uses optimized Exa API (merged enrichment + intent in 1 call)
 */
async function scoreLead(
  lead: Lead,
  icp: ICP,
  options: { enrichWithExa?: boolean; enrichWithLightpanda?: boolean; enrichWithFullEnrich?: boolean; userId?: string } = {}
): Promise<ScoredLead & { intentSignals: IntentSignal[] }> {
  const userId = options.userId || "anonymous";
  let enrichment: EnrichmentData | undefined;
  const intentSignals: IntentSignal[] = [];

  // Use optimized Exa call (merged enrichment + intent detection = 1 API call)
  if (options.enrichWithExa) {
    try {
      const exaResult = await enrichWithExaOptimized(lead, userId);
      enrichment = exaResult.enrichment;
      intentSignals.push(...exaResult.intentSignals);
    } catch (error) {
      logger.error("Exa enrichment failed in scoreLead", { company: lead.company, error });
    }
  }

  // Lightpanda for tech/social verification (with caching and resilience)
  if (options.enrichWithLightpanda) {
    const lpEnrichment = await enrichLeadWithLightpanda(lead, userId);
    if (lpEnrichment) {
      // Merge data, prefer Lightpanda for verified tech stack
      enrichment = {
        ...enrichment,
        ...lpEnrichment,
        techStack: lpEnrichment.techStack,
        socialLinks: lpEnrichment.socialLinks,
        companyDescription: enrichment?.companyDescription || lpEnrichment.companyDescription
      };
    }
  }

  // FullEnrich for email verification (with resilience)
  if (options.enrichWithFullEnrich) {
    const feParams = lead.linkedinUrl
      ? { linkedinUrl: lead.linkedinUrl }
      : (lead.email ? { email: lead.email } : undefined);

    if (feParams) {
      try {
        const feResult = await fullenrichService.execute(async () => {
          return await enrichPerson(feParams);
        });

        if (feResult) {
          // Q74: Handle catchall emails distinctly
          const emailStatus = feResult.email_status;
          enrichment = {
            ...enrichment,
            emailVerified: emailStatus === "valid",
            emailCatchall: emailStatus === "catchall", // Q74: Track catchall separately
            emailStatus: emailStatus, // Q74: Store raw status for reporting
            phone: feResult.phone_numbers?.[0],
          };
          if (!lead.email && feResult.email) lead.email = feResult.email;

          // Track cost
          costTracker.recordCost({
            userId,
            service: "fullenrich",
            operation: "enrich",
            cacheHit: false,
            leadId: lead.id,
          });
        }
      } catch (error) {
        logger.error("FullEnrich failed", { company: lead.company, error });
        // Q45: Explicitly mark as not verified on failure
        enrichment = {
          ...enrichment,
          emailVerified: false,
        };
      }
    }
  }

  const matchDetails = calculateMatchScore(lead, enrichment, icp);

  // Calculate base score
  const baseScore =
    matchDetails.industryMatch +
    matchDetails.sizeMatch +
    matchDetails.geoMatch +
    matchDetails.titleMatch +
    matchDetails.keywordMatch;

  // Add intent bonus (capped at 100)
  const intentBonus = intentSignals.reduce((acc, sig) => acc + sig.score, 0);
  const finalScore = Math.min(100, baseScore + intentBonus);

  return {
    ...lead,
    score: finalScore,
    tier: getTier(finalScore),
    matchDetails,
    enrichmentData: enrichment,
    intentSignals,
  };
}

/**
 * Score multiple leads against an ICP
 * Now with logging, cost tracking, and optimized batch processing
 */
export async function scoreLeads(
  leads: Lead[],
  icp: ICP,
  options: { enrichWithExa?: boolean; enrichWithLightpanda?: boolean; enrichWithFullEnrich?: boolean; batchSize?: number; userId?: string } = {}
): Promise<ScoringResult> {
  const timer = createTimer("scoreLeads");
  const {
    enrichWithExa = false,
    enrichWithLightpanda = false,
    enrichWithFullEnrich = false,
    batchSize = 5,
    userId = "anonymous"
  } = options;

  logger.info("Starting lead scoring", {
    leadCount: leads.length,
    enrichWithExa,
    enrichWithLightpanda,
    enrichWithFullEnrich,
    batchSize,
    userId,
  });

  // Estimate cost before running
  const costEstimate = costTracker.estimateCost({
    leadCount: leads.length,
    enrichWithExa,
    enrichWithLightpanda,
    enrichWithFullEnrich,
  });

  logger.info("Estimated scoring cost", {
    estimatedCostCents: costEstimate.estimatedCostCents,
    costPerLead: costEstimate.costPerLead,
    breakdown: costEstimate.breakdown,
  });

  let scoredLeads: (ScoredLead & { intentSignals: IntentSignal[] })[] = [];

  // Process in batches with progress logging
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(leads.length / batchSize);

    logger.debug(`Processing batch ${batchNum}/${totalBatches}`, {
      batchStart: i,
      batchSize: batch.length,
    });

    const batchResults = await Promise.all(
      batch.map(lead => scoreLead(lead, icp, { enrichWithExa, enrichWithLightpanda, enrichWithFullEnrich, userId }))
    );
    scoredLeads.push(...batchResults);

    // Small delay between batches if using external APIs
    if ((enrichWithExa || enrichWithLightpanda || enrichWithFullEnrich) && i + batchSize < leads.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }



  // Re-rank top candidates for pixel-perfect accuracy
  if (scoredLeads.length > 5) {
    const topCandidates = scoredLeads.slice(0, 50);
    const reranked = await rerankLeads(topCandidates, icp, 50, userId);

    // Ensure intentSignals is always defined after reranking
    const rerankedWithSignals = reranked.map(lead => ({
      ...lead,
      intentSignals: lead.intentSignals || [],
    }));

    // Enrich top Tier A leads with Public Activity (Ice Breakers)
    // Only do this for the absolute best matches (top 5) to save costs/time
    // Parallelize activity search
    const top5 = rerankedWithSignals.slice(0, 5);
    const activityResults = await Promise.all(
      top5.map(lead => searchPublicActivity(lead, userId))
    );

    // Merge activity back into leads
    top5.forEach((lead, index) => {
      if (!lead.enrichmentData) lead.enrichmentData = {};
      lead.enrichmentData.recentActivity = activityResults[index];
    });

    // Reconstruct lists: [Enriched Top 5] + [Rest of Reranked] + [Unreranked]
    scoredLeads = [...top5, ...rerankedWithSignals.slice(5), ...scoredLeads.slice(50)];
  }

  // Sort by score (reranker already sorts, but ensure consistency)
  scoredLeads.sort((a, b) => b.score - a.score);

  // Analyze rejections
  const rejected = scoredLeads.filter(l => l.tier === "C");
  const patterns = analyzeRejectionPatterns(rejected);
  const recommendations = generateRecommendations(patterns);
  const creditsSaved = rejected.length * CREDIT_VALUE_PER_LEAD;

  const tierBreakdown: TierBreakdown = {
    tierA: scoredLeads.filter(l => l.tier === "A").length,
    tierB: scoredLeads.filter(l => l.tier === "B").length,
    tierC: rejected.length,
  };

  const processingTimeMs = timer.end({
    leadCount: leads.length,
    tierA: tierBreakdown.tierA,
    tierB: tierBreakdown.tierB,
    tierC: tierBreakdown.tierC,
  });

  // Get actual cost statistics
  const actualCosts = costTracker.getStatistics(userId);

  logger.info("Lead scoring completed", {
    leadCount: leads.length,
    tierBreakdown,
    processingTimeMs,
    actualCostCents: actualCosts.userTotal,
    cacheHitRate: actualCosts.cacheHitRate,
  });

  return {
    id: `scoring-${Date.now()}`,
    icpId: icp.id,
    totalLeads: leads.length,
    scoredLeads,
    tierBreakdown,
    processedAt: new Date(),
    processingTimeMs,
    patterns,
    recommendations,
    creditsSaved
  };
}

function analyzeRejectionPatterns(rejected: ScoredLead[]): RejectionPattern[] {
  // Simple heuristic for demo
  const patterns: RejectionPattern[] = [];

  // Check industry mismatch
  const industryMismatch = rejected.filter(l => l.matchDetails.industryMatch < 10);
  if (industryMismatch.length > 0) {
    patterns.push({
      reason: "Industry Mismatch",
      count: industryMismatch.length,
      percentage: Math.round((industryMismatch.length / rejected.length) * 100),
      recommendation: "Refine industry filters in source data",
      examples: industryMismatch.slice(0, 3).map(l => l.company)
    });
  }

  // Check geo mismatch
  const geoMismatch = rejected.filter(l => l.matchDetails.geoMatch < 10);
  if (geoMismatch.length > 0) {
    patterns.push({
      reason: "Geography Mismatch",
      count: geoMismatch.length,
      percentage: Math.round((geoMismatch.length / rejected.length) * 100),
      recommendation: "Review location targeting settings",
      examples: geoMismatch.slice(0, 3).map(l => l.company)
    });
  }

  return patterns.sort((a, b) => b.count - a.count);
}

function generateRecommendations(patterns: RejectionPattern[]): string[] {
  return patterns.slice(0, 3).map(p => p.recommendation);
}

/**
 * Search for leads matching an ICP using Exa.ai
 */
export async function searchLeadsWithICP(icp: ICP, numResults: number = 10): Promise<Lead[]> {
  const exa = getExaClient();

  // Use HyDE for better semantic matching
  const query = await generateHyDEQuery(icp);

  logger.debug("Search query generated", {
    queryLength: query.length,
    usingHyDE: query.length > 100
  });

  const result = await exa.searchAndContents(query, {
    type: "neural",
    useAutoprompt: true,
    numResults,
    text: true,
  });

  return result.results.map((r, index) => ({
    id: r.id || `lead-${index}`,
    company: r.title || "Unknown Company",
    url: r.url,
  }));
}
