import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Status as StatusIcon } from "@openai/apps-sdk-ui/components/Icon";
import { TextLink } from "@openai/apps-sdk-ui/components/TextLink";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";

function GetResults() {
  const { output } = useToolInfo<"get-results">();

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <div className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-body-sm">Loading results...</p>
      </div>
    );
  }

  const { leads, tier, filteredCount, totalResults, tierBreakdown } = output;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className="size-5" />
          <h2 className="heading-sm">Lead Results</h2>
        </div>
        <Badge color="neutral">{tier}</Badge>
      </div>

      {/* Summary Stats */}
      <div className="flex gap-2 p-3 bg-surface border border-default rounded-lg overflow-x-auto">
        <div className="flex-1 text-center min-w-[60px]">
          <span className="block text-xl font-bold">{filteredCount}</span>
          <span className="block text-[10px] text-secondary uppercase">Showing</span>
        </div>
        <div className="flex-1 text-center min-w-[60px]">
          <span className="block text-xl font-bold">{totalResults}</span>
          <span className="block text-[10px] text-secondary uppercase">Total</span>
        </div>
        <div className="flex-1 text-center min-w-[60px]">
          <span className="block text-xl font-bold text-success">{tierBreakdown.tierA}</span>
          <span className="block text-[10px] text-secondary uppercase">Tier A</span>
        </div>
        <div className="flex-1 text-center min-w-[60px]">
          <span className="block text-xl font-bold text-warning">{tierBreakdown.tierB}</span>
          <span className="block text-[10px] text-secondary uppercase">Tier B</span>
        </div>
        <div className="flex-1 text-center min-w-[60px]">
          <span className="block text-xl font-bold text-danger">{tierBreakdown.tierC}</span>
          <span className="block text-[10px] text-secondary uppercase">Tier C</span>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-x-auto rounded-lg border border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-subtle/50">
              <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Score</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Company</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">Contact</th>
              <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">URL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-subtle">
            {leads.map((lead: any) => (
              <tr key={lead.id} className="hover:bg-subtle/30">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Badge color={lead.tier === "A" ? "success" : lead.tier === "B" ? "warning" : "danger"}>
                      {lead.score}
                    </Badge>
                    <span className="text-[10px] font-bold text-secondary">{lead.tier}</span>
                  </div>
                </td>
                <td className="px-3 py-2 font-medium">{lead.company}</td>
                <td className="px-3 py-2 text-secondary">
                  {lead.email ? (
                    <TextLink href={`mailto:${lead.email}`}>
                      {lead.name || lead.email}
                    </TextLink>
                  ) : lead.name || "-"}
                </td>
                <td className="px-3 py-2">
                  {lead.url ? (
                    <TextLink href={lead.url} target="_blank" rel="noopener noreferrer">
                      Link
                    </TextLink>
                  ) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Match Details Example */}
      {leads.length > 0 && leads[0].matchDetails && (
        <div className="p-3 bg-surface border border-default rounded-lg flex flex-col gap-3">
          <h4 className="text-xs font-semibold text-secondary mb-1">
            Score Breakdown (Example: {leads[0].company})
          </h4>
          <div className="flex flex-col gap-2">
            {[
              { label: "Industry", value: leads[0].matchDetails.industryMatch, max: 30 },
              { label: "Size", value: leads[0].matchDetails.sizeMatch, max: 20 },
              { label: "Geography", value: leads[0].matchDetails.geoMatch, max: 20 },
              { label: "Title", value: leads[0].matchDetails.titleMatch, max: 20 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-xs">
                <span className="w-16 text-secondary">{item.label}</span>
                <div className="flex-1 h-1.5 bg-subtle rounded overflow-hidden">
                  <div
                    className="h-full bg-primary rounded"
                    style={{ width: `${(item.value / item.max) * 100}%` }}
                  />
                </div>
                <span className="w-10 font-medium text-right">{item.value}/{item.max}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GetResults;
mountWidget(
  <AppsSDKUIProvider>
    <GetResults />
  </AppsSDKUIProvider>
);
