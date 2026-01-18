import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";

function SearchLeads() {
  const { input, output } = useToolInfo<"search-leads">();

  if (!output) {
    return (
      <div className="widget-container loading">
        <div className="loader"></div>
        <p>Searching for leads matching your ICP...</p>
        <small>Powered by Exa.ai</small>
      </div>
    );
  }

  if (!output.success) {
    return (
      <div className="widget-container error">
        <p>❌ Search failed</p>
      </div>
    );
  }

  return (
    <div className="widget-container search-widget">
      <div className="widget-header">
        <span className="icon">🔍</span>
        <h2>Leads Found</h2>
        <span className="badge success">{output.foundLeads} new</span>
      </div>

      <div className="search-stats">
        <div className="stat-card highlight">
          <span className="stat-value">{output.foundLeads}</span>
          <span className="stat-label">New Leads Found</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{output.totalLeads}</span>
          <span className="stat-label">Total in Queue</span>
        </div>
      </div>

      <div className="found-leads">
        <h3>Discovered Companies</h3>
        <ul className="company-list">
          {output.leads.map((lead: any, i: number) => (
            <li key={i} className="company-item">
              <span className="company-name">{lead.company}</span>
              {lead.url && (
                <a 
                  href={lead.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="company-link"
                >
                  🔗 Visit
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="widget-footer">
        <span className="hint">💡 Use score-leads to score these new leads</span>
      </div>
    </div>
  );
}

export default SearchLeads;
mountWidget(<SearchLeads />);
