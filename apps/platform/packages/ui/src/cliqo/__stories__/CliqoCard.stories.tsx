import type { Meta, StoryObj } from "@storybook/react";
import {
  CliqoCard,
  CliqoCardHeader,
  CliqoCardTitle,
  CliqoCardDescription,
  CliqoCardContent,
  CliqoCardFooter,
} from "../cliqo-card";
import { CliqoButton } from "../cliqo-button";
import { CliqoBadge } from "../cliqo-badge";

const meta: Meta<typeof CliqoCard> = {
  title: "Cliqo/CliqoCard",
  component: CliqoCard,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0a0a0a" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "ghost"],
    },
    radius: {
      control: "select",
      options: ["default", "lg", "xl"],
    },
    hover: {
      control: "select",
      options: ["none", "subtle", "lift"],
    },
    padding: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CliqoCard>;

export const Default: Story = {
  render: () => (
    <CliqoCard className="w-80">
      <CliqoCardHeader>
        <CliqoCardTitle>Card Title</CliqoCardTitle>
        <CliqoCardDescription>
          This is a description of the card content.
        </CliqoCardDescription>
      </CliqoCardHeader>
      <CliqoCardContent>
        <p className="text-neutral-400 text-sm">
          Some content goes here. This can be anything you want.
        </p>
      </CliqoCardContent>
      <CliqoCardFooter className="justify-end gap-2">
        <CliqoButton variant="ghost" size="sm">Cancel</CliqoButton>
        <CliqoButton size="sm">Save</CliqoButton>
      </CliqoCardFooter>
    </CliqoCard>
  ),
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: (
      <div>
        <h3 className="text-lg font-medium text-neutral-50">Elevated Card</h3>
        <p className="text-neutral-400 text-sm mt-2">
          This card has an elevated background.
        </p>
      </div>
    ),
    className: "w-80",
  },
};

export const WithHover: Story = {
  render: () => (
    <div className="flex gap-4">
      <CliqoCard hover="subtle" className="w-48 cursor-pointer">
        <p className="text-neutral-50 text-sm">Subtle hover</p>
      </CliqoCard>
      <CliqoCard hover="lift" className="w-48 cursor-pointer">
        <p className="text-neutral-50 text-sm">Lift hover</p>
      </CliqoCard>
    </div>
  ),
};

export const PricingCard: Story = {
  render: () => (
    <CliqoCard className="w-72">
      <CliqoCardHeader>
        <div className="flex items-center justify-between">
          <CliqoCardTitle>Pro</CliqoCardTitle>
          <CliqoBadge variant="violet" size="xs">Popular</CliqoBadge>
        </div>
        <CliqoCardDescription>For growing teams</CliqoCardDescription>
      </CliqoCardHeader>
      <CliqoCardContent>
        <div className="mb-6">
          <span className="text-4xl font-bold text-neutral-50">$29</span>
          <span className="text-neutral-400">/month</span>
        </div>
        <ul className="space-y-3 text-sm text-neutral-400">
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            Unlimited links
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            Advanced analytics
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span>
            Team collaboration
          </li>
        </ul>
      </CliqoCardContent>
      <CliqoCardFooter>
        <CliqoButton className="w-full">Get Started</CliqoButton>
      </CliqoCardFooter>
    </CliqoCard>
  ),
};

export const FeatureCard: Story = {
  render: () => (
    <CliqoCard hover="lift" className="w-80 cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
        <span className="text-violet-400 text-lg">⚡</span>
      </div>
      <CliqoCardTitle>Lightning Fast</CliqoCardTitle>
      <p className="text-neutral-400 text-sm mt-2">
        Our infrastructure is optimized for speed. Links redirect in under 50ms.
      </p>
    </CliqoCard>
  ),
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: (
      <div>
        <h3 className="text-lg font-medium text-neutral-50">Ghost Card</h3>
        <p className="text-neutral-400 text-sm mt-2">
          No background, no border.
        </p>
      </div>
    ),
    className: "w-80",
  },
};
