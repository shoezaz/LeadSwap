/**
 * Context Window Management
 * 
 * Prevents context window explosion when returning data to AI:
 * - Limits array sizes in responses
 * - Compresses/summarizes large data structures
 * - Provides pagination for large result sets
 * - Tracks token estimates for responses
 */

import { logger } from "./logger.js";

// Rough token estimates (conservative)
const TOKENS_PER_CHAR = 0.25; // ~4 chars per token average
const MAX_RESPONSE_TOKENS = 4000; // Safe limit for structured content

/**
 * Configuration for context limits
 */
export const CONTEXT_LIMITS = {
    // Maximum items in arrays for responses
    maxLeadsInResponse: 20,
    maxLeadsInSummary: 5,
    maxIntentSignalsPerLead: 3,
    maxMatchDetailsLength: 200,
    maxTextFieldLength: 100,

    // Pagination defaults
    defaultPageSize: 20,
    maxPageSize: 50,

    // Token estimates
    tokensPerLead: 150, // Average tokens per lead object
    tokensPerSignal: 50,
    maxResponseTokens: MAX_RESPONSE_TOKENS,
};

/**
 * Estimate token count for a value
 */
export function estimateTokens(value: unknown): number {
    if (value === null || value === undefined) return 0;

    if (typeof value === "string") {
        return Math.ceil(value.length * TOKENS_PER_CHAR);
    }

    if (typeof value === "number" || typeof value === "boolean") {
        return 1;
    }

    if (Array.isArray(value)) {
        return value.reduce((sum, item) => sum + estimateTokens(item), 10); // 10 for array overhead
    }

    if (typeof value === "object") {
        const entries = Object.entries(value as Record<string, unknown>);
        return entries.reduce((sum, [key, val]) => {
            return sum + Math.ceil(key.length * TOKENS_PER_CHAR) + estimateTokens(val);
        }, 10); // 10 for object overhead
    }

    return 5; // Default estimate
}

/**
 * Truncate a string to a maximum length
 */
export function truncateText(text: string | undefined, maxLength: number = CONTEXT_LIMITS.maxTextFieldLength): string | undefined {
    if (!text) return text;
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
}

/**
 * Compress a lead object for API response
 * Removes verbose fields and truncates long strings
 */
export function compressLead<T extends Record<string, unknown>>(lead: T): T {
    const compressed = { ...lead } as Record<string, unknown>;

    // Truncate long text fields
    const textFields = ["notes", "description", "bio", "summary"];
    for (const field of textFields) {
        if (typeof compressed[field] === "string") {
            compressed[field] = truncateText(compressed[field] as string);
        }
    }

    // Limit intent signals
    if (Array.isArray(compressed.intentSignals)) {
        compressed.intentSignals = (compressed.intentSignals as unknown[])
            .slice(0, CONTEXT_LIMITS.maxIntentSignalsPerLead);
    }

    // Simplify match details if present
    if (compressed.matchDetails && typeof compressed.matchDetails === "object") {
        const details = compressed.matchDetails as Record<string, unknown>;
        if (typeof details.explanation === "string") {
            details.explanation = truncateText(details.explanation as string, CONTEXT_LIMITS.maxMatchDetailsLength);
        }
    }

    return compressed as T;
}

/**
 * Create a paginated response from a large array
 */
export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export function paginate<T>(
    items: T[],
    page: number = 1,
    pageSize: number = CONTEXT_LIMITS.defaultPageSize
): PaginatedResponse<T> {
    const safePageSize = Math.min(pageSize, CONTEXT_LIMITS.maxPageSize);
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / safePageSize);
    const safePage = Math.max(1, Math.min(page, totalPages || 1));

    const startIndex = (safePage - 1) * safePageSize;
    const paginatedItems = items.slice(startIndex, startIndex + safePageSize);

    return {
        items: paginatedItems,
        page: safePage,
        pageSize: safePageSize,
        totalItems,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
    };
}

/**
 * Create a summary-only response for large result sets
 * Returns counts and statistics instead of full data
 */
export interface LeadSummary {
    totalLeads: number;
    tierBreakdown: { tierA: number; tierB: number; tierC: number };
    avgScore: number;
    topCompanies: string[];
    intentSignalCount: number;
    message: string;
}

