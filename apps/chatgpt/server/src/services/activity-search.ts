/**
 * Activity Search Service
 * 
 * Searches for recent public activity (News, Blogs, Social Media, Interviews)
 * associated with a lead or their company using Exa.ai.
 * 
 * Provides "Ice Breakers" for outreach.
 */

import { getExaClient } from "./exa-optimizer.js";
import { logger, createTimer } from "../lib/logger.js";
import { cacheGet, cacheSet, generateCacheKey } from "../lib/cache.js";
import { costTracker } from "./cost-tracker.js";
import type { Lead, ActivityItem } from "../types.js";

// Feature flag
const ENABLE_ACTIVITY_SEARCH = process.env.ENABLE_ACTIVITY_SEARCH !== "false";

/**
 * Search for recent public activity for a lead
 * @param lead - The lead to search activity for
 * @param userId - For cost tracking
 * @returns Array of activity items (empty if none found)
 */
export async function searchPublicActivity(
    lead: Lead,
    userId: string = "anonymous"
): Promise<ActivityItem[]> {
    if (!ENABLE_ACTIVITY_SEARCH) return [];
    if (!lead.company) return [];

    const timer = createTimer("searchPublicActivity");

    // Query construction: Focus on recent and relevant content
    // "Person Name" Company Name (interview OR podcast OR blog OR news)
    const queryParts = [`"${lead.company}"`];
    if (lead.name) queryParts.unshift(`"${lead.name}"`);

    const query = `${queryParts.join(" ")} interview OR podcast OR "blog post" OR news OR announcement`;

    const cacheKey = generateCacheKey("activity", "search", query);
    const cached = await cacheGet<ActivityItem[]>(cacheKey);

    if (cached) {
        logger.debug("Activity search cache hit");
        return cached;
    }

    try {
        const exa = getExaClient();

        // Search for recent content (last 3 months approx)
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const startDate = threeMonthsAgo.toISOString().split("T")[0];

        logger.debug("Searching public activity", { query, startDate });

        const result = await exa.searchAndContents(query, {
            type: "auto", // Use hybrid for best relevance
            numResults: 5,
            startPublishedDate: startDate,
            category: "news", // Prefer news/articles
            text: true,
            livecrawl: "always", // Ensure fresh results
        });

        costTracker.recordCost({
            userId,
            service: "exa",
            operation: "searchAndContents",
            cacheHit: false,
        });

        const activities: ActivityItem[] = result.results.map((res: any) => ({
            title: res.title || "Untitled Activity",
            url: res.url,
            date: res.publishedDate,
            snippet: res.text?.substring(0, 200) + "...",
            source: classifySource(res.url),
        }));

        // Cache results (shorter TTL for fresh news: 12h)
        await cacheSet(cacheKey, activities, 43200);

        timer.end({ count: activities.length });
        return activities;

    } catch (error) {
        logger.error("Activity search failed", { error, leadId: lead.id });
        timer.end({ error: true });
        return [];
    }
}

/**
 * Classify the source type based on URL
 */
function classifySource(url: string): ActivityItem["source"] {
    const lowerUrl = url.toLowerCase();

    if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com") || lowerUrl.includes("linkedin.com")) {
        return "social";
    }

    if (lowerUrl.includes("medium.com") || lowerUrl.includes("substack.com") || lowerUrl.includes("/blog/")) {
        return "blog";
    }

    if (lowerUrl.includes("news") || lowerUrl.includes("techcrunch") || lowerUrl.includes("forbes")) {
        return "news";
    }

    return "other";
}
