/**
 * ICP Matcher - Match leads against the Ideal Customer Profile
 * 
 * Uses Exa.ai for semantic search to find relevant information
 * about leads and calculate ICP match scores.
 */

import { searchLeads, findSimilarCompanies } from "../lib/exa";
import type { ICP, ICPMatchResult } from "../types/icp";
import type { ValidationLead } from "../types";

/**
 * Match a single lead against an ICP
 * Returns a score from 0-60 based on criteria matching
 */
export async function matchLeadToICP(
    lead: ValidationLead,
    icp: ICP
): Promise<ICPMatchResult> {
    const matchedCriteria = {
        industry: { matched: false, score: 0, details: undefined as string | undefined },
        companySize: { matched: false, score: 0, details: undefined as string | undefined },
        geography: { matched: false, score: 0, details: undefined as string | undefined },
        title: { matched: false, score: 0, details: undefined as string | undefined },
        keywords: { matched: false, score: 0, details: undefined as string | undefined },
    };
    const reasoning: string[] = [];

    // Maximum points per category
    const MAX_INDUSTRY_SCORE = 20;
    const MAX_SIZE_SCORE = 10;
    const MAX_GEO_SCORE = 10;
    const MAX_TITLE_SCORE = 15;
    const MAX_KEYWORD_SCORE = 5;

    // 1. Check title match (using lead's title)
    if (lead.title && icp.titles.length > 0) {
        const titleMatch = matchTitle(lead.title, icp.titles);
        if (titleMatch.matched) {
            matchedCriteria.title = {
                matched: true,
                score: MAX_TITLE_SCORE * titleMatch.confidence,
                details: `Title "${lead.title}" matches ICP titles`,
            };
            reasoning.push(`✅ Title match: ${lead.title}`);
        } else {
            reasoning.push(`❌ Title "${lead.title}" doesn't match ICP titles`);
        }
    } else if (!lead.title) {
        reasoning.push(`⚠️ No title provided for lead`);
    }

    // 2. Check company against ICP criteria via Exa
    if (lead.company) {
        try {
            const companyInfo = await searchCompanyInfo(lead.company, lead.website);

            // Industry match
            if (icp.industries.length > 0) {
                const industryMatch = matchIndustry(companyInfo, icp.industries);
                matchedCriteria.industry = {
                    matched: industryMatch.matched,
                    score: MAX_INDUSTRY_SCORE * industryMatch.confidence,
                    details: industryMatch.details,
                };
                if (industryMatch.matched) {
                    reasoning.push(`✅ Industry match: ${industryMatch.details}`);
                } else {
                    reasoning.push(`❌ No industry match found`);
                }
            }

            // Size match (approximate from signals)
            if (icp.companySizes.min > 0 || icp.companySizes.max < 100000) {
                const sizeMatch = matchCompanySize(companyInfo, icp.companySizes);
                matchedCriteria.companySize = {
                    matched: sizeMatch.matched,
                    score: MAX_SIZE_SCORE * sizeMatch.confidence,
                    details: sizeMatch.details,
                };
                if (sizeMatch.matched) {
                    reasoning.push(`✅ Company size match: ${sizeMatch.details}`);
                }
            }

            // Geography match
            if (icp.geoTargets.length > 0) {
                const geoMatch = matchGeography(companyInfo, icp.geoTargets);
                matchedCriteria.geography = {
                    matched: geoMatch.matched,
                    score: MAX_GEO_SCORE * geoMatch.confidence,
                    details: geoMatch.details,
                };
                if (geoMatch.matched) {
                    reasoning.push(`✅ Geography match: ${geoMatch.details}`);
                } else {
                    reasoning.push(`❌ No geography match found`);
                }
            }

            // Keyword match
            if (icp.keywords.length > 0) {
                const keywordMatch = matchKeywords(companyInfo, icp.keywords);
                matchedCriteria.keywords = {
                    matched: keywordMatch.matched,
                    score: MAX_KEYWORD_SCORE * keywordMatch.confidence,
                    details: keywordMatch.details,
                };
                if (keywordMatch.matched) {
                    reasoning.push(`✅ Keyword match: ${keywordMatch.details}`);
                }
            }
        } catch (err) {
            console.error(`[ICP Matcher] Error searching company ${lead.company}:`, err);
            reasoning.push(`⚠️ Could not verify company information`);
        }
    } else {
        reasoning.push(`⚠️ No company name provided`);
    }

    // Calculate total ICP score (max 60)
    const icpScore = Math.round(
        matchedCriteria.industry.score +
        matchedCriteria.companySize.score +
        matchedCriteria.geography.score +
        matchedCriteria.title.score +
        matchedCriteria.keywords.score
    );

    return {
        leadId: lead.id,
        icpScore: Math.min(icpScore, 60),
        matchedCriteria,
        reasoning,
    };
}

/**
 * Batch match multiple leads (with rate limiting)
 */
