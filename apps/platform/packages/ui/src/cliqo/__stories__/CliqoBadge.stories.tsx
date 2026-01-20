import type { Meta, StoryObj } from "@storybook/react";
import { CliqoBadge } from "../cliqo-badge";
import { Check, Star, Zap } from "lucide-react";

const meta: Meta<typeof CliqoBadge> = {
  title: "Cliqo/CliqoBadge",
  component: CliqoBadge,
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
      options: ["default", "selected", "primary", "outline", "violet", "blue", "green", "amber", "red"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CliqoBadge>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Selected: Story = {
  args: {
    children: "Selected",
    variant: "selected",
  },
};

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
};

export const WithIcon: Story = {
  args: {
    children: "Pro",
    variant: "violet",
    icon: <Star className="w-3 h-3" />,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3 flex-wrap">
      <CliqoBadge variant="default">default</CliqoBadge>
      <CliqoBadge variant="selected">selected</CliqoBadge>
      <CliqoBadge variant="primary">primary</CliqoBadge>
      <CliqoBadge variant="outline">outline</CliqoBadge>
      <CliqoBadge variant="violet">violet</CliqoBadge>
      <CliqoBadge variant="blue">blue</CliqoBadge>
      <CliqoBadge variant="green">green</CliqoBadge>
      <CliqoBadge variant="amber">amber</CliqoBadge>
      <CliqoBadge variant="red">red</CliqoBadge>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <CliqoBadge size="xs">Extra Small</CliqoBadge>
      <CliqoBadge size="sm">Small</CliqoBadge>
      <CliqoBadge size="md">Medium</CliqoBadge>
      <CliqoBadge size="lg">Large</CliqoBadge>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <CliqoBadge variant="green" icon={<Check className="w-3 h-3" />}>
        Active
      </CliqoBadge>
      <CliqoBadge variant="amber" icon={<Zap className="w-3 h-3" />}>
        Pending
      </CliqoBadge>
      <CliqoBadge variant="red">
        Expired
      </CliqoBadge>
    </div>
  ),
};

export const PlanBadges: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <CliqoBadge variant="default">Free</CliqoBadge>
      <CliqoBadge variant="violet">Pro</CliqoBadge>
      <CliqoBadge variant="primary">Enterprise</CliqoBadge>
    </div>
  ),
};

export const CategoryTags: Story = {
  render: () => (
    <div className="flex items-center gap-2 flex-wrap">
      <CliqoBadge variant="default" size="sm">cinematics</CliqoBadge>
      <CliqoBadge variant="selected" size="sm">ugc</CliqoBadge>
      <CliqoBadge variant="default" size="sm">design</CliqoBadge>
      <CliqoBadge variant="default" size="sm">influencer</CliqoBadge>
    </div>
  ),
};
