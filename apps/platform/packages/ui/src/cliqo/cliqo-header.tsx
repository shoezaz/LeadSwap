"use client";

import { cn } from "@leadswap/utils";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "motion/react";
import { forwardRef, useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import { CliqoButton } from "./cliqo-button";

export interface CliqoNavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface CliqoHeaderProps extends HTMLAttributes<HTMLElement> {
  logo?: ReactNode;
  logoHref?: string;
  links?: CliqoNavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  ctaIcon?: ReactNode;
}

const CliqoHeader = forwardRef<HTMLElement, CliqoHeaderProps>(
  (
    {
      className,
      logo,
      logoHref = "/",
      links = [],
      ctaLabel,
      ctaHref,
      ctaIcon,
      children,
      ...props
    },
    ref
  ) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    // Scroll tracking for dynamic blur
    const { scrollY } = useScroll();
    const blurValue = useTransform(scrollY, [0, 100], [0, 12]);
    const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.9]);
    const springBlur = useSpring(blurValue, { stiffness: 100, damping: 30 });
    const springOpacity = useSpring(bgOpacity, { stiffness: 100, damping: 30 });

    // Track scroll state
    useMotionValueEvent(scrollY, "change", (latest) => {
      setHasScrolled(latest > 50);
    });

    useEffect(() => {
      if (isMobileMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }, [isMobileMenuOpen]);

    return (
      <motion.header
        ref={ref as any}
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "w-full max-w-[1440px] mx-auto",
          "px-6 pt-4 pb-2",
          className
        )}
        style={{
          backdropFilter: hasScrolled ? `blur(12px)` : undefined,
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Dynamic background with scroll-linked opacity */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            background: `linear-gradient(to bottom, rgba(10, 10, 10, ${springOpacity}) 0px, transparent 100%)`,
          }}
        />

        <div className="flex items-center justify-between">
          {/* Left: Logo + Desktop Nav Links */}
          <div className="flex items-center gap-6">
            {/* Logo with subtle hover */}
            {logo && (
              <motion.a
                href={logoHref}
                className="block text-2xl shrink-0 z-50 relative"
                onClick={() => setIsMobileMenuOpen(false)}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {logo}
              </motion.a>
            )}

            {/* Desktop Nav Links with underline animation */}
            {links.length > 0 && (
              <nav className="hidden md:flex items-center gap-4 text-[12px] leading-[16px]">
                {links.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block transition-colors relative",
                      link.active
                        ? "text-neutral-50"
                        : "text-neutral-400 hover:text-neutral-50"
                    )}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover="hover"
                  >
                    {link.label}
                    {/* Underline animation on hover */}
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-px bg-neutral-50"
                      initial={{ scaleX: 0 }}
                      variants={{
                        hover: { scaleX: 1 }
                      }}
                      transition={{ duration: 0.2 }}
                      style={{ originX: 0 }}
                    />
                  </motion.a>
                ))}
              </nav>
            )}
          </div>

          {/* Right: CTA Button (Desktop) with shine effect */}
          <div className="hidden md:flex items-center gap-2">
            {ctaLabel && ctaHref && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <CliqoButton variant="secondary" size="sm" asChild>
                  <motion.a
                    href={ctaHref}
                    className="inline-flex items-center gap-2 relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Shine sweep */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%", transition: { duration: 0.5 } }}
                    />
                    <span className="relative z-10">{ctaLabel}</span>
                    {ctaIcon && (
                      <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4 relative z-10">
                        {ctaIcon}
                      </span>
                    )}
                  </motion.a>
                </CliqoButton>
              </motion.div>
            )}
            {children}
          </div>

          {/* Mobile Toggle with rotation animation */}
          <motion.button
            className="md:hidden text-neutral-50 z-50 relative p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu Overlay with spring physics */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-neutral-950/95 backdrop-blur-md pt-24 px-6 flex flex-col md:hidden"
            >
              <nav className="flex flex-col gap-6 text-xl font-medium text-neutral-300">
                {links.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -30, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      delay: 0.05 + i * 0.08,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block transition-colors hover:text-white",
                      link.active && "text-white"
                    )}
                    whileHover={{ x: 10 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* Mobile CTA */}
              {(ctaLabel || children) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    delay: 0.1 + links.length * 0.08,
                    type: "spring",
                    stiffness: 150,
                    damping: 20
                  }}
                  className="mt-8 flex flex-col gap-4"
                >
                  {ctaLabel && ctaHref && (
                    <CliqoButton
                      variant="secondary"
                      size="lg"
                      asChild
                      className="w-full justify-center"
                    >
                      <motion.a
                        href={ctaHref}
                        onClick={() => setIsMobileMenuOpen(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {ctaLabel}
                        {ctaIcon && (
                          <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4 ml-2">
                            {ctaIcon}
                          </span>
                        )}
                      </motion.a>
                    </CliqoButton>
                  )}
                  {children}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    );
  }
);

