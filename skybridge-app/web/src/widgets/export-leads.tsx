import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { motion } from "framer-motion";
import { Download, CheckCircle, FileText, Info, ArrowRight } from "lucide-react";

function ExportLeads() {
  const { output } = useToolInfo<"export-leads">();

  if (!output) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full"
        />
        <p className="text-sm">Preparing export...</p>
      </motion.div>
    );
  }

  const { success, format, downloadUrl, filename, leadsCount, summary } = output;

  if (!success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-xl bg-surface border border-default text-center"
      >
        <p className="text-primary font-medium">❌ Export failed</p>
        <p className="text-sm text-secondary mt-2">Please try again or contact support.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2"
      >
        <Download className="size-5 text-primary" />
        <h2 className="flex-1 heading-sm">Export Leads</h2>
        <Badge color="success">Ready</Badge>
      </motion.div>

      {/* Export Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="p-3 bg-surface border border-default rounded-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-secondary" />
            <span className="text-sm font-medium">Export Details</span>
          </div>
          <Badge color="info">{format?.toUpperCase()}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-secondary">Total Leads:</span>
            <span className="font-semibold">{leadsCount || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-secondary">Format:</span>
            <span className="font-semibold">{format || "CSV"}</span>
          </div>
          {summary && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-secondary">Tier A:</span>
                <Badge color="success" variant="soft">{summary.tierBreakdown?.tierA || 0}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-secondary">Tier B:</span>
                <Badge color="warning" variant="soft">{summary.tierBreakdown?.tierB || 0}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-secondary">Tier C:</span>
                <Badge color="danger" variant="soft">{summary.tierBreakdown?.tierC || 0}</Badge>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Download Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-3"
      >
        <div className="p-4 bg-surface border border-default rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="size-5 text-success" />
            <span className="font-medium">Export Ready</span>
          </div>
          <p className="text-sm text-secondary mb-4">
            Your export file <strong className="text-primary">{filename}</strong> is ready for download.
          </p>

          {downloadUrl && (
            <a
              href={downloadUrl}
              download={filename || `leadswap-export.${format || "csv"}`}
              className="block w-full"
            >
              <Button color="primary" block>
                <Download className="size-4 mr-2" />
                Download {format?.toUpperCase() || "CSV"} File
              </Button>
            </a>
          )}
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-3 bg-surface border border-default rounded-lg text-sm"
        >
          <div className="flex items-start gap-2">
            <Info className="size-4 text-info shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium mb-2">Export includes:</p>
              <ul className="text-secondary space-y-1 text-xs">
                <li className="flex items-center gap-1">
                  <ArrowRight className="size-3" /> Lead contact information
                </li>
                <li className="flex items-center gap-1">
                  <ArrowRight className="size-3" /> Scores and tier classification
                </li>
                <li className="flex items-center gap-1">
                  <ArrowRight className="size-3" /> Match details breakdown
                </li>
                {summary?.hasEnrichmentData && (
                  <li className="flex items-center gap-1">
                    <ArrowRight className="size-3" /> Enrichment data (company info, tech stack)
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-xs text-secondary pt-2 border-t border-subtle"
        >
          <p className="mb-2 font-medium">Next steps:</p>
          <ul className="space-y-1">
            <li className="flex items-center gap-1">
              <ArrowRight className="size-3" /> Import to your CRM (Salesforce, HubSpot, Pipedrive)
            </li>
            <li className="flex items-center gap-1">
              <ArrowRight className="size-3" /> Use Tier A leads for immediate outreach
            </li>
            <li className="flex items-center gap-1">
              <ArrowRight className="size-3" /> Nurture Tier B leads with targeted campaigns
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ExportLeads;
mountWidget(
  <AppsSDKUIProvider linkComponent="a">
    <ExportLeads />
  </AppsSDKUIProvider>
);
