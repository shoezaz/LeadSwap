/**
 * Lead Scorer - Calculate final scores and assign tiers
 * 
 * Scoring breakdown:
 * - ICP Match: 0-60 points
 * - Validation Bonus: 0-20 points (web verification)
 * - Intent Boost: 0-20 points (intent signals)
 * 
 * Tiers:
 * - Tier 1 (Hot): 80-100 points
 * - Tier 2 (Warm): 50-79 points
 * - Rejected (Cold): 0-49 points
 */

import type {
    ValidationLead,
    ScoredLead,
    IntentSignal,
    ValidationResult,
    RejectionPattern
} from "../types";
import type { ICP, ICPMatchResult } from "../types/icp";
import { matchLeadToICP } from "./icp-matcher";
import { searchLeads } from "../lib/exa";
import crypto from "crypto";

// Tier thresholds
const TIER_1_THRESHOLD = 80;
const TIER_2_THRESHOLD = 50;

// Credit value per lead
const CREDIT_VALUE_PER_LEAD = 5; // €5 per rejected lead

/**
 * Score a single lead
 */
export async function scoreLead(
    lead: ValidationLead,
    icp: ICP,
    skipIntentSignals = false
): Promise<ScoredLead> {
    // 1. Get ICP match score (0-60)
    const icpMatch = await matchLeadToICP(lead, icp);

    // 2. Calculate validation bonus (0-20)
    // For now, give partial points based on available data
    const validationBonus = calculateValidationBonus(lead);

    // 3. Detect intent signals (0-20)
    let intentSignals: IntentSignal[] = [];
    let intentBoost = 0;

    if (!skipIntentSignals && lead.company) {
        intentSignals = await detectIntentSignals(lead);
        intentBoost = intentSignals.reduce((sum, signal) => sum + signal.boost, 0);
        intentBoost = Math.min(intentBoost, 20); // Cap at 20
    }

    // 4. Calculate final score
    const score = Math.min(
        icpMatch.icpScore + validationBonus + intentBoost,
        100
    );

    // 5. Assign tier
    const tier = assignTier(score);

    // 6. Compile reasoning
    const reasoning = [
        ...icpMatch.reasoning,
        `📊 ICP Score: ${icpMatch.icpScore}/60`,
        `✓ Validation Bonus: +${validationBonus}`,
        `🔥 Intent Boost: +${intentBoost}`,
        `➡️ Final Score: ${score}/100`,
    ];

    // 7. Add rejection reasons if applicable
    const rejectionReasons = tier === "rejected"
        ? generateRejectionReasons(icpMatch, lead)
        : undefined;

    return {
        ...lead,
        score,
        tier,
        icpMatchScore: icpMatch.icpScore,
        validationBonus,
        intentBoost,
        reasoning,
        intentSignals,
        rejectionReasons,
        validatedAt: new Date(),
    };
}

/**
 * Score multiple leads and generate validation result
 */
export async function scoreLeads(
    leads: ValidationLead[],
    icp: ICP,
    userId: string,
    onProgress?: (current: number, total: number, lead: string) => void
): Promise<ValidationResult> {
    const startTime = Date.now();
    const scoredLeads: ScoredLead[] = [];

    // Score each lead
    for (let i = 0; i < leads.length; i++) {
        const lead = leads[i];

        if (onProgress) {
            onProgress(i + 1, leads.length, lead.company || lead.email);
        }

        // Skip intent signals for faster processing (can be enabled for smaller batches)
        const skipIntent = leads.length > 100;
        const scored = await scoreLead(lead, icp, skipIntent);
        scoredLeads.push(scored);
    }

    // Categorize by tier
    const tier1 = scoredLeads.filter(l => l.tier === "tier1");
    const tier2 = scoredLeads.filter(l => l.tier === "tier2");
    const rejected = scoredLeads.filter(l => l.tier === "rejected");

    // Calculate stats
    const totalLeads = scoredLeads.length;
    const avgScore = totalLeads > 0
        ? Math.round(scoredLeads.reduce((sum, l) => sum + l.score, 0) / totalLeads)
        : 0;

    // Analyze rejection patterns
    const patterns = analyzeRejectionPatterns(rejected);

    // Generate recommendations
    const recommendations = generateRecommendations(patterns, icp);

    // Calculate credits saved
    const creditsSaved = rejected.length * CREDIT_VALUE_PER_LEAD;

    return {
        id: generateResultId(),
        userId,
        totalLeads,
        tier1,
        tier2,
        rejected,
        stats: {
            tier1Count: tier1.length,
            tier1Percentage: Math.round((tier1.length / totalLeads) * 100),
            tier2Count: tier2.length,
            tier2Percentage: Math.round((tier2.length / totalLeads) * 100),
            rejectedCount: rejected.length,
            rejectedPercentage: Math.round((rejected.length / totalLeads) * 100),
            avgScore,
            processingTimeMs: Date.now() - startTime,
        },
        patterns,
        recommendations,
        creditsSaved,
        createdAt: new Date(),
    };
}

