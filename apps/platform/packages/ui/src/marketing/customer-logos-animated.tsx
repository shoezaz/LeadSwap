"use client";

import { useState, useEffect } from "react";

export interface LogoPair {
  front: {
    name: string;
    src: string;
    href?: string;
    heightPercent?: string;
    caseStudy?: boolean;
  };
  back: {
    name: string;
    src: string;
    href?: string;
    heightPercent?: string;
    caseStudy?: boolean;
  };
}

export interface CustomerLogosAnimatedProps {
  logos: LogoPair[];
  columns?: number;
  flipInterval?: number;
  customersHref?: string;
}

// Default logos from the mockup
export const DEFAULT_LOGO_PAIRS: LogoPair[] = [
  {
    front: {
      name: "whop",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F1ce8081f640740f124a45d82a44420bc4023c8b5.svg?generation=1762752200293957&alt=media",
    },
    back: {
      name: "twilio",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd384c780a800c9f869ac4d2a74b7c592f4eaf2b7.svg?generation=1762752200269399&alt=media",
    },
  },
  {
    front: {
      name: "clerk",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fc9f7751d5f7547dcc79b4eecc13036d9d0aaf0c4.svg?generation=1762752200410302&alt=media",
    },
    back: {
      name: "superhuman",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fa69f9f47cfd5844652cdcf26d821f55cc23a15a3.svg?generation=1762752200309893&alt=media",
      heightPercent: "75%",
    },
  },
  {
    front: {
      name: "cal",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F5bacb41fb5605eb6d80c2a9fcba4ca3bfc8cf5ca.svg?generation=1762752200437549&alt=media",
      heightPercent: "70%",
    },
    back: {
      name: "perplexity",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F90e6a939ca1910e250f40e85604492386bd970b2.svg?generation=1762752200426533&alt=media",
    },
  },
  {
    front: {
      name: "bolt",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F6e43ac0e6f81a8a5d94aed3185a1aaf04e82ae57.svg?generation=1762752200459211&alt=media",
    },
    back: {
      name: "vercel",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F5fef89080a49dc24053bb0e032509fabc2831462.svg?generation=1762752200423115&alt=media",
      heightPercent: "65%",
    },
  },
  {
    front: {
      name: "supabase",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F14805a6b143ec9d7a7e1cd84292d4a80c1cc9a35.svg?generation=1762752200437794&alt=media",
    },
    back: {
      name: "raycast",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F88641fc00f400b9314a03fcb6afbef16e7732c81.svg?generation=1762752200448149&alt=media",
      caseStudy: true,
      href: "https://dub.co/customers/raycast",
    },
  },
  {
    front: {
      name: "tella",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F87893086c664c3fbeb297f8efdc7d9c214ecabf4.svg?generation=1762752200471089&alt=media",
      caseStudy: true,
      href: "https://dub.co/customers/tella",
    },
    back: {
      name: "framer",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe5faf3dc27ca8b932938d887a3cd9019123de231.svg?generation=1762752200518576&alt=media",
      caseStudy: true,
      href: "https://dub.co/customers/framer",
    },
  },
  {
    front: {
      name: "polymarket",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F6d58c000f16b9b713993bdde97361b28c1f6127c.svg?generation=1762752200556991&alt=media",
    },
    back: {
      name: "product-hunt",
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Facca625d6494cf6fefe57a00cb9776c3d7adb085.svg?generation=1762752200495464&alt=media",
      caseStudy: true,
      href: "https://dub.co/customers/product-hunt",
    },
  },
];

