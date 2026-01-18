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
}

export interface ScoredLead extends Lead {
  score: number; // 0-100
  tier: "A" | "B" | "C";
  matchDetails: MatchDetails;
  enrichmentData?: EnrichmentData;
}

export interface MatchDetails {
  industryMatch: number; // 0-30 points
  sizeMatch: number; // 0-20 points
  geoMatch: number; // 0-20 points
  titleMatch: number; // 0-20 points
  keywordMatch: number; // 0-10 points
}

export interface EnrichmentData {
  companyDescription?: string;
  employeeCount?: number;
  industry?: string;
  location?: string;
  website?: string;
  techStack?: string[];
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
