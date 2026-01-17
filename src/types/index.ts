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