export async function matchLeadsToICP(
    leads: ValidationLead[],
    icp: ICP,
    onProgress?: (current: number, total: number) => void
): Promise<ICPMatchResult[]> {
    const results: ICPMatchResult[] = [];

    for (let i = 0; i < leads.length; i++) {
        const result = await matchLeadToICP(leads[i], icp);
        results.push(result);

        if (onProgress) {
            onProgress(i + 1, leads.length);
        }

        // Rate limiting: wait 100ms between requests
        if (i < leads.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    return results;
}

/**
 * Search for company information via Exa
 */
async function searchCompanyInfo(
    company: string,
    website?: string
): Promise<string> {
    try {
        // Search for company information
        const query = website
            ? `${company} company ${website}`
            : `${company} company about`;

        const results = await searchLeads({
            query,
            numResults: 3,
            type: "neural",
        });

        // Combine text from results
        const combinedText = results
            .map(r => r.text || "")
            .join("\n")
            .substring(0, 5000);

        return combinedText;
    } catch (err) {
        console.error(`[ICP Matcher] Exa search failed for ${company}:`, err);
        return "";
    }
}

/**
 * Match title against ICP titles
 */
function matchTitle(
    leadTitle: string,
    icpTitles: string[]
): { matched: boolean; confidence: number } {
    const normalizedLead = leadTitle.toLowerCase();

    for (const icpTitle of icpTitles) {
        const normalizedIcp = icpTitle.toLowerCase();

        // Exact match
        if (normalizedLead.includes(normalizedIcp) || normalizedIcp.includes(normalizedLead)) {
            return { matched: true, confidence: 1 };
        }

        // Check for common title components
        const titleComponents = ["vp", "vice president", "director", "head", "chief", "manager", "ceo", "cto", "cfo"];
        for (const component of titleComponents) {
            if (normalizedLead.includes(component) && normalizedIcp.includes(component)) {
                return { matched: true, confidence: 0.8 };
            }
        }
    }

    return { matched: false, confidence: 0 };
}

/**
 * Match industry from company info
 */
function matchIndustry(
    companyInfo: string,
    icpIndustries: string[]
): { matched: boolean; confidence: number; details?: string } {
    const normalizedInfo = companyInfo.toLowerCase();

    for (const industry of icpIndustries) {
        const variants = getIndustryVariants(industry);
        for (const variant of variants) {
            if (normalizedInfo.includes(variant)) {
                return {
                    matched: true,
                    confidence: 1,
                    details: `Found "${industry}" indicators`,
                };
            }
        }
    }

    return { matched: false, confidence: 0 };
}

/**
 * Get industry name variants for matching
 */
function getIndustryVariants(industry: string): string[] {
    const variants: Record<string, string[]> = {
        saas: ["saas", "software as a service", "cloud software", "software platform"],
        fintech: ["fintech", "financial technology", "digital banking", "payment"],
        healthtech: ["healthtech", "health tech", "healthcare", "medical technology"],
        ecommerce: ["ecommerce", "e-commerce", "online retail", "marketplace"],
        ai: ["artificial intelligence", "machine learning", "ai-powered", "ai platform"],
        b2b: ["b2b", "business-to-business", "enterprise software"],
        cybersecurity: ["cybersecurity", "security software", "infosec"],
    };

    return variants[industry.toLowerCase()] || [industry.toLowerCase()];
}

/**
 * Match company size from info
 */
function matchCompanySize(
    companyInfo: string,
    targetSize: { min: number; max: number }
): { matched: boolean; confidence: number; details?: string } {
    // Look for employee count patterns
    const patterns = [
        /(\d+)\s*(?:\+\s*)?employees/i,
        /team\s*of\s*(\d+)/i,
        /(\d+)\s*(?:to|-)\s*(\d+)\s*employees/i,
    ];

    for (const pattern of patterns) {
        const match = companyInfo.match(pattern);
        if (match) {
            const size = parseInt(match[1], 10);
            if (size >= targetSize.min && size <= targetSize.max) {
                return {
                    matched: true,
                    confidence: 1,
                    details: `~${size} employees (target: ${targetSize.min}-${targetSize.max})`,
                };
            }
        }
    }

    // Check for size indicators
    const sizePatterns: [string, number][] = [
        ["startup", 25],
        ["early-stage", 15],
        ["series a", 50],
        ["series b", 150],
        ["series c", 300],
        ["enterprise", 1000],
        ["fortune 500", 10000],
    ];

    for (const [indicator, estimatedSize] of sizePatterns) {
        if (companyInfo.toLowerCase().includes(indicator)) {
            if (estimatedSize >= targetSize.min && estimatedSize <= targetSize.max) {
                return {
                    matched: true,
                    confidence: 0.7,
                    details: `${indicator} company (estimated ~${estimatedSize} employees)`,
                };
            }
        }
    }

    return { matched: false, confidence: 0 };
}

/**
 * Match geography from company info
 */
function matchGeography(
    companyInfo: string,
    targetGeos: string[]
): { matched: boolean; confidence: number; details?: string } {
    const normalizedInfo = companyInfo.toLowerCase();

    const geoPatterns: Record<string, string[]> = {
        france: ["france", "paris", "french", "lyon", "marseille"],
        uk: ["uk", "united kingdom", "london", "british", "england"],
        germany: ["germany", "berlin", "munich", "german", "frankfurt"],
        usa: ["united states", "usa", "us-based", "san francisco", "new york", "silicon valley"],
        europe: ["europe", "european", "emea"],
    };

    for (const targetGeo of targetGeos) {
        const patterns = geoPatterns[targetGeo.toLowerCase()] || [targetGeo.toLowerCase()];
        for (const pattern of patterns) {
            if (normalizedInfo.includes(pattern)) {
                return {
                    matched: true,
                    confidence: 1,
                    details: `Located in ${targetGeo}`,
                };
            }
        }
    }

    return { matched: false, confidence: 0 };
}

/**
 * Match keywords in company info
 */
function matchKeywords(
    companyInfo: string,
    keywords: string[]
): { matched: boolean; confidence: number; details?: string } {
    const normalizedInfo = companyInfo.toLowerCase();
    const matchedKeywords: string[] = [];

    for (const keyword of keywords) {
        if (normalizedInfo.includes(keyword.toLowerCase())) {
            matchedKeywords.push(keyword);
        }
    }

    if (matchedKeywords.length > 0) {
        return {
            matched: true,
            confidence: Math.min(matchedKeywords.length / keywords.length, 1),
            details: `Keywords: ${matchedKeywords.join(", ")}`,
        };
    }

    return { matched: false, confidence: 0 };
}
