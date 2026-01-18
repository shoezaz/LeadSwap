
import Exa from "exa-js";
import { visitAndScrape } from "./lightpanda.js";
import { enrichPerson } from "./fullenrich.js";
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
 */
export async function enrichLeadWithExa(lead: Lead): Promise<EnrichmentData | undefined> {
  try {
    const exa = getExaClient();
    const query = lead.url || lead.company;


    const result = await exa.searchAndContents(query, {
      type: "neural",
      numResults: 1,
      text: true,
    });

    if (result.results.length === 0) {
      return undefined;
    }

    const topResult = result.results[0];
    const content = topResult.text || "";

    return {
      companyDescription: content.substring(0, 500),
      website: topResult.url,
      industry: extractIndustry(content),
      employeeCount: extractEmployeeCount(content),
    };
  } catch (error) {
    console.error(`[Exa] Failed to enrich ${lead.company}:`, error);
    return undefined;
  }
}


/**
 * Enrich a lead with company data from Lightpanda (Scraping)
 */
export async function enrichLeadWithLightpanda(lead: Lead): Promise<EnrichmentData | undefined> {
  try {
    const url = lead.url || (lead.company ? `https://${lead.company.toLowerCase().replace(/\s+/g, '')}.com` : undefined);


    if (!url) return undefined;

    const result = await visitAndScrape(url);
    if (!result) return undefined;

    return {
      companyDescription: result.title, // Fallback as we don't summzarize content yet
      website: url,
      techStack: result.techStack,
      socialLinks: result.socialLinks,
      // inferred from Tech Stack
      industry: result.techStack.includes('shopify') ? 'E-commerce' : undefined
    };
  } catch (error) {
    console.error(`[Lightpanda] Failed to enrich ${lead.company}:`, error);
    return undefined;
  }
}

function extractIndustry(text: string): string | undefined {
  if (text.toLowerCase().includes("saas")) return "SaaS";
  if (text.toLowerCase().includes("finance") || text.toLowerCase().includes("fintech")) return "Fintech";
  if (text.toLowerCase().includes("health")) return "Healthtech";
  if (text.toLowerCase().includes("ecommerce")) return "E-commerce";
  return undefined;
}

function extractEmployeeCount(text: string): number | undefined {
  const match = text.match(/(\d+)\s*(?:\+|employees)/i);
  return match ? parseInt(match[1]) : undefined;
}

/**
 * Detect intent signals using Exa
 */
async function detectIntentSignals(lead: Lead): Promise<IntentSignal[]> {
  const signals: IntentSignal[] = [];
  const exa = getExaClient();

  try {
    // Check for funding
    const fundingQuery = `"${lead.company}" raised funding OR series OR investment`;
    const fundingResult = await exa.search(fundingQuery, { numResults: 1 });

    if (fundingResult.results.length > 0) {
      signals.push({
        type: "funding",
        description: "Recent funding activity detected",
        score: 10,
        emoji: "💰",
        sourceUrl: fundingResult.results[0].url
      });
    }

    // Check for hiring
    const hiringQuery = `"${lead.company}" hiring OR careers OR "we are growing"`;
    const hiringResult = await exa.search(hiringQuery, { numResults: 1 });

    if (hiringResult.results.length > 0) {
      signals.push({
        type: "hiring",
        description: "Active hiring detected",
        score: 5,
        emoji: "🚀",
        sourceUrl: hiringResult.results[0].url
      });
    }
  } catch (err) {
    console.error(`[Intent] Failed to detect for ${lead.company}:`, err);
  }

  return signals;
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
 */
async function scoreLead(
  lead: Lead,
  icp: ICP,
  options: { enrichWithExa?: boolean; enrichWithLightpanda?: boolean; enrichWithFullEnrich?: boolean } = {}
): Promise<ScoredLead & { intentSignals: IntentSignal[] }> {
  let enrichment: EnrichmentData | undefined;

  // Prefer Exa for broad data, Lightpanda for tech/social verification
  if (options.enrichWithExa) {
    enrichment = await enrichLeadWithExa(lead);
  }

  if (options.enrichWithLightpanda) {
    const lpEnrichment = await enrichLeadWithLightpanda(lead);
    if (lpEnrichment) {
      // Merge data, prefer Lightpanda for verified tech stack
      enrichment = {
        ...enrichment,
        ...lpEnrichment,
        techStack: lpEnrichment.techStack,
        socialLinks: lpEnrichment.socialLinks,
        // Keep Exa description if available properly
        companyDescription: enrichment?.companyDescription || lpEnrichment.companyDescription
      };
    }
  }

  const matchDetails = calculateMatchScore(lead, enrichment, icp);

  // Detect intent signals
  const intentSignals: IntentSignal[] = [];
  if (options.enrichWithExa) {
    const signals = await detectIntentSignals(lead);
    intentSignals.push(...signals);
  }

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
 */
export async function scoreLeads(
  leads: Lead[],
  icp: ICP,
  options: { enrichWithExa?: boolean; enrichWithLightpanda?: boolean; enrichWithFullEnrich?: boolean; batchSize?: number } = {}
): Promise<ScoringResult> {
  const startTime = Date.now();
  const { enrichWithExa = false, enrichWithLightpanda = false, enrichWithFullEnrich = false, batchSize = 5 } = options;

  const scoredLeads: (ScoredLead & { intentSignals: IntentSignal[] })[] = [];

  // Process in batches
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(lead => scoreLead(lead, icp, { enrichWithExa, enrichWithLightpanda, enrichWithFullEnrich }))
    );
    scoredLeads.push(...batchResults);

    if (enrichWithExa && i + batchSize < leads.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Sort by score
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

  return {
    id: `scoring-${Date.now()}`,
    icpId: icp.id,
    totalLeads: leads.length,
    scoredLeads,
    tierBreakdown,
    processedAt: new Date(),
    processingTimeMs: Date.now() - startTime,
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

  const queryParts: string[] = [];
  if (icp.industries.length > 0) queryParts.push(icp.industries.join(" OR "));
  if (icp.geographies.length > 0) queryParts.push(`located in ${icp.geographies.join(" or ")}`);
  if (icp.titles.length > 0) queryParts.push(`${icp.titles.join(" OR ")} contact`);

  const query = queryParts.join(", ") || icp.rawDescription;

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
