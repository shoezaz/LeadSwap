import type { Meta, StoryObj } from "@storybook/react";
import { PartnersCardsGrid, DEFAULT_PARTNER_GRID_DATA } from "../partners-cards-grid";

const meta: Meta<typeof PartnersCardsGrid> = {
  title: "Marketing/Partners/PartnersCardsGrid",
  component: PartnersCardsGrid,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PartnersCardsGrid>;

export const Default: Story = {
  args: {
    partners: DEFAULT_PARTNER_GRID_DATA,
  },
};

export const FewPartners: Story = {
  args: {
    partners: DEFAULT_PARTNER_GRID_DATA.slice(0, 4),
  },
};
