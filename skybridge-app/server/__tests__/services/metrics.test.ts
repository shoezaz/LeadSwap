/**
 * Metrics Service Tests
 */

import {
    calculateNDCG,
    calculateMRR,
    calculatePrecision,
    calculateRecall,
    calculateF1,
    calculateAllMetrics,
    evaluateSearchResult,
    formatMetrics,
} from "../../src/services/metrics.js";
import type { ScoredLead } from "../../src/types.js";

describe("Evaluation Metrics", () => {
    const relevantIds = new Set(["lead-1", "lead-2", "lead-3"]);

    describe("calculateNDCG", () => {
        it("should return 1.0 for perfect ranking", () => {
            const rankedIds = ["lead-1", "lead-2", "lead-3", "lead-4", "lead-5"];
            const ndcg = calculateNDCG(rankedIds, relevantIds, undefined, 5);

            expect(ndcg).toBeCloseTo(1.0, 2);
        });

        it("should return lower score for imperfect ranking", () => {
            const rankedIds = ["lead-4", "lead-1", "lead-5", "lead-2", "lead-3"];
            const ndcg = calculateNDCG(rankedIds, relevantIds, undefined, 5);

            expect(ndcg).toBeLessThan(1.0);
            expect(ndcg).toBeGreaterThan(0);
        });

        it("should return 0 when no relevant results", () => {
            const rankedIds = ["lead-4", "lead-5", "lead-6"];
            const ndcg = calculateNDCG(rankedIds, relevantIds, undefined, 3);

            expect(ndcg).toBe(0);
        });
    });

    describe("calculateMRR", () => {
        it("should return 1.0 when first result is relevant", () => {
            const rankedIds = ["lead-1", "lead-4", "lead-5"];
            const mrr = calculateMRR(rankedIds, relevantIds, 5);

            expect(mrr).toBe(1.0);
        });

        it("should return 0.5 when first relevant is at position 2", () => {
            const rankedIds = ["lead-4", "lead-1", "lead-5"];
            const mrr = calculateMRR(rankedIds, relevantIds, 5);

            expect(mrr).toBe(0.5);
        });

        it("should return 0 when no relevant results in top-K", () => {
            const rankedIds = ["lead-4", "lead-5", "lead-6"];
            const mrr = calculateMRR(rankedIds, relevantIds, 3);

            expect(mrr).toBe(0);
        });
    });

    describe("calculatePrecision", () => {
        it("should return correct precision", () => {
            // 2 relevant in top 5
            const rankedIds = ["lead-1", "lead-4", "lead-2", "lead-5", "lead-6"];
            const precision = calculatePrecision(rankedIds, relevantIds, 5);

            expect(precision).toBe(0.4); // 2/5
        });

        it("should return 1.0 for perfect precision", () => {
            const rankedIds = ["lead-1", "lead-2", "lead-3"];
            const precision = calculatePrecision(rankedIds, relevantIds, 3);

            expect(precision).toBe(1.0);
        });
    });

    describe("calculateRecall", () => {
        it("should return correct recall", () => {
            // 2 of 3 relevant found
            const rankedIds = ["lead-1", "lead-4", "lead-2", "lead-5", "lead-6"];
            const recall = calculateRecall(rankedIds, relevantIds, 5);

            expect(recall).toBeCloseTo(0.667, 2); // 2/3
        });

        it("should return 1.0 when all relevant found", () => {
            const rankedIds = ["lead-1", "lead-2", "lead-3", "lead-4", "lead-5"];
            const recall = calculateRecall(rankedIds, relevantIds, 5);

            expect(recall).toBe(1.0);
        });
    });

    describe("calculateF1", () => {
        it("should return harmonic mean of precision and recall", () => {
            const rankedIds = ["lead-1", "lead-2", "lead-4", "lead-5"];

            const precision = calculatePrecision(rankedIds, relevantIds, 4); // 2/4 = 0.5
            const recall = calculateRecall(rankedIds, relevantIds, 4); // 2/3 = 0.667
            const f1 = calculateF1(rankedIds, relevantIds, 4);

            const expectedF1 = (2 * precision * recall) / (precision + recall);
            expect(f1).toBeCloseTo(expectedF1, 2);
        });
    });

    describe("calculateAllMetrics", () => {
        it("should return all metrics at once", () => {
            const rankedIds = ["lead-1", "lead-2", "lead-4", "lead-3", "lead-5"];
            const metrics = calculateAllMetrics(rankedIds, relevantIds, 5);

            expect(metrics).toHaveProperty("ndcg");
            expect(metrics).toHaveProperty("mrr");
            expect(metrics).toHaveProperty("precision");
            expect(metrics).toHaveProperty("recall");
            expect(metrics).toHaveProperty("f1");

            expect(metrics.mrr).toBe(1.0); // First is relevant
            expect(metrics.recall).toBe(1.0); // All 3 relevant found in top 5
        });
    });

    describe("evaluateSearchResult", () => {
        it("should evaluate scored leads against ground truth", () => {
            const scoredLeads: ScoredLead[] = [
                { id: "lead-1", company: "A", score: 90, tier: "A", matchDetails: { industryMatch: 30, sizeMatch: 20, geoMatch: 20, titleMatch: 20, keywordMatch: 0 } },
                { id: "lead-4", company: "B", score: 80, tier: "A", matchDetails: { industryMatch: 30, sizeMatch: 20, geoMatch: 20, titleMatch: 10, keywordMatch: 0 } },
                { id: "lead-2", company: "C", score: 70, tier: "B", matchDetails: { industryMatch: 20, sizeMatch: 20, geoMatch: 20, titleMatch: 10, keywordMatch: 0 } },
            ];

            const result = evaluateSearchResult("query-1", scoredLeads, ["lead-1", "lead-2", "lead-3"], 3);

            expect(result.queryId).toBe("query-1");
            expect(result.metrics.mrr).toBe(1.0); // lead-1 is first
            expect(result.rankedLeadIds).toEqual(["lead-1", "lead-4", "lead-2"]);
        });
    });

    describe("formatMetrics", () => {
        it("should format metrics as readable string", () => {
            const metrics = { ndcg: 0.85, mrr: 1.0, precision: 0.6, recall: 0.8, f1: 0.686 };
            const formatted = formatMetrics(metrics);

            expect(formatted).toContain("NDCG@K: 85.0%");
            expect(formatted).toContain("MRR@K: 100.0%");
        });
    });
});
