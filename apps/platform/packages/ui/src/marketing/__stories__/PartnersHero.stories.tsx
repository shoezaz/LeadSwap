import type { Meta, StoryObj } from "@storybook/react";
import { PartnersHero, DEFAULT_PARTNERS_HERO_PROPS } from "../partners-hero";

const meta: Meta<typeof PartnersHero> = {
  title: "Marketing/Partners/PartnersHero",
  component: PartnersHero,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PartnersHero>;

export const Default: Story = {
  args: DEFAULT_PARTNERS_HERO_PROPS,
};

export const CustomContent: Story = {
  args: {
    title: "Build your affiliate empire",
    description: "The modern platform for managing affiliate partnerships at scale.",
    ctaText: "Start now",
    ctaHref: "#",
    secondaryCtaText: "Learn more",
    secondaryCtaHref: "#",
  },
};
