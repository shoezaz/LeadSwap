import { cn } from "@leadswap/utils";

export interface GridMediaSplitSectionProps {
  className?: string;

  heading: string;

  dateLine?: string;
  title: string;
  description?: string;
  bullets?: string[];

  cta?: { text: string; href: string };

  backgroundVideoSrc?: string;
  backgroundImageSrc?: string;

  mediaVideoSrc: string;
  mediaPosterSrc?: string;
  logoSrc?: string;
  logoAlt?: string;
}

export function GridMediaSplitSection({
  className,
  heading,
  dateLine,
  title,
  description,
  bullets,
  cta,
  backgroundVideoSrc,
  backgroundImageSrc,
  mediaVideoSrc,
  mediaPosterSrc,
  logoSrc = "/logo.svg",
  logoAlt = "Cliqo",
}: GridMediaSplitSectionProps) {
  return (
    <section
      className={cn(
        "grid-section relative overflow-hidden border-y border-neutral-800 bg-neutral-950 px-4 text-neutral-50/70 [.grid-section_~_&]:border-t-0",
        className,
      )}
    >
      <div className="relative mx-auto w-full max-w-[1080px] border-x border-neutral-800">
        <div className="relative">
          {/* Background layer (image/video + gradients) */}
          <div className="pointer-events-none absolute inset-0 max-h-[520px] min-h-[640px]">
            <div className="size-full relative">
              <div className="size-full relative">
                <div className="size-full relative">
                  <div className="pointer-events-none sticky w-3xs top-0 opacity-[0]">
                    {backgroundVideoSrc ? (
                      <video
                        src={backgroundVideoSrc}
                        className="inline-block object-contain overflow-clip pointer-events-none"
                      />
                    ) : null}
                  </div>
                  {backgroundImageSrc ? (
                    <img
                      alt=""
                      src={backgroundImageSrc}
                      className="absolute inset-0 size-full object-cover opacity-15"
                    />
                  ) : null}
                  {backgroundVideoSrc ? (
                    <video
                      className="absolute inset-0 size-full object-cover opacity-20"
                      src={backgroundVideoSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : null}
                </div>
              </div>
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 h-48 max-h-[300px]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(9, 10, 15, 0), rgb(10, 10, 10))",
              }}
            />
            <div
              className="absolute left-0 top-0 right-0 h-[60px] w-full max-h-[100px]"
              style={{
                backgroundImage:
                  "linear-gradient(rgb(10, 10, 10), rgba(9, 10, 15, 0))",
              }}
            />
          </div>

          {/* Foreground content (the grid) */}
          <div className="items-start flex flex-col justify-start relative">
            <section
              className="items-center justify-start relative w-full"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255, 255, 255, 0), rgba(151, 170, 255, 0.06))",
              }}
            >
              <div className="border-t border-neutral-800">
                <div className="items-center flex flex-col justify-end relative">
                  {/* Desktop grid - match 1fr repeat(2, 420px) 1fr */}
                  <div
                    className="hidden w-full grid-rows-[auto] lg:grid"
                    style={{
                      gridTemplateColumns: "1fr repeat(2, 420px) 1fr",
                    }}
                  >
                    <div className="border-b border-r border-neutral-800 h-full" />

                    <div
                      className="border-b border-r border-neutral-800 h-full"
                      style={{ gridArea: "span 1 / span 2 / span 1 / span 2" }}
                    >
                      <div className="flex flex-col justify-start relative">
                        <div>
                          <div className="grid-cols-12 items-start relative w-full grid-rows-[auto] gap-[48px] p-10">
                            <img
                              alt={logoAlt}
                              src={logoSrc}
                              className="inline-block overflow-clip align-middle h-7 w-auto"
                            />
                          </div>
                        </div>

                        <div className="h-24 max-h-[300px]" />
                      </div>
                    </div>

                    <div className="border-b border-r border-neutral-800 h-full" />

                    {/* Row: text card (col 2) + media (col 3) */}
                    <div className="border-b border-r border-neutral-800 h-full" />
                    <div className="border-b border-r border-neutral-800 h-full">
                      <div className="p-10">
                        <div className="max-w-[750px] rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                          <div className="p-10">
                            {dateLine ? (
                              <div className="font-mono text-xs text-neutral-400">
                                {dateLine}
                              </div>
                            ) : null}
                            <h3 className="mt-4 text-balance font-display text-2xl leading-9 text-white">
                              {title}
                            </h3>
                            {description ? (
                              <p className="mt-4 text-pretty text-sm leading-7 text-neutral-300">
                                {description}
                              </p>
                            ) : null}
                            {bullets?.length ? (
                              <ul className="mt-6 space-y-3 text-sm text-neutral-300">
                                {bullets.map((bullet) => (
                                  <li key={bullet} className="flex gap-3">
                                    <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-violet-400" />
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                            {cta ? (
                              <div className="mt-8">
                                <a
                                  href={cta.href}
                                  className="inline-flex items-center justify-center rounded-lg border border-neutral-700 bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-100"
                                >
                                  {cta.text}
                                </a>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-r border-neutral-800 h-full">
                      <div className="p-10">
                        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-black">
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/70 via-black/0 to-transparent" />
                          <video
                            className="block w-full object-cover"
                            style={{ aspectRatio: "419 / 708" }}
                            src={mediaVideoSrc}
                            poster={mediaPosterSrc}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-r border-neutral-800 h-full" />
                  </div>

                  {/* Mobile layout */}
                  <div className="lg:hidden border-b border-neutral-800">
                    <div className="p-6">
                      <img
                        alt={logoAlt}
                        src={logoSrc}
                        className="h-8 w-auto"
                      />
                      <h2 className="mt-6 text-white text-[28px] leading-[36px]">
                        {heading}
                      </h2>
                      <div className="mt-6 overflow-hidden border border-white/20">
                        <video
                          src={mediaVideoSrc}
                          poster={mediaPosterSrc}
                          className="block aspect-video w-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                        />
                      </div>
                      <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                        {dateLine ? (
                          <div
                            className="font-mono text-xs text-neutral-400"
                          >
                            {dateLine}
                          </div>
                        ) : null}
                        <h3
                          className="mt-3 text-balance font-display text-xl leading-8 text-white"
                        >
                          {title}
                        </h3>
                        {description ? (
                          <p className="mt-4 text-neutral-300 leading-[27.2px]">
                            {description}
                          </p>
                        ) : null}
                        {bullets?.length ? (
                          <ul className="mt-5 space-y-3 text-sm text-neutral-300">
                            {bullets.map((bullet) => (
                              <li key={bullet} className="flex gap-3">
                                <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        {cta ? (
                          <div className="pt-4">
                            <a
                              href={cta.href}
                              className="inline-flex items-center justify-center rounded-lg border border-neutral-700 bg-white px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-neutral-100"
                            >
                              {cta.text}
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Second row: section heading (desktop) */}
                  <div
                    className="hidden w-full grid-rows-[auto] lg:grid"
                    style={{
                      gridTemplateColumns: "1fr repeat(2, 420px) 1fr",
                    }}
                  >
                    <div className="border-b border-r border-neutral-800 h-full" />
                    <div
                      className="border-b border-r border-neutral-800 h-full"
                      style={{ gridArea: "span 1 / span 2 / span 1 / span 2" }}
                    >
                      <div className="grid-cols-12 items-start relative w-full grid-rows-[auto] gap-[48px] p-10">
                        <h2
                          className="text-pretty font-display text-3xl font-medium leading-10 text-white"
                        >
                          {heading}
                        </h2>
                      </div>
                    </div>
                    <div className="border-b border-r border-neutral-800 h-full" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
