import { McpServer } from "skybridge/server";
import { z } from "zod";
import type { ICP, Lead, ScoringResult } from "./types.js";
import { parseICPDescription, generateICPId, formatICPSummary } from "./services/icp-parser.js";
import { scoreLeads, searchLeadsWithICP } from "./services/lead-scorer.js";

// In-memory storage (for MVP - would be replaced with Dust memory later)
let currentICP: ICP | null = null;
let currentLeads: Lead[] = [];
let lastScoringResult: ScoringResult | null = null;

const server = new McpServer(
  {
    name: "leadswap",
    version: "1.0.0",
  },
  { capabilities: {} },
)
  // ====================================
  // Tool 1: Define ICP
  // ====================================
  .registerWidget(
    "define-icp",
    {
      description: "Define your Ideal Customer Profile (ICP)",
    },
    {
      description:
        "Define your ideal customer profile in natural language. Describe your target market including industry, company size, geography, and job titles you want to target.",
      inputSchema: {
        description: z
          .string()
          .describe(
            'Natural language description of your ideal customer. Example: "SaaS startups, 50-200 employees, France or UK, targeting VP Sales or Head of Growth"'
          ),
      },
    },
    async ({ description }) => {
      try {
        const parsed = parseICPDescription(description);
        const icp: ICP = {
          ...parsed,
          id: generateICPId(),
          createdAt: new Date(),
        };

        currentICP = icp;

        return {
          structuredContent: {
            success: true,
            icp: {
              id: icp.id,
              industries: icp.industries,
              companySizeMin: icp.companySizeMin,
              companySizeMax: icp.companySizeMax,
              geographies: icp.geographies,
              titles: icp.titles,
              keywords: icp.keywords,
              summary: formatICPSummary(icp),
            },
          },
          content: [
            {
              type: "text",
              text: `✅ ICP created successfully!\n\n${formatICPSummary(icp)}`,
            },
          ],
          isError: false,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error creating ICP: ${error}` }],
          isError: true,
        };
      }
    }
  )

  // ====================================
  // Tool 2: Upload Leads (CSV data as JSON)
  // ====================================
  .registerWidget(
    "upload-leads",
    {
      description: "Upload leads to score",
    },
    {
      description:
        "Upload a list of leads to score against your ICP. Provide leads as a JSON array with company, email, name, and title fields.",
      inputSchema: {
        leads: z
          .array(
            z.object({
              company: z.string().describe("Company name"),
              email: z.string().optional().describe("Contact email"),
              name: z.string().optional().describe("Contact name"),
              title: z.string().optional().describe("Job title"),
              url: z.string().optional().describe("Company website URL"),
              linkedinUrl: z.string().optional().describe("LinkedIn profile URL"),
            })
          )
          .describe("Array of leads to upload"),
      },
    },
    async ({ leads }) => {
      try {
        if (leads.length < 1) {
          return {
            content: [{ type: "text", text: "Please provide at least 1 lead." }],
            isError: true,
          };
        }

        if (leads.length > 10000) {
          return {
            content: [{ type: "text", text: "Maximum 10,000 leads per upload." }],
            isError: true,
          };
        }

        currentLeads = leads.map((lead, index) => ({
          ...lead,
          id: `lead-${index + 1}`,
        }));

        return {
          structuredContent: {
            success: true,
            leadsCount: currentLeads.length,
            sample: currentLeads.slice(0, 5),
            hasICP: currentICP !== null,
          },
          content: [
            {
              type: "text",
              text: `✅ Uploaded ${currentLeads.length} leads successfully!${
                currentICP
                  ? " Ready to score against your ICP."
                  : " Define an ICP first to score these leads."
              }`,
            },
          ],
          isError: false,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error uploading leads: ${error}` }],
          isError: true,
        };
      }
    }
  )

  // ====================================
  // Tool 3: Score Leads
  // ====================================
  .registerWidget(
    "score-leads",
    {
      description: "Score your uploaded leads against your ICP",
    },
    {
      description:
        "Score all uploaded leads against your defined ICP. Returns leads sorted by score with tier classification (A/B/C).",
      inputSchema: {
        enrichWithExa: z
          .boolean()
          .optional()
          .default(false)
          .describe("Use Exa.ai to enrich leads with additional company data before scoring (slower but more accurate)"),
      },
    },
    async ({ enrichWithExa }) => {
      try {
        if (!currentICP) {
          return {
            content: [
              { type: "text", text: "❌ No ICP defined. Use define-icp first." },
            ],
            isError: true,
          };
        }

        if (currentLeads.length === 0) {
          return {
            content: [
              { type: "text", text: "❌ No leads uploaded. Use upload-leads first." },
            ],
            isError: true,
          };
        }

        const { scoredLeads, tierBreakdown, processingTimeMs } = await scoreLeads(
          currentLeads,
          currentICP,
          { enrichWithExa }
        );

        lastScoringResult = {
          id: `scoring-${Date.now()}`,
          icpId: currentICP.id,
          totalLeads: currentLeads.length,
          scoredLeads,
          tierBreakdown,
          processedAt: new Date(),
          processingTimeMs,
        };

        return {
          structuredContent: {
            success: true,
            totalLeads: scoredLeads.length,
            tierBreakdown,
            topLeads: scoredLeads.slice(0, 10).map((lead) => ({
              company: lead.company,
              name: lead.name,
              title: lead.title,
              email: lead.email,
              score: lead.score,
              tier: lead.tier,
            })),
            processingTimeMs,
          },
          content: [
            {
              type: "text",
              text: `✅ Scored ${scoredLeads.length} leads in ${processingTimeMs}ms\n\n📊 Tier Breakdown:\n• Tier A (80-100): ${tierBreakdown.tierA} leads\n• Tier B (50-79): ${tierBreakdown.tierB} leads\n• Tier C (0-49): ${tierBreakdown.tierC} leads`,
            },
          ],
          isError: false,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error scoring leads: ${error}` }],
          isError: true,
        };
      }
    }
  )

  // ====================================
  // Tool 4: Get Results
  // ====================================
  .registerWidget(
    "get-results",
    {
      description: "View scored leads and results",
    },
    {
      description:
        "Get the results of the last scoring run. Filter by tier or view all leads.",
      inputSchema: {
        tier: z
          .enum(["A", "B", "C", "all"])
          .optional()
          .default("all")
          .describe("Filter by tier (A, B, C) or 'all' for all leads"),
        limit: z
          .number()
          .optional()
          .default(20)
          .describe("Maximum number of leads to return"),
      },
    },
    async ({ tier, limit }) => {
      try {
        if (!lastScoringResult) {
          return {
            content: [
              {
                type: "text",
                text: "❌ No scoring results available. Use score-leads first.",
              },
            ],
            isError: true,
          };
        }

        let leads = lastScoringResult.scoredLeads;
        if (tier !== "all") {
          leads = leads.filter((l) => l.tier === tier);
        }
        leads = leads.slice(0, limit);

        return {
          structuredContent: {
            totalResults: lastScoringResult.totalLeads,
            filteredCount: leads.length,
            tier: tier === "all" ? "All Tiers" : `Tier ${tier}`,
            tierBreakdown: lastScoringResult.tierBreakdown,
            leads: leads.map((lead) => ({
              id: lead.id,
              company: lead.company,
              name: lead.name,
              title: lead.title,
              email: lead.email,
              url: lead.url,
              score: lead.score,
              tier: lead.tier,
              matchDetails: lead.matchDetails,
            })),
          },
          content: [
            {
              type: "text",
              text: `📋 Showing ${leads.length} ${tier === "all" ? "" : `Tier ${tier} `}leads`,
            },
          ],
          isError: false,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error fetching results: ${error}` }],
          isError: true,
        };
      }
    }
  )

  // ====================================
  // Tool 5: Search Leads (via Exa.ai)
  // ====================================
  .registerWidget(
    "search-leads",
    {
      description: "Search for new leads matching your ICP",
    },
    {
      description:
        "Use AI to search the web for companies and contacts matching your ICP definition.",
      inputSchema: {
        numResults: z
          .number()
          .optional()
          .default(10)
          .describe("Number of leads to search for (max 25)"),
      },
    },
    async ({ numResults }) => {
      try {
        if (!currentICP) {
          return {
            content: [
              { type: "text", text: "❌ No ICP defined. Use define-icp first." },
            ],
            isError: true,
          };
        }

        const searchResults = await searchLeadsWithICP(
          currentICP,
          Math.min(numResults, 25)
        );

        // Add to current leads
        const newLeads = searchResults.map((lead, index) => ({
          ...lead,
          id: `search-${Date.now()}-${index}`,
        }));
        currentLeads.push(...newLeads);

        return {
          structuredContent: {
            success: true,
            foundLeads: newLeads.length,
            totalLeads: currentLeads.length,
            leads: newLeads.map((lead) => ({
              company: lead.company,
              url: lead.url,
            })),
          },
          content: [
            {
              type: "text",
              text: `🔍 Found ${newLeads.length} potential leads matching your ICP!\nTotal leads now: ${currentLeads.length}\n\nUse score-leads to score them.`,
            },
          ],
          isError: false,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error searching leads: ${error}` }],
          isError: true,
        };
      }
    }
  )

  // ====================================
  // Tool 6: Get Current Status
  // ====================================
  .registerWidget(
    "status",
    {
      description: "Check current LeadSwap session status",
    },
    {
      description: "Get the current status of your LeadSwap session including ICP, leads, and scoring results.",
      inputSchema: {},
    },
    async () => {
      return {
        structuredContent: {
          hasICP: currentICP !== null,
          icp: currentICP
            ? {
                id: currentICP.id,
                summary: formatICPSummary(currentICP),
              }
            : null,
          leadsCount: currentLeads.length,
          hasResults: lastScoringResult !== null,
          lastScoring: lastScoringResult
            ? {
                totalLeads: lastScoringResult.totalLeads,
                tierBreakdown: lastScoringResult.tierBreakdown,
                processedAt: lastScoringResult.processedAt,
              }
            : null,
        },
        content: [
          {
            type: "text",
            text: `📊 LeadSwap Status:\n\n• ICP: ${currentICP ? "✅ Defined" : "❌ Not defined"}\n• Leads: ${currentLeads.length} uploaded\n• Scoring: ${lastScoringResult ? `✅ ${lastScoringResult.totalLeads} leads scored` : "❌ Not run yet"}`,
          },
        ],
        isError: false,
      };
    }
  );

export default server;
export type AppType = typeof server;
