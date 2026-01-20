import type { Meta, StoryObj } from "@storybook/react";
import { PartnersLogosGrid, DEFAULT_PARTNER_LOGOS } from "../partners-logos-grid";

const meta: Meta<typeof PartnersLogosGrid> = {
  title: "Marketing/Partners/PartnersLogosGrid",
  component: PartnersLogosGrid,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PartnersLogosGrid>;

export const Default: Story = {
  args: {
    logos: DEFAULT_PARTNER_LOGOS,
  },
};

export const FourLogos: Story = {
  args: {
    logos: DEFAULT_PARTNER_LOGOS.slice(0, 4),
  },
};
