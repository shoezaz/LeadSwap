/**
 * Export Service
 * 
 * Handles CSV and JSON exports for scored leads
 */

import type { ScoredLead } from "../types.js";

export interface ExportOptions {
  format: "csv" | "json";
  includeTier?: "all" | "A" | "B" | "C";
  includeMetadata?: boolean;
  includeMatchDetails?: boolean;
  includeEnrichmentData?: boolean;
}

export interface ExportResult {
  success: boolean;
  format: "csv" | "json";
  content: string;
  filename: string;
  leadsCount: number;
  exportedAt: Date;
}

/**
 * Export scored leads to CSV format
 */
export function exportToCSV(
  leads: ScoredLead[],
  options: ExportOptions & { hubspotCompatibility?: boolean } = { format: "csv" }
): ExportResult {
  const {
    includeTier = "all",
    includeMetadata = true,
    includeMatchDetails = true,
    includeEnrichmentData = true,
    hubspotCompatibility = false,
  } = options;

  // Filter by tier if specified
  let filteredLeads = leads;
  if (includeTier !== "all") {
    filteredLeads = leads.filter((lead) => lead.tier === includeTier);
  }

  // --- Header Definition ---
  let headers: string[] = [];

  if (hubspotCompatibility) {
    // HubSpot Standard Headers (Optimized for auto-mapping)
    headers = [
      "Email Address",     // email
      "First Name",        // first part of name
      "Last Name",         // last part of name
      "Company Domain Name", // url or domain from company
      "Company Name",      // company
      "Job Title",         // title
      "Lead Status",       // "New"
      "Lifecyle Stage",    // "Lead"
      "Lead Source",       // "LeadSwap"
      "Lead Score",        // score
      "Lead Tier",         // tier
      "LinkedIn Bio",      // enrichment description
      "Website URL",       // website
      "Industry",          // industry
      "Number of Employees", // employeeCount
      "Facebook Profile URL", // socialLinks
      "Twitter Handle",       // socialLinks
      "LinkedIn Company Page",// socialLinks
      "Recent Technology", // techStack
    ];
  } else {
    // Standard LeadSwap Headers
    const baseHeaders = ["ID", "Name", "Email", "Company", "Title", "Score", "Tier"];

    const matchHeaders = includeMatchDetails
      ? ["Industry Match", "Size Match", "Geo Match", "Title Match", "Keyword Match"]
      : [];

    const enrichmentHeaders = includeEnrichmentData
      ? [
        "Company Description",
        "Employee Count",
        "Industry",
        "Location",
        "Website",
        "Tech Stack",
        "LinkedIn Page",
        "Twitter Profile",
        "Facebook Page",
        "Instagram Profile"
      ]
      : [];

    const metadataHeaders = includeMetadata ? ["URL", "LinkedIn Individual"] : [];

    headers = [...baseHeaders, ...matchHeaders, ...enrichmentHeaders, ...metadataHeaders];
  }

  // --- Row Generation ---
  const rows = filteredLeads.map((lead) => {
    if (hubspotCompatibility) {
      // HubSpot Row Mapping
      const nameParts = (lead.name || "").split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      return [
        lead.email || "",
        firstName,
        lastName,
        lead.url || "", // Domain
        lead.company,
        lead.title || "",
        "New",            // Lead Status
        "Lead",           // Lifecycle Stage
        "LeadSwap",       // Lead Source
        lead.score.toString(),
        lead.tier,
        lead.enrichmentData?.companyDescription?.replace(/"/g, '""') || "",
        lead.enrichmentData?.website || "",
        lead.enrichmentData?.industry || "",
        lead.enrichmentData?.employeeCount?.toString() || "",
        lead.enrichmentData?.socialLinks?.facebook || "",
        lead.enrichmentData?.socialLinks?.twitter || "",
        lead.enrichmentData?.socialLinks?.linkedin || "",
        lead.enrichmentData?.techStack?.join("; ") || "",
      ];
    } else {
      // Standard Row Mapping
      const baseRow = [
        lead.id,
        lead.name || "",
        lead.email || "",
        lead.company,
        lead.title || "",
        lead.score.toString(),
        lead.tier,
      ];

      const matchRow = includeMatchDetails
        ? [
          lead.matchDetails.industryMatch.toString(),
          lead.matchDetails.sizeMatch.toString(),
          lead.matchDetails.geoMatch.toString(),
          lead.matchDetails.titleMatch.toString(),
          lead.matchDetails.keywordMatch.toString(),
        ]
        : [];

      const enrichmentRow = includeEnrichmentData
        ? [
          lead.enrichmentData?.companyDescription?.replace(/"/g, '""') || "",
          lead.enrichmentData?.employeeCount?.toString() || "",
          lead.enrichmentData?.industry || "",
          lead.enrichmentData?.location || "",
          lead.enrichmentData?.website || "",
          lead.enrichmentData?.techStack?.join("; ") || "",
          lead.enrichmentData?.socialLinks?.linkedin || "",
          lead.enrichmentData?.socialLinks?.twitter || "",
          lead.enrichmentData?.socialLinks?.facebook || "",
          lead.enrichmentData?.socialLinks?.instagram || "",
        ]
        : [];

      const metadataRow = includeMetadata ? [lead.url || "", lead.linkedinUrl || ""] : [];

      return [...baseRow, ...matchRow, ...enrichmentRow, ...metadataRow];
    }
  });

  // Convert to CSV string
  const csvContent = [
    headers.map((h) => `"${h}"`).join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const timestamp = new Date().toISOString().split("T")[0];
  const tierSuffix = includeTier !== "all" ? `-tier-${includeTier}` : "";
  const hubspotSuffix = hubspotCompatibility ? "-hubspot" : "";
  const filename = `leadswap-export-${timestamp}${tierSuffix}${hubspotSuffix}.csv`;

  return {
    success: true,
    format: "csv",
    content: csvContent,
    filename,
    leadsCount: filteredLeads.length,
    exportedAt: new Date(),
  };
}

/**
 * Export scored leads to JSON format
 */
export function exportToJSON(
  leads: ScoredLead[],
  options: ExportOptions = { format: "json" }
): ExportResult {
  const {
    includeTier = "all",
    includeMetadata = true,
    includeMatchDetails = true,
    includeEnrichmentData = true,
  } = options;

  // Filter by tier if specified
  let filteredLeads = leads;
  if (includeTier !== "all") {
    filteredLeads = leads.filter((lead) => lead.tier === includeTier);
  }

  // Build clean export objects
  const exportData = filteredLeads.map((lead) => {
    const base = {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      title: lead.title,
      score: lead.score,
      tier: lead.tier,
    };

    const metadata = includeMetadata
      ? {
        url: lead.url,
        linkedinUrl: lead.linkedinUrl,
      }
      : {};

    const matchDetails = includeMatchDetails
      ? {
        matchDetails: lead.matchDetails,
      }
      : {};

    const enrichmentData = includeEnrichmentData && lead.enrichmentData
      ? {
        enrichmentData: lead.enrichmentData,
      }
      : {};

    return {
      ...base,
      ...metadata,
      ...matchDetails,
      ...enrichmentData,
    };
  });

  const exportWrapper = {
    exportedAt: new Date().toISOString(),
    totalLeads: filteredLeads.length,
    tier: includeTier,
    leads: exportData,
  };

  const jsonContent = JSON.stringify(exportWrapper, null, 2);

  const timestamp = new Date().toISOString().split("T")[0];
  const tierSuffix = includeTier !== "all" ? `-tier-${includeTier}` : "";
  const filename = `leadswap-export-${timestamp}${tierSuffix}.json`;

  return {
    success: true,
    format: "json",
    content: jsonContent,
    filename,
    leadsCount: filteredLeads.length,
    exportedAt: new Date(),
  };
}

/**
 * Main export function that routes to CSV or JSON
 */
export function exportLeads(
  leads: ScoredLead[],
  options: ExportOptions & { hubspotCompatibility?: boolean }
): ExportResult {
  if (options.format === "csv") {
    return exportToCSV(leads, options);
  } else {
    return exportToJSON(leads, options);
  }
}

/**
 * Generate a summary of exportable data
 */
export function getExportSummary(leads: ScoredLead[]) {
  return {
    totalLeads: leads.length,
    tierBreakdown: {
      tierA: leads.filter((l) => l.tier === "A").length,
      tierB: leads.filter((l) => l.tier === "B").length,
      tierC: leads.filter((l) => l.tier === "C").length,
    },
    hasEnrichmentData: leads.some((l) => l.enrichmentData !== undefined),
    availableFormats: ["csv", "json"],
  };
}
