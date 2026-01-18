import { McpServer } from "skybridge/server";
import { z } from "zod";
import type { ICP, Lead, ScoringResult } from "./types.js";
import { parseICPDescription, generateICPId, formatICPSummary } from "./services/icp-parser.js";
import {
  compressResponse,
  paginate,
  summarizeLeads,
  CONTEXT_LIMITS
} from "./lib/context-manager.js";
import {
  checkLeadsForDuplicates,
  registerValidatedLeads,
  formatDuplicateStatus,
} from "./services/dedup-service.js";

import { scoreLeads, searchLeadsWithICP } from "./services/lead-scorer.js";
import agentManager from "./services/agent-manager.js";
import { exportLeads, getExportSummary } from "./services/export-service.js";
import { costTracker } from "./services/cost-tracker.js";
import { filterValidatedLeads, formatTierBreakdown } from "./lib/utils.js";

// In-memory storage (for MVP - would be replaced with Dust memory later)
let currentICP: ICP | null = null;
let currentLeads: Lead[] = [];
let lastScoringResult: ScoringResult | null = null;
// Dedup result stored for future dashboard/statistics (US-6.3, US-6.4)
let lastDedupResult: ReturnType<typeof checkLeadsForDuplicates> | null = null;
void lastDedupResult; // Suppress unused warning - used for tracking

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
  // Tool 1b: Modify ICP (US-1.4)
  // ====================================
  .registerWidget(
    "modify-icp",
    {
      description: "Modify your existing ICP criteria",
    },
    {
      description:
        "Update your existing ICP with new criteria. Use natural language to add or change industries, company size, geographies, or job titles. Example: 'Add Series B+ companies' or 'Change size to 200-500 employees'",
      inputSchema: {
        modification: z
          .string()
          .describe(
            'What to change in your ICP. Example: "Add Series B+ companies", "Change size to 200-500 employees", "Target France only"'
          ),
      },
    },
    async ({ modification }) => {
      try {
        if (!currentICP) {
          return {
            content: [
              { type: "text", text: "❌ No ICP defined yet. Use define-icp first." },
            ],
            isError: true,
          };
        }

        // Parse the modification as new ICP criteria
        const modifications = parseICPDescription(modification);

        // Merge with existing ICP
        const updatedICP: ICP = {
          ...currentICP,
          // Merge arrays (add new items, don't replace unless explicit)
          industries: modifications.industries.length > 0
            ? [...new Set([...currentICP.industries, ...modifications.industries])]
            : currentICP.industries,
          geographies: modifications.geographies.length > 0
            ? [...new Set([...currentICP.geographies, ...modifications.geographies])]
            : currentICP.geographies,
          titles: modifications.titles.length > 0
            ? [...new Set([...currentICP.titles, ...modifications.titles])]
            : currentICP.titles,
          keywords: [...new Set([...currentICP.keywords, ...modifications.keywords])],
          // Override size if specified
          companySizeMin: modifications.companySizeMin ?? currentICP.companySizeMin,
          companySizeMax: modifications.companySizeMax ?? currentICP.companySizeMax,
          // Update raw description
          rawDescription: `${currentICP.rawDescription}; ${modification}`,
        };

        currentICP = updatedICP;

        return {
          structuredContent: compressResponse({
            success: true,
            action: "modified",
            changes: modification,
            icp: {
              id: updatedICP.id,
              industries: updatedICP.industries,
              companySizeMin: updatedICP.companySizeMin,
              companySizeMax: updatedICP.companySizeMax,
              geographies: updatedICP.geographies,
              titles: updatedICP.titles,
              keywords: updatedICP.keywords,
              summary: formatICPSummary(updatedICP),
            },
          }),
          content: [
            {
              type: "text",
              text: `✅ ICP updated!\n\n📝 Change: ${modification}\n\n${formatICPSummary(updatedICP)}`,
            },
          ],
          isError: false,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error modifying ICP: ${error}` }],
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

        const leadsWithIds = leads.map((lead, index) => ({
          ...lead,
          id: `lead-${index + 1}`,
        }));

        // Check for duplicates (US-6.2)
        const dedupResult = checkLeadsForDuplicates(leadsWithIds);
        lastDedupResult = dedupResult;

        // Only store new leads for scoring
        currentLeads = dedupResult.newLeads;

        const duplicateMessage = formatDuplicateStatus(dedupResult);

        return {
          structuredContent: compressResponse({
            success: true,
            leadsCount: leads.length,
            newLeadsCount: dedupResult.stats.newCount,
            duplicatesSkipped: dedupResult.stats.duplicateCount,
            savingsFromDedup: dedupResult.stats.savingsEuros,
            sample: currentLeads.slice(0, 5),
            hasICP: currentICP !== null,
            duplicateSummary: dedupResult.duplicates.length > 0 ? {
              tierA: dedupResult.duplicates.filter(d => d.cachedEntry.tier === "A").length,
              tierB: dedupResult.duplicates.filter(d => d.cachedEntry.tier === "B").length,
              tierC: dedupResult.duplicates.filter(d => d.cachedEntry.tier === "C").length,
            } : null,
          }),
          content: [
            {
              type: "text",
              text: `✅ Uploaded ${leads.length} leads!\n\n📊 New leads to score: ${dedupResult.stats.newCount}${duplicateMessage ? `\n${duplicateMessage}` : ""}${currentICP
                ? "\n\nReady to score against your ICP."
                : "\n\nDefine an ICP first to score these leads."
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
          .describe("Use Exa.ai to enrich leads with additional company data (slower but more accurate)"),
        enrichWithLightpanda: z
          .boolean()
          .optional()
          .default(false)
          .describe("Use Lightpanda to scrape company website for tech stack and verification"),
        enrichWithFullEnrich: z
          .boolean()
          .optional()
          .default(false)
          .describe("Use Full Enrich to find verified emails and phone numbers"),
      },
    },
    async ({ enrichWithExa, enrichWithLightpanda, enrichWithFullEnrich }) => {
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

        // Start timer for processing time
        const startTime = Date.now();

        // Filter out leads that have already been scored and validated (US-6.1)
        const validatedLeads = filterValidatedLeads(currentLeads);

        // If no new leads, return early
        if (validatedLeads.length === 0) {
          return {
            content: [
              { type: "text", text: "✅ All uploaded leads have already been scored and validated. No new leads to process." },
            ],
            isError: false,
          };
        }

        const { scoredLeads } = await scoreLeads(
          validatedLeads,
          currentICP,
          { enrichWithExa, enrichWithLightpanda, enrichWithFullEnrich }
        );

        // Calculate costs and ROI
        const leadsProcessed = validatedLeads.length;
        const totalCostCents = costTracker.getCostForLeads("default", leadsProcessed, {
          exa: enrichWithExa,
          lightpanda: enrichWithLightpanda,
          fullenrich: enrichWithFullEnrich,
        });

        const roiStats = costTracker.calculateROI(totalCostCents, leadsProcessed);

        const result: ScoringResult = {
          id: `run-${Date.now()}`,
          icpId: currentICP.id,
          totalLeads: validatedLeads.length,
          scoredLeads: scoredLeads,
          tierBreakdown: {
            tierA: scoredLeads.filter((l) => l.tier === "A").length,
            tierB: scoredLeads.filter((l) => l.tier === "B").length,
            tierC: scoredLeads.filter((l) => l.tier === "C").length,
          },
          processedAt: new Date(),
          processingTimeMs: Date.now() - startTime,
          creditsSaved: lastDedupResult?.stats.savingsEuros || 0,
          roiStats,
        };

        lastScoringResult = result;

        // Register leads for future dedup (US-6.1)
        registerValidatedLeads(scoredLeads);

        // Summarize results for context-aware response
        const summary = summarizeLeads(scoredLeads);

        // Detailed summary with ROI (formatted for display)
        const roiDisplay = `
💰 **ROI Analysis**:
• Manual Cost: €${roiStats.manualCostSavedCurrency} (${roiStats.manualTimeSavedHours}h saved)
• Automated Cost: €${roiStats.automatedCostCurrency}
• Efficiency: ${roiStats.roiMultiplier}x
        `.trim();

        return {
          structuredContent: compressResponse({
            success: true,
            totalLeads: result.totalLeads,
            tierBreakdown: result.tierBreakdown,
            creditsSaved: result.creditsSaved,
            roiStats: result.roiStats,
            summary: summary,
            // Don't include full leads array - use get-results for pagination
            hint: scoredLeads.length > CONTEXT_LIMITS.maxLeadsInResponse
              ? `Use get-results with page/limit to view all ${scoredLeads.length} leads`
              : undefined,
          }),
          content: [
            {
              type: "text",
              text: `✅ Processed ${result.totalLeads} leads in ${Math.round(result.processingTimeMs / 1000)}s\n\n${formatTierBreakdown(result.tierBreakdown)}\n\n${roiDisplay}\n\n💡 Top Companies:\n${summary.topCompanies.map(c => `• ${c}`).join("\n")}\n\nℹ️ Use 'get-results' to see full details.`,
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
  // Tool 5: Get Lead Details (US-5.3)
  // ====================================
  .registerWidget(
    "get-lead-details",
    {
      description: "View full details and enrichment data for a specific lead",
    },
    {
      description:
        "Get comprehensive details for a specific lead ID. Returns all available data including intent signals, company info, and match explanation.",
      inputSchema: {
        leadId: z.string().describe("ID of the lead to view (e.g. 'lead-1')"),
      },
    },
    async ({ leadId }) => {
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

        const lead = lastScoringResult.scoredLeads.find((l) => l.id === leadId);

        if (!lead) {
          return {
            content: [
              { type: "text", text: `❌ Lead with ID '${leadId}' not found.` },
            ],
            isError: true,
          };
        }

        // Return full lead details
        return {
          structuredContent: {
            success: true,
            lead: lead,
          },
          content: [
            {
              type: "text",
              text: `🏢 **${lead.company}** (Score: ${lead.score})\n\n👤 **Contact**: ${lead.name || "N/A"} (${lead.title || "N/A"})\n📧 **Email**: ${lead.email || "N/A"}\n🌐 **Website**: ${lead.url || "N/A"}\n\n📊 **Analysis**:\n${(lead as any).matchDetails?.explanation || "No analysis available."}\n\n🎯 **Intent Signals**:\n${(lead as any).intentSignals?.map((s: any) => `${s?.emoji || "•"} **${s?.type}**: ${s?.description}`).join("\n") || "None detected."}`,
            },
          ],
          isError: false,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error fetching lead details: ${error}` }],
          isError: true,
        };
      }
    }
  )


  // ====================================
  // Tool 6: Contextual Help (US-9.4)
  // ====================================
  .registerWidget(
    "get-help",
    {
      description: "Get help on how to use LeadSwap",
    },
    {
      description:
        "Get a guide on available tools and workflows. Use this if you are stuck or want to know what you can do.",
      inputSchema: {
        topic: z.enum(["general", "onboarding", "upload", "validation", "export"]).optional().describe("Specific topic to get help on"),
      },
    },
    async ({ topic = "general" }) => {
      const helpContent = {
        general: `
👋 **Welcome to LeadSwap!**
I can help you define your ICP, upload leads, and validate them using AI.

**Workflow:**
1. **Define ICP**: Tell me about your ideal customer (or use 'define-icp').
2. **Upload Leads**: Upload a CSV or list of leads ('upload-leads').
3. **Validate**: I'll score them against your ICP and find intent signals.
4. **Explore**: Use 'get-results' or 'get-lead-details'.
5. **Export**: Export validated leads to CSV/JSON ('export-leads').

**Available Tools:**
- \`define-icp\`: Create your Ideal Customer Profile
- \`modify-icp\`: Update your ICP criteria
- \`upload-leads\`: Upload leads for processing
- \`get-results\`: View scoring results
- \`get-lead-details\`: Deep dive into a specific lead
- \`export-leads\`: Download your data
        `.trim(),

        onboarding: `
**Defining your ICP:**
- Be specific about **Industry**, **Company Size**, and **Geography**.
- Mention **Job Titles** you target.
- Example: "SaaS startups in France, 50-200 employees, targeting VP Sales"
- Use \`modify-icp\` to tweak criteria later (e.g., "Add Germany").
        `.trim(),

        upload: `
**Uploading Leads:**
- I accept JSON arrays of leads.
- Required fields: \`company\`
- Recommended: \`email\`, \`linkedinUrl\`, \`website\`, \`name\`, \`title\`
- I automatically **deduplicate** leads to save you credits!
        `.trim(),

        validation: `
**Validation & Scoring:**
- I use Exa.ai to enrich company data.
- I score leads from 0-100 based on your ICP.
- I detect **Intent Signals** like funding, hiring, and tech stack.
- I calculate **ROI** to show your savings vs manual research.
        `.trim(),

        export: `
**Exporting Data:**
- Export to **CSV** or **JSON**.
- Filter by Tier (A, B, C).
- Use \`includeTier='A'\` to get only your best leads.
- CSVs include match explanation and intent signals.
        `.trim(),
      };

      return {
        content: [
          {
            type: "text",
            text: helpContent[topic as keyof typeof helpContent] || helpContent.general,
          },
        ],
        isError: false,
      };
    }
  )

  // ====================================
  // Tool 4: Get Results (with pagination)
  // ====================================
  .registerWidget(
    "get-results",
    {
      description: "View scored leads and results with pagination",
    },
    {
      description:
        "Get the results of the last scoring run. Filter by tier and use pagination for large result sets.",
      inputSchema: {
        tier: z
          .enum(["A", "B", "C", "all"])
          .optional()
          .default("all")
          .describe("Filter by tier (A, B, C) or 'all' for all leads"),
        page: z
          .number()
          .optional()
          .default(1)
          .describe("Page number for pagination (default: 1)"),
        limit: z
          .number()
          .optional()
          .default(20)
          .describe(`Items per page (max: ${CONTEXT_LIMITS.maxPageSize})`),
      },
    },
    async ({ tier, page, limit }) => {
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

        // Use pagination from context manager
        const paginatedResult = paginate(leads, page ?? 1, limit ?? CONTEXT_LIMITS.defaultPageSize);

        // Compress the leads in response
        const compressedLeads = paginatedResult.items.map((lead) => ({
          id: lead.id,
          company: lead.company,
          name: lead.name,
          title: lead.title,
          email: lead.email,
          score: lead.score,
          tier: lead.tier,
          // Exclude verbose matchDetails to save context
        }));

        return {
          structuredContent: compressResponse({
            totalResults: lastScoringResult.totalLeads,
            filteredTotal: leads.length,
            tier: tier === "all" ? "All Tiers" : `Tier ${tier}`,
            tierBreakdown: lastScoringResult.tierBreakdown,
            pagination: {
              page: paginatedResult.page,
              pageSize: paginatedResult.pageSize,
              totalPages: paginatedResult.totalPages,
              hasNextPage: paginatedResult.hasNextPage,
              hasPreviousPage: paginatedResult.hasPreviousPage,
            },
            leads: compressedLeads,
          }),
          content: [
            {
              type: "text",
              text: `📋 Showing ${compressedLeads.length} ${tier === "all" ? "" : `Tier ${tier} `}leads (page ${paginatedResult.page}/${paginatedResult.totalPages})${paginatedResult.hasNextPage ? `\n\n💡 Use page=${paginatedResult.page + 1} to see more` : ""}`,
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
  )

  // ====================================
  // Tool 7: Agent Manager
  // ====================================
  .registerWidget(
    "agent-manager",
    {
      description: "View and manage the multi-agent orchestration system",
    },
    {
      description: "Get the current status of the Agent Manager including all agents, task queue, and statistics.",
      inputSchema: {},
    },
    async () => {
      const poolStatus = agentManager.getPoolStatus();
      const stats = agentManager.getAgentStatistics();

      return {
        structuredContent: {
          agents: poolStatus.agents,
          taskQueue: poolStatus.taskQueue,
          stats,
        },
        content: [
          {
            type: "text",
            text: `🤖 Agent Manager Status:\n\n• Total Agents: ${stats.totalAgents}\n• Idle: ${stats.idleAgents} | Running: ${stats.runningAgents}\n• Completed Tasks: ${stats.totalTasksCompleted}\n• Queued Tasks: ${stats.queuedTasks}`,
          },
        ],
        isError: false,
      };
    }
  )

  // ====================================
  // Tool 8: Export Leads
  // ====================================
  .registerWidget(
    "export-leads",
    {
      description: "Export scored leads to CSV or JSON",
    },
    {
      description: "Export your scored leads to CSV or JSON format for use in CRM systems or further analysis.",
      inputSchema: {
        format: z
          .enum(["csv", "json"])
          .optional()
          .default("csv")
          .describe("Export format (csv or json)"),
        tier: z
          .enum(["all", "A", "B", "C"])
          .optional()
          .default("all")
          .describe("Filter by tier (A, B, C) or 'all' for all leads"),
        includeEnrichment: z
          .boolean()
          .optional()
          .default(true)
          .describe("Include enrichment data in export"),
        hubspotCompatibility: z
          .boolean()
          .optional()
          .default(false)
          .describe("Format CSV compatibility with HubSpot Import"),
      },
    },
    async ({ format, tier, includeEnrichment, hubspotCompatibility }) => {
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

        const exportResult = exportLeads(lastScoringResult.scoredLeads, {
          format: format || "csv",
          includeTier: tier || "all",
          includeMetadata: true,
          includeMatchDetails: true,
          includeEnrichmentData: includeEnrichment !== false,
          hubspotCompatibility,
        });

        const summary = getExportSummary(lastScoringResult.scoredLeads);

        return {
          structuredContent: {
            success: exportResult.success,
            format: exportResult.format,
            downloadUrl: `data:${format === "csv" ? "text/csv" : "application/json"};charset=utf-8,${encodeURIComponent(exportResult.content)}`,
            filename: exportResult.filename,
            leadsCount: exportResult.leadsCount,
            summary,
          },
          content: [
            {
              type: "text",
              text: `✅ Export ready!\n\n📥 ${exportResult.leadsCount} leads exported to ${format?.toUpperCase()}\n📄 Filename: ${exportResult.filename}\n\nDownload the file to import into your CRM.`,
            },
          ],
          isError: false,
        };
      } catch (error) {
        return {
          content: [{ type: "text", text: `Error exporting leads: ${error}` }],
          isError: true,
        };
      }
    }
  );

export default server;
export type AppType = typeof server;
