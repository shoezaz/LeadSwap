"use client";

import { ReactNode } from "react";

export interface EnterpriseStat {
  label: string;
  value: string;
}

export interface EnterpriseSectionProps {
  title?: string;
  description?: string;
  stats?: EnterpriseStat[];
  /** Optional illustration or image to display on the right */
  illustration?: ReactNode;
  /** Background color variant */
  variant?: "default" | "dark";
}

export const DEFAULT_ENTERPRISE_STATS: EnterpriseStat[] = [
  { label: "Links Created", value: "7,839,856" },
  { label: "Clicks Tracked", value: "110,804,848" },
  { label: "Revenue Tracked", value: "$13,161,480.00" },
];

export function EnterpriseSection({
  title = "Built to scale",
  description = "Our powerful, battle-tested infrastructure handles hundreds of millions of links & events monthly and can scale infinitely with your business needs.",
  stats = DEFAULT_ENTERPRISE_STATS,
  illustration,
  variant = "dark",
}: EnterpriseSectionProps) {
  const bgClass = variant === "dark" ? "bg-neutral-900" : "bg-neutral-50";
  const borderClass = variant === "dark" ? "border-neutral-800" : "border-neutral-200";
  const titleClass = variant === "dark" ? "text-neutral-50" : "text-neutral-900";
  const descClass = variant === "dark" ? "text-neutral-400" : "text-neutral-500";
  const labelClass = variant === "dark" ? "text-neutral-500" : "text-neutral-500";
  const valueClass = variant === "dark" ? "text-violet-400" : "text-orange-500";

  return (
    <div className={`border-b overflow-clip relative ${bgClass} ${borderClass} pt-0 pr-4 pb-0 pl-4`}>
      <div className={`border-l ml-auto mr-auto relative ${borderClass} max-w-[1080px] pt-24 pr-0 pb-24 pl-0 z-[0]`}>
        <div className="flex ml-auto mr-auto relative w-full gap-20 max-w-5xl pt-0 pr-4 pb-0 pl-12">
          {/* Left side - Text and stats */}
          <div className="flex flex-col justify-between relative text-left gap-8 max-w-xs pt-12 pr-0 pb-12 pl-0 z-10">
            <div className="text-left">
              <h2 className={`font-medium text-left ${titleClass} text-4xl leading-10`}>
                {title}
              </h2>
              <p className={`text-left mt-2 ${descClass} text-lg leading-7`}>
                {description}
              </p>
            </div>
            <div className="flex flex-col text-left gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="items-start flex flex-col justify-center text-left">
                  <span className={`block text-left uppercase ${labelClass} text-sm leading-5`}>
                    {stat.label}
                  </span>
                  <p className={`font-medium text-left mt-2 ${valueClass} text-2xl leading-8 font-mono`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="grow h-full relative m-[-8%]">
            <div className="h-[720px]">
              <div className="items-center flex h-full relative">
                {illustration ? (
                  illustration
                ) : (
                  <div className="aspect-square m-auto relative w-full max-w-[1000px]">
                    {/* Default abstract visualization */}
                    <div className="size-full flex items-center justify-center">
                      <div className="relative w-80 h-80">
                        {/* Concentric circles */}
                        <div className="absolute inset-0 rounded-full border border-neutral-700 opacity-20" />
                        <div className="absolute inset-8 rounded-full border border-neutral-700 opacity-30" />
                        <div className="absolute inset-16 rounded-full border border-neutral-700 opacity-40" />
                        <div className="absolute inset-24 rounded-full border border-neutral-700 opacity-50" />
                        {/* Center glow */}
                        <div className="absolute inset-28 rounded-full bg-violet-500/20 blur-xl" />
                        <div className="absolute inset-32 rounded-full bg-violet-500/30" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// API Infrastructure section variant
export interface ApiInfrastructureSectionProps {
  badge?: {
    iconSrc?: string;
    name?: string;
  };
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  /** Content to display in the showcase area */
  showcaseContent?: ReactNode;
}

const DEFAULT_API_ICON =
  "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F0db59471435d6ec75e99d97fcfe14f39f9c904d5.svg?generation=1762752202794192&alt=media";

export function ApiInfrastructureSection({
  badge = { name: "API" },
  title = "Enterprise-grade link infrastructure",
  description = "Programmatically generate millions of short links, with deferred deep linking and real-time webhooks built in.",
  ctaText = "Explore API",
  ctaHref = "/docs",
  showcaseContent,
}: ApiInfrastructureSectionProps) {
  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] pt-20 pr-0 pb-10 pl-0 z-[0]">
        {/* Header */}
        <div className="flex flex-col pt-0 pr-10 pb-0 pl-10">
          <div className="items-center flex gap-2">
            <span className="items-center border flex justify-center w-4 h-4 bg-neutral-600 border-white/10 text-neutral-50 rounded-sm">
              {badge.iconSrc ? (
                <div className="fill-none overflow-hidden align-middle w-2.5 h-2.5">
                  <img src={badge.iconSrc} className="block size-full invert" alt="" />
                </div>
              ) : (
                <div className="fill-none overflow-hidden align-middle w-2.5 h-2.5">
                  <img src={DEFAULT_API_ICON} className="block size-full invert" alt="" />
                </div>
              )}
            </span>
            <span className="block font-medium text-neutral-400 text-xs leading-4">
              {badge.name}
            </span>
          </div>

          <h2 className="font-normal mt-3 text-neutral-50/70 text-5xl leading-none tracking-tight max-w-lg">
            {title}
          </h2>

          <p className="mt-3 text-neutral-400 text-lg leading-7 max-w-xl">
            {description}
          </p>

          <div className="mt-8">
            <a
              href={ctaHref}
              className="block font-medium max-w-fit bg-neutral-50 text-neutral-950 text-sm leading-5 py-2.5 px-6 rounded-[2097150rem] hover:bg-neutral-200 transition-colors"
            >
              {ctaText}
            </a>
          </div>
        </div>

        {/* Showcase area */}
        <div className="border-b border-t mt-20 bg-neutral-900 border-neutral-800">
          <div className="flex flex-col">
            <div className="items-center flex grow justify-center overflow-hidden h-[440px] pt-0 pr-8 pb-0 pl-8">
              <div className="size-full relative">
                {showcaseContent ? (
                  <div className="items-center flex justify-center absolute left-0 top-0 right-0 bottom-0">
                    {showcaseContent}
                  </div>
                ) : (
                  <div className="items-center flex justify-center absolute left-0 top-0 right-0 bottom-0">
                    <ApiFlowDiagram />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default API flow diagram component
function ApiFlowDiagram() {
  return (
    <div className="flex items-center gap-4">
      {/* API Box */}
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 blur-sm rounded-2xl opacity-50" />
        <div className="relative border bg-neutral-950 border-neutral-700 p-2 rounded-2xl">
          <div className="p-1 rounded-xl bg-gradient-to-b from-neutral-700 to-neutral-800">
            <div className="items-center flex justify-center p-6 rounded-lg bg-gradient-to-b from-neutral-700 to-neutral-900">
              <span className="text-white font-bold text-lg">API</span>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center text-blue-500 min-w-16">
        <div className="h-px w-full bg-blue-500" />
        <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-blue-500" />
      </div>

      {/* Event Box */}
      <div className="p-px shadow-sm rounded-2xl bg-gradient-to-b from-neutral-700 to-neutral-800">
        <div className="items-center flex bg-neutral-950 gap-2 min-w-56 p-3 rounded-[0.9375rem]">
          <div className="border bg-blue-500/20 border-blue-500/50 text-blue-400 p-1.5 rounded-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="block font-medium text-neutral-200 text-sm leading-5">
            Link clicked
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center text-blue-500 min-w-16">
        <div className="h-px w-full bg-blue-500" />
        <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-blue-500" />
      </div>

      {/* Webhook destination */}
      <div className="relative">
        <div className="border relative w-36 h-24 bg-neutral-950 border-neutral-700 rounded-2xl flex items-center justify-center">
          <span className="text-neutral-400 text-sm">Webhook</span>
        </div>
      </div>
    </div>
  );
}
