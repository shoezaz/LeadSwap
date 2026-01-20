"use server";

import { generateEmailContent } from "@/lib/ai/generate-email-content";
import { z } from "zod";
import { authUserActionClient } from "../safe-action";

const generateEmailSchema = z.object({
    objective: z.string(),
    tone: z.string(),
    keyPoints: z.array(z.string()),
    context: z.string().optional(),
});

export const generateEmailAction = authUserActionClient
    .schema(generateEmailSchema)
    .action(async ({ parsedInput }) => {
        // The authActionClient middleware ensures the user is authenticated
        const result = await generateEmailContent(parsedInput);

        return result;
    });