function LogoFlipCard({
  logoPair,
  isFlipped,
  customersHref,
}: {
  logoPair: LogoPair;
  isFlipped: boolean;
  customersHref: string;
}) {
  const frontLogo = logoPair.front;
  const backLogo = logoPair.back;
  const currentLogo = isFlipped ? backLogo : frontLogo;
  const hiddenLogo = isFlipped ? frontLogo : backLogo;

  return (
    <div className="relative">
      <div className="relative h-12">
        {/* Hidden logo (with 3D flip effect) */}
        <a
          href={hiddenLogo.href || customersHref}
          className="block pointer-events-none absolute left-0 top-0 right-0 bottom-0 opacity-[0]"
        >
          <div
            className="pointer-events-none absolute h-6 left-0 top-3 right-0 bottom-3"
            style={{ transform: "rotate3d(1, 0, 0, 100deg)" }}
          >
            <div
              className={`pointer-events-none absolute left-0 top-[50%] translate-y-[-50%] opacity-[0.9] ${
                hiddenLogo.heightPercent ? `h-[${hiddenLogo.heightPercent}]` : "size-full"
              }`}
              style={{
                height: hiddenLogo.heightPercent || "100%",
                width: "100%",
              }}
            >
              <img
                alt={hiddenLogo.name}
                src={hiddenLogo.src}
                className="block size-full max-w-full object-contain overflow-clip pointer-events-none absolute align-middle left-0 top-0 right-0 bottom-0 text-black/0"
                style={{ textDecoration: "rgba(0, 0, 0, 0)" }}
              />
            </div>
          </div>
          {hiddenLogo.caseStudy && (
            <div
              className="font-semibold pointer-events-none absolute uppercase whitespace-nowrap left-[50%] bottom-[-8px] bg-neutral-100 text-neutral-500 text-[8px] leading-[12px] pt-[2px] pr-1 pb-[2px] pl-1 translate-x-[-50%] rounded-[624.9375rem]"
              style={{ textDecoration: "rgb(115, 115, 115)" }}
            >
              Case Study
            </div>
          )}
        </a>

        {/* Visible logo */}
        <a
          href={currentLogo.href || customersHref}
          className="block absolute left-0 top-0 right-0 bottom-0"
        >
          <div className="absolute h-6 left-0 top-3 right-0 bottom-3">
            <div
              className="absolute left-0 top-[50%] translate-y-[-50%] opacity-[0.9]"
              style={{
                height: currentLogo.heightPercent || "100%",
                width: "100%",
              }}
            >
              <img
                alt={currentLogo.name}
                src={currentLogo.src}
                className="block size-full max-w-full object-contain overflow-clip absolute align-middle left-0 top-0 right-0 bottom-0 text-black/0"
                style={{ textDecoration: "rgba(0, 0, 0, 0)" }}
              />
            </div>
          </div>
          {currentLogo.caseStudy && (
            <div
              className="font-semibold absolute uppercase whitespace-nowrap left-[50%] bottom-[-8px] bg-neutral-100 text-neutral-500 text-[8px] leading-[12px] pt-[2px] pr-1 pb-[2px] pl-1 translate-x-[-50%] rounded-[624.9375rem]"
              style={{ textDecoration: "rgb(115, 115, 115)" }}
            >
              Case Study
            </div>
          )}
        </a>
      </div>
    </div>
  );
}

export function CustomerLogosAnimated({
  logos = DEFAULT_LOGO_PAIRS,
  columns = 5,
  flipInterval = 3000,
  customersHref = "#",
}: CustomerLogosAnimatedProps) {
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Randomly flip logos at intervals
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * logos.length);
      setFlippedIndices((prev) => {
        const next = new Set(prev);
        if (next.has(randomIndex)) {
          next.delete(randomIndex);
        } else {
          next.add(randomIndex);
        }
        return next;
      });
    }, flipInterval);

    return () => clearInterval(interval);
  }, [logos.length, flipInterval]);

  // Calculate grid rows
  const rows: LogoPair[][] = [];
  for (let i = 0; i < logos.length; i += columns) {
    rows.push(logos.slice(i, i + columns));
  }

  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] z-[0]">
        <div
          className="items-center grid gap-[16px] pt-10 pr-4 pb-10 pl-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0px, 1fr))` }}
        >
          {logos.map((logoPair, index) => (
            <LogoFlipCard
              key={index}
              logoPair={logoPair}
              isFlipped={flippedIndices.has(index)}
              customersHref={customersHref}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
