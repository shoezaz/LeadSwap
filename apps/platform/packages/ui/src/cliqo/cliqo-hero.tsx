"use client";

import { cn } from "@leadswap/utils";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { CliqoButton } from "./cliqo-button";

export interface CliqoHeroProps extends HTMLAttributes<HTMLElement> {
  /** Main headline - displayed at 96px */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Primary CTA button */
  primaryCta?: {
    label: string;
    href: string;
    icon?: ReactNode;
  };
  /** Secondary CTA button */
  secondaryCta?: {
    label: string;
    href: string;
    icon?: ReactNode;
  };
  /** Additional content below CTAs */
  footer?: ReactNode;
  /** Align content */
  align?: "left" | "center";
  /** Title opacity (like instinct.so uses /70) */
  titleOpacity?: number;
}

const CliqoHero = forwardRef<HTMLElement, CliqoHeroProps>(
  (
    {
      className,
      title,
      subtitle,
      primaryCta,
      secondaryCta,
      footer,
      align = "left",
      titleOpacity = 0.7,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative w-full min-h-screen",
          "flex flex-col justify-start",
          "pt-[136px] px-8 pb-8",
          "gap-12",
          align === "center" && "items-center text-center",
          className
        )}
        {...props}
      >
        {/* Headline */}
        <h1
          className={cn(
            "text-[96px] leading-[96px] tracking-[-4.8px]",
            "font-normal",
            "md:text-[96px]",
            "text-[48px] leading-[48px] tracking-[-2.4px]"
          )}
          style={{
            color: `rgba(250, 250, 250, ${titleOpacity})`,
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className={cn(
              "text-neutral-400 text-lg leading-relaxed",
              "max-w-lg",
              align === "center" && "mx-auto"
            )}
          >
            {subtitle}
          </p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div
            className={cn(
              "flex items-center gap-3 flex-wrap",
              align === "center" && "justify-center"
            )}
          >
            {primaryCta && (
              <CliqoButton
                variant="primary"
                size="md"
                asChild
              >
                <a href={primaryCta.href} className="inline-flex items-center gap-2">
                  {primaryCta.label}
                  {primaryCta.icon && (
                    <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{primaryCta.icon}</span>
                  )}
                </a>
              </CliqoButton>
            )}
            {secondaryCta && (
              <CliqoButton
                variant="secondary"
                size="md"
                asChild
              >
                <a href={secondaryCta.href} className="inline-flex items-center gap-2">
                  {secondaryCta.label}
                  {secondaryCta.icon && (
                    <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{secondaryCta.icon}</span>
                  )}
                </a>
              </CliqoButton>
            )}
          </div>
        )}

        {/* Custom children */}
        {children}

        {/* Footer content */}
        {footer && (
          <div className="mt-auto">
            {footer}
          </div>
        )}
      </section>
    );
  }
);

CliqoHero.displayName = "CliqoHero";

// Minimal hero variant (just title + form like instinct.so contact)
export interface CliqoHeroMinimalProps extends HTMLAttributes<HTMLElement> {
  title: string;
  titleOpacity?: number;
}

const CliqoHeroMinimal = forwardRef<HTMLElement, CliqoHeroMinimalProps>(
  ({ className, title, titleOpacity = 0.7, children, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          "relative w-full min-h-screen",
          "flex flex-col items-start justify-start",
          "pt-[136px] px-8 pb-8",
          "gap-12",
          "tracking-[-0.8px]",
          className
        )}
        {...props}
      >
        <h1
          className="text-[96px] leading-[96px] tracking-[-4.8px] font-normal"
          style={{
            color: `rgba(250, 250, 250, ${titleOpacity})`,
          }}
        >
          {title}
        </h1>
        {children}
      </main>
    );
  }
);

CliqoHeroMinimal.displayName = "CliqoHeroMinimal";

export { CliqoHero, CliqoHeroMinimal };
