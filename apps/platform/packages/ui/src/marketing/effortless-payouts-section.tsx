"use client";

import { motion } from "motion/react";

import { ReactNode, useState, useEffect } from "react";
import { CheckCircle2, Receipt } from "lucide-react";

export interface EffortlessPayoutsSectionProps {
  title?: string;
  description?: string;
}

// Asset URLs from mockup
const ASSETS = {
  avatarSprite:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F1fc1ccce812f240314551df42c8d6a4143b173a5.jpg?generation=1762752201013689&alt=media",
};

// Animated chat message bubble
function AnimatedChatBubble({
  content,
  isMySide,
  avatarPosition,
  isVisible,
  delay = 0,
}: {
  content: string | ReactNode;
  isMySide: boolean;
  avatarPosition: string;
  isVisible: boolean;
  delay?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    }
    setShow(false);
  }, [isVisible, delay]);

  return (
    <div
      className={`flex items-end gap-2 transition-all duration-500 ${isMySide ? "flex-row-reverse origin-bottom-right" : "origin-bottom-left"
        } ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"}`}
    >
      <div className="relative shrink-0">
        <div
          className="w-8 h-8 bg-size-[1400%] rounded-full"
          style={{
            backgroundImage: `url("${ASSETS.avatarSprite}")`,
            backgroundPosition: `${avatarPosition} 0%`,
          }}
        />
      </div>
      <div className={`flex min-w-0 flex-col gap-1 ${isMySide ? "items-end" : "items-start"}`}>
        <div
          className={`max-w-[280px] whitespace-pre-wrap break-words rounded-xl px-4 py-2.5 text-sm ${isMySide
            ? "text-white rounded-br-sm bg-neutral-700"
            : "text-neutral-900 rounded-bl-sm bg-neutral-100"
            }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

// Creator communication illustration with chat animation
function CreatorCommunicationIllustration() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 2000),
      setTimeout(() => setStep(3), 4000),
      setTimeout(() => setStep(0), 7000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [step === 0]);

  return (
    <div className="overflow-hidden relative h-[280px]">
      <div className="size-full overflow-hidden">
        <div className="flex flex-col size-full justify-end ml-auto mr-auto relative gap-3 max-w-sm px-4 pb-4">
          <AnimatedChatBubble
            content="Hey! I can get you 30% off for your first year 🎉"
            isMySide={true}
            avatarPosition="1300%"
            isVisible={step >= 1}
            delay={0}
          />
          <AnimatedChatBubble
            content={
              <div className="flex flex-col gap-1">
                <span>Here's my referral link:</span>
                <span className="text-violet-300 underline">refer.cliqo.com/mia</span>
              </div>
            }
            isMySide={true}
            avatarPosition="1300%"
            isVisible={step >= 2}
            delay={0}
          />
          <AnimatedChatBubble
            content="Omg thank you so much!! 🙌"
            isMySide={false}
            avatarPosition="1500%"
            isVisible={step >= 3}
            delay={0}
          />
        </div>
      </div>
    </div>
  );
}

// PayoutStats replica - faithful to apps/web/app/.../payouts/payout-stats.tsx
// Shows "Pending payouts" with confirm button + "Total paid" with view invoices
function PayoutStatsIllustration() {
  const [pendingAmount, setPendingAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    const targetPending = 245000; // $2,450.00 in cents
    const targetTotal = 1284500; // $12,845.00 in cents
    const duration = 2000;
    const steps = 40;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setPendingAmount(Math.floor(targetPending * easeOut));
      setTotalPaid(Math.floor(targetTotal * easeOut));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  return (
    <div className="overflow-hidden relative h-[280px]">
      <div className="flex flex-col size-full justify-center items-center p-4">
        {/* Exact replica of PayoutStats from app - dark mode version */}
        <div className="grid grid-cols-1 divide-neutral-700 rounded-lg border border-neutral-700 bg-neutral-800/50 w-full max-w-[240px] divide-y">
          {/* Pending payouts */}
          <div className="flex flex-col p-4">
            <div className="flex justify-between gap-2 items-start">
              <div>
                <div className="text-sm text-neutral-400">Pending payouts</div>
              </div>
              <button className="h-7 px-2 text-xs font-medium rounded-md bg-neutral-700 text-neutral-100 hover:bg-neutral-600 transition-colors">
                Confirm
              </button>
            </div>
            <div className="mt-2 text-xl text-neutral-100 font-medium">
              {formatCurrency(pendingAmount)} USD
            </div>
          </div>

          {/* Total paid */}
          <div className="flex flex-col p-4">
            <div className="flex justify-between gap-2 items-start">
              <div>
                <div className="text-sm text-neutral-400">Total paid</div>
              </div>
              <button className="h-7 px-2 text-xs font-medium rounded-md border border-neutral-600 text-neutral-300 hover:bg-neutral-700 transition-colors">
                Invoices
              </button>
            </div>
            <div className="mt-2 text-xl text-neutral-100 font-medium">
              {formatCurrency(totalPaid)} USD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// Animated Card Selector - inspired by CardSelector from @leadswap/ui
function PayoutScheduleIllustration() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const schedules = [
    { key: "weekly", label: "Weekly", description: "Every Friday" },
    { key: "biweekly", label: "Bi-weekly", description: "Every 2 weeks" },
    { key: "monthly", label: "Monthly", description: "1st of month" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % schedules.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden relative h-[280px]">
      <div className="flex flex-col size-full justify-center items-center px-4">
        <div className="flex flex-col gap-2.5 w-full max-w-[220px]">
          {schedules.map((schedule, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={schedule.key}
                className={`relative flex items-start rounded-lg border p-3 transition-all duration-300 cursor-pointer ${isSelected
                  ? "border-violet-500/70 bg-violet-500/5 ring-1 ring-violet-500/30"
                  : "border-neutral-700/50 bg-neutral-900/50 hover:border-neutral-600"
                  }`}
              >
                {/* Radio button */}
                <div
                  className={`mt-0.5 mr-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? "border-violet-500 bg-violet-500" : "border-neutral-600"
                    }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                {/* Content */}
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${isSelected ? "text-neutral-100" : "text-neutral-300"
                      }`}
                  >
                    {schedule.label}
                  </span>
                  <span className="text-xs text-neutral-500">{schedule.description}</span>
                </div>
                {/* Checkmark */}
                <div
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    }`}
                >
                  {/* @ts-ignore */}
                  <CheckCircle2 className="w-4 h-4 text-violet-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Animated Invoice Breakdown - inspired by ConfirmPayoutsSheet invoice details
