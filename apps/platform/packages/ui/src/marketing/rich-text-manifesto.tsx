"use client";

import { ReactNode } from "react";

export interface InlineProductIcon {
  href: string;
  iconSrc: string;
  bgColor: string;
  textColor: string;
  glowColor: string;
  rotation?: string;
  translateY?: string;
}

export interface FloatingLinkCard {
  domain: string;
  clicks: string;
  leads: string;
  sales: string;
  rotation: string;
  position: { top?: string; right?: string; left?: string };
}

export interface FloatingIcon {
  iconSrc: string;
  rotation: string;
  position: { top?: string; right?: string; left?: string };
}

export interface RichTextManifestoProps {
  paragraphs: ReactNode[];
  productIcons?: {
    links: InlineProductIcon;
    analytics: InlineProductIcon;
    partners: InlineProductIcon;
  };
  backgroundPatternSrc?: string;
  floatingCards?: FloatingLinkCard[];
  floatingIcons?: FloatingIcon[];
  screenshotSrc?: string;
}

// Default inline icons from the mockup
const DEFAULT_PRODUCT_ICONS = {
  links: {
    href: "https://dub.co/links",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fadd495da7aaed41aa1026839dd5731132db66463.svg?generation=1762752200611947&alt=media",
    bgColor: "rgb(251, 146, 60)",
    textColor: "rgb(124, 45, 18)",
    glowColor: "rgb(249, 115, 22)",
    rotation: "rotate-10",
    translateY: "translate-y-[-6px]",
  },
  analytics: {
    href: "https://dub.co/analytics",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F515ab7f9db176d4d563a211b35b9481cd7c043f5.svg?generation=1762752200643485&alt=media",
    bgColor: "rgb(74, 222, 128)",
    textColor: "rgb(20, 83, 45)",
    glowColor: "rgb(74, 222, 128)",
    translateY: "translate-y-[-2px]",
  },
  partners: {
    href: "https://dub.co/partners",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F4c6e83160131915a54ce43fff90529821a23f33b.svg?generation=1762752200670301&alt=media",
    bgColor: "rgb(192, 132, 252)",
    textColor: "rgb(88, 28, 135)",
    glowColor: "rgb(147, 51, 234)",
    translateY: "translate-y-[-2px]",
  },
};

const DEFAULT_BACKGROUND_PATTERN =
  "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fc69ae35a98d4a0901b409c86f4f84cbbfedfccdf.svg?generation=1762752200700009&alt=media";

// Stat icons
const STAT_ICONS = {
  clicks:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F6e72d8c0c9d582df19f830a86132fc1a9a8660ce.svg?generation=1762752200754002&alt=media",
  leads:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F1ea81b866d33311e5ceabb341300498b3403589e.svg?generation=1762752200754161&alt=media",
  sales:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F3b982e7a63c6387d895bd2d97280e3ef2773b84c.svg?generation=1762752200764604&alt=media",
  link: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F1678b403d1787799bcacd7ab14eb7d58357561fb.svg?generation=1762752200732560&alt=media",
};

export function InlineProductBadge({ icon }: { icon: InlineProductIcon }) {
  return (
    <a
      href={icon.href}
      className="inline-block relative"
      style={{ textDecoration: "rgb(38, 38, 38)" }}
    >
      <span
        className="block mix-blend-screen pointer-events-none absolute w-56 h-24 left-[50%] top-[50%] saturate-[1.25] translate-x-[-50%] translate-y-[-50%] opacity-0"
        style={{
          backgroundImage: `radial-gradient(closest-side, ${icon.glowColor}, rgb(0, 0, 0))`,
          color: icon.glowColor,
          textDecoration: icon.glowColor,
        }}
      ></span>
      <span
        className={`items-center border inline-flex justify-center w-7 h-7 ml-[2px] mr-[2px] border-black/5 drop-shadow-[rgba(0,0,0,0.06)] ${icon.translateY || ""} ${icon.rotation || ""} rounded-lg`}
        style={{
          backgroundColor: icon.bgColor,
          color: icon.textColor,
          textDecoration: icon.textColor,
        }}
      >
        <span className="fill-none overflow-hidden align-middle w-[18px] h-[18px]">
          <img src={icon.iconSrc} className="block size-full" alt="" />
        </span>
      </span>
    </a>
  );
}

