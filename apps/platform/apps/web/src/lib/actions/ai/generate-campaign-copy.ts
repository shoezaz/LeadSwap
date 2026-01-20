"use server";

import { getDefaultProgramIdOrThrow } from "@/lib/api/programs/get-default-program-id-or-throw";
import { getProgramOrThrow } from "@/lib/api/programs/get-program-or-throw";
import { throwIfAIUsageExceeded } from "@/lib/api/links/usage-checks";
import type { TiptapNode } from "@/lib/types";
import { EMAIL_TEMPLATE_VARIABLES } from "@/lib/zod/schemas/campaigns";
import { prisma } from "@leadswap/prisma";
import { CampaignType } from "@leadswap/prisma/client";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { authActionClient } from "../safe-action";

const schema = z.object({
  workspaceId: z.string(),
  mode: z.enum(["generate", "improve"]),
  instructions: z.string().trim().max(3000).optional(),
  campaignType: z.nativeEnum(CampaignType).optional(),
  current: z
    .object({
      name: z.string().nullable().optional(),
      subject: z.string().nullable().optional(),
      bodyJson: z.record(z.string(), z.any()).nullable().optional(),
    })
    .optional(),
});

const outputSchema = z.object({
  name: z.string().trim().max(100),
  subject: z.string().trim().max(100),
  body: z.string().trim().min(1).max(12000),
});

function tiptapToPlainText(input: unknown): string {
  const root = input as TiptapNode | undefined;
  if (!root) return "";

  const parts: string[] = [];

  const walk = (node: TiptapNode) => {
    if (!node) return;

    if (node.type === "text") {
      if (node.text) parts.push(node.text);
      return;
    }

    if (node.type === "hardBreak") {
      parts.push("\n");
      return;
    }

    if (node.type === "mention") {
      const id = node.attrs?.id;
      if (typeof id === "string" && id.length) {
        parts.push(`{{${id}}}`);
      }
      return;
    }

    if (node.content?.length) {
      node.content.forEach(walk);
    }

    // Block separators
    if (
      [
        "paragraph",
        "heading",
        "listItem",
        "blockquote",
        "bulletList",
        "orderedList",
      ].includes(node.type)
    ) {
      parts.push("\n\n");
    }
  };

  walk(root);

  return parts
    .join("")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export const generateCampaignCopyAction = authActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx }) => {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("AI is not configured (missing ANTHROPIC_API_KEY).");
    }

    const { workspace } = ctx;
    throwIfAIUsageExceeded(workspace);

    const { mode, instructions, campaignType, current } = parsedInput;

    const programId = getDefaultProgramIdOrThrow(workspace);
    const program = await getProgramOrThrow({
      programId,
      workspaceId: workspace.id,
    });

    const variables = EMAIL_TEMPLATE_VARIABLES.map((v) => `{{${v}}}`).join(", ");

    const currentBodyText = current?.bodyJson
      ? tiptapToPlainText(current.bodyJson)
      : "";

    const promptParts = [
      `You are an expert lifecycle email copywriter for affiliate programs.`,
      `Write in English.`,
      ``,
      `Task: ${mode === "generate" ? "Generate" : "Improve"} an email campaign.`,
      `Program name: ${program.name}`,
      campaignType ? `Campaign type: ${campaignType}` : null,
      ``,
      `Audience: affiliates/partners enrolled in the program.`,
      `Available template variables (keep them intact if used): ${variables}`,
      ``,
      `Constraints:`,
      `- name: max 100 chars (internal name, concise).`,
      `- subject: max 100 chars (clear, no spammy ALL CAPS).`,
      `- body: plain text with paragraphs separated by blank lines; keep it under ~200 words unless instructions require more.`,
      `- Do not mention AI.`,
      ``,
      instructions?.trim()
        ? `Brief / additional instructions: ${instructions.trim()}`
        : null,
      ``,
      mode === "improve"
        ? `Current campaign copy:\n${JSON.stringify(
            {
              name: current?.name ?? "",
              subject: current?.subject ?? "",
              body: currentBodyText,
            },
            null,
            2,
          )}`
        : `Current values (may be empty):\n${JSON.stringify(
            {
              name: current?.name ?? "",
              subject: current?.subject ?? "",
              body: currentBodyText,
            },
            null,
            2,
          )}`,
      ``,
      `Return a JSON object with keys: name, subject, body.`,
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
          `\n\nIMPORTANT: Strictly respect max lengths for name/subject and keep body concise.`,
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
