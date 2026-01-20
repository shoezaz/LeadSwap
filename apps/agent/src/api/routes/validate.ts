/**
 * Validate Routes - Validate leads against ICP and return scored results
 */

import { Router, Request, Response, IRouter } from "express";
import { getICP } from "../../dust/memory";
import { scoreLeads, formatResultForDisplay } from "../../validation/scorer";
import { leadStorage } from "./upload";
import type { ValidationResult } from "../../types";

const router: IRouter = Router();

// In-memory storage for validation results
const resultStorage: Map<string, ValidationResult> = new Map();

/**
 * POST /api/validate
 * Validate leads against ICP
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                error: "Missing userId",
                message: "Please provide a userId",
            });
        }

        // Get ICP
        const icp = await getICP(userId);
        if (!icp) {
            return res.status(400).json({
                error: "No ICP defined",
                message: "Please define an ICP first with POST /api/icp",
            });
        }

        // Get leads
        const leads = leadStorage.get(userId);
        if (!leads || leads.length === 0) {
            return res.status(400).json({
                error: "No leads uploaded",
                message: "Please upload a CSV first with POST /api/upload",
            });
        }

        console.log(`[Validate] Starting validation of ${leads.length} leads for user ${userId}`);

        // Score leads
        const result = await scoreLeads(
            leads,
            icp,
            userId,
            (current, total, lead) => {
                console.log(`[Validate] Progress: ${current}/${total} - ${lead}`);
            }
        );

        // Store result
        resultStorage.set(result.id, result);

        // Also store by userId for easy retrieval
        resultStorage.set(`user:${userId}`, result);

        console.log(`[Validate] Completed validation: ${result.stats.tier1Count} Tier1, ${result.stats.tier2Count} Tier2, ${result.stats.rejectedCount} Rejected`);

        return res.json({
            success: true,
            resultId: result.id,
            displayText: formatResultForDisplay(result),
            summary: {
                tier1: {
                    count: result.stats.tier1Count,
                    percentage: result.stats.tier1Percentage,
                },
                tier2: {
                    count: result.stats.tier2Count,
                    percentage: result.stats.tier2Percentage,
                },
                rejected: {
                    count: result.stats.rejectedCount,
                    percentage: result.stats.rejectedPercentage,
                },
                avgScore: result.stats.avgScore,
                processingTimeMs: result.stats.processingTimeMs,
                creditsSaved: result.creditsSaved,
            },
            patterns: result.patterns,
            recommendations: result.recommendations,
        });
    } catch (err) {
        console.error("[Validate Route] Error:", err);
        return res.status(500).json({
            error: "Internal error",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

/**
 * GET /api/validate/results/:id
 * Get validation results by ID
 */
router.get("/results/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { tier, format } = req.query;

        const result = resultStorage.get(id);
        if (!result) {
            return res.status(404).json({
                error: "Result not found",
                message: `No validation result found with ID ${id}`,
            });
        }

        // Filter by tier if requested
        let leads;
        if (tier === "tier1") {
            leads = result.tier1;
        } else if (tier === "tier2") {
            leads = result.tier2;
        } else if (tier === "rejected") {
            leads = result.rejected;
        } else {
            leads = [...result.tier1, ...result.tier2, ...result.rejected];
        }

        // Format response
        if (format === "csv") {
            const csv = generateCSV(leads);
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", `attachment; filename="leads-${tier || "all"}.csv"`);
            return res.send(csv);
        }

        return res.json({
            success: true,
            resultId: result.id,
            tier: tier || "all",
            leadCount: leads.length,
            leads: leads.map(l => ({
                id: l.id,
                email: l.email,
                name: l.name,
                company: l.company,
                title: l.title,
                score: l.score,
                tier: l.tier,
                reasoning: l.reasoning,
                intentSignals: l.intentSignals,
            })),
            stats: result.stats,
        });
    } catch (err) {
        console.error("[Validate Route] Error:", err);
        return res.status(500).json({
            error: "Internal error",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

/**
 * GET /api/validate/user/:userId
 * Get latest validation results for a user
 */
router.get("/user/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const result = resultStorage.get(`user:${userId}`);
        if (!result) {
            return res.status(404).json({
                error: "No results found",
                message: `No validation results for user ${userId}. Run validation first with POST /api/validate`,
            });
        }

        return res.json({
            success: true,
            displayText: formatResultForDisplay(result),
            resultId: result.id,
            stats: result.stats,
            patterns: result.patterns,
            recommendations: result.recommendations,
            creditsSaved: result.creditsSaved,
        });
    } catch (err) {
        console.error("[Validate Route] Error:", err);
        return res.status(500).json({
            error: "Internal error",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

/**
 * GET /api/validate/export/:id
 * Export validation results as CSV
 */
router.get("/export/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const { tier } = req.query;

        const result = resultStorage.get(id);
        if (!result) {
            return res.status(404).json({
                error: "Result not found",
            });
        }

        let leads;
        if (tier === "tier1") {
            leads = result.tier1;
        } else if (tier === "tier2") {
            leads = result.tier2;
        } else if (tier === "both" || tier === "qualified") {
            leads = [...result.tier1, ...result.tier2];
        } else {
            leads = [...result.tier1, ...result.tier2, ...result.rejected];
        }

        const csv = generateCSV(leads);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="leadswap-${tier || "all"}-${result.id}.csv"`);
        return res.send(csv);
    } catch (err) {
        console.error("[Validate Route] Error:", err);
        return res.status(500).json({
            error: "Internal error",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

/**
 * Generate CSV from scored leads
 */
function generateCSV(leads: any[]): string {
    if (leads.length === 0) return "";

    const headers = [
        "email",
        "name",
        "company",
        "title",
        "score",
        "tier",
        "icp_match_score",
        "validation_bonus",
        "intent_boost",
        "intent_signals",
        "linkedin_url",
        "website",
        "validated_at",
    ];

    const rows = leads.map(lead => [
        lead.email,
        lead.name,
        lead.company,
        lead.title || "",
        lead.score,
        lead.tier,
        lead.icpMatchScore,
        lead.validationBonus,
        lead.intentBoost,
        lead.intentSignals?.map((s: any) => `${s.emoji} ${s.description}`).join("; ") || "",
        lead.linkedinUrl || "",
        lead.website || "",
        lead.validatedAt?.toISOString() || "",
    ]);

    const csvRows = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ];

    return csvRows.join("\n");
}

export default router;
