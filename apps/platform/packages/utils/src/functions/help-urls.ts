import { HELP_BASE_URL, DOCS_BASE_URL } from "../constants";

/**
 * Pre-defined help article URLs for consistent usage across the app.
 * All URLs are automatically configured for the current environment.
 */
export const HELP_ARTICLES = {
    // Creator-facing
    receivingPayouts: `${HELP_BASE_URL}/article/receiving-payouts`,
    navigatingPartnerProgram: `${HELP_BASE_URL}/article/navigating-partner-program`,
    partnerProfile: `${HELP_BASE_URL}/article/partner-profile`,
    communicatingWithPrograms: `${HELP_BASE_URL}/article/communicating-with-programs`,
    dualSidedIncentives: `${HELP_BASE_URL}/article/dual-sided-incentives`,
    campaignsBounties: `${HELP_BASE_URL}/article/campaigns-bounties`,

    // Business app
    dubPartners: `${HELP_BASE_URL}/article/dub-partners`,
    partnerPayouts: `${HELP_BASE_URL}/article/partner-payouts`,
    partnerGroups: `${HELP_BASE_URL}/article/partner-groups`,
    programResources: `${HELP_BASE_URL}/article/program-resources`,
    managingProgramPartners: `${HELP_BASE_URL}/article/managing-program-partners`,
    invitingPartners: `${HELP_BASE_URL}/article/inviting-partners`,
    campaignsAnalytics: `${HELP_BASE_URL}/article/campaigns-analytics`,
    campaignsApplications: `${HELP_BASE_URL}/article/campaigns-applications`,
    partnerCommissionsClawbacks: `${HELP_BASE_URL}/article/partner-commissions-clawbacks`,
    howToCreateLink: `${HELP_BASE_URL}/article/how-to-create-link`,

    // Migration guides
    migratingFromRewardful: `${HELP_BASE_URL}/article/migrating-from-rewardful`,
    migratingFromTolt: `${HELP_BASE_URL}/article/migrating-from-tolt`,
    migratingFromPartnerstack: `${HELP_BASE_URL}/article/migrating-from-partnerstack`,
    migratingFromFirstpromoter: `${HELP_BASE_URL}/article/migrating-from-firstpromoter`,

    // Paywall features
    passwordProtectedLinks: `${HELP_BASE_URL}/article/password-protected-links`,
    partnerRewards: `${HELP_BASE_URL}/article/partner-rewards`,
    messagingPartners: `${HELP_BASE_URL}/article/messaging-partners`,
    abTesting: `${HELP_BASE_URL}/article/ab-testing`,
} as const;

/**
 * Build a help article URL from a slug
 */
export function getHelpArticleUrl(slug: string): string {
    return `${HELP_BASE_URL}/article/${slug}`;
}

/**
 * Build a docs URL from a path
 */
export function getDocsUrl(path: string): string {
    return `${DOCS_BASE_URL}/${path}`;
}

/**
 * Get the main help page URL
 */
export function getHelpUrl(): string {
    return HELP_BASE_URL;
}
