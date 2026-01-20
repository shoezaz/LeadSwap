import type { Meta, StoryObj } from "@storybook/react";
import {
  EnterpriseSection,
  ApiInfrastructureSection,
  DEFAULT_ENTERPRISE_STATS,
} from "../enterprise-section";

const meta: Meta<typeof EnterpriseSection> = {
  title: "Marketing/Landing/EnterpriseSection",
  component: EnterpriseSection,
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
type Story = StoryObj<typeof EnterpriseSection>;

export const Default: Story = {
  args: {
    title: "Built to scale",
    description:
      "Our powerful, battle-tested infrastructure handles hundreds of millions of links & events monthly and can scale infinitely with your business needs.",
    stats: DEFAULT_ENTERPRISE_STATS,
    variant: "dark",
  },
};

export const CustomStats: Story = {
  args: {
    title: "Enterprise Ready",
    description: "Handle millions of requests with sub-millisecond latency.",
    stats: [
      { label: "Uptime", value: "99.99%" },
      { label: "Avg Latency", value: "45ms" },
      { label: "Daily Requests", value: "50M+" },
    ],
    variant: "dark",
  },
};

// API Infrastructure Section Stories
const apiMeta: Meta<typeof ApiInfrastructureSection> = {
  title: "Marketing/Landing/ApiInfrastructureSection",
  component: ApiInfrastructureSection,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0a0a0a" }],
    },
  },
};

type ApiStory = StoryObj<typeof ApiInfrastructureSection>;

export const ApiDefault: ApiStory = {
  render: () => (
    <ApiInfrastructureSection
      badge={{ name: "API" }}
      title="Enterprise-grade link infrastructure"
      description="Programmatically generate millions of short links, with deferred deep linking and real-time webhooks built in."
      ctaText="Explore API"
      ctaHref="/docs"
    />
  ),
};

export const CustomApi: ApiStory = {
  render: () => (
    <ApiInfrastructureSection
      badge={{ name: "Developer API" }}
      title="Build with our API"
      description="RESTful API with SDKs for TypeScript, Python, Go, and more."
      ctaText="Read the docs"
      ctaHref="/docs/api"
    />
  ),
};

// Combined full page example
export const FullEnterprisePage: Story = {
  render: () => (
    <div className="bg-neutral-950 min-h-screen">
      <EnterpriseSection
        title="Built to scale"
        description="Our powerful, battle-tested infrastructure handles hundreds of millions of links & events monthly and can scale infinitely with your business needs."
        stats={DEFAULT_ENTERPRISE_STATS}
        variant="dark"
      />
      <ApiInfrastructureSection
        badge={{ name: "API" }}
        title="Enterprise-grade link infrastructure"
        description="Programmatically generate millions of short links, with deferred deep linking and real-time webhooks built in."
        ctaText="Explore API"
        ctaHref="/docs"
      />
    </div>
  ),
};
