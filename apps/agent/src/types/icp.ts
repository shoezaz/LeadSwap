/**
 * ICP (Ideal Customer Profile) Type Definitions
 */

export interface ICP {
    userId: string;
    industries: string[];      // ex: ["SaaS", "FinTech", "HealthTech"]
    companySizes: {
        min: number;
        max: number;
    };
    geoTargets: string[];      // ex: ["France", "UK", "Germany"]
    titles: string[];          // ex: ["VP Sales", "Head of Growth", "CEO"]
    keywords: string[];        // mots-clés supplémentaires
    excludeKeywords: string[]; // mots-clés à exclure
    createdAt: Date;
    updatedAt: Date;
}

export interface ICPParseResult {
    success: boolean;
    icp?: Partial<ICP>;
    rawInput: string;
    confidence: number;        // 0-1 confidence score
    parsedFields: string[];    // champs détectés
    warnings: string[];        // avertissements (ex: champ non reconnu)
}

export interface ICPMatchResult {
    leadId: string;
    icpScore: number;          // 0-60 points
    matchedCriteria: {
        industry: { matched: boolean; score: number; details?: string };
        companySize: { matched: boolean; score: number; details?: string };
        geography: { matched: boolean; score: number; details?: string };
        title: { matched: boolean; score: number; details?: string };
        keywords: { matched: boolean; score: number; details?: string };
    };
    reasoning: string[];
}

// Constantes pour les patterns de parsing
export const INDUSTRY_PATTERNS: Record<string, string[]> = {
    saas: ["saas", "software as a service", "cloud software"],
    fintech: ["fintech", "financial technology", "banking tech"],
    healthtech: ["healthtech", "health tech", "healthcare technology", "medtech"],
    edtech: ["edtech", "education technology", "e-learning"],
    ecommerce: ["ecommerce", "e-commerce", "online retail", "marketplace"],
    cybersecurity: ["cybersecurity", "cyber security", "infosec", "security"],
    ai: ["ai", "artificial intelligence", "machine learning", "ml"],
    b2b: ["b2b", "business to business", "enterprise"],
    b2c: ["b2c", "consumer", "consumer tech"],
    greentech: ["greentech", "cleantech", "sustainability", "climate tech"],
    proptech: ["proptech", "real estate tech", "property technology"],
    hrtech: ["hrtech", "hr tech", "human resources technology"],
    logistics: ["logistics", "supply chain", "shipping tech"],
    legaltech: ["legaltech", "legal tech", "law tech"],
    insurtech: ["insurtech", "insurance technology"],
};

export const SIZE_PATTERNS: Record<string, { min: number; max: number }> = {
    startup: { min: 1, max: 50 },
    "early-stage": { min: 1, max: 50 },
    "small": { min: 10, max: 100 },
    "smb": { min: 10, max: 200 },
    "mid-market": { min: 100, max: 500 },
    "medium": { min: 50, max: 500 },
    "enterprise": { min: 500, max: 10000 },
    "large": { min: 1000, max: 100000 },
};

export const TITLE_PATTERNS: string[] = [
    "ceo", "cto", "cfo", "coo", "cmo", "cro", "cpo",
    "founder", "co-founder", "cofounder",
    "vp", "vice president",
    "head of", "director",
    "manager",
    "chief",
    "president",
    "owner",
    "partner",
];

export const GEO_PATTERNS: Record<string, string[]> = {
    france: ["france", "french", "fr", "paris"],
    uk: ["uk", "united kingdom", "britain", "british", "england", "london"],
    germany: ["germany", "german", "de", "berlin", "munich"],
    usa: ["usa", "us", "united states", "america", "american"],
    europe: ["europe", "european", "eu", "emea"],
    spain: ["spain", "spanish", "es", "madrid", "barcelona"],
    italy: ["italy", "italian", "it", "milan", "rome"],
    netherlands: ["netherlands", "dutch", "nl", "amsterdam"],
    canada: ["canada", "canadian", "toronto", "vancouver"],
    australia: ["australia", "australian", "sydney", "melbourne"],
};
