"use client";

import { cn } from "@leadswap/utils";
import { motion, useInView } from "motion/react";
import { FunnelChart } from "../charts";
import { ReactNode, useRef, useState, useEffect } from "react";

interface AnalyticsSectionProps {
  className?: string;
  children?: ReactNode;
}

// Analytics chart icon
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      height="18"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path d="M2.75 10.75L6.396 7.10401C6.591 6.90901 6.908 6.90901 7.103 7.10401L10.396 10.397C10.591 10.592 10.908 10.592 11.103 10.397L15.249 6.25101" />
        <path d="M2.75 2.75V12.75C2.75 13.855 3.645 14.75 4.75 14.75H15.25" />
      </g>
    </svg>
  );
}

// Animated counter hook
function useAnimatedCounter(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | undefined;
    let rafId: number | null = null;
    let cancelled = false;
    const animate = (timestamp: number) => {
      if (cancelled) return;
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * eased));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isInView, end, duration]);

  return { count, ref };
}

// Funnel chart steps
const FUNNEL_STEPS = [
  {
    id: "views",
    label: "Views",
    value: 108855,
    colorClassName: "text-sky-500",
  },
  {
    id: "engagement",
    label: "Engagement",
    value: 2179,
    colorClassName: "text-violet-500",
  },
  {
    id: "conversions",
    label: "Conversions",
    value: 847,
    additionalValue: 858000,
    colorClassName: "text-emerald-400",
  },
];

// Animated metric tab
function MetricTab({
  label,
  value,
  displayValue,
  colorClass,
  isFirst,
  isLast,
  index,
}: {
  label: string;
  value: number;
  displayValue: string;
  colorClass: string;
  isFirst: boolean;
  isLast: boolean;
  index: number;
}) {
  const { count, ref } = useAnimatedCounter(value, 1500);

  // Format the display value with the animated count
  const formattedCount = value > 1000
    ? count.toLocaleString()
    : count.toString();

  return (
    <motion.div
      className="relative z-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
    >
      {!isFirst && (
        <motion.div
          className="absolute left-0 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-1.5"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-neutral-400">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </motion.div>
      )}
      <button
        type="button"
        className={cn(
          "border-box relative block h-full w-full min-w-[110px] flex-none px-4 py-3 sm:min-w-[240px] sm:px-8 sm:py-6 transition-colors focus:outline-none hover:bg-neutral-50 active:bg-neutral-100 ring-inset ring-neutral-500 focus-visible:ring-1",
          isFirst && "sm:first:rounded-tl-xl",
          isLast && "sm:last:rounded-tr-xl"
        )}
      >
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 w-full bg-neutral-900 transition-transform duration-100"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: isFirst ? 1 : 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          style={{ transformOrigin: "left" }}
        />
        <div className="flex items-center gap-2.5 text-sm text-neutral-600 transition-[opacity,filter] duration-200">
          <motion.div
            className={cn("h-2 w-2 rounded-sm bg-current shadow-[inset_0_0_0_1px_#00000019]", colorClass)}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          />
          <span>{label}</span>
        </div>
        <div className="mt-1 flex items-center gap-2 transition-[opacity,filter] duration-200">
          <span ref={ref} className="block text-xl font-medium text-neutral-900 sm:hidden">
            {value > 1000 ? `${(count / 1000).toFixed(1)}K` : formattedCount}
          </span>
          <span className="hidden text-2xl font-medium text-neutral-900 sm:block">
            {formattedCount}
          </span>
        </div>
      </button>
    </motion.div>
  );
}

export function AnalyticsSection({ className, children }: AnalyticsSectionProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const isChartInView = useInView(chartRef, { once: true, margin: "-100px" });

  return (
    <div className={cn("mx-auto max-w-[1080px] border-l border-r border-neutral-800", className)}>
      {/* Header */}
      <motion.div
        className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-14 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.span
          className="flex items-center gap-2 text-base font-medium text-neutral-500"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ChartIcon className="size-5" />
          Content Performance
        </motion.span>
        <motion.h2
          className="mt-3 text-pretty font-display text-3xl font-medium text-white sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Track every campaign
        </motion.h2>
        <motion.p
          className="mt-3 text-pretty text-base text-neutral-500 sm:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Monitor your UGC campaigns in real-time. See engagement, views,
          and conversions across all your creator content.
        </motion.p>
        <motion.div
          className="relative mt-10 flex max-w-fit flex-wrap gap-3"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.a
            className="max-w-fit rounded-lg border border-white bg-white px-5 py-2 text-sm font-medium text-black shadow-sm transition-all hover:bg-neutral-200 hover:ring-4 hover:ring-neutral-700 relative overflow-hidden"
            href="/contact"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%", transition: { duration: 0.5 } }}
            />
            <span className="relative z-10">Learn more</span>
          </motion.a>
          <motion.a
            className="max-w-fit rounded-lg border border-neutral-700 bg-neutral-900 px-5 py-2 text-sm font-medium text-neutral-400 shadow-sm transition-all hover:border-neutral-600 hover:text-white hover:ring-4 hover:ring-neutral-800"
            href="/contact"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Live demo
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Funnel Chart */}
      <div className="px-4">
        <motion.div
          ref={chartRef}
          className="relative overflow-hidden rounded-xl border border-neutral-800 bg-white"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Metric Tabs with animated counters */}
          <div className="flex justify-between overflow-x-scroll border-b border-neutral-200 scrollbar-hide">
            <div className="grid shrink-0 grow grid-cols-3 divide-x divide-neutral-200 overflow-y-hidden scrollbar-hide">
              <MetricTab
                label="Views"
                value={108855}
                displayValue="108,855"
                colorClass="text-sky-500/50"
                isFirst={true}
                isLast={false}
                index={0}
              />
              <MetricTab
                label="Engagement"
                value={2179}
                displayValue="2,179"
                colorClass="text-violet-500/50"
                isFirst={false}
                isLast={false}
                index={1}
              />
              <MetricTab
                label="Conversions"
                value={847}
                displayValue="847"
                colorClass="text-emerald-400/50"
                isFirst={false}
                isLast={true}
                index={2}
              />
            </div>
          </div>

          {/* Chart with fade-in */}
          <motion.div
            className="h-[320px] w-full sm:h-[380px]"
            initial={{ opacity: 0 }}
            animate={isChartInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <FunnelChart
              steps={FUNNEL_STEPS}
              defaultTooltipStepId="views"
              tooltips
              persistentPercentages
            />
          </motion.div>
        </motion.div>
      </div>
      {children}
    </div>
  );
}
