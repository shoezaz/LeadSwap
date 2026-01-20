"use client";

import { ReactNode } from "react";

/**
 * PricingGrid - Cliqo Design System
 * Dark mode container for pricing cards
 */

export interface PricingGridProps {
  /** Pricing card children */
  children: ReactNode;
  /** CSS class for container */
  className?: string;
}

export function PricingGrid({ children, className }: PricingGridProps) {
  return (
    <div
      className={
        className || "overflow-clip relative pt-0 pr-4 pb-0 pl-4 bg-neutral-950"
      }
    >
      <div className="border-b border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] z-[0] rounded-2xl overflow-hidden">
        <div className="overflow-x-hidden overflow-y-auto">
          <div
            className="grid overflow-hidden"
            style={{ gridTemplateColumns: "repeat(4, minmax(0px, 1fr))" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * PricingHeroSection - Cliqo Design System
 * Dark mode hero section with 96px title
 */
export interface PricingHeroSectionProps {
  /** Main title */
  title?: string;
  /** Subtitle/description */
  subtitle?: string;
  /** Show product toggle */
  showProductToggle?: boolean;
  /** Product toggle component */
  productToggle?: ReactNode;
}

export function PricingHeroSection({
  title = "Pricing",
  subtitle = "Start for free, no credit card required. Upgrade when you need more.",
  showProductToggle = true,
  productToggle,
}: PricingHeroSectionProps) {
  return (
    <div className="overflow-clip relative pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-b ml-auto mr-auto relative border-neutral-800 max-w-[1080px] z-[0]">
        <div className="border-l border-r pointer-events-none absolute left-0 top-0 right-0 bottom-0 border-neutral-800" />
        <div className="relative pt-24 pr-8 pb-12 pl-8">
          <div className="border-l border-r absolute left-0 top-0 right-0 bottom-0 border-neutral-800" />
          <div className="ml-auto mr-auto relative text-center max-w-2xl">
            <h1 className="font-normal text-center text-neutral-50/70 text-[64px] md:text-[96px] leading-[100%] tracking-[-0.04em]">
              {title}
            </h1>
            <p className="text-center mt-[16px] text-neutral-400 text-[18px] leading-[28px]">
              {subtitle}
            </p>
          </div>
          {showProductToggle && productToggle && (
            <div className="mt-8 flex justify-center">
              {productToggle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
