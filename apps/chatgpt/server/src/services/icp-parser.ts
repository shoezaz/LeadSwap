import type { ICP } from "../types.js";

/**
 * Parse a natural language ICP description into structured criteria
 * Example input: "SaaS startups, 50-200 employees, France or UK, targeting VP Sales or Head of Growth"
 */
export function parseICPDescription(description: string): Omit<ICP, "id" | "createdAt"> {
  const lowerDesc = description.toLowerCase();
  
  // Extract industries
  const industries = extractIndustries(lowerDesc);
  
  // Extract company size
  const { min, max } = extractCompanySize(lowerDesc);
  
  // Extract geographies
  const geographies = extractGeographies(lowerDesc);
  
  // Extract job titles
  const titles = extractTitles(lowerDesc);
  
  // Extract keywords (remaining important terms)
  const keywords = extractKeywords(description);

  return {
    industries,
    companySizeMin: min,
    companySizeMax: max,
    geographies,
    titles,
    keywords,
    rawDescription: description,
  };
}

function extractIndustries(text: string): string[] {
  const industryPatterns = [
    { pattern: /saas/i, value: "SaaS" },
    { pattern: /fintech/i, value: "Fintech" },
    { pattern: /healthtech|health\s*tech/i, value: "HealthTech" },
    { pattern: /greentech|green\s*tech|cleantech/i, value: "GreenTech" },
    { pattern: /edtech|ed\s*tech/i, value: "EdTech" },
    { pattern: /e-?commerce/i, value: "E-commerce" },
    { pattern: /b2b/i, value: "B2B" },
    { pattern: /b2c/i, value: "B2C" },
    { pattern: /startup/i, value: "Startup" },
    { pattern: /enterprise/i, value: "Enterprise" },
    { pattern: /tech|technology/i, value: "Technology" },
    { pattern: /software/i, value: "Software" },
    { pattern: /consulting/i, value: "Consulting" },
    { pattern: /marketing/i, value: "Marketing" },
    { pattern: /agency|agencies/i, value: "Agency" },
  ];

  return industryPatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ value }) => value);
}

function extractCompanySize(text: string): { min?: number; max?: number } {
  // Match patterns like "50-200 employees", "200+ employees", "<100 employees"
  const rangeMatch = text.match(/(\d+)\s*[-–to]\s*(\d+)\s*(?:employees?|people|staff)/i);
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) };
  }

  const minMatch = text.match(/(\d+)\+\s*(?:employees?|people|staff)/i);
  if (minMatch) {
    return { min: parseInt(minMatch[1]) };
  }

  const maxMatch = text.match(/(?:less than|under|<)\s*(\d+)\s*(?:employees?|people|staff)/i);
  if (maxMatch) {
    return { max: parseInt(maxMatch[1]) };
  }

  // Size keywords
  if (/small\s*(?:business|company|companies)/i.test(text)) {
    return { min: 1, max: 50 };
  }
  if (/mid-?size|medium/i.test(text)) {
    return { min: 50, max: 500 };
  }
  if (/large|enterprise/i.test(text)) {
    return { min: 500 };
  }

  return {};
}

function extractGeographies(text: string): string[] {
  const geoPatterns = [
    { pattern: /\bfrance\b/i, value: "France" },
    { pattern: /\buk\b|\bunited kingdom\b|\bbritain\b/i, value: "United Kingdom" },
    { pattern: /\busa\b|\bunited states\b|\bamerica\b/i, value: "United States" },
    { pattern: /\bgermany\b/i, value: "Germany" },
    { pattern: /\bspain\b/i, value: "Spain" },
    { pattern: /\bitaly\b/i, value: "Italy" },
    { pattern: /\bnetherlands\b|\bholland\b/i, value: "Netherlands" },
    { pattern: /\bbelgium\b/i, value: "Belgium" },
    { pattern: /\bswitzerland\b/i, value: "Switzerland" },
    { pattern: /\bcanada\b/i, value: "Canada" },
    { pattern: /\baustralia\b/i, value: "Australia" },
    { pattern: /\beurope\b/i, value: "Europe" },
    { pattern: /\bemea\b/i, value: "EMEA" },
    { pattern: /\bapac\b/i, value: "APAC" },
    { pattern: /\bparis\b/i, value: "Paris" },
    { pattern: /\blondon\b/i, value: "London" },
    { pattern: /\bberlin\b/i, value: "Berlin" },
    { pattern: /\bnew york\b/i, value: "New York" },
    { pattern: /\bsan francisco\b|\bsf\b/i, value: "San Francisco" },
  ];

  return geoPatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ value }) => value);
}

