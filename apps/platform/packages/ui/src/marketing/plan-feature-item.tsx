"use client";

import { Check } from "lucide-react";

/**
 * PlanFeatureItem - Cliqo Design System
 * Dark mode feature list item with check icon
 */

export interface PlanFeatureItemProps {
  /** Feature text */
  text: string;
  /** Icon URL (optional - uses check icon if not provided) */
  iconSrc?: string;
  /** Whether to show dotted underline (for tooltip features) */
  hasTooltip?: boolean;
  /** Whether icon container uses fill-none class */
  fillNone?: boolean;
  /** Link URL (optional - makes the item clickable) */
  href?: string;
}

export function PlanFeatureItem({
  text,
  iconSrc,
  hasTooltip = false,
  fillNone = false,
  href,
}: PlanFeatureItemProps) {
  const content = (
    <>
      <div
        className={`${fillNone ? "fill-none " : ""}overflow-hidden text-left align-middle w-4 h-4 shrink-[0] text-green-400`}
      >
        {iconSrc ? (
          <img src={iconSrc} className="block size-full" alt="" />
        ) : (
          // @ts-ignore
          <Check className="w-4 h-4" />
        )}
      </div>
      <p
        className={`text-left${hasTooltip ? " underline decoration-dotted underline-offset-2" : ""}`}
      >
        {text}
      </p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="items-center flex text-neutral-400 gap-[8px] hover:text-neutral-50 transition-colors underline decoration-dotted underline-offset-2"
      >
        {content}
      </a>
    );
  }

  return (
    <li className="items-center flex text-left text-neutral-400 gap-[8px]">
      {content}
    </li>
  );
}

/**
 * PlanFeatureList - Cliqo Design System
 * Dark mode container for PlanFeatureItems
 */
export interface PlanFeatureListProps {
  children: React.ReactNode;
  className?: string;
}

export function PlanFeatureList({
  children,
  className,
}: PlanFeatureListProps) {
  return (
    <div
      className={
        className || "flex flex-col text-[14px] gap-[12px] leading-[20px]"
      }
    >
      <div className="flex flex-col relative">
        <ul className="flex flex-col gap-[10px] pt-0 pr-0 pb-3 pl-0">
          {children}
        </ul>
      </div>
    </div>
  );
}
