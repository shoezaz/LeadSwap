"use client";

import { useState } from "react";

export interface ProductTabItem {
  id: string;
  label: string;
  iconSrc: string;
  iconBgColor: string;
  iconTextColor: string;
  screenshotSrc: string;
  title: string;
  description: string;
  learnMoreHref: string;
  learnMoreIconSrc?: string;
}

export interface LandingProductTabsProps {
  tabs: ProductTabItem[];
  defaultTab?: string;
}

// Default icons from the mockup
const DEFAULT_LEARN_MORE_ICONS = {
  links:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F803b86fb6c8c02d2e7391ded1e9603ccb408934e.svg?generation=1762752200288814&alt=media",
  analytics:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fa8005fda8abde57ca41590587ed0d396903825f0.svg?generation=1762752200275268&alt=media",
  partners:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F73a4ab6efd66425462db46eb116a040032059431.svg?generation=1762752200274607&alt=media",
};

// Tab edge SVGs
const TAB_EDGE_LEFT =
  "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd39c637a6da8893295ae9bfbd0ce9e74809e1d3e.svg?generation=1762752200125743&alt=media";
const TAB_EDGE_RIGHT =
  "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe6ef85842590a32ecf3e20a4ebd6932048b6c3f4.svg?generation=1762752200257455&alt=media";

export const DEFAULT_PRODUCT_TABS: ProductTabItem[] = [
  {
    id: "links",
    label: "Short Links",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fc86468da74586c4543b2051aa79689f147bc464f.svg?generation=1762752200112515&alt=media",
    iconBgColor: "rgb(251, 146, 60)",
    iconTextColor: "rgb(124, 45, 18)",
    screenshotSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd0b3e7ceb30ec73beeb3b0cabd860009720fe720.png?generation=1765503353872080&alt=media",
    title: "Short Links",
    description:
      "Create and manage short links at scale, with advanced features, folders, and role-based access control",
    learnMoreHref: "https://dub.co/links",
    learnMoreIconSrc: DEFAULT_LEARN_MORE_ICONS.links,
  },
  {
    id: "analytics",
    label: "Conversion Analytics",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F4f1249c47b27497cd4d5d6f248a5b50e1703d993.svg?generation=1762752200110500&alt=media",
    iconBgColor: "rgb(74, 222, 128)",
    iconTextColor: "rgb(20, 83, 45)",
    screenshotSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd0b3e7ceb30ec73beeb3b0cabd860009720fe720.png?generation=1765503353872080&alt=media",
    title: "Conversion Analytics",
    description:
      "Understand exactly how your marketing drives revenue with Dub's powerful attribution engine",
    learnMoreHref: "https://dub.co/analytics",
    learnMoreIconSrc: DEFAULT_LEARN_MORE_ICONS.analytics,
  },
  {
    id: "partners",
    label: "Affiliate Programs",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fdf77f9d85930c35abcdc60d3cbc15d743bb667d9.svg?generation=1762752200123739&alt=media",
    iconBgColor: "rgb(192, 132, 252)",
    iconTextColor: "rgb(88, 28, 135)",
    screenshotSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd0b3e7ceb30ec73beeb3b0cabd860009720fe720.png?generation=1765503353872080&alt=media",
    title: "Affiliate Programs",
    description:
      "All-in-one partner management platform for building profitable affiliate and referral programs",
    learnMoreHref: "https://dub.co/partners",
    learnMoreIconSrc: DEFAULT_LEARN_MORE_ICONS.partners,
  },
];

