/**
 * LeadSwap Lead Scorer
 *
 * Simplified scoring service for the platform.
 * Uses Exa.ai for semantic search and intent signal detection.
 */

import Exa from "exa-js";
import type {
  ICP,
  Lead,
  ScoredLead,
  MatchDetails,
  EnrichmentData,
  TierBreakdown,
  IntentSignal,
  RejectionPattern,
  ScoringResult,
} from "../types";

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
 * Parse ICP from a natural language prompt
 */
export function parseICPFromPrompt(prompt: string): ICP {
  const industries: string[] = [];
  const titles: string[] = [];
  const keywords: string[] = [];
  const geographies: string[] = [];

  // Extract industries
  const industryPatterns = [
    /\b(saas|fintech|healthtech|edtech|e-commerce|ai|ml|cybersecurity|martech)\b/gi,
  ];
  for (const pattern of industryPatterns) {
    const matches = prompt.match(pattern);
    if (matches) industries.push(...matches.map((m) => m.toLowerCase()));
  }

  // Extract titles
  const titlePatterns = [
    /\b(ceo|cto|cfo|vp|director|head of|founder|co-founder|manager)\b/gi,
  ];
  for (const pattern of titlePatterns) {
    const matches = prompt.match(pattern);
    if (matches) titles.push(...matches);
  }

  // Extract keywords from the prompt
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "shall", "can", "could", "need",
    "who", "what", "which", "where", "when", "why", "how", "that", "this",
    "these", "those", "i", "you", "he", "she", "it", "we", "they", "and",
    "or", "but", "for", "with", "to", "of", "in", "on", "at", "by", "from",
  ]);

  const words = prompt.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (word.length > 3 && !stopWords.has(word)) {
      keywords.push(word);
    }
  }

  // Extract geographies
  const geoPatterns = [
    /\b(usa|us|uk|france|germany|europe|asia|canada|australia)\b/gi,
  ];
  for (const pattern of geoPatterns) {
    const matches = prompt.match(pattern);
    if (matches) geographies.push(...matches);
  }

  return {
    id: `icp-${Date.now()}`,
    industries: [...new Set(industries)],
    titles: [...new Set(titles)],
    keywords: [...new Set(keywords)].slice(0, 10),
    geographies: [...new Set(geographies)],
    rawDescription: prompt,
    createdAt: new Date(),
  };
}

/**
 * Calculate match score between a lead and an ICP
 */
