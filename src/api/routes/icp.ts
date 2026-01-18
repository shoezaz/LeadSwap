/**
 * ICP Routes - Manage Ideal Customer Profiles
 */

import { Router, Request, Response } from "express";
import { parseICP, buildExaQueryFromICP } from "../../lib/icp-parser";
import { saveICP, getICP, updateICP, formatICPForDisplay } from "../../dust/memory";
import type { ICP } from "../../types/icp";

const router = Router();

/**
 * POST /api/icp
 * Define an ICP from natural language input
 */
router.post("/", async (req: Request, res: Response) => {
    try {
        const { userId, input } = req.body;

        if (!userId) {
            return res.status(400).json({
                error: "Missing userId",
                message: "Please provide a userId to associate with this ICP",
            });
        }

        if (!input) {
            return res.status(400).json({
                error: "Missing input",
                message: "Please provide a natural language description of your ICP",
            });
        }

        // Parse the natural language input
        const parseResult = parseICP(input, userId);

        if (!parseResult.success) {
            return res.status(400).json({
                error: "Failed to parse ICP",
                message: "Could not understand the ICP description",
                warnings: parseResult.warnings,
            });
        }

        // Save to memory
        const savedICP = await saveICP(userId, parseResult.icp!);

        // Generate Exa query for display
        const exaQuery = buildExaQueryFromICP(savedICP);

        return res.json({
            success: true,
            message: "ICP defined successfully",
            icp: savedICP,
            displayText: formatICPForDisplay(savedICP),
            exaQuery,
            confidence: parseResult.confidence,
            parsedFields: parseResult.parsedFields,
            warnings: parseResult.warnings,
        });
    } catch (err) {
        console.error("[ICP Route] Error:", err);
        return res.status(500).json({
            error: "Internal error",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

/**
 * GET /api/icp/:userId
 * Get the ICP for a user
 */
router.get("/:userId", async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;

        const icp = await getICP(userId);

        if (!icp) {
            return res.status(404).json({
                error: "ICP not found",
                message: `No ICP defined for user ${userId}. Define one first with POST /api/icp`,
            });
        }

        return res.json({
            success: true,
            icp,
            displayText: formatICPForDisplay(icp),
            exaQuery: buildExaQueryFromICP(icp),
        });
    } catch (err) {
        console.error("[ICP Route] Error:", err);
        return res.status(500).json({
            error: "Internal error",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

/**
 * PATCH /api/icp/:userId
 * Update an existing ICP
 */
router.patch("/:userId", async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId as string;
        const { input, changes } = req.body;

        // Check if ICP exists
        const existing = await getICP(userId);
        if (!existing) {
            return res.status(404).json({
                error: "ICP not found",
                message: `No ICP defined for user ${userId}`,
            });
        }

        let updatedICP: ICP | null;

        if (input) {
            // Parse new input and merge
            const parseResult = parseICP(input, userId);
            if (parseResult.icp) {
                updatedICP = await updateICP(userId, parseResult.icp);
            } else {
                return res.status(400).json({
                    error: "Failed to parse update",
                    warnings: parseResult.warnings,
                });
            }
        } else if (changes) {
            // Direct changes
            updatedICP = await updateICP(userId, changes);
        } else {
            return res.status(400).json({
                error: "Missing input or changes",
                message: "Provide either 'input' (natural language) or 'changes' (object)",
            });
        }

        if (!updatedICP) {
            return res.status(500).json({
                error: "Update failed",
            });
        }

        return res.json({
            success: true,
            message: "ICP updated successfully",
            icp: updatedICP,
            displayText: formatICPForDisplay(updatedICP),
        });
    } catch (err) {
        console.error("[ICP Route] Error:", err);
        return res.status(500).json({
            error: "Internal error",
            message: err instanceof Error ? err.message : "Unknown error",
        });
    }
});

export default router;
