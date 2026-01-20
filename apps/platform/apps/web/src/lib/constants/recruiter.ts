/**
 * Recruiter and Discovery Service Configuration Constants
 * Centralizes magic numbers for better maintainability
 */

export const RECRUITER_CONFIG = {
    /** Minimum match score (0-100) required to create a prospect */
    MIN_MATCH_SCORE: 60,

    /** Maximum prospects per campaign before skipping auto-recruit */
    MAX_PROSPECTS_PER_CAMPAIGN: 50,

    /** Number of internal prospects needed before skipping external search */
    INTERNAL_PROSPECTS_THRESHOLD: 3,

    /** Maximum number of campaigns to process in a single cron run */
    MAX_CAMPAIGNS_PER_CRON: 10,

    /** Maximum search results to fetch (before filtering) */
    MAX_SEARCH_RESULTS: 5,

    /** Maximum external candidates to audit per bounty */
    MAX_EXTERNAL_CANDIDATES_PER_BOUNTY: 3,
} as const;

export const DISCOVERY_CONFIG = {
    /** Minimum quality score (0-10) to accept search results */
    SEARCH_QUALITY_THRESHOLD: 7,

    /** Maximum retries for smart search refinement */
    MAX_SEARCH_RETRIES: 2,

    /** Maximum content length to send to LLM (chars) */
    MAX_CONTENT_LENGTH: 15000,

    /** Temperature for objective scoring (lower = more deterministic) */
    AUDIT_TEMPERATURE: 0.3,

    /** Delay between API calls to respect rate limits (ms) */
    API_RATE_LIMIT_DELAY_MS: 500,

    /** Timeout for scraping operations (ms) */
    SCRAPE_TIMEOUT_MS: 15000,
} as const;

export const VALIDATION_CONFIG = {
    /** Maximum scraped content length for validation prompts */
    MAX_SCRAPED_CONTENT_LENGTH: 10000,
} as const;

export const CREDITS_CONFIG = {
    /** Percentage threshold for first warning email */
    FIRST_WARNING_THRESHOLD: 20,

    /** Percentage threshold for second warning email (0 = depleted) */
    SECOND_WARNING_THRESHOLD: 0,
} as const;

/** Authorized domains for creator profile discovery */
export const AUTHORIZED_CREATOR_DOMAINS = [
    "youtube.com",
    "youtu.be",
    "linkedin.com/in/",
    "twitter.com",
    "x.com",
    "instagram.com",
    "tiktok.com",
    "substack.com",
    "medium.com",
] as const;
