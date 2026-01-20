"use client";

import { Play } from "lucide-react";
import { APP_DOMAIN } from "@leadswap/utils";
import { InfinitePhoneCarousel, DEFAULT_PHONE_COLUMNS } from "./infinite-phone-carousel";

export interface PartnersHeroProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  showBackgroundGrid?: boolean;
}

export const DEFAULT_PARTNERS_HERO_PROPS: PartnersHeroProps = {
  title: "Grow your revenue with partnerships",
  description:
    "The modern affiliate marketing platform for partnering with affiliates, influencers, and your users.",
  ctaText: "Get started",
  ctaHref: `${APP_DOMAIN}/register`,
  secondaryCtaText: "Watch demo",
  secondaryCtaHref: "/contact",
  showBackgroundGrid: true,
};

function PartnersBadge() {
  return (
    <div className="items-center border flex font-medium ml-auto mr-auto overflow-hidden relative text-center w-fit bg-violet-500/10 border-violet-500/30 text-violet-400 text-[12px] gap-[8px] leading-[15px] pt-[6px] pr-3 pb-[6px] pl-3 rounded-[2097150rem]">
      <div className="items-center flex justify-center text-center w-4 h-4 bg-violet-500/30 rounded-sm">
        <span className="text-[10px]">✦</span>
      </div>
      Partners
    </div>
  );
}

export function PartnersHero({
  title = DEFAULT_PARTNERS_HERO_PROPS.title,
  description = DEFAULT_PARTNERS_HERO_PROPS.description,
  ctaText = DEFAULT_PARTNERS_HERO_PROPS.ctaText,
  ctaHref = DEFAULT_PARTNERS_HERO_PROPS.ctaHref,
  secondaryCtaText = DEFAULT_PARTNERS_HERO_PROPS.secondaryCtaText,
  secondaryCtaHref = DEFAULT_PARTNERS_HERO_PROPS.secondaryCtaHref,
  showBackgroundGrid = DEFAULT_PARTNERS_HERO_PROPS.showBackgroundGrid,
}: PartnersHeroProps) {
  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="ml-auto mr-auto relative text-center max-w-[1080px] pt-24 pr-0 pb-40 pl-0 z-[0]">
        {/* Decorative borders */}
        <div className="border-l border-r pointer-events-none absolute text-center left-0 top-0 right-0 bottom-0 border-neutral-800"></div>

        {/* Gradient overlay - violet tint with progressive fade from bottom */}
        <div className="overflow-hidden pointer-events-none absolute text-center left-0 top-0 right-0 bottom-0">
          <div
            className="h-full pointer-events-none absolute text-center w-[150%] left-[-25%]"
            style={{
              background: "linear-gradient(90deg, rgb(139, 92, 246), rgb(168, 85, 247), rgb(192, 132, 252))",
              opacity: 0.1,
              maskImage: "linear-gradient(to bottom, transparent 0%, transparent 50%, black 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 50%, black 100%)",
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative text-center z-10">
          <div className="items-center flex flex-col ml-auto mr-auto relative text-center w-full max-w-2xl">
            <PartnersBadge />

            <h1 className="font-normal text-center mt-[24px] text-neutral-50/70 text-[64px] md:text-[96px] leading-[100%] tracking-[-0.04em]">
              {title}
            </h1>

            <p className="text-center mt-[24px] text-neutral-400 text-[18px] leading-[28px]">
              {description}
            </p>
          </div>

          {/* CTAs - Cliqo pill style */}
          <div className="flex justify-center relative text-center mt-[40px] gap-4">
            <a
              href={ctaHref}
              className="block font-medium max-w-fit text-center bg-neutral-50 text-neutral-950 text-[14px] leading-[20px] py-2.5 px-6 rounded-[2097150rem] hover:bg-neutral-200 transition-colors"
            >
              {ctaText}
            </a>
            <a
              href={secondaryCtaHref}
              className="items-center border flex justify-center text-center whitespace-nowrap w-fit border-neutral-800 bg-transparent text-neutral-50 text-[14px] gap-[8px] leading-[20px] py-2.5 px-5 rounded-[2097150rem] hover:border-neutral-600 hover:bg-neutral-900 transition-colors"
            >
              {/* @ts-ignore */}
              <Play className="w-4 h-4" />
              <span>{secondaryCtaText}</span>
            </a>
          </div>
        </div>

        {/* Background Infinite Scroll Carousel */}
        {showBackgroundGrid && (
          <div
            className="absolute bottom-0 left-[50%] translate-x-[-50%] w-full max-w-[900px] pointer-events-none opacity-40"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
            }}
          >
            <InfinitePhoneCarousel
              columns={[
                ...DEFAULT_PHONE_COLUMNS,
                {
                  images: DEFAULT_PHONE_COLUMNS[0].images,
                  direction: "down",
                  speed: 22,
                },
                {
                  images: DEFAULT_PHONE_COLUMNS[1].images,
                  direction: "up",
                  speed: 28,
                },
              ]}
              phoneWidth={100}
              phoneHeight={178}
              gap={8}
              overlayGradient={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
