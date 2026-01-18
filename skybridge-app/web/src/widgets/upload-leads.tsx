import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";

function UploadLeads() {
  const { input, output } = useToolInfo<"upload-leads">();

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <div className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-sm">Processing leads...</p>
      </div>
    );
  }

  if (!output.success) {
    return (
      <div className="p-6 rounded-xl bg-error/10 text-center">
        <p className="text-error font-medium">❌ Failed to upload leads</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-surface">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-subtle">
        <span className="text-xl">📥</span>
        <h2 className="flex-1 text-base font-semibold">Leads Uploaded</h2>
        <Badge color="success">{output.leadsCount} leads</Badge>
      </div>

      {/* Stats */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 p-3 bg-subtle rounded-lg text-center">
          <span className="block text-2xl font-bold">{output.leadsCount}</span>
          <span className="block text-xs text-secondary">Total Leads</span>
        </div>
        <div className="flex-1 p-3 bg-subtle rounded-lg text-center">
          <span className="block text-2xl font-bold">{output.hasICP ? "✅" : "❌"}</span>
          <span className="block text-xs text-secondary">ICP Ready</span>
        </div>
      </div>

      {/* Sample Preview */}
      {output.sample && output.sample.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-secondary mb-2">Sample Preview</h3>
          <div className="overflow-x-auto rounded-lg border border-subtle">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-subtle">
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
                  <tr key={i} className="hover:bg-subtle/50">
                    <td className="px-3 py-2 font-medium">{lead.company}</td>
                    <td className="px-3 py-2">{lead.name || "-"}</td>
                    <td className="px-3 py-2">{lead.title || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Warning if no ICP */}
      {!output.hasICP && (
        <div className="mt-4 p-3 rounded-lg bg-warning/10 text-warning text-sm font-medium text-center">
          ⚠️ Define an ICP first to score these leads
        </div>
      )}
    </div>
  );
}

export default UploadLeads;
mountWidget(<UploadLeads />);
