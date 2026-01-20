"use server";

import { throwIfAIUsageExceeded } from "@/lib/api/links/usage-checks";
import { REJECT_BOUNTY_SUBMISSION_REASONS } from "@/lib/zod/schemas/bounties";
import { prisma } from "@leadswap/prisma";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";
import { authActionClient } from "../safe-action";

const rejectionReasonSchema = z.enum([
  "invalidProof",
  "duplicateSubmission",
  "outOfTimeWindow",
  "didNotMeetCriteria",
  "other",
]);

const schema = z.object({
  workspaceId: z.string(),
  mode: z.enum(["generate", "improve"]),
  instructions: z.string().trim().max(2000).optional(),
  rejectionReason: rejectionReasonSchema.optional(),
  bountyName: z.string().trim().max(200).optional(),
  current: z
    .object({
      rejectionNote: z.string().trim().max(500).nullable().optional(),
    })
    .optional(),
});

const outputSchema = z.object({
  rejectionNote: z.string().trim().max(500),
});

export const generateRejectionNoteAction = authActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx }) => {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("AI is not configured (missing ANTHROPIC_API_KEY).");
    }

    const { workspace } = ctx;
    throwIfAIUsageExceeded(workspace);

    const { mode, instructions, rejectionReason, bountyName, current } =
      parsedInput;

    const reasonLabel = rejectionReason
      ? REJECT_BOUNTY_SUBMISSION_REASONS[rejectionReason]
      : null;

    const promptParts = [
      `You are an affiliate program manager writing a short, polite bounty submission rejection note.`,
      `Write in English.`,
      ``,
      `Task: ${mode === "generate" ? "Generate" : "Improve"} the rejection note.`,
      bountyName ? `Bounty: ${bountyName}` : null,
      reasonLabel ? `Rejection reason: ${reasonLabel}` : null,
      ``,
      `Constraints:`,
      `- 1–4 short sentences, clear and respectful.`,
      `- Optional: include 1 actionable suggestion for next submission.`,
      `- Max 500 characters.`,
      `- Do not mention AI.`,
      ``,
      instructions?.trim()
        ? `Additional instructions: ${instructions.trim()}`
        : null,
      ``,
      mode === "improve"
        ? `Current note to improve:\n${JSON.stringify(
            { rejectionNote: current?.rejectionNote ?? "" },
            null,
            2,
          )}`
        : `Current note (may be empty):\n${JSON.stringify(
            { rejectionNote: current?.rejectionNote ?? "" },
            null,
            2,
          )}`,
      ``,
      `Return JSON: { "rejectionNote": "..." }`,
    ].filter(Boolean);

    let result;
    try {
      result = await generateObject({
        model: anthropic("claude-sonnet-4-20250514"),
        schema: outputSchema,
        prompt: promptParts.join("\n"),
        temperature: mode === "improve" ? 0.2 : 0.4,
      });
    } catch (e) {
      result = await generateObject({
        model: anthropic("claude-sonnet-4-20250514"),
        schema: outputSchema,
        prompt:
          promptParts.join("\n") +
          `\n\nIMPORTANT: Keep it short (1–4 sentences) and avoid long explanations.`,
        temperature: 0.2,
      });
    }

    const credits = Math.max(1, Math.ceil(result.usage.totalTokens / 1000));
    await prisma.project.update({
      where: { id: workspace.id },
      data: { aiUsage: { increment: credits } },
    });

    return result.object;
  });
