# Export System - LeadSwap

**Status**: ✅ Completed (2026-01-18)

## 🎯 Overview

The Export System allows users to export scored leads to CSV or JSON format for use in CRM systems or further analysis. The system is fully integrated with the Agent Manager's Export Agents.

## 📁 Files Created/Modified

### Server-side

1. **`server/src/services/export-service.ts`** (NEW)
   - `exportToCSV()` - Export leads to CSV format
   - `exportToJSON()` - Export leads to JSON format
   - `exportLeads()` - Main export function with options
   - `getExportSummary()` - Get export summary statistics

2. **`server/src/services/agent-manager.ts`** (Modified)
   - Updated export agent logic to use `export-service.ts`
   - Returns data URL for download

3. **`server/src/types.ts`** (Modified)
   - Extended `TaskResult` type for export with filename and leadsCount

4. **`server/src/server.ts`** (Modified)
   - Added `export-leads` MCP widget endpoint
   - Accepts format (csv/json), tier filter, and enrichment options

### Client-side

5. **`web/src/widgets/export-leads.tsx`** (NEW)
   - React widget for export UI
   - Download button with data URL
   - Export summary display
   - Next steps guidance

## 🔧 Features

### Export Formats

1. **CSV Export**
   - Headers: ID, Name, Email, Company, Title, Score, Tier
   - Optional: Match Details (5 columns)
   - Optional: Enrichment Data (6 columns)
   - Optional: Metadata (URL, LinkedIn)
   - Properly escaped quotes for Excel/Google Sheets

2. **JSON Export**
   - Structured JSON with metadata wrapper
   - Export timestamp
   - Total leads count
   - Tier filter applied
   - Clean, nested object structure

### Export Options

```typescript
interface ExportOptions {
  format: "csv" | "json";           // Export format
  includeTier?: "all" | "A" | "B" | "C"; // Filter by tier
  includeMetadata?: boolean;        // Include URL, LinkedIn
  includeMatchDetails?: boolean;    // Include score breakdown
  includeEnrichmentData?: boolean;  // Include company data
}
```

### MCP Tool: `export-leads`

**Input Parameters:**
- `format` - "csv" or "json" (default: "csv")
- `tier` - "all", "A", "B", or "C" (default: "all")
- `includeEnrichment` - boolean (default: true)

**Output:**
```typescript
{
  success: boolean;
  format: "csv" | "json";
  downloadUrl: string;  // Data URL for download
  filename: string;     // Generated filename with timestamp
  leadsCount: number;   // Number of exported leads
  summary: {            // Export summary
    tierBreakdown: {
      tierA: number;
      tierB: number;
      tierC: number;
    };
    hasEnrichmentData: boolean;
  };
}
```

## 📊 CSV Example

```csv
"ID","Name","Email","Company","Title","Score","Tier","Industry Match","Size Match","Geo Match","Title Match","Keyword Match"
"lead-1","John Doe","john@example.com","Acme Corp","VP Sales","85","A","30","20","20","15","5"
"lead-2","Jane Smith","jane@startup.com","Startup Inc","CEO","72","B","25","15","20","10","7"
```

## 📄 JSON Example

```json
{
  "exportedAt": "2026-01-18T12:34:56.789Z",
  "totalLeads": 127,
  "tier": "all",
  "leads": [
    {
      "id": "lead-1",
      "name": "John Doe",
      "email": "john@example.com",
      "company": "Acme Corp",
      "title": "VP Sales",
      "score": 85,
      "tier": "A",
      "url": "https://acme.com",
      "linkedinUrl": "https://linkedin.com/in/johndoe",
      "matchDetails": {
        "industryMatch": 30,
        "sizeMatch": 20,
        "geoMatch": 20,
        "titleMatch": 15,
        "keywordMatch": 5
      },
      "enrichmentData": {
        "companyDescription": "...",
        "employeeCount": 250,
        "industry": "SaaS",
        "location": "Paris, France",
        "website": "https://acme.com",
        "techStack": ["Salesforce", "HubSpot"]
      }
    }
  ]
}
```

## 🎨 UI Widget

### Features:
- Loading state with spinner
- Error handling
- Export summary cards (tier breakdown)
- Download button with data URL
- Info box with included data
- Next steps guidance

### Color Coding:
- **Success**: Green background for "Export Ready"
- **Info**: Blue background for information
- **Tier A**: Green text
- **Tier B**: Orange text
- **Tier C**: Gray text

## 🚀 Usage in ChatGPT

### Example Prompts:

1. **Basic Export**
   ```
   "Export my scored leads to CSV"
   ```

2. **Filter by Tier**
   ```
   "Export only Tier A leads to JSON"
   ```

3. **Without Enrichment**
   ```
   "Export to CSV without enrichment data"
   ```

### Response:
```
✅ Export ready!

📥 127 leads exported to CSV
📄 Filename: leadswap-export-2026-01-18.csv

Download the file to import into your CRM.
```

## 🔄 Integration with Agent Manager

The Export System is fully integrated with the Agent Manager:

- **Export Agents (×2)**: Handle export tasks in parallel
- **Task Type**: `"export"`
- **Task Payload**: `{ scoredLeads, format }`
- **Task Result**: `{ downloadUrl, filename, leadsCount }`

### Example Task Creation:

```typescript
await agentManager.addTask(
  "export",
  {
    scoredLeads: lastScoringResult.scoredLeads,
    format: "csv"
  },
  "high"
);
```

## 📝 Filename Convention

**Pattern**: `leadswap-export-YYYY-MM-DD[-tier-X].{csv|json}`

**Examples**:
- `leadswap-export-2026-01-18.csv` (all tiers)
- `leadswap-export-2026-01-18-tier-A.csv` (Tier A only)
- `leadswap-export-2026-01-18.json` (JSON format)

## ✅ Build Status

- ✅ Server build: Passing
- ✅ Web build: Passing
- ✅ Full build: Passing

## 🎯 Next Steps (Future Enhancements)

1. **File Storage**: Save exports to S3/cloud storage instead of data URLs
2. **Email Delivery**: Send export link via email
3. **Scheduled Exports**: Automatic exports on schedule
4. **CRM Direct Integration**: Push directly to Salesforce, HubSpot
5. **Custom Templates**: User-defined CSV column mapping
6. **Batch Exports**: Export multiple scoring results at once
7. **Export History**: Track all past exports

---

**Built by**: OpenCode AI  
**Date**: 2026-01-18  
**Part of**: LeadSwap Skybridge ChatGPT App - Export System
