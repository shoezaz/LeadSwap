"use client";

import { cn } from "@leadswap/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

const cliqoSectionVariants = cva(
  ["w-full", "px-6 md:px-8"],
  {
    variants: {
      size: {
        sm: "py-12 md:py-16",
        md: "py-16 md:py-24",
        lg: "py-24 md:py-32",
        xl: "py-32 md:py-48",
      },
      maxWidth: {
        sm: "max-w-2xl",
        md: "max-w-4xl",
        lg: "max-w-6xl",
        xl: "max-w-7xl",
        full: "max-w-[1440px]",
        none: "",
      },
      align: {
        left: "text-left",
        center: "text-center mx-auto",
        right: "text-right",
      },
      bg: {
        transparent: "",
        primary: "bg-neutral-950",
        secondary: "bg-neutral-900",
        elevated: "bg-neutral-800",
      },
    },
    defaultVariants: {
      size: "md",
      maxWidth: "lg",
      align: "center",
      bg: "transparent",
    },
  }
);

export interface CliqoSectionProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof cliqoSectionVariants> {
  as?: "section" | "div" | "article";
}

const CliqoSection = forwardRef<HTMLElement, CliqoSectionProps>(
  (
    { className, size, maxWidth, align, bg, as: Component = "section", ...props },
    ref
  ) => {
    return (
      <Component
        ref={ref as any}
        className={cn(
          cliqoSectionVariants({ size, maxWidth, align, bg, className })
        )}
        {...props}
      />
    );
  }
);

CliqoSection.displayName = "CliqoSection";

// Section title component
export interface CliqoSectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "sm" | "md" | "lg" | "xl";
}

const cliqoSectionTitleSizes = {
  sm: "text-[24px] leading-[100%] tracking-[-0.01em]",
  md: "text-[36px] leading-[100%] tracking-[-0.02em]",
  lg: "text-[48px] leading-[100%] tracking-[-0.03em]",
  xl: "text-[64px] leading-[100%] tracking-[-0.04em]",
};

const CliqoSectionTitle = forwardRef<HTMLHeadingElement, CliqoSectionTitleProps>(
  ({ className, as: Component = "h2", size = "lg", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "font-normal text-neutral-50",
          cliqoSectionTitleSizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

CliqoSectionTitle.displayName = "CliqoSectionTitle";

// Section description component
export interface CliqoSectionDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "md" | "lg";
}

const cliqoSectionDescriptionSizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const CliqoSectionDescription = forwardRef<
  HTMLParagraphElement,
  CliqoSectionDescriptionProps
>(({ className, size = "md", ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "text-neutral-400 leading-relaxed max-w-2xl",
        cliqoSectionDescriptionSizes[size],
        className
      )}
      {...props}
    />
  );
});

CliqoSectionDescription.displayName = "CliqoSectionDescription";

export {
  CliqoSection,
  CliqoSectionTitle,
  CliqoSectionDescription,
  cliqoSectionVariants,
};
