import type { Meta, StoryObj } from "@storybook/react";
import { FreePlanBanner, DEFAULT_FREE_FEATURES } from "../free-plan-banner";

const meta: Meta<typeof FreePlanBanner> = {
  title: "Marketing/Pricing/FreePlanBanner",
  component: FreePlanBanner,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FreePlanBanner>;

export const Default: Story = {
  args: {
    name: "Free",
    price: "$0",
    description: "free forever – the most generous free plan on the market",
    ctaText: "Start for free",
    ctaHref: "https://app.dub.co/register",
    features: DEFAULT_FREE_FEATURES,
  },
};

export const CustomFeatures: Story = {
  args: {
    name: "Starter",
    price: "$0",
    description: "perfect for getting started",
    ctaText: "Get started",
    features: [
      {
        text: "500 tracked clicks/mo",
        iconSrc: DEFAULT_FREE_FEATURES[0].iconSrc,
      },
      {
        text: "5 new links/mo",
        iconSrc: DEFAULT_FREE_FEATURES[4].iconSrc,
      },
      {
        text: "Basic analytics",
        iconSrc: DEFAULT_FREE_FEATURES[1].iconSrc,
        href: "#",
      },
      {
        text: "Email support",
        iconSrc: DEFAULT_FREE_FEATURES[3].iconSrc,
      },
    ],
  },
};