function InvoiceIllustration() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showTotal, setShowTotal] = useState(false);

  const invoiceLines = [
    { label: "Commission", value: "$450.00", isPositive: true },
    { label: "Bonus", value: "$75.00", isPositive: true },
    { label: "Processing fee", value: "-$12.50", isNegative: true },
  ];
  const total = "$512.50";

  useEffect(() => {
    const lineTimers: NodeJS.Timeout[] = [];

    invoiceLines.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, 600 + idx * 400);
      lineTimers.push(timer);
    });

    const totalTimer = setTimeout(() => {
      setShowTotal(true);
    }, 600 + invoiceLines.length * 400 + 300);

    // Reset and repeat
    const resetTimer = setTimeout(() => {
      setVisibleLines(0);
      setShowTotal(false);
    }, 5000);

    return () => {
      lineTimers.forEach(clearTimeout);
      clearTimeout(totalTimer);
      clearTimeout(resetTimer);
    };
  }, [visibleLines === 0]);

  return (
    <div className="overflow-hidden relative h-[280px]">
      <div className="flex flex-col size-full justify-center items-center">
        <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/80 w-56 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-3 border-b border-neutral-800 bg-neutral-800/30">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-700/50">
              {/* @ts-ignore */}
              <Receipt className="w-4 h-4 text-neutral-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-200">Invoice #4821</span>
              <span className="text-[10px] text-neutral-500">Dec 13, 2025</span>
            </div>
          </div>

          {/* Line items */}
          <div className="p-3 space-y-2">
            {invoiceLines.map((line, idx) => (
              <div
                key={line.label}
                className={`flex justify-between items-center text-xs transition-all duration-500 ${idx < visibleLines
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-2"
                  }`}
              >
                <span className="text-neutral-400">{line.label}</span>
                <span
                  className={`font-medium tabular-nums ${line.isNegative ? "text-red-400/70" : "text-neutral-200"
                    }`}
                >
                  {line.value}
                </span>
              </div>
            ))}

            {/* Total */}
            <div
              className={`flex justify-between items-center pt-2 mt-2 border-t border-neutral-800 transition-all duration-500 ${showTotal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
            >
              <span className="text-sm font-medium text-neutral-300">Total</span>
              <span className="text-sm font-semibold text-green-400 tabular-nums">{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature column component
function FeatureColumn({
  illustration,
  title,
  description,
  ctaText,
  ctaHref,
  hasBorder = false,
}: {
  illustration: ReactNode;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  hasBorder?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-6 md:gap-8 p-5 ${hasBorder ? "border-t md:border-t-0 md:border-l border-neutral-800" : ""}`}>
      {illustration}
      <div className="flex flex-col grow relative gap-[4px] pt-0 pr-1 pb-3 pl-[10px]">
        <h3 className="font-semibold text-neutral-200">{title}</h3>
        <div className="text-neutral-400">
          <p>{description}</p>
        </div>
        <a
          href={ctaHref}
          className="border block font-medium whitespace-nowrap w-fit mt-[12px] bg-neutral-800 border-neutral-700 text-neutral-50 text-[14px] leading-[14px] pt-2 pr-3 pb-2 pl-3 rounded-lg hover:bg-neutral-700 transition-colors"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
}

