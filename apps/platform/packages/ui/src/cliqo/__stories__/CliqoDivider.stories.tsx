import type { Meta, StoryObj } from "@storybook/react";
import { CliqoDivider, CliqoDividerWithText } from "../cliqo-divider";

const meta: Meta<typeof CliqoDivider> = {
  title: "Cliqo/CliqoDivider",
  component: CliqoDivider,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0a0a0a" }],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CliqoDivider>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-96">
      <p className="text-neutral-50 mb-4">Content above</p>
      <CliqoDivider />
      <p className="text-neutral-50 mt-4">Content below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center h-8 gap-4">
      <span className="text-neutral-50">Item 1</span>
      <CliqoDivider orientation="vertical" />
      <span className="text-neutral-50">Item 2</span>
      <CliqoDivider orientation="vertical" />
      <span className="text-neutral-50">Item 3</span>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="w-96">
      <CliqoDividerWithText text="or" />
    </div>
  ),
};

export const WithTextVariants: Story = {
  render: () => (
    <div className="w-96 space-y-8">
      <CliqoDividerWithText text="or continue with" />
      <CliqoDividerWithText text="section" />
      <CliqoDividerWithText text="2025" />
    </div>
  ),
};

export const InCard: Story = {
  render: () => (
    <div className="w-80 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
      <h3 className="text-lg font-medium text-neutral-50">Settings</h3>
      <p className="text-neutral-400 text-sm mt-1">Manage your preferences</p>
      <CliqoDivider className="my-4" />
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-neutral-400 text-sm">Notifications</span>
          <span className="text-neutral-50 text-sm">On</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400 text-sm">Dark mode</span>
          <span className="text-neutral-50 text-sm">Always</span>
        </div>
      </div>
      <CliqoDivider className="my-4" />
      <p className="text-neutral-400 text-xs">Last updated: Today</p>
    </div>
  ),
};

export const FooterStyle: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <CliqoDivider className="mb-4" />
      <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
        <span>© 2025 CLIQO</span>
        <div className="flex items-center gap-2">
          <a href="#" className="hover:text-neutral-50">X</a>
          <CliqoDivider orientation="vertical" className="h-3" />
          <a href="#" className="hover:text-neutral-50">LinkedIn</a>
          <CliqoDivider orientation="vertical" className="h-3" />
          <a href="#" className="hover:text-neutral-50">GitHub</a>
        </div>
      </div>
    </div>
  ),
};
