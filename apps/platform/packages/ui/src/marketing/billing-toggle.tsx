"use client";

import { useState } from "react";

/**
 * BillingToggle - Cliqo Design System
 * Dark mode toggle switch for yearly/monthly billing
 */

export interface BillingToggleProps {
  /** Whether yearly billing is selected (default: true) */
  defaultYearly?: boolean;
  /** Callback when billing period changes */
  onChange?: (isYearly: boolean) => void;
  /** Label text (default: "Billed yearly") */
  label?: string;
  /** Badge text (default: "2 months free") */
  badgeText?: string;
  /** CSS class for container */
  className?: string;
}

export function BillingToggle({
  defaultYearly = true,
  onChange,
  label = "Billed yearly",
  badgeText = "2 months free",
  className,
}: BillingToggleProps) {
  const [isYearly, setIsYearly] = useState(defaultYearly);

  const handleToggle = () => {
    const newValue = !isYearly;
    setIsYearly(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={className || "mt-[16px]"}>
      <label className="items-center flex gap-[6px] cursor-pointer">
        <button
          role="switch"
          aria-checked={isYearly}
          onClick={handleToggle}
          className={`flex relative text-center w-7 h-4 ${
            isYearly ? "bg-neutral-50" : "bg-neutral-700"
          } border-transparent border-[2px] shrink-[0] rounded-[2097150rem] transition-colors`}
          style={{ appearance: "button" as const }}
        >
          <span
            className={`block pointer-events-none text-center w-3 h-3 ${
              isYearly ? "bg-neutral-950" : "bg-neutral-400"
            } shadow-sm ${
              isYearly ? "translate-x-3" : "translate-x-0"
            } rounded-[2097150rem] transition-all`}
          />
        </button>
        <div className="items-center flex font-medium text-neutral-400 text-[14px] gap-[4px] leading-[20px]">
          <span className="block">{label}</span>
          {badgeText && (
            <span className="border block max-w-fit whitespace-nowrap border-neutral-700 text-neutral-400 text-[12px] leading-[16px] pb-px pt-px pr-2 pl-2 rounded-[2097150rem]">
              {badgeText}
            </span>
          )}
        </div>
      </label>
    </div>
  );
}
