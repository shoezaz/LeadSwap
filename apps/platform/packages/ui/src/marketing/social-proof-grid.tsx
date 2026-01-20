"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

export interface LogoItem {
  type: "logo";
  name: string;
  logoSrc: string;
  shortDomain?: string;
  domainHref?: string;
}

export interface TestimonialItem {
  type: "testimonial";
  companyName: string;
  companyLogoSrc: string;
  quote: string;
  highlightedText?: string;
  products?: {
    type: "links" | "partners" | "analytics";
    label: string;
    href: string;
  }[];
  author: {
    name: string;
    title: string;
    imageSrc: string;
  };
}

export type GridItem = LogoItem | TestimonialItem;

export interface SocialProofGridProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  items?: GridItem[];
}

// Product badge colors
const PRODUCT_COLORS = {
  links: {
    bg: "bg-orange-400",
    text: "text-orange-900",
  },
  partners: {
    bg: "bg-violet-400",
    text: "text-violet-900",
  },
  analytics: {
    bg: "bg-green-400",
    text: "text-green-900",
  },
};

// Calculate grid position for diagonal cascade
function getGridPosition(index: number, gridCols: number): { row: number; col: number } {
  // Complex calculation based on the grid layout
  // Testimonials span 2 cols, logos span 1
  // This is a simplified version
  return { row: Math.floor(index / 2), col: index % 4 };
}

function LogoCard({ item, index }: { item: LogoItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Calculate diagonal delay
  const { row, col } = getGridPosition(index, 4);
  const diagonalDelay = (row + col) * 0.05;

  return (
    <motion.div
      ref={ref}
      className="items-center flex size-full relative bg-neutral-900 pt-8 pr-4 pb-8 pl-4 group"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: diagonalDelay,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{
        backgroundColor: "rgb(30, 30, 30)",
        transition: { duration: 0.2 }
      }}
    >
      <motion.div
        className="ml-auto mr-auto relative w-full h-8"
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <img
          alt={item.name}
          src={item.logoSrc}
          className="block size-full max-w-full object-contain overflow-clip absolute align-middle left-0 top-0 right-0 bottom-0 invert opacity-70 transition-opacity duration-300 group-hover:opacity-100"
        />
      </motion.div>
      {item.shortDomain && (
        <motion.a
          href={item.domainHref || `https://${item.shortDomain}`}
          className="items-center border flex font-medium absolute top-5 right-4 bg-neutral-800 border-neutral-700 text-neutral-200 text-xs gap-1.5 leading-4 py-1.5 px-3 rounded-full"
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {item.shortDomain}
          <div className="bg-neutral-700 text-neutral-400 p-1 shrink-0 rounded-full">
            <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </motion.a>
      )}
    </motion.div>
  );
}

// Animated quote text component
function AnimatedQuoteText({ text, highlightedText }: { text: string; highlightedText?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (!highlightedText) {
    return <p>{text}</p>;
  }

  const parts = text.split(highlightedText);

  return (
    <p ref={ref}>
      {parts[0]}
      <motion.strong
        className="font-semibold text-neutral-200"
        initial={{ backgroundSize: "0% 100%" }}
        animate={isInView ? { backgroundSize: "100% 100%" } : {}}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "linear-gradient(transparent 60%, rgba(139, 92, 246, 0.2) 40%)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left bottom",
        }}
      >
        {highlightedText}
      </motion.strong>
      {parts[1]}
    </p>
  );
}

