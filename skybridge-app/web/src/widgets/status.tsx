import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Status as StatusIcon } from "@openai/apps-sdk-ui/components/Icon";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";

function Status() {
  const { output } = useToolInfo<"status">();

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <div className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-body-sm">Loading status...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-subtle">
        <StatusIcon className="size-5" />
        <h2 className="heading-sm">LeadSwap Status</h2>
      </div>

      {/* Status Cards */}
      <div className="flex flex-col gap-3">
        {/* ICP Status */}
        <div className={`flex gap-3 p-3 rounded-lg border-l-4 ${output.hasICP ? "bg-surface border-success" : "bg-surface border-warning"}`}>
          <div className="text-xl">{output.hasICP ? "🎯" : "⭕"}</div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">ICP Profile</h3>
            {output.hasICP && output.icp ? (
              <div className="flex flex-col gap-1">
                <Badge color="success">Active</Badge>
                <p className="text-xs text-secondary whitespace-pre-wrap">{output.icp.summary}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <Badge color="warning">Not Defined</Badge>
                <p className="text-xs text-secondary italic">Use define-icp to set your target</p>
              </div>
            )}
          </div>
        </div>

        {/* Leads Status */}
        <div className={`flex gap-3 p-3 rounded-lg border-l-4 ${output.leadsCount > 0 ? "bg-surface border-success" : "bg-surface border-warning"}`}>
          <div className="text-xl">{output.leadsCount > 0 ? "📥" : "⭕"}</div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">Leads</h3>
            {output.leadsCount > 0 ? (
              <div className="flex flex-col gap-1">
                <Badge color="success">{output.leadsCount} loaded</Badge>
                <p className="text-xs text-secondary">Ready for scoring</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <Badge color="warning">Empty</Badge>
                <p className="text-xs text-secondary italic">Use upload-leads or search-leads</p>
              </div>
            )}
          </div>
        </div>

        {/* Scoring Status */}
        <div className={`flex gap-3 p-3 rounded-lg border-l-4 ${output.hasResults ? "bg-surface border-success" : "bg-surface border-warning"}`}>
          <div className="text-xl">{output.hasResults ? "⚡" : "⭕"}</div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">Scoring</h3>
            {output.hasResults && output.lastScoring ? (
              <div className="flex flex-col gap-2">
                <Badge color="success">Complete</Badge>
                <div className="flex gap-2">
                  <Badge color="success">A: {output.lastScoring.tierBreakdown.tierA}</Badge>
                  <Badge color="warning">B: {output.lastScoring.tierBreakdown.tierB}</Badge>
                  <Badge color="danger">C: {output.lastScoring.tierBreakdown.tierC}</Badge>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <Badge color="warning">Not Run</Badge>
                <p className="text-xs text-secondary italic">Use score-leads after setup</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="flex items-center justify-center p-3 bg-subtle/50 rounded-lg">
        {/* Step 1 */}
        <div className="flex flex-col items-center gap-1">
          <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${output.hasICP ? "bg-success text-on-success" : "bg-subtle text-secondary"}`}>
            1
          </span>
          <span className={`text-[10px] ${output.hasICP ? "text-success font-medium" : "text-secondary"}`}>
            Define ICP
          </span>
        </div>
        <div className="w-8 h-0.5 bg-subtle mx-2" />
        {/* Step 2 */}
        <div className="flex flex-col items-center gap-1">
          <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${output.leadsCount > 0 ? "bg-success text-on-success" : "bg-subtle text-secondary"}`}>
            2
          </span>
          <span className={`text-[10px] ${output.leadsCount > 0 ? "text-success font-medium" : "text-secondary"}`}>
            Load Leads
          </span>
        </div>
        <div className="w-8 h-0.5 bg-subtle mx-2" />
        {/* Step 3 */}
        <div className="flex flex-col items-center gap-1">
          <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${output.hasResults ? "bg-success text-on-success" : "bg-subtle text-secondary"}`}>
            3
          </span>
          <span className={`text-[10px] ${output.hasResults ? "text-success font-medium" : "text-secondary"}`}>
            Score
          </span>
        </div>
      </div>
    </div>
  );
}

export default Status;
mountWidget(
  <AppsSDKUIProvider>
    <Status />
  </AppsSDKUIProvider>
);
