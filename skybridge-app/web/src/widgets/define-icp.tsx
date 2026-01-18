import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";

function DefineICP() {
  const { input, output } = useToolInfo<"define-icp">();

  if (!output) {
    return (
      <div className="widget-container loading">
        <div className="loader"></div>
        <p>Analyzing your ICP description...</p>
      </div>
    );
  }

  if (!output.success) {
    return (
      <div className="widget-container error">
        <p>❌ Failed to create ICP</p>
      </div>
    );
  }

  const { icp } = output;

  return (
    <div className="widget-container">
      <div className="widget-header">
        <span className="icon">🎯</span>
        <h2>Ideal Customer Profile</h2>
        <span className="badge badge-success">Active</span>
      </div>

      <div className="space-y-4">
        {icp.industries.length > 0 && (
          <div className="icp-section">
            <h3>🏢 Industries</h3>
            <div className="tags">
              {icp.industries.map((ind: string, i: number) => (
                <span key={i} className="tag industry">{ind}</span>
              ))}
            </div>
          </div>
        )}

        {(icp.companySizeMin || icp.companySizeMax) && (
          <div className="icp-section">
            <h3>👥 Company Size</h3>
            <p className="size-range">
              {icp.companySizeMin && icp.companySizeMax
                ? `${icp.companySizeMin} - ${icp.companySizeMax} employees`
                : icp.companySizeMin
                ? `${icp.companySizeMin}+ employees`
                : `Up to ${icp.companySizeMax} employees`}
            </p>
          </div>
        )}

        {icp.geographies.length > 0 && (
          <div className="icp-section">
            <h3>🌍 Geographies</h3>
            <div className="tags">
              {icp.geographies.map((geo: string, i: number) => (
                <span key={i} className="tag geo">{geo}</span>
              ))}
            </div>
          </div>
        )}

        {icp.titles.length > 0 && (
          <div className="icp-section">
            <h3>👤 Target Titles</h3>
            <div className="tags">
              {icp.titles.map((title: string, i: number) => (
                <span key={i} className="tag title">{title}</span>
              ))}
            </div>
          </div>
        )}

        {icp.keywords.length > 0 && (
          <div className="icp-section">
            <h3>🔑 Keywords</h3>
            <div className="tags">
              {icp.keywords.map((kw: string, i: number) => (
                <span key={i} className="tag keyword">{kw}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="widget-footer">
        <small className="text-tertiary">ID: {icp.id}</small>
      </div>
    </div>
  );
}

export default DefineICP;
mountWidget(<DefineICP />);