const DEFAULT_FEATURES = [
  {
    title: "Creator communication",
    description: "Streamlined messaging with creators. Share briefs, feedback, and approvals all in one place.",
    ctaText: "Get started",
    ctaHref: "/register",
    illustration: <CreatorCommunicationIllustration />,
  },
  {
    title: "Creator-friendly payments",
    description: "Creators can track their earnings and get paid seamlessly for every piece of content delivered.",
    ctaText: "Get started",
    ctaHref: "/register",
    illustration: <PayoutStatsIllustration />,
  },
  {
    title: "Transparent invoicing",
    description: "Clear breakdowns for every payment. Track costs per content, per creator, per campaign.",
    ctaText: "Book a call",
    ctaHref: "/contact",
    illustration: <InvoiceIllustration />,
  },
];

export const DEFAULT_EFFORTLESS_PAYOUTS_PROPS = {
  title: "Content on autopilot",
  description:
    "Scale your UGC production with streamlined creator management, automated workflows, and effortless payments.",
};

export function EffortlessPayoutsSection({
  title = DEFAULT_EFFORTLESS_PAYOUTS_PROPS.title,
  description = DEFAULT_EFFORTLESS_PAYOUTS_PROPS.description,
}: EffortlessPayoutsSectionProps) {
  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] pt-24 pr-0 pb-0 pl-0 z-[0]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="ml-auto mr-auto text-center w-full max-w-[560px] pt-0 pr-4 pb-0 pl-4"
        >
          <h2 className="font-normal text-center text-neutral-50/70 text-3xl sm:text-4xl md:text-[48px] leading-[100%] tracking-[-0.03em]">
            {title}
          </h2>
          <p className="text-center mt-3 text-neutral-400 text-base sm:text-lg leading-7">{description}</p>
        </motion.div>

        {/* Features grid */}
        <div className="border-t grid grid-cols-1 md:grid-cols-3 mt-10 md:mt-12 border-neutral-800">
          <div className="contents">
            {DEFAULT_FEATURES.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <FeatureColumn
                  illustration={feature.illustration}
                  title={feature.title}
                  description={feature.description}
                  ctaText={feature.ctaText}
                  ctaHref={feature.ctaHref}
                  hasBorder={index > 0}
                />
              </motion.div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
