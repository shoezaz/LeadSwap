"use client";

import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export interface AnnouncementBadgeProps {
  text: string;
  linkText: string;
  href: string;
}

export function AnnouncementBadge({
  text,
  linkText,
  href,
}: AnnouncementBadgeProps) {
  return (
    <a
      href={href}
      className="border flex font-medium text-center bg-neutral-900 border-neutral-800 text-[12px] leading-[16px] rounded-[2097150rem] hover:border-neutral-700 transition-colors"
    >
      <span className="block text-center text-neutral-50 pt-[6px] pr-[10px] pb-[6px] pl-4">
        {text}
      </span>
      <span className="items-center border-l flex text-center border-neutral-800 text-neutral-400 gap-[6px] pt-[6px] pr-3 pb-[6px] pl-[10px]">
        <span className="block text-center">{linkText}</span>
        {/* @ts-ignore */}
        <ArrowRight className="w-3 h-3" />
      </span>
    </a>
  );
}

export interface LandingHeroProps {
  /** Optional announcement badge */
  announcement?: {
    text: string;
    linkText: string;
    href: string;
  };
  /** Main title */
  title: string;
  /** Subtitle/description */
  subtitle: string;
  /** Primary CTA */
  primaryCta: {
    text: string;
    href: string;
  };
  /** Secondary CTA */
  secondaryCta?: {
    text: string;
    href: string;
  };
  /** Custom content below CTAs */
  children?: ReactNode;
}

export function LandingHero({
  announcement,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  children,
}: LandingHeroProps) {
  return (
    <div className="overflow-clip relative pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="ml-auto mr-auto relative max-w-[1080px] pt-24 pr-12 pb-24 pl-12 z-[0]">
        {/* Border decoration */}
        <div className="border-l border-r pointer-events-none absolute left-0 top-0 right-0 bottom-0 border-neutral-800"></div>

        {/* Content */}
        <div className="items-center flex flex-col ml-auto mr-auto relative text-center w-full max-w-2xl pt-0 pr-4 pb-0 pl-4">
          {announcement && (
            <AnnouncementBadge
              text={announcement.text}
              linkText={announcement.linkText}
              href={announcement.href}
            />
          )}

          <h1 className="font-normal text-center mt-[24px] text-neutral-50/70 text-[64px] md:text-[96px] leading-[100%] tracking-[-0.04em]">
            {title}
          </h1>

          <p className="text-center mt-[24px] text-neutral-400 text-[18px] leading-[28px]">
            {subtitle}
          </p>
        </div>

        {/* CTAs - Cliqo pill style */}
        <div className="flex justify-center ml-auto mr-auto max-w-fit relative mt-[40px] gap-4">
          <a
            href={primaryCta.href}
            className="block font-medium max-w-fit bg-neutral-50 text-neutral-950 text-[14px] leading-[20px] py-2.5 px-6 rounded-[2097150rem] hover:bg-neutral-200 transition-colors"
          >
            {primaryCta.text}
          </a>
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              className="block font-medium max-w-fit border border-neutral-800 bg-transparent text-neutral-50 text-[14px] leading-[20px] py-2.5 px-6 rounded-[2097150rem] hover:border-neutral-600 hover:bg-neutral-900 transition-colors"
            >
              {secondaryCta.text}
            </a>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