export function summarizeLeads<T extends { score?: number; tier?: string; company?: string; intentSignals?: unknown[] }>(
    leads: T[]
): LeadSummary {
    const tierBreakdown = {
        tierA: leads.filter(l => l.tier === "A").length,
        tierB: leads.filter(l => l.tier === "B").length,
        tierC: leads.filter(l => l.tier === "C").length,
    };

    const scores = leads.map(l => l.score ?? 0);
    const avgScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    const topCompanies = leads
        .filter(l => l.tier === "A")
        .slice(0, CONTEXT_LIMITS.maxLeadsInSummary)
        .map(l => l.company ?? "Unknown")
        .filter(Boolean);

    const intentSignalCount = leads.reduce((sum, l) => sum + (l.intentSignals?.length ?? 0), 0);

    return {
        totalLeads: leads.length,
        tierBreakdown,
        avgScore,
        topCompanies,
        intentSignalCount,
        message: `${leads.length} leads scored. Tier A: ${tierBreakdown.tierA}, Tier B: ${tierBreakdown.tierB}, Tier C: ${tierBreakdown.tierC}. Average score: ${avgScore}.`,
    };
}

/**
 * Compress an API response to fit within context limits
 * Automatically truncates arrays and summarizes when needed
 */
export function compressResponse<T extends Record<string, unknown>>(
    response: T,
    options: { maxLeads?: number; summarizeIfLarge?: boolean } = {}
): T {
    const { maxLeads = CONTEXT_LIMITS.maxLeadsInResponse, summarizeIfLarge = true } = options;
    const result = { ...response };

    // Check estimated token count
    const estimatedTokens = estimateTokens(result);

    if (estimatedTokens > CONTEXT_LIMITS.maxResponseTokens) {
        logger.warn("Response exceeds token limit, compressing", {
            estimatedTokens,
            limit: CONTEXT_LIMITS.maxResponseTokens,
        });
    }

    // Process arrays that look like lead data
    for (const [key, value] of Object.entries(result)) {
        if (!Array.isArray(value)) continue;

        // Check if this looks like a leads array
        const isLeadsArray = value.length > 0 &&
            typeof value[0] === "object" &&
            value[0] !== null &&
            ("company" in value[0] || "email" in value[0] || "score" in value[0]);

        if (isLeadsArray && value.length > maxLeads) {
            if (summarizeIfLarge && value.length > maxLeads * 2) {
                // Too large - provide summary instead
                (result as Record<string, unknown>)[key] = value.slice(0, maxLeads).map(compressLead);
                (result as Record<string, unknown>)[`${key}Summary`] = summarizeLeads(value);
                (result as Record<string, unknown>)[`${key}Truncated`] = true;
                (result as Record<string, unknown>)[`${key}TotalCount`] = value.length;
            } else {
                // Just truncate
                (result as Record<string, unknown>)[key] = value.slice(0, maxLeads).map(compressLead);
                (result as Record<string, unknown>)[`${key}TotalCount`] = value.length;
            }
        } else if (isLeadsArray) {
            // Compress each lead even if within limits
            (result as Record<string, unknown>)[key] = value.map(compressLead);
        }
    }

    return result;
}

/**
 * Format a response for AI consumption
 * Ensures the response is both informative and context-efficient
 */
export function formatForAI<T extends Record<string, unknown>>(
    data: T,
    options: {
        includeRawData?: boolean;
        maxItems?: number;
        addUsageHints?: boolean;
    } = {}
): { summary: string; data: Partial<T>; pagination?: { hasMore: boolean; nextAction: string } } {
    const { includeRawData = false, maxItems = CONTEXT_LIMITS.maxLeadsInResponse, addUsageHints = true } = options;

    const compressed = compressResponse(data, { maxLeads: maxItems });

    // Generate a human-readable summary
    let summary = "";

    if ("totalLeads" in data) {
        summary += `Total: ${data.totalLeads} leads. `;
    }

    if ("tierBreakdown" in data && typeof data.tierBreakdown === "object") {
        const tb = data.tierBreakdown as { tierA?: number; tierB?: number; tierC?: number };
        summary += `Distribution: A=${tb.tierA ?? 0}, B=${tb.tierB ?? 0}, C=${tb.tierC ?? 0}. `;
    }

    const hints = addUsageHints
        ? "Use get-results with pagination for detailed view."
        : "";

    // Determine if there's more data
    const hasMore = Object.keys(compressed).some(k => k.endsWith("TotalCount"));

    return {
        summary: summary.trim() || "Data processed successfully.",
        data: includeRawData ? compressed : ({} as Partial<T>),
        pagination: hasMore ? {
            hasMore: true,
            nextAction: hints,
        } : undefined,
    };
}
