import { FunnelChart } from "@leadswap/ui/charts";
import { useContext, useMemo } from "react";
import { AnalyticsLoadingSpinner } from "./analytics-loading-spinner";
import { AnalyticsContext } from "./analytics-provider";

export function AnalyticsFunnelChart({ demo = false }: { demo?: boolean }) {
  const { totalEvents } = useContext(AnalyticsContext);

  const steps = useMemo(
    () => [
      {
        id: "views",
        label: "Views",
        value: demo ? 130000 : totalEvents?.clicks ?? 0,
        colorClassName: "text-sky-500",
      },
      {
        id: "submissions",
        label: "Submissions",
        value: demo ? 100 : totalEvents?.leads ?? 0,
        colorClassName: "text-indigo-500",
      },
      {
        id: "earnings",
        label: "Earnings",
        value: demo ? 24 : totalEvents?.sales ?? 0,
        additionalValue: demo ? 228_00 : totalEvents?.saleAmount ?? 0,
        colorClassName: "text-emerald-400",
      },
    ],
    [demo, totalEvents],
  );

  return (
    <>
      {totalEvents || demo ? (
        <FunnelChart
          steps={steps}
          defaultTooltipStepId={demo ? "sales" : undefined}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <AnalyticsLoadingSpinner />
        </div>
      )}
    </>
  );
}
