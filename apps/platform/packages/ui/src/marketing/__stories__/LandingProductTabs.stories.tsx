import type { Meta, StoryObj } from "@storybook/react";
import { LandingProductTabs, DEFAULT_PRODUCT_TABS } from "../landing-product-tabs";

const meta: Meta<typeof LandingProductTabs> = {
  title: "Marketing/Landing/LandingProductTabs",
  component: LandingProductTabs,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LandingProductTabs>;

export const Default: Story = {
  args: {
    tabs: DEFAULT_PRODUCT_TABS,
    defaultTab: "links",
  },
};

export const AnalyticsTab: Story = {
  args: {
    tabs: DEFAULT_PRODUCT_TABS,
    defaultTab: "analytics",
  },
};

export const PartnersTab: Story = {
  args: {
    tabs: DEFAULT_PRODUCT_TABS,
    defaultTab: "partners",
  },
};

export const CustomTabs: Story = {
  args: {
    tabs: [
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
        description: "Create branded short links with analytics",
        learnMoreHref: "#",
      },
      {
        id: "qr",
        label: "QR Codes",
        iconSrc:
          "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F4f1249c47b27497cd4d5d6f248a5b50e1703d993.svg?generation=1762752200110500&alt=media",
        iconBgColor: "rgb(96, 165, 250)",
        iconTextColor: "rgb(30, 58, 138)",
        screenshotSrc:
          "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd0b3e7ceb30ec73beeb3b0cabd860009720fe720.png?generation=1765503353872080&alt=media",
        title: "QR Codes",
        description: "Generate dynamic QR codes with your branding",
        learnMoreHref: "#",
      },
    ],
    defaultTab: "links",
  },
};
