"use client";

import { cn } from "@leadswap/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

const cliqoBadgeVariants = cva(
  [
    "inline-flex items-center justify-center font-medium text-center whitespace-nowrap",
    "rounded-[2097150rem]", // Full pill shape
  ],
  {
    variants: {
      variant: {
        default: "bg-neutral-800 text-neutral-400",
        selected: "bg-neutral-400 text-neutral-950",
        primary: "bg-neutral-50 text-neutral-950",
        outline: "bg-transparent border border-neutral-800 text-neutral-400",
        violet: "bg-violet-500/20 text-violet-400 border border-violet-500/30",
        blue: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
        green: "bg-green-500/20 text-green-400 border border-green-500/30",
        amber: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
        red: "bg-red-500/20 text-red-400 border border-red-500/30",
      },
      size: {
        xs: "h-5 px-2 text-[10px] leading-[12px] gap-1",
        sm: "h-6 px-2.5 text-[11px] leading-[14px] gap-1",
        md: "h-7 px-3 text-[12px] leading-[16px] gap-1.5",
        lg: "h-8 px-3.5 text-[13px] leading-[18px] gap-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface CliqoBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof cliqoBadgeVariants> {
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const CliqoBadge = forwardRef<HTMLSpanElement, CliqoBadgeProps>(
  ({ className, variant, size, icon, iconRight, children, ...props }, ref) => {
    return (
      <span
        className={cn(cliqoBadgeVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon && (
          <span className="shrink-0 [&>svg]:w-3 [&>svg]:h-3">{icon}</span>
        )}
        {children}
        {iconRight && (
          <span className="shrink-0 [&>svg]:w-3 [&>svg]:h-3">{iconRight}</span>
        )}
      </span>
    );
  }
);

CliqoBadge.displayName = "CliqoBadge";

export { CliqoBadge, cliqoBadgeVariants };
