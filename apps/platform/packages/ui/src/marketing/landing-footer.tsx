"use client";

export interface FooterLink {
  label: string;
  href: string;
  icon?: {
    src: string;
    bgColor: string;
    textColor: string;
  };
  external?: boolean;
  externalIconSrc?: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  href: string;
  iconSrc: string;
  label: string;
}

export interface LandingFooterProps {
  logo: {
    src: string;
    href: string;
  };
  tagline: string;
  socialLinks: SocialLink[];
  sections: FooterSection[];
  statusHref?: string;
  statusText?: string;
  soc2Badge?: {
    src: string;
    href: string;
  };
  copyright: string;
}

// Default social icons from mockup
const DEFAULT_SOCIAL_ICONS = {
  x: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fda629eff42561dbd4db948e32de299819c00d7c8.svg?generation=1762752203488802&alt=media",
  linkedin:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Ffb82e1118d7b32ef5d388364a7aa61a00a92a469.svg?generation=1762752203509452&alt=media",
  github:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F7f88fc3c0f340fb8a4fd87a3ca76488cf00ba5c2.svg?generation=1762752203524474&alt=media",
  youtube:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F3d2d1243221426a2333b93b8f152e984e2e964b1.svg?generation=1762752203543498&alt=media",
};

// Default product icons
const PRODUCT_ICONS = {
  links: {
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F580b827e568515f5bdb91f1ea837e8a275ffe289.svg?generation=1762752203543212&alt=media",
    bgColor: "rgb(251, 146, 60)",
    textColor: "rgb(124, 45, 18)",
  },
  partners: {
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fa67b49490abba0a615afdbe6fb3978d7af5f9048.svg?generation=1762752203574401&alt=media",
    bgColor: "rgb(192, 132, 252)",
    textColor: "rgb(88, 28, 135)",
  },
  analytics: {
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F9e673aa43bbc8c4754db4e59e747425a35ec26dc.svg?generation=1762752203591907&alt=media",
    bgColor: "rgb(74, 222, 128)",
    textColor: "rgb(20, 83, 45)",
  },
  api: {
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F19d1ce6b15ad905d49bda283186caa7b602f6ff8.svg?generation=1762752203577683&alt=media",
    bgColor: "rgb(163, 163, 163)",
    textColor: "rgb(23, 23, 23)",
  },
};

const EXTERNAL_ICON =
  "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd475a305fc9952e5891021e3f0fb15d3feaf4213.svg?generation=1762752203594613&alt=media";

const CHEVRON_ICON =
  "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F54dd7dbd0168b40bcd5db77d8850b0f03a9ee227.svg?generation=1762752203651155&alt=media";

