import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";

function GetResults() {
  const { input, output } = useToolInfo<"get-results">();

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <div className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-sm">Loading results...</p>
      </div>
    );
  }

  const { leads, tier, filteredCount, totalResults, tierBreakdown } = output;

  return (
    <div className="p-4 bg-surface">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-subtle">
        <span className="text-xl">📊</span>
        <h2 className="flex-1 text-base font-semibold">Lead Results</h2>
        <Badge color="secondary">{tier}</Badge>
      </div>

      {/* Summary Stats */}
      <div className="flex gap-2 mb-4 p-3 bg-subtle rounded-lg">
        <div className="flex-1 text-center p-2 rounded">
          <span className="block text-xl font-bold">{filteredCount}</span>
          <span className="block text-[10px] text-tertiary uppercase">Showing</span>
        </div>
        <div className="flex-1 text-center p-2 rounded">
          <span className="block text-xl font-bold">{totalResults}</span>
          <span className="block text-[10px] text-tertiary uppercase">Total</span>
        </div>
        <div className="flex-1 text-center p-2 rounded tier-a-bg">
          <span className="block text-xl font-bold tier-a-text">{tierBreakdown.tierA}</span>
          <span className="block text-[10px] text-tertiary uppercase">Tier A</span>
        </div>
        <div className="flex-1 text-center p-2 rounded tier-b-bg">
          <span className="block text-xl font-bold tier-b-text">{tierBreakdown.tierB}</span>
          <span className="block text-[10px] text-tertiary uppercase">Tier B</span>
        </div>
        <div className="flex-1 text-center p-2 rounded tier-c-bg">
          <span className="block text-xl font-bold tier-c-text">{tierBreakdown.tierC}</span>
          <span className="block text-[10px] text-tertiary uppercase">Tier C</span>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto rounded-lg border border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-subtle">
              <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Score</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Company</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Contact</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Title</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Email</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">URL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle">
            {leads.map((lead: any) => (
              <tr key={lead.id} className={`tier-${lead.tier.toLowerCase()}-bg hover:opacity-80`}>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <span className={`inline-flex items-center justify-center min-w-[32px] px-2 py-1 text-xs font-semibold rounded text-white ${lead.tier === "A" ? "bg-green-500" :
                        lead.tier === "B" ? "bg-amber-500" : "bg-red-500"
                      }`}>
                      {lead.score}
                    </span>
                    <span className={`text-[10px] font-bold ${lead.tier === "A" ? "tier-a-text" :
                        lead.tier === "B" ? "tier-b-text" : "tier-c-text"
                      }`}>
                      {lead.tier}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 font-medium">{lead.company}</td>
                <td className="px-3 py-2">{lead.name || "-"}</td>
                <td className="px-3 py-2">{lead.title || "-"}</td>
                <td className="px-3 py-2">
                  {lead.email ? (
                    <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                      {lead.email}
                    </a>
                  ) : "-"}
                </td>
                <td className="px-3 py-2">
                  {lead.url ? (
                    <a href={lead.url} target="_blank" rel="noopener noreferrer" className="text-primary">
                      🔗
                    </a>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Match Details Example */}
      {leads.length > 0 && leads[0].matchDetails && (
        <div className="mt-4 p-3 bg-subtle rounded-lg">
          <h4 className="text-xs font-semibold text-secondary mb-3">
            Score Breakdown (Example: {leads[0].company})
          </h4>
          <div className="space-y-2">
            {[
              { label: "Industry", value: leads[0].matchDetails.industryMatch, max: 30 },
              { label: "Size", value: leads[0].matchDetails.sizeMatch, max: 20 },
              { label: "Geography", value: leads[0].matchDetails.geoMatch, max: 20 },
              { label: "Title", value: leads[0].matchDetails.titleMatch, max: 20 },
              { label: "Keywords", value: leads[0].matchDetails.keywordMatch, max: 10 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="w-16 text-xs text-secondary">{item.label}</span>
                <div className="flex-1 h-1.5 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-primary rounded"
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-xs font-medium text-right">{item.value}/{item.max}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GetResults;
mountWidget(<GetResults />);
