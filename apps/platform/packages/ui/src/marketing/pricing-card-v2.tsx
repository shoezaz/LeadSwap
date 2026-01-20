"use client";

import { useState } from "react";
import { AnimatedPrice } from "./animated-price";
import { BillingToggle } from "./billing-toggle";
import { PlanFeatureList, PlanFeatureItem } from "./plan-feature-item";

/**
 * PricingCardV2 - Cliqo Design System
 * Dark mode, minimal, pill buttons
 */

export interface PlanFeature {
  text: string;
  iconSrc?: string;
  hasTooltip?: boolean;
  fillNone?: boolean;
}

export interface PricingCardV2Props {
  /** Plan name (e.g., "Pro", "Business", "Advanced", "Enterprise") */
  name: string;
  /** Monthly price (null for custom pricing) */
  monthlyPrice: number | null;
  /** Yearly price (calculated as monthly * 10 for 2 months free) */
  yearlyPrice?: number | null;
  /** Plan description */
  description: string;
  /** List of features */
  features: PlanFeature[];
  /** Whether this is the popular plan (shows badge + gradient) */
  isPopular?: boolean;
  /** Whether this is the last column (no right border) */
  isLast?: boolean;
  /** Whether to show the billing toggle */
  showBillingToggle?: boolean;
  /** CTA button text (default: "Get started") */
  ctaText?: string;
  /** CTA button href */
  ctaHref?: string;
  /** Whether CTA is secondary style (for Enterprise) */
  ctaSecondary?: boolean;
  /** Custom price text (for Enterprise "Custom") */
  customPriceText?: string;
  /** Show "Tailored pricing terms" instead of toggle */
  showTailoredPricing?: boolean;
  /** Icon src for tailored pricing */
  tailoredPricingIcon?: string;
  /** Show "Includes Partners" footer */
  showPartnersFooter?: boolean;
  /** Partners footer icon */
  partnersFooterIcon?: string;
  /** Partners footer href */
  partnersFooterHref?: string;
}

export function PricingCardV2({
  name,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  isPopular = false,
  isLast = false,
  showBillingToggle = true,
  ctaText = "Get started",
  ctaHref = "#",
  ctaSecondary = false,
  customPriceText,
  showTailoredPricing = false,
  tailoredPricingIcon,
  showPartnersFooter = false,
  partnersFooterIcon,
  partnersFooterHref,
}: PricingCardV2Props) {
  const [isYearly, setIsYearly] = useState(true);

  // Calculate displayed price
  const displayPrice = isYearly
    ? yearlyPrice ?? (monthlyPrice ? Math.round(monthlyPrice * 10 / 12) : null)
    : monthlyPrice;

  return (
    <div
      className={`${!isLast ? "border-r " : ""}flex flex-col h-full relative top-0 bg-neutral-900 border-neutral-800 transition-colors hover:border-neutral-700`}
    >
      <div
        className="flex flex-col gap-[24px] pt-5 pr-5 pb-3 pl-5"
        style={
          isPopular
            ? {
                backgroundImage:
                  "linear-gradient(rgba(139, 92, 246, 0.15), transparent 40%)",
              }
            : undefined
        }
      >
        {/* Header */}
        <div>
          <div className="items-center flex gap-[8px]">
            <h3 className="font-medium text-neutral-50 text-[20px] leading-[20px] pt-1 pr-0 pb-1 pl-0">
              {name}
            </h3>
            {isPopular && (
              <div className="font-medium text-center uppercase whitespace-nowrap w-fit bg-violet-500/20 text-violet-400 border border-violet-500/30 text-[10px] leading-[10px] pt-[5px] pr-2 pb-[5px] pl-2 rounded-[2097150rem]">
                Popular
              </div>
            )}
          </div>

          {/* Price */}
          <div className="relative mt-[4px]">
            {customPriceText ? (
              <span className="block text-neutral-400">
                {customPriceText}
              </span>
            ) : (
              displayPrice !== null && (
                <AnimatedPrice amount={displayPrice} suffix=" per month" />
              )
            )}
          </div>

          {/* Toggle or Tailored Pricing */}
          {showBillingToggle && !showTailoredPricing && (
            <BillingToggle
              defaultYearly={isYearly}
              onChange={setIsYearly}
            />
          )}
          {showTailoredPricing && (
            <div className="mt-[16px]">
              <div className="items-center flex text-neutral-400 gap-[6px]">
                {tailoredPricingIcon && (
                  <div className="overflow-hidden align-middle w-4 h-4 shrink-[0]">
                    <img
                      src={tailoredPricingIcon}
                      className="block size-full"
                      alt=""
                    />
                  </div>
                )}
                <span className="block font-medium text-[14px] leading-[20px]">
                  Tailored pricing terms
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-neutral-400 text-[14px] leading-[20px] min-h-10">
          {description}
        </p>

        {/* CTA Button - Cliqo pill style */}
        <div className="flex gap-[12px]">
          <a
            href={ctaHref}
            className={`block font-medium text-center w-full text-[14px] leading-[20px] py-2.5 rounded-[2097150rem] transition-colors ${
              ctaSecondary
                ? "bg-transparent border border-neutral-800 text-neutral-50 hover:border-neutral-600 hover:bg-neutral-800"
                : "bg-neutral-50 text-neutral-950 hover:bg-neutral-200"
            }`}
          >
            {ctaText}
          </a>
        </div>

        {/* Features */}
        <PlanFeatureList>
          {features.map((feature, index) => (
            <PlanFeatureItem
              key={index}
              text={feature.text}
              iconSrc={feature.iconSrc}
              hasTooltip={feature.hasTooltip}
              fillNone={feature.fillNone}
            />
          ))}
        </PlanFeatureList>
      </div>

      {/* Partners Footer */}
      {showPartnersFooter && partnersFooterHref && (
        <div className="flex flex-col grow justify-end">
          <div className="relative bg-neutral-800/50 z-[0]">
            <div className="border-b border-l border-r -ml-px -mr-px pointer-events-none relative h-[10px] bg-neutral-900 rounded-bl-[0.625rem] rounded-br-[0.625rem] border-neutral-800 z-[10]" />
            <a
              href={partnersFooterHref}
              className="items-center flex justify-center relative gap-[8px] pt-[10px] pr-5 pb-[10px] pl-5 z-[10] hover:bg-neutral-800/50 transition-colors"
            >
              <div className="items-center flex justify-center w-[18px] h-[18px] bg-violet-500/20 shrink-[0] rounded-sm">
                {partnersFooterIcon && (
                  <div className="fill-none overflow-hidden align-middle w-3 h-3 text-violet-400">
                    <img
                      src={partnersFooterIcon}
                      className="block size-full"
                      alt=""
                    />
                  </div>
                )}
              </div>
              <div className="relative">
                <span className="block text-neutral-400 text-[14px] leading-[20px]">
                  Includes <strong className="font-semibold text-neutral-50">Partners</strong>
                </span>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
