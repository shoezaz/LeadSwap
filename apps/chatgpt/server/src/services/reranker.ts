/**
 * Re-ranking Service
 * 
 * Uses Cohere Rerank API to re-order candidates after initial Exa retrieval.
 * This provides "pixel perfect" accuracy by using a cross-encoder model
 * that considers query-document pairs together.
 * 
 * Based on research: Cross-encoders provide +8-15% NDCG improvement
 * over bi-encoder retrieval alone.
 */

import { CohereClient } from "cohere-ai";
import { logger, createTimer } from "../lib/logger.js";
import { cacheGet, cacheSet, generateCacheKey, CACHE_CONFIG } from "../lib/cache.js";
import { costTracker } from "./cost-tracker.js";
import type { ScoredLead, ICP, IntentSignal } from "../types.js";

// Feature flag for easy rollback
const ENABLE_RERANKING = process.env.ENABLE_RERANKING !== "false";

// Cohere client singleton
let cohereClient: CohereClient | null = null;

function getCohereClient(): CohereClient | null {
    const apiKey = process.env.COHERE_API_KEY;
    if (!apiKey) {
        logger.warn("COHERE_API_KEY not set, reranking disabled");
        return null;
    }
    if (!cohereClient) {
        cohereClient = new CohereClient({ token: apiKey });
    }
    return cohereClient;
}

/**
 * Score blending weights
 * - Original ICP matching score: 70%
 * - Rerank relevance score: 30%
 */
const ORIGINAL_WEIGHT = 0.7;
const RERANK_WEIGHT = 0.3;

/**
 * Re-rank scored leads using Cohere Rerank API
 * 
 * @param leads - Leads already scored by ICP matching
 * @param icp - The ICP used for matching
 * @param maxCandidates - Maximum candidates to rerank (default: 50)
 * @returns Re-ranked leads with blended scores
 */
export async function rerankLeads(
    leads: (ScoredLead & { intentSignals?: IntentSignal[] })[],
    icp: ICP,
    maxCandidates: number = 50,
    userId: string = "anonymous"
): Promise<(ScoredLead & { intentSignals?: IntentSignal[] })[]> {
    // Feature flag check
    if (!ENABLE_RERANKING) {
        logger.debug("Reranking disabled via feature flag");
        return leads;
    }

    // Skip if too few leads
    if (leads.length <= 3) {
        logger.debug("Skipping rerank: too few leads", { count: leads.length });
        return leads;
    }

    const timer = createTimer("rerankLeads");
    const cohere = getCohereClient();

    if (!cohere) {
        logger.warn("Cohere client not available, skipping rerank");
        return leads;
    }

    // Take top candidates for reranking
    const candidates = leads.slice(0, maxCandidates);

    // Build query from ICP
    const query = buildRerankQuery(icp);

    // Check cache
    const cacheKey = generateCacheKey("rerank", query, candidates.map(l => l.id).join(","));
    const cached = await cacheGet<number[]>(cacheKey);

    if (cached && cached.length === candidates.length) {
        logger.debug("Rerank cache hit");
        const reranked = applyRerankScores(candidates, cached);
        return [...reranked, ...leads.slice(maxCandidates)];
    }

    try {
        // Prepare documents for reranking
        const documents = candidates.map(lead =>
            buildDocumentText(lead)
        );

        logger.debug("Calling Cohere Rerank API", {
            query: query.substring(0, 100),
            documentCount: documents.length
        });

        // Call Cohere Rerank API
        const response = await cohere.rerank({
            model: "rerank-english-v3.0",
            query,
            documents,
            topN: Math.min(candidates.length, 50),
            returnDocuments: false,
        });

        // Track cost (Cohere Rerank: ~0.1 cents per 100 docs)
        costTracker.recordCost({
            userId,
            service: "cohere",
            operation: "rerank",
            cacheHit: false,
        });

        // Extract scores (0-1 range)
        const scores = new Array(candidates.length).fill(0);
        for (const result of response.results) {
            scores[result.index] = result.relevanceScore;
        }

        // Cache the scores
        await cacheSet(cacheKey, scores, CACHE_CONFIG.EXA_COMPANY_TTL);

        // Apply blended scores
        const reranked = applyRerankScores(candidates, scores);

        timer.end({
            candidateCount: candidates.length,
            topScore: scores[0]
        });

        logger.info("Reranking completed", {
            candidateCount: candidates.length,
            topRerankScore: Math.max(...scores).toFixed(3),
        });

        // Return reranked candidates + remaining leads
        return [...reranked, ...leads.slice(maxCandidates)];

    } catch (error) {
        logger.error("Cohere Rerank failed, returning original order", { error });
        timer.end({ error: true });
        return leads;
    }
}

