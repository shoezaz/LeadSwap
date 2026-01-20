"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { APP_DOMAIN } from "@leadswap/utils";

export interface ReviewPlatform {
  name: string;
  href: string;
  iconSrc: string;
  rating: number; // 0-5, supports half stars
}

export interface PartnersDarkCtaProps {
  title?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  reviewPlatforms?: ReviewPlatform[];
}

// Asset URLs from mockup
const ASSETS = {
  partnersBadgeIcon:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb6f7c5dd2f6394053fb02e5c5b809681b19447f4.svg?generation=1765503409522812&alt=media",
  gridPattern:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F3b2fe25a1c96eeb896837813e7716259320b6b1d.svg?generation=1765503410255093&alt=media",
  curveLeft:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd39c637a6da8893295ae9bfbd0ce9e74809e1d3e.svg?generation=1762752200125743&alt=media",
  curveRight:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe6ef85842590a32ecf3e20a4ebd6932048b6c3f4.svg?generation=1762752200257455&alt=media",
  g2:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F882f2ac7b995f975de1b39161ea049becb2682e5.svg?generation=1762752203409384&alt=media",
  productHunt:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F97727cd672bf6404891128888a86c5fe1547fb25.svg?generation=1762752203422994&alt=media",
  trustpilot:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F2fe2357879a5a73c4974eaf2649b818bd7ce0514.svg?generation=1762752203437547&alt=media",
  starFull:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F3bb674a32a683225560c48a93b6a3a3f8c86999e.svg?generation=1762752203411948&alt=media",
  starHalf:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F6f72abbf014c3e6c8a635c3d3f2f8c59c2e418c8.svg?generation=1762752203460716&alt=media",
};

export const DEFAULT_REVIEW_PLATFORMS: ReviewPlatform[] = [];

export const DEFAULT_DARK_CTA_PROPS: Omit<PartnersDarkCtaProps, "reviewPlatforms"> = {
  title: "Ready to scale your content?",
  description:
    "Let's create authentic UGC that converts. Book a call to discuss your brand's content needs.",
  primaryCtaText: "Book a call",
  primaryCtaHref: "/contact",
  secondaryCtaText: "Get started",
  secondaryCtaHref: `${APP_DOMAIN}/register`,
};

function PartnersBadgeDark() {
  return (
    <div
      className="items-center flex font-medium ml-auto mr-auto overflow-hidden relative text-center w-fit backdrop-blur-xs bg-white/7 text-white text-[12px] gap-[8px] leading-[15px] pt-[6px] pr-3 pb-[6px] pl-3 rounded-[624.9375rem]"
      style={{ textDecoration: "rgb(255, 255, 255)" }}
    >
      <div className="items-center flex justify-center text-center w-4 h-4 bg-[rgb(167,_139,_250)] rounded-sm">
        <div
          className="fill-none overflow-hidden text-center align-middle w-[10px] h-[10px] text-[rgb(76,_29,_149)]"
          style={{ textDecoration: "rgb(76, 29, 149)" }}
        >
          <img src={ASSETS.partnersBadgeIcon} className="block size-full" alt="" />
        </div>
      </div>
      Cliqo UGC
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < Math.floor(rating)) {
      // Full star
      stars.push(
        <div key={i} className="overflow-hidden text-center align-middle w-4 h-4 fill-white/85 shrink-[0]">
          <img src={ASSETS.starFull} className="block size-full" alt="" />
        </div>
      );
    } else if (i < rating) {
      // Half star
      stars.push(
        <div key={i} className="overflow-hidden text-center align-middle w-4 h-4 fill-white/85 shrink-[0]">
          <img src={ASSETS.starHalf} className="block size-full" alt="" />
        </div>
      );
    } else {
      // Empty star - use full star with lower opacity
      stars.push(
        <div key={i} className="overflow-hidden text-center align-middle w-4 h-4 fill-white/85 shrink-[0] opacity-30">
          <img src={ASSETS.starFull} className="block size-full" alt="" />
        </div>
      );
    }
  }
  return (
    <div
      className="items-center flex text-center text-white/85"
      style={{ textDecoration: "rgba(255, 255, 255, 0.85)" }}
    >
      {stars}
    </div>
  );
}

