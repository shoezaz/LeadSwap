"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

export interface PartnerLogoData {
  name: string;
  src: string;
  height: string;
}

export interface PartnersLogosGridProps {
  logos?: PartnerLogoData[];
}

export const DEFAULT_PARTNER_LOGOS: PartnerLogoData[] = [
  {
    name: "framer",
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe5faf3dc27ca8b932938d887a3cd9019123de231.svg?generation=1762752200518576&alt=media",
    height: "h-[26px]",
  },
  {
    name: "superhuman",
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fa69f9f47cfd5844652cdcf26d821f55cc23a15a3.svg?generation=1762752200309893&alt=media",
    height: "h-6",
  },
  {
    name: "granola",
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F961078c35d293d887d6388c6ea40e44fe33882b1.svg?generation=1762752200570397&alt=media",
    height: "h-8",
  },
  {
    name: "cal",
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F5bacb41fb5605eb6d80c2a9fcba4ca3bfc8cf5ca.svg?generation=1762752200437549&alt=media",
    height: "h-[18px]",
  },
  {
    name: "privy",
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Ff0fbde823c5fcde048e832db2ce0de3afc2950e2.svg?generation=1765503409601415&alt=media",
    height: "h-7",
  },
  {
    name: "perplexity",
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F90e6a939ca1910e250f40e85604492386bd970b2.svg?generation=1762752200426533&alt=media",
    height: "h-6",
  },
  {
    name: "anara",
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd594c6b064b96a3b6f651d696d0679b2fe5a2f2c.svg?generation=1765503409622223&alt=media",
    height: "h-5",
  },
  {
    name: "tella",
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F87893086c664c3fbeb297f8efdc7d9c214ecabf4.svg?generation=1762752200471089&alt=media",
    height: "h-6",
  },
];

// Magnetic hover logo component
function MagneticLogo({
  logo,
  index,
  totalLogos
}: {
  logo: PartnerLogoData;
  index: number;
  totalLogos: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values for magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth magnetic movement
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  // Calculate radial delay from center
  // Grid is 4 columns, so calculate position
  const cols = 4;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const centerRow = 0.5; // Center of 2 rows
  const centerCol = 1.5; // Center of 4 columns
  const distance = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2));
  const maxDistance = Math.sqrt(Math.pow(1 - centerRow, 2) + Math.pow(3 - centerCol, 2));
  const normalizedDelay = distance / maxDistance;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate offset (magnetic attraction toward cursor)
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;

    x.set(offsetX);
    y.set(offsetY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="items-center flex justify-center relative"
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: 0.1 + normalizedDelay * 0.3,
        ease: [0.16, 1, 0.3, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <img
          alt={logo.name}
          src={logo.src}
          className={`block max-w-full overflow-clip align-middle invert opacity-70 transition-opacity duration-300 hover:opacity-100 ${logo.height}`}
        />
      </motion.div>
    </motion.div>
  );
}

export function PartnersLogosGrid({ logos = DEFAULT_PARTNER_LOGOS }: PartnersLogosGridProps) {
  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] z-[0]">
        <div className="mx-auto py-10 sm:py-14 px-4 sm:px-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 justify-around gap-8 sm:gap-12">
            {logos.map((logo, index) => (
              <MagneticLogo
                key={logo.name}
                logo={logo}
                index={index}
                totalLogos={logos.length}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