function calculateMatchScore(
  lead: Lead,
  enrichment: EnrichmentData | undefined,
  icp: ICP
): MatchDetails {
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
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Industry match (0-30 points)
  if (icp.industries.length > 0) {
    const matchedIndustries = icp.industries.filter((ind) =>
      searchText.includes(ind.toLowerCase())
    );
    industryMatch = Math.min(
      30,
      (matchedIndustries.length / icp.industries.length) * 30
    );
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
    const matchedGeos = icp.geographies.filter((geo) =>
      searchText.includes(geo.toLowerCase())
    );
    geoMatch = matchedGeos.length > 0 ? 20 : 0;
  } else {
    geoMatch = 10;
  }

  // Title match (0-20 points)
  if (icp.titles.length > 0 && lead.title) {
    const leadTitle = lead.title.toLowerCase();
    const matchedTitles = icp.titles.filter(
      (title) =>
        leadTitle.includes(title.toLowerCase()) ||
        title.toLowerCase().includes(leadTitle)
    );
    titleMatch = matchedTitles.length > 0 ? 20 : 5;
  } else {
    titleMatch = 10;
  }

  // Keyword match (0-10 points)
  if (icp.keywords.length > 0) {
    const matchedKeywords = icp.keywords.filter((kw) =>
      searchText.includes(kw.toLowerCase())
    );
    keywordMatch = Math.min(
      10,
      (matchedKeywords.length / icp.keywords.length) * 10
    );
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
 * Enrich a lead with Exa.ai and detect intent signals
 */
async function enrichLeadWithExa(
  lead: Lead
): Promise<{ enrichment: EnrichmentData; intentSignals: IntentSignal[] }> {
  try {
    const exa = getExaClient();
    const query = `"${lead.company}" company info funding hiring growth`;

    const result = await exa.searchAndContents(query, {
      type: "auto",
      numResults: 5,
      text: true,
    });

    const allText = result.results.map((r) => r.text || "").join(" ");
    const intentSignals: IntentSignal[] = [];

    // Detect funding
    if (/raised?\s+\$?\d+[mk]?\s*(million|m\b)/i.test(allText)) {
      intentSignals.push({
        type: "funding",
        description: "Recent funding activity detected",
        score: 15,
        emoji: "💰",
        detectedAt: new Date(),
      });
    }

    // Detect hiring
    if (/hiring|job openings?|join our team/i.test(allText)) {
      intentSignals.push({
        type: "hiring",
        description: "Active hiring detected",
        score: 10,
        emoji: "🚀",
        detectedAt: new Date(),
      });
    }

    // Detect growth
    if (/expanded?|launched?|partnership/i.test(allText)) {
      intentSignals.push({
        type: "growth",
        description: "Business growth signals detected",
        score: 7,
        emoji: "📈",
        detectedAt: new Date(),
      });
    }

    const topResult = result.results[0];
    const enrichment: EnrichmentData = {
      companyDescription: topResult?.text?.substring(0, 500),
      website: topResult?.url || lead.url,
      industry: extractIndustry(allText),
      employeeCount: extractEmployeeCount(allText),
      location: extractLocation(allText),
      fundingInfo: extractFundingInfo(allText),
    };

    return { enrichment, intentSignals };
  } catch (error) {
    console.error("Exa enrichment failed:", error);
    return { enrichment: {}, intentSignals: [] };
  }
}

function extractIndustry(text: string): string | undefined {
  const industries = [
    { pattern: /\b(saas)\b/i, name: "SaaS" },
    { pattern: /\b(fintech)\b/i, name: "Fintech" },
    { pattern: /\b(ai|artificial intelligence)\b/i, name: "AI/ML" },
    { pattern: /\be-?commerce\b/i, name: "E-commerce" },
  ];
  for (const { pattern, name } of industries) {
    if (pattern.test(text)) return name;
  }
  return undefined;
}

function extractEmployeeCount(text: string): number | undefined {
  const match = text.match(/(\d{1,4})\s*employees?/i);
  return match ? parseInt(match[1], 10) : undefined;
}

function extractLocation(text: string): string | undefined {
  const match = text.match(
    /\b(San Francisco|New York|London|Paris|Berlin)\b/
  );
  return match ? match[1] : undefined;
}

function extractFundingInfo(text: string): string | undefined {
  const match = text.match(/raised?\s+(\$?\d+(?:\.\d+)?\s*(?:million|m|k)?)/i);
  return match ? `Raised ${match[1]}` : undefined;
}

/**
 * Score a single lead
 */
async function scoreLead(
  lead: Lead,
  icp: ICP,
  options: { enrichWithExa?: boolean } = {}
): Promise<ScoredLead> {
  let enrichment: EnrichmentData | undefined;
  let intentSignals: IntentSignal[] = [];

  if (options.enrichWithExa) {
    const result = await enrichLeadWithExa(lead);
    enrichment = result.enrichment;
    intentSignals = result.intentSignals;
  }

  const matchDetails = calculateMatchScore(lead, enrichment, icp);

  const baseScore =
    matchDetails.industryMatch +
    matchDetails.sizeMatch +
    matchDetails.geoMatch +
    matchDetails.titleMatch +
    matchDetails.keywordMatch;

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
 * Score multiple leads against an ICP prompt
 */
export async function scoreLeads(
  leads: Lead[],
  prompt: string,
  options: { enrichWithExa?: boolean; batchSize?: number } = {}
): Promise<ScoringResult> {
  const startTime = Date.now();
  const { enrichWithExa = false, batchSize = 5 } = options;

  // Parse ICP from prompt
  const icp = parseICPFromPrompt(prompt);

  console.log(`[Scoring] Processing ${leads.length} leads with ICP:`, icp);

  const scoredLeads: ScoredLead[] = [];

  // Process in batches
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((lead) => scoreLead(lead, icp, { enrichWithExa }))
    );
    scoredLeads.push(...batchResults);

    // Small delay between batches
    if (enrichWithExa && i + batchSize < leads.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // Sort by score
  scoredLeads.sort((a, b) => b.score - a.score);

  const tierBreakdown: TierBreakdown = {
    tierA: scoredLeads.filter((l) => l.tier === "A").length,
    tierB: scoredLeads.filter((l) => l.tier === "B").length,
    tierC: scoredLeads.filter((l) => l.tier === "C").length,
  };

  const processingTimeMs = Date.now() - startTime;

  return {
    id: `scoring-${Date.now()}`,
    icpId: icp.id,
    totalLeads: leads.length,
    scoredLeads,
    tierBreakdown,
    processedAt: new Date(),
    processingTimeMs,
  };
}

/**
 * Parse CSV content into leads
 */
export function parseCSV(csvContent: string): Lead[] {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

  // Detect column mappings
  const companyCol = headers.findIndex((h) =>
    ["company", "company name", "organization"].includes(h)
  );
  const nameCol = headers.findIndex((h) =>
    ["name", "full name", "contact name"].includes(h)
  );
  const emailCol = headers.findIndex((h) => ["email", "email address"].includes(h));
  const titleCol = headers.findIndex((h) =>
    ["title", "job title", "position"].includes(h)
  );
  const linkedinCol = headers.findIndex((h) =>
    ["linkedin", "linkedin url", "linkedin_url"].includes(h)
  );

  if (companyCol === -1) {
    console.error("No company column found in CSV");
    return [];
  }

  const leads: Lead[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());

    if (!values[companyCol]) continue;

    leads.push({
      id: `lead-${i}`,
      company: values[companyCol],
      name: nameCol >= 0 ? values[nameCol] : undefined,
      email: emailCol >= 0 ? values[emailCol] : undefined,
      title: titleCol >= 0 ? values[titleCol] : undefined,
      linkedinUrl: linkedinCol >= 0 ? values[linkedinCol] : undefined,
    });
  }

  return leads;
}
