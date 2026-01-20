"use client";

import { cn } from "@leadswap/utils";

interface CliqoHeroSectionProps {
  className?: string;
}

export function CliqoHeroSection({ className }: CliqoHeroSectionProps) {
  return (
    <section
      className={cn(
        "relative min-h-[90vh] bg-neutral-950 px-6 pt-32 pb-20",
        className
      )}
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-500/20 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/70">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          UGC Agency for SaaS & Startups
        </div>

        {/* Main headline */}
        <h1 className="text-5xl font-medium leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
          Scale your brand with{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            creator content
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400 sm:text-xl">
          We connect SaaS companies and startups with top creators to produce
          authentic UGC that converts. From briefing to delivery, we handle everything.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
          >
            Start a campaign
          </a>
          <a
            href="/creators"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Browse creators
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { value: "500+", label: "Creators" },
            { value: "1,000+", label: "Videos delivered" },
            { value: "50+", label: "SaaS clients" },
            { value: "48h", label: "Avg. turnaround" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-semibold text-white sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
