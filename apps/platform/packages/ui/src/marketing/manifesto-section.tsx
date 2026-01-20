"use client";

import { cn } from "@leadswap/utils";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

// Icon components
function VideoIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="10"
      fill="none"
      viewBox="0 0 11 10"
      className={className}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3.333"
        d="M5.5 5.667v-4M5.5 5.667l-3.333 2M5.5 5.667l3.333 2"
      />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      fill="none"
      viewBox="0 0 10 10"
      className={className}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3.333"
        d="M2.333 6.333v2M7.667 1.667v6.666"
      />
    </svg>
  );
}

function CreatorsIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 32 32"
      className={className}
    >
      <circle cx="27" cy="16" r="5" fill="currentColor" />
      <circle cx="5" cy="16" r="5" fill="currentColor" />
      <circle cx="16" cy="27" r="5" fill="currentColor" />
      <circle cx="16" cy="5" r="5" fill="currentColor" />
    </svg>
  );
}

interface FeatureButtonProps {
  href: string;
  isActive: boolean;
  colorClassName: string;
  bgColorClassName: string;
  textColorClassName: string;
  rotation: string;
  icon: React.ReactNode;
}

function FeatureButton({
  href,
  isActive,
  colorClassName,
  bgColorClassName,
  textColorClassName,
  rotation,
  icon,
}: FeatureButtonProps) {
  return (
    <a
      className="group relative inline-block"
      data-active={isActive}
      href={href}
    >
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 block h-24 w-56 -translate-x-1/2 -translate-y-1/2 mix-blend-screen saturate-[1.25] bg-[radial-gradient(closest-side_ellipse,currentColor,black)] opacity-0 transition-opacity duration-500 group-data-[active=true]:opacity-100",
          colorClassName
        )}
      />
    </a>
  );
}

// Floating icon box
function FloatingIconBox({
  className,
  rotation,
  children,
}: {
  className?: string;
  rotation: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 absolute",
        className,
        rotation
      )}
    >
      {children}
    </div>
  );
}

// Floating app icon for platform logos
function FloatingAppIcon({
  className,
  rotation,
  src,
  alt,
}: {
  className?: string;
  rotation: string;
  src: string;
  alt: string;
}) {
  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-xl overflow-hidden absolute shadow-lg",
        className,
        rotation
      )}
    >
      <img src={src} alt={alt} className="size-full object-cover" />
    </div>
  );
}

