"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@leadswap/utils";

export interface PhoneImage {
  src: string;
  alt: string;
  name?: string;
}

export interface PhoneColumn {
  images: PhoneImage[];
  direction?: "up" | "down";
  speed?: number;
}

export interface InfinitePhoneCarouselProps {
  columns: PhoneColumn[];
  phoneWidth?: number;
  phoneHeight?: number;
  gap?: number;
  className?: string;
  overlayGradient?: boolean;
  overlayColor?: string;
}

// Default sample images (Framer placeholder style)
export const DEFAULT_PHONE_COLUMNS: PhoneColumn[] = [
  {
    images: [
      {
        src: "https://framerusercontent.com/images/CF3EXfbqdw82cRdZovsLrCvIqU.webp",
        alt: "Creator showcase 1",
        name: "Theo",
      },
      {
        src: "https://framerusercontent.com/images/FRCUfMvCsWp8MyofnUdLbyBDBiw.webp",
        alt: "Creator showcase 2",
        name: "Logan Paul",
      },
    ],
    direction: "up",
    speed: 25,
  },
  {
    images: [
      {
        src: "https://framerusercontent.com/images/I07DNLR8SHwDtK2WxK0dSqRPlk.webp",
        alt: "Creator showcase 3",
        name: "Speed",
      },
      {
        src: "https://framerusercontent.com/images/rYSjyoPAkpcwKKDAUaVDm06MfM.webp",
        alt: "Creator showcase 4",
        name: "Brady",
      },
    ],
    direction: "down",
    speed: 30,
  },
  {
    images: [
      {
        src: "https://framerusercontent.com/images/N6SPt3g5qp1k7DA2rxdG4bPhek4.webp",
        alt: "Creator showcase 5",
        name: "Kai",
      },
      {
        src: "https://framerusercontent.com/images/V9QtfhdSNaMfUXJGGyRNpsfCmuo.webp",
        alt: "Creator showcase 6",
        name: "DOAC",
      },
    ],
    direction: "up",
    speed: 20,
  },
];

function PhoneCard({
  image,
  width,
  height,
}: {
  image: PhoneImage;
  width: number;
  height: number;
}) {
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-900"
      style={{ width, height }}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function ScrollingColumn({
  column,
  phoneWidth,
  phoneHeight,
  gap,
}: {
  column: PhoneColumn;
  phoneWidth: number;
  phoneHeight: number;
  gap: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Duplicate images for seamless loop (6x for smooth infinite scroll)
  const duplicatedImages = [
    ...column.images,
    ...column.images,
    ...column.images,
    ...column.images,
    ...column.images,
    ...column.images,
  ];

  const singleSetHeight = column.images.length * (phoneHeight + gap);
  const speed = column.speed || 25;
  const direction = column.direction || "up";

  useEffect(() => {
    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Calculate pixels per frame based on speed (pixels per second)
      const pixelsPerFrame = (speed * deltaTime) / 1000;

      setTranslateY((prev) => {
        const newValue =
          direction === "up" ? prev - pixelsPerFrame : prev + pixelsPerFrame;

        // Reset position for seamless loop
        if (direction === "up" && Math.abs(newValue) >= singleSetHeight) {
          return newValue + singleSetHeight;
        }
        if (direction === "down" && newValue >= 0) {
          return newValue - singleSetHeight;
        }

        return newValue;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start with offset for seamless appearance
    setTranslateY(direction === "up" ? 0 : -singleSetHeight);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [singleSetHeight, speed, direction]);

  return (
    <div
      className="relative h-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <div
        ref={containerRef}
        className="flex flex-col items-center"
        style={{
          gap,
          transform: `translateY(${translateY}px)`,
          willChange: "transform",
        }}
      >
        {duplicatedImages.map((image, index) => (
          <PhoneCard
            key={`${image.name || image.alt}-${index}`}
            image={image}
            width={phoneWidth}
            height={phoneHeight}
          />
        ))}
      </div>
    </div>
  );
}

export function InfinitePhoneCarousel({
  columns = DEFAULT_PHONE_COLUMNS,
  phoneWidth = 120,
  phoneHeight = 213,
  gap = 10,
  className,
  overlayGradient = true,
  overlayColor = "rgba(0, 0, 0, 0.3)",
}: InfinitePhoneCarouselProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Phone columns container */}
      <div
        className="flex items-center justify-center gap-3"
        style={{ height: phoneHeight * 3 + gap * 2 }}
      >
        {columns.map((column, index) => (
          <ScrollingColumn
            key={index}
            column={column}
            phoneWidth={phoneWidth}
            phoneHeight={phoneHeight}
            gap={gap}
          />
        ))}
      </div>

      {/* Optional overlay gradient */}
      {overlayGradient && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${overlayColor} 0%, transparent 20%, transparent 80%, ${overlayColor} 100%)`,
          }}
        />
      )}
    </div>
  );
}

// Pre-built variant: Hero section carousel
export function HeroPhoneCarousel({
  className,
  ...props
}: Omit<InfinitePhoneCarouselProps, "columns">) {
  return (
    <InfinitePhoneCarousel
      columns={DEFAULT_PHONE_COLUMNS}
      phoneWidth={140}
      phoneHeight={249}
      className={cn("h-[800px]", className)}
      {...props}
    />
  );
}

// Pre-built variant: Compact carousel for smaller sections
export function CompactPhoneCarousel({
  columns = DEFAULT_PHONE_COLUMNS,
  className,
  ...props
}: Partial<InfinitePhoneCarouselProps>) {
  return (
    <InfinitePhoneCarousel
      columns={columns}
      phoneWidth={100}
      phoneHeight={178}
      gap={8}
      className={cn("h-[600px]", className)}
      {...props}
    />
  );
}
