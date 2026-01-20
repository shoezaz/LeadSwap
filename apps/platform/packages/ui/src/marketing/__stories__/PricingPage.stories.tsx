import type { Meta, StoryObj } from "@storybook/react";
import { PricingGrid, PricingHeroSection } from "../pricing-grid";
import { PricingCardV2 } from "../pricing-card-v2";
import { ProductToggle, DEFAULT_PRODUCT_OPTIONS } from "../product-toggle";
import { FreePlanBanner, DEFAULT_FREE_FEATURES } from "../free-plan-banner";

// Feature icons from the mockup
const FEATURE_ICONS = {
  clicks:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Ffcffa860a7629fbae97c172d89336c063f84dce4.svg?generation=1765503447625647&alt=media",
  links:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F926c665e922f352775035141a6278666e8f1451c.svg?generation=1765503447581240&alt=media",
  analytics:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F5cfd60f2ae1b7930d49b8d19c3fd96003e1c9ab2.svg?generation=1765503447605350&alt=media",
  advanced:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fbd6dc2da3834bb9bdea695de6c3e2dd807d3a55c.svg?generation=1765503447592728&alt=media",
  domain:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F8fc9f230563cc1c6d32ffb16a2b969ab9248e288.svg?generation=1765503447605805&alt=media",
  folders:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F2107da52131dcff6685e87dc6144f4435c8fbff8.svg?generation=1765503447606884&alt=media",
  deeplinks:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F714394b66bcf2fc4c85fb494c79d2733659eebfb.svg?generation=1765503447590027&alt=media",
  conversion:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F17daa116bb44b5ef47ea27ebaac6fbc73c5cb25e.svg?generation=1765503447605438&alt=media",
  abtest:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fdbb9cd230160c60a3cae4d19cad1ae133f0ba632.svg?generation=1765503447711096&alt=media",
  insights:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F52bef81909561d0148463841746969fa0a3beccc.svg?generation=1765503447724053&alt=media",
  webhooks:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fbfdb94f2fb08777f2cc882fe1e9fc6b8c2d026fb.svg?generation=1765503447728507&alt=media",
  slack:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F413e3a5e165745d97ce9a914172413d5e3043038.svg?generation=1765503447764762&alt=media",
  sso: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F185a442aaa6115304209f9a610ebdce8c4e4f153.svg?generation=1765503447738034&alt=media",
  audit:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F5f5d8b2960d4c5a79f7e3fc11bff266220abe5a4.svg?generation=1765503447756035&alt=media",
  sla: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F285367001dbbde83f7cca213fd2140bf852c6bb5.svg?generation=1765503447765680&alt=media",
  tailored:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F1944e1a379d2109342d15fa5ad031521a5a89e14.svg?generation=1765503447750889&alt=media",
  partners:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F45af9b60dad8837889c9d088b949ae4b0dc39530.svg?generation=1765503447749651&alt=media",
};

/**
 * Full Pricing Page - Composed from all pricing components
 * Exact replica of /pricing/App.tsx
 */
