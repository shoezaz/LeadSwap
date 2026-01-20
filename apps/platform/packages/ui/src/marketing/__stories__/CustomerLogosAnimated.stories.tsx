import type { Meta, StoryObj } from "@storybook/react";
import { CustomerLogosAnimated, DEFAULT_LOGO_PAIRS } from "../customer-logos-animated";

const meta: Meta<typeof CustomerLogosAnimated> = {
  title: "Marketing/Landing/CustomerLogosAnimated",
  component: CustomerLogosAnimated,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CustomerLogosAnimated>;

export const Default: Story = {
  args: {
    logos: DEFAULT_LOGO_PAIRS,
    columns: 5,
    flipInterval: 3000,
    customersHref: "https://dub.co/customers",
  },
};

export const FasterFlip: Story = {
  args: {
    logos: DEFAULT_LOGO_PAIRS,
    columns: 5,
    flipInterval: 1500,
    customersHref: "https://dub.co/customers",
  },
};

export const FourColumns: Story = {
  args: {
    logos: DEFAULT_LOGO_PAIRS.slice(0, 8),
    columns: 4,
    flipInterval: 3000,
    customersHref: "https://dub.co/customers",
  },
};
