"use client";

import { cn } from "@leadswap/utils";
import { useState } from "react";

interface ContactSectionProps {
  className?: string;
}

const SERVICES = [
  "creator campaign",
  "brand partnership",
  "ugc",
  "influencer",
  "other",
];

const BUDGETS = [
  "< $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000+",
];

export function ContactSection({ className }: ContactSectionProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          services: selectedServices,
          budget,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section
        className={cn(
          "relative min-h-screen bg-neutral-950 px-8 py-32",
          className
        )}
      >
        <div className="mx-auto max-w-lg">
          <h1 className="text-6xl font-medium tracking-tight text-white/70 sm:text-8xl">
            thank you
          </h1>
          <p className="mt-8 text-neutral-400">
            We'll get back to you shortly.
          </p>
          <a
            href="https://cal.com/vigil/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-neutral-950 transition-colors hover:bg-neutral-200"
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
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative min-h-screen bg-neutral-950 px-8 py-32",
        className
      )}
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] opacity-10">
        <div className="h-full w-full rounded-full bg-gradient-to-br from-white/20 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-lg">
        {/* Title */}
        <h1 className="text-6xl font-medium tracking-tight text-white/70 sm:text-8xl">
          let's talk
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {/* Service selector */}
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-medium transition-colors",
                  selectedServices.includes(service)
                    ? "bg-neutral-400 text-neutral-950"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                )}
              >
                {service}
              </button>
            ))}
          </div>

          {/* Message */}
          <textarea
            rows={3}
            placeholder="how can we help?*"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full resize-none rounded-2xl bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:ring-2 focus:ring-neutral-600"
          />

          {/* Budget & Email row */}
          <div className="flex flex-wrap gap-2">
            {/* Budget dropdown */}
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="h-9 rounded-full bg-neutral-800 px-4 text-xs text-neutral-400 outline-none transition-colors hover:bg-neutral-700"
            >
              <option value="">budget</option>
              {BUDGETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* Name */}
            <input
              type="text"
              placeholder="name*"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-9 flex-1 rounded-full bg-neutral-800 px-4 text-xs text-white placeholder-neutral-500 outline-none transition-colors focus:ring-2 focus:ring-neutral-600"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="email*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-9 flex-1 rounded-full bg-neutral-800 px-4 text-xs text-white placeholder-neutral-500 outline-none transition-colors focus:ring-2 focus:ring-neutral-600"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-9 w-12 items-center justify-center rounded-full bg-white text-neutral-950 transition-colors hover:bg-neutral-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-400 border-t-neutral-900" />
              ) : (
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>

        {/* Contact info */}
        <div className="mt-16 font-mono text-xs uppercase tracking-wider text-neutral-500">
          LET'S GET TO WORK /{" "}
          <a
            href="mailto:contact@cliqo.com"
            className="text-neutral-400 transition-colors hover:text-white"
          >
            CONTACT@CLIQO.COM
          </a>
          {" "}/{" "}
          <a
            href="https://cal.com/vigil/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 transition-colors hover:text-white"
          >
            BOOK A CALL
          </a>
        </div>
      </div>
    </section>
  );
}
