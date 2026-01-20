"use client";

export interface IntegrationIcon {
  position: string; // background-position
  left: number;
  top: number;
}

export interface LandingIntegrationsProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  gridPatternSrc?: string;
  iconSpriteSrc?: string;
  integrations?: IntegrationIcon[];
}

const DEFAULT_GRID_PATTERN =
  "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fbfb703b423ad398f7a51c3160ff70d2bcda5b96a.svg?generation=1762752202329849&alt=media";

const DEFAULT_ICON_SPRITE =
  "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fba5381d3d6a07081beb5e4056c4d56f5b22872df.png?generation=1762752202364383&alt=media";

// Integration icons with their positions from the mockup
const DEFAULT_INTEGRATIONS: IntegrationIcon[] = [
  { position: "200% 0%", left: 599, top: 239 },
  { position: "700% 0%", left: 659, top: 119 },
  { position: "900% 0%", left: 719, top: 359 },
  { position: "600% 0%", left: 779, top: 59 },
  { position: "top right", left: 779, top: 179 },
  { position: "500% 0%", left: 839, top: 299 },
  { position: "800% 0%", left: 899, top: 239 },
  { position: "400% 0%", left: 1019, top: 119 },
  { position: "300% 0%", left: 1079, top: 359 },
];

// Empty placeholder slots
const PLACEHOLDER_SLOTS = [
  { left: 539, top: 119 },
  { left: 599, top: 359 },
  { left: 659, top: 299 },
  { left: 899, top: 119 },
  { left: 959, top: 359 },
  { left: 1019, top: 299 },
];

export function LandingIntegrations({
  title,
  subtitle,
  ctaText,
  ctaHref,
  gridPatternSrc = DEFAULT_GRID_PATTERN,
  iconSpriteSrc = DEFAULT_ICON_SPRITE,
  integrations = DEFAULT_INTEGRATIONS,
}: LandingIntegrationsProps) {
  return (
    <div className="border-b overflow-clip relative bg-neutral-950 border-neutral-800 pt-0 pr-4 pb-0 pl-4">
      <div className="border-l border-r ml-auto mr-auto relative h-[440px] border-neutral-800 max-w-[1080px] z-[0]">
        {/* Grid background */}
        <div className="absolute left-0 top-0 right-0 bottom-0">
          <div className="-left-px absolute w-[1600px] h-[480px] top-[50%] translate-y-[-50%]">
            {/* Grid pattern */}
            <div className="size-full overflow-hidden pointer-events-none absolute align-middle left-0 top-0 right-0 bottom-0 opacity-30">
              <img src={gridPatternSrc} className="block size-full invert" alt="" />
            </div>

            {/* Integration icons */}
            <div className="absolute left-0 top-0 right-0 bottom-0">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="absolute w-[61px] h-[61px] bg-size-[900%] shadow-[rgba(0,0,0,0.3)_0px_4px_6px_-1px,_rgba(0,0,0,0.2)_0px_2px_4px_-2px] rounded-lg"
                  style={{
                    backgroundImage: `url("${iconSpriteSrc}")`,
                    backgroundPosition: integration.position,
                    left: `${integration.left}px`,
                    top: `${integration.top}px`,
                  }}
                >
                  <div className="border absolute left-0 top-0 right-0 bottom-0 border-white/10 rounded-lg"></div>
                </div>
              ))}

              {/* Placeholder slots */}
              {PLACEHOLDER_SLOTS.map((slot, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="absolute w-[61px] h-[61px] shadow-[rgba(255,255,255,0.05)_0px_2px_6px_0px_inset] opacity-[0.3] rounded-lg"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgb(38, 38, 38), rgb(23, 23, 23))",
                    left: `${slot.left}px`,
                    top: `${slot.top}px`,
                  }}
                >
                  <div className="border absolute left-0 top-0 right-0 bottom-0 border-white/10 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative pt-28 pr-10 pb-28 pl-10">
          <h2 className="font-normal text-neutral-50/70 text-[40px] leading-[100%] tracking-[-0.03em] max-w-sm">
            {title}
          </h2>
          <p className="mt-[12px] text-neutral-400 text-[18px] leading-[28px] max-w-sm">
            {subtitle}
          </p>
          <div className="mt-[32px]">
            <a
              href={ctaHref}
              className="block font-medium max-w-fit bg-neutral-50 text-neutral-950 text-[14px] leading-[20px] py-2.5 px-6 rounded-[2097150rem] hover:bg-neutral-200 transition-colors"
            >
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export const DEFAULT_INTEGRATIONS_PROPS: LandingIntegrationsProps = {
  title: "Connect with your favorite tools",
  subtitle:
    "Extend Dub, streamline workflows, and connect your favorite tools, with new integrations added constantly.",
  ctaText: "Explore integrations",
  ctaHref: "https://dub.co/integrations",
};
