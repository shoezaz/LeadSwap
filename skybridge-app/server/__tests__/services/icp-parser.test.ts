/**
 * ICP Parser Tests
 */

import { parseICPDescription, generateICPId, formatICPSummary } from "../../src/services/icp-parser.js";

describe("ICP Parser", () => {
  describe("parseICPDescription", () => {
    it("should extract industries from description", () => {
      const result = parseICPDescription("Looking for SaaS and Fintech companies");

      expect(result.industries).toContain("SaaS");
      expect(result.industries).toContain("Fintech");
    });

    it("should extract company size ranges", () => {
      const result = parseICPDescription("Companies with 50-200 employees");

      expect(result.companySizeMin).toBe(50);
      expect(result.companySizeMax).toBe(200);
    });

    it("should extract geographies", () => {
      const result = parseICPDescription("Based in France or UK");

      expect(result.geographies).toContain("France");
      // UK might be extracted as "United Kingdom"
      expect(result.geographies.some(g => g.includes("UK") || g.includes("United Kingdom"))).toBe(true);
    });

    it("should extract job titles", () => {
      const result = parseICPDescription("Targeting VP Sales and Head of Growth");

      expect(result.titles).toContain("VP Sales");
      expect(result.titles).toContain("Head of Growth");
    });

    it("should handle complex descriptions", () => {
      const description =
        "SaaS startups in HealthTech, 20-100 employees, based in Germany or Netherlands, looking for CTO or VP Engineering";

      const result = parseICPDescription(description);

      expect(result.industries).toContain("SaaS");
      expect(result.industries).toContain("HealthTech");
      expect(result.companySizeMin).toBe(20);
      expect(result.companySizeMax).toBe(100);
      expect(result.geographies.length).toBeGreaterThan(0);
    });

    it("should preserve raw description", () => {
      const description = "Any tech company";
      const result = parseICPDescription(description);

      expect(result.rawDescription).toBe(description);
    });
  });

  describe("generateICPId", () => {
    it("should generate unique IDs", () => {
      const id1 = generateICPId();
      const id2 = generateICPId();

      expect(id1).not.toBe(id2);
    });

    it("should start with icp prefix", () => {
      const id = generateICPId();
      expect(id).toMatch(/^icp[_-]/);
    });
  });

  describe("formatICPSummary", () => {
    it("should format ICP as readable summary", () => {
      const icp = {
        id: "icp-123",
        rawDescription: "Test",
        industries: ["SaaS", "Fintech"],
        companySizeMin: 50,
        companySizeMax: 200,
        geographies: ["France"],
        titles: ["VP Sales"],
        keywords: ["B2B"],
        createdAt: new Date(),
      };

      const summary = formatICPSummary(icp);

      expect(summary).toContain("SaaS");
      expect(summary).toContain("Fintech");
      expect(summary).toContain("50");
      expect(summary).toContain("200");
      expect(summary).toContain("France");
    });
  });
});
