"use client";

import { motion, useInView, AnimatePresence } from "motion/react";

import { cn } from "@leadswap/utils";
import { Table, useTable } from "../table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState, useEffect, useRef } from "react";
import { Instagram, TikTok, YouTube, type Icon } from "../icons";

interface EventsStreamSectionProps {
  className?: string;
}

// Flag icon component
function FlagIcon({ code }: { code: string }) {
  return (
    <img
      alt={code}
      className="size-4 shrink-0"
      src={`https://hatscripts.github.io/circle-flags/flags/${code.toLowerCase()}.svg`}
    />
  );
}

// Animated counter hook with overshoot
function useAnimatedCounter(
  end: number | string,
  duration: number = 2000,
  startOnView: boolean = true
) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  // Parse the end value if it's a string with units
  const numericEnd = typeof end === 'string'
    ? parseFloat(end.replace(/[^0-9.]/g, ''))
    : end;
  const suffix = typeof end === 'string'
    ? end.replace(/[0-9.,]/g, '')
    : '';

  useEffect(() => {
    if (!startOnView || !isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | undefined;
    let rafId: number | null = null;
    let cancelled = false;
    const animate = (timestamp: number) => {
      if (cancelled) return;
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Overshoot easing - goes past target then settles
      const overshoot = 1.5;
      const eased = progress < 1
        ? 1 - Math.pow(1 - progress, 3) * Math.cos(progress * Math.PI * overshoot)
        : 1;

      setCount(Math.min(numericEnd * eased, numericEnd * 1.1));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setCount(numericEnd);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isInView, numericEnd, duration, startOnView]);

  return { count, suffix, ref };
}

// Events data type
type PlatformName = "TikTok" | "Instagram" | "YouTube";
type PlatformFilter = "all" | PlatformName;

const PLATFORM_ICONS: Record<PlatformName, Icon> = {
  TikTok,
  Instagram,
  YouTube,
};

const PLATFORM_COLORS: Record<PlatformName, string> = {
  TikTok: "from-pink-500 to-cyan-400",
  Instagram: "from-purple-500 via-pink-500 to-orange-400",
  YouTube: "from-red-500 to-red-600",
};

const PLATFORM_FILTERS: { id: PlatformFilter; label: string; icon?: Icon }[] = [
  { id: "all", label: "All" },
  { id: "TikTok", label: "TikTok", icon: TikTok },
  { id: "Instagram", label: "Instagram", icon: Instagram },
  { id: "YouTube", label: "YouTube", icon: YouTube },
];

type StatKey = "content" | "views" | "engagement";

const STAT_CARDS: {
  id: StatKey;
  label: string;
  value: string;
  numericValue: number;
  helper: string;
  gradient: string;
}[] = [
    { id: "content", label: "Content", value: "48", numericValue: 48, helper: "Pieces delivered in the last 24 hours", gradient: "from-blue-500 to-cyan-400" },
    { id: "views", label: "Views", value: "2.4M", numericValue: 2.4, helper: "Total campaign reach across networks", gradient: "from-violet-500 to-purple-400" },
    { id: "engagement", label: "Engagement", value: "12.4%", numericValue: 12.4, helper: "Average engagement rate this week", gradient: "from-emerald-500 to-teal-400" },
  ];

interface EventRow {
  id: string;
  event: string;
  link: PlatformName;
  customer: string;
  avatar: string;
  country: string;
  countryCode: string;
  amount: number;
  date: string;
}

// Demo events data
const EVENTS_DATA: EventRow[] = [
  { id: "1", event: "Content Delivered", link: "TikTok", customer: "Yuki Tanada", avatar: "yuki-tanada", country: "Japan", countryCode: "jp", amount: 4900, date: "Dec 13, 8:22 AM" },
  { id: "2", event: "Video Published", link: "Instagram", customer: "Isabella Garcia", avatar: "isabella-garcia", country: "Spain", countryCode: "es", amount: 9900, date: "Dec 13, 8:18 AM" },
  { id: "3", event: "Content Approved", link: "YouTube", customer: "Emma Thompson", avatar: "emma-thompson", country: "United States", countryCode: "us", amount: 2400, date: "Dec 13, 8:14 AM" },
  { id: "4", event: "Video Published", link: "TikTok", customer: "James Chen", avatar: "james-chen", country: "Switzerland", countryCode: "ch", amount: 4900, date: "Dec 13, 8:11 AM" },
  { id: "5", event: "Content Delivered", link: "Instagram", customer: "Sofia Rodriguez", avatar: "sofia-rodriguez", country: "Taiwan", countryCode: "tw", amount: 9900, date: "Dec 13, 8:07 AM" },
  { id: "6", event: "Review Submitted", link: "YouTube", customer: "Michael O'Connor", avatar: "michael-oconnor", country: "Taiwan", countryCode: "tw", amount: 2400, date: "Dec 13, 8:03 AM" },
  { id: "7", event: "Video Published", link: "TikTok", customer: "Yuki Tanada", avatar: "yuki-tanada", country: "Japan", countryCode: "jp", amount: 4900, date: "Dec 13, 7:59 AM" },
  { id: "8", event: "Content Approved", link: "Instagram", customer: "Isabella Garcia", avatar: "isabella-garcia", country: "Spain", countryCode: "es", amount: 9900, date: "Dec 13, 7:56 AM" },
];

// Animated sparkline SVG with draw-in effect
function AnimatedSparkline({ active = false, animate = false, gradient }: { active?: boolean; animate?: boolean; gradient: string }) {
  const gradientId = `sparkline-${gradient.replace(/\s/g, '-')}`;

  return (
    <svg
      width="140"
      height="64"
      className={cn(
        "h-full w-full transition-all duration-300",
        active ? "opacity-100 scale-100" : "opacity-50 scale-95",
      )}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" className={cn("stop-color-current", gradient.includes("blue") && "[stop-color:#3b82f6]", gradient.includes("violet") && "[stop-color:#8b5cf6]", gradient.includes("emerald") && "[stop-color:#10b981]")} />
          <stop offset="100%" className={cn("stop-color-current", gradient.includes("cyan") && "[stop-color:#22d3d8]", gradient.includes("purple") && "[stop-color:#a855f7]", gradient.includes("teal") && "[stop-color:#14b8a6]")} />
        </linearGradient>
        <linearGradient id={`${gradientId}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopOpacity="0.3" className={cn(gradient.includes("blue") && "[stop-color:#3b82f6]", gradient.includes("violet") && "[stop-color:#8b5cf6]", gradient.includes("emerald") && "[stop-color:#10b981]")} />
          <stop offset="100%" stopOpacity="0" className="[stop-color:transparent]" />
        </linearGradient>
      </defs>
      <g transform="translate(2, 8)">
        {/* Animated line stroke */}
        <motion.path
          strokeWidth="2"
          stroke={`url(#${gradientId})`}
          fill="none"
          d="M0,30 Q20,15 40,25 T80,20 T120,35 T136,25"
          initial={animate ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
        {/* Fill area */}
        <motion.path
          fill={`url(#${gradientId}-fill)`}
          d="M0,30 Q20,15 40,25 T80,20 T120,35 T136,25 L136,54 L0,54 Z"
          initial={animate ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: active ? 0.6 : 0.2 }}
          transition={{ duration: 0.5, delay: animate ? 1 : 0 }}
        />
        {/* Animated dot at end */}
        {active && (
          <motion.circle
            cx="136"
            cy="25"
            r="4"
            className={cn("fill-current", gradient.includes("blue") && "text-blue-500", gradient.includes("violet") && "text-violet-500", gradient.includes("emerald") && "text-emerald-500")}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </g>
    </svg>
  );
}

// Animated stat card with gradient border
function AnimatedStatCard({
  stat,
  isActive,
  onClick,
  index,
}: {
  stat: typeof STAT_CARDS[0];
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const { count, ref } = useAnimatedCounter(
    stat.numericValue,
    1500,
    true
  );

  // Format display value
  const displayValue = stat.id === "views"
    ? `${count.toFixed(1)}M`
    : stat.id === "engagement"
      ? `${count.toFixed(1)}%`
      : Math.round(count).toString();

  return (
    <motion.button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        "relative flex justify-between gap-4 rounded-xl border px-5 py-4 text-left transition-all focus:outline-none overflow-hidden",
        isActive
          ? "border-neutral-900 shadow-lg"
          : "border-neutral-200 hover:border-neutral-300",
      )}
      initial={{ opacity: 0, y: 30, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: 0.2 + index * 0.15,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.2)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Gradient background glow when active */}
      <motion.div
        className={cn(
          "absolute inset-0 opacity-0 bg-gradient-to-br",
          stat.gradient
        )}
        animate={{ opacity: isActive ? 0.05 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative">
        <motion.p
          className="text-sm text-neutral-600"
          animate={{ color: isActive ? "#374151" : "#6b7280" }}
        >
          {stat.label}
        </motion.p>
        <div className="mt-2 flex items-baseline gap-1">
          <motion.span
            ref={ref}
            className={cn(
              "text-3xl font-semibold transition-colors",
              isActive ? "text-neutral-900" : "text-neutral-700"
            )}
            animate={{
              scale: isActive ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {displayValue}
          </motion.span>
        </div>
      </div>
      <div className="relative h-full max-w-[140px] grow">
        <AnimatedSparkline active={isActive} animate={true} gradient={stat.gradient} />
      </div>
    </motion.button>
  );
}

// Animated event row
function AnimatedEventRow({
  row,
  index
}: {
  row: EventRow;
  index: number;
}) {
  const IconComponent = PLATFORM_ICONS[row.link];

  return (
    <motion.div
      className="flex items-center gap-4 px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors group cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.02)" }}
    >
      {/* Platform icon with gradient ring on hover */}
      <motion.div
        className={cn(
          "flex size-10 items-center justify-center rounded-full border-2 transition-all",
          "border-neutral-200 bg-white text-neutral-700"
        )}
        whileHover={{
          scale: 1.1,
          borderColor: row.link === "TikTok" ? "#f472b6" : row.link === "Instagram" ? "#a855f7" : "#ef4444"
        }}
      >
        {IconComponent && <IconComponent className="h-5 w-5" />}
      </motion.div>

      {/* Event info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-neutral-900 text-sm">{row.event}</span>
          <motion.span
            className={cn(
              "px-2 py-0.5 text-xs rounded-full font-medium",
              row.link === "TikTok" && "bg-pink-100 text-pink-700",
              row.link === "Instagram" && "bg-purple-100 text-purple-700",
              row.link === "YouTube" && "bg-red-100 text-red-700",
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 + 0.2, type: "spring", stiffness: 500 }}
          >
            {row.link}
          </motion.span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1.5">
            <FlagIcon code={row.countryCode} />
            <span className="text-neutral-500 text-sm">{row.customer}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-right">
        <div>
          <motion.span
            className="text-sm font-semibold text-neutral-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.3 }}
          >
            {(row.amount / 100).toFixed(0)}K
          </motion.span>
          <p className="text-xs text-neutral-400">views</p>
        </div>
        <motion.span
          className="text-xs text-neutral-400 min-w-[100px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.4 }}
        >
          {row.date}
        </motion.span>
      </div>

      {/* Hover arrow */}
      <motion.svg
        className="w-5 h-5 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        initial={{ x: -5 }}
        whileHover={{ x: 0 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </motion.svg>
    </motion.div>
  );
}

// Custom events list with animations
function AnimatedEventsList({ data }: { data: EventRow[] }) {
  return (
    <div className="rounded-lg border border-neutral-200 overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-2 bg-neutral-50 border-b border-neutral-200 text-xs font-medium text-neutral-500 uppercase tracking-wider">
        <div className="w-10" />
        <div className="flex-1">Event</div>
        <div className="w-[100px] text-right">Views</div>
        <div className="w-[100px] text-right">Date</div>
        <div className="w-5" />
      </div>

      {/* Rows with staggered animation */}
      <AnimatePresence mode="popLayout">
        {data.map((row, index) => (
          <AnimatedEventRow key={row.id} row={row} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function EventsStreamSection({ className }: EventsStreamSectionProps) {
  const [selectedStat, setSelectedStat] = useState<StatKey>("engagement");
  const [activePlatform, setActivePlatform] = useState<PlatformFilter>("all");
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true, margin: "-50px" });

  const filteredEvents = useMemo(() => {
    if (activePlatform === "all") {
      return EVENTS_DATA;
    }
    return EVENTS_DATA.filter((event) => event.link === activePlatform);
  }, [activePlatform]);

  return (
    <div className={cn("mx-auto max-w-[1080px] border-l border-r border-neutral-800", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex w-full max-w-xl flex-col items-center px-4 py-14 text-center"
      >
        <motion.span
          className="flex items-center gap-2 text-base font-medium text-neutral-500"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.svg
            height="18"
            width="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <g fill="currentColor">
              <path
                d="M3.75,3c1.784-.232,3.073,.092,4.021,.625,1.641,.922,1.87,2.249,3.5,3.125,1.254,.674,2.66,.719,3.979,.5-2.075,2.554-3.703,3.051-4.833,3-1.433-.064-2.359-1.021-4.125-.792-1.13,.147-1.995,.701-2.542,1.135"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <line
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                x1="3.75"
                x2="3.75"
                y1="1.75"
                y2="16.25"
              />
            </g>
          </motion.svg>
          Campaign Activity
        </motion.span>
        <motion.h2
          className="mt-3 text-pretty font-display text-3xl font-medium text-white sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Watch content go live
        </motion.h2>
        <motion.p
          className="mt-3 text-pretty text-base text-neutral-500 sm:text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Track every content delivery, publication, and engagement in real-time.
        </motion.p>
      </motion.div>

      {/* Stats & Table - Improved entrance */}
      <div className="px-4 pb-14" ref={panelRef}>
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: 10 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1, rotateX: 0 } : {}}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.1
          }}
          className="relative rounded-2xl border border-neutral-800 bg-white p-6 shadow-2xl"
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d"
          }}
        >
          {/* Decorative gradient blur behind */}
          <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 rounded-3xl blur-2xl -z-10" />

          {/* Stats Cards with animated counters */}
          <div className="grid w-full grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {STAT_CARDS.map((stat, index) => (
              <AnimatedStatCard
                key={stat.id}
                stat={stat}
                isActive={selectedStat === stat.id}
                onClick={() => setSelectedStat(stat.id)}
                index={index}
              />
            ))}
          </div>

          {/* Helper text with smooth transition */}
          <AnimatePresence mode="wait">
            <motion.p
              className="mt-4 text-sm text-neutral-500 flex items-center gap-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              key={selectedStat}
            >
              <motion.span
                className="inline-block w-2 h-2 rounded-full"
                style={{
                  background: selectedStat === "content" ? "linear-gradient(to right, #3b82f6, #22d3ee)"
                    : selectedStat === "views" ? "linear-gradient(to right, #8b5cf6, #a855f7)"
                      : "linear-gradient(to right, #10b981, #14b8a6)"
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              {STAT_CARDS.find((stat) => stat.id === selectedStat)?.helper}
            </motion.p>
          </AnimatePresence>

          {/* Events Table */}
          <div className="mt-6 space-y-4">
            {/* Platform filter pills with animated selection */}
            <div className="flex flex-wrap gap-2">
              {PLATFORM_FILTERS.map(({ id, label, icon: IconComponent }, filterIndex) => {
                const isActive = activePlatform === id;
                return (
                  <motion.button
                    key={id}
                    type="button"
                    onClick={() => setActivePlatform(id)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all focus:outline-none relative overflow-hidden",
                      isActive
                        ? "border-neutral-900 bg-neutral-900 text-white shadow-lg"
                        : "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50",
                    )}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: filterIndex * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Shine effect on active */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    )}
                    {IconComponent && (
                      <motion.span
                        animate={{ rotate: isActive ? [0, 360] : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <IconComponent className="h-4 w-4" />
                      </motion.span>
                    )}
                    <span>{label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Animated events list */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePlatform}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <AnimatedEventsList data={filteredEvents} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent rounded-b-2xl pointer-events-none" />
        </motion.div>
      </div>
    </div >
  );
}
