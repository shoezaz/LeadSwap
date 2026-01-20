import type { Meta, StoryObj } from "@storybook/react";
import {
  CliqoSection,
  CliqoSectionTitle,
  CliqoSectionDescription,
} from "../cliqo-section";
import { CliqoCard } from "../cliqo-card";
import { CliqoButton } from "../cliqo-button";

const meta: Meta<typeof CliqoSection> = {
  title: "Cliqo/Layout/CliqoSection",
  component: CliqoSection,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0a0a0a" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    maxWidth: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full", "none"],
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
    },
    bg: {
      control: "select",
      options: ["transparent", "primary", "secondary", "elevated"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CliqoSection>;

export const Default: Story = {
  render: () => (
    <div className="bg-neutral-950">
      <CliqoSection>
        <CliqoSectionTitle>Features</CliqoSectionTitle>
        <CliqoSectionDescription className="mt-4 mx-auto">
          Everything you need to manage your affiliate program at scale.
        </CliqoSectionDescription>
      </CliqoSection>
    </div>
  ),
};

export const LeftAligned: Story = {
  render: () => (
    <div className="bg-neutral-950">
      <CliqoSection align="left">
        <CliqoSectionTitle>Why Cliqo?</CliqoSectionTitle>
        <CliqoSectionDescription className="mt-4">
          We built Cliqo because we believed there had to be a better way to
          manage affiliate programs.
        </CliqoSectionDescription>
      </CliqoSection>
    </div>
  ),
};

export const WithBackground: Story = {
  render: () => (
    <div className="bg-neutral-950">
      <CliqoSection bg="secondary">
        <CliqoSectionTitle>Trusted by teams</CliqoSectionTitle>
        <CliqoSectionDescription className="mt-4 mx-auto">
          Join thousands of companies using Cliqo.
        </CliqoSectionDescription>
      </CliqoSection>
    </div>
  ),
};

export const WithCards: Story = {
  render: () => (
    <div className="bg-neutral-950">
      <CliqoSection>
        <CliqoSectionTitle>Features</CliqoSectionTitle>
        <CliqoSectionDescription className="mt-4 mx-auto">
          Everything you need to grow your affiliate revenue.
        </CliqoSectionDescription>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <CliqoCard hover="lift" className="cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
              <span className="text-violet-400 text-lg">⚡</span>
            </div>
            <h3 className="text-lg font-medium text-neutral-50">Fast</h3>
            <p className="text-neutral-400 text-sm mt-2">
              Links redirect in under 50ms globally.
            </p>
          </CliqoCard>

          <CliqoCard hover="lift" className="cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <span className="text-blue-400 text-lg">📊</span>
            </div>
            <h3 className="text-lg font-medium text-neutral-50">Analytics</h3>
            <p className="text-neutral-400 text-sm mt-2">
              Real-time insights into your affiliate performance.
            </p>
          </CliqoCard>

          <CliqoCard hover="lift" className="cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
              <span className="text-green-400 text-lg">💰</span>
            </div>
            <h3 className="text-lg font-medium text-neutral-50">Payouts</h3>
            <p className="text-neutral-400 text-sm mt-2">
              Automated payouts to your partners worldwide.
            </p>
          </CliqoCard>
        </div>
      </CliqoSection>
    </div>
  ),
};

export const TitleSizes: Story = {
  render: () => (
    <div className="bg-neutral-950 py-12">
      <div className="space-y-8 px-8">
        <CliqoSectionTitle size="sm">Small Title (24px)</CliqoSectionTitle>
        <CliqoSectionTitle size="md">Medium Title (36px)</CliqoSectionTitle>
        <CliqoSectionTitle size="lg">Large Title (48px)</CliqoSectionTitle>
        <CliqoSectionTitle size="xl">XL Title (64px)</CliqoSectionTitle>
      </div>
    </div>
  ),
};

export const CTASection: Story = {
  render: () => (
    <div className="bg-neutral-950">
      <CliqoSection bg="secondary" size="lg">
        <CliqoSectionTitle size="lg">Ready to get started?</CliqoSectionTitle>
        <CliqoSectionDescription className="mt-4 mx-auto">
          Join thousands of brands growing with Cliqo.
        </CliqoSectionDescription>
        <div className="flex items-center justify-center gap-3 mt-8">
          <CliqoButton size="lg">Start for free</CliqoButton>
          <CliqoButton variant="outline" size="lg">
            Talk to sales
          </CliqoButton>
        </div>
      </CliqoSection>
    </div>
  ),
};
