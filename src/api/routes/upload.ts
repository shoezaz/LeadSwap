/**
 * Upload Routes - Parse and store CSV lead files
 */

import { Router, Request, Response } from "express";
import { parseCSV, formatParseResultForDisplay } from "../../lib/csv-parser";
import type { ValidationLead } from "../../types";

const router = Router();

// In-memory storage for uploaded leads (per user)
const leadStorage: Map<string, ValidationLead[]> = new Map();

/**
 * POST /api/upload
 * Upload and parse a CSV file
 * 
 * Body can be either:
 * - { userId, csvContent: "..." } - raw CSV content
 * - { userId, csvBase64: "..." } - base64 encoded CSV
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const { userId, csvContent, csvBase64 } = req.body;

        if (!userId) {
            return res.status(400).json({
                error: "Missing userId",
                message: "Please provide a userId",
            });
        }

        // Get CSV content
        let content: string;
        if (csvContent) {
            content = csvContent;
        } else if (csvBase64) {
            content = Buffer.from(csvBase64, "base64").toString("utf-8");
        } else {
            return res.status(400).json({
                error: "Missing CSV data",
                message: "Provide either 'csvContent' (raw string) or 'csvBase64' (base64 encoded)",
            });
        }

        // Parse CSV
        const parseResult = parseCSV(content);

        if (!parseResult.success) {
            return res.status(400).json({
                success: false,
                error: "Failed to parse CSV",
                errors: parseResult.errors,
                warnings: parseResult.warnings,
            });
        }

        // Store leads for this user
        leadStorage.set(userId, parseResult.leads);

        return res.json({
            success: true,
            message: `✅ ${parseResult.validRows} leads detected and ready for validation!`,
            displayText: formatParseResultForDisplay(parseResult),
            stats: {
                totalRows: parseResult.totalRows,
                validRows: parseResult.validRows,
                invalidRows: parseResult.invalidRows,
            },
            columnMapping: parseResult.columnMapping,
            warnings: parseResult.warnings,
            // Include sample of first 5 leads for confirmation
            sampleLeads: parseResult.leads.slice(0, 5).map(l => ({
                email: l.email,
                name: l.name,
                company: l.company,
                title: l.title,
            })),
        });
    } catch (err) {
        console.error("[Upload Route] Error:", err);
        return res.status(500).json({
            error: "Internal error",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

/**
 * GET /api/upload/:userId
 * Get the currently uploaded leads for a user
 */
router.get("/:userId", async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;

        const leads = leadStorage.get(userId);

        if (!leads || leads.length === 0) {
            return res.status(404).json({
                error: "No leads found",
                message: `No leads uploaded for user ${userId}. Upload a CSV first with POST /api/upload`,
            });
        }

        return res.json({
            success: true,
            userId,
            leadCount: leads.length,
            sampleLeads: leads.slice(0, 10).map(l => ({
                id: l.id,
                email: l.email,
                name: l.name,
                company: l.company,
                title: l.title,
            })),
        });
    } catch (err) {
        console.error("[Upload Route] Error:", err);
        return res.status(500).json({
            error: "Internal error",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

/**
 * DELETE /api/upload/:userId
 * Clear uploaded leads for a user
 */
router.delete("/:userId", async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;

        const hadLeads = leadStorage.has(userId);
        leadStorage.delete(userId);

        return res.json({
            success: true,
            message: hadLeads
                ? `Cleared leads for user ${userId}`
                : `No leads to clear for user ${userId}`,
        });
    } catch (err) {
        console.error("[Upload Route] Error:", err);
        return res.status(500).json({
            error: "Internal error",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

// Export storage for use by validate routes
export { leadStorage };
export default router;
