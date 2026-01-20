"use client";

import { cn } from "@leadswap/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from "react";

const cliqoInputVariants = cva(
  [
    "flex w-full",
    "bg-neutral-800 text-neutral-50",
    "placeholder:text-neutral-400",
    "text-[12px] leading-[16px]",
    "shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]",
    "transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-950",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        pill: "rounded-[2097150rem]",
        rounded: "rounded-2xl",
      },
      inputSize: {
        sm: "h-8 px-3 py-1",
        md: "h-9 px-3 py-2",
        lg: "h-10 px-4 py-2.5",
      },
    },
    defaultVariants: {
      variant: "pill",
      inputSize: "md",
    },
  }
);

export interface CliqoInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof cliqoInputVariants> {
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const CliqoInput = forwardRef<HTMLInputElement, CliqoInputProps>(
  ({ className, variant, inputSize, icon, iconRight, ...props }, ref) => {
    if (icon || iconRight) {
      return (
        <div className="relative flex items-center w-full">
          {icon && (
            <span className="absolute left-3 text-neutral-400 [&>svg]:w-4 [&>svg]:h-4">
              {icon}
            </span>
          )}
          <input
            className={cn(
              cliqoInputVariants({ variant, inputSize }),
              icon && "pl-9",
              iconRight && "pr-9",
              className
            )}
            ref={ref}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 text-neutral-400 [&>svg]:w-4 [&>svg]:h-4">
              {iconRight}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        className={cn(cliqoInputVariants({ variant, inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

CliqoInput.displayName = "CliqoInput";

// Textarea variant
const cliqoTextareaVariants = cva(
  [
    "flex w-full",
    "bg-neutral-800 text-neutral-50",
    "placeholder:text-neutral-400",
    "text-[12px] leading-[16px]",
    "rounded-2xl",
    "shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]",
    "transition-colors duration-200",
    "resize-none overflow-auto whitespace-pre-wrap",
    "focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 focus:ring-offset-neutral-950",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ],
  {
    variants: {
      textareaSize: {
        sm: "min-h-16 px-3 py-2",
        md: "min-h-20 px-3 py-2",
        lg: "min-h-32 px-4 py-3",
      },
    },
    defaultVariants: {
      textareaSize: "md",
    },
  }
);

export interface CliqoTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof cliqoTextareaVariants> {}

const CliqoTextarea = forwardRef<HTMLTextAreaElement, CliqoTextareaProps>(
  ({ className, textareaSize, ...props }, ref) => {
    return (
      <textarea
        className={cn(cliqoTextareaVariants({ textareaSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

CliqoTextarea.displayName = "CliqoTextarea";

export { CliqoInput, CliqoTextarea, cliqoInputVariants, cliqoTextareaVariants };
