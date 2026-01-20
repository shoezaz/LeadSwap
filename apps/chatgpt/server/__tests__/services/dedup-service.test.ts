import {
    generateLeadHash,
    checkDuplicate,
    registerValidatedLead,
    checkLeadsForDuplicates,
    registerValidatedLeads,
    getDedupStats,
    clearDedupStore,
    formatDuplicateStatus,
    DEDUP_CONFIG,
} from "../../src/services/dedup-service.js";
import type { Lead, ScoredLead } from "../../src/types.js";

describe("Dedup Service", () => {
    beforeEach(() => {
        clearDedupStore();
    });

    describe("generateLeadHash", () => {
        it("should generate consistent hash for same lead", () => {
            const lead: Lead = {
                id: "1",
                company: "Acme Inc",
                email: "john@acme.com",
            };
            const hash1 = generateLeadHash(lead);
            const hash2 = generateLeadHash(lead);
            expect(hash1).toBe(hash2);
        });

        it("should generate different hashes for different emails", () => {
            const lead1: Lead = { id: "1", company: "Acme", email: "john@acme.com" };
            const lead2: Lead = { id: "2", company: "Acme", email: "jane@acme.com" };
            expect(generateLeadHash(lead1)).not.toBe(generateLeadHash(lead2));
        });

        it("should normalize email to lowercase", () => {
            const lead1: Lead = { id: "1", company: "Acme", email: "John@Acme.com" };
            const lead2: Lead = { id: "2", company: "Acme", email: "john@acme.com" };
            expect(generateLeadHash(lead1)).toBe(generateLeadHash(lead2));
        });

        it("should use URL domain if provided", () => {
            const lead1: Lead = { id: "1", company: "Acme", url: "https://acme.com" };
            const lead2: Lead = { id: "2", company: "Acme", url: "https://acme.com/about" };
            // Same domain should produce same hash
            expect(generateLeadHash(lead1)).toBe(generateLeadHash(lead2));
        });
    });

    describe("checkDuplicate", () => {
        it("should return null for new lead", () => {
            const lead: Lead = { id: "1", company: "Acme", email: "john@acme.com" };
            expect(checkDuplicate(lead)).toBeNull();
        });

        it("should return cached entry for registered lead", () => {
            const scoredLead: ScoredLead = {
                id: "1",
                company: "Acme",
                email: "john@acme.com",
                score: 85,
                tier: "A",
                matchDetails: { score: 85, breakdown: {} },
            };
            registerValidatedLead(scoredLead);

            const lead: Lead = { id: "2", company: "Acme", email: "john@acme.com" };
            const cached = checkDuplicate(lead);

            expect(cached).not.toBeNull();
            expect(cached?.tier).toBe("A");
            expect(cached?.score).toBe(85);
        });
    });

    describe("checkLeadsForDuplicates", () => {
        it("should separate new leads from duplicates", () => {
            // Register some leads first
            const existingLeads: ScoredLead[] = [
                { id: "1", company: "Acme", email: "a@acme.com", score: 90, tier: "A", matchDetails: { score: 90, breakdown: {} } },
                { id: "2", company: "Globex", email: "b@globex.com", score: 60, tier: "B", matchDetails: { score: 60, breakdown: {} } },
            ];
            registerValidatedLeads(existingLeads);

            // Check a batch that includes some duplicates
            const newBatch: Lead[] = [
                { id: "3", company: "Acme", email: "a@acme.com" }, // duplicate
                { id: "4", company: "NewCo", email: "new@newco.com" }, // new
                { id: "5", company: "Globex", email: "b@globex.com" }, // duplicate
                { id: "6", company: "Fresh", email: "fresh@fresh.io" }, // new
            ];

            const result = checkLeadsForDuplicates(newBatch);

            expect(result.newLeads.length).toBe(2);
            expect(result.duplicates.length).toBe(2);
            expect(result.stats.newCount).toBe(2);
            expect(result.stats.duplicateCount).toBe(2);
        });

        it("should calculate savings correctly", () => {
            const lead: ScoredLead = {
                id: "1",
                company: "Acme",
                email: "a@acme.com",
                score: 80,
                tier: "A",
                matchDetails: { score: 80, breakdown: {} },
            };
            registerValidatedLead(lead);

            const batch: Lead[] = [
                { id: "2", company: "Acme", email: "a@acme.com" },
                { id: "3", company: "Acme", email: "a@acme.com" },
            ];

            const result = checkLeadsForDuplicates(batch);
            expect(result.stats.savingsEuros).toBe(2 * DEDUP_CONFIG.creditValuePerDuplicate);
        });
    });

    describe("getDedupStats", () => {
        it("should return correct statistics", () => {
            const leads: ScoredLead[] = [
                { id: "1", company: "A", email: "a@a.com", score: 90, tier: "A", matchDetails: { score: 90, breakdown: {} } },
                { id: "2", company: "B", email: "b@b.com", score: 85, tier: "A", matchDetails: { score: 85, breakdown: {} } },
                { id: "3", company: "C", email: "c@c.com", score: 60, tier: "B", matchDetails: { score: 60, breakdown: {} } },
                { id: "4", company: "D", email: "d@d.com", score: 30, tier: "C", matchDetails: { score: 30, breakdown: {} } },
            ];
            registerValidatedLeads(leads);

            const stats = getDedupStats();
            expect(stats.totalEntries).toBe(4);
            expect(stats.entriesByTier.tierA).toBe(2);
            expect(stats.entriesByTier.tierB).toBe(1);
            expect(stats.entriesByTier.tierC).toBe(1);
        });
    });

    describe("formatDuplicateStatus", () => {
        it("should return empty string when no duplicates", () => {
            const result = { newLeads: [], duplicates: [], stats: { totalChecked: 0, newCount: 0, duplicateCount: 0, savingsEuros: 0 } };
            expect(formatDuplicateStatus(result)).toBe("");
        });

        it("should format message with tier breakdown", () => {
            const result = checkLeadsForDuplicates([]);
            // Manually construct for test
            const mockResult = {
                newLeads: [],
                duplicates: [
                    { lead: { id: "1", company: "A" }, cachedEntry: { hash: "x", leadId: "1", tier: "A" as const, score: 90, validatedAt: new Date(), expiresAt: new Date() } },
                    { lead: { id: "2", company: "B" }, cachedEntry: { hash: "y", leadId: "2", tier: "B" as const, score: 60, validatedAt: new Date(), expiresAt: new Date() } },
                ],
                stats: { totalChecked: 2, newCount: 0, duplicateCount: 2, savingsEuros: 1.0 },
            };

            const message = formatDuplicateStatus(mockResult);
            expect(message).toContain("2 leads already validated");
            expect(message).toContain("Tier A: 1");
            expect(message).toContain("Tier B: 1");
            expect(message).toContain("€1.00");
        });
    });
});
