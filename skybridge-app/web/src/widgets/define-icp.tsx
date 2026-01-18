import "@/index.css";
import { mountWidget } from "skybridge/web";
import { useToolInfo } from "../helpers";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";

function DefineICP() {
  const { output } = useToolInfo<"define-icp">();

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
      <div className="p-6 rounded-xl bg-surface text-center border border-default">
        <p className="text-sm font-medium text-primary">❌ Failed to create ICP</p>
      </div>
    );
  }

  const { icp } = output;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h2 className="heading-sm">Ideal Customer Profile</h2>
        </div>
        <Badge color="success">Active</Badge>
      </div>

      <div className="flex flex-col gap-6">
        {/* Industries */}
        {icp.industries.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
              Industries
            </h3>
            <div className="flex flex-wrap gap-2">
              {icp.industries.map((ind: string, i: number) => (
                <Badge key={i} color="neutral">
                  {ind}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Company Size */}
        {(icp.companySizeMin || icp.companySizeMax) && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
              Company Size
            </h3>
            <p className="text-body-sm text-primary">
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
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
              Geographies
            </h3>
            <div className="flex flex-wrap gap-2">
              {icp.geographies.map((geo: string, i: number) => (
                <Badge key={i} color="success">
                  {geo}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Target Titles */}
        {icp.titles.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
              Target Titles
            </h3>
            <div className="flex flex-wrap gap-2">
              {icp.titles.map((title: string, i: number) => (
                <Badge key={i} color="warning">
                  {title}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        {icp.keywords.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide">
              Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {icp.keywords.map((kw: string, i: number) => (
                <Badge key={i} color="primary">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-3 border-t border-subtle">
        <small className="text-xs text-secondary">ID: {icp.id}</small>
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
