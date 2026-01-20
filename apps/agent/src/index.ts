import { searchLeads, findSimilarCompanies } from "./lib/exa";
import { visitAndScrape } from "./lib/lightpanda";
import type { Lead, EnrichedLead, AgentRunResult } from "./types";
import dotenv from "dotenv";

dotenv.config();

async function enrichLead(lead: Lead): Promise<EnrichedLead> {
  const scrapeResult = await visitAndScrape(lead.url);

  if (!scrapeResult) {
    return {
      ...lead,
      verified: false,
      emails: [],
      techStack: [],
      socialLinks: {},
      enrichedAt: new Date(),
    };
  }

  return {
    ...lead,
    verified: true,
    pageTitle: scrapeResult.title,
    emails: scrapeResult.emails,
    techStack: scrapeResult.techStack,
    socialLinks: scrapeResult.socialLinks,
    contentSnippet: scrapeResult.rawContent?.substring(0, 500),
    enrichedAt: new Date(),
  };
}

async function runAgent(query: string, numResults: number = 5): Promise<AgentRunResult> {
  const startedAt = new Date();
  console.log(`\n🚀 LeadSwap Agent Starting...`);
  console.log(`📝 Query: "${query}"`);
  console.log(`🎯 Target: ${numResults} leads\n`);

  // Search Phase
  const leads = await searchLeads({ query, numResults });
  console.log(`🔍 Found ${leads.length} potential leads from Exa\n`);

  // Enrichment Phase
  const enrichedLeads: EnrichedLead[] = [];
  let verified = 0;
  let failed = 0;

  for (const lead of leads) {
    console.log(`-----------------------------------`);
    console.log(`📊 Analyzing: ${lead.title}`);
    console.log(`   URL: ${lead.url}`);

    const enriched = await enrichLead(lead);
    enrichedLeads.push(enriched);

    if (enriched.verified) {
      verified++;
      console.log(`   ✅ Verified`);
      if (enriched.emails.length > 0) {
        console.log(`   📧 Emails: ${enriched.emails.join(", ")}`);
      }
      if (enriched.techStack.length > 0) {
        console.log(`   🛠️  Tech Stack: ${enriched.techStack.join(", ")}`);
      }
      if (Object.keys(enriched.socialLinks).length > 0) {
        console.log(`   🔗 Social: ${JSON.stringify(enriched.socialLinks)}`);
      }
    } else {
      failed++;
      console.log(`   ❌ Failed to verify`);
    }
  }

  const completedAt = new Date();

  return {
    query,
    leads: enrichedLeads,
    startedAt,
    completedAt,
    stats: {
      found: leads.length,
      verified,
      failed,
    },
  };
}

function printSummary(result: AgentRunResult): void {
  console.log(`\n===================================`);
  console.log(`🏁 AGENT RUN COMPLETE`);
  console.log(`===================================`);
  console.log(`📊 Stats:`);
  console.log(`   • Found: ${result.stats.found}`);
  console.log(`   • Verified: ${result.stats.verified}`);
  console.log(`   • Failed: ${result.stats.failed}`);
  console.log(`   • Duration: ${result.completedAt.getTime() - result.startedAt.getTime()}ms`);

  const verifiedLeads = result.leads.filter((l) => l.verified);
  if (verifiedLeads.length > 0) {
    console.log(`\n📋 Verified Leads:`);
    verifiedLeads.forEach((lead, i) => {
      console.log(`\n${i + 1}. ${lead.title}`);
      console.log(`   URL: ${lead.url}`);
      if (lead.emails.length > 0) console.log(`   Emails: ${lead.emails.join(", ")}`);
      if (lead.techStack.length > 0) console.log(`   Tech: ${lead.techStack.join(", ")}`);
    });
  }
}

// Main execution
async function main() {
  const query = process.argv[2] || "SaaS startups in France dealing with GreenTech";
  const numResults = parseInt(process.argv[3] || "5", 10);

  try {
    const result = await runAgent(query, numResults);
    printSummary(result);
  } catch (err) {
    console.error("❌ Agent error:", err);
    process.exit(1);
  }
}

main();