function FloatingLinkCardComponent({ card }: { card: FloatingLinkCard }) {
  return (
    <div
      className={`pointer-events-none absolute w-3xs ${card.rotation}`}
      style={{
        top: card.position.top,
        right: card.position.right,
        left: card.position.left,
      }}
    >
      <div className="items-center border flex justify-between pointer-events-none relative w-full bg-neutral-900 border-neutral-800 text-[10px] gap-[16px] p-3 rounded-lg">
        <div className="items-center flex pointer-events-none gap-[6px]">
          <div
            className="border pointer-events-none border-neutral-700 p-1 shrink-[0] rounded-[624.9375rem]"
            style={{
              backgroundImage:
                "linear-gradient(to top, rgb(38, 38, 38), rgba(38, 38, 38, 0))",
            }}
          >
            <div className="fill-none overflow-hidden pointer-events-none align-middle w-3 h-3 invert">
              <img src={STAT_ICONS.link} className="block size-full" alt="" />
            </div>
          </div>
          <div className="font-medium truncate pointer-events-none text-neutral-50">
            {card.domain}
          </div>
        </div>
        <span className="items-center border flex pointer-events-none bg-neutral-800 border-neutral-700 text-[8px] gap-[8px] p-1 rounded-md">
          <div className="items-center flex justify-center pointer-events-none gap-[2px]">
            <div className="overflow-hidden pointer-events-none align-middle w-[10px] h-[10px] text-blue-400">
              <img src={STAT_ICONS.clicks} className="block size-full" alt="" />
            </div>
            <div className="items-center flex font-medium pointer-events-none whitespace-nowrap text-neutral-300 leading-[8px]">
              {card.clicks}
            </div>
          </div>
          <div className="items-center flex justify-center pointer-events-none gap-[2px]">
            <div className="overflow-hidden pointer-events-none align-middle w-[10px] h-[10px] text-purple-400">
              <img src={STAT_ICONS.leads} className="block size-full" alt="" />
            </div>
            <div className="items-center flex font-medium pointer-events-none whitespace-nowrap text-neutral-300 leading-[8px]">
              {card.leads}
            </div>
          </div>
          <div className="items-center flex justify-center pointer-events-none gap-[2px]">
            <div className="overflow-hidden pointer-events-none align-middle w-[10px] h-[10px] text-teal-400">
              <img src={STAT_ICONS.sales} className="block size-full" alt="" />
            </div>
            <div className="items-center flex font-medium pointer-events-none whitespace-nowrap text-neutral-300 leading-[8px]">
              {card.sales}
            </div>
          </div>
        </span>
      </div>
    </div>
  );
}

function FloatingIconComponent({ icon }: { icon: FloatingIcon }) {
  return (
    <div
      className={`items-center border flex justify-center pointer-events-none absolute w-12 h-12 bg-neutral-900 border-neutral-800 text-neutral-400 ${icon.rotation} rounded-xl`}
      style={{
        top: icon.position.top,
        right: icon.position.right,
        left: icon.position.left,
      }}
    >
      <div className="overflow-hidden pointer-events-none align-middle w-5 h-5 invert">
        <img src={icon.iconSrc} className="block size-full" alt="" />
      </div>
    </div>
  );
}

export const DEFAULT_FLOATING_CARDS: FloatingLinkCard[] = [
  {
    domain: "d.to/register",
    clicks: "254K",
    leads: "8K",
    sales: "3K",
    rotation: "-rotate-3",
    position: { top: "51%", right: "48px" },
  },
  {
    domain: "acme.link/try",
    clicks: "154K",
    leads: "9.7K",
    sales: "4.8K",
    rotation: "-rotate-10",
    position: { top: "45%", right: "32px" },
  },
  {
    domain: "acme.link",
    clicks: "254K",
    leads: "8K",
    sales: "3K",
    rotation: "-rotate-5",
    position: { top: "40%", right: "64px" },
  },
];

