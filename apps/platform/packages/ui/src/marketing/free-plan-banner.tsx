"use client";

/**
 * FreePlanBanner - Exact replica from pricing mockup
 * Source: /pricing/App.tsx lines 522-600
 *
 * The "Free" plan banner shown below the main pricing cards.
 */

export interface FreePlanFeature {
  /** Feature text */
  text: string;
  /** Icon URL */
  iconSrc: string;
  /** Link URL (optional - makes the feature clickable with dotted underline) */
  href?: string;
  /** Whether icon uses fill-none class */
  fillNone?: boolean;
}

export interface FreePlanBannerProps {
  /** Plan name (default: "Free") */
  name?: string;
  /** Price text (default: "$0") */
  price?: string;
  /** Description (default: "free forever – the most generous free plan on the market") */
  description?: string;
  /** CTA button text (default: "Start for free") */
  ctaText?: string;
  /** CTA button href */
  ctaHref?: string;
  /** List of features to display */
  features: FreePlanFeature[];
}

export function FreePlanBanner({
  name = "Free",
  price = "$0",
  description = "free forever – the most generous free plan on the market",
  ctaText = "Start for free",
  ctaHref = "https://app.dub.co/register",
  features,
}: FreePlanBannerProps) {
  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] pt-10 pr-0 pb-0 pl-0 z-[0]">
        <div className="border-t bg-neutral-900 border-neutral-800">
          {/* Header */}
          <div className="items-center flex justify-between gap-[16px] pt-4 pr-6 pb-4 pl-6">
            <div>
              <h3 className="font-semibold text-neutral-50 text-[18px] leading-[28px]">
                {name}
              </h3>
              <p className="text-neutral-400">
                <strong className="font-medium text-neutral-200">
                  {price}
                </strong>{" "}
                {description}
              </p>
            </div>
            <a
              href={ctaHref}
              className="items-center flex font-medium justify-center text-center whitespace-nowrap w-fit bg-neutral-50 text-neutral-950 text-[14px] leading-[20px] py-2.5 px-6 rounded-[2097150rem] hover:bg-neutral-200 transition-colors"
            >
              {ctaText}
            </a>
          </div>

          {/* Features Grid */}
          <div
            className="border-t grid border-neutral-800 gap-[16px_24px] p-6"
            style={{ gridTemplateColumns: "repeat(4, minmax(0px, 1fr))" }}
          >
            {features.map((feature, index) => {
              const content = (
                <>
                  <div
                    className={`${feature.fillNone ? "fill-none " : ""}overflow-hidden align-middle w-4 h-4 shrink-[0] invert`}
                  >
                    <img src={feature.iconSrc} className="block size-full" alt="" />
                  </div>
                  <p className="text-[14px] leading-[20px]">
                    {feature.text}
                  </p>
                </>
              );

              if (feature.href) {
                return (
                  <a
                    key={index}
                    href={feature.href}
                    className="items-center flex underline text-neutral-400 gap-[8px] hover:text-neutral-200 transition-colors"
                    style={{ textDecorationStyle: "dotted" }}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div
                  key={index}
                  className="items-center flex text-neutral-400 gap-[8px]"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Default features from the mockup
export const DEFAULT_FREE_FEATURES: FreePlanFeature[] = [
  {
    text: "1K tracked clicks/mo",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fce18da2390f8ad3b2569a812f1e77d6e071c44b6.svg?generation=1765503447752606&alt=media",
  },
  {
    text: "Real-time analytics",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F3719479fda20a39e8a62b0b9b23da330b7518664.svg?generation=1765503447852115&alt=media",
    href: "https://dub.co/analytics",
  },
  {
    text: "1 user",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F16e76c0b6466f5a6449712acb0057bf03093c8f2.svg?generation=1765503447879885&alt=media",
  },
  {
    text: "Basic support",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F6e2b342f6647e09fb2ddd2fe4d78cb9d72ae771d.svg?generation=1765503447893809&alt=media",
  },
  {
    text: "25 new links/mo",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F4e5d899bb4eaaf731d1e977087f356a114aa7d51.svg?generation=1765503447885875&alt=media",
  },
  {
    text: "AI assistant",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F940f9266f3710aad7803b2027a9dd1825a394c93.svg?generation=1765503447878751&alt=media",
    href: "https://dub.co/help/article/dub-analytics#bonus-ask-ai-feature",
  },
  {
    text: "Link tags",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F6258486fde3060ffdb92aff8e657e88e272bb396.svg?generation=1765503447886731&alt=media",
    href: "https://dub.co/help/article/how-to-use-tags",
  },
  {
    text: "API access",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F24d10565054ff1672201c846af4cd8f7c9f3b6c2.svg?generation=1765503447897887&alt=media",
    href: "https://dub.co/docs/introduction",
  },
  {
    text: "3 custom domains",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F25e5d3c4da775a3caee50597d3e3627fa476cf65.svg?generation=1765503447908962&alt=media",
    href: "https://dub.co/help/article/how-to-add-custom-domain",
  },
  {
    text: "UTM templates",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fe0d552547d649e0be2e4047901682d8efb335cad.svg?generation=1765503447933042&alt=media",
    href: "https://dub.co/help/article/how-to-create-utm-templates",
  },
  {
    text: "30-day analytics retention",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F8c52a46eba51dc1250e587d1aa7b8093d560a58d.svg?generation=1765503447916479&alt=media",
    fillNone: true,
  },
  {
    text: "QR codes",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F7e3fdceea66dfe2ac76e3e3f2d1e48c2e19d0bdb.svg?generation=1765503447927641&alt=media",
    href: "https://dub.co/tools/qr-code",
  },
];
