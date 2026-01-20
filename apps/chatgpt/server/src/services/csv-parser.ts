
import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";
import type { Lead } from "../types.js";

interface ParseResult {
    success: boolean;
    leads: Lead[];
    totalRows: number;
    validRows: number;
    invalidRows: number;
    errors: string[];
    warnings: string[];
    columnMapping: Record<string, string>;
}

/**
 * Parse file content (CSV or Excel)
 */
export function parseFile(content: string | Buffer, fileType: "csv" | "excel" = "csv"): ParseResult {
    try {
        let records: any[] = [];

        if (fileType === "excel" || Buffer.isBuffer(content)) {
            // Excel Parsing
            const workbook = XLSX.read(content, { type: Buffer.isBuffer(content) ? "buffer" : "string" });
            const sheetName = workbook.SheetNames[0]; // Use first sheet
            const sheet = workbook.Sheets[sheetName];

            // Convert to JSON (array of objects)
            records = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            // Normalize to ensure string values
            records = records.map((row: any) => {
                const newRow: any = {};
                Object.keys(row).forEach(key => {
                    newRow[key] = String(row[key] || "").trim();
                });
                return newRow;
            });

        } else {
            // CSV Parsing
            records = parse(content as string, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
                relax_column_count: true,
            });
        }

        const leads: Lead[] = [];
        const errors: string[] = [];
        const warnings: string[] = [];
        let validRows = 0;

        // Check if we have records
        if (records.length === 0) {
            return {
                success: false,
                leads: [],
                totalRows: 0,
                validRows: 0,
                invalidRows: 0,
                errors: ["File is empty"],
                warnings: [],
                columnMapping: {},
            };
        }

        // Auto-detect columns from first record
        const headers = Object.keys(records[0] as object);
        const mapping = detectColumns(headers);

        if (!mapping.email && !mapping.company && !mapping.name) {
            return {
                success: false,
                leads: [],
                totalRows: records.length,
                validRows: 0,
                invalidRows: records.length,
                errors: ["Could not detect required columns (email, company, or name)"],
                warnings: [],
                columnMapping: mapping,
            };
        }

        // Process rows
        records.forEach((record: any, index: number) => {
            const lead = mapRecordToLead(record, mapping, index);
            if (lead) {
                leads.push(lead);
                validRows++;
            }
        });

        if (validRows < 50) {
            warnings.push(`Only ${validRows} valid leads found. Recommended minimum is 50 for meaningful pattern analysis.`);
        }

        return {
            success: true,
            leads,
            totalRows: records.length,
            validRows,
            invalidRows: records.length - validRows,
            errors,
            warnings,
            columnMapping: mapping,
        };

    } catch (err) {
        return {
            success: false,
            leads: [],
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
            errors: [`Parsing Error: ${err instanceof Error ? err.message : String(err)}`],
            warnings: [],
            columnMapping: {},
        };
    }
}

// Alias for backward compatibility
export const parseCSV = (content: string) => parseFile(content, "csv");

function detectColumns(headers: string[]): Record<string, string> {
    const mapping: Record<string, string> = {};
    const normalize = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, "");

    const patterns = {
        email: ["email", "e-mail", "mail", "contact_email", "email_address"],
        name: ["name", "full_name", "contact_name", "first_name"], // We'll handle split names in mapRecord
        company: ["company", "company_name", "organization", "business", "account_name"],
        title: ["title", "job_title", "position", "role", "job"],
        website: ["website", "url", "domain", "company_website", "web"],
        linkedin: ["linkedin", "linkedin_url", "profile", "social"],
    };

    for (const header of headers) {
        const normalized = normalize(header);

        // Check each field type
        for (const [field, fieldPatterns] of Object.entries(patterns)) {
            if (!mapping[field] && fieldPatterns.some(p => normalized.includes(p))) {
                mapping[field] = header;
            }
        }
    }

    return mapping;
}

function mapRecordToLead(record: any, mapping: Record<string, string>, index: number): Lead | null {
    const company = mapping.company ? record[mapping.company] : null;
    const email = mapping.email ? record[mapping.email] : null;

    // We need at least a company or email to identify the lead
    if (!company && !email) return null;

    // Handle name (composite or specific column)
    let name = mapping.name ? record[mapping.name] : null;
    if (!name) {
        // Try to find first/last name columns if full name not found
        const keys = Object.keys(record);
        const first = keys.find(k => k.toLowerCase().includes("first"));
        const last = keys.find(k => k.toLowerCase().includes("last"));
        if (first && last) {
            name = `${record[first]} ${record[last]}`.trim();
        }
    }

    return {
        id: `lead-${index + 1}`,
        company: company || "Unknown Company",
        email: email,
        name: name,
        title: mapping.title ? record[mapping.title] : undefined,
        url: mapping.website ? record[mapping.website] : undefined,
        linkedinUrl: mapping.linkedin ? record[mapping.linkedin] : undefined,
    };
}
