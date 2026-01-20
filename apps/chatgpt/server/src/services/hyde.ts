/**
 * HyDE (Hypothetical Document Embeddings) Service
 * 
 * Generates hypothetical "perfect match" company descriptions to improve
 * semantic search quality. Instead of searching for the raw ICP query,
 * we generate what an ideal company would look like, then search for that.
 * 
 * Research shows HyDE improves retrieval by 6-15% on domain-specific queries.
 */

import OpenAI from "openai";
import { logger, createTimer } from "../lib/logger.js";
import { cacheGet, cacheSet, generateCacheKey } from "../lib/cache.js";
import type { ICP } from "../types.js";

// Feature flag for easy rollback
const ENABLE_HYDE = process.env.ENABLE_HYDE !== "false";

// Cache TTL: 24 hours (hypothetical docs don't change often)
const HYDE_CACHE_TTL = 86400;

// OpenAI client singleton
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        logger.warn("OPENAI_API_KEY not set, HyDE disabled");
        return null;
    }
    if (!openaiClient) {
        openaiClient = new OpenAI({ apiKey });
    }
    return openaiClient;
}

/**
 * Generate a hypothetical document that represents the "ideal" company
 * matching the given ICP.
 * 
 * @param icp - The Ideal Customer Profile
 * @returns Hypothetical company description or null if generation fails
 */
export async function generateHypotheticalDocument(icp: ICP): Promise<string | null> {
    // Feature flag check
    if (!ENABLE_HYDE) {
        logger.debug("HyDE disabled via feature flag");
        return null;
    }

    const timer = createTimer("generateHypotheticalDocument");

    // Check cache first
    const cacheKey = generateCacheKey("hyde", "doc", icp.rawDescription || JSON.stringify(icp));
    const cached = await cacheGet<string>(cacheKey);

    if (cached) {
        logger.debug("HyDE cache hit");
        return cached;
    }

    const openai = getOpenAIClient();
    if (!openai) {
        return null;
    }

    try {
        const prompt = buildHyDEPrompt(icp);

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cost-efficient for this task
            messages: [
                {
                    role: "system",
                    content: `You are a B2B company profile generator. Generate a realistic company description that would be an IDEAL match for the given customer profile. Write in third person, as if describing a real company. Be specific with details. Keep it under 200 words.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 300,
        });

        const hypotheticalDoc = response.choices[0]?.message?.content?.trim();

        if (!hypotheticalDoc) {
            logger.warn("HyDE generation returned empty response");
            return null;
        }

        // Cache the result
        await cacheSet(cacheKey, hypotheticalDoc, HYDE_CACHE_TTL);

        timer.end({ docLength: hypotheticalDoc.length });

        logger.info("HyDE document generated", {
            icpDescription: icp.rawDescription?.substring(0, 50),
            docLength: hypotheticalDoc.length,
        });

        return hypotheticalDoc;

    } catch (error) {
        logger.error("HyDE generation failed", { error });
        timer.end({ error: true });
        return null;
    }
}

/**
 * Build the prompt for HyDE generation
 */
function buildHyDEPrompt(icp: ICP): string {
    const parts: string[] = [];

    parts.push("Generate a company profile matching these criteria:");
    parts.push("");

    if (icp.rawDescription) {
        parts.push(`Description: ${icp.rawDescription}`);
    }

    if (icp.industries.length > 0) {
        parts.push(`Industries: ${icp.industries.join(", ")}`);
    }

    if (icp.companySizeMin || icp.companySizeMax) {
        const sizeStr = icp.companySizeMin && icp.companySizeMax
            ? `${icp.companySizeMin}-${icp.companySizeMax} employees`
            : icp.companySizeMin
                ? `${icp.companySizeMin}+ employees`
                : `under ${icp.companySizeMax} employees`;
        parts.push(`Company size: ${sizeStr}`);
    }

    if (icp.geographies.length > 0) {
        parts.push(`Location: ${icp.geographies.join(", ")}`);
    }

    if (icp.titles.length > 0) {
        parts.push(`Target decision makers: ${icp.titles.join(", ")}`);
    }

    if (icp.keywords.length > 0) {
        parts.push(`Keywords to include: ${icp.keywords.join(", ")}`);
    }

    parts.push("");
    parts.push("Write a realistic company profile that would be a perfect match.");

    return parts.join("\n");
}

/**
 * Generate an enhanced search query using HyDE
 * 
 * Combines the hypothetical document with the original query
 * for better semantic coverage.
 * 
 * @param icp - The Ideal Customer Profile
 * @returns Enhanced query string
 */
export async function generateHyDEQuery(icp: ICP): Promise<string> {
    const hydeDoc = await generateHypotheticalDocument(icp);

    if (!hydeDoc) {
        // Fallback to traditional query building
        return buildFallbackQuery(icp);
    }

    // Combine HyDE doc with explicit ICP criteria
    const explicitCriteria = buildExplicitCriteria(icp);

    return `${hydeDoc}\n\n${explicitCriteria}`;
}

/**
 * Build explicit criteria string from ICP
 */
function buildExplicitCriteria(icp: ICP): string {
    const parts: string[] = [];

    if (icp.industries.length > 0) {
        parts.push(icp.industries.join(" OR "));
    }

    if (icp.geographies.length > 0) {
        parts.push(`located in ${icp.geographies.join(" or ")}`);
    }

    if (icp.titles.length > 0) {
        parts.push(icp.titles.join(" OR "));
    }

    return parts.join(", ");
}

/**
 * Fallback query when HyDE is disabled or fails
 */
function buildFallbackQuery(icp: ICP): string {
    const parts: string[] = [];

    if (icp.industries.length > 0) {
        parts.push(icp.industries.join(" OR "));
    }

    if (icp.geographies.length > 0) {
        parts.push(`located in ${icp.geographies.join(" or ")}`);
    }

    if (icp.titles.length > 0) {
        parts.push(`${icp.titles.join(" OR ")} contact`);
    }

    return parts.join(", ") || icp.rawDescription;
}