/**
 * Assign tier based on score
 */
function assignTier(score: number): "tier1" | "tier2" | "rejected" {
    if (score >= TIER_1_THRESHOLD) return "tier1";
    if (score >= TIER_2_THRESHOLD) return "tier2";
    return "rejected";
}

/**
 * Calculate validation bonus based on lead data completeness
 */
function calculateValidationBonus(lead: ValidationLead): number {
    let bonus = 0;

    // Points for having complete data
    if (lead.email) bonus += 5;
    if (lead.name) bonus += 3;
    if (lead.company) bonus += 5;
    if (lead.title) bonus += 4;
    if (lead.linkedinUrl) bonus += 2;
    if (lead.website) bonus += 1;

    return Math.min(bonus, 20);
}

/**
 * Detect intent signals for a lead
 */
async function detectIntentSignals(lead: ValidationLead): Promise<IntentSignal[]> {
    const signals: IntentSignal[] = [];
    const now = new Date();

    try {
        // Search for pain point mentions
        const painPointQuery = `"${lead.company}" data quality OR lead quality OR prospecting challenges`;
        const painResults = await searchLeads({
            query: painPointQuery,
            numResults: 2,
            type: "neural",
        });

        for (const result of painResults) {
            // Check if recent (within 30 days simulation)
            if (result.publishedDate) {
                const pubDate = new Date(result.publishedDate);
                const daysDiff = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24);

                if (daysDiff <= 30) {
                    signals.push({
                        type: "pain_point",
                        description: `Posted about data/lead quality ${Math.round(daysDiff)} days ago`,
                        sourceUrl: result.url,
                        detectedAt: now,
                        boost: 10,
                        emoji: "🔥",
                    });
                    break; // Only one pain point signal
                }
            }
        }

        // Search for funding news
        const fundingQuery = `"${lead.company}" raised funding OR series OR investment announcement`;
        const fundingResults = await searchLeads({
            query: fundingQuery,
            numResults: 2,
            type: "neural",
        });

        for (const result of fundingResults) {
            if (result.text?.toLowerCase().includes("raised") ||
                result.text?.toLowerCase().includes("funding") ||
                result.text?.toLowerCase().includes("series")) {
                signals.push({
                    type: "funding",
                    description: "Recent funding activity detected",
                    sourceUrl: result.url,
                    detectedAt: now,
                    boost: 8,
                    emoji: "💰",
                });
                break;
            }
        }

    } catch (err) {
        console.error(`[Scorer] Error detecting intent signals for ${lead.company}:`, err);
    }

    return signals;
}

/**
 * Generate rejection reasons
 */
function generateRejectionReasons(
    icpMatch: ICPMatchResult,
    lead: ValidationLead
): string[] {
    const reasons: string[] = [];

    if (!icpMatch.matchedCriteria.industry.matched) {
        reasons.push("Industry doesn't match ICP");
    }
    if (!icpMatch.matchedCriteria.title.matched && lead.title) {
        reasons.push(`Title "${lead.title}" doesn't match target titles`);
    }
    if (!icpMatch.matchedCriteria.geography.matched) {
        reasons.push("Geography doesn't match target regions");
    }
    if (!icpMatch.matchedCriteria.companySize.matched) {
        reasons.push("Company size outside target range");
    }
    if (icpMatch.icpScore < 30) {
        reasons.push("Overall ICP match too low");
    }

    return reasons;
}

