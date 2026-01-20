import { cn } from "@leadswap/utils";

export interface VideoFeatureSectionProps {
  className?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  bullets?: string[];
  videoSrc: string;
  posterSrc?: string;
}

export function VideoFeatureSection({
  className,
  eyebrow = "How it works",
  title,
  description,
  bullets,
  videoSrc,
  posterSrc,
}: VideoFeatureSectionProps) {
  return (
    <section
      className={cn(
        "grid-section relative overflow-clip border-y border-neutral-800 px-4 [.grid-section_~_&]:border-t-0",
        className,
      )}
    >
      <div className="relative mx-auto max-w-[1080px] border-x border-neutral-800 px-4 py-16 sm:px-12 sm:py-24">
        <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(transparent,black)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(38,38,38,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(38,38,38,0.6)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-neutral-950 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
        </div>

        <div className="relative grid items-start gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs font-medium text-neutral-300">
              {eyebrow}
            </div>
            <h2 className="mt-4 text-balance text-3xl font-medium tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
            {description && (
              <p className="mt-4 text-pretty text-base leading-7 text-neutral-300 sm:text-lg">
                {description}
              </p>
            )}
            {bullets?.length ? (
              <ul className="mt-6 space-y-3 text-sm text-neutral-300 sm:text-base">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-violet-400" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="relative aspect-[16/11] w-full">
                <video
                  className="absolute inset-0 size-full object-cover"
                  src={videoSrc}
                  poster={posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-neutral-950/70 via-neutral-950/10 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950/80 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

