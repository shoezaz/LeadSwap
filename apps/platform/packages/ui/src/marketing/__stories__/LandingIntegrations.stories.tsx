import type { Meta, StoryObj } from "@storybook/react";
import { LandingIntegrations, DEFAULT_INTEGRATIONS_PROPS } from "../landing-integrations";

const meta: Meta<typeof LandingIntegrations> = {
  title: "Marketing/Landing/LandingIntegrations",
  component: LandingIntegrations,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LandingIntegrations>;

export const Default: Story = {
  args: DEFAULT_INTEGRATIONS_PROPS,
};

export const CustomContent: Story = {
  args: {
    title: "Integrate with everything",
    subtitle:
      "Connect your marketing stack with our powerful integrations. New connectors added weekly.",
    ctaText: "Browse all integrations",
    ctaHref: "#",
  },
};
