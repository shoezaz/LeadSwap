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
  socialLinks?: SocialLinks;
  emailVerified?: boolean;
  phone?: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
}

export interface IntentSignal {
  type: string; // "pain_point" | "funding" | "hiring" | "tech"
  description: string;
  score: number; // 0-20
  detectedAt?: Date;
  sourceUrl?: string;
  emoji?: string;
}

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

// ====================================
// Agent Manager Types
// ====================================

export type AgentType = "search" | "enrichment" | "scoring" | "validation" | "export";
export type AgentStatus = "idle" | "running" | "completed" | "failed" | "queued";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  status: AgentStatus;
  currentTask?: Task;
  completedTasks: number;
  failedTasks: number;
  createdAt: Date;
  lastActiveAt?: Date;
}

export interface Task {
  id: string;
  type: AgentType;
  priority: TaskPriority;
  status: AgentStatus;
  assignedAgentId?: string;
  payload: TaskPayload;
  result?: TaskResult;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  retryCount: number;
  maxRetries: number;
  dependencies?: string[]; // IDs of tasks that must complete first
}

export type TaskPayload =
  | { type: "search"; icp: ICP; numResults: number }
  | { type: "enrichment"; leads: Lead[] }
  | { type: "scoring"; leads: Lead[]; icp: ICP }
  | { type: "validation"; leads: Lead[] }
  | { type: "export"; scoredLeads: ScoredLead[]; format: "csv" | "json" };

export type TaskResult =
  | { type: "search"; leads: Lead[] }
  | { type: "enrichment"; enrichedLeads: Lead[] }
  | { type: "scoring"; scoringResult: ScoringResult }
  | { type: "validation"; validatedLeads: Lead[] }
  | { type: "export"; downloadUrl: string; filename?: string; leadsCount?: number };

export interface AgentPool {
  agents: Agent[];
  taskQueue: Task[];
  completedTasks: Task[];
  failedTasks: Task[];
}

export interface TaskOrchestrationPlan {
  tasks: Task[];
  estimatedTimeMs: number;
  parallelizable: boolean;
  workflow: string; // "sequential" | "parallel" | "hybrid"
}
