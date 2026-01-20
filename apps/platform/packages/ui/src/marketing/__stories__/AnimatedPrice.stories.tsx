import type { Meta, StoryObj } from "@storybook/react";
import { AnimatedPrice } from "../animated-price";

const meta: Meta<typeof AnimatedPrice> = {
  title: "Marketing/Pricing/AnimatedPrice",
  component: AnimatedPrice,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AnimatedPrice>;

export const Default: Story = {
  args: {
    amount: 25,
    currency: "$",
    suffix: " per month",
  },
};

export const Pro: Story = {
  args: {
    amount: 25,
  },
};

export const Business: Story = {
  args: {
    amount: 75,
  },
};

export const Advanced: Story = {
  args: {
    amount: 250,
  },
};

export const LargeAmount: Story = {
  args: {
    amount: 1500,
  },
};

export const NoSuffix: Story = {
  args: {
    amount: 99,
    suffix: "",
  },
};

export const EuroCurrency: Story = {
  args: {
    amount: 49,
    currency: "€",
    suffix: " per month",
  },
};
