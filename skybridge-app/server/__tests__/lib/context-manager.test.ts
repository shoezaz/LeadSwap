import {
    estimateTokens,
    truncateText,
    compressLead,
    paginate,
    summarizeLeads,
    compressResponse,
    CONTEXT_LIMITS,
} from "../../src/lib/context-manager.js";

describe("Context Manager", () => {
    describe("estimateTokens", () => {
        it("should estimate tokens for strings", () => {
            const text = "Hello, world!"; // 13 chars
            const tokens = estimateTokens(text);
            expect(tokens).toBeGreaterThan(0);
            expect(tokens).toBeLessThan(10); // ~3-4 tokens
        });

        it("should estimate tokens for objects", () => {
            const obj = { name: "Test", value: 123 };
            const tokens = estimateTokens(obj);
            expect(tokens).toBeGreaterThan(5);
        });

        it("should handle null and undefined", () => {
            expect(estimateTokens(null)).toBe(0);
            expect(estimateTokens(undefined)).toBe(0);
        });
    });

    describe("truncateText", () => {
        it("should truncate long strings", () => {
            const longText = "a".repeat(200);
            const truncated = truncateText(longText, 50);
            expect(truncated?.length).toBe(50);
            expect(truncated?.endsWith("...")).toBe(true);
        });

        it("should not truncate short strings", () => {
            const shortText = "Hello";
            const result = truncateText(shortText, 50);
            expect(result).toBe(shortText);
        });

        it("should handle undefined", () => {
            expect(truncateText(undefined)).toBeUndefined();
        });
    });

    describe("paginate", () => {
        const items = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));

        it("should return first page correctly", () => {
            const result = paginate(items, 1, 20);
            expect(result.items.length).toBe(20);
            expect(result.page).toBe(1);
            expect(result.totalPages).toBe(5);
            expect(result.hasNextPage).toBe(true);
            expect(result.hasPreviousPage).toBe(false);
        });

        it("should return middle page correctly", () => {
            const result = paginate(items, 3, 20);
            expect(result.items.length).toBe(20);
            expect(result.page).toBe(3);
            expect(result.hasNextPage).toBe(true);
            expect(result.hasPreviousPage).toBe(true);
        });

        it("should return last page correctly", () => {
            const result = paginate(items, 5, 20);
            expect(result.items.length).toBe(20);
            expect(result.page).toBe(5);
            expect(result.hasNextPage).toBe(false);
            expect(result.hasPreviousPage).toBe(true);
        });

        it("should respect max page size", () => {
            const result = paginate(items, 1, 100);
            expect(result.pageSize).toBe(CONTEXT_LIMITS.maxPageSize);
        });

        it("should handle empty arrays", () => {
            const result = paginate([], 1, 20);
            expect(result.items.length).toBe(0);
            expect(result.totalPages).toBe(0);
        });
    });

    describe("summarizeLeads", () => {
        const leads = [
            { company: "Acme", score: 90, tier: "A", intentSignals: [{}] },
            { company: "Globex", score: 85, tier: "A", intentSignals: [{}, {}] },
            { company: "Initech", score: 65, tier: "B", intentSignals: [] },
            { company: "Umbrella", score: 30, tier: "C", intentSignals: [] },
        ];

        it("should return correct tier breakdown", () => {
            const summary = summarizeLeads(leads);
            expect(summary.tierBreakdown.tierA).toBe(2);
            expect(summary.tierBreakdown.tierB).toBe(1);
            expect(summary.tierBreakdown.tierC).toBe(1);
        });

        it("should calculate average score", () => {
            const summary = summarizeLeads(leads);
            expect(summary.avgScore).toBe(68); // (90+85+65+30)/4 = 67.5 rounded
        });

        it("should list top companies", () => {
            const summary = summarizeLeads(leads);
            expect(summary.topCompanies).toContain("Acme");
            expect(summary.topCompanies).toContain("Globex");
        });

        it("should count intent signals", () => {
            const summary = summarizeLeads(leads);
            expect(summary.intentSignalCount).toBe(3);
        });
    });

    describe("compressLead", () => {
        it("should truncate long description fields", () => {
            const lead = {
                company: "Test",
                description: "a".repeat(200),
            };
            const compressed = compressLead(lead);
            expect(compressed.description?.length).toBeLessThan(200);
        });

        it("should limit intent signals", () => {
            const lead = {
                company: "Test",
                intentSignals: Array.from({ length: 10 }, (_, i) => ({ id: i })),
            };
            const compressed = compressLead(lead);
            expect(compressed.intentSignals?.length).toBe(CONTEXT_LIMITS.maxIntentSignalsPerLead);
        });
    });

    describe("compressResponse", () => {
        it("should truncate large leads arrays", () => {
            const response = {
                leads: Array.from({ length: 100 }, (_, i) => ({
                    company: `Company ${i}`,
                    email: `test${i}@example.com`,
                })),
            };
            const compressed = compressResponse(response);
            expect(compressed.leads?.length).toBeLessThanOrEqual(CONTEXT_LIMITS.maxLeadsInResponse);
        });

        it("should preserve small arrays", () => {
            const response = {
                leads: [{ company: "Acme", email: "test@acme.com" }],
            };
            const compressed = compressResponse(response);
            expect(compressed.leads?.length).toBe(1);
        });

        it("should add totalCount for truncated arrays", () => {
            const response = {
                leads: Array.from({ length: 100 }, (_, i) => ({
                    company: `Company ${i}`,
                    email: `test${i}@example.com`,
                })),
            };
            const compressed = compressResponse(response) as Record<string, unknown>;
            expect(compressed.leadsTotalCount).toBe(100);
        });
    });
});
