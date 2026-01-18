import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";

function ExportLeads() {
  const { input, output } = useToolInfo<"export-leads">();

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <div className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-sm">Preparing export...</p>
      </div>
    );
  }

  const { success, format, downloadUrl, filename, leadsCount, summary } = output;

  if (!success) {
    return (
      <div className="p-6 rounded-xl bg-error/10 text-center">
        <p className="text-error font-medium">❌ Export failed</p>
        <p className="text-sm text-secondary mt-2">Please try again or contact support.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-surface">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-subtle">
        <span className="text-xl">📥</span>
        <h2 className="flex-1 text-base font-semibold">Export Leads</h2>
        <Badge color="success">Ready</Badge>
      </div>

      {/* Export Summary */}
      <div className="mb-4 p-3 bg-subtle rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Export Details</span>
          <Badge color="info">{format?.toUpperCase()}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-secondary">Total Leads:</span>{" "}
            <span className="font-semibold">{leadsCount || 0}</span>
          </div>
          <div>
            <span className="text-secondary">Format:</span>{" "}
            <span className="font-semibold">{format || "CSV"}</span>
          </div>
          {summary && (
            <>
              <div>
                <span className="text-secondary">Tier A:</span>{" "}
                <span className="font-semibold tier-a-text">{summary.tierBreakdown?.tierA || 0}</span>
              </div>
              <div>
                <span className="text-secondary">Tier B:</span>{" "}
                <span className="font-semibold tier-b-text">{summary.tierBreakdown?.tierB || 0}</span>
              </div>
              <div>
                <span className="text-secondary">Tier C:</span>{" "}
                <span className="font-semibold tier-c-text">{summary.tierBreakdown?.tierC || 0}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Download Button */}
      <div className="flex flex-col gap-3">
        <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-success font-medium">✅ Export Ready</span>
          </div>
          <p className="text-sm text-secondary mb-3">
            Your export file <strong>{filename}</strong> is ready for download.
          </p>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={filename || `leadswap-export.${format || "csv"}`}
              className="block w-full"
            >
              <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors">
                📥 Download {format?.toUpperCase() || "CSV"} File
              </button>
            </a>
          )}
        </div>

        {/* Info Box */}
        <div className="p-3 bg-info/10 border border-info/20 rounded-lg text-sm">
          <div className="flex items-start gap-2">
            <span className="text-info">ℹ️</span>
            <div className="flex-1">
              <p className="font-medium text-info mb-1">Export includes:</p>
              <ul className="text-secondary space-y-1 text-xs">
                <li>• Lead contact information</li>
                <li>• Scores and tier classification</li>
                <li>• Match details breakdown</li>
                {summary?.hasEnrichmentData && <li>• Enrichment data (company info, tech stack)</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-xs text-secondary">
          <p className="mb-2 font-medium">Next steps:</p>
          <ul className="space-y-1 pl-4">
            <li>• Import to your CRM (Salesforce, HubSpot, Pipedrive)</li>
            <li>• Use Tier A leads for immediate outreach</li>
            <li>• Nurture Tier B leads with targeted campaigns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ExportLeads;
mountWidget(<ExportLeads />);
