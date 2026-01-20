"use client";

import { useState } from "react";

/**
 * ProductToggle - Exact replica from pricing mockup
 * Source: /pricing/App.tsx lines 71-94
 *
 * Toggle between Dub Links and Dub Partners pricing tabs.
 */

export interface ProductOption {
  /** Option ID */
  id: string;
  /** Display label */
  label: string;
  /** Icon URL */
  iconSrc: string;
  /** Background color for icon container */
  iconBgColor: string;
  /** Icon text color */
  iconTextColor: string;
}

export interface ProductToggleProps {
  /** Available product options */
  options: ProductOption[];
  /** Currently selected option ID */
  defaultSelected?: string;
  /** Callback when selection changes */
  onChange?: (selectedId: string) => void;
  /** CSS class for container */
  className?: string;
}

// Default options matching the mockup
export const DEFAULT_PRODUCT_OPTIONS: ProductOption[] = [
  {
    id: "links",
    label: "Dub Links",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F59fcc340e00701033e01ce79aebc1d1adc43ea13.svg?generation=1765503447597149&alt=media",
    iconBgColor: "rgb(251, 146, 60)",
    iconTextColor: "rgb(124, 45, 18)",
  },
  {
    id: "partners",
    label: "Dub Partners",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F1b7ca9e32a993780cf4bcc369b7274b170285915.svg?generation=1765503447621979&alt=media",
    iconBgColor: "rgb(167, 139, 250)",
    iconTextColor: "rgb(76, 29, 149)",
  },
];

export function ProductToggle({
  options = DEFAULT_PRODUCT_OPTIONS,
  defaultSelected,
  onChange,
  className,
}: ProductToggleProps) {
  const [selected, setSelected] = useState(
    defaultSelected || options[0]?.id || ""
  );

  const handleSelect = (id: string) => {
    setSelected(id);
    onChange?.(id);
  };

  return (
    <div
      className={
        className || "items-center flex flex-col justify-center mt-[40px]"
      }
    >
      <div className="items-center border flex relative bg-neutral-900 border-neutral-800 gap-[4px] p-1 z-[0] rounded-[2097150rem]">
        {options.map((option) => {
          const isSelected = selected === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`items-center flex font-medium relative text-center capitalize text-[12px] gap-[8px] leading-[12px] pt-[6px] pr-7 pb-[6px] pl-7 rounded-[2097150rem] transition-colors ${
                isSelected ? "bg-neutral-800 text-neutral-50" : "bg-transparent text-neutral-400 hover:text-neutral-50"
              }`}
            >
              <div className="items-center flex text-center capitalize gap-[8px]">
                <div
                  className="items-center flex justify-center text-center capitalize w-[18px] h-[18px] shrink-[0] rounded-sm"
                  style={{ backgroundColor: option.iconBgColor }}
                >
                  <div
                    className="fill-none overflow-hidden text-center capitalize align-middle w-3 h-3"
                    style={{ color: option.iconTextColor }}
                  >
                    <img src={option.iconSrc} className="block size-full" alt="" />
                  </div>
                </div>
                <span className="block font-semibold text-center capitalize text-[14px] leading-[20px]">
                  {option.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
