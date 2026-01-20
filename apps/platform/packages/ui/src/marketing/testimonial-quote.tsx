"use client";

import { cn } from "@leadswap/utils";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

export interface TestimonialQuoteProps {
  quote: string;
  companyLogoUrl: string;
  companyLogoAlt: string;
  authorName: string;
  authorTitle: string;
  authorAvatarUrl: string;
  className?: string;
}

// Word-by-word animated text
function AnimatedQuote({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Split into words while preserving HTML entities
  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className="text-pretty text-center text-lg text-neutral-300 sm:text-left sm:text-xl md:text-2xl"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.4,
            delay: index * 0.03,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
          {index < words.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </p>
  );
}

export function TestimonialQuote({
  quote = "\"What you all have built is fantastic. Working with Cliqo has been hands down the best decision for our content strategy.\"",
  companyLogoUrl = "https://assets.dub.co/companies/hubermanlab.svg",
  companyLogoAlt = "Company logo",
  authorName = "Sarah Chen",
  authorTitle = "Marketing Director at TechStartup",
  authorAvatarUrl = "https://assets.dub.co/testimonials/people/ian-mackey.jpeg",
  className,
}: TestimonialQuoteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Calculate total quote animation duration for sequencing
  const wordCount = quote.split(" ").length;
  const quoteAnimationDuration = wordCount * 0.03 + 0.4;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative border-b border-neutral-800 px-12 py-14 overflow-hidden",
        className
      )}
    >
      {/* Dot pattern background with parallax */}
      <motion.div
        className="absolute inset-4"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <svg
          className="pointer-events-none absolute inset-0 text-neutral-800/60"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern
              id="dots-testimonial"
              x="-1"
              y="-1"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <rect x="1" y="1" width="2" height="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect fill="url(#dots-testimonial)" width="100%" height="100%" />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:items-start lg:gap-12 max-w-[1080px] mx-auto">
        {/* Quote with word animation */}
        <div>
          <AnimatedQuote text={quote} />
        </div>

        {/* Author info with sequential reveal */}
        <div className="flex min-w-36 shrink-0 flex-col items-center text-center sm:items-end sm:text-right">
          {/* Company logo - appears after quote */}
          <motion.div
            className="relative h-7 w-full py-2"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: quoteAnimationDuration,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <img
              alt={companyLogoAlt}
              draggable={false}
              loading="lazy"
              decoding="async"
              className="blur-0 object-contain object-center sm:object-right h-full w-full invert opacity-70"
              src={companyLogoUrl}
              style={{ position: "absolute", height: "100%", width: "100%", inset: 0 }}
            />
          </motion.div>

          {/* Author name - appears after logo */}
          <motion.span
            className="mt-4 text-sm font-semibold text-neutral-300"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.4,
              delay: quoteAnimationDuration + 0.2,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {authorName}
          </motion.span>

          {/* Author title - appears after name */}
          <motion.span
            className="text-xs font-medium text-neutral-500"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{
              duration: 0.4,
              delay: quoteAnimationDuration + 0.35,
            }}
          >
            {authorTitle}
          </motion.span>

          {/* Author avatar - pops in with bounce */}
          <motion.img
            alt={authorName}
            loading="lazy"
            width={64}
            height={64}
            decoding="async"
            className="blur-0 mt-4 size-8 rounded-full border border-neutral-700"
            src={authorAvatarUrl}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: quoteAnimationDuration + 0.5,
              ease: [0.34, 1.56, 0.64, 1], // ease-out-back for bounce
            }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.3)"
            }}
          />
        </div>
      </div>
    </div>
  );
}
