import type { Meta, StoryObj } from "@storybook/react";
import { CliqoHeader, CliqoLogo } from "../cliqo-header";
import { ArrowUpRight } from "lucide-react";

const meta: Meta<typeof CliqoHeader> = {
  title: "Cliqo/Layout/CliqoHeader",
  component: CliqoHeader,
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
type Story = StoryObj<typeof CliqoHeader>;

export const Default: Story = {
  args: {
    logo: <CliqoLogo />,
    links: [
      { label: "home", href: "/", active: false },
      { label: "network", href: "/network", active: false },
      { label: "start", href: "/start", active: true },
    ],
    ctaLabel: "let's work",
    ctaHref: "/contact",
    ctaIcon: <ArrowUpRight className="w-4 h-4" />,
  },
  render: (args) => (
    <div className="h-[300px] bg-neutral-950 relative">
      <CliqoHeader {...args} />
      <div className="pt-24 px-8">
        <p className="text-neutral-400">Page content below header...</p>
      </div>
    </div>
  ),
};

export const Minimal: Story = {
  args: {
    logo: <CliqoLogo text="cliqo" />,
    links: [],
  },
  render: (args) => (
    <div className="h-[300px] bg-neutral-950 relative">
      <CliqoHeader {...args} />
    </div>
  ),
};

export const WithNavOnly: Story = {
  args: {
    logo: <CliqoLogo />,
    links: [
      { label: "pricing", href: "/pricing" },
      { label: "partners", href: "/partners" },
      { label: "creators", href: "/creators" },
      { label: "contact", href: "/contact" },
    ],
  },
  render: (args) => (
    <div className="h-[300px] bg-neutral-950 relative">
      <CliqoHeader {...args} />
    </div>
  ),
};

export const FullNav: Story = {
  args: {
    logo: <CliqoLogo />,
    links: [
      { label: "home", href: "/" },
      { label: "pricing", href: "/pricing" },
      { label: "partners", href: "/partners" },
      { label: "creators", href: "/creators" },
    ],
    ctaLabel: "Get Started",
    ctaHref: "/signup",
  },
  render: (args) => (
    <div className="h-[400px] bg-neutral-950 relative">
      <CliqoHeader {...args} />
      <div className="pt-32 px-8">
        <h1 className="text-[48px] text-neutral-50/70 tracking-[-2.4px]">
          Welcome to Cliqo
        </h1>
      </div>
    </div>
  ),
};
