"use client";

import { cn } from "@leadswap/utils";
import { forwardRef, type HTMLAttributes } from "react";

export interface CliqoDividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

const CliqoDivider = forwardRef<HTMLDivElement, CliqoDividerProps>(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={decorative ? undefined : orientation}
        className={cn(
          "bg-neutral-800 shrink-0",
          orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
          className
        )}
        {...props}
      />
    );
  }
);

CliqoDivider.displayName = "CliqoDivider";

// Decorative divider with optional text
export interface CliqoDividerWithTextProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
}

const CliqoDividerWithText = forwardRef<HTMLDivElement, CliqoDividerWithTextProps>(
  ({ className, text, ...props }, ref) => {
    if (!text) {
      return <CliqoDivider ref={ref} className={className} {...props} />;
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-4 w-full", className)}
        {...props}
      >
        <div className="h-px bg-neutral-800 flex-1" />
        <span className="text-neutral-400 text-[12px] leading-[16px] font-mono uppercase tracking-wider">
          {text}
        </span>
        <div className="h-px bg-neutral-800 flex-1" />
      </div>
    );
  }
);

CliqoDividerWithText.displayName = "CliqoDividerWithText";

export { CliqoDivider, CliqoDividerWithText };