export const DEFAULT_FOOTER_DATA: LandingFooterProps = {
  logo: {
    src: "/assets/logo.svg",
    href: "https://cliqo.com/home",
  },
  tagline: "The modern link attribution platform.",
  socialLinks: [
    { href: "https://x.com/cliqo", iconSrc: DEFAULT_SOCIAL_ICONS.x, label: "X" },
    {
      href: "https://www.linkedin.com/company/cliqo",
      iconSrc: DEFAULT_SOCIAL_ICONS.linkedin,
      label: "LinkedIn",
    },
    {
      href: "https://github.com/cliqo/cliqo",
      iconSrc: DEFAULT_SOCIAL_ICONS.github,
      label: "GitHub",
    },
    {
      href: "https://www.youtube.com/@cliqo",
      iconSrc: DEFAULT_SOCIAL_ICONS.youtube,
      label: "YouTube",
    },
  ],
  sections: [
    {
      title: "Product",
      links: [
        { label: "Cliqo Links", href: "https://cliqo.com/links", icon: PRODUCT_ICONS.links },
        { label: "Cliqo Partners", href: "https://cliqo.com/partners", icon: PRODUCT_ICONS.partners },
        { label: "Cliqo Analytics", href: "https://cliqo.com/analytics", icon: PRODUCT_ICONS.analytics },
        {
          label: "Cliqo API",
          href: "https://cliqo.com/docs/api-reference/introduction",
          icon: PRODUCT_ICONS.api,
        },
        { label: "Cliqo Enterprise", href: "https://cliqo.com/enterprise" },
      ],
    },
    {
      title: "Solutions",
      links: [
        { label: "Marketing attribution", href: "https://cliqo.com/analytics" },
        { label: "Content creators", href: "https://cliqo.com/solutions/creators" },
        { label: "Affiliate management", href: "https://cliqo.com/partners" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Docs", href: "https://cliqo.com/docs/introduction" },
        { label: "Help Center", href: "https://cliqo.com/help" },
        { label: "Integrations", href: "https://cliqo.com/integrations" },
        { label: "Pricing", href: "https://cliqo.com/pricing" },
        {
          label: "Affiliates",
          href: "https://partners.cliqo.com/cliqo",
          external: true,
          externalIconSrc: EXTERNAL_ICON,
        },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "https://cliqo.com/about" },
        { label: "Blog", href: "https://cliqo.com/blog" },
        { label: "Careers", href: "https://cliqo.com/careers" },
        { label: "Changelog", href: "https://cliqo.com/changelog" },
        { label: "Customers", href: "https://cliqo.com/customers" },
        { label: "Brand", href: "https://cliqo.com/brand" },
        { label: "Contact", href: "https://cliqo.com/contact" },
        { label: "Privacy", href: "https://cliqo.com/privacy" },
      ],
    },
    {
      title: "Compare",
      links: [
        { label: "Bitly", href: "https://cliqo.com/compare/bitly", icon: PRODUCT_ICONS.links },
        { label: "Rebrandly", href: "https://cliqo.com/compare/rebrandly", icon: PRODUCT_ICONS.links },
        { label: "Short.io", href: "https://cliqo.com/compare/short", icon: PRODUCT_ICONS.links },
        { label: "Bl.ink", href: "https://cliqo.com/compare/blink", icon: PRODUCT_ICONS.links },
        {
          label: "Rewardful",
          href: "https://cliqo.com/blog/cliqo-vs-rewardful",
          icon: PRODUCT_ICONS.partners,
        },
        {
          label: "PartnerStack",
          href: "https://cliqo.com/help/article/migrating-from-partnerstack",
          icon: PRODUCT_ICONS.partners,
        },
        {
          label: "FirstPromoter",
          href: "https://cliqo.com/help/article/migrating-from-firstpromoter",
          icon: PRODUCT_ICONS.partners,
        },
        {
          label: "Tolt",
          href: "https://cliqo.com/help/article/migrating-from-tolt",
          icon: PRODUCT_ICONS.partners,
        },
      ],
    },
  ],
  statusHref: "https://status.cliqo.com/",
  statusText: "All systems operational",
  soc2Badge: {
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fa177a02a046d8c6d497f4d6af9f422ea5c8d93e5.svg?generation=1762752203651288&alt=media",
    href: "https://cliqo.com/blog/soc2",
  },
  copyright: "© 2025 Cliqo, Inc.",
};

function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <li className="list-none text-left">
      <a
        href={link.href}
        className="items-center flex text-left text-neutral-400 text-[14px] gap-[8px] leading-[20px] hover:text-neutral-200 transition-colors"
      >
        {link.icon && (
          <span
            className="items-center border flex justify-center text-left w-4 h-4 border-white/10 rounded-sm"
            style={{
              backgroundColor: link.icon.bgColor,
              color: link.icon.textColor,
            }}
          >
            <div className="fill-none overflow-hidden text-left align-middle w-[10px] h-[10px]">
              <img src={link.icon.src} className="block size-full" alt="" />
            </div>
          </span>
        )}
        {link.label}
        {link.external && link.externalIconSrc && (
          <div className="overflow-hidden text-left align-middle w-[14px] h-[14px] invert">
            <img src={link.externalIconSrc} className="block size-full" alt="" />
          </div>
        )}
      </a>
    </li>
  );
}

