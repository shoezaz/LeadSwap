"use client";

import { cn } from "@leadswap/utils";
import { motion } from "motion/react";
import { useState } from "react";

interface DubHeroProps {
  className?: string;
  badge?: {
    text: string;
    linkText?: string;
    href: string;
  };
  title: string;
  description: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  showPhotoCollage?: boolean;
}

interface PhotoCardProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  rotation: string;
  x: string;
  y: string;
  delay: number;
  zIndex: number;
  size?: { width?: string; height?: string };
  isActive?: boolean;
  onSelect?: () => void;
}

function PhotoCard({
  src,
  alt,
  width,
  height,
  rotation,
  x,
  y,
  delay,
  zIndex,
  size,
  isActive = false,
  onSelect,
}: PhotoCardProps) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      initial={{
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        delay: delay / 1000,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        zIndex,
        pointerEvents: "none",
      }}
    >
      <div
        className="cursor-pointer select-none rounded-lg bg-white p-1 ring-2 ring-black/5 transition-shadow duration-200 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:ring-black/10"
        style={{
          aspectRatio: `${width} / ${height}`,
          pointerEvents: "auto",
          transform: `translateX(calc(${x} - 3%)) translateY(${y}) rotate(${rotation})`,
          ...(size?.width ? { width: size.width } : {}),
          ...(size?.height ? { height: size.height } : {}),
        }}
        onClick={onSelect}
        data-active={isActive ? "true" : undefined}
      >
        <img
          alt={alt}
          draggable={false}
          loading="lazy"
          width={width}
          height={height}
          decoding="async"
          className="size-full rounded object-cover"
          src={src}
        />
      </div>
    </motion.div>
  );
}

