/**
 * Evaluation Metrics Service
 * 
 * Implements standard Information Retrieval metrics for evaluating
 * search and ranking quality:
 * 
 * - NDCG@K: Normalized Discounted Cumulative Gain
 * - MRR@K: Mean Reciprocal Rank  
 * - Precision@K: Precision at K
 * - Recall@K: Recall at K
 * - F1@K: F1 Score at K
 * 
 * These metrics help measure "pixel perfect" accuracy of lead scoring.
 */

import { logger } from "../lib/logger.js";
import type { ScoredLead } from "../types.js";

/**
 * Evaluation metrics result
 */
export interface EvaluationMetrics {
    ndcg: number;      // 0-1, higher is better
    mrr: number;       // 0-1, higher is better
    precision: number; // 0-1, higher is better
    recall: number;    // 0-1, higher is better
    f1: number;        // 0-1, harmonic mean of precision and recall
}

/**
 * Full evaluation result
 */
export interface EvaluationResult {
    queryId: string;
    metrics: EvaluationMetrics;
    k: number;
    rankedLeadIds: string[];
    relevantLeadIds: string[];
    evaluatedAt: Date;
}

/**
 * Calculate NDCG@K (Normalized Discounted Cumulative Gain)
 * 
 * Measures ranking quality, considering both relevance and position.
 * A result at position 1 is weighted more than position 10.
 * 
 * @param rankedIds - List of ranked result IDs
 * @param relevantIds - Set of relevant (ground truth) IDs
 * @param relevanceScores - Optional relevance grades (default: binary 0/1)
 * @param k - Cutoff position
 */
export function calculateNDCG(
    rankedIds: string[],
    relevantIds: Set<string>,
    relevanceScores?: Map<string, number>,
    k: number = 10
): number {
    const topK = rankedIds.slice(0, k);

    // Calculate DCG (Discounted Cumulative Gain)
    let dcg = 0;
    for (let i = 0; i < topK.length; i++) {
        const id = topK[i];
        const rel = relevanceScores?.get(id) ?? (relevantIds.has(id) ? 1 : 0);
        // DCG formula: rel_i / log2(i + 2)
        dcg += rel / Math.log2(i + 2);
    }

    // Calculate IDCG (Ideal DCG) - best possible ranking
    const idealRanking = Array.from(relevantIds)
        .map(id => relevanceScores?.get(id) ?? 1)
        .sort((a, b) => b - a)
        .slice(0, k);

    let idcg = 0;
    for (let i = 0; i < idealRanking.length; i++) {
        idcg += idealRanking[i] / Math.log2(i + 2);
    }

    // NDCG = DCG / IDCG
    return idcg === 0 ? 0 : dcg / idcg;
}

/**
 * Calculate MRR@K (Mean Reciprocal Rank)
 * 
 * Measures how quickly we find the first relevant result.
 * 1/rank of first relevant result.
 * 
 * @param rankedIds - List of ranked result IDs
 * @param relevantIds - Set of relevant (ground truth) IDs
 * @param k - Cutoff position
 */
export function calculateMRR(
    rankedIds: string[],
    relevantIds: Set<string>,
    k: number = 10
): number {
    const topK = rankedIds.slice(0, k);

    for (let i = 0; i < topK.length; i++) {
        if (relevantIds.has(topK[i])) {
            return 1 / (i + 1);
        }
    }

    return 0; // No relevant result found in top-K
}

/**
 * Calculate Precision@K
 * 
 * What fraction of top-K results are relevant?
 * 
 * @param rankedIds - List of ranked result IDs
 * @param relevantIds - Set of relevant (ground truth) IDs
 * @param k - Cutoff position
 */
export function calculatePrecision(
    rankedIds: string[],
    relevantIds: Set<string>,
    k: number = 10
): number {
    const topK = rankedIds.slice(0, k);
    const relevantInTopK = topK.filter(id => relevantIds.has(id)).length;
    return relevantInTopK / k;
}

/**
 * Calculate Recall@K
 * 
 * What fraction of all relevant items appear in top-K?
 * 
 * @param rankedIds - List of ranked result IDs
 * @param relevantIds - Set of relevant (ground truth) IDs
 * @param k - Cutoff position
 */
