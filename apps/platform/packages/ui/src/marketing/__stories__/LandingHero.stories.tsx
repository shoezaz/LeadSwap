import type { Meta, StoryObj } from "@storybook/react";
import { LandingHero, AnnouncementBadge } from "../landing-hero";

const meta: Meta<typeof LandingHero> = {
  title: "Marketing/Landing/LandingHero",
  component: LandingHero,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LandingHero>;

export const Default: Story = {
  args: {
    announcement: {
      text: "Celebrating $10M partner payouts on Dub",
      linkText: "Read more",
      href: "https://dub.co/blog/10m-payouts",
    },
    title: "Turn clicks into revenue",
    subtitle:
      "Dub is the modern link attribution platform for short links, conversion tracking, and affiliate programs.",
    primaryCta: {
      text: "Start for free",
      href: "https://app.dub.co/register",
    },
    secondaryCta: {
      text: "Get a demo",
      href: "https://dub.co/enterprise",
    },
  },
};

export const WithoutAnnouncement: Story = {
  args: {
    title: "Build powerful partnerships",
    subtitle:
      "The all-in-one platform for affiliate management, referral programs, and partner payouts.",
    primaryCta: {
      text: "Get started",
      href: "https://app.dub.co/register",
    },
  },
};

export const SingleCTA: Story = {
  args: {
    announcement: {
      text: "New: Advanced conversion tracking",
      linkText: "Learn more",
      href: "#",
    },
    title: "Analytics that drive growth",
    subtitle: "Track every click, conversion, and customer journey with precision.",
    primaryCta: {
      text: "Start tracking",
      href: "#",
    },
  },
};

// Story for the AnnouncementBadge component standalone
export const AnnouncementBadgeOnly: StoryObj<typeof AnnouncementBadge> = {
  render: () => (
    <div className="p-8 bg-white flex justify-center">
      <AnnouncementBadge
        text="Celebrating $10M partner payouts on Dub"
        linkText="Read more"
        href="https://dub.co/blog/10m-payouts"
      />
    </div>
  ),
};