// Animated word component for staggered text reveal
function AnimatedWord({
  word,
  index,
  baseDelay
}: {
  word: string;
  index: number;
  baseDelay: number;
}) {
  return (
    <motion.span
      className="inline-block"
      initial={{
        opacity: 0,
        y: 20,
        filter: "blur(8px)"
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)"
      }}
      transition={{
        duration: 0.6,
        delay: baseDelay + index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {word}
    </motion.span>
  );
}

// Shine effect button component
function ShineButton({
  href,
  variant = "primary",
  children
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) {
  const isPrimary = variant === "primary";

  return (
    <motion.a
      className={cn(
        "relative mx-auto max-w-fit overflow-hidden rounded-lg border px-5 py-2 text-sm font-medium shadow-sm transition-all",
        isPrimary
          ? "border-white bg-white text-neutral-900 hover:bg-neutral-100"
          : "border-neutral-700 bg-transparent text-neutral-300 hover:border-neutral-500 hover:text-white"
      )}
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Shine overlay */}
      <motion.div
        className={cn(
          "pointer-events-none absolute inset-0",
          isPrimary
            ? "bg-gradient-to-r from-transparent via-white/40 to-transparent"
            : "bg-gradient-to-r from-transparent via-white/10 to-transparent"
        )}
        initial={{ x: "-100%" }}
        whileHover={{
          x: "100%",
          transition: { duration: 0.5, ease: "easeInOut" }
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}

const HERO_PHOTOS: Omit<PhotoCardProps, "delay" | "zIndex">[] = [
  {
    src: "/hero-images/hero-image-0.jpg",
    alt: "Creator filming content",
    width: 1180,
    height: 944,
    rotation: "2deg",
    x: "-120%",
    y: "-50%",
    size: { width: "300px" },
  },
  {
    src: "/hero-images/hero-image-1.jpg",
    alt: "Video production",
    width: 917,
    height: 1133,
    rotation: "-2deg",
    x: "-120%",
    y: "-52%",
    size: { height: "260px" },
  },
  {
    src: "/hero-images/hero-image-2.jpg",
    alt: "Team collaboration",
    width: 1271,
    height: 841,
    rotation: "1deg",
    x: "-110%",
    y: "-35%",
    size: { width: "300px" },
  },
  {
    src: "/hero-images/hero-image-3.jpg",
    alt: "Content creation",
    width: 1083,
    height: 610,
    rotation: "-3deg",
    x: "-90%",
    y: "20%",
    size: { width: "300px" },
  },
  {
    src: "/hero-images/hero-image-4.jpg",
    alt: "Social media content",
    width: 1027,
    height: 802,
    rotation: "-2deg",
    x: "5%",
    y: "-25%",
    size: { width: "300px" },
  },
  {
    src: "/hero-images/hero-image-5.jpg",
    alt: "Creative team meeting",
    width: 1238,
    height: 920,
    rotation: "2deg",
    x: "-45%",
    y: "-40%",
    size: { width: "300px" },
  },
  {
    src: "/hero-images/hero-image-6.jpg",
    alt: "Brand strategy session",
    width: 1202,
    height: 810,
    rotation: "0deg",
    x: "-30%",
    y: "-90%",
    size: { width: "300px" },
  },
  {
    src: "/hero-images/hero-image-7.jpg",
    alt: "Marketing team",
    width: 1257,
    height: 832,
    rotation: "1deg",
    x: "5%",
    y: "-75%",
    size: { width: "300px" },
  },
];

export function DubHero({
  className,
  badge = {
    text: "Now accepting new clients",
    linkText: "Get started",
    href: "/register",
  },
  title = "Scale your brand with creator content",
  description = "Cliqo connects startups and SaaS brands with top UGC creators. We handle everything from briefing to delivery.",
  primaryCta = {
    text: "Get started",
    href: "/register",
  },
  secondaryCta = {
    text: "View creators",
    href: "/creators",
  },
  showPhotoCollage = true,
}: DubHeroProps) {
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

  // Split title into words for animation
  const titleWords = title.split(" ");

  return (
    <div
      className={cn(
        "grid-section relative overflow-clip border-b-0 px-4 [.grid-section_~_&]:border-t-0",
        className
      )}
    >
      <div className="relative z-0 mx-auto max-w-[1080px] border-neutral-800 px-4 py-20 sm:px-12">
        {/* Side borders */}
        <div className="pointer-events-none absolute inset-0 border-x border-neutral-800 [mask-image:linear-gradient(transparent,black)]" />

        {/* Grid pattern - sides */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 opacity-100 [mask-composite:intersect] [mask-image:linear-gradient(transparent,black)]">
          <div className="absolute inset-x-[360px] inset-y-0">
            {/* Left grid */}
            <svg
              className="pointer-events-none absolute inset-[unset] bottom-0 right-full h-[600px] w-[360px] text-neutral-800/60 [mask-image:linear-gradient(90deg,transparent,black)]"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern
                  id="grid-left"
                  x="0"
                  y="0"
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
              <rect fill="url(#grid-left)" width="100%" height="100%" />
            </svg>
            {/* Right grid */}
            <svg
              className="pointer-events-none absolute inset-[unset] bottom-0 left-full h-[600px] w-[360px] text-neutral-800/60 [mask-image:linear-gradient(270deg,transparent,black)]"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern
                  id="grid-right"
                  x="-1"
                  y="0"
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
              <rect fill="url(#grid-right)" width="100%" height="100%" />
            </svg>
          </div>
        </div>

        {/* Grid pattern - center */}
        <div className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden opacity-100 [mask-composite:intersect] [mask-image:linear-gradient(transparent,black),radial-gradient(130%_50%_at_50%_100%,transparent,black)]">
          <svg
            className="pointer-events-none absolute inset-[unset] bottom-0 left-1/2 h-[600px] w-[1080px] -translate-x-1/2 text-neutral-800/60"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="grid-center"
                x="-1"
                y="0"
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
            <rect fill="url(#grid-center)" width="100%" height="100%" />
          </svg>
        </div>

        {/* Photo Collage with staggered fade-in */}
        {showPhotoCollage && (
          <div className="relative mx-auto mb-12 h-[358px] w-full max-w-screen-md max-md:scale-[0.6] max-sm:scale-[0.45]">
            {HERO_PHOTOS.map((photo, index) => (
              <PhotoCard
                key={index}
                {...photo}
                delay={index * 80}
                isActive={activePhoto === index}
                onSelect={() => setActivePhoto(index)}
                zIndex={
                  activePhoto === index
                    ? 2000
                    : index === HERO_PHOTOS.length - 1
                      ? 1000
                      : index + 1
                }
              />
            ))}
          </div>
        )}

        {/* Content with staggered word animation */}
        <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center">
          {/* Title with word-by-word blur reveal */}
          <h1 className="mt-5 text-center font-display text-4xl font-medium text-white sm:text-5xl sm:leading-[1.15] text-pretty">
            {titleWords.map((word, index) => (
              <span key={index}>
                <AnimatedWord word={word} index={index} baseDelay={0.3} />
                {index < titleWords.length - 1 && " "}
              </span>
            ))}
          </h1>

          {/* Description with smooth fade */}
          <motion.p
            className="mt-5 text-pretty text-base text-neutral-400 sm:text-xl"
            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.7,
              delay: 0.5 + titleWords.length * 0.05,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {description}
          </motion.p>
        </div>

        {/* CTAs with shine effect */}
        <motion.div
          className="relative mx-auto mt-10 flex max-w-fit space-x-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.7 + titleWords.length * 0.05,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          {primaryCta && (
            <ShineButton href={primaryCta.href} variant="primary">
              {primaryCta.text}
            </ShineButton>
          )}
          {secondaryCta && (
            <ShineButton href={secondaryCta.href} variant="secondary">
              {secondaryCta.text}
            </ShineButton>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-500"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </motion.svg>
        </motion.div>
      </div>
    </div>
  );
}

