import type { Meta, StoryObj } from "@storybook/react";
import {
  DubFeatureSection,
  DubLinksSection,
  DubAnalyticsSection,
  DubPartnersSection,
  DUB_PRODUCT_BADGES,
  FeatureScreenshot,
} from "../dub-feature-section";

const meta: Meta<typeof DubFeatureSection> = {
  title: "Marketing/Landing/DubFeatureSection",
  component: DubFeatureSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DubFeatureSection>;

// Sample screenshot for demos
const SAMPLE_SCREENSHOT =
  "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd0b3e7ceb30ec73beeb3b0cabd860009720fe720.png?generation=1765503353872080&alt=media";

export const Links: Story = {
  args: {
    badge: DUB_PRODUCT_BADGES.links,
    title: "It starts with a link",
    description:
      "Create branded short links with superpowers: built-in QR codes, device/geo-targeting, A/B testing, deep links, and more.",
    ctaText: "Explore Links",
    ctaHref: "https://dub.co/links",
    tabs: [
      {
        id: "domains",
        label: "Custom Domains",
        content: (
          <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Custom Domains" />
        ),
      },
      {
        id: "features",
        label: "Advanced Features",
        content: (
          <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Advanced Features" />
        ),
      },
      {
        id: "qr",
        label: "QR Codes",
        content: <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="QR Codes" />,
      },
    ],
    defaultTab: "domains",
  },
};

export const Analytics: Story = {
  args: {
    badge: DUB_PRODUCT_BADGES.analytics,
    title: "Understand your audience",
    description:
      "Get detailed insights into your link performance with real-time analytics, conversion tracking, and customer insights.",
    ctaText: "Explore Analytics",
    ctaHref: "https://dub.co/analytics",
    tabs: [
      {
        id: "conversion",
        label: "Conversion Tracking",
        content: (
          <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Conversion Tracking" />
        ),
      },
      {
        id: "insights",
        label: "Customer Insights",
        content: (
          <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Customer Insights" />
        ),
      },
    ],
    defaultTab: "conversion",
  },
};

export const Partners: Story = {
  args: {
    badge: DUB_PRODUCT_BADGES.partners,
    title: "Grow with partners",
    description:
      "Build and scale your affiliate program with powerful tools for partner recruitment, tracking, and automated payouts.",
    ctaText: "Explore Partners",
    ctaHref: "https://dub.co/partners",
    tabs: [
      {
        id: "recruit",
        label: "Recruit",
        content: <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Recruit" />,
      },
      {
        id: "track",
        label: "Track",
        content: <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Track" />,
      },
      {
        id: "reward",
        label: "Reward",
        content: <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Reward" />,
      },
    ],
    defaultTab: "recruit",
  },
};

export const WithoutTabs: Story = {
  args: {
    badge: DUB_PRODUCT_BADGES.links,
    title: "Simple feature section",
    description: "A feature section without tabs, just showing static content.",
    ctaText: "Learn more",
    ctaHref: "#",
    staticContent: (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-neutral-500 text-lg">Static content area</p>
          <p className="text-neutral-400 text-sm mt-2">
            This can contain any React content
          </p>
        </div>
      </div>
    ),
  },
};

// Pre-configured section stories
export const DubLinksSectionStory: StoryObj<typeof DubLinksSection> = {
  render: () => (
    <DubLinksSection
      tabs={[
        {
          id: "domains",
          label: "Custom Domains",
          content: (
            <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Custom Domains" />
          ),
        },
        {
          id: "features",
          label: "Advanced Features",
          content: (
            <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Advanced Features" />
          ),
        },
        {
          id: "qr",
          label: "QR Codes",
          content: <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="QR Codes" />,
        },
      ]}
      defaultTab="domains"
    />
  ),
};

export const DubAnalyticsSectionStory: StoryObj<typeof DubAnalyticsSection> = {
  render: () => (
    <DubAnalyticsSection
      tabs={[
        {
          id: "conversion",
          label: "Conversion Tracking",
          content: (
            <FeatureScreenshot
              src={SAMPLE_SCREENSHOT}
              alt="Conversion Tracking"
            />
          ),
        },
        {
          id: "insights",
          label: "Customer Insights",
          content: (
            <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Customer Insights" />
          ),
        },
      ]}
      defaultTab="conversion"
    />
  ),
};

export const DubPartnersSectionStory: StoryObj<typeof DubPartnersSection> = {
  render: () => (
    <DubPartnersSection
      tabs={[
        {
          id: "recruit",
          label: "Recruit",
          content: <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Recruit" />,
        },
        {
          id: "track",
          label: "Track",
          content: <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Track" />,
        },
        {
          id: "reward",
          label: "Reward",
          content: <FeatureScreenshot src={SAMPLE_SCREENSHOT} alt="Reward" />,
        },
      ]}
      defaultTab="recruit"
    />
  ),
};
