import type { Meta, StoryObj } from "@storybook/react";
import { LandingFooter, DEFAULT_FOOTER_DATA } from "../landing-footer";

const meta: Meta<typeof LandingFooter> = {
  title: "Marketing/Landing/LandingFooter",
  component: LandingFooter,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LandingFooter>;

export const Default: Story = {
  args: DEFAULT_FOOTER_DATA,
};

export const MinimalFooter: Story = {
  args: {
    logo: DEFAULT_FOOTER_DATA.logo,
    tagline: "The modern link platform.",
    socialLinks: DEFAULT_FOOTER_DATA.socialLinks.slice(0, 2),
    sections: DEFAULT_FOOTER_DATA.sections.slice(0, 2),
    copyright: "© 2025 Cliqo",
  },
};
