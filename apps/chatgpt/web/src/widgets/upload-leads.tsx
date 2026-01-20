import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { UploadDocuments } from "@openai/apps-sdk-ui/components/Icon";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";

function UploadLeads() {
  const { output } = useToolInfo<"upload-leads">();

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <div className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-body-sm">Processing leads...</p>
      </div>
    );
  }

  if (!output.success) {
    return (
      <div className="p-6 rounded-xl bg-surface text-center border border-default">
        <p className="text-body-sm font-medium text-primary">❌ Failed to upload leads</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UploadDocuments className="size-5" />
          <h2 className="heading-sm">Leads Uploaded</h2>
        </div>
        <Badge color="success">{output.leadsCount} leads</Badge>
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        <div className="flex-1 p-3 bg-surface border border-default rounded-lg text-center">
          <span className="block text-xl font-bold">{output.leadsCount}</span>
          <span className="block text-xs text-secondary">Total Leads</span>
        </div>
        <div className="flex-1 p-3 bg-surface border border-default rounded-lg text-center">
          <span className="block text-xl font-bold">{output.hasICP ? "✅" : "❌"}</span>
          <span className="block text-xs text-secondary">ICP Ready</span>
        </div>
      </div>

      {/* Sample Preview */}
      {output.sample && output.sample.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
            Sample Preview
          </h3>
          <div className="overflow-x-auto rounded-lg border border-subtle">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-subtle/50">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">
                    Company
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">
                    Name
                  </th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-secondary uppercase">
                    Title
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle">
                {output.sample.map((lead: any, i: number) => (
                  <tr key={i} className="hover:bg-subtle/30">
                    <td className="px-3 py-2 font-medium">{lead.company}</td>
                    <td className="px-3 py-2 text-secondary">{lead.name || "-"}</td>
                    <td className="px-3 py-2 text-secondary">{lead.title || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Warning if no ICP */}
      {!output.hasICP && (
        <div className="p-3 rounded-lg border border-warning/50 bg-amber-50 dark:bg-amber-900/10 text-warning text-sm font-medium text-center">
          ⚠️ Define an ICP first to score these leads
        </div>
      )}
    </div>
  );
}

export default UploadLeads;
mountWidget(
  <AppsSDKUIProvider linkComponent="a">
    <UploadLeads />
  </AppsSDKUIProvider>
);
