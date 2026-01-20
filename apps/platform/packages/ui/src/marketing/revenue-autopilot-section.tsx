"use client";

import { ReactNode, useEffect, useState } from "react";
import { CursorRays, InvoiceDollar, UserPlus } from "../icons";
import { FunnelChart } from "../charts";

export interface RevenueFeatureCard {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  illustration: ReactNode;
}

export interface RevenueAutopilotSectionProps {
  title?: string;
  description?: string;
  features?: RevenueFeatureCard[];
}

// Asset URLs from mockup
const ASSETS = {
  avatarSprite:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F1fc1ccce812f240314551df42c8d6a4143b173a5.jpg?generation=1762752201013689&alt=media",
  rewardIcons: {
    signup:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F5202056023143aebeacb5501c3bd8c033ec2b608.svg?generation=1765503409636734&alt=media",
    click:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F1f079c5d706b71feeca72112545ab83b3baefec9.svg?generation=1765503409633686&alt=media",
    sale:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fad94db76a532f0db6077ab17699986b8dd06b7be.svg?generation=1765503409633672&alt=media",
  },
  linkPreview:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F76192112f12c1c50b3925aed49bf360dea7b8ebd.png&w=3840&q=75?generation=1765503409649723&alt=media",
  analyticsScreenshot:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd2eb3884a103cd56c03e592db92acdc1fbbef623.svg?generation=1765503409662539&alt=media",
};

// Mini Funnel Analytics - uses the real FunnelChart component
function FlexibleRewardsIllustration() {
  const funnelSteps = [
    { id: "views", label: "Views", value: 108855, colorClassName: "text-sky-500" },
    { id: "engagement", label: "Engagement", value: 2179, colorClassName: "text-violet-500" },
    { id: "conversions", label: "Conversions", value: 847, colorClassName: "text-emerald-400" },
  ];

  const formatNumber = (num: number) => num.toLocaleString("en-US");

  return (
    <div className="overflow-hidden relative h-[280px]">
      <div className="flex flex-col size-full p-2">
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm h-full flex flex-col">
          {/* Metric Tabs */}
          <div className="flex border-b border-neutral-200 shrink-0">
            {funnelSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex-1 px-3 py-2.5 ${index > 0 ? "border-l border-neutral-200" : ""}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                  <div className={`h-1.5 w-1.5 rounded-sm ${step.colorClassName.replace("text-", "bg-")} opacity-50`} />
                  <span>{step.label}</span>
                </div>
                <div className="text-sm font-medium text-neutral-900 mt-0.5">
                  {formatNumber(step.value)}
                </div>
              </div>
            ))}
          </div>
          {/* Funnel Chart */}
          <div className="flex-1 min-h-0">
            <FunnelChart
              steps={funnelSteps}
              defaultTooltipStepId="views"
              tooltips
              persistentPercentages
              chartPadding={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated chat message bubble - uses app styling
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
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className="w-8 h-8 bg-size-[1400%] rounded-full"
          style={{
            backgroundImage: `url("${ASSETS.avatarSprite}")`,
            backgroundPosition: `${avatarPosition} 0%`,
          }}
        />
      </div>

      {/* Message */}
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

// Typing indicator
function TypingIndicator({ isVisible, delay = 0 }: { isVisible: boolean; delay?: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    }
    setShow(false);
  }, [isVisible, delay]);

  if (!show) return null;

  return (
    <div className="flex items-end gap-2 origin-bottom-left transition-all duration-300">
      <div className="relative shrink-0">
        <div
          className="w-8 h-8 bg-size-[1400%] rounded-full"
          style={{
            backgroundImage: `url("${ASSETS.avatarSprite}")`,
            backgroundPosition: "1500% 0%",
          }}
        />
      </div>
      <div className="flex items-center gap-1 bg-neutral-100 rounded-xl rounded-bl-sm px-4 py-3">
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

// Dual-sided incentives illustration with conversation animation
function DualSidedIncentivesIllustration() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Auto-play conversation animation
    const timers = [
      setTimeout(() => setStep(1), 500),   // First message
      setTimeout(() => setStep(2), 2000),  // Second message
      setTimeout(() => setStep(3), 3500),  // Typing indicator
      setTimeout(() => setStep(4), 5000),  // Response
      setTimeout(() => setStep(0), 8000),  // Reset and loop
    ];

    return () => timers.forEach(clearTimeout);
  }, [step === 0]);

  return (
    <div className="overflow-hidden relative h-[280px]">
      <div className="size-full overflow-hidden">
        <div className="flex flex-col size-full justify-end ml-auto mr-auto relative gap-3 max-w-sm px-4 pb-4">
          {/* Message 1: Partner sends deal */}
          <AnimatedChatBubble
            content="Hey! I can get you 30% off for your first year 🎉"
            isMySide={true}
            avatarPosition="1300%"
            isVisible={step >= 1}
            delay={0}
          />

          {/* Message 2: Partner sends link */}
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

          {/* Typing indicator */}
          {step === 3 && <TypingIndicator isVisible={true} delay={0} />}

          {/* Message 3: Customer responds */}
          <AnimatedChatBubble
            content="Omg thank you so much!! 🙌"
            isMySide={false}
            avatarPosition="1500%"
            isVisible={step >= 4}
            delay={0}
          />
        </div>
      </div>
    </div>
  );
}

