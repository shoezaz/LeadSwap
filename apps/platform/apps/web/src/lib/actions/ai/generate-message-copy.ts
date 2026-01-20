"use server";

import { throwIfAIUsageExceeded } from "@/lib/api/links/usage-checks";
import { MAX_MESSAGE_LENGTH } from "@/lib/zod/schemas/messages";
import { prisma } from "@leadswap/prisma";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";
import { authActionClient } from "../safe-action";

const schema = z.object({
  workspaceId: z.string(),
  mode: z.enum(["generate", "improve"]),
  instructions: z.string().trim().max(2000).optional(),
  context: z
    .object({
      channel: z.enum(["direct_message", "internal_comment"]).optional(),
      programName: z.string().trim().max(200).optional(),
      recipientName: z.string().trim().max(200).optional(),
    })
    .optional(),
  current: z
    .object({
      message: z.string().trim().max(MAX_MESSAGE_LENGTH).nullable().optional(),
    })
    .optional(),
});

const outputSchema = z.object({
  message: z.string().trim().min(1).max(MAX_MESSAGE_LENGTH),
});

export const generateMessageCopyAction = authActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx }) => {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("AI is not configured (missing ANTHROPIC_API_KEY).");
    }

    const { workspace } = ctx;
    throwIfAIUsageExceeded(workspace);

    const { mode, instructions, context, current } = parsedInput;

    const channel = context?.channel ?? "direct_message";

    const promptParts = [
      `You are an expert affiliate program operator writing concise, helpful communication.`,
      `Write in English.`,
      ``,
      `Task: ${mode === "generate" ? "Generate" : "Improve"} a ${
        channel === "internal_comment" ? "private internal note" : "message"
      }.`,
      context?.programName ? `Program: ${context.programName}` : null,
      context?.recipientName ? `Recipient: ${context.recipientName}` : null,
      ``,
      `Constraints:`,
      `- Output must be a single message (no subject).`,
      `- Max ${MAX_MESSAGE_LENGTH} characters.`,
      `- Be clear, friendly, and professional.`,
      `- Do not mention AI.`,
      ``,
      instructions?.trim()
        ? `Brief / instructions: ${instructions.trim()}`
        : null,
      ``,
      mode === "improve"
        ? `Current message to improve:\n${JSON.stringify(
            { message: current?.message ?? "" },
            null,
            2,
          )}`
        : `Current draft (may be empty):\n${JSON.stringify(
            { message: current?.message ?? "" },
            null,
            2,
          )}`,
      ``,
      `Return JSON: { "message": "..." }`,
    ].filter(Boolean);

    let result;
    try {
      result = await generateObject({
        model: anthropic("claude-sonnet-4-20250514"),
        schema: outputSchema,
        prompt: promptParts.join("\n"),
        temperature: mode === "improve" ? 0.2 : 0.5,
      });
    } catch (e) {
      result = await generateObject({
        model: anthropic("claude-sonnet-4-20250514"),
        schema: outputSchema,
        prompt:
          promptParts.join("\n") +
          `\n\nIMPORTANT: Strictly keep it under ${MAX_MESSAGE_LENGTH} characters. Prefer shorter output.`,
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