export function LandingFooter({
  logo = { src: "", href: "#" },
  tagline = "",
  socialLinks = [],
  sections = [],
  statusHref,
  statusText,
  soc2Badge,
  copyright = "",
}: LandingFooterProps) {
  // Group sections for layout
  const productSection = sections.find((s) => s.title === "Product");
  const solutionsSection = sections.find((s) => s.title === "Solutions");
  const resourcesSection = sections.find((s) => s.title === "Resources");
  const companySection = sections.find((s) => s.title === "Company");
  const compareSection = sections.find((s) => s.title === "Compare");

  return (
    <footer className="bg-neutral-950 pt-10 pr-4 pb-10 pl-4">
      <div className="ml-auto mr-auto max-w-[1080px]">
        {/* Top section */}
        <div
          className="grid gap-[48px]"
          style={{ gridTemplateColumns: "minmax(0px, 1fr) repeat(2, minmax(0px, 1fr))" }}
        >
          {/* Logo and tagline */}
          <div>
            <a href={logo.href} className="block w-fit">
              <div className="max-w-fit">
                <div className="fill-none overflow-hidden align-middle h-6 text-neutral-50 invert">
                  <img src={logo.src} className="block size-full" alt="Logo" />
                </div>
              </div>
            </a>
            <p className="mt-[16px] text-neutral-400 text-[14px] leading-[20px]">
              {tagline}
            </p>

            {/* Social links */}
            <div className="items-center flex mt-[16px] gap-[4px]">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="block p-1 rounded-[624.9375rem] hover:bg-neutral-800 transition-colors"
                  aria-label={social.label}
                >
                  <div className="overflow-hidden align-middle w-4 h-4 invert">
                    <img src={social.iconSrc} className="block size-full" alt="" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div
            className="grid gap-[16px]"
            style={{ gridTemplateColumns: "repeat(2, minmax(0px, 1fr))", gridArea: "auto / span 2" }}
          >
            <div style={{ gridTemplateColumns: "repeat(2, minmax(0px, 1fr))" }} className="grid">
              <div className="grid gap-[32px]">
                {/* Product section */}
                {productSection && (
                  <div>
                    <h3 className="font-medium text-neutral-50 text-[14px] leading-[20px]">
                      {productSection.title}
                    </h3>
                    <ul role="list" className="flex flex-col mt-[10px] gap-[14px]">
                      {productSection.links.map((link, index) => (
                        <FooterLinkItem key={index} link={link} />
                      ))}
                    </ul>
                  </div>
                )}

                {/* Solutions section */}
                {solutionsSection && (
                  <div>
                    <h3 className="font-medium text-neutral-50 text-[14px] leading-[20px]">
                      {solutionsSection.title}
                    </h3>
                    <ul role="list" className="flex flex-col mt-[10px] gap-[14px]">
                      {solutionsSection.links.map((link, index) => (
                        <FooterLinkItem key={index} link={link} />
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Resources section */}
              {resourcesSection && (
                <div>
                  <h3 className="font-medium text-neutral-50 text-[14px] leading-[20px]">
                    {resourcesSection.title}
                  </h3>
                  <ul role="list" className="flex flex-col mt-[10px] gap-[14px]">
                    {resourcesSection.links.map((link, index) => (
                      <FooterLinkItem key={index} link={link} />
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div style={{ gridTemplateColumns: "repeat(2, minmax(0px, 1fr))" }} className="grid">
              <div className="grid gap-[32px]">
                {/* Company section */}
                {companySection && (
                  <div>
                    <h3 className="font-medium text-neutral-50 text-[14px] leading-[20px]">
                      {companySection.title}
                    </h3>
                    <ul role="list" className="flex flex-col mt-[10px] gap-[14px]">
                      {companySection.links.map((link, index) => (
                        <FooterLinkItem key={index} link={link} />
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Compare section */}
              {compareSection && (
                <div>
                  <h3 className="font-medium text-neutral-50 text-[14px] leading-[20px]">
                    {compareSection.title}
                  </h3>
                  <ul role="list" className="flex flex-col mt-[10px] gap-[14px]">
                    {compareSection.links.map((link, index) => (
                      <FooterLinkItem key={index} link={link} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div
          className="items-center grid mt-[48px] gap-[32px]"
          style={{ gridTemplateColumns: "repeat(3, minmax(0px, 1fr))" }}
        >
          {/* Status */}
          {statusHref && statusText && (
            <a
              href={statusHref}
              className="items-center border flex max-w-fit bg-neutral-900 border-neutral-800 gap-[8px] pt-2 pr-[10px] pb-2 pl-2 rounded-lg hover:border-neutral-700 transition-colors"
            >
              <div className="relative w-2 h-2">
                <div className="items-center justify-center m-auto absolute w-2 h-2 left-0 top-0 right-0 bottom-0 bg-green-500 rounded-[624.9375rem]"></div>
                <div className="m-auto absolute w-2 h-2 left-0 top-0 right-0 bottom-0 bg-green-500 z-[10] rounded-[624.9375rem]"></div>
              </div>
              <p className="font-medium text-neutral-400 text-[12px] leading-[12px]">
                {statusText}
              </p>
            </a>
          )}

          {/* SOC2 Badge */}
          {soc2Badge && (
            <a href={soc2Badge.href} className="flex justify-center">
              <img
                alt="AICPA SOC 2 Type II Certified"
                src={soc2Badge.src}
                className="block max-w-full overflow-clip align-middle w-[63px] h-8 aspect-[auto_63_/_32] invert opacity-70"
              />
            </a>
          )}

          {/* Copyright */}
          <p className="text-right text-neutral-500 text-[12px] leading-[16px]">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
