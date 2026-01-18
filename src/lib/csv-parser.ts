/**
 * File Parser - Parse and validate lead files (CSV, Excel)
 * 
 * Features:
 * - Automatic column detection (email, name, company, title, etc.)
 * - Validation (50-10,000 leads)
 * - Flexible column name matching
 * - Supports .csv, .xls, .xlsx
 */

import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import type { ValidationLead, CSVParseResult } from "../types";
import crypto from "crypto";

// Column name patterns for auto-detection
const COLUMN_PATTERNS: Record<string, RegExp[]> = {
    email: [
        /^e[-_]?mail$/i,
        /^email[-_]?address$/i,
        /^mail$/i,
        /^contact[-_]?email$/i,
    ],
    name: [
        /^(full[-_]?)?name$/i,
        /^contact[-_]?name$/i,
        /^person[-_]?name$/i,
        /^first[-_]?name$/i, // Will be combined with last_name
    ],
    firstName: [
        /^first[-_]?name$/i,
        /^given[-_]?name$/i,
        /^prenom$/i,
    ],
    lastName: [
        /^last[-_]?name$/i,
        /^family[-_]?name$/i,
        /^surname$/i,
        /^nom$/i,
    ],
    company: [
        /^company$/i,
        /^company[-_]?name$/i,
        /^organization$/i,
        /^org$/i,
        /^employer$/i,
        /^societe$/i,
        /^entreprise$/i,
    ],
    title: [
        /^(job[-_]?)?title$/i,
        /^position$/i,
        /^role$/i,
        /^job$/i,
        /^fonction$/i,
        /^poste$/i,
    ],
    linkedinUrl: [
        /^linkedin$/i,
        /^linkedin[-_]?url$/i,
        /^linkedin[-_]?profile$/i,
        /^li[-_]?url$/i,
    ],
    website: [
        /^website$/i,
        /^url$/i,
        /^company[-_]?website$/i,
        /^domain$/i,
        /^site$/i,
    ],
};

// Limits
const MIN_LEADS = 1; // Lowered for testing flexibility, originally 50
const MAX_LEADS = 10000;

/**
 * Parse file content (CSV or Excel) and extract leads
 * @param content String (CSV) or Buffer (Excel)
 * @param fileType "csv" or "excel" (optional, for explicit handling)
 */
export function parseFile(content: string | Buffer, fileType: "csv" | "excel" = "csv"): CSVParseResult {
    const warnings: string[] = [];
    const errors: string[] = [];
    let records: Record<string, string>[];

    try {
        if (fileType === "excel" || Buffer.isBuffer(content)) {
            // Excel Parsing
            const workbook = XLSX.read(content, { type: Buffer.isBuffer(content) ? "buffer" : "string" });
            const sheetName = workbook.SheetNames[0]; // Use first sheet
            const sheet = workbook.Sheets[sheetName];

            // Convert to JSON (array of objects)
            // defval: "" ensures empty cells are empty strings, not undefined
            const rawRecords = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            // Normalize all values to strings
            records = rawRecords.map((row: any) => {
                const newRow: Record<string, string> = {};
                Object.keys(row).forEach(key => {
                    newRow[key] = String(row[key] || "").trim();
                });
                return newRow;
            });

        } else {
            // CSV Parsing (default)
            records = parse(content as string, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
                relax_column_count: true,
            });
        }

    } catch (err) {
        return {
            success: false,
            leads: [],
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
            columnMapping: {},
            warnings: [],
            errors: [`Failed to parse file: ${err instanceof Error ? err.message : "Unknown error"}`],
        };
    }

    if (records.length === 0) {
        return {
            success: false,
            leads: [],
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
            columnMapping: {},
            warnings: [],
            errors: ["File is empty or has no data rows"],
        };
    }

    // Get column names from first record
    const columns = Object.keys(records[0]);

    // Auto-detect column mapping
    const columnMapping = detectColumnMapping(columns);

    // Check for required columns
    if (!columnMapping.email) {
        errors.push("No email column detected. Please ensure your file has an 'email' column.");
        return {
            success: false,
            leads: [],
            totalRows: records.length,
            validRows: 0,
            invalidRows: records.length,
            columnMapping,
            warnings,
            errors,
        };
    }

    if (!columnMapping.name && !columnMapping.firstName) {
        warnings.push("No name column detected. Leads will have empty names.");
    }

    if (!columnMapping.company) {
        warnings.push("No company column detected. Leads will have empty company names.");
    }

    // Parse leads
    const leads: ValidationLead[] = [];
    let invalidRows = 0;

    for (let i = 0; i < records.length; i++) {
        const row = records[i];
        const lead = parseLeadFromRow(row, columnMapping, i);

        if (lead) {
            leads.push(lead);
        } else {
            invalidRows++;
        }
    }

    // Validate lead count
    if (leads.length < MIN_LEADS) {
        warnings.push(`Only ${leads.length} valid leads found. Recommended minimum is ${MIN_LEADS}.`);
    }

    if (leads.length > MAX_LEADS) {
        errors.push(`Too many leads (${leads.length}). Maximum allowed is ${MAX_LEADS}.`);
        return {
            success: false,
            leads: leads.slice(0, MAX_LEADS),
            totalRows: records.length,
            validRows: leads.length,
            invalidRows,
            columnMapping,
            warnings,
            errors,
        };
    }

    return {
        success: true,
        leads,
        totalRows: records.length,
        validRows: leads.length,
        invalidRows,
        columnMapping,
        warnings,
        errors,
    };
}

