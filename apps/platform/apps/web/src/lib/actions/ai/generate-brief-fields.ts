"use server";

import { getDefaultProgramIdOrThrow } from "@/lib/api/programs/get-default-program-id-or-throw";
import { getProgramOrThrow } from "@/lib/api/programs/get-program-or-throw";
import { throwIfAIUsageExceeded } from "@/lib/api/links/usage-checks";
import { prisma } from "@leadswap/prisma";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { authActionClient } from "../safe-action";

const schema = z.object({
    workspaceId: z.string(),
    context: z.object({
        campaignName: z.string().optional(),
        productName: z.string().optional(),
        platforms: z.array(z.string()).optional(),
    }).optional(),
});

const outputSchema = z.object({
    objective: z.string().describe("Clear campaign objective in 1 sentence"),
    targetAudience: z.string().describe("Target audience description"),
    dos: z.string().describe("What creators SHOULD do, one item per line"),
    donts: z.string().describe("What creators should NOT do, one item per line"),
    talkingPoints: z.string().describe("Key messages to convey, one per line"),
    additionalNotes: z.string().optional().describe("Any extra context"),
});

export const generateBriefFieldsAction = authActionClient
    .schema(schema)
    .action(async ({ parsedInput, ctx }) => {
        if (!process.env.ANTHROPIC_API_KEY) {
            throw new Error("AI is not configured (missing ANTHROPIC_API_KEY).");
        }

        const { workspace } = ctx;
        throwIfAIUsageExceeded(workspace);

        const { context } = parsedInput;

        const programId = getDefaultProgramIdOrThrow(workspace);
        const program = await getProgramOrThrow({
            programId,
            workspaceId: workspace.id,
        });

        const prompt = `
You are a UGC Campaign Manager creating structured briefs for content creators.

Context:
- Brand: ${program.name}
- Campaign: ${context?.campaignName || "New Campaign"}
- Product: ${context?.productName || program.name}
- Platforms: ${context?.platforms?.join(", ") || "Multiple platforms"}

Generate a professional campaign brief with the following sections:

1. **Objective**: What should creators achieve? (1 clear sentence)
2. **Target Audience**: Who should the content resonate with?
3. **Do's**: What creators SHOULD include (one item per line, 3-5 items)
4. **Don'ts**: What to AVOID (one item per line, 3-5 items)
5. **Talking Points**: Key messages to convey (one per line, 3-5 items)

Keep it concise and actionable. No marketing fluff.
`.trim();

        const result = await generateObject({
            model: anthropic("claude-sonnet-4-20250514"),
            schema: outputSchema,
            prompt,
            temperature: 0.4,
        });

        const credits = Math.max(1, Math.ceil(result.usage.totalTokens / 1000));
        await prisma.project.update({
            where: { id: workspace.id },
            data: { aiUsage: { increment: credits } },
        });

        return result.object;
    });
