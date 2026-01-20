"use client";

import { ReactNode, useState, useEffect } from "react";
import { Check, Link2, TrendingUp, User, Mail, ArrowRight } from "lucide-react";

export interface SeamlessIntegrationSectionProps {
  title?: string;
  description?: string;
}

// AI Landing Page illustration - mini form with animated fields
function LandingPageIllustration() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 5);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden relative h-[280px]">
      <div className="flex flex-col size-full justify-center items-center">
        <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/80 w-56 overflow-hidden">
          {/* Header with gradient accent */}
          <div className="h-12 bg-gradient-to-r from-violet-600/30 to-purple-600/30 flex items-center justify-center">
            <span className="text-sm font-semibold text-neutral-100">Join our program</span>
          </div>

          {/* Form fields */}
          <div className="p-3 space-y-2.5">
            {/* Name field */}
            <div
              className={`flex items-center gap-2 rounded-lg border p-2 transition-all duration-500 ${
                step >= 1 ? "border-violet-500/50 bg-violet-500/5" : "border-neutral-700/50 bg-neutral-800/50"
              }`}
            >
              {/* @ts-ignore */}
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span
                className={`text-xs transition-all duration-500 ${
                  step >= 1 ? "text-neutral-200" : "text-neutral-600"
                }`}
              >
                {step >= 1 ? "John Smith" : "Your name"}
              </span>
            </div>

            {/* Email field */}
            <div
              className={`flex items-center gap-2 rounded-lg border p-2 transition-all duration-500 ${
                step >= 2 ? "border-violet-500/50 bg-violet-500/5" : "border-neutral-700/50 bg-neutral-800/50"
              }`}
            >
              {/* @ts-ignore */}
              <Mail className="w-3.5 h-3.5 text-neutral-500" />
              <span
                className={`text-xs transition-all duration-500 ${
                  step >= 2 ? "text-neutral-200" : "text-neutral-600"
                }`}
              >
                {step >= 2 ? "john@example.com" : "Email address"}
              </span>
            </div>

            {/* Submit button */}
            <button
              className={`w-full rounded-lg py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-500 ${
                step >= 3
                  ? "bg-violet-500 text-white"
                  : "bg-neutral-700/50 text-neutral-400"
              }`}
            >
              {step >= 4 ? (
                <>
                  {/* @ts-ignore */}
                  <Check className="w-3.5 h-3.5" />
                  Applied!
                </>
              ) : (
                <>
                  Apply now
                  {/* @ts-ignore */}
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Embedded Dashboard illustration - inspired by ProgramCard
function DashboardIllustration() {
  const [earnings, setEarnings] = useState(0);
  const [chartProgress, setChartProgress] = useState(0);

  useEffect(() => {
    // Animate earnings counter
    const targetEarnings = 2847;
    const duration = 2000;
    const steps = 40;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setEarnings(Math.floor(targetEarnings * easeOut));
      setChartProgress(progress);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Mini chart data
  const chartData = [30, 45, 25, 60, 40, 75, 55, 85, 65, 95, 80, 100];

  return (
    <div className="overflow-hidden relative h-[280px]">
      <div className="flex flex-col size-full justify-center items-center">
        <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/80 w-56 p-4 overflow-hidden">
          {/* Program header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-neutral-100">Acme Inc</span>
              <div className="flex items-center gap-1 text-neutral-500">
                {/* @ts-ignore */}
                <Link2 className="w-3 h-3" />
                <span className="text-xs">acme.link/john</span>
              </div>
            </div>
          </div>

          {/* Earnings section */}
          <div className="mt-4 rounded-lg border border-neutral-700/50 bg-neutral-800/30 p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500">Earnings</span>
                <div className="text-lg font-semibold text-neutral-100 tabular-nums">
                  ${earnings.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs">
                {/* @ts-ignore */}
                <TrendingUp className="w-3 h-3" />
                +24%
              </div>
            </div>

            {/* Mini area chart */}
            <div className="mt-2 h-8 flex items-end gap-[3px]">
              {chartData.map((val, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-violet-500/60 to-violet-400/30 rounded-t transition-all duration-300"
                  style={{
                    height: `${(val * chartProgress)}%`,
                    opacity: chartProgress > 0 ? 0.4 + (i / chartData.length) * 0.6 : 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quickstart illustration - animated onboarding steps
function QuickstartIllustration() {
  const [completedSteps, setCompletedSteps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Create program", stepNumber: 1 },
    { label: "Set up rewards", stepNumber: 2 },
    { label: "Add tracking", stepNumber: 3 },
    { label: "Go live", stepNumber: 4 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          setCompletedSteps(prev + 1);
          return prev + 1;
        }
        // Reset after last step
        setTimeout(() => {
          setCompletedSteps(0);
          setCurrentStep(0);
        }, 1500);
        return prev;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden relative h-[280px]">
      <div className="flex flex-col size-full justify-center items-center">
        <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/80 w-56 overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-neutral-800 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <div>
              <span className="text-sm font-medium text-neutral-200">Acme Setup</span>
              <div className="text-[10px] text-neutral-500">
                {completedSteps}/{steps.length} complete
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="p-3 space-y-2">
            {steps.map((step, idx) => {
              const isCompleted = idx < completedSteps;
              const isCurrent = idx === currentStep;

              return (
                <div
                  key={step.stepNumber}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all duration-500 ${
                    isCurrent ? "bg-violet-500/10" : ""
                  }`}
                >
                  {/* Step indicator */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-500 ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                          ? "bg-violet-500 text-white"
                          : "border border-neutral-600 text-neutral-500"
                    }`}
                  >
                    {isCompleted ? (
                      // @ts-ignore
                      <Check className="w-3 h-3" />
                    ) : (
                      step.stepNumber
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-xs font-medium transition-all duration-500 ${
                      isCompleted
                        ? "text-neutral-400"
                        : isCurrent
                          ? "text-violet-300"
                          : "text-neutral-500"
                    }`}
                  >
                    {step.label}
                  </span>

                  {/* Status badge */}
                  {isCompleted && (
                    <span className="ml-auto text-[10px] font-medium text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                      Done
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="px-3 pb-3">
            <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
                style={{ width: `${(completedSteps / steps.length) * 100}%` }}
              />
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
  description: ReactNode;
  ctaText: string;
  ctaHref: string;
  hasBorder?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-6 md:gap-8 p-5 ${hasBorder ? "border-t md:border-t-0 md:border-l border-neutral-800" : ""}`}>
      {illustration}
      <div className="flex flex-col grow relative gap-[4px] pt-0 pr-1 pb-3 pl-[10px]">
        <h3 className="font-semibold text-neutral-200">{title}</h3>
        <div className="text-neutral-400">{description}</div>
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
    title: "Creator onboarding portal",
    description: (
      <p>
        A dedicated portal for creators to apply, submit content, and track their deliverables and payments.
      </p>
    ),
    ctaText: "Get started",
    ctaHref: "/register",
    illustration: <LandingPageIllustration />,
  },
  {
    title: "Brand dashboard",
    description: (
      <p>
        Track all your campaigns, review content, and manage creator relationships from one central dashboard.
      </p>
    ),
    ctaText: "Get started",
    ctaHref: "/register",
    illustration: <DashboardIllustration />,
  },
  {
    title: "Launch campaigns in days",
    description: (
      <p>
        From briefing to delivery, our{" "}
        <a href="/creators" className="font-medium underline text-neutral-300 decoration-dotted hover:text-neutral-100">
          creator network
        </a>{" "}
        helps you launch UGC campaigns fast. Most brands see first content within <em className="italic">days</em>.
      </p>
    ),
    ctaText: "Book a call",
    ctaHref: "/contact",
    illustration: <QuickstartIllustration />,
  },
];

export const DEFAULT_SEAMLESS_INTEGRATION_PROPS = {
  title: "Simple workflow",
  description:
    "From brief to delivery, we handle the entire creator workflow so you can focus on growing your brand.",
};

export function SeamlessIntegrationSection({
  title = DEFAULT_SEAMLESS_INTEGRATION_PROPS.title,
  description = DEFAULT_SEAMLESS_INTEGRATION_PROPS.description,
}: SeamlessIntegrationSectionProps) {
  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] pt-24 pr-0 pb-0 pl-0 z-[0]">
        {/* Header */}
        <div className="ml-auto mr-auto text-center w-full max-w-[560px] pt-0 pr-4 pb-0 pl-4">
          <h2 className="font-normal text-center text-neutral-50/70 text-3xl sm:text-4xl md:text-[48px] leading-[100%] tracking-[-0.03em]">
            {title}
          </h2>
          <p className="text-center mt-3 text-neutral-400 text-base sm:text-lg leading-7">{description}</p>
        </div>

        {/* Features grid */}
        <div className="border-t grid grid-cols-1 md:grid-cols-3 mt-10 md:mt-12 border-neutral-800">
          <div className="contents">
            {DEFAULT_FEATURES.map((feature, index) => (
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
    </div>
  );
}
