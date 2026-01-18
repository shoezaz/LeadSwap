import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Star, TrophyTop } from "@openai/apps-sdk-ui/components/Icon";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";

function ScoreLeads() {
  const { input, output } = useToolInfo<"score-leads">();

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <div className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-sm">Scoring leads against your ICP...</p>
        <small className="text-xs text-tertiary">This may take a moment</small>
      </div>
    );
  }

  if (!output.success) {
    return (
      <div className="p-6 rounded-xl bg-error/10 text-center">
        <p className="text-error font-medium">❌ Scoring failed</p>
      </div>
    );
  }

  const { tierBreakdown, topLeads, totalLeads, processingTimeMs } = output;

  const getTierClass = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "a": return "tier-a";
      case "b": return "tier-b";
      case "c": return "tier-c";
      default: return "";
    }
  };

  return (
    <div className="p-4 bg-surface rounded-xl border border-subtle overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-subtle">
        <Star className="size-5" />
        <h2 className="flex-1 text-base font-semibold">Scoring Complete</h2>
        <Badge color="secondary">{processingTimeMs}ms</Badge>
      </div>

      {/* Tier Breakdown */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {/* Tier A */}
        <div className="p-3 rounded-lg tier-a-bg text-center">
          <span className="text-xs font-semibold uppercase tier-a-text">Tier A</span>
          <span className="block text-2xl font-bold tier-a-text">{tierBreakdown.tierA}</span>
          <span className="text-[10px] text-tertiary">80-100 pts</span>
          <div className="mt-2 h-1 bg-black/10 rounded overflow-hidden">
            <div
              className="h-full progress-fill-success rounded"
              style={{ width: `${(tierBreakdown.tierA / totalLeads) * 100}%` }}
            />
          </div>
        </div>
        {/* Tier B */}
        <div className="p-3 rounded-lg tier-b-bg text-center">
          <span className="text-xs font-semibold uppercase tier-b-text">Tier B</span>
          <span className="block text-2xl font-bold tier-b-text">{tierBreakdown.tierB}</span>
          <span className="text-[10px] text-tertiary">50-79 pts</span>
          <div className="mt-2 h-1 bg-black/10 rounded overflow-hidden">
            <div
              className="h-full progress-fill-warning rounded"
              style={{ width: `${(tierBreakdown.tierB / totalLeads) * 100}%` }}
            />
          </div>
        </div>
        {/* Tier C */}
        <div className="p-3 rounded-lg tier-c-bg text-center">
          <span className="text-xs font-semibold uppercase tier-c-text">Tier C</span>
          <span className="block text-2xl font-bold tier-c-text">{tierBreakdown.tierC}</span>
          <span className="text-[10px] text-tertiary">0-49 pts</span>
          <div className="mt-2 h-1 bg-black/10 rounded overflow-hidden">
            <div
              className="h-full progress-fill-error rounded"
              style={{ width: `${(tierBreakdown.tierC / totalLeads) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Leads Table */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-secondary mb-2">🏆 Top {topLeads.length} Leads</h3>
        <div className="overflow-x-auto rounded-lg border border-subtle">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-subtle">
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Score</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Company</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Contact</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Title</th>
                <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle">
              {topLeads.map((lead: any, i: number) => (
                <tr key={i} className={`${getTierClass(lead.tier)}-bg hover:opacity-80`}>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center justify-center min-w-[32px] px-2 py-1 text-xs font-semibold rounded text-white ${lead.tier === "A" ? "bg-green-500" :
                      lead.tier === "B" ? "bg-amber-500" : "bg-red-500"
                      }`}>
                      {lead.score}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium">{lead.company}</td>
                  <td className="px-3 py-2">{lead.name || "-"}</td>
                  <td className="px-3 py-2">{lead.title || "-"}</td>
                  <td className="px-3 py-2">{lead.email || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-subtle text-xs text-tertiary">
        Total: {totalLeads} leads scored
      </div>
    </div>
  );
}

export default ScoreLeads;
mountWidget(
  <AppsSDKUIProvider>
    <ScoreLeads />
  </AppsSDKUIProvider>
);
