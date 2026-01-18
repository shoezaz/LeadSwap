import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";

function DefineICP() {
  const { input, output } = useToolInfo<"define-icp">();

  if (!output) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[120px] gap-3 text-secondary">
        <div className="w-6 h-6 border-2 border-subtle border-t-primary rounded-full animate-spin" />
        <p className="text-sm">Analyzing your ICP description...</p>
      </div>
    );
  }

  if (!output.success) {
    return (
      <div className="p-6 rounded-xl bg-error/10 text-center">
        <p className="text-error font-medium">❌ Failed to create ICP</p>
      </div>
    );
  }

  const { icp } = output;

  return (
    <div className="p-4 bg-surface rounded-xl border border-subtle overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 mb-4 border-b border-subtle">
        <span className="text-xl">🎯</span>
        <h2 className="flex-1 text-base font-semibold">Ideal Customer Profile</h2>
        <Badge color="success">Active</Badge>
      </div>

      <div className="space-y-4">
        {/* Industries */}
        {icp.industries.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">
              🏢 Industries
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {icp.industries.map((ind: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-sm font-medium rounded-md bg-blue-100 text-blue-700"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Company Size */}
        {(icp.companySizeMin || icp.companySizeMax) && (
          <div>
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">
              👥 Company Size
            </h3>
            <p className="text-base font-medium">
              {icp.companySizeMin && icp.companySizeMax
                ? `${icp.companySizeMin} - ${icp.companySizeMax} employees`
                : icp.companySizeMin
                  ? `${icp.companySizeMin}+ employees`
                  : `Up to ${icp.companySizeMax} employees`}
            </p>
          </div>
        )}

        {/* Geographies */}
        {icp.geographies.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">
              🌍 Geographies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {icp.geographies.map((geo: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-sm font-medium rounded-md bg-green-100 text-green-700"
                >
                  {geo}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Target Titles */}
        {icp.titles.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">
              👤 Target Titles
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {icp.titles.map((title: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-sm font-medium rounded-md bg-amber-100 text-amber-700"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        {icp.keywords.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">
              🔑 Keywords
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {icp.keywords.map((kw: string, i: number) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-sm font-medium rounded-md bg-purple-100 text-purple-700"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-subtle">
        <small className="text-xs text-tertiary">ID: {icp.id}</small>
      </div>
    </div>
  );
}

export default DefineICP;
mountWidget(
  <AppsSDKUIProvider>
    <DefineICP />
  </AppsSDKUIProvider>
);
