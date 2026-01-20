import { NextRequest, NextResponse } from "next/server";
import Exa from "exa-js";

export const runtime = "nodejs";
export const maxDuration = 60; // Allow up to 60 seconds for scoring

interface Lead {
    id: string;
    company: string;
    name?: string;
    email?: string;
    title?: string;
    linkedinUrl?: string;
}

interface ScoredLead extends Lead {
    score: number;
    tier: "A" | "B" | "C";
    matchDetails: {
        industryMatch: number;
        sizeMatch: number;
        geoMatch: number;
        titleMatch: number;
        keywordMatch: number;
    };
    intentSignals?: Array<{
        type: string;
        description: string;
        score: number;
        emoji: string;
    }>;
    enrichmentData?: {
        companyDescription?: string;
        industry?: string;
        employeeCount?: number;
        fundingInfo?: string;
    };
}

interface ICP {
    id: string;
    industries: string[];
    titles: string[];
    keywords: string[];
    geographies: string[];
    rawDescription: string;
}

let exaClient: Exa | null = null;

function getExaClient(): Exa {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
        throw new Error("EXA_API_KEY is missing");
    }
    if (!exaClient) {
        exaClient = new Exa(apiKey);
    }
    return exaClient;
}

/**
 * POST /api/scoring/score
 * 
 * Score leads against an ICP prompt
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { prompt, leads, options = {} } = body as {
            prompt: string;
            leads: Lead[];
            options?: { enrichWithExa?: boolean; batchSize?: number };
        };

        if (!prompt || !leads || leads.length === 0) {
            return NextResponse.json(
                { success: false, error: "Missing prompt or leads" },
                { status: 400 }
            );
        }

        const startTime = Date.now();
        const { enrichWithExa = false, batchSize = 5 } = options;

        // Parse ICP from prompt
        const icp = parseICPFromPrompt(prompt);
        console.log(`[Scoring] Processing ${leads.length} leads with prompt:`, prompt.substring(0, 100));

        // Score leads
        const scoredLeads: ScoredLead[] = [];

        for (let i = 0; i < leads.length; i += batchSize) {
            const batch = leads.slice(i, i + batchSize);

            const batchResults = await Promise.all(
                batch.map(lead => scoreLead(lead, icp, enrichWithExa))
            );

            scoredLeads.push(...batchResults);

            // Small delay between batches if using Exa
            if (enrichWithExa && i + batchSize < leads.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        // Sort by score descending
        scoredLeads.sort((a, b) => b.score - a.score);

        const tierBreakdown = {
            tierA: scoredLeads.filter(l => l.tier === "A").length,
            tierB: scoredLeads.filter(l => l.tier === "B").length,
            tierC: scoredLeads.filter(l => l.tier === "C").length,
        };

        const processingTimeMs = Date.now() - startTime;

        return NextResponse.json({
            success: true,
            totalLeads: leads.length,
            tierBreakdown,
            scoredLeads,
            processingTimeMs,
        });
    } catch (error) {
        console.error("Scoring error:", error);
        return NextResponse.json(
            { success: false, error: "Scoring failed" },
            { status: 500 }
        );
    }
}

function parseICPFromPrompt(prompt: string): ICP {
    const industries: string[] = [];
    const titles: string[] = [];
    const keywords: string[] = [];
    const geographies: string[] = [];

    // Extract industries
    const industryMatches = prompt.match(/\b(saas|fintech|healthtech|edtech|e-commerce|ai|ml|cybersecurity|martech|b2b|startup)\b/gi);
    if (industryMatches) industries.push(...industryMatches.map(m => m.toLowerCase()));

    // Extract titles
    const titleMatches = prompt.match(/\b(ceo|cto|cfo|vp|director|head of|founder|co-founder|manager|sales|marketing)\b/gi);
    if (titleMatches) titles.push(...titleMatches);

    // Extract keywords
    const stopWords = new Set([
        "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "will", "would", "could",
        "should", "may", "might", "must", "that", "this", "who", "what", "which",
        "where", "when", "why", "how", "and", "or", "but", "for", "with", "to",
        "of", "in", "on", "at", "by", "from", "qui", "que", "de", "le", "la", "les"
    ]);

    const words = prompt.toLowerCase().split(/\s+/);
    for (const word of words) {
        const cleanWord = word.replace(/[^a-z]/g, "");
        if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
            keywords.push(cleanWord);
        }
    }

    // Extract geographies
    const geoMatches = prompt.match(/\b(usa|us|uk|france|germany|europe|asia|canada|australia|paris|london|new york|san francisco)\b/gi);
    if (geoMatches) geographies.push(...geoMatches);

    return {
        id: `icp-${Date.now()}`,
        industries: [...new Set(industries)],
        titles: [...new Set(titles)],
        keywords: [...new Set(keywords)].slice(0, 10),
        geographies: [...new Set(geographies)],
        rawDescription: prompt,
    };
}

async function scoreLead(lead: Lead, icp: ICP, enrichWithExa: boolean): Promise<ScoredLead> {
    let enrichmentData: ScoredLead["enrichmentData"];
    let intentSignals: ScoredLead["intentSignals"] = [];

    // Enrich with Exa if enabled
    if (enrichWithExa) {
        try {
            const exa = getExaClient();
            const query = `"${lead.company}" company info funding hiring growth`;

            const result = await exa.searchAndContents(query, {
                type: "auto",
                numResults: 3,
                text: true,
            });

            if (result.results.length > 0) {
                const allText = result.results.map(r => r.text || "").join(" ");
                const topResult = result.results[0];

                enrichmentData = {
                    companyDescription: topResult.text?.substring(0, 300),
                    industry: extractIndustry(allText),
                    employeeCount: extractEmployeeCount(allText),
                    fundingInfo: extractFundingInfo(allText),
                };

                // Detect intent signals
                if (/raised?\s+\$?\d+[mk]?\s*(million|m\b)/i.test(allText)) {
                    intentSignals.push({
                        type: "funding",
                        description: "Recent funding",
                        score: 15,
                        emoji: "💰",
                    });
                }
                if (/hiring|job openings?|join our team/i.test(allText)) {
                    intentSignals.push({
                        type: "hiring",
                        description: "Active hiring",
                        score: 10,
                        emoji: "🚀",
                    });
                }
                if (/expanded?|launched?|partnership/i.test(allText)) {
                    intentSignals.push({
                        type: "growth",
                        description: "Growth signals",
                        score: 7,
                        emoji: "📈",
                    });
                }
            }
        } catch (error) {
            console.error("Exa enrichment error:", error);
        }
    }

    // Calculate match score
    const matchDetails = calculateMatchScore(lead, enrichmentData, icp);

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
        tier: finalScore >= 80 ? "A" : finalScore >= 50 ? "B" : "C",
        matchDetails,
        intentSignals: intentSignals.length > 0 ? intentSignals : undefined,
        enrichmentData,
    };
}

function calculateMatchScore(
    lead: Lead,
    enrichment: ScoredLead["enrichmentData"],
    icp: ICP
): ScoredLead["matchDetails"] {
    const searchText = [
        lead.company,
        lead.title,
        enrichment?.companyDescription,
        enrichment?.industry,
    ].filter(Boolean).join(" ").toLowerCase();

    // Industry match (0-30)
    let industryMatch = 15;
    if (icp.industries.length > 0) {
        const matched = icp.industries.filter(ind => searchText.includes(ind.toLowerCase()));
        industryMatch = Math.min(30, (matched.length / icp.industries.length) * 30);
    }

    // Size match (0-20)
    let sizeMatch = 10;
    if (enrichment?.employeeCount) {
        sizeMatch = enrichment.employeeCount >= 10 && enrichment.employeeCount <= 500 ? 20 : 5;
    }

    // Geo match (0-20)
    let geoMatch = 10;
    if (icp.geographies.length > 0) {
        const matched = icp.geographies.filter(geo => searchText.includes(geo.toLowerCase()));
        geoMatch = matched.length > 0 ? 20 : 0;
    }

    // Title match (0-20)
    let titleMatch = 10;
    if (icp.titles.length > 0 && lead.title) {
        const leadTitle = lead.title.toLowerCase();
        const matched = icp.titles.filter(t =>
            leadTitle.includes(t.toLowerCase()) || t.toLowerCase().includes(leadTitle)
        );
        titleMatch = matched.length > 0 ? 20 : 5;
    }

    // Keyword match (0-10)
    let keywordMatch = 5;
    if (icp.keywords.length > 0) {
        const matched = icp.keywords.filter(kw => searchText.includes(kw.toLowerCase()));
        keywordMatch = Math.min(10, (matched.length / icp.keywords.length) * 10);
    }

    return {
        industryMatch: Math.round(industryMatch),
        sizeMatch: Math.round(sizeMatch),
        geoMatch: Math.round(geoMatch),
        titleMatch: Math.round(titleMatch),
        keywordMatch: Math.round(keywordMatch),
    };
}

function extractIndustry(text: string): string | undefined {
    const industries = [
        { pattern: /\b(saas)\b/i, name: "SaaS" },
        { pattern: /\b(fintech)\b/i, name: "Fintech" },
        { pattern: /\b(ai|artificial intelligence)\b/i, name: "AI/ML" },
        { pattern: /\be-?commerce\b/i, name: "E-commerce" },
        { pattern: /\b(b2b)\b/i, name: "B2B" },
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

function extractFundingInfo(text: string): string | undefined {
    const match = text.match(/raised?\s+(\$?\d+(?:\.\d+)?\s*(?:million|m|k)?)/i);
    return match ? `Raised ${match[1]}` : undefined;
}