function ReviewPlatformBadge({ platform }: { platform: ReviewPlatform }) {
  return (
    <a href={platform.href} className="items-center flex text-center gap-[10px]">
      <div className="items-center flex justify-center text-center w-6 h-6 bg-white/15 shrink-[0] rounded-[624.9375rem]">
        <div
          className="fill-none overflow-hidden text-center align-middle h-3 text-white"
          style={{ textDecoration: "rgb(255, 255, 255)" }}
        >
          <img src={platform.iconSrc} className="block size-full" alt="" />
        </div>
      </div>
      <StarRating rating={platform.rating} />
    </a>
  );
}

// Shimmer text animation for title
function ShimmerText({ children }: { children: string }) {
  return (
    <span className="relative inline-block">
      {/* Base text */}
      <span className="relative z-10">{children}</span>

      {/* Shimmer overlay */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%] pointer-events-none"
        style={{
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
        animate={{
          backgroundPosition: ["200% 0", "-200% 0"],
        }}
        transition={{
          duration: 3,
          ease: "linear",
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Pulse ring button
function PulseButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";

  return (
    <motion.a
      href={href}
      className={`relative block font-medium text-[14px] leading-[20px] py-2.5 px-6 rounded-[2097150rem] transition-colors ${isPrimary
          ? "bg-neutral-50 text-neutral-950 hover:bg-neutral-200"
          : "border border-neutral-700 bg-transparent text-neutral-50 hover:border-neutral-500 hover:bg-neutral-800"
        }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Pulse ring effect for primary button */}
      {isPrimary && (
        <>
          <motion.span
            className="absolute inset-0 rounded-[inherit] border-2 border-white/30"
            initial={{ scale: 1, opacity: 0 }}
            whileHover={{
              scale: [1, 1.15, 1.15],
              opacity: [0, 0.5, 0],
              transition: {
                duration: 1,
                repeat: Infinity,
                ease: "easeOut",
              },
            }}
          />
          <motion.span
            className="absolute inset-0 rounded-[inherit] border-2 border-white/20"
            initial={{ scale: 1, opacity: 0 }}
            whileHover={{
              scale: [1, 1.3, 1.3],
              opacity: [0, 0.3, 0],
              transition: {
                duration: 1,
                delay: 0.2,
                repeat: Infinity,
                ease: "easeOut",
              },
            }}
          />
        </>
      )}

      {/* Animated border for secondary button */}
      {!isPrimary && (
        <motion.span
          className="absolute inset-0 rounded-[inherit] border border-transparent"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent) border-box",
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
          whileHover={{
            opacity: [0, 1, 0],
            transition: {
              duration: 1.5,
              repeat: Infinity,
            },
          }}
        />
      )}

      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}

export function PartnersDarkCta({
  title = DEFAULT_DARK_CTA_PROPS.title,
  description = DEFAULT_DARK_CTA_PROPS.description,
  primaryCtaText = DEFAULT_DARK_CTA_PROPS.primaryCtaText,
  primaryCtaHref = DEFAULT_DARK_CTA_PROPS.primaryCtaHref,
  secondaryCtaText = DEFAULT_DARK_CTA_PROPS.secondaryCtaText,
  secondaryCtaHref = DEFAULT_DARK_CTA_PROPS.secondaryCtaHref,
  reviewPlatforms = DEFAULT_REVIEW_PLATFORMS,
}: PartnersDarkCtaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="bg-neutral-950 pt-0 pr-4 pb-0 pl-4">
      <div className="border-l border-r border-t ml-auto mr-auto border-neutral-800 max-w-[1080px]">
        {/* Content */}
        <motion.div
          className="items-center flex flex-col relative text-center pt-20 pr-4 pb-20 pl-4"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Title with shimmer */}
          <motion.h2
            className="font-normal text-center text-neutral-50/70 text-[40px] leading-[100%] tracking-[-0.03em] max-w-lg"
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <ShimmerText>{title || ""}</ShimmerText>
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-center mt-[16px] text-neutral-400 text-[16px] leading-[24px] max-w-[480px]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {description}
          </motion.p>

          {/* CTAs with pulse effect */}
          <motion.div
            className="items-center flex justify-center text-center mt-[32px] gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <PulseButton href={primaryCtaHref || ""} variant="primary">
              {primaryCtaText}
            </PulseButton>
            <PulseButton href={secondaryCtaHref || ""} variant="secondary">
              {secondaryCtaText}
            </PulseButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
