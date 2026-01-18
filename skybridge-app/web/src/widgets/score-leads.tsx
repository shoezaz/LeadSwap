import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";

function ScoreLeads() {
  const { input, output } = useToolInfo<"score-leads">();

  if (!output) {
    return (
      <div className="widget-container loading">
        <div className="loader"></div>
        <p>Scoring leads against your ICP...</p>
        <small className="text-tertiary">This may take a moment</small>
      </div>
    );
  }

  if (!output.success) {
    return (
      <div className="widget-container error">
        <p>❌ Scoring failed</p>
      </div>
    );
  }

  const { tierBreakdown, topLeads, totalLeads, processingTimeMs } = output;

  return (
    <div className="widget-container">
      <div className="widget-header">
        <span className="icon">⚡</span>
        <h2>Scoring Complete</h2>
        <span className="badge badge-secondary">{processingTimeMs}ms</span>
      </div>

      {/* Tier breakdown cards */}
      <div className="tier-breakdown">
        <div className="tier-card tier-a">
          <span className="tier-label">Tier A</span>
          <span className="tier-count">{tierBreakdown.tierA}</span>
          <span className="tier-range">80-100 pts</span>
          <div className="tier-bar">
            <div 
              className="tier-fill" 
              style={{ width: `${(tierBreakdown.tierA / totalLeads) * 100}%` }}
            />
          </div>
        </div>
        <div className="tier-card tier-b">
          <span className="tier-label">Tier B</span>
          <span className="tier-count">{tierBreakdown.tierB}</span>
          <span className="tier-range">50-79 pts</span>
          <div className="tier-bar">
            <div 
              className="tier-fill" 
              style={{ width: `${(tierBreakdown.tierB / totalLeads) * 100}%` }}
            />
          </div>
        </div>
        <div className="tier-card tier-c">
          <span className="tier-label">Tier C</span>
          <span className="tier-count">{tierBreakdown.tierC}</span>
          <span className="tier-range">0-49 pts</span>
          <div className="tier-bar">
            <div 
              className="tier-fill" 
              style={{ width: `${(tierBreakdown.tierC / totalLeads) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top leads table */}
      <div className="top-leads">
        <h3>🏆 Top {topLeads.length} Leads</h3>
        <table className="leads-table">
          <thead>
            <tr>
              <th>Score</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Title</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {topLeads.map((lead: any, i: number) => (
              <tr key={i} className={`tier-${lead.tier.toLowerCase()}-row`}>
                <td>
                  <span className={`score-badge tier-${lead.tier.toLowerCase()}`}>
                    {lead.score}
                  </span>
                </td>
                <td className="company-cell">{lead.company}</td>
                <td>{lead.name || "-"}</td>
                <td>{lead.title || "-"}</td>
                <td className="email-cell">{lead.email || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="widget-footer">
        <span>Total: {totalLeads} leads scored</span>
      </div>
    </div>
  );
}

export default ScoreLeads;
mountWidget(<ScoreLeads />);
