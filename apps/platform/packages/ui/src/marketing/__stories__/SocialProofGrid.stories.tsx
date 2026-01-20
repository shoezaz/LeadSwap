import type { Meta, StoryObj } from "@storybook/react";
import { SocialProofGrid, DEFAULT_SOCIAL_PROOF_ITEMS } from "../social-proof-grid";

const meta: Meta<typeof SocialProofGrid> = {
  title: "Marketing/Landing/SocialProofGrid",
  component: SocialProofGrid,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0a0a0a" }],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SocialProofGrid>;

export const Default: Story = {
  args: {
    title: "Trusted by startups and enterprises",
    subtitle:
      "Join 100,000+ customers who use our platform to take their marketing efforts to the next level.",
    ctaText: "View all customers",
    ctaHref: "/customers",
    items: DEFAULT_SOCIAL_PROOF_ITEMS,
  },
};

export const CustomTitle: Story = {
  args: {
    title: "Loved by creators worldwide",
    subtitle: "See why thousands of creators choose Cliqo for their campaigns.",
    ctaText: "See all creators",
    ctaHref: "/creators",
    items: DEFAULT_SOCIAL_PROOF_ITEMS,
  },
};
