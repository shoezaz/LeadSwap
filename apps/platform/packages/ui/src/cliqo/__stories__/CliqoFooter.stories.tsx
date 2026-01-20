import type { Meta, StoryObj } from "@storybook/react";
import { CliqoFooter, CliqoFooterExtended } from "../cliqo-footer";
import { CliqoLogo } from "../cliqo-header";

const meta: Meta<typeof CliqoFooter> = {
  title: "Cliqo/Layout/CliqoFooter",
  component: CliqoFooter,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0a0a0a" }],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CliqoFooter>;

export const Default: Story = {
  args: {
    copyright: "© 2025 CLIQO",
    links: [
      { label: "X", href: "https://x.com/cliqo" },
      { label: "LinkedIn", href: "https://linkedin.com/company/cliqo" },
      { label: "GitHub", href: "https://github.com/cliqo" },
    ],
  },
  render: (args) => (
    <div className="h-[200px] bg-neutral-950 relative flex flex-col justify-end">
      <CliqoFooter {...args} />
    </div>
  ),
};

export const Fixed: Story = {
  args: {
    copyright: "© 2025 VIRAL INSTINCT INC.",
    links: [
      { label: "X", href: "#" },
      { label: "BEN", href: "#" },
      { label: "DRIS", href: "#" },
    ],
    fixed: true,
  },
  render: (args) => (
    <div className="h-[400px] bg-neutral-950 relative">
      <div className="p-8">
        <p className="text-neutral-400">Page content...</p>
        <p className="text-neutral-400 mt-4">
          The footer is fixed at the bottom with a gradient fade.
        </p>
      </div>
      <CliqoFooter {...args} />
    </div>
  ),
};

export const Extended: Story = {
  render: () => (
    <div className="bg-neutral-950">
      <CliqoFooterExtended
        logo={<CliqoLogo />}
        description="The modern affiliate platform for ambitious brands."
        sections={[
          {
            title: "Product",
            links: [
              { label: "Features", href: "#" },
              { label: "Pricing", href: "#" },
              { label: "Integrations", href: "#" },
              { label: "API", href: "#" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "About", href: "#" },
              { label: "Blog", href: "#" },
              { label: "Careers", href: "#" },
              { label: "Contact", href: "#" },
            ],
          },
          {
            title: "Legal",
            links: [
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Security", href: "#" },
            ],
          },
        ]}
        socialLinks={[
          { label: "X", href: "#" },
          { label: "LinkedIn", href: "#" },
          { label: "GitHub", href: "#" },
        ]}
      />
    </div>
  ),
};

export const Minimal: Story = {
  args: {
    copyright: "© 2025 CLIQO",
  },
  render: (args) => (
    <div className="h-[100px] bg-neutral-950 relative flex flex-col justify-end">
      <CliqoFooter {...args} />
    </div>
  ),
};
