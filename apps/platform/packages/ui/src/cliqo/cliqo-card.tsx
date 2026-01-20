"use client";

import { cn } from "@leadswap/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

const cliqoCardVariants = cva(
  [
    "bg-neutral-900 border border-neutral-800",
    "transition-colors duration-200",
  ],
  {
    variants: {
      variant: {
        default: "",
        elevated: "bg-neutral-800 border-neutral-700",
        ghost: "bg-transparent border-transparent",
      },
      radius: {
        default: "rounded-2xl",
        lg: "rounded-3xl",
        xl: "rounded-[32px]",
      },
      hover: {
        none: "",
        subtle: "hover:border-neutral-700",
        lift: "hover:border-neutral-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      radius: "default",
      hover: "none",
      padding: "md",
    },
  }
);

export interface CliqoCardProps
  extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cliqoCardVariants> { }

const CliqoCard = forwardRef<HTMLDivElement, CliqoCardProps>(
  ({ className, variant, radius, hover, padding, ...props }, ref) => {
    return (
      <div
        className={cn(
          cliqoCardVariants({ variant, radius, hover, padding, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

CliqoCard.displayName = "CliqoCard";

// Card Header
const CliqoCardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
));
CliqoCardHeader.displayName = "CliqoCardHeader";

// Card Title
const CliqoCardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-medium text-neutral-50 tracking-tight",
      className
    )}
    {...props}
  />
));
CliqoCardTitle.displayName = "CliqoCardTitle";

// Card Description
const CliqoCardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-400", className)}
    {...props}
  />
));
CliqoCardDescription.displayName = "CliqoCardDescription";

// Card Content
const CliqoCardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-4", className)} {...props} />
));
CliqoCardContent.displayName = "CliqoCardContent";

// Card Footer
const CliqoCardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
CliqoCardFooter.displayName = "CliqoCardFooter";

export {
  CliqoCard,
  CliqoCardHeader,
  CliqoCardTitle,
  CliqoCardDescription,
  CliqoCardContent,
  CliqoCardFooter,
  cliqoCardVariants,
};
