"use client";

import { cn } from "@leadswap/utils";

interface CliqoServicesSectionProps {
  className?: string;
}

export function CliqoServicesSection({ className }: CliqoServicesSectionProps) {
  return (
    <section
      id="services"
      className={cn("bg-neutral-950 px-6 py-24", className)}
    >
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Everything you need to scale creator content
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            From strategy to delivery, we handle the entire creator workflow
          </p>
        </div>
      </div>
    </section>
  );
}
