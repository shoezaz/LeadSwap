"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

export interface PartnersStatsSectionProps {
  title?: string;
  description?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

// Parse stat value to get numeric part and suffix
function parseStatValue(value: string): { numeric: number; suffix: string; prefix: string } {
  const match = value.match(/^([+]?)([0-9,.]+)([KMB+%]*)$/);
  if (match) {
    return {
      prefix: match[1] || "",
      numeric: parseFloat(match[2].replace(/,/g, "")),
      suffix: match[3] || "",
    };
  }
  return { prefix: "", numeric: 0, suffix: value };
}

// Animated stat counter with overshoot easing
function AnimatedStat({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");
  const hasAnimated = useRef(false);

  const { numeric, suffix, prefix } = parseStatValue(value);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    let startTime: number | undefined;
    let rafId: number | null = null;
    let cancelled = false;

    const animate = (timestamp: number) => {
      if (cancelled) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Overshoot easing (goes past target then settles back)
      // Custom cubic-bezier approximation for overshoot
      let eased: number;
      if (progress < 0.8) {
        // Go to 1.1 of target in first 80% of time
        eased = 1.1 * (1 - Math.pow(1 - progress / 0.8, 3));
      } else {
        // Settle back to 1.0 in remaining 20%
        const settleProgress = (progress - 0.8) / 0.2;
        eased = 1.1 - 0.1 * (1 - Math.pow(1 - settleProgress, 2));
      }

      const currentValue = Math.min(numeric * eased, numeric * 1.1);

      // Format based on the original format
      if (suffix.includes("K")) {
        setDisplayValue(`${currentValue.toFixed(0)}K`);
      } else if (suffix.includes("M")) {
        setDisplayValue(`${currentValue.toFixed(0)}M`);
      } else if (suffix.includes("+")) {
        setDisplayValue(`${currentValue.toLocaleString()}+`);
      } else {
        setDisplayValue(currentValue.toLocaleString());
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        // Set final value exactly
        setDisplayValue(value.replace(/^[+]/, ""));
      }
    };

    // Stagger start based on index
    const timeout = setTimeout(() => {
      rafId = requestAnimationFrame(animate);
    }, index * 200);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [isInView, numeric, suffix, value, index]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-col justify-center text-center gap-2"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <motion.div
        className="font-mono font-medium text-center whitespace-nowrap text-violet-400 text-3xl sm:text-4xl md:text-[48px] leading-tight md:leading-[48px]"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: 0.1 + index * 0.15,
          ease: [0.34, 1.56, 0.64, 1] // bounce
        }}
      >
        {prefix}{displayValue}
      </motion.div>
      <motion.span
        className="block text-center text-violet-300/70 text-xs leading-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.4 + index * 0.15 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

const DEFAULT_STATS = [
  { value: "37K+", label: "creators in our network" },
  { value: "1,200+", label: "UGC videos delivered" },
  { value: "15M+", label: "total views generated" },
];

export const DEFAULT_PARTNERS_STATS_PROPS = {
  title: "Proven content creation at scale",
  description:
    "We've helped startups and SaaS brands produce hundreds of high-converting UGC videos – ",
  descriptionEmphasis: "and counting",
};

export function PartnersStatsSection({
  title = DEFAULT_PARTNERS_STATS_PROPS.title,
  description = DEFAULT_PARTNERS_STATS_PROPS.description,
  stats = DEFAULT_STATS,
}: PartnersStatsSectionProps) {
  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] pt-20 pr-0 pb-20 pl-0 z-[0]">
        <div className="items-center flex flex-col gap-8 md:gap-12">
          {/* Header */}
          <motion.div
            className="ml-auto mr-auto text-center w-full max-w-[700px] pt-0 pr-4 pb-0 pl-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="font-medium text-center text-neutral-50 text-2xl sm:text-3xl md:text-[36px] leading-tight md:leading-[40px]"
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {title}
            </motion.h2>
            <motion.p
              className="text-center mt-3 text-neutral-400 text-base sm:text-lg leading-7"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {description}
              <motion.span
                className="italic font-medium text-center text-neutral-300"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                {DEFAULT_PARTNERS_STATS_PROPS.descriptionEmphasis}
              </motion.span>
              .
            </motion.p>
          </motion.div>

          {/* Stats grid with animated counters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 text-center w-full gap-6 sm:gap-8 max-w-[700px] px-4">
            {stats.map((stat, index) => (
              <AnimatedStat
                key={index}
                value={stat.value}
                label={stat.label}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