function extractTitles(text: string): string[] {
  const titlePatterns = [
    { pattern: /\bceo\b/i, value: "CEO" },
    { pattern: /\bcto\b/i, value: "CTO" },
    { pattern: /\bcfo\b/i, value: "CFO" },
    { pattern: /\bcmo\b/i, value: "CMO" },
    { pattern: /\bcoo\b/i, value: "COO" },
    { pattern: /\bvp\s*(?:of\s*)?sales\b/i, value: "VP Sales" },
    { pattern: /\bvp\s*(?:of\s*)?marketing\b/i, value: "VP Marketing" },
    { pattern: /\bvp\s*(?:of\s*)?growth\b/i, value: "VP Growth" },
    { pattern: /\bhead\s*(?:of\s*)?sales\b/i, value: "Head of Sales" },
    { pattern: /\bhead\s*(?:of\s*)?marketing\b/i, value: "Head of Marketing" },
    { pattern: /\bhead\s*(?:of\s*)?growth\b/i, value: "Head of Growth" },
    { pattern: /\bdirector\s*(?:of\s*)?sales\b/i, value: "Director of Sales" },
    { pattern: /\bdirector\s*(?:of\s*)?marketing\b/i, value: "Director of Marketing" },
    { pattern: /\bsales\s*director\b/i, value: "Sales Director" },
    { pattern: /\bmarketing\s*director\b/i, value: "Marketing Director" },
    { pattern: /\bfounder\b/i, value: "Founder" },
    { pattern: /\bco-?founder\b/i, value: "Co-Founder" },
    { pattern: /\bowner\b/i, value: "Owner" },
    { pattern: /\bmanager\b/i, value: "Manager" },
  ];

  return titlePatterns
    .filter(({ pattern }) => pattern.test(text))
    .map(({ value }) => value);
}

function extractKeywords(text: string): string[] {
  // Remove common words and extract important terms
  const stopWords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "are", "was", "were", "been",
    "be", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "must", "shall", "can", "need",
    "i", "you", "he", "she", "it", "we", "they", "who", "which", "that",
    "this", "these", "those", "am", "my", "your", "their", "our", "its",
    "employees", "company", "companies", "targeting", "looking", "want",
  ]);

  const words = text
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word.toLowerCase()));

  // Return unique keywords
  return [...new Set(words)].slice(0, 10);
}

/**
 * Generate an ICP ID
 */
export function generateICPId(): string {
  return `icp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Format ICP for display
 */
export function formatICPSummary(icp: ICP): string {
  const parts: string[] = [];
  
  if (icp.industries.length > 0) {
    parts.push(`Industries: ${icp.industries.join(", ")}`);
  }
  
  if (icp.companySizeMin || icp.companySizeMax) {
    const sizeStr = icp.companySizeMin && icp.companySizeMax
      ? `${icp.companySizeMin}-${icp.companySizeMax}`
      : icp.companySizeMin
        ? `${icp.companySizeMin}+`
        : `<${icp.companySizeMax}`;
    parts.push(`Company size: ${sizeStr} employees`);
  }
  
  if (icp.geographies.length > 0) {
    parts.push(`Geographies: ${icp.geographies.join(", ")}`);
  }
  
  if (icp.titles.length > 0) {
    parts.push(`Titles: ${icp.titles.join(", ")}`);
  }
  
  return parts.join("\n");
}
