import type { Meta, StoryObj } from "@storybook/react";
import {
  PartnersDarkCta,
  DEFAULT_DARK_CTA_PROPS,
  DEFAULT_REVIEW_PLATFORMS,
} from "../partners-dark-cta";

const meta: Meta<typeof PartnersDarkCta> = {
  title: "Marketing/Partners/PartnersDarkCta",
  component: PartnersDarkCta,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PartnersDarkCta>;

export const Default: Story = {
  args: {
    ...DEFAULT_DARK_CTA_PROPS,
    reviewPlatforms: DEFAULT_REVIEW_PLATFORMS,
  },
};

export const WithoutReviews: Story = {
  args: {
    ...DEFAULT_DARK_CTA_PROPS,
    reviewPlatforms: [],
  },
};

export const CustomContent: Story = {
  args: {
    title: "Start your affiliate journey",
    description: "Join thousands of successful partners earning with our platform.",
    primaryCtaText: "Sign up free",
    primaryCtaHref: "#",
    secondaryCtaText: "Book a call",
    secondaryCtaHref: "#",
    reviewPlatforms: DEFAULT_REVIEW_PLATFORMS,
  },
};
