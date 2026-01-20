"use client";

import { useState, ReactNode } from "react";

export interface ProductBadgeConfig {
  iconSrc: string;
  bgColor: string;
  textColor: string;
  name: string;
}

export interface FeatureTab {
  id: string;
  label: string;
  content: ReactNode;
}

export interface DubFeatureSectionProps {
  badge: ProductBadgeConfig;
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  tabs?: FeatureTab[];
  defaultTab?: string;
  /** Static content if no tabs */
  staticContent?: ReactNode;
  /** Background color for content area */
  contentBgColor?: string;
}

// Default badges for each product
export const DUB_PRODUCT_BADGES = {
  links: {
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fc86468da74586c4543b2051aa79689f147bc464f.svg?generation=1762752200112515&alt=media",
    bgColor: "rgb(251, 146, 60)",
    textColor: "rgb(124, 45, 18)",
    name: "Dub Links",
  },
  analytics: {
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F4f1249c47b27497cd4d5d6f248a5b50e1703d993.svg?generation=1762752200110500&alt=media",
    bgColor: "rgb(74, 222, 128)",
    textColor: "rgb(20, 83, 45)",
    name: "Dub Analytics",
  },
  partners: {
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fdf77f9d85930c35abcdc60d3cbc15d743bb667d9.svg?generation=1762752200123739&alt=media",
    bgColor: "rgb(192, 132, 252)",
    textColor: "rgb(88, 28, 135)",
    name: "Dub Partners",
  },
};

function ProductBadge({ badge }: { badge: ProductBadgeConfig }) {
  return (
    <div className="items-center flex gap-[8px]">
      <span
        className="items-center border flex justify-center w-4 h-4 border-white/10 rounded-sm"
        style={{
          backgroundColor: badge.bgColor,
          color: badge.textColor,
        }}
      >
        <div className="fill-none overflow-hidden align-middle w-[10px] h-[10px]">
          <img src={badge.iconSrc} className="block size-full" alt="" />
        </div>
      </span>
      <span className="block font-medium text-neutral-400 text-[12px] leading-[16px]">
        {badge.name}
      </span>
    </div>
  );
}

function FeatureTabButton({
  tab,
  isActive,
  onClick,
}: {
  tab: FeatureTab;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={`font-medium text-center whitespace-nowrap text-[14px] leading-[20px] pt-4 pr-4 pb-4 pl-4 transition-colors ${
        isActive
          ? "border-b-2 border-neutral-50 text-neutral-50"
          : "text-neutral-500 hover:text-neutral-300"
      }`}
    >
      {tab.label}
    </button>
  );
}

export function DubFeatureSection({
  badge,
  title,
  description,
  ctaText,
  ctaHref,
  tabs,
  defaultTab,
  staticContent,
  contentBgColor = "bg-neutral-900",
}: DubFeatureSectionProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs?.[0]?.id);
  const activeTabData = tabs?.find((t) => t.id === activeTab);

  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] pt-20 pr-0 pb-10 pl-0 z-[0]">
        {/* Header */}
        <div className="flex flex-col pt-0 pr-10 pb-0 pl-10">
          <ProductBadge badge={badge} />

          <h2 className="font-normal mt-[12px] text-neutral-50/70 text-[48px] leading-[100%] tracking-[-0.03em] max-w-lg">
            {title}
          </h2>

          <p className="mt-[12px] text-neutral-400 text-[18px] leading-[28px] max-w-xl">
            {description}
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

        {/* Content area */}
        <div className={`border-b border-t mt-[80px] ${contentBgColor} border-neutral-800`}>
          <div className="flex flex-col">
            {/* Tabs */}
            {tabs && tabs.length > 0 && (
              <div className="border-b border-neutral-800">
                <div
                  role="tablist"
                  className="items-center flex justify-center overflow-auto gap-[8px] pt-0 pr-4 pb-0 pl-4"
                >
                  {tabs.map((tab) => (
                    <FeatureTabButton
                      key={tab.id}
                      tab={tab}
                      isActive={tab.id === activeTab}
                      onClick={() => setActiveTab(tab.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tab content */}
            <div className="items-center flex grow justify-center overflow-hidden h-[440px] pt-0 pr-8 pb-0 pl-8">
              <div className="size-full relative">
                {tabs && activeTabData ? (
                  <div
                    role="tabpanel"
                    className="items-center flex justify-center absolute left-0 top-0 right-0 bottom-0"
                  >
                    {activeTabData.content}
                  </div>
                ) : (
                  staticContent && (
                    <div className="items-center flex justify-center absolute left-0 top-0 right-0 bottom-0">
                      {staticContent}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pre-configured feature sections
export function DubLinksSection({
  tabs,
  defaultTab,
}: {
  tabs?: FeatureTab[];
  defaultTab?: string;
}) {
  return (
    <DubFeatureSection
      badge={DUB_PRODUCT_BADGES.links}
      title="It starts with a link"
      description="Create branded short links with superpowers: built-in QR codes, device/geo-targeting, A/B testing, deep links, and more."
      ctaText="Explore Links"
      ctaHref="https://dub.co/links"
      tabs={tabs}
      defaultTab={defaultTab}
    />
  );
}

export function DubAnalyticsSection({
  tabs,
  defaultTab,
}: {
  tabs?: FeatureTab[];
  defaultTab?: string;
}) {
  return (
    <DubFeatureSection
      badge={DUB_PRODUCT_BADGES.analytics}
      title="Understand your audience"
      description="Get detailed insights into your link performance with real-time analytics, conversion tracking, and customer insights."
      ctaText="Explore Analytics"
      ctaHref="https://dub.co/analytics"
      tabs={tabs}
      defaultTab={defaultTab}
    />
  );
}

export function DubPartnersSection({
  tabs,
  defaultTab,
}: {
  tabs?: FeatureTab[];
  defaultTab?: string;
}) {
  return (
    <DubFeatureSection
      badge={DUB_PRODUCT_BADGES.partners}
      title="Grow with partners"
      description="Build and scale your affiliate program with powerful tools for partner recruitment, tracking, and automated payouts."
      ctaText="Explore Partners"
      ctaHref="https://dub.co/partners"
      tabs={tabs}
      defaultTab={defaultTab}
    />
  );
}

// Example tab content component
export function FeatureScreenshot({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div role="presentation" className="size-full relative">
      <div className="size-full ml-auto mr-auto overflow-hidden max-w-[800px] pt-12 pr-5 pb-0 pl-5">
        <div className="w-full max-w-2xl">
          <div className="flex flex-col size-full justify-center relative">
            <div className="relative">
              <img
                src={src}
                alt={alt}
                className={`border rounded-t-xl overflow-clip align-middle w-full border-neutral-700 shadow-[rgba(0,0,0,0.3)_0px_4px_6px_-1px,_rgba(0,0,0,0.2)_0px_2px_4px_-2px] ${className}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