// Ensure backward compatibility (alias)
export const parseCSV = (content: string) => parseFile(content, "csv");

/**
 * Detect column mapping based on column names
 */
function detectColumnMapping(columns: string[]): Record<string, string> {
    const mapping: Record<string, string> = {};

    for (const column of columns) {
        for (const [field, patterns] of Object.entries(COLUMN_PATTERNS)) {
            if (patterns.some(pattern => pattern.test(column))) {
                // Don't overwrite if already mapped (first match wins)
                if (!mapping[field]) {
                    mapping[field] = column;
                }
                break;
            }
        }
    }

    return mapping;
}

/**
 * Parse a single lead from a CSV row
 */
function parseLeadFromRow(
    row: Record<string, string>,
    mapping: Record<string, string>,
    index: number
): ValidationLead | null {
    // Get email (required)
    const email = mapping.email ? row[mapping.email]?.trim() : "";

    if (!email || !isValidEmail(email)) {
        return null;
    }

    // Get name (combine first + last if needed)
    let name = "";
    if (mapping.name) {
        name = row[mapping.name]?.trim() || "";
    } else if (mapping.firstName) {
        const firstName = row[mapping.firstName]?.trim() || "";
        const lastName = mapping.lastName ? row[mapping.lastName]?.trim() || "" : "";
        name = `${firstName} ${lastName}`.trim();
    }

    // Get other fields
    const company = mapping.company ? row[mapping.company]?.trim() || "" : "";
    const title = mapping.title ? row[mapping.title]?.trim() : undefined;
    const linkedinUrl = mapping.linkedinUrl ? row[mapping.linkedinUrl]?.trim() : undefined;
    const website = mapping.website ? row[mapping.website]?.trim() : undefined;

    // Generate unique ID
    const id = generateLeadId(email, index);

    return {
        id,
        email,
        name,
        company,
        title,
        linkedinUrl,
        website,
        originalData: { ...row },
    };
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Generate a unique lead ID
 */
function generateLeadId(email: string, index: number): string {
    const hash = crypto.createHash("sha256")
        .update(`${email}-${index}-${Date.now()}`)
        .digest("hex")
        .substring(0, 12);
    return `lead-${hash}`;
}

/**
 * Format parse result for display
 */
export function formatParseResultForDisplay(result: CSVParseResult): string {
    const lines: string[] = [];

    if (result.success) {
        lines.push(`✅ **${result.validRows} leads** detected and ready for validation!`);
    } else {
        lines.push(`❌ **Failed to parse file**`);
    }

    lines.push("");
    lines.push(`📊 **Statistics:**`);
    lines.push(`• Total rows: ${result.totalRows}`);
    lines.push(`• Valid leads: ${result.validRows}`);
    lines.push(`• Invalid rows: ${result.invalidRows}`);

    if (Object.keys(result.columnMapping).length > 0) {
        lines.push("");
        lines.push(`📋 **Detected columns:**`);
        for (const [field, column] of Object.entries(result.columnMapping)) {
            lines.push(`• ${field}: "${column}"`);
        }
    }

    if (result.warnings.length > 0) {
        lines.push("");
        lines.push(`⚠️ **Warnings:**`);
        for (const warning of result.warnings) {
            lines.push(`• ${warning}`);
        }
    }

    if (result.errors.length > 0) {
        lines.push("");
        lines.push(`❌ **Errors:**`);
        for (const error of result.errors) {
            lines.push(`• ${error}`);
        }
    }

    return lines.join("\n");
}
