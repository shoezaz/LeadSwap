/**
 * ICP Parser - Parse natural language ICP definitions
 * 
 * Examples:
 * - "SaaS startups, 50-200 employees, France, VP Sales"
 * - "FinTech companies in Europe, Series B+, Head of Growth"
 * - "B2B enterprise, 500+ employees, USA/UK, C-level executives"
 */

import {
    ICP,
    ICPParseResult,
    INDUSTRY_PATTERNS,
    SIZE_PATTERNS,
    TITLE_PATTERNS,
    GEO_PATTERNS,
} from "../types/icp";

/**
 * Parse a natural language ICP definition into structured data
 */
export function parseICP(input: string, userId: string): ICPParseResult {
    const normalizedInput = input.toLowerCase().trim();
    const parsedFields: string[] = [];
    const warnings: string[] = [];

    // Extract industries
    const industries = extractIndustries(normalizedInput);
    if (industries.length > 0) parsedFields.push("industries");

    // Extract company sizes
    const companySizes = extractCompanySizes(normalizedInput);
    if (companySizes.min > 0 || companySizes.max < Infinity) parsedFields.push("companySizes");

    // Extract geographies
    const geoTargets = extractGeographies(normalizedInput);
    if (geoTargets.length > 0) parsedFields.push("geoTargets");

    // Extract titles
    const titles = extractTitles(normalizedInput);
    if (titles.length > 0) parsedFields.push("titles");

    // Extract keywords (remaining important words)
    const keywords = extractKeywords(normalizedInput, industries, geoTargets, titles);
    if (keywords.length > 0) parsedFields.push("keywords");

    // Calculate confidence based on parsed fields
    const confidence = calculateConfidence(parsedFields, normalizedInput);

    // Generate warnings
    if (parsedFields.length < 2) {
        warnings.push("Few criteria detected. Consider adding more details for better matching.");
    }
    if (industries.length === 0) {
        warnings.push("No industry detected. Add industry keywords like 'SaaS', 'FinTech', etc.");
    }
    if (geoTargets.length === 0) {
        warnings.push("No geography detected. Add location like 'France', 'UK', 'Europe', etc.");
    }

    const icp: Partial<ICP> = {
        userId,
        industries,
        companySizes,
        geoTargets,
        titles,
        keywords,
        excludeKeywords: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return {
        success: parsedFields.length >= 1,
        icp,
        rawInput: input,
        confidence,
        parsedFields,
        warnings,
    };
}

/**
 * Extract industries from input
 */
function extractIndustries(input: string): string[] {
    const found: string[] = [];

    for (const [industry, patterns] of Object.entries(INDUSTRY_PATTERNS)) {
        if (patterns.some(pattern => input.includes(pattern))) {
            found.push(industry);
        }
    }

    return [...new Set(found)];
}

/**
 * Extract company size range from input
 */
function extractCompanySizes(input: string): { min: number; max: number } {
    // Check for explicit ranges like "50-200 employees"
    const rangeMatch = input.match(/(\d+)\s*[-–to]+\s*(\d+)\s*(?:employees?|people|staff)?/i);
    if (rangeMatch) {
        return {
            min: parseInt(rangeMatch[1], 10),
            max: parseInt(rangeMatch[2], 10),
        };
    }

    // Check for "X+ employees"
    const plusMatch = input.match(/(\d+)\+?\s*(?:employees?|people|staff)/i);
    if (plusMatch) {
        return {
            min: parseInt(plusMatch[1], 10),
            max: 100000,
        };
    }

    // Check for size keywords
    for (const [keyword, range] of Object.entries(SIZE_PATTERNS)) {
        if (input.includes(keyword)) {
            return range;
        }
    }

    // Check for funding stages as size proxies
    if (input.includes("series a")) return { min: 20, max: 100 };
    if (input.includes("series b")) return { min: 50, max: 300 };
    if (input.includes("series c") || input.includes("series d")) return { min: 100, max: 1000 };
    if (input.includes("seed")) return { min: 5, max: 50 };

    return { min: 0, max: 100000 };
}

/**
 * Extract geographies from input
 */
function extractGeographies(input: string): string[] {
    const found: string[] = [];

    for (const [geo, patterns] of Object.entries(GEO_PATTERNS)) {
        if (patterns.some(pattern => {
            // Word boundary check to avoid false positives
            const regex = new RegExp(`\\b${pattern}\\b`, 'i');
            return regex.test(input);
        })) {
            found.push(geo);
        }
    }

    return [...new Set(found)];
}

/**
 * Extract job titles from input
 */
function extractTitles(input: string): string[] {
    const found: string[] = [];

    // Direct title patterns
    for (const pattern of TITLE_PATTERNS) {
        if (input.includes(pattern)) {
            // Try to extract the full title
            const fullTitle = extractFullTitle(input, pattern);
            if (fullTitle) {
                found.push(fullTitle);
            }
        }
    }

    // Specific role patterns
    const rolePatterns = [
        /vp\s+(?:of\s+)?(\w+)/gi,
        /head\s+of\s+(\w+)/gi,
        /director\s+of\s+(\w+)/gi,
        /(\w+)\s+manager/gi,
        /chief\s+(\w+)\s+officer/gi,
    ];

    for (const pattern of rolePatterns) {
        const matches = input.matchAll(pattern);
        for (const match of matches) {
            found.push(match[0].trim());
        }
    }

    // C-level pattern
    if (input.includes("c-level") || input.includes("c level") || input.includes("executive")) {
        found.push("C-Level");
    }

    return [...new Set(found.map(t => formatTitle(t)))];
}

/**
 * Extract full title context
 */
function extractFullTitle(input: string, pattern: string): string | null {
    const idx = input.indexOf(pattern);
    if (idx === -1) return null;

    // Get surrounding context (up to 30 chars before and after)
    const start = Math.max(0, idx - 30);
    const end = Math.min(input.length, idx + pattern.length + 30);
    const context = input.substring(start, end);

    // Find the title phrase
    const words = context.split(/[\s,;]+/);
    const patternWords = pattern.split(/\s+/);
    const patternIdx = words.findIndex(w => w.includes(patternWords[0]));

    if (patternIdx === -1) return pattern;

    // Include up to 3 words
    const titleWords = words.slice(patternIdx, patternIdx + 3);
    return titleWords.join(" ");
}

/**
 * Format a title nicely
 */
function formatTitle(title: string): string {
    return title
        .split(/\s+/)
        .map(word => {
            if (word.length <= 2) return word.toUpperCase();
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(" ");
}

/**
 * Extract additional keywords
 */
function extractKeywords(
    input: string,
    industries: string[],
    geos: string[],
    titles: string[]
): string[] {
    // Remove already identified terms
    let remaining = input;

    // Remove industries
    for (const [, patterns] of Object.entries(INDUSTRY_PATTERNS)) {
        for (const p of patterns) {
            remaining = remaining.replace(new RegExp(p, 'gi'), '');
        }
    }

    // Remove geos
    for (const [, patterns] of Object.entries(GEO_PATTERNS)) {
        for (const p of patterns) {
            remaining = remaining.replace(new RegExp(`\\b${p}\\b`, 'gi'), '');
        }
    }

    // Remove common words
    const stopWords = [
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
        'employees', 'employee', 'people', 'staff', 'companies', 'company',
        'startups', 'startup', 'targeting', 'target', 'looking', 'want',
        'interested', 'focus', 'ideally', 'preferably', 'mainly',
    ];

    const words = remaining
        .split(/[\s,;.!?]+/)
        .filter(w => w.length > 2)
        .filter(w => !stopWords.includes(w))
        .filter(w => !/^\d+$/.test(w));

    return [...new Set(words)].slice(0, 10);
}

/**
 * Calculate confidence score
 */
function calculateConfidence(parsedFields: string[], input: string): number {
    // Base confidence from number of fields
    let confidence = Math.min(parsedFields.length * 0.2, 0.8);

    // Bonus for longer, detailed input
    if (input.length > 50) confidence += 0.1;
    if (input.length > 100) confidence += 0.1;

    return Math.min(confidence, 1);
}

/**
 * Build an Exa search query from an ICP
 */
export function buildExaQueryFromICP(icp: Partial<ICP>): string {
    const parts: string[] = [];

    if (icp.industries && icp.industries.length > 0) {
        parts.push(icp.industries.join(" OR "));
    }

    if (icp.geoTargets && icp.geoTargets.length > 0) {
        parts.push(`(${icp.geoTargets.join(" OR ")})`);
    }

    if (icp.titles && icp.titles.length > 0) {
        parts.push(`(${icp.titles.join(" OR ")})`);
    }

    if (icp.companySizes) {
        if (icp.companySizes.max < 100) {
            parts.push("startup OR early-stage");
        } else if (icp.companySizes.max < 500) {
            parts.push("growing company OR mid-market");
        } else {
            parts.push("enterprise OR large company");
        }
    }

    if (icp.keywords && icp.keywords.length > 0) {
        parts.push(icp.keywords.slice(0, 5).join(" "));
    }

    return parts.join(" ") || "B2B company";
}