CliqoHeader.displayName = "CliqoHeader";

// SVG logo component with the actual Cliqo logo
export interface CliqoLogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const CliqoLogo = forwardRef<HTMLDivElement, CliqoLogoProps>(
  ({ className, size = 32, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center", className)}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1536 1560"
          width={size}
          height={size}
          className="text-white"
        >
          <rect fill="currentColor" x="288.14" y="255.93" width="988.31" height="1026.41" />
          <g>
            <path fill="#0a0a0a" d="M1291.44,1302.65c-77.76,78.18-161.92,88.76-268.07,92.32-165.57,5.56-342.22,5.04-507.88,0-101.69-3.09-187.6-11.72-265.34-83.82-74.16-68.77-96.02-158.51-99.67-256.98V508.56c3.76-116.03,31.53-214.3,128.44-285.15,71.61-52.36,144.9-57.48,230.58-60.13,168.89-5.23,338.83.72,508-1.62,129.87-2.06,251.49,35.33,319.58,152.46,42.88,73.76,43.31,140.35,45.19,223.05,3.74,164.23,4.94,334.89.08,498.97-3.17,106.78-12.69,187.87-90.9,266.5ZM763.11,330.01c-416.6,5.34-616.12,521.24-305.41,802.05,278.45,251.65,722.77,81.86,767.08-287.93,32.64-272.37-187.78-517.63-461.68-514.12Z" />
            <path fill="currentColor" d="M764.02,330.01c273.9-3.51,494.31,241.75,461.68,514.12-44.31,369.79-488.64,539.59-767.08,287.93-310.71-280.82-111.2-796.71,305.41-802.05ZM759.53,406.42c-261.52,7.29-445.01,269.75-351.5,518.46,94.87,252.31,415.82,334.19,617.07,150.23,257.65-235.51,96.03-653.53-245.05-669.11l-20.52.43Z" />
            <path fill="#0a0a0a" d="M759.92,406.42l20.52-.43c341.07,15.58,502.69,433.6,245.05,669.11-201.25,183.96-522.19,102.09-617.07-150.23-93.52-248.71,89.98-511.16,351.5-518.46ZM866.63,666.72c11.04-41.17,18.48-80.79-6.27-118.86-51.5-79.22-173.19-59.16-197.96,30.78-9.11,33.08-.06,56.47,7.91,88.08-18.28-3.55-30.41-18.34-48.27-24.39-129.59-43.9-203.58,143.2-84.16,202.54,23.89,11.87,45.22,10.31,70.99,12.18.47,2.79-1.95,4.33-3.7,6.02-20.7,20.05-40.89,31.09-52.46,59.93-39.62,98.75,75.13,192.27,163.35,133.38,29.34-19.58,38.12-45.99,52.41-76.43,15.28,39.12,34.46,75.38,77.24,89.07,89.46,28.65,174.89-61.76,137.03-149.03-11.41-26.3-31.83-40.24-52.15-58.74-1.46-1.33-3.22-1.33-2.52-4.21,20.15-2.55,35.97.31,55.81-6.38,131.18-44.26,75.2-246.18-61.83-210.19-22.26,5.85-34.34,20.53-55.42,26.24Z" />
            <path fill="currentColor" d="M866.67,666.72c21.08-5.71,33.16-20.39,55.42-26.24,137.03-36,193.01,165.92,61.83,210.19-19.83,6.69-35.65,3.83-55.81,6.38-.71,2.88,1.06,2.88,2.52,4.21,20.32,18.5,40.74,32.44,52.15,58.74,37.85,87.26-47.57,177.68-137.03,149.03-42.77-13.7-61.95-49.95-77.24-89.07-14.29,30.44-23.07,56.85-52.41,76.43-88.22,58.89-202.98-34.64-163.35-133.38,11.57-28.84,31.76-39.88,52.46-59.93,1.75-1.7,4.17-3.23,3.7-6.02-25.76-1.87-47.1-.31-70.99-12.18-119.43-59.34-45.43-246.44,84.16-202.54,17.86,6.05,29.99,20.84,48.27,24.39-7.97-31.61-17.02-55-7.91-88.08,24.77-89.94,146.46-110.01,197.96-30.78,24.74,38.07,17.3,77.68,6.27,118.86ZM717.34,742.19c-69.82,67.06,32.92,175.23,102.19,107.44,69.44-67.95-33.02-173.87-102.19-107.44Z" />
            <path fill="#0a0a0a" d="M716.99,742.19c69.17-66.43,171.63,39.48,102.19,107.44-69.27,67.79-172.01-40.38-102.19-107.44Z" />
          </g>
        </svg>
      </div>
    );
  }
);

CliqoLogo.displayName = "CliqoLogo";

export { CliqoHeader, CliqoLogo };
