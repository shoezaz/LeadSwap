"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface CaseStudyData {
  company: string;
  logoSrc: string;
  logoHeight?: string;
  backgroundSrc: string;
  title: string;
  ctaText: string;
  ctaHref: string;
  tag: string;
  gradientColor: string;
}

export interface CaseStudyCarouselProps {
  title?: string;
  description?: string;
  caseStudies?: CaseStudyData[];
}

// Asset URLs from mockup
const ASSETS = {
  arrowIcon:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F4991eef37102500e62ebfeb6f06f0f6f0638894e.svg?generation=1765503410100835&alt=media",
  gridPatternLeft:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F75d62e8f2e9213dd8f812ab7a8b2aec7c20e30fe.svg?generation=1765503410079554&alt=media",
  gridPatternRight:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F0fcff1224b2c006a3929579c8626388f02fa8c7f.svg?generation=1765503410074886&alt=media",
};

export const DEFAULT_CASE_STUDIES: CaseStudyData[] = [
  {
    company: "Startup A",
    logoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe5faf3dc27ca8b932938d887a3cd9019123de231.svg?generation=1762752200518576&alt=media",
    logoHeight: "h-6",
    backgroundSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F954998ad572ffcd211369999a99f000a37ba599d.png?generation=1765503410082767&alt=media",
    title: "How we helped a SaaS startup generate 2M views with UGC",
    ctaText: "Book a call",
    ctaHref: "/contact",
    tag: "SaaS",
    gradientColor: "rgb(0, 136, 255)",
  },
  {
    company: "Brand B",
    logoSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F3c12749a7b16c9afa6c9128dc54c5873cdf22ec3.svg?generation=1765503410121710&alt=media",
    logoHeight: "h-[75%]",
    backgroundSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F5f9b306cda1515f693d33d67b024c6104d17122f.jpg?generation=1765503410125322&alt=media",
    title: "50 UGC videos in 30 days: A D2C brand's content transformation",
    ctaText: "Book a call",
    ctaHref: "/contact",
    tag: "E-commerce",
    gradientColor: "rgb(130, 120, 250)",
  },
];

export const DEFAULT_CAROUSEL_PROPS: Omit<CaseStudyCarouselProps, "caseStudies"> = {
  title: "Brands that scaled with Cliqo",
  description:
    "See how startups and SaaS companies use Cliqo to produce high-converting UGC content at scale.",
};

