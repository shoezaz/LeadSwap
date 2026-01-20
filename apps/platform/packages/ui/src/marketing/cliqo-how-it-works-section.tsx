"use client";

import { cn } from "@leadswap/utils";

interface CliqoHowItWorksSectionProps {
  className?: string;
}

const STEPS = [
  {
    step: "01",
    title: "Brief us",
    description:
      "Tell us about your product, target audience, and content goals. We'll create a custom strategy.",
  },
  {
    step: "02",
    title: "We match creators",
    description:
      "We handpick creators from our network who align with your brand and audience.",
  },
  {
    step: "03",
    title: "Content production",
    description:
      "Creators produce authentic content following your brief. We manage revisions and quality control.",
  },
  {
    step: "04",
    title: "Delivery",
    description:
      "Receive ready-to-use content with full usage rights. Deploy across all your channels.",
  },
];

export function CliqoHowItWorksSection({
  className,
}: CliqoHowItWorksSectionProps) {
  return (
    <section className={cn("bg-neutral-900 px-6 py-24", className)}>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            From brief to delivery in as little as 48 hours
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="absolute left-1/2 top-8 hidden h-px w-full bg-gradient-to-r from-white/20 to-transparent lg:block" />
              )}

              <div className="relative">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-xl font-semibold text-white">
                  {step.step}
                </div>
                <h3 className="mb-2 text-lg font-medium text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