/**
 * Build query string from ICP for reranking
 */
function buildRerankQuery(icp: ICP): string {
    const parts: string[] = [];

    if (icp.rawDescription) {
        parts.push(icp.rawDescription);
    }

    if (icp.industries.length > 0) {
        parts.push(`Industry: ${icp.industries.join(", ")}`);
    }

    if (icp.titles.length > 0) {
        parts.push(`Decision makers: ${icp.titles.join(", ")}`);
    }

    if (icp.geographies.length > 0) {
        parts.push(`Location: ${icp.geographies.join(", ")}`);
    }

    if (icp.companySizeMin || icp.companySizeMax) {
        const sizeStr = icp.companySizeMin && icp.companySizeMax
            ? `${icp.companySizeMin}-${icp.companySizeMax}`
            : icp.companySizeMin
                ? `${icp.companySizeMin}+`
                : `under ${icp.companySizeMax}`;
        parts.push(`Company size: ${sizeStr} employees`);
    }

    return parts.join(". ");
}

/**
 * Build document text from lead for reranking
 */
function buildDocumentText(lead: ScoredLead): string {
    const parts: string[] = [];

    parts.push(`Company: ${lead.company}`);

    if (lead.title) {
        parts.push(`Contact: ${lead.title}`);
    }

    if (lead.enrichmentData?.companyDescription) {
        parts.push(lead.enrichmentData.companyDescription.substring(0, 500));
    }

    if (lead.enrichmentData?.industry) {
        parts.push(`Industry: ${lead.enrichmentData.industry}`);
    }

    if (lead.enrichmentData?.employeeCount) {
        parts.push(`Size: ${lead.enrichmentData.employeeCount} employees`);
    }

    if (lead.enrichmentData?.location) {
        parts.push(`Location: ${lead.enrichmentData.location}`);
    }

    if (lead.enrichmentData?.fundingInfo) {
        parts.push(`Funding: ${lead.enrichmentData.fundingInfo}`);
    }

    return parts.join(". ");
}

/**
 * Apply rerank scores with blending
 */
function applyRerankScores(
    leads: (ScoredLead & { intentSignals?: IntentSignal[] })[],
    rerankScores: number[]
): (ScoredLead & { intentSignals?: IntentSignal[] })[] {
    const result = leads.map((lead, index) => {
        const rerankScore = rerankScores[index] || 0;

        // Blend: 70% original + 30% rerank (scaled to 0-100)
        const blendedScore = Math.round(
            (lead.score * ORIGINAL_WEIGHT) + (rerankScore * 100 * RERANK_WEIGHT)
        );

        // Cap at 100
        const finalScore = Math.min(100, blendedScore);

        // Update tier based on new score
        const tier = finalScore >= 80 ? "A" : finalScore >= 50 ? "B" : "C";

        return {
            ...lead,
            score: finalScore,
            tier,
            // Store original for debugging
            _originalScore: lead.score,
            _rerankScore: rerankScore,
        } as ScoredLead & { intentSignals?: IntentSignal[] };
    });

    // Sort by new blended score
    return result.sort((a, b) => b.score - a.score);
}

/**
 * Fallback: Simple cosine similarity reranking without API
 * Uses TF-IDF-like scoring
 */
export function rerankWithCosineSimilarity(
    leads: ScoredLead[],
    icp: ICP
): ScoredLead[] {
    const query = buildRerankQuery(icp).toLowerCase();
    const queryTerms = query.split(/\s+/).filter(t => t.length > 2);

    return leads.map(lead => {
        const docText = buildDocumentText(lead).toLowerCase();

        // Simple term overlap scoring
        let overlap = 0;
        for (const term of queryTerms) {
            if (docText.includes(term)) {
                overlap++;
            }
        }

        const similarityScore = queryTerms.length > 0
            ? (overlap / queryTerms.length) * 100
            : 0;

        const blendedScore = Math.round(
            (lead.score * ORIGINAL_WEIGHT) + (similarityScore * RERANK_WEIGHT)
        );

        const finalScore = Math.min(100, blendedScore);
        const tier: "A" | "B" | "C" = finalScore >= 80 ? "A" : finalScore >= 50 ? "B" : "C";

        return {
            ...lead,
            score: finalScore,
            tier,
        };
    }).sort((a, b) => b.score - a.score);
}
