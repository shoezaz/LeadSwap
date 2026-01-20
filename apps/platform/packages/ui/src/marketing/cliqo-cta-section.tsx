"use client";

import { cn, APP_DOMAIN } from "@leadswap/utils";

interface CliqoCtaSectionProps {
  className?: string;
}

export function CliqoCtaSection({ className }: CliqoCtaSectionProps) {
  return (
    <section className={cn("bg-neutral-950 px-6 py-24", className)}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Ready to scale your creator content?
        </h2>
        <p className="mt-4 text-lg text-neutral-400">
          Book a call with our team to discuss your content needs and get a custom quote.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={`${APP_DOMAIN}/register`}
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
          >
            Get started
          </a>
          <a
            href="/contact"
            className="inline-flex h-12 items-center gap-2 justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Book a call
          </a>
        </div>
      </div>
    </section>
  );
}
