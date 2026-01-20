"use client";

import { cn } from "@leadswap/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface IntegrationsGridSectionProps {
  className?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
}

// Platform logos with CDN URLs (guaranteed to work)
const PLATFORM_LOGOS = [
  { top: 239, left: 599, src: "https://cdn.simpleicons.org/youtube/FF0000", alt: "YouTube", direction: "up" },
  { top: 119, left: 659, src: "https://cdn.simpleicons.org/tiktok/000000", alt: "TikTok", direction: "right" },
  { top: 359, left: 719, src: "https://cdn.simpleicons.org/instagram/E4405F", alt: "Instagram", direction: "down" },
  { top: 59, left: 779, src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png", alt: "LinkedIn", direction: "up" },
  { top: 179, left: 779, src: "https://cdn.simpleicons.org/x/000000", alt: "X", direction: "left" },
  { top: 299, left: 839, src: "https://cdn.simpleicons.org/youtube/FF0000", alt: "YouTube", direction: "down" },
  { top: 239, left: 899, src: "https://cdn.simpleicons.org/tiktok/000000", alt: "TikTok", direction: "right" },
  { top: 119, left: 1019, src: "https://cdn.simpleicons.org/instagram/E4405F", alt: "Instagram", direction: "up" },
  { top: 359, left: 1079, src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png", alt: "LinkedIn", direction: "left" },
];

// Empty placeholder positions
const EMPTY_PLACEHOLDERS = [
  { top: 119, left: 539 },
  { top: 359, left: 599 },
  { top: 299, left: 659 },
  { top: 119, left: 899 },
  { top: 359, left: 959 },
  { top: 299, left: 1019 },
];

// Animated floating logo
function FloatingLogo({
  logo,
  index,
}: {
  logo: typeof PLATFORM_LOGOS[0];
  index: number;
}) {
  // Calculate initial position based on entrance direction
  const getInitialPosition = () => {
    switch (logo.direction) {
      case "up": return { y: -40, x: 0 };
      case "down": return { y: 40, x: 0 };
      case "left": return { y: 0, x: -40 };
      case "right": return { y: 0, x: 40 };
      default: return { y: -40, x: 0 };
    }
  };

  const initial = getInitialPosition();

  // Unique float animation for each logo
  const floatDelay = index * 0.3;
  const floatDuration = 3 + (index % 3);

  return (
    <motion.div
      className="absolute rounded-lg bg-white shadow-md overflow-hidden flex items-center justify-center p-2 group"
      style={{
        width: 61,
        height: 61,
        top: logo.top,
        left: logo.left,
      }}
      initial={{
        opacity: 0,
        ...initial,
        rotate: (Math.random() - 0.5) * 20,
        scale: 0.8
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        rotate: 0,
        scale: 1
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: 0.1 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 8px 30px -5px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Continuous floating animation */}
      <motion.div
        className="size-full flex items-center justify-center"
        animate={{
          y: [0, -4, 0, 4, 0],
        }}
        transition={{
          duration: floatDuration,
          delay: floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img
          src={logo.src}
          alt={logo.alt}
          className="size-full object-contain transition-transform duration-200 group-hover:scale-110"
        />
      </motion.div>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
        }}
        whileHover={{ opacity: 1 }}
      />

      <div className="absolute inset-0 rounded-[inherit] border border-black/10" />
    </motion.div>
  );
}

// Animated placeholder with pulse
function PulsingPlaceholder({
  placeholder,
  index,
}: {
  placeholder: typeof EMPTY_PLACEHOLDERS[0];
  index: number;
}) {
  return (
    <motion.div
      className="absolute rounded-lg bg-gradient-to-b from-neutral-100 to-white shadow-[0_2px_6px_0_#0003_inset]"
      style={{
        width: 61,
        height: 61,
        top: placeholder.top,
        left: placeholder.left,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 0.3, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: 0.5 + index * 0.1
      }}
      animate={{
        opacity: [0.2, 0.4, 0.2],
      }}
      // @ts-ignore - motion/react typing issue
      transition2={{
        duration: 2 + index * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="absolute inset-0 rounded-[inherit] border border-black/20 [mask-image:linear-gradient(#000a,black)]" />
    </motion.div>
  );
}

export function IntegrationsGridSection({
  className,
  title = "Publish to all platforms",
  description = "Your UGC content ready for TikTok, Instagram, YouTube, and more. We format and optimize for each platform.",
  ctaText = "Get started",
  ctaHref = "/register",
}: IntegrationsGridSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <div
      ref={sectionRef}
      className={cn(
        "grid-section relative overflow-clip border-y border-neutral-200 bg-neutral-50 px-4 [.grid-section_~_&]:border-t-0",
        className
      )}
    >
      <div className="relative z-0 mx-auto max-w-[1080px] border-x border-neutral-200 md:h-[440px]">
        {/* Background with grid and logos */}
        <div className="absolute inset-0 max-md:overflow-clip">
          <div className="absolute left-[-590px] h-[360px] w-[1600px] max-md:bottom-0 max-md:[mask-image:linear-gradient(black_80%,transparent)] md:-left-px md:top-1/2 md:h-[480px] md:-translate-y-1/2">
            {/* Grid pattern with fade-in */}
            <motion.svg
              className="pointer-events-none absolute inset-0 text-neutral-200 [mask-image:linear-gradient(transparent,black,transparent)] md:[mask-image:linear-gradient(90deg,transparent,black_70%,transparent)]"
              width="100%"
              height="100%"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1 }}
            >
              <defs>
                <pattern
                  id="integrations-grid"
                  x="-1"
                  y="-1"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </pattern>
              </defs>
              <rect fill="url(#integrations-grid)" width="100%" height="100%" />
            </motion.svg>

            {/* Platform logos with floating animation */}
            <div className="absolute inset-0">
              {PLATFORM_LOGOS.map((logo, idx) => (
                <FloatingLogo key={`logo-${idx}`} logo={logo} index={idx} />
              ))}

              {/* Pulsing empty placeholders */}
              {EMPTY_PLACEHOLDERS.map((placeholder, idx) => (
                <PulsingPlaceholder
                  key={`placeholder-${idx}`}
                  placeholder={placeholder}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          className="relative px-4 pb-8 pt-14 md:px-10 md:py-28"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2
            className="max-w-sm text-pretty font-display text-3xl font-medium text-neutral-900 sm:text-4xl md:text-[2.5rem]"
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="mt-3 max-w-sm text-pretty text-base text-neutral-500 sm:text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {description}
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.a
              className="mx-auto max-w-fit rounded-lg border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 shadow-sm transition-all hover:border-neutral-400 hover:text-neutral-800 hover:ring-4 hover:ring-neutral-200 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:hover:ring-0 relative overflow-hidden"
              href={ctaHref}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-neutral-200/50 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%", transition: { duration: 0.5 } }}
              />
              <span className="relative z-10">{ctaText}</span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Mobile spacer */}
        <div className="relative h-[360px] md:hidden" />
      </div>
    </div>
  );
}
