// Lead types
export interface Lead {
  id: string;
  title: string;
  url: string;
  text?: string;
  publishedDate?: string;
  author?: string;
  score?: number;
}

export interface EnrichedLead extends Lead {
  verified: boolean;
  pageTitle?: string;
  emails: string[];
  techStack: string[];
  socialLinks: SocialLinks;
  contentSnippet?: string;
  enrichedAt: Date;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
}

// Search types
export interface SearchOptions {
  query: string;
  numResults?: number;
  type?: 'neural' | 'keyword';
  useAutoprompt?: boolean;
}

export interface SimilarityOptions {
  url: string;
  numResults?: number;
  excludeDomains?: string[];
}

// Scraping types
export interface ScrapeResult {
  title: string;
  contentLength: number;
  emails: string[];
  techStack: string[];
  socialLinks: SocialLinks;
  rawContent?: string;
}

// Agent types
export interface AgentConfig {
  exaApiKey: string;
  lightpandaEndpoint?: string;
  maxConcurrentScrapes?: number;
}

export interface AgentRunResult {
  query: string;
  leads: EnrichedLead[];
  startedAt: Date;
  completedAt: Date;
  stats: {
    found: number;
    verified: number;
    failed: number;
  };
}

// ============================================
// Validation & Scoring Types (Sprint 1)
// ============================================

/**
 * Lead from CSV upload, before validation
 */
export interface ValidationLead {
  id: string;
  email: string;
  name: string;
  company: string;
  title?: string;
  linkedinUrl?: string;
  website?: string;
  originalData: Record<string, string>; // raw CSV data
}

/**
 * Lead after scoring and tier assignment
 */
export interface ScoredLead extends ValidationLead {
  score: number;              // 0-100
  tier: 'tier1' | 'tier2' | 'rejected';
  icpMatchScore: number;      // 0-60 points
  validationBonus: number;    // 0-20 points
  intentBoost: number;        // 0-20 points
  reasoning: string[];
  intentSignals: IntentSignal[];
  rejectionReasons?: string[];
  validatedAt: Date;
}

/**
 * Intent signal detected for a lead
 */
export interface IntentSignal {
  type: 'pain_point' | 'funding' | 'job_change' | 'hiring';
  description: string;
  sourceUrl?: string;
  detectedAt: Date;
  boost: number;              // points added (0-20)
  emoji: string;              // for display (e.g., 🔥, 💰, 🆕, 📈)
}

/**
 * Complete validation result for a batch of leads
 */
export interface ValidationResult {
  id: string;
  userId: string;
  totalLeads: number;
  tier1: ScoredLead[];
  tier2: ScoredLead[];
  rejected: ScoredLead[];
  stats: {
    tier1Count: number;
    tier1Percentage: number;
    tier2Count: number;
    tier2Percentage: number;
    rejectedCount: number;
    rejectedPercentage: number;
    avgScore: number;
    processingTimeMs: number;
  };
  patterns: RejectionPattern[];
  recommendations: string[];
  creditsSaved: number;       // rejected_count × €5/lead
  createdAt: Date;
}

/**
 * Pattern detected in rejected leads
 */
export interface RejectionPattern {
  reason: string;
  count: number;
  percentage: number;
  examples: string[];
  recommendation: string;
}

/**
 * CSV parse result
 */
export interface CSVParseResult {
  success: boolean;
  leads: ValidationLead[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
  columnMapping: Record<string, string>;
  warnings: string[];
  errors: string[];
}
