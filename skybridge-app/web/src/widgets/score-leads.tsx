import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Star } from "@openai/apps-sdk-ui/components/Icon";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";

function ScoreLeads() {
  const { output } = useToolInfo<"score-leads">();

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <div className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-body-sm">Scoring leads against your ICP...</p>
        <small className="text-xs text-secondary">This may take a moment</small>
      </div>
    );
  }

  const outputData = output as any;

  if (!outputData.success) {
    return (
      <div className="p-6 rounded-xl bg-surface text-center border border-default">
        <p className="text-body-sm font-medium text-primary">❌ Scoring failed</p>
      </div>
    );
  }

  const { tierBreakdown, topLeads, totalLeads, processingTimeMs } = outputData;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="size-5" />
          <h2 className="heading-sm">Scoring Complete</h2>
        </div>
        <Badge color="secondary">{String(processingTimeMs)}ms</Badge>
      </div>

      {/* Tier Breakdown */}
      <div className="grid grid-cols-3 gap-2">
        {/* Tier A */}
        <div className="p-3 rounded-lg bg-surface border border-default text-center">
          <span className="text-xs font-semibold uppercase text-success">Tier A</span>
          <span className="block text-xl font-bold">{tierBreakdown.tierA}</span>
          <span className="text-[10px] text-secondary">80-100 pts</span>
          <div className="mt-2 h-1 bg-subtle rounded overflow-hidden">
            <div
              className="h-full bg-success rounded"
              style={{ width: `${(tierBreakdown.tierA / totalLeads) * 100}%` }}
            />
          </div>
        </div>
        {/* Tier B */}
        <div className="p-3 rounded-lg bg-surface border border-default text-center">
          <span className="text-xs font-semibold uppercase text-warning">Tier B</span>
          <span className="block text-xl font-bold">{tierBreakdown.tierB}</span>
          <span className="text-[10px] text-secondary">50-79 pts</span>
          <div className="mt-2 h-1 bg-subtle rounded overflow-hidden">
            <div
              className="h-full bg-warning rounded"
              style={{ width: `${(tierBreakdown.tierB / totalLeads) * 100}%` }}
            />
          </div>
        </div>
        {/* Tier C */}
        <div className="p-3 rounded-lg bg-surface border border-default text-center">
          <span className="text-xs font-semibold uppercase text-danger">Tier C</span>
          <span className="block text-xl font-bold">{tierBreakdown.tierC}</span>
          <span className="text-[10px] text-secondary">0-49 pts</span>
          <div className="mt-2 h-1 bg-subtle rounded overflow-hidden">
            <div
              className="h-full bg-danger rounded"
              style={{ width: `${(tierBreakdown.tierC / totalLeads) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Leads Table */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
          🏆 Top {topLeads.length} Leads
        </h3>
        <div className="overflow-x-auto rounded-lg border border-subtle">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-subtle/50">
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Score</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Company</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Title</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {topLeads.map((lead: any, i: number) => (
                <tr key={i} className="hover:bg-subtle/30">
                  <td className="px-3 py-2">
                    <Badge color={lead.tier === "A" ? "success" : lead.tier === "B" ? "warning" : "danger"}>
                      {String(lead.score)}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 font-medium">{lead.company}</td>
                  <td className="px-3 py-2 text-secondary">{lead.title || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-subtle text-xs text-secondary">
        Total: {totalLeads} leads scored
      </div>
    </div>
  );
}

export default ScoreLeads;
mountWidget(
  <AppsSDKUIProvider linkComponent="a">
    <ScoreLeads />
  </AppsSDKUIProvider>
);