function TestimonialCard({ item, index }: { item: TestimonialItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Calculate diagonal delay
  const { row, col } = getGridPosition(index, 4);
  const diagonalDelay = (row + col) * 0.05;

  return (
    <motion.div
      ref={ref}
      className="h-full relative bg-neutral-900"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: diagonalDelay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <div className="flex flex-col h-full relative gap-6 sm:gap-10 p-6 sm:p-10">
        {/* Company logo */}
        <motion.div
          className="items-center flex h-7"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: diagonalDelay + 0.1 }}
        >
          <img
            alt={item.companyName}
            src={item.companyLogoSrc}
            className="block h-full max-w-full overflow-clip align-middle invert opacity-80"
          />
        </motion.div>

        {/* Quote with highlight animation */}
        <motion.div
          className="text-neutral-400"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: diagonalDelay + 0.2 }}
        >
          <AnimatedQuoteText text={item.quote} highlightedText={item.highlightedText} />
        </motion.div>

        {/* Footer with products and author */}
        <div className="flex flex-col grow justify-end">
          <div className="items-end flex justify-between gap-2">
            {/* Product badges */}
            <div className="min-w-32">
              <div className="items-start flex flex-col overflow-hidden relative gap-1">
                {item.products?.map((product, productIndex) => (
                  <motion.a
                    key={productIndex}
                    href={product.href}
                    className="items-center flex font-medium max-w-full whitespace-nowrap text-neutral-400 text-xs gap-2 leading-4 p-1 rounded-lg hover:text-neutral-200 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: diagonalDelay + 0.3 + productIndex * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div
                      className={`items-center flex justify-center w-4 h-4 ${PRODUCT_COLORS[product.type].bg} ${PRODUCT_COLORS[product.type].text} shrink-0 rounded-sm`}
                    >
                      {product.type === "links" && (
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                          <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                        </svg>
                      )}
                      {product.type === "partners" && (
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                        </svg>
                      )}
                      {product.type === "analytics" && (
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
                        </svg>
                      )}
                    </div>
                    <span>{product.label}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Author */}
            <motion.div
              className="items-center flex text-right gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: diagonalDelay + 0.4 }}
            >
              <div className="flex flex-col text-right text-xs leading-4">
                <div className="font-medium text-right text-neutral-50">
                  {item.author.name}
                </div>
                <div className="text-right text-neutral-500">{item.author.title}</div>
              </div>
              <motion.img
                alt={item.author.name}
                src={item.author.imageSrc}
                className="border block max-w-full overflow-clip text-right align-middle w-12 h-12 border-white/10 rounded-lg"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.3)"
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export const DEFAULT_SOCIAL_PROOF_ITEMS: GridItem[] = [
  {
    type: "logo",
    name: "TechStartup",
    logoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd384c780a800c9f869ac4d2a74b7c592f4eaf2b7.svg?generation=1762752200269399&alt=media",
  },
  {
    type: "logo",
    name: "SaaSCo",
    logoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Ff921d4990d7364093099d062288f913f182bc68c.svg?generation=1762752200585406&alt=media",
  },
  {
    type: "testimonial",
    companyName: "Growth Startup",
    companyLogoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe5faf3dc27ca8b932938d887a3cd9019123de231.svg?generation=1762752200518576&alt=media",
    quote:
      "Cliqo transformed our content strategy. We went from struggling to find creators to having a steady stream of high-quality UGC that actually converts.",
    highlightedText: "steady stream of high-quality UGC that actually converts",
    products: [
      { type: "analytics", label: "UGC Videos", href: "/creators" },
    ],
    author: {
      name: "Sarah Chen",
      title: "Head of Marketing",
      imageSrc:
        "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F74d218c9f6aca483df3225419425393cdf3220b4.jpg?generation=1762752203190794&alt=media",
    },
  },
  {
    type: "testimonial",
    companyName: "D2C Brand",
    companyLogoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F5fef89080a49dc24053bb0e032509fabc2831462.svg?generation=1762752200423115&alt=media",
    quote:
      "The quality of creators and the speed of delivery is unmatched. Cliqo has become our go-to for all UGC content needs.",
    highlightedText: "go-to for all UGC content needs",
    products: [
      { type: "analytics", label: "Creator Campaigns", href: "/creators" },
    ],
    author: {
      name: "Marc Dupont",
      title: "Founder & CEO",
      imageSrc:
        "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb926800b148cd381512f1673eb18f28a30571423.jpeg?generation=1762752203226102&alt=media",
    },
  },
  {
    type: "logo",
    name: "AppCo",
    logoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F6d58c000f16b9b713993bdde97361b28c1f6127c.svg?generation=1762752200556991&alt=media",
  },
  {
    type: "logo",
    name: "CloudTech",
    logoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F0e391c459729bf0948faa8ff3628f605759c8521.svg?generation=1762752200602945&alt=media",
  },
  {
    type: "logo",
    name: "StartupX",
    logoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fa69f9f47cfd5844652cdcf26d821f55cc23a15a3.svg?generation=1762752200309893&alt=media",
  },
  {
    type: "logo",
    name: "DevTools",
    logoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F14805a6b143ec9d7a7e1cd84292d4a80c1cc9a35.svg?generation=1762752200437794&alt=media",
  },
  {
    type: "testimonial",
    companyName: "SaaS Platform",
    companyLogoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fac721fcf3ffd4c564e6a8d5c728177ff87f91946.svg?generation=1762752203219933&alt=media",
    quote:
      "Working with Cliqo feels like having an in-house content team. They understand our brand and deliver content that resonates with our audience.",
    highlightedText: "feels like having an in-house content team",
    products: [{ type: "analytics", label: "Product Reviews", href: "/creators" }],
    author: {
      name: "Emma Wilson",
      title: "VP Marketing",
      imageSrc:
        "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe46d3d499f2f020ab69b950c163d7f6b20b54a8c.jpeg?generation=1762752203231554&alt=media",
    },
  },
  {
    type: "testimonial",
    companyName: "E-commerce Brand",
    companyLogoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F853cee6ccc11138c4a41ca60a90f96613be47dfc.svg?generation=1762752203275638&alt=media",
    quote:
      "The ROI on our Cliqo campaigns has been incredible. Our UGC ads outperform our studio content by 3x on TikTok and Instagram.",
    highlightedText: "UGC ads outperform our studio content by 3x",
    products: [
      { type: "analytics", label: "Social Content", href: "/creators" },
    ],
    author: {
      name: "Alex Rodriguez",
      title: "Growth Lead",
      imageSrc:
        "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Ffab66210e77d7bb71c7a127c894ffad46477320e.jpeg?generation=1762752203260723&alt=media",
    },
  },
  {
    type: "logo",
    name: "FinTech",
    logoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F9dec0b2a25a34abda9187f3e59cc5c32df930d79.svg?generation=1762752200601765&alt=media",
  },
  {
    type: "logo",
    name: "AI Startup",
    logoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F64e5abe7f248cbced3b2a050427b2a6eca06b5ea.svg?generation=1762752200589355&alt=media",
  },
];

export function SocialProofGrid({
  title = "Trusted by startups and enterprises",
  subtitle = "Join 100,000+ customers who use our platform to take their marketing efforts to the next level.",
  ctaText = "Get started",
  ctaHref = "/register",
  items = DEFAULT_SOCIAL_PROOF_ITEMS,
}: SocialProofGridProps) {
  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] pt-20 pr-0 pb-0 pl-0 z-0">
        {/* Header */}
        <motion.div
          className="items-center flex flex-col text-center pt-0 pr-4 pb-0 pl-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2
            className="font-medium text-center text-neutral-50 text-3xl sm:text-4xl md:text-5xl leading-none tracking-tight max-w-lg"
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-center mt-3 text-neutral-400 text-base sm:text-lg leading-7 max-w-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
          <motion.div
            className="flex flex-wrap text-center mt-8 gap-2"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.a
              href={ctaHref}
              className="border block font-medium ml-auto mr-auto max-w-fit text-center bg-neutral-900 border-neutral-700 text-neutral-50 text-sm leading-5 py-2 px-5 rounded-lg hover:bg-neutral-800 transition-colors relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%", transition: { duration: 0.5 } }}
              />
              <span className="relative z-10">{ctaText}</span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Grid with diagonal cascade */}
        <div className="border-t mt-10 sm:mt-12 border-neutral-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-neutral-800 gap-px">
            {items.map((item, index) => (
              <div
                key={index}
                className={item.type === "testimonial" ? "col-span-1 sm:col-span-2" : "col-span-1"}
              >
                {item.type === "logo" ? (
                  <LogoCard item={item} index={index} />
                ) : (
                  <TestimonialCard item={item} index={index} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