// Creator card component
function CreatorCard({
  name,
  country,
  countryCode,
  views,
  engagement,
  className,
  rotation,
  imagePosition,
}: {
  name: string;
  country: string;
  countryCode: string;
  views: string;
  engagement: string;
  className?: string;
  rotation: string;
  imagePosition: string;
}) {
  return (
    <div
      className={cn(
        "flex size-full h-[72px] w-[210px] select-none items-center overflow-hidden rounded-lg border border-neutral-200 bg-white p-1.5 absolute",
        className,
        rotation
      )}
    >
      <div
        className="aspect-square h-full rounded-md border border-neutral-300 bg-neutral-300"
        style={{
          backgroundImage: `url("https://assets.dub.co/partners/partner-images.jpg")`,
          backgroundSize: "1400%",
          backgroundPositionX: imagePosition,
        }}
      />
      <div className="flex flex-col gap-2 px-3">
        <div className="flex items-center gap-1">
          <img
            alt={`${country} flag`}
            className="h-2 w-2.5 rounded-sm"
            src={`https://flag.vercel.app/m/${countryCode}.svg`}
          />
          <span className="whitespace-nowrap text-[0.6875rem] font-medium leading-none text-neutral-800">
            {name}
          </span>
        </div>
        <div className="flex divide-x divide-neutral-200">
          <div className="flex flex-col gap-1 pr-3">
            <span className="text-[0.625rem] font-medium leading-none text-neutral-400">
              Views
            </span>
            <span className="text-xs font-medium leading-none text-neutral-600">
              {views}
            </span>
          </div>
          <div className="flex flex-col gap-1 pl-3">
            <span className="text-[0.625rem] font-medium leading-none text-neutral-400">
              Engagement
            </span>
            <span className="text-xs font-medium leading-none text-neutral-600">
              {engagement}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// SVG Icons for floating boxes
function TrendingUpIcon() {
  return (
    <svg
      height="18"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
    >
      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path d="M2.75 10.75L6.396 7.10401C6.591 6.90901 6.908 6.90901 7.103 7.10401L10.396 10.397C10.591 10.592 10.908 10.592 11.103 10.397L15.249 6.25101" />
        <path d="M2.75 2.75V12.75C2.75 13.855 3.645 14.75 4.75 14.75H15.25" />
      </g>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      height="18"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
    >
      <g fill="currentColor">
        <path
          d="M6.25,3.286c0-.829,.886-1.355,1.6-.95l7.251,4.114c.749,.425,.749,1.476,0,1.901l-7.251,4.114c-.714,.405-1.6-.121-1.6-.95V3.286Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      height="18"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
    >
      <g fill="currentColor">
        <circle
          cx="9"
          cy="4.5"
          fill="none"
          r="2.75"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M13.314,11.5c-1.121-1.078-2.635-1.75-4.313-1.75-2.551,0-4.739,1.53-5.709,3.72-.365,.825,.087,1.774,.947,2.045,1.225,.386,2.846,.734,4.762,.734"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <polyline
          fill="none"
          points="11.25 14.75 12.859 16.25 16.256 11.75"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      height="18"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
    >
      <g fill="currentColor">
        <path
          d="M2.75,6.75c0-1.105,.895-2,2-2h1.086c.265,0,.52-.105,.707-.293l.914-.914c.188-.188,.442-.293,.707-.293h1.672c.265,0,.52,.105,.707,.293l.914,.914c.188,.188,.442,.293,.707,.293h1.086c1.105,0,2,.895,2,2v6c0,1.105-.895,2-2,2H4.75c-1.105,0-2-.895-2-2V6.75Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <circle
          cx="9"
          cy="9.5"
          fill="none"
          r="2.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      height="18"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
    >
      <g fill="currentColor">
        <path
          d="M9,1.75l2.062,4.178c.088,.179,.259,.303,.457,.332l4.611,.67c.498,.072,.697,.686,.337,1.038l-3.337,3.253c-.143,.139-.208,.339-.174,.535l.788,4.592c.085,.497-.437,.876-.883,.641l-4.124-2.168c-.177-.093-.388-.093-.565,0l-4.124,2.168c-.446,.235-.968-.144-.883-.641l.788-4.592c.034-.196-.031-.396-.174-.535L.442,7.968c-.36-.351-.161-.966,.337-1.038l4.611-.67c.198-.029,.369-.153,.457-.332l2.062-4.178c.223-.452,.869-.452,1.092,0Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      height="18"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className="size-5"
    >
      <g fill="currentColor">
        <path
          d="M9,15.114l-6.218-6.218c-1.573-1.573-1.573-4.123,0-5.696h0c1.573-1.573,4.123-1.573,5.696,0l.522,.522,.522-.522c1.573-1.573,4.123-1.573,5.696,0h0c1.573,1.573,1.573,4.123,0,5.696l-6.218,6.218Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}

export interface ManifestoSectionProps {
  className?: string;
}

export function ManifestoSection({ className }: ManifestoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;

    const update = () => {
      rafId = null;
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      // Calculate progress based on how much of the section is visible
      const scrollProgress = Math.max(
        0,
        Math.min(1, (windowHeight - rect.top) / (windowHeight + sectionHeight))
      );

      setProgress((prev) =>
        Math.abs(prev - scrollProgress) < 0.001 ? prev : scrollProgress
      );

      // Update active feature based on progress
      const nextFeature = scrollProgress < 0.33 ? 0 : scrollProgress < 0.66 ? 1 : 2;
      setActiveFeature((prev) => (prev === nextFeature ? prev : nextFeature));
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={cn(
        "grid-section relative overflow-clip px-4 border-neutral-800 [.grid-section_~_&]:border-t-0 border-y",
        className
      )}
    >
      <div className="z-0 mx-auto max-w-[1080px] border-neutral-800 border-x relative pt-32 pb-16 sm:pt-40 sm:pb-32 text-lg px-4">
        <div style={{ ["--progress" as string]: progress }}>
          <div
            className="relative isolate mx-auto max-w-[530px]"
            style={{
              transform: `translateY(calc(var(--progress) * -75px))`,
            }}
          >
            <div className="space-y-8 text-3xl leading-snug text-neutral-200">
              <motion.p
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Marketing isn&apos;t just about impressions.
                <br />
                It&apos;s about <motion.span
                  className="text-violet-400"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >authentic connections</motion.span>.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                Cliqo is the modern UGC platform that connects you with{" "}
                <motion.span
                  className="text-sky-400"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >top creators</motion.span>, real-time analytics and a network of verified creators – all in one place.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                It&apos;s <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                >fast</motion.span>. It&apos;s <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                >reliable</motion.span>. It&apos;s <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                >beautiful</motion.span>. And it scales with you.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                Because you deserve more than vanity metrics. You deserve{" "}
                <motion.span
                  className="text-emerald-400 font-medium"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >results</motion.span>.
              </motion.p>
            </div>

          </div>
        </div>

        {/* Dot pattern background */}
        <div
          className="pointer-events-none absolute inset-x-4 inset-y-16 mix-blend-darken"
          aria-hidden="true"
        >
          <svg
            className="pointer-events-none absolute inset-0 text-neutral-800/60"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern
                id="dots-manifesto"
                x="-1"
                y="-1"
                width="12"
                height="12"
                patternUnits="userSpaceOnUse"
              >
                <rect x="1" y="1" width="2" height="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect fill="url(#dots-manifesto)" width="100%" height="100%" />
          </svg>
        </div>

        {/* Floating elements - only visible on larger screens */}
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">

          {/* State 2: Analytics */}
          <div
            className="absolute inset-0 transition-[transform,opacity] duration-500"
            style={{
              transform: activeFeature === 1 ? "translateY(0)" : "translateY(16px)",
              opacity: activeFeature === 1 ? 1 : 0,
            }}
          >
            <div className="absolute inset-0 flex">
              {/* Left side */}
              <div className="relative h-full grow">
                <FloatingAppIcon
                  className="right-40 top-[25%]"
                  rotation="rotate-[15deg]"
                  src="https://cdn.simpleicons.org/youtube/FF0000"
                  alt="YouTube"
                />
                <FloatingAppIcon
                  className="right-20 top-[28%]"
                  rotation="rotate-[-10deg]"
                  src="https://cdn.simpleicons.org/tiktok/000000"
                  alt="TikTok"
                />
                {/* Analytics card */}
                <div className="w-48 absolute right-10 top-[38%] rotate-[-7deg]">
                  <div className="rounded-lg border border-neutral-200 bg-white p-0">
                    <div className="flex items-center justify-between gap-2 p-3 text-xs font-medium text-neutral-900">
                      Dec 2025
                    </div>
                    <div className="flex flex-col gap-2 border-t border-neutral-200 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2 rounded-sm border border-black/20 bg-current opacity-70"
                            style={{ color: "rgb(59, 130, 246)" }}
                          />
                          <div className="text-xs font-medium leading-none text-neutral-500">
                            Views
                          </div>
                        </div>
                        <span className="text-xs leading-none text-neutral-900">
                          1.2M
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2 rounded-sm border border-black/20 bg-current opacity-70"
                            style={{ color: "rgb(168, 85, 247)" }}
                          />
                          <div className="text-xs font-medium leading-none text-neutral-500">
                            Engagement
                          </div>
                        </div>
                        <span className="text-xs leading-none text-neutral-900">
                          8.2%
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2 rounded-sm border border-black/20 bg-current opacity-70"
                            style={{ color: "rgb(20, 184, 166)" }}
                          />
                          <div className="text-xs font-medium leading-none text-neutral-500">
                            Conversions
                          </div>
                        </div>
                        <span className="text-xs leading-none text-neutral-900">
                          2.4K
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center spacer */}
              <div className="w-full max-w-[530px] shrink-0" />

              {/* Right side */}
              <div className="relative h-full grow">
                <FloatingAppIcon
                  className="left-20 top-[25%]"
                  rotation="rotate-[10deg]"
                  src="https://cdn.simpleicons.org/instagram/E4405F"
                  alt="Instagram"
                />
                <FloatingAppIcon
                  className="left-40 top-[23%]"
                  rotation="rotate-[-15deg]"
                  src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
                  alt="LinkedIn"
                />
              </div>
            </div>
          </div>

          {/* State 3: Network */}
          <div
            className="absolute inset-0 transition-[transform,opacity] duration-500"
            style={{
              transform: activeFeature === 2 ? "translateY(0)" : "translateY(16px)",
              opacity: activeFeature === 2 ? 1 : 0,
            }}
          >
            <div className="absolute inset-0 flex">
              {/* Left side */}
              <div className="relative h-full grow">
                <FloatingAppIcon
                  className="right-40 top-[32%]"
                  rotation="rotate-[15deg]"
                  src="https://cdn.simpleicons.org/youtube/FF0000"
                  alt="YouTube"
                />
                <FloatingAppIcon
                  className="right-20 top-[27%]"
                  rotation="rotate-[-10deg]"
                  src="https://cdn.simpleicons.org/instagram/E4405F"
                  alt="Instagram"
                />
                <CreatorCard
                  name="Samantha Johnson"
                  country="US"
                  countryCode="US"
                  views="320K"
                  engagement="9.1%"
                  className="right-20 top-[49%]"
                  rotation="rotate-[-3deg]"
                  imagePosition="700%"
                />
                <CreatorCard
                  name="Derek Forbes"
                  country="GB"
                  countryCode="GB"
                  views="198K"
                  engagement="7.8%"
                  className="right-10 top-[42%]"
                  rotation="rotate-[8deg]"
                  imagePosition="600%"
                />
              </div>

              {/* Center spacer */}
              <div className="w-full max-w-[530px] shrink-0" />

              {/* Right side */}
              <div className="relative h-full grow">
                <FloatingAppIcon
                  className="left-20 top-[28%]"
                  rotation="rotate-[10deg]"
                  src="https://cdn.simpleicons.org/tiktok/000000"
                  alt="TikTok"
                />
                <FloatingAppIcon
                  className="left-40 top-[25%]"
                  rotation="rotate-[-15deg]"
                  src="https://cdn.simpleicons.org/x/000000"
                  alt="X"
                />
                <CreatorCard
                  name="Marvin Ta"
                  country="CA"
                  countryCode="CA"
                  views="412K"
                  engagement="11.2%"
                  className="left-4 top-[45%]"
                  rotation="rotate-[6deg]"
                  imagePosition="500%"
                />
                <CreatorCard
                  name="Lucia Gonzalez"
                  country="AR"
                  countryCode="AR"
                  views="287K"
                  engagement="8.9%"
                  className="left-8 top-[38%]"
                  rotation="rotate-[-4deg]"
                  imagePosition="800%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