function CaseStudyCard({
  caseStudy,
  isActive,
  direction,
}: {
  caseStudy: CaseStudyData;
  isActive: boolean;
  direction: number;
}) {
  return (
    <motion.div
      role="group"
      className="basis-[calc(100%-32px)] pt-0 pr-0 pb-0 pl-4 shrink-[0]"
      initial={false}
      animate={{
        scale: isActive ? 1 : 0.92,
        opacity: isActive ? 1 : 0.5,
        filter: isActive ? "blur(0px)" : "blur(2px)",
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="flex flex-col isolate overflow-hidden relative text-left w-full aspect-[4/3] sm:aspect-[2/1] bg-neutral-900 text-white p-6 sm:p-10 rounded-xl"
      >
        {/* Background image with Ken Burns effect */}
        <motion.div
          className="absolute text-left left-0 top-0 right-0 bottom-0"
          animate={isActive ? {
            scale: [1, 1.05],
          } : { scale: 1 }}
          transition={{
            duration: 10,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <img
            src={caseStudy.backgroundSrc}
            loading={isActive ? "eager" : "lazy"}
            decoding="async"
            className="block size-full max-w-full object-cover overflow-clip absolute text-left align-middle left-0 top-0 right-0 bottom-0 text-black/0 blur-[0px]"
            style={{ textDecoration: "rgba(0, 0, 0, 0)" }}
            alt=""
          />
        </motion.div>

        {/* Radial gradient overlay */}
        <div
          className="absolute text-left left-0 top-0 right-0 bottom-0"
          style={{ backgroundImage: "radial-gradient(100% 100%, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6))" }}
        ></div>

        {/* Color gradient overlay */}
        <div
          className="absolute text-left left-0 top-0 right-0 bottom-0 opacity-[0.9]"
          style={{
            backgroundImage: `linear-gradient(to top, ${caseStudy.gradientColor}, rgba(255, 255, 255, 0) 85%)`,
            textDecoration: caseStudy.gradientColor,
          }}
        ></div>

        {/* Content with staggered entrance */}
        <div className="flex flex-col h-full justify-between relative text-left">
          {/* Spacer for top */}
          <div className="h-8 shrink-[0]"></div>

          {/* Title and CTA */}
          <div className="text-left">
            <AnimatePresence mode="wait">
              {isActive && caseStudy.title && (
                <motion.div
                  key={caseStudy.company + "-title"}
                  className="relative text-left text-xl sm:text-2xl md:text-[36px] leading-tight md:leading-[40px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {caseStudy.title}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isActive && caseStudy.ctaText && (
                <motion.a
                  key={caseStudy.company + "-cta"}
                  href={caseStudy.ctaHref}
                  className="items-center inline-flex text-left mt-4 sm:mt-8 gap-1 text-sm sm:text-base group"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 5 }}
                >
                  {caseStudy.ctaText}
                  <motion.div
                    className="overflow-hidden text-left align-middle w-4 h-4"
                    whileHover={{ x: 3 }}
                  >
                    <img
                      src={ASSETS.arrowIcon}
                      loading="lazy"
                      decoding="async"
                      className="block size-full"
                      alt=""
                    />
                  </motion.div>
                </motion.a>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CarouselButton({
  company,
  isActive,
  onClick,
}: {
  company: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      className="isolate text-center bg-transparent p-[6px] rounded-[2097150rem] relative"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="relative text-center pt-2 pr-5 pb-2 pl-5 rounded-[2097150rem]"
        animate={{
          backgroundColor: isActive ? "rgb(250, 250, 250)" : "rgb(38, 38, 38)",
          color: isActive ? "rgb(10, 10, 10)" : "rgb(250, 250, 250)",
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-sm font-medium">{company}</span>
      </motion.div>
    </motion.button>
  );
}

export function CaseStudyCarousel({
  title = DEFAULT_CAROUSEL_PROPS.title,
  description = DEFAULT_CAROUSEL_PROPS.description,
  caseStudies = DEFAULT_CASE_STUDIES,
}: CaseStudyCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNavClick = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % caseStudies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [caseStudies.length]);

  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] pt-24 pr-0 pb-0 pl-0 z-[0]">
        {/* Decorative grid patterns with fade-in */}
        <motion.div
          className="pointer-events-none absolute w-[2280px] left-[50%] top-0 bottom-0 translate-x-[-50%]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="pointer-events-none absolute left-[580px] top-0 right-[580px] bottom-0">
            <div
              className="overflow-hidden pointer-events-none absolute right-full align-middle w-[600px] h-[calc(100%-64px)] top-[50%] text-neutral-50/10 translate-y-[-50%]"
            >
              <img
                src={ASSETS.gridPatternLeft}
                loading="lazy"
                decoding="async"
                className="block size-full invert opacity-30"
                alt=""
              />
            </div>
            <div
              className="left-full overflow-hidden pointer-events-none absolute align-middle w-[600px] h-[calc(100%-64px)] top-[50%] text-neutral-50/10 translate-x-3 translate-y-[-50%]"
            >
              <img
                src={ASSETS.gridPatternRight}
                loading="lazy"
                decoding="async"
                className="block size-full invert opacity-30"
                alt=""
              />
            </div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          className="ml-auto mr-auto relative text-center w-full max-w-[640px] pt-0 pr-4 pb-0 pl-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h2
            className="font-normal text-center text-neutral-50/70 text-3xl sm:text-4xl md:text-[48px] leading-[100%] tracking-[-0.03em]"
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-center mt-3 text-neutral-400 text-base sm:text-lg leading-7"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {description}
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          className="border-t relative mt-[48px] bg-neutral-900 border-neutral-800 pt-8 pr-4 pb-8 pl-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div role="region" className="relative">
            {/* Slides with depth effect */}
            <div className="overflow-hidden">
              <motion.div
                className="flex ml-[-16px]"
                animate={{ x: `-${activeIndex * 100}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {caseStudies.map((caseStudy, index) => (
                  <CaseStudyCard
                    key={index}
                    caseStudy={caseStudy}
                    isActive={index === activeIndex}
                    direction={direction}
                  />
                ))}
              </motion.div>
            </div>

            {/* Navigation buttons with smooth transitions */}
            <div className="ml-auto mr-auto w-fit mt-[32px] pt-0 pr-4 pb-0 pl-4">
              <div className="items-center flex flex-wrap justify-center gap-[16px]">
                {caseStudies.map((caseStudy, index) => (
                  <CarouselButton
                    key={index}
                    company={caseStudy.company}
                    isActive={index === activeIndex}
                    onClick={() => handleNavClick(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
