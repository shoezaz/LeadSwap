// ====================================
// ICP (Ideal Customer Profile) Types
// ====================================

export interface ICP {
    id: string;
    industries: string[];
    companySizeMin?: number;
    companySizeMax?: number;
    geographies: string[];
    titles: string[];
    keywords: string[];
    rawDescription: string;
    createdAt: Date;
}

// ====================================
// Lead Types
// ====================================

export interface Lead {
    id: string;
    email?: string;
    name?: string;
    company: string;
    title?: string;
    url?: string;
    linkedinUrl?: string;
    enrichmentData?: EnrichmentData;
}

export interface ScoredLead extends Lead {
    score: number; // 0-100
    tier: "A" | "B" | "C";
    matchDetails: MatchDetails;
    enrichmentData?: EnrichmentData;
    intentSignals?: IntentSignal[];
}

export interface MatchDetails {
    industryMatch: number; // 0-30 points
    sizeMatch: number; // 0-20 points
    geoMatch: number; // 0-20 points
    titleMatch: number; // 0-20 points
    keywordMatch: number; // 0-10 points
}

export interface ActivityItem {
    title: string;
    url: string;
    date?: string;
    snippet?: string;
    source: "news" | "social" | "blog" | "other";
}

export interface EnrichmentData {
    companyDescription?: string;
    employeeCount?: number;
    industry?: string;
    location?: string;
    website?: string;
    techStack?: string[];
    socialLinks?: SocialLinks;
    recentActivity?: ActivityItem[];
    emailVerified?: boolean;
    emailCatchall?: boolean;
    emailStatus?: "valid" | "catchall" | "invalid";
    phone?: string;
    fundingInfo?: string;
}

export interface SocialLinks {
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
    instagram?: string;
}

export interface IntentSignal {
    type: IntentSignalType;
    description: string;
    score: number; // 0-20
    detectedAt?: Date;
    sourceUrl?: string;
    emoji?: string;
}

export type IntentSignalType =
    | "pain_point"
    | "funding"
    | "hiring"
    | "hiring_spike"
    | "job_change"
    | "growth"
    | "tech";

export interface RejectionPattern {
    reason: string;
    count: number;
    percentage: number;
    recommendation: string;
    examples: string[];
}

// ====================================
// Scoring Result Types
// ====================================

export interface ScoringResult {
    id: string;
    icpId: string;
    totalLeads: number;
    scoredLeads: ScoredLead[];
    tierBreakdown: TierBreakdown;
    processedAt: Date;
    processingTimeMs: number;
    patterns?: RejectionPattern[];
    recommendations?: string[];
    creditsSaved?: number;
}

export interface TierBreakdown {
    tierA: number; // 80-100
    tierB: number; // 50-79
    tierC: number; // 0-49
}

// ====================================
// CSV Upload Types
// ====================================

export interface CSVColumnMapping {
    email?: number;
    name?: number;
    company: number;
    title?: number;
    url?: number;
    linkedinUrl?: number;
}

export interface CSVUploadResult {
    success: boolean;
    leadsCount: number;
    detectedColumns: string[];
    mapping: CSVColumnMapping;
    leads: Lead[];
}
