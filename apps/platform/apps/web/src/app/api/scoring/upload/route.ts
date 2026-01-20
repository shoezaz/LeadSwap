import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * POST /api/scoring/upload
 * 
 * Handles CSV file upload and parses leads
 */
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, error: "No file provided" },
                { status: 400 }
            );
        }

        // Read file content
        const content = await file.text();

        // Parse CSV
        const leads = parseCSV(content);

        if (leads.length === 0) {
            return NextResponse.json(
                { success: false, error: "No leads found in CSV. Make sure there's a 'company' column." },
                { status: 400 }
            );
        }

        // Detect columns
        const headers = content.split("\n")[0].split(",").map(h => h.trim());

        return NextResponse.json({
            success: true,
            leadsCount: leads.length,
            leads,
            detectedColumns: headers,
        });
    } catch (error) {
        console.error("CSV upload error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to parse CSV file" },
            { status: 500 }
        );
    }
}

/**
 * Parse CSV content into leads
 */
function parseCSV(csvContent: string): Array<{
    id: string;
    company: string;
    name?: string;
    email?: string;
    title?: string;
    linkedinUrl?: string;
}> {
    const lines = csvContent.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    // Detect column mappings
    const companyCol = headers.findIndex((h) =>
        ["company", "company name", "organization", "société", "entreprise"].includes(h)
    );
    const nameCol = headers.findIndex((h) =>
        ["name", "full name", "contact name", "nom", "prénom"].includes(h)
    );
    const emailCol = headers.findIndex((h) =>
        ["email", "email address", "e-mail", "mail"].includes(h)
    );
    const titleCol = headers.findIndex((h) =>
        ["title", "job title", "position", "poste", "fonction"].includes(h)
    );
    const linkedinCol = headers.findIndex((h) =>
        ["linkedin", "linkedin url", "linkedin_url", "linkedin profile"].includes(h)
    );

    if (companyCol === -1) {
        // Try to find any column that might be company
        const fallbackCol = headers.findIndex(h => h.includes("compan") || h.includes("org"));
        if (fallbackCol === -1) return [];
    }

    const leads: Array<{
        id: string;
        company: string;
        name?: string;
        email?: string;
        title?: string;
        linkedinUrl?: string;
    }> = [];

    for (let i = 1; i < lines.length; i++) {
        // Handle quoted CSV values
        const values = parseCSVLine(lines[i]);

        const company = values[companyCol >= 0 ? companyCol : 0];
        if (!company || company.trim() === "") continue;

        leads.push({
            id: `lead-${i}`,
            company: company.trim(),
            name: nameCol >= 0 ? values[nameCol]?.trim() : undefined,
            email: emailCol >= 0 ? values[emailCol]?.trim() : undefined,
            title: titleCol >= 0 ? values[titleCol]?.trim() : undefined,
            linkedinUrl: linkedinCol >= 0 ? values[linkedinCol]?.trim() : undefined,
        });
    }

    return leads;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
            result.push(current);
            current = "";
        } else {
            current += char;
        }
    }
    result.push(current);

    return result;
}
