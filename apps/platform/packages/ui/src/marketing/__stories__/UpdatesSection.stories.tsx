import type { Meta, StoryObj } from "@storybook/react";
import { UpdatesSection, DEFAULT_UPDATES } from "../updates-section";

const meta: Meta<typeof UpdatesSection> = {
  title: "Marketing/Landing/UpdatesSection",
  component: UpdatesSection,
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
type Story = StoryObj<typeof UpdatesSection>;

export const Default: Story = {
  args: {
    title: "We ship fast",
    description: "Always improving, adding features and functionality.",
    ctaText: "Full changelog",
    ctaHref: "/changelog",
    updates: DEFAULT_UPDATES,
    maxItems: 5,
  },
};

export const ThreeItems: Story = {
  args: {
    title: "We ship fast",
    description: "Always improving, adding features and functionality.",
    ctaText: "Full changelog",
    ctaHref: "/changelog",
    updates: DEFAULT_UPDATES,
    maxItems: 3,
  },
};

export const CustomUpdates: Story = {
  args: {
    title: "Latest Updates",
    description: "See what's new in Cliqo.",
    ctaText: "View all updates",
    ctaHref: "/updates",
    updates: [
      {
        title: "New creator dashboard with analytics",
        date: "Dec 12, 2025",
        href: "/blog/creator-dashboard",
      },
      {
        title: "Improved payout processing",
        date: "Dec 5, 2025",
        href: "/changelog/payout-improvements",
      },
      {
        title: "Campaign templates launched",
        date: "Nov 28, 2025",
        href: "/blog/campaign-templates",
      },
      {
        title: "Real-time performance metrics",
        date: "Nov 20, 2025",
        href: "/changelog/realtime-metrics",
      },
    ],
    maxItems: 4,
  },
};

export const MinimalUpdates: Story = {
  args: {
    title: "What's New",
    description: "Recent product updates.",
    ctaText: "See more",
    ctaHref: "/changelog",
    updates: [
      {
        title: "Performance improvements",
        date: "Dec 10, 2025",
        href: "/changelog/performance",
      },
      {
        title: "Bug fixes and stability",
        date: "Dec 8, 2025",
        href: "/changelog/fixes",
      },
    ],
    maxItems: 2,
  },
};