/**
 * Analyze patterns in rejected leads
 */
function analyzeRejectionPatterns(rejected: ScoredLead[]): RejectionPattern[] {
    if (rejected.length === 0) return [];

    const patterns: RejectionPattern[] = [];
    const reasonCounts: Record<string, { count: number; examples: string[] }> = {};

    // Count rejection reasons
    for (const lead of rejected) {
        for (const reason of lead.rejectionReasons || []) {
            if (!reasonCounts[reason]) {
                reasonCounts[reason] = { count: 0, examples: [] };
            }
            reasonCounts[reason].count++;
            if (reasonCounts[reason].examples.length < 3) {
                reasonCounts[reason].examples.push(lead.company || lead.email);
            }
        }
    }

    // Convert to patterns
    for (const [reason, data] of Object.entries(reasonCounts)) {
        const percentage = Math.round((data.count / rejected.length) * 100);
        if (percentage >= 10) { // Only include patterns affecting 10%+ of rejections
            patterns.push({
                reason,
                count: data.count,
                percentage,
                examples: data.examples,
                recommendation: generatePatternRecommendation(reason),
            });
        }
    }

    // Sort by count
    patterns.sort((a, b) => b.count - a.count);

    return patterns;
}

/**
 * Generate recommendation for a pattern
 */
function generatePatternRecommendation(reason: string): string {
    if (reason.includes("Industry")) {
        return "Adjust your data source filters to only include target industries";
    }
    if (reason.includes("Title")) {
        return "Filter by job titles in Apollo/ZoomInfo before purchasing";
    }
    if (reason.includes("Geography")) {
        return "Add location filters to target only your ICP regions";
    }
    if (reason.includes("size")) {
        return "Adjust company size filters (e.g., 50-500 employees)";
    }
    return "Review your ICP criteria and data source filters";
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(
    patterns: RejectionPattern[],
    icp: ICP
): string[] {
    const recommendations: string[] = [];

    // Pattern-based recommendations
    for (const pattern of patterns.slice(0, 3)) {
        recommendations.push(pattern.recommendation);
    }

    // General recommendations
    if (patterns.length > 0) {
        recommendations.push(
            `💡 Tip: Use these insights to adjust your Apollo/ZoomInfo filters before your next purchase`
        );
    }

    return recommendations;
}

/**
 * Generate unique result ID
 */
function generateResultId(): string {
    return `result-${crypto.randomBytes(8).toString("hex")}`;
}

/**
 * Format validation result for display
 */
export function formatResultForDisplay(result: ValidationResult): string {
    const lines: string[] = [];

    lines.push(`# 📊 Validation Results\n`);

    lines.push(`## Summary`);
    lines.push(`✅ **Tier 1 (Hot):** ${result.stats.tier1Count} leads (${result.stats.tier1Percentage}%)`);
    lines.push(`⚠️ **Tier 2 (Warm):** ${result.stats.tier2Count} leads (${result.stats.tier2Percentage}%)`);
    lines.push(`❌ **Rejected:** ${result.stats.rejectedCount} leads (${result.stats.rejectedPercentage}%)\n`);

    lines.push(`📈 **Average Score:** ${result.stats.avgScore}/100`);
    lines.push(`⏱️ **Processing Time:** ${(result.stats.processingTimeMs / 1000).toFixed(1)}s`);
    lines.push(`💰 **Credits Saved:** €${result.creditsSaved}\n`);

    if (result.patterns.length > 0) {
        lines.push(`## Top Rejection Patterns`);
        for (const pattern of result.patterns.slice(0, 3)) {
            lines.push(`- **${pattern.reason}** (${pattern.percentage}% of rejections)`);
            lines.push(`  → ${pattern.recommendation}`);
        }
        lines.push("");
    }

    if (result.recommendations.length > 0) {
        lines.push(`## Recommendations`);
        for (const rec of result.recommendations) {
            lines.push(`- ${rec}`);
        }
    }

    return lines.join("\n");
}
