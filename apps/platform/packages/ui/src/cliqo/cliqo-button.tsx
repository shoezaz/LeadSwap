"use client";

import { cn } from "@leadswap/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

const cliqoButtonVariants = cva(
  [
    "inline-flex items-center justify-center font-medium text-center whitespace-nowrap",
    "transition-colors duration-200",
    "rounded-[2097150rem]", // Full pill shape
    "focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-950",
    "disabled:opacity-50 disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-neutral-50 text-neutral-950",
          "hover:bg-neutral-200",
          "shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]",
        ],
        secondary: [
          "bg-neutral-800 text-neutral-400",
          "hover:bg-neutral-700 hover:text-neutral-300",
          "shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]",
        ],
        outline: [
          "bg-transparent border border-neutral-800 text-neutral-50",
          "hover:border-neutral-600 hover:bg-neutral-900",
        ],
        ghost: [
          "bg-transparent text-neutral-400",
          "hover:text-neutral-50 hover:bg-neutral-800",
        ],
        selected: [
          "bg-neutral-400 text-neutral-950",
          "hover:bg-neutral-300",
          "shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]",
        ],
      },
      size: {
        xs: "h-7 px-2.5 text-[11px] leading-[14px] gap-1.5",
        sm: "h-8 px-3 text-[12px] leading-[16px] gap-1.5",
        md: "h-9 px-4 text-[13px] leading-[18px] gap-2",
        lg: "h-10 px-5 text-[14px] leading-[20px] gap-2",
        xl: "h-12 px-6 text-[16px] leading-[24px] gap-2.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface CliqoButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cliqoButtonVariants> {
  asChild?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const CliqoButton = forwardRef<HTMLButtonElement, CliqoButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      iconRight,
      children,
      ...props
    },
    ref
  ) => {
    // When asChild is true, Slot expects exactly one child element
    // So we can't add icon wrappers - pass through directly
    if (asChild) {
      return (
        <Slot
          className={cn(cliqoButtonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(cliqoButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {icon && (
          <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>
        )}
        {children}
        {iconRight && (
          <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{iconRight}</span>
        )}
      </button>
    );
  }
);

CliqoButton.displayName = "CliqoButton";

export { CliqoButton, cliqoButtonVariants };
