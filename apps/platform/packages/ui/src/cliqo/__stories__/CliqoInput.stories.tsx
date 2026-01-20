import type { Meta, StoryObj } from "@storybook/react";
import { CliqoInput, CliqoTextarea } from "../cliqo-input";
import { Mail, Search, User } from "lucide-react";

const meta: Meta<typeof CliqoInput> = {
  title: "Cliqo/CliqoInput",
  component: CliqoInput,
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
      options: ["pill", "rounded"],
    },
    inputSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CliqoInput>;

export const Default: Story = {
  args: {
    placeholder: "dris@instinct.so*",
    type: "email",
  },
};

export const Pill: Story = {
  args: {
    placeholder: "Enter your email",
    variant: "pill",
  },
};

export const Rounded: Story = {
  args: {
    placeholder: "Enter your name",
    variant: "rounded",
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: "Search...",
    icon: <Search className="w-4 h-4" />,
  },
};

export const WithIconRight: Story = {
  args: {
    placeholder: "Enter email",
    iconRight: <Mail className="w-4 h-4" />,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <CliqoInput inputSize="sm" placeholder="Small input" />
      <CliqoInput inputSize="md" placeholder="Medium input" />
      <CliqoInput inputSize="lg" placeholder="Large input" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

// Textarea stories
export const TextareaDefault: Story = {
  render: () => (
    <div className="w-[472px]">
      <CliqoTextarea placeholder="how can we get started?*" rows={3} />
    </div>
  ),
};

export const TextareaSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[472px]">
      <CliqoTextarea textareaSize="sm" placeholder="Small textarea" />
      <CliqoTextarea textareaSize="md" placeholder="Medium textarea" />
      <CliqoTextarea textareaSize="lg" placeholder="Large textarea" />
    </div>
  ),
};

export const ContactForm: Story = {
  render: () => (
    <form className="flex flex-col gap-4 w-[472px]">
      <CliqoTextarea placeholder="how can we get started?*" rows={3} />
      <div className="flex gap-2">
        <CliqoInput placeholder="dris@instinct.so*" type="email" className="flex-1" />
        <button className="inline-flex items-center justify-center font-medium text-center whitespace-nowrap h-9 px-4 bg-neutral-400 text-neutral-950 text-[12px] rounded-[2097150rem]">
          Send
        </button>
      </div>
    </form>
  ),
};
