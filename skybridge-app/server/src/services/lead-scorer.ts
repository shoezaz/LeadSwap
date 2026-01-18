import Exa from "exa-js";
import type { ICP, Lead, ScoredLead, MatchDetails, EnrichmentData, TierBreakdown } from "../types.js";

let exaClient: Exa | null = null;

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
async function enrichLead(lead: Lead): Promise<EnrichmentData | undefined> {
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
    
    // Extract info from the content
    const content = topResult.text || "";
    
    return {
      companyDescription: content.substring(0, 500),
      website: topResult.url,
      // In a real implementation, we'd parse these from the content
      // For now, we'll use placeholder extraction
    };
  } catch (error) {
    console.error(`[Exa] Failed to enrich ${lead.company}:`, error);
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
    industryMatch = 15; // Default if no industry specified
  }

  // Size match (0-20 points)
  if (enrichment?.employeeCount !== undefined) {
    const count = enrichment.employeeCount;
    const minOk = !icp.companySizeMin || count >= icp.companySizeMin;
    const maxOk = !icp.companySizeMax || count <= icp.companySizeMax;
    sizeMatch = minOk && maxOk ? 20 : 0;
  } else {
    sizeMatch = 10; // Default if no size info
  }

  // Geography match (0-20 points)
  if (icp.geographies.length > 0) {
    const matchedGeos = icp.geographies.filter(geo => 
      searchText.includes(geo.toLowerCase())
    );
    geoMatch = matchedGeos.length > 0 ? 20 : 0;
  } else {
    geoMatch = 10; // Default if no geo specified
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
    titleMatch = 10; // Default
  }

  // Keyword match (0-10 points)
  if (icp.keywords.length > 0) {
    const matchedKeywords = icp.keywords.filter(kw => 
      searchText.includes(kw.toLowerCase())
    );
    keywordMatch = Math.min(10, (matchedKeywords.length / icp.keywords.length) * 10);
  } else {
    keywordMatch = 5; // Default
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
async function scoreLead(lead: Lead, icp: ICP, enrichWithExa: boolean = false): Promise<ScoredLead> {
  let enrichment: EnrichmentData | undefined;
  
  if (enrichWithExa) {
    enrichment = await enrichLead(lead);
  }

  const matchDetails = calculateMatchScore(lead, enrichment, icp);
  const score = 
    matchDetails.industryMatch + 
    matchDetails.sizeMatch + 
    matchDetails.geoMatch + 
    matchDetails.titleMatch + 
    matchDetails.keywordMatch;

  return {
    ...lead,
    score,
    tier: getTier(score),
    matchDetails,
    enrichmentData: enrichment,
  };
}

/**
 * Score multiple leads against an ICP
 */
export async function scoreLeads(
  leads: Lead[], 
  icp: ICP, 
  options: { enrichWithExa?: boolean; batchSize?: number } = {}
): Promise<{ scoredLeads: ScoredLead[]; tierBreakdown: TierBreakdown; processingTimeMs: number }> {
  const startTime = Date.now();
  const { enrichWithExa = false, batchSize = 5 } = options;
  
  const scoredLeads: ScoredLead[] = [];
  
  // Process in batches to avoid rate limits
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(lead => scoreLead(lead, icp, enrichWithExa))
    );
    scoredLeads.push(...batchResults);
    
    // Small delay between batches if using Exa enrichment
    if (enrichWithExa && i + batchSize < leads.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Sort by score descending
  scoredLeads.sort((a, b) => b.score - a.score);

  // Calculate tier breakdown
  const tierBreakdown: TierBreakdown = {
    tierA: scoredLeads.filter(l => l.tier === "A").length,
    tierB: scoredLeads.filter(l => l.tier === "B").length,
    tierC: scoredLeads.filter(l => l.tier === "C").length,
  };

  return {
    scoredLeads,
    tierBreakdown,
    processingTimeMs: Date.now() - startTime,
  };
}

/**
 * Search for leads matching an ICP using Exa.ai
 */
export async function searchLeadsWithICP(icp: ICP, numResults: number = 10): Promise<Lead[]> {
  const exa = getExaClient();
  
  // Build search query from ICP
  const queryParts: string[] = [];
  
  if (icp.industries.length > 0) {
    queryParts.push(icp.industries.join(" OR "));
  }
  
  if (icp.geographies.length > 0) {
    queryParts.push(`located in ${icp.geographies.join(" or ")}`);
  }
  
  if (icp.titles.length > 0) {
    queryParts.push(`${icp.titles.join(" OR ")} contact`);
  }

  const query = queryParts.join(", ") || icp.rawDescription;
  
  console.log(`[Exa] Searching for ICP: "${query}"`);

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
    title: undefined,
    email: undefined,
    name: undefined,
  }));
}
