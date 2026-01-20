import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Search } from "@openai/apps-sdk-ui/components/Icon";
import { TextLink } from "@openai/apps-sdk-ui/components/TextLink";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";

function SearchLeads() {
  const { output } = useToolInfo<"search-leads">();

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <div className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-body-sm">Searching for leads matching your ICP...</p>
        <small className="text-xs text-secondary">Powered by Exa.ai</small>
      </div>
    );
  }

  if (!output.success) {
    return (
      <div className="p-6 rounded-xl bg-surface text-center border border-default">
        <p className="text-body-sm font-medium text-primary">❌ Search failed</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="size-5" />
          <h2 className="heading-sm">Leads Found</h2>
        </div>
        <Badge color="success">{output.foundLeads} new</Badge>
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        <div className="flex-1 p-3 bg-surface border border-default rounded-lg text-center">
          <span className="block text-xl font-bold">{output.foundLeads}</span>
          <span className="block text-xs text-secondary">New Leads Found</span>
        </div>
        <div className="flex-1 p-3 bg-surface border border-default rounded-lg text-center">
          <span className="block text-xl font-bold">{output.totalLeads}</span>
          <span className="block text-xs text-secondary">Total in Queue</span>
        </div>
      </div>

      {/* Company List */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
          Discovered Companies
        </h3>
        <ul className="divide-y divide-subtle border-t border-b border-subtle">
          {output.leads.map((lead: any, i: number) => (
            <li key={i} className="flex justify-between items-center py-2">
              <span className="font-medium text-body-sm">{lead.company}</span>
              {lead.url && (
                <TextLink href={lead.url} target="_blank" rel="noopener noreferrer">
                  Visit
                </TextLink>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer hint */}
      <div className="pt-2 border-t border-subtle">
        <span className="text-xs text-primary font-medium">
          💡 Use score-leads to score these new leads
        </span>
      </div>
    </div>
  );
}

export default SearchLeads;
mountWidget(
  <AppsSDKUIProvider linkComponent="a">
    <SearchLeads />
  </AppsSDKUIProvider>
);
