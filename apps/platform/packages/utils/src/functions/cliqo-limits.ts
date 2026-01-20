/**
 * Cliqo Limit Enforcement Utilities
 * 
 * Provides functions to check and enforce plan limits for:
 * - Partners/Creators (rolling 30-day active window)
 * - Campaigns
 * - AI Discovery searches
 * 
 * @see Product Brief V2.2 for limit definitions
 */

import { getCliqoPlan, type CliqoPlanTier } from "../constants/pricing";

// Type that matches the Project model's relevant fields
export interface WorkspaceLimits {
    planTier: string;
    partnersLimit: number;
    partnersActiveCount: number;
    campaignsLimit: number;
    campaignsActiveCount: number;
    discoverySearchLimit: number;
    discoverySearchUsage: number;
}

// ============================================================================
// Limit Checking Functions
// ============================================================================

/**
 * Check if workspace can add more partners/creators
 */
export const canAddPartner = (workspace: WorkspaceLimits): boolean => {
    return workspace.partnersActiveCount < workspace.partnersLimit;
};

/**
 * Check if workspace can create more campaigns
 */
export const canCreateCampaign = (workspace: WorkspaceLimits): boolean => {
    return workspace.campaignsActiveCount < workspace.campaignsLimit;
};

/**
 * Check if workspace can perform more discovery searches
 */
export const canUseDiscovery = (workspace: WorkspaceLimits): boolean => {
    return workspace.discoverySearchUsage < workspace.discoverySearchLimit;
};

// ============================================================================
// Usage Percentage Functions (for UI progress bars)
// ============================================================================

/**
 * Get usage percentage for a specific metric
 */
export const getUsagePercentage = (
    workspace: WorkspaceLimits,
    metric: "partners" | "campaigns" | "discovery"
): number => {
    switch (metric) {
        case "partners":
            return Math.min(
                (workspace.partnersActiveCount / workspace.partnersLimit) * 100,
                100
            );
        case "campaigns":
            return Math.min(
                (workspace.campaignsActiveCount / workspace.campaignsLimit) * 100,
                100
            );
        case "discovery":
            return Math.min(
                (workspace.discoverySearchUsage / workspace.discoverySearchLimit) * 100,
                100
            );
        default:
            return 0;
    }
};

/**
 * Get remaining count for a specific metric
 */
export const getRemainingCount = (
    workspace: WorkspaceLimits,
    metric: "partners" | "campaigns" | "discovery"
): number => {
    switch (metric) {
        case "partners":
            return Math.max(
                workspace.partnersLimit - workspace.partnersActiveCount,
                0
            );
        case "campaigns":
            return Math.max(
                workspace.campaignsLimit - workspace.campaignsActiveCount,
                0
            );
        case "discovery":
            return Math.max(
                workspace.discoverySearchLimit - workspace.discoverySearchUsage,
                0
            );
        default:
            return 0;
    }
};

// ============================================================================
// Upgrade Recommendation Functions
// ============================================================================

/**
 * Check if workspace is approaching limits (80%+ usage)
 */
export const isApproachingLimit = (
    workspace: WorkspaceLimits,
    metric: "partners" | "campaigns" | "discovery"
): boolean => {
    return getUsagePercentage(workspace, metric) >= 80;
};

/**
 * Check if workspace is at limit (100% usage)
 */
export const isAtLimit = (
    workspace: WorkspaceLimits,
    metric: "partners" | "campaigns" | "discovery"
): boolean => {
    return getUsagePercentage(workspace, metric) >= 100;
};

/**
 * Get recommended next plan based on which limits are being hit
 */
export const getUpgradeReason = (
    workspace: WorkspaceLimits
): string | null => {
    const plan = getCliqoPlan(workspace.planTier as CliqoPlanTier);

    if (isAtLimit(workspace, "partners")) {
        return `You've reached ${workspace.partnersLimit} active creators. Upgrade to add more.`;
    }
    if (isAtLimit(workspace, "campaigns")) {
        return `You've reached ${workspace.campaignsLimit} active campaigns. Upgrade to launch more.`;
    }
    if (isAtLimit(workspace, "discovery")) {
        return `You've used all ${workspace.discoverySearchLimit} AI Discovery searches this month. Upgrade for more.`;
    }

    return null;
};

// ============================================================================
// Plan Limit Sync Functions
// ============================================================================

/**
 * Get the limits that should be applied for a given plan tier
 * Used when upgrading/downgrading plans
 */
export const getLimitsForTier = (tier: CliqoPlanTier): Omit<WorkspaceLimits, "planTier" | "partnersActiveCount" | "campaignsActiveCount" | "discoverySearchUsage"> => {
    const plan = getCliqoPlan(tier);
    return {
        partnersLimit: plan.limits.partners,
        campaignsLimit: plan.limits.campaigns,
        discoverySearchLimit: plan.limits.discoverySearches,
    };
};

/**
 * Check if a downgrade would put the workspace over limits
 * Returns array of metrics that would be over-limit
 */
export const getDowngradeConflicts = (
    workspace: WorkspaceLimits,
    newTier: CliqoPlanTier
): string[] => {
    const newLimits = getLimitsForTier(newTier);
    const conflicts: string[] = [];

    if (workspace.partnersActiveCount > newLimits.partnersLimit) {
        conflicts.push(`partners (${workspace.partnersActiveCount} active, new limit: ${newLimits.partnersLimit})`);
    }
    if (workspace.campaignsActiveCount > newLimits.campaignsLimit) {
        conflicts.push(`campaigns (${workspace.campaignsActiveCount} active, new limit: ${newLimits.campaignsLimit})`);
    }

    return conflicts;
};