export function calculateRecall(
    rankedIds: string[],
    relevantIds: Set<string>,
    k: number = 10
): number {
    if (relevantIds.size === 0) return 0;

    const topK = rankedIds.slice(0, k);
    const relevantInTopK = topK.filter(id => relevantIds.has(id)).length;
    return relevantInTopK / relevantIds.size;
}

/**
 * Calculate F1@K
 * 
 * Harmonic mean of Precision and Recall
 */
export function calculateF1(
    rankedIds: string[],
    relevantIds: Set<string>,
    k: number = 10
): number {
    const precision = calculatePrecision(rankedIds, relevantIds, k);
    const recall = calculateRecall(rankedIds, relevantIds, k);

    if (precision + recall === 0) return 0;
    return (2 * precision * recall) / (precision + recall);
}

/**
 * Calculate all metrics at once
 */
export function calculateAllMetrics(
    rankedIds: string[],
    relevantIds: Set<string>,
    k: number = 10,
    relevanceScores?: Map<string, number>
): EvaluationMetrics {
    return {
        ndcg: calculateNDCG(rankedIds, relevantIds, relevanceScores, k),
        mrr: calculateMRR(rankedIds, relevantIds, k),
        precision: calculatePrecision(rankedIds, relevantIds, k),
        recall: calculateRecall(rankedIds, relevantIds, k),
        f1: calculateF1(rankedIds, relevantIds, k),
    };
}

/**
 * Evaluate a search/scoring result against ground truth
 */
export function evaluateSearchResult(
    queryId: string,
    scoredLeads: ScoredLead[],
    relevantLeadIds: string[],
    k: number = 10
): EvaluationResult {
    const rankedLeadIds = scoredLeads.map(l => l.id);
    const relevantSet = new Set(relevantLeadIds);

    const metrics = calculateAllMetrics(rankedLeadIds, relevantSet, k);

    logger.info("Search evaluation completed", {
        queryId,
        k,
        ...metrics,
    });

    return {
        queryId,
        metrics,
        k,
        rankedLeadIds: rankedLeadIds.slice(0, k),
        relevantLeadIds,
        evaluatedAt: new Date(),
    };
}

/**
 * Evaluate multiple queries and return aggregate metrics
 */
export function evaluateBatch(
    evaluations: EvaluationResult[]
): EvaluationMetrics {
    if (evaluations.length === 0) {
        return { ndcg: 0, mrr: 0, precision: 0, recall: 0, f1: 0 };
    }

    const sum = evaluations.reduce(
        (acc, e) => ({
            ndcg: acc.ndcg + e.metrics.ndcg,
            mrr: acc.mrr + e.metrics.mrr,
            precision: acc.precision + e.metrics.precision,
            recall: acc.recall + e.metrics.recall,
            f1: acc.f1 + e.metrics.f1,
        }),
        { ndcg: 0, mrr: 0, precision: 0, recall: 0, f1: 0 }
    );

    const n = evaluations.length;
    return {
        ndcg: sum.ndcg / n,
        mrr: sum.mrr / n,
        precision: sum.precision / n,
        recall: sum.recall / n,
        f1: sum.f1 / n,
    };
}

/**
 * Format metrics for display
 */
export function formatMetrics(metrics: EvaluationMetrics): string {
    return [
        `NDCG@K: ${(metrics.ndcg * 100).toFixed(1)}%`,
        `MRR@K: ${(metrics.mrr * 100).toFixed(1)}%`,
        `Precision@K: ${(metrics.precision * 100).toFixed(1)}%`,
        `Recall@K: ${(metrics.recall * 100).toFixed(1)}%`,
        `F1@K: ${(metrics.f1 * 100).toFixed(1)}%`,
    ].join(" | ");
}

/**
 * Compare two sets of metrics
 */
export function compareMetrics(
    before: EvaluationMetrics,
    after: EvaluationMetrics
): Record<keyof EvaluationMetrics, { before: number; after: number; delta: number; improved: boolean }> {
    const keys: (keyof EvaluationMetrics)[] = ["ndcg", "mrr", "precision", "recall", "f1"];

    const result = {} as Record<keyof EvaluationMetrics, { before: number; after: number; delta: number; improved: boolean }>;

    for (const key of keys) {
        const delta = after[key] - before[key];
        result[key] = {
            before: before[key],
            after: after[key],
            delta,
            improved: delta > 0,
        };
    }

    return result;
}
