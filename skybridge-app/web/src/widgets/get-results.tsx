import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";

function GetResults() {
  const { input, output } = useToolInfo<"get-results">();

  if (!output) {
    return (
      <div className="widget-container loading">
        <div className="loader"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  const { leads, tier, filteredCount, totalResults, tierBreakdown } = output;

  return (
    <div className="widget-container results-widget">
      <div className="widget-header">
        <span className="icon">📊</span>
        <h2>Lead Results</h2>
        <span className="badge info">{tier}</span>
      </div>

      {/* Summary stats */}
      <div className="results-summary">
        <div className="summary-stat">
          <span className="value">{filteredCount}</span>
          <span className="label">Showing</span>
        </div>
        <div className="summary-stat">
          <span className="value">{totalResults}</span>
          <span className="label">Total</span>
        </div>
        <div className="summary-stat tier-a-bg">
          <span className="value">{tierBreakdown.tierA}</span>
          <span className="label">Tier A</span>
        </div>
        <div className="summary-stat tier-b-bg">
          <span className="value">{tierBreakdown.tierB}</span>
          <span className="label">Tier B</span>
        </div>
        <div className="summary-stat tier-c-bg">
          <span className="value">{tierBreakdown.tierC}</span>
          <span className="label">Tier C</span>
        </div>
      </div>

      {/* Results table */}
      <div className="results-table-wrapper">
        <table className="leads-table full">
          <thead>
            <tr>
              <th>Score</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Title</th>
              <th>Email</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead: any) => (
              <tr key={lead.id} className={`tier-${lead.tier.toLowerCase()}-row`}>
                <td>
                  <div className="score-cell">
                    <span className={`score-badge tier-${lead.tier.toLowerCase()}`}>
                      {lead.score}
                    </span>
                    <span className={`tier-indicator tier-${lead.tier.toLowerCase()}`}>
                      {lead.tier}
                    </span>
                  </div>
                </td>
                <td className="company-cell">
                  <strong>{lead.company}</strong>
                </td>
                <td>{lead.name || "-"}</td>
                <td>{lead.title || "-"}</td>
                <td className="email-cell">
                  {lead.email ? (
                    <a href={`mailto:${lead.email}`}>{lead.email}</a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="url-cell">
                  {lead.url ? (
                    <a href={lead.url} target="_blank" rel="noopener noreferrer">
                      🔗
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Match details expandable (first lead) */}
      {leads.length > 0 && leads[0].matchDetails && (
        <div className="match-details-example">
          <h4>Score Breakdown (Example: {leads[0].company})</h4>
          <div className="match-bars">
            <div className="match-bar-row">
              <span className="match-label">Industry</span>
              <div className="match-bar">
                <div 
                  className="match-fill" 
                  style={{ width: `${(leads[0].matchDetails.industryMatch / 30) * 100}%` }}
                />
              </div>
              <span className="match-value">{leads[0].matchDetails.industryMatch}/30</span>
            </div>
            <div className="match-bar-row">
              <span className="match-label">Size</span>
              <div className="match-bar">
                <div 
                  className="match-fill" 
                  style={{ width: `${(leads[0].matchDetails.sizeMatch / 20) * 100}%` }}
                />
              </div>
              <span className="match-value">{leads[0].matchDetails.sizeMatch}/20</span>
            </div>
            <div className="match-bar-row">
              <span className="match-label">Geography</span>
              <div className="match-bar">
                <div 
                  className="match-fill" 
                  style={{ width: `${(leads[0].matchDetails.geoMatch / 20) * 100}%` }}
                />
              </div>
              <span className="match-value">{leads[0].matchDetails.geoMatch}/20</span>
            </div>
            <div className="match-bar-row">
              <span className="match-label">Title</span>
              <div className="match-bar">
                <div 
                  className="match-fill" 
                  style={{ width: `${(leads[0].matchDetails.titleMatch / 20) * 100}%` }}
                />
              </div>
              <span className="match-value">{leads[0].matchDetails.titleMatch}/20</span>
            </div>
            <div className="match-bar-row">
              <span className="match-label">Keywords</span>
              <div className="match-bar">
                <div 
                  className="match-fill" 
                  style={{ width: `${(leads[0].matchDetails.keywordMatch / 10) * 100}%` }}
                />
              </div>
              <span className="match-value">{leads[0].matchDetails.keywordMatch}/10</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GetResults;
mountWidget(<GetResults />);