// Mini animated chart data
const CHART_DATA = [
  { clicks: 180, leads: 45, sales: 12 },
  { clicks: 230, leads: 58, sales: 18 },
  { clicks: 320, leads: 72, sales: 24 },
  { clicks: 305, leads: 68, sales: 22 },
  { clicks: 330, leads: 82, sales: 28 },
  { clicks: 290, leads: 65, sales: 20 },
  { clicks: 340, leads: 88, sales: 32 },
  { clicks: 310, leads: 75, sales: 26 },
  { clicks: 380, leads: 95, sales: 38 },
  { clicks: 360, leads: 90, sales: 35 },
  { clicks: 420, leads: 105, sales: 42 },
  { clicks: 450, leads: 115, sales: 48 },
];

// Real-time attribution illustration - animated mini chart
function RealtimeAttributionIllustration() {
  const [activeMetric, setActiveMetric] = useState<"clicks" | "leads" | "sales">("clicks");
  const maxValue = Math.max(...CHART_DATA.map((d) => d[activeMetric]));

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => {
        if (prev === "clicks") return "leads";
        if (prev === "leads") return "sales";
        return "clicks";
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const metricColors = {
    clicks: "bg-sky-500",
    leads: "bg-indigo-500",
    sales: "bg-emerald-400",
  };

  const metricLabels = {
    clicks: { value: "2,847", label: "Clicks" },
    leads: { value: "712", label: "Leads" },
    sales: { value: "284", label: "Sales" },
  };

  return (
    <div className="overflow-hidden relative h-[280px]">
      <div className="size-full p-4 flex flex-col">
        {/* Metric tabs */}
        <div className="flex gap-1 mb-4">
          {(["clicks", "leads", "sales"] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeMetric === metric
                ? "bg-neutral-700 text-neutral-100"
                : "text-neutral-400 hover:text-neutral-300"
                }`}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>

        {/* Stat display */}
        <div className="mb-4">
          <div className="text-2xl font-semibold text-neutral-100">
            {metricLabels[activeMetric].value}
          </div>
          <div className="text-xs text-neutral-400">{metricLabels[activeMetric].label} this month</div>
        </div>

        {/* Mini bar chart */}
        <div className="flex-1 flex items-end gap-1">
          {CHART_DATA.map((data, index) => (
            <div
              key={index}
              className={`flex-1 rounded-t transition-all duration-500 ${metricColors[activeMetric]}`}
              style={{
                height: `${(data[activeMetric] / maxValue) * 100}%`,
                opacity: 0.3 + (index / CHART_DATA.length) * 0.7,
              }}
            />
          ))}
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
        <h3 className="font-semibold text-neutral-200">
          {title}
        </h3>
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

export const DEFAULT_REVENUE_FEATURES: RevenueFeatureCard[] = [];

export const DEFAULT_REVENUE_AUTOPILOT_PROPS: Omit<RevenueAutopilotSectionProps, "features"> = {
  title: "Content on autopilot",
  description:
    "Scale your UGC production with streamlined creator management, automated workflows, and performance tracking.",
};

export function RevenueAutopilotSection({
  title = DEFAULT_REVENUE_AUTOPILOT_PROPS.title,
  description = DEFAULT_REVENUE_AUTOPILOT_PROPS.description,
  features = DEFAULT_REVENUE_FEATURES,
}: RevenueAutopilotSectionProps) {
  return (
    <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] pt-24 pr-0 pb-0 pl-0 z-[0]">
      {/* Header */}
      <div className="ml-auto mr-auto text-center w-full max-w-[560px] pt-0 pr-4 pb-0 pl-4">
        <h2 className="font-normal text-center text-neutral-50/70 text-3xl sm:text-4xl md:text-[48px] leading-[100%] tracking-[-0.03em]">
          {title}
        </h2>
        <p className="text-center mt-3 text-neutral-400 text-base sm:text-lg leading-7">
          {description}
        </p>
      </div>

      {/* Features grid */}
      <div className="border-t grid grid-cols-1 md:grid-cols-3 mt-10 md:mt-12 border-neutral-800">
        <div className="contents">
          {features.map((feature, index) => (
            <FeatureColumn
              key={index}
              illustration={feature.illustration}
              title={feature.title}
              description={feature.description}
              ctaText={feature.ctaText}
              ctaHref={feature.ctaHref}
              hasBorder={index > 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