function PricingPageComponent() {
  return (
    <div
      className="text-black text-[16px] leading-[24px]"
      style={{
        fontFamily: 'Inter, "Inter Fallback", system-ui, sans-serif',
        width: "1440px",
        transform: "scale(1)",
        margin: "auto",
      }}
    >
      <div
        className="overflow-x-hidden overflow-y-auto bg-neutral-50 text-neutral-950"
        style={{ textDecoration: "rgb(10, 10, 10)" }}
      >
        <div className="relative bg-white z-[10]">
          {/* Hero Section */}
          <PricingHeroSection
            title="Flexible plans that grow with you"
            subtitle="Start for free, no credit card required. Upgrade when you need a plan that fits your needs."
            productToggle={
              <ProductToggle
                options={DEFAULT_PRODUCT_OPTIONS}
                defaultSelected="links"
              />
            }
          />

          {/* Pricing Grid */}
          <PricingGrid>
            {/* Pro */}
            <PricingCardV2
              name="Pro"
              monthlyPrice={25}
              description="For small teams or creators needing advanced link features"
              features={[
                { text: "50K tracked clicks/mo", iconSrc: FEATURE_ICONS.clicks },
                { text: "1K new links/mo", iconSrc: FEATURE_ICONS.links },
                {
                  text: "1-year analytics retention",
                  iconSrc: FEATURE_ICONS.analytics,
                  fillNone: true,
                },
                {
                  text: "Advanced link features",
                  iconSrc: FEATURE_ICONS.advanced,
                  hasTooltip: true,
                },
                {
                  text: "Free .link domain",
                  iconSrc: FEATURE_ICONS.domain,
                  hasTooltip: true,
                },
                {
                  text: "Link folders",
                  iconSrc: FEATURE_ICONS.folders,
                  hasTooltip: true,
                },
                {
                  text: "Deep links",
                  iconSrc: FEATURE_ICONS.deeplinks,
                  hasTooltip: true,
                },
              ]}
            />

            {/* Business - Popular */}
            <PricingCardV2
              name="Business"
              monthlyPrice={75}
              description="For fast-growing startups and businesses looking to scale"
              isPopular
              showPartnersFooter
              partnersFooterIcon={FEATURE_ICONS.partners}
              partnersFooterHref="https://dub.co/pricing/partners"
              features={[
                { text: "250K tracked clicks/mo", iconSrc: FEATURE_ICONS.clicks },
                { text: "10K new links/mo", iconSrc: FEATURE_ICONS.links },
                {
                  text: "3-year analytics retention",
                  iconSrc: FEATURE_ICONS.analytics,
                  fillNone: true,
                },
                {
                  text: "Conversion tracking",
                  iconSrc: FEATURE_ICONS.conversion,
                  hasTooltip: true,
                },
                {
                  text: "A/B testing",
                  iconSrc: FEATURE_ICONS.abtest,
                  hasTooltip: true,
                },
                {
                  text: "Customer insights",
                  iconSrc: FEATURE_ICONS.insights,
                  hasTooltip: true,
                },
                {
                  text: "Event webhooks",
                  iconSrc: FEATURE_ICONS.webhooks,
                  hasTooltip: true,
                },
              ]}
            />

            {/* Advanced */}
            <PricingCardV2
              name="Advanced"
              monthlyPrice={250}
              description="For hyperscalers needing higher usage quotas"
              showPartnersFooter
              partnersFooterIcon={FEATURE_ICONS.partners}
              partnersFooterHref="https://dub.co/pricing/partners"
              features={[
                { text: "1M tracked clicks/mo", iconSrc: FEATURE_ICONS.clicks },
                { text: "50K new links/mo", iconSrc: FEATURE_ICONS.links },
                {
                  text: "5-year analytics retention",
                  iconSrc: FEATURE_ICONS.analytics,
                  fillNone: true,
                },
                {
                  text: "Priority Slack support",
                  iconSrc: FEATURE_ICONS.slack,
                  fillNone: true,
                },
              ]}
            />

            {/* Enterprise */}
            <PricingCardV2
              name="Enterprise"
              monthlyPrice={null}
              customPriceText="Custom"
              description="For large organizations and governments with custom needs"
              showBillingToggle={false}
              showTailoredPricing
              tailoredPricingIcon={FEATURE_ICONS.tailored}
              ctaText="Get a demo"
              ctaHref="https://dub.co/enterprise"
              ctaSecondary
              isLast
              showPartnersFooter
              partnersFooterIcon={FEATURE_ICONS.partners}
              partnersFooterHref="https://dub.co/pricing/partners"
              features={[
                {
                  text: "Unlimited tracked clicks",
                  iconSrc: FEATURE_ICONS.clicks,
                },
                { text: "Unlimited new links", iconSrc: FEATURE_ICONS.links },
                {
                  text: "Unlimited analytics retention",
                  iconSrc: FEATURE_ICONS.analytics,
                  fillNone: true,
                },
                { text: "SSO/SAML", iconSrc: FEATURE_ICONS.sso },
                { text: "Audit logs", iconSrc: FEATURE_ICONS.audit },
                { text: "Custom SLA", iconSrc: FEATURE_ICONS.sla },
              ]}
            />
          </PricingGrid>

          {/* Free Plan Banner */}
          <FreePlanBanner features={DEFAULT_FREE_FEATURES} />
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof PricingPageComponent> = {
  title: "Marketing/Pages/Pricing",
  component: PricingPageComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PricingPageComponent>;

export const FullPage: Story = {};