export function LandingProductTabs({
  tabs = DEFAULT_PRODUCT_TABS,
  defaultTab,
}: LandingProductTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabData = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="border-b overflow-clip relative bg-neutral-900 border-neutral-800 pt-0 pr-4 pb-0 pl-4">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] z-[0]">
        {/* Tab buttons - Cliqo pill style */}
        <div className="items-center flex justify-center ml-auto mr-auto relative py-6 max-w-[700px] z-[0]">
          <div
            role="tablist"
            className="items-center flex flex-wrap justify-center gap-2 bg-neutral-950 p-1.5 rounded-[2097150rem]"
          >
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={`items-center flex text-center whitespace-nowrap gap-2 py-2 px-4 rounded-[2097150rem] transition-colors ${
                    isActive
                      ? "bg-neutral-800 text-neutral-50"
                      : "bg-transparent text-neutral-400 hover:text-neutral-50"
                  }`}
                >
                  <span
                    className="items-center flex justify-center text-center w-4 h-4 rounded-sm"
                    style={{
                      backgroundColor: tab.iconBgColor,
                      color: tab.iconTextColor,
                    }}
                  >
                    <div className="fill-none overflow-hidden text-center align-middle w-[10px] h-[10px]">
                      <img src={tab.iconSrc} className="block size-full" alt="" />
                    </div>
                  </span>
                  <span className="block font-medium text-center text-[14px] leading-[14px]">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="ml-auto mr-auto mt-4 max-w-[940px] pt-0 pr-4 pb-0 pl-4">
          <div className="relative h-[580px]">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <div
                  key={tab.id}
                  role="tabpanel"
                  className={`absolute left-0 top-0 right-0 bottom-0 transition-opacity ${
                    isActive ? "" : "pointer-events-none opacity-0"
                  }`}
                >
                  {/* Screenshot container */}
                  <div
                    className={`border size-full border-neutral-800 rounded-2xl pt-3 pr-3 pb-0 pl-3 transition-transform ${
                      isActive ? "" : "translate-y-6"
                    }`}
                  >
                    <div className="border size-full overflow-hidden relative bg-neutral-950 border-neutral-700 rounded-xl">
                      <div className="relative w-full h-[1600px]">
                        <div className="size-full relative">
                          <div className="size-full">
                            <img
                              src={tab.screenshotSrc}
                              className="overflow-clip align-top w-[880px] h-[1600px] aspect-[auto_1760_/_3200]"
                              alt={tab.title}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description box - Cliqo style */}
                  <div
                    className={`absolute w-full bottom-10 pt-0 pr-4 pb-0 pl-4 transition-all ${
                      isActive ? "" : "scale-90 opacity-0"
                    }`}
                  >
                    <div className="items-center flex ml-auto mr-auto text-left w-full bg-neutral-800 border border-neutral-700 gap-4 max-w-[800px] p-5 rounded-2xl">
                      <div className="items-center flex justify-center text-left w-8 h-8 bg-neutral-700 shrink-0 rounded-lg">
                        {tab.learnMoreIconSrc && (
                          <div className="overflow-hidden text-left align-middle w-4 h-4 text-neutral-50">
                            <img
                              src={tab.learnMoreIconSrc}
                              className="block size-full"
                              alt=""
                            />
                          </div>
                        )}
                      </div>
                      <div className="grow text-left">
                        <span className="font-medium text-left text-neutral-50 text-[14px] leading-[20px]">
                          {tab.title}
                        </span>
                        <p className="text-left text-neutral-400 text-[12px] leading-[16px]">
                          {tab.description}
                        </p>
                      </div>
                      <a
                        href={tab.learnMoreHref}
                        className="block text-left whitespace-nowrap bg-neutral-50 text-neutral-950 text-[14px] leading-[20px] py-2 px-4 shrink-0 rounded-[2097150rem] hover:bg-neutral-200 transition-colors"
                      >
                        Learn more
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gradient overlay - subtle violet */}
        <div
          className="pointer-events-none absolute w-[1600px] h-[75%] left-[50%] bottom-0 blur-[200px] translate-x-[-50%] opacity-[0.05]"
          style={{
            backgroundImage:
              "conic-gradient(from -81deg, rgb(139, 92, 246), rgb(168, 85, 247) 120deg, rgb(192, 132, 252) 240deg, rgb(139, 92, 246))",
          }}
        ></div>
      </div>
    </div>
  );
}
