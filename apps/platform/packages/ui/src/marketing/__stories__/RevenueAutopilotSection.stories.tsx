import type { Meta, StoryObj } from "@storybook/react";
import {
  RevenueAutopilotSection,
  DEFAULT_REVENUE_AUTOPILOT_PROPS,
  DEFAULT_REVENUE_FEATURES,
} from "../revenue-autopilot-section";

const meta: Meta<typeof RevenueAutopilotSection> = {
  title: "Marketing/Partners/RevenueAutopilotSection",
  component: RevenueAutopilotSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RevenueAutopilotSection>;

export const Default: Story = {
  args: {
    ...DEFAULT_REVENUE_AUTOPILOT_PROPS,
    features: DEFAULT_REVENUE_FEATURES,
  },
};

export const CustomTitle: Story = {
  args: {
    title: "Automated revenue growth",
    description: "Let your partners drive your revenue while you focus on building your product.",
    features: DEFAULT_REVENUE_FEATURES,
  },
};