export const DEFAULT_FLOATING_ICONS: FloatingIcon[] = [
  {
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F24d0a78d1cb3977d24fbdd0a84095a80e99234f6.svg?generation=1762752200735841&alt=media",
    rotation: "-rotate-15",
    position: { top: "30%", right: "160px" },
  },
  {
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F06f9e19e34c4bebd53e6e37b4617c28567b94c61.svg?generation=1762752200750502&alt=media",
    rotation: "rotate-10",
    position: { top: "25%", right: "80px" },
  },
  {
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F775bc85b957e405447bfdc30fc5565468d0bdbe1.svg?generation=1762752200827482&alt=media",
    rotation: "-rotate-10",
    position: { top: "20%", left: "80px" },
  },
  {
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F6679e746a9b6dd0d3c664db74aaf74659591cb82.svg?generation=1762752200818418&alt=media",
    rotation: "rotate-15",
    position: { top: "25%", left: "160px" },
  },
];

export function RichTextManifesto({
  paragraphs,
  productIcons = DEFAULT_PRODUCT_ICONS,
  backgroundPatternSrc = DEFAULT_BACKGROUND_PATTERN,
  floatingCards = DEFAULT_FLOATING_CARDS,
  floatingIcons = DEFAULT_FLOATING_ICONS,
  screenshotSrc,
}: RichTextManifestoProps) {
  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 text-[18px] leading-[28px] max-w-[1080px] pt-40 pr-4 pb-32 pl-4 z-[0]">
        {/* Main content */}
        <div>
          <div className="isolate ml-auto mr-auto relative bg-neutral-950 max-w-[530px]">
            <div className="text-neutral-200 text-[30px] leading-[41.25px]">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className={index > 0 ? "mt-[32px]" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Background pattern */}
        <div className="mix-blend-lighten pointer-events-none absolute left-4 top-16 right-4 bottom-16 opacity-20">
          <div className="size-full overflow-hidden pointer-events-none absolute align-middle left-0 top-0 right-0 bottom-0">
            <img src={backgroundPatternSrc} className="block size-full invert" alt="" />
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="overflow-hidden pointer-events-none absolute left-0 top-0 right-0 bottom-0">
          <div className="pointer-events-none absolute left-0 top-0 right-0 bottom-0">
            <div className="flex pointer-events-none absolute left-0 top-0 right-0 bottom-0">
              {/* Left side floating elements */}
              <div className="grow h-full pointer-events-none relative">
                {floatingIcons
                  .filter((icon) => icon.position.right)
                  .map((icon, index) => (
                    <FloatingIconComponent key={`right-icon-${index}`} icon={icon} />
                  ))}
                {floatingCards.map((card, index) => (
                  <FloatingLinkCardComponent key={`card-${index}`} card={card} />
                ))}
              </div>

              {/* Center spacer */}
              <div className="pointer-events-none w-full max-w-[530px] shrink-[0]"></div>

              {/* Right side floating elements */}
              <div className="grow h-full pointer-events-none relative">
                {floatingIcons
                  .filter((icon) => icon.position.left)
                  .map((icon, index) => (
                    <FloatingIconComponent key={`left-icon-${index}`} icon={icon} />
                  ))}
                {screenshotSrc && (
                  <img
                    alt="Link Builder screenshot"
                    src={screenshotSrc}
                    className="border block overflow-clip pointer-events-none absolute align-middle w-[260px] left-8 top-[35%] aspect-[auto_260_/_240] border-neutral-700 rotate-7 rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component to create the default manifesto text with inline icons
export function DefaultManifestoContent() {
  return (
    <>
      <p>Marketing isn&apos;t just about clicks. &nbsp; It&apos;s about outcomes.</p>
      <p className="mt-[32px]">
        Dub is the modern link attribution platform that unifies short links{" "}
        <InlineProductBadge icon={DEFAULT_PRODUCT_ICONS.links} />
        real-time analytics <InlineProductBadge icon={DEFAULT_PRODUCT_ICONS.analytics} /> and
        affiliate programs <InlineProductBadge icon={DEFAULT_PRODUCT_ICONS.partners} /> – all in one
        place.
      </p>
      <p className="mt-[32px]">
        It&apos;s fast. It&apos;s reliable. It&apos;s beautiful. And it scales with you.
      </p>
      <p className="mt-[32px]">
        Because you deserve more than vanity metrics. You deserve clarity.
      </p>
    </>
  );
}
