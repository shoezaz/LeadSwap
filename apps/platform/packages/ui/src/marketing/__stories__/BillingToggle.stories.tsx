import type { Meta, StoryObj } from "@storybook/react";
import { BillingToggle } from "../billing-toggle";

const meta: Meta<typeof BillingToggle> = {
  title: "Marketing/Pricing/BillingToggle",
  component: BillingToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BillingToggle>;

export const Default: Story = {
  args: {
    defaultYearly: true,
    label: "Billed yearly",
    badgeText: "2 months free",
  },
};

export const Monthly: Story = {
  args: {
    defaultYearly: false,
    label: "Billed yearly",
    badgeText: "2 months free",
  },
};

export const NoBadge: Story = {
  args: {
    defaultYearly: true,
    label: "Billed yearly",
    badgeText: "",
  },
};

export const CustomLabel: Story = {
  args: {
    defaultYearly: true,
    label: "Annual billing",
    badgeText: "Save 20%",
  },
};
