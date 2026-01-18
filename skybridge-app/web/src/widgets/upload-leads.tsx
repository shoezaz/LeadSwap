import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";

function UploadLeads() {
  const { input, output } = useToolInfo<"upload-leads">();

  if (!output) {
    return (
      <div className="widget-container loading">
        <div className="loader"></div>
        <p>Processing leads...</p>
      </div>
    );
  }

  if (!output.success) {
    return (
      <div className="widget-container error">
        <p>❌ Failed to upload leads</p>
      </div>
    );
  }

  return (
    <div className="widget-container">
      <div className="widget-header">
        <span className="icon">📥</span>
        <h2>Leads Uploaded</h2>
        <span className="badge badge-success">{output.leadsCount} leads</span>
      </div>

      <div className="upload-stats">
        <div className="stat-card">
          <span className="stat-value">{output.leadsCount}</span>
          <span className="stat-label">Total Leads</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{output.hasICP ? "✅" : "❌"}</span>
          <span className="stat-label">ICP Ready</span>
        </div>
      </div>

      {output.sample && output.sample.length > 0 && (
        <div className="sample-leads">
          <h3>Sample Preview</h3>
          <table className="leads-table mini">
            <thead>
              <tr>
                <th>Company</th>
                <th>Name</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {output.sample.map((lead: any, i: number) => (
                <tr key={i}>
                  <td className="company-cell">{lead.company}</td>
                  <td>{lead.name || "-"}</td>
                  <td>{lead.title || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!output.hasICP && (
        <div className="warning-banner">
          ⚠️ Define an ICP first to score these leads
        </div>
      )}
    </div>
  );
}

export default UploadLeads;
mountWidget(<UploadLeads />);
