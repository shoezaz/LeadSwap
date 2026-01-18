import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";

function Status() {
  const { output } = useToolInfo<"status">();

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <div className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-sm">Loading status...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-surface">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-subtle">
        <span className="text-xl">📊</span>
        <h2 className="flex-1 text-base font-semibold">LeadSwap Status</h2>
      </div>

      {/* Status Cards */}
      <div className="space-y-3 mb-4">
        {/* ICP Status */}
        <div className={`flex gap-3 p-3 rounded-lg bg-subtle border-l-4 ${output.hasICP ? "border-l-green-500" : "border-l-amber-500"
          }`}>
          <div className="text-xl">{output.hasICP ? "🎯" : "⭕"}</div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">ICP Profile</h3>
            {output.hasICP && output.icp ? (
              <>
                <Badge color="success">Active</Badge>
                <p className="text-xs text-secondary mt-1 whitespace-pre-wrap">{output.icp.summary}</p>
              </>
            ) : (
              <>
                <Badge color="warning">Not Defined</Badge>
                <p className="text-xs text-tertiary italic mt-1">Use define-icp to set your target</p>
              </>
            )}
          </div>
        </div>

        {/* Leads Status */}
        <div className={`flex gap-3 p-3 rounded-lg bg-subtle border-l-4 ${output.leadsCount > 0 ? "border-l-green-500" : "border-l-amber-500"
          }`}>
          <div className="text-xl">{output.leadsCount > 0 ? "📥" : "⭕"}</div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">Leads</h3>
            {output.leadsCount > 0 ? (
              <>
                <Badge color="success">{output.leadsCount} loaded</Badge>
                <p className="text-xs text-secondary mt-1">Ready for scoring</p>
              </>
            ) : (
              <>
                <Badge color="warning">Empty</Badge>
                <p className="text-xs text-tertiary italic mt-1">Use upload-leads or search-leads</p>
              </>
            )}
          </div>
        </div>

        {/* Scoring Status */}
        <div className={`flex gap-3 p-3 rounded-lg bg-subtle border-l-4 ${output.hasResults ? "border-l-green-500" : "border-l-amber-500"
          }`}>
          <div className="text-xl">{output.hasResults ? "⚡" : "⭕"}</div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-1">Scoring</h3>
            {output.hasResults && output.lastScoring ? (
              <>
                <Badge color="success">Complete</Badge>
                <div className="flex gap-1.5 mt-2">
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded tier-a-bg tier-a-text">
                    A: {output.lastScoring.tierBreakdown.tierA}
                  </span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded tier-b-bg tier-b-text">
                    B: {output.lastScoring.tierBreakdown.tierB}
                  </span>
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded tier-c-bg tier-c-text">
                    C: {output.lastScoring.tierBreakdown.tierC}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Badge color="warning">Not Run</Badge>
                <p className="text-xs text-tertiary italic mt-1">Use score-leads after setup</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="flex items-center justify-center p-3 bg-subtle rounded-lg">
        {/* Step 1 */}
        <div className="flex flex-col items-center gap-1">
          <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${output.hasICP ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
            }`}>
            1
          </span>
          <span className={`text-[10px] ${output.hasICP ? "text-green-600 font-medium" : "text-tertiary"}`}>
            Define ICP
          </span>
        </div>
        <div className="w-8 h-0.5 bg-gray-200 mx-2" />
        {/* Step 2 */}
        <div className="flex flex-col items-center gap-1">
          <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${output.leadsCount > 0 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
            }`}>
            2
          </span>
          <span className={`text-[10px] ${output.leadsCount > 0 ? "text-green-600 font-medium" : "text-tertiary"}`}>
            Load Leads
          </span>
        </div>
        <div className="w-8 h-0.5 bg-gray-200 mx-2" />
        {/* Step 3 */}
        <div className="flex flex-col items-center gap-1">
          <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${output.hasResults ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
            }`}>
            3
          </span>
          <span className={`text-[10px] ${output.hasResults ? "text-green-600 font-medium" : "text-tertiary"}`}>
            Score
          </span>
        </div>
      </div>
    </div>
  );
}

export default Status;
mountWidget(<Status />);
