import { exportLeads } from "../src/services/export-service.js";
import type { ScoredLead } from "../src/types.js";

const mockLead: ScoredLead = {
    id: "test-1",
    company: "Stripe",
    name: "Patrick Collison",
    email: "patrick@stripe.com",
    title: "CEO",
    score: 95,
    tier: "A",
    url: "stripe.com",
    matchDetails: {
        industryMatch: 30,
        sizeMatch: 20,
        geoMatch: 20,
        titleMatch: 20,
        keywordMatch: 5
    },
    enrichmentData: {
        companyDescription: "Financial infrastructure platform.",
        industry: "Fintech",
        employeeCount: 4000,
        website: "https://stripe.com",
        techStack: ["React", "Stripe", "AWS"],
        socialLinks: {
            linkedin: "https://linkedin.com/company/stripe",
            twitter: "https://x.com/stripe"
        }
    }
};

const leads = [mockLead];

console.log("--- Testing Standard Export ---");
const standard = exportLeads(leads, { format: "csv" });
console.log(standard.content);

console.log("\n--- Testing HubSpot Export ---");
const hubspot = exportLeads(leads, { format: "csv", hubspotCompatibility: true });
console.log(hubspot.content);
