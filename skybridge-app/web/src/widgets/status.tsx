import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";

function Status() {
  const { output } = useToolInfo<"status">();

  if (!output) {
    return (
      <div className="widget-container loading">
        <div className="loader"></div>
        <p>Loading status...</p>
      </div>
    );
  }

  return (
    <div className="widget-container status-widget">
      <div className="widget-header">
        <span className="icon">📊</span>
        <h2>LeadSwap Status</h2>
      </div>

      <div className="status-grid">
        {/* ICP Status */}
        <div className={`status-card ${output.hasICP ? "active" : "inactive"}`}>
          <div className="status-icon">{output.hasICP ? "🎯" : "⭕"}</div>
          <div className="status-content">
            <h3>ICP Profile</h3>
            {output.hasICP && output.icp ? (
              <>
                <span className="badge success">Active</span>
                <p className="status-detail">{output.icp.summary}</p>
              </>
            ) : (
              <>
                <span className="badge warning">Not Defined</span>
                <p className="status-hint">Use define-icp to set your target</p>
              </>
            )}
          </div>
        </div>

        {/* Leads Status */}
        <div className={`status-card ${output.leadsCount > 0 ? "active" : "inactive"}`}>
          <div className="status-icon">{output.leadsCount > 0 ? "📥" : "⭕"}</div>
          <div className="status-content">
            <h3>Leads</h3>
            {output.leadsCount > 0 ? (
              <>
                <span className="badge success">{output.leadsCount} loaded</span>
                <p className="status-detail">Ready for scoring</p>
              </>
            ) : (
              <>
                <span className="badge warning">Empty</span>
                <p className="status-hint">Use upload-leads or search-leads</p>
              </>
            )}
          </div>
        </div>

        {/* Scoring Status */}
        <div className={`status-card ${output.hasResults ? "active" : "inactive"}`}>
          <div className="status-icon">{output.hasResults ? "⚡" : "⭕"}</div>
          <div className="status-content">
            <h3>Scoring</h3>
            {output.hasResults && output.lastScoring ? (
              <>
                <span className="badge success">Complete</span>
                <div className="tier-mini-summary">
                  <span className="tier-mini tier-a">A: {output.lastScoring.tierBreakdown.tierA}</span>
                  <span className="tier-mini tier-b">B: {output.lastScoring.tierBreakdown.tierB}</span>
                  <span className="tier-mini tier-c">C: {output.lastScoring.tierBreakdown.tierC}</span>
                </div>
              </>
            ) : (
              <>
                <span className="badge warning">Not Run</span>
                <p className="status-hint">Use score-leads after setup</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="progress-tracker">
        <div className={`progress-step ${output.hasICP ? "complete" : "pending"}`}>
          <span className="step-number">1</span>
          <span className="step-label">Define ICP</span>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${output.leadsCount > 0 ? "complete" : "pending"}`}>
          <span className="step-number">2</span>
          <span className="step-label">Load Leads</span>
        </div>
        <div className="progress-line" />
        <div className={`progress-step ${output.hasResults ? "complete" : "pending"}`}>
          <span className="step-number">3</span>
          <span className="step-label">Score</span>
        </div>
      </div>
    </div>
  );
}

export default Status;
mountWidget(<Status />);
