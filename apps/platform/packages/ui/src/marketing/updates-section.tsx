"use client";

export interface UpdateItem {
  title: string;
  date: string;
  href: string;
  iconSrc?: string;
}

export interface UpdatesSectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  updates?: UpdateItem[];
  /** Maximum number of updates to display */
  maxItems?: number;
}

const DEFAULT_ICON =
  "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F88db69a092928877d3608ea9080d29ccd2f9a3ea.svg?generation=1762752203314855&alt=media";

export const DEFAULT_UPDATES: UpdateItem[] = [
  {
    title: "Celebrating $10 million in partner payouts",
    date: "Dec 10, 2025",
    href: "/blog/10m-payouts",
  },
  {
    title: "New partner stats + filtering analytics by group",
    date: "Nov 18, 2025",
    href: "/changelog/new-partner-stats",
  },
  {
    title: "Introducing Email Campaigns",
    date: "Nov 12, 2025",
    href: "/blog/introducing-email-campaigns",
  },
  {
    title: "Aggregated analytics for folders, tags, and domains",
    date: "Oct 30, 2025",
    href: "/changelog/aggregated-analytics",
  },
  {
    title: "Partner discount codes",
    date: "Oct 23, 2025",
    href: "/changelog/discount-codes",
  },
];

export function UpdatesSection({
  title = "We ship fast",
  description = "Always improving, adding features and functionality.",
  ctaText = "Full changelog",
  ctaHref = "/changelog",
  updates = DEFAULT_UPDATES,
  maxItems = 5,
}: UpdatesSectionProps) {
  const displayedUpdates = updates.slice(0, maxItems);

  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] z-[0]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left side - Title and CTA */}
          <div className="items-start flex flex-col text-left w-full pt-14 pr-10 pb-14 pl-10">
            <h2 className="italic font-medium text-left text-neutral-50 text-4xl leading-10">
              {title}
            </h2>
            <p className="text-left mt-3 text-neutral-400 text-lg leading-7">
              {description}
            </p>
            <a
              href={ctaHref}
              className="border block font-medium text-left whitespace-nowrap w-fit mt-8 bg-neutral-900 border-neutral-700 text-neutral-50 text-sm leading-4 py-3 px-4 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              {ctaText}
            </a>
          </div>

          {/* Right side - Updates list */}
          <ul className="border-l border-neutral-800">
            {displayedUpdates.map((update, index) => (
              <li key={index} className="list-none text-left">
                <a
                  href={update.href}
                  className="items-center block h-full overflow-hidden relative text-left pt-0 pr-2 pb-0 pl-2 hover:bg-neutral-900/50 transition-colors"
                >
                  <div
                    className="grid relative text-left"
                    style={{ gridTemplateColumns: "min-content minmax(0px, 1fr)" }}
                  >
                    <div className="relative text-left pt-12 pr-8 pb-12 pl-8">
                      {/* Timeline line */}
                      <div
                        className={`border-l absolute text-left left-[50%] border-neutral-800 pt-0 pr-8 pb-0 pl-0 translate-x-[-1px] ${
                          index === 0
                            ? "h-[50%] top-[50%]"
                            : index === displayedUpdates.length - 1
                              ? "h-[50%] top-0"
                              : "h-full top-0"
                        }`}
                      />
                      {/* Icon circle */}
                      <div className="border relative text-left w-12 h-12 bg-neutral-900 border-neutral-700 rounded-full flex items-center justify-center">
                        <div className="fill-none overflow-hidden text-left align-middle w-4 h-4 text-neutral-400">
                          {update.iconSrc ? (
                            <img src={update.iconSrc} className="block size-full invert" alt="" />
                          ) : (
                            <img src={DEFAULT_ICON} className="block size-full invert" alt="" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center text-left gap-1.5">
                      <span className="block font-medium text-left text-neutral-50">
                        {update.title}
                      </span>
                      <time className="block text-left text-neutral-500 text-sm leading-5">
                        {update.date}
                      </time>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
