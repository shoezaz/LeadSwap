"use client";

/**
 * AnimatedPrice - Cliqo Design System
 * Dark mode price display with animation support
 */

export interface AnimatedPriceProps {
  /** The price amount (e.g., 25, 75, 250) */
  amount: number;
  /** Currency symbol (default: $) */
  currency?: string;
  /** Suffix text (default: "per month") */
  suffix?: string;
  /** CSS class for container */
  className?: string;
}

export function AnimatedPrice({
  amount,
  currency = "$",
  suffix = " per month",
  className,
}: AnimatedPriceProps) {
  const amountStr = amount.toString();
  const digits = amountStr.split("");
  const ariaLabel = `${currency}${amount}`;

  return (
    <div className={className}>
      <div
        aria-label={ariaLabel}
        role="img"
        className="inline-block isolate whitespace-nowrap text-neutral-50 leading-[16px]"
      >
        {/* Left part - Currency */}
        <span
          data-part="left"
          className="box-content inline-block isolate relative origin-[100%_50%] pt-[2px] pr-0 pb-[2px] pl-0 z-[5]"
        >
          <span
            data-part="currency"
            className="inline-block isolate relative"
          >
            <span className="inline-block whitespace-pre">
              {currency}
            </span>
          </span>
          <span className="box-content inline-block w-0 h-4 origin-[0px_10px] content-['​'] pt-[2px] pr-0 pb-[2px] pl-0" />
        </span>

        {/* Number part */}
        <span
          data-part="number"
          className="inline-block relative ml-[-8px] mr-[-8px] origin-[0%_0%]"
        >
          <span className="box-content inline-block origin-[0%_0%] pt-[2px] pr-2 pb-[2px] pl-2">
            {/* Integer part - each digit separately */}
            <span
              data-part="integer"
              className="inline-block isolate relative origin-[100%_50%]"
            >
              {digits.map((digit, index) => (
                <span key={index} className="inline-block relative">
                  <span className="box-content inline-block pt-[2px] pr-0 pb-[2px] pl-0">
                    {digit}
                  </span>
                </span>
              ))}
              <span className="box-content inline-block w-0 h-4 origin-[0px_10px] content-['​'] pt-[2px] pr-0 pb-[2px] pl-0" />
            </span>

            {/* Fraction part (empty but present for structure) */}
            <span
              data-part="fraction"
              className="inline-block isolate relative origin-[0%_50%]"
            >
              <span className="box-content inline-block w-0 h-4 origin-[0px_10px] content-['​'] pt-[2px] pr-0 pb-[2px] pl-0" />
            </span>
          </span>
        </span>

        {/* Right part (empty but present for structure) */}
        <span
          data-part="right"
          className="box-content inline-block isolate relative origin-[0%_50%] pt-[2px] pr-0 pb-[2px] pl-0 z-[5]"
        >
          <span className="box-content inline-block w-0 h-4 origin-[0px_10px] content-['​'] pt-[2px] pr-0 pb-[2px] pl-0" />
        </span>
      </div>
      {suffix && (
        <span className="text-neutral-400 text-[14px] leading-[20px]">
          {suffix}
        </span>
      )}
    </div>
  );
}
