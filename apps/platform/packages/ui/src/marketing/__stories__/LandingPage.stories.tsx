import type { Meta, StoryObj } from "@storybook/react";
import { LandingHero } from "../landing-hero";
import { LandingProductTabs, DEFAULT_PRODUCT_TABS } from "../landing-product-tabs";
import { CustomerLogosAnimated, DEFAULT_LOGO_PAIRS } from "../customer-logos-animated";
import { LandingTestimonial, DEFAULT_TESTIMONIAL } from "../landing-testimonial";
import { LandingIntegrations, DEFAULT_INTEGRATIONS_PROPS } from "../landing-integrations";
import { LandingFooter, DEFAULT_FOOTER_DATA } from "../landing-footer";

/**
 * Full Landing Page - Composed from all landing components
 * Replica of /main/App.tsx
 */
function LandingPageComponent() {
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
          <LandingHero
            announcement={{
              text: "Celebrating $10M partner payouts on Dub",
              linkText: "Read more",
              href: "https://dub.co/blog/10m-payouts",
            }}
            title="Turn clicks into revenue"
            subtitle="Dub is the modern link attribution platform for short links, conversion tracking, and affiliate programs."
            primaryCta={{
              text: "Start for free",
              href: "https://app.dub.co/register",
            }}
            secondaryCta={{
              text: "Get a demo",
              href: "https://dub.co/enterprise",
            }}
          />

          {/* Product Tabs */}
          <LandingProductTabs tabs={DEFAULT_PRODUCT_TABS} defaultTab="links" />

          {/* Customer Logos */}
          <CustomerLogosAnimated
            logos={DEFAULT_LOGO_PAIRS}
            columns={5}
            flipInterval={3000}
            customersHref="https://dub.co/customers"
          />

          {/* Testimonial */}
          <LandingTestimonial {...DEFAULT_TESTIMONIAL} />

          {/* Integrations */}
          <LandingIntegrations {...DEFAULT_INTEGRATIONS_PROPS} />

          {/* Footer */}
          <LandingFooter {...DEFAULT_FOOTER_DATA} />
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof LandingPageComponent> = {
  title: "Marketing/Pages/Landing",
  component: LandingPageComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof LandingPageComponent>;

export const FullPage: Story = {};
