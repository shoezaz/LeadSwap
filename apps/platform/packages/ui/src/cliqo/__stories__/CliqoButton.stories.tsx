import type { Meta, StoryObj } from "@storybook/react";
import { CliqoButton } from "../cliqo-button";
import { ArrowRight, Mail, Plus, Send } from "lucide-react";

const meta: Meta<typeof CliqoButton> = {
  title: "Cliqo/CliqoButton",
  component: CliqoButton,
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
      options: ["primary", "secondary", "outline", "ghost", "selected"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CliqoButton>;

export const Primary: Story = {
  args: {
    children: "Get Started",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "cinematics",
    variant: "secondary",
    size: "sm",
  },
};

export const Selected: Story = {
  args: {
    children: "ugc",
    variant: "selected",
    size: "sm",
  },
};

export const Outline: Story = {
  args: {
    children: "Learn More",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Cancel",
    variant: "ghost",
  },
};

export const WithIcon: Story = {
  args: {
    children: "Send",
    variant: "primary",
    icon: <Send className="w-4 h-4" />,
  },
};

export const WithIconRight: Story = {
  args: {
    children: "Continue",
    variant: "primary",
    iconRight: <ArrowRight className="w-4 h-4" />,
  },
};

export const IconOnly: Story = {
  args: {
    children: <Plus className="w-4 h-4" />,
    variant: "secondary",
    size: "sm",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <CliqoButton size="xs">Extra Small</CliqoButton>
      <CliqoButton size="sm">Small</CliqoButton>
      <CliqoButton size="md">Medium</CliqoButton>
      <CliqoButton size="lg">Large</CliqoButton>
      <CliqoButton size="xl">Extra Large</CliqoButton>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <CliqoButton variant="primary">Primary</CliqoButton>
      <CliqoButton variant="secondary">Secondary</CliqoButton>
      <CliqoButton variant="selected">Selected</CliqoButton>
      <CliqoButton variant="outline">Outline</CliqoButton>
      <CliqoButton variant="ghost">Ghost</CliqoButton>
    </div>
  ),
};

export const TagGroup: Story = {
  render: () => (
    <div className="flex items-center gap-2 flex-wrap">
      <CliqoButton variant="secondary" size="sm">cinematics</CliqoButton>
      <CliqoButton variant="selected" size="sm">ugc</CliqoButton>
      <CliqoButton variant="secondary" size="sm">design</CliqoButton>
      <CliqoButton variant="secondary" size="sm">influencer</CliqoButton>
      <CliqoButton variant="secondary" size="sm">clipping</CliqoButton>
      <CliqoButton variant="secondary" size="sm">ads</CliqoButton>
      <CliqoButton variant="secondary" size="sm">anything</CliqoButton>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};
