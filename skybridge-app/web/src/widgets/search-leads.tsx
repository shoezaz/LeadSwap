import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";

function SearchLeads() {
  const { input, output } = useToolInfo<"search-leads">();

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <div className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-sm">Searching for leads matching your ICP...</p>
        <small className="text-xs text-tertiary">Powered by Exa.ai</small>
      </div>
    );
  }

  if (!output.success) {
    return (
      <div className="p-6 rounded-xl bg-error/10 text-center">
        <p className="text-error font-medium">❌ Search failed</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-surface">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-subtle">
        <span className="text-xl">🔍</span>
        <h2 className="flex-1 text-base font-semibold">Leads Found</h2>
        <Badge color="success">{output.foundLeads} new</Badge>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 p-3 bg-primary text-on-primary rounded-lg text-center">
          <span className="block text-2xl font-bold">{output.foundLeads}</span>
          <span className="block text-xs opacity-80">New Leads Found</span>
        </div>
        <div className="flex-1 p-3 bg-subtle rounded-lg text-center">
          <span className="block text-2xl font-bold">{output.totalLeads}</span>
          <span className="block text-xs text-secondary">Total in Queue</span>
        </div>
      </div>

      {/* Company List */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-secondary mb-2">Discovered Companies</h3>
        <ul className="divide-y divide-subtle">
          {output.leads.map((lead: any, i: number) => (
            <li key={i} className="flex justify-between items-center py-2">
              <span className="font-medium">{lead.company}</span>
              {lead.url && (
                <a
                  href={lead.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  🔗 Visit
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer hint */}
      <div className="mt-4 pt-3 border-t border-subtle">
        <span className="text-xs text-primary font-medium">
          💡 Use score-leads to score these new leads
        </span>
      </div>
    </div>
  );
}

export default SearchLeads;
mountWidget(<SearchLeads />);
