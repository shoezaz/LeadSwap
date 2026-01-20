import type { Meta, StoryObj } from "@storybook/react";
import { ProductToggle, DEFAULT_PRODUCT_OPTIONS } from "../product-toggle";

const meta: Meta<typeof ProductToggle> = {
  title: "Marketing/Pricing/ProductToggle",
  component: ProductToggle,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProductToggle>;

export const Default: Story = {
  args: {
    options: DEFAULT_PRODUCT_OPTIONS,
    defaultSelected: "links",
  },
};

export const PartnersSelected: Story = {
  args: {
    options: DEFAULT_PRODUCT_OPTIONS,
    defaultSelected: "partners",
  },
};

export const CustomOptions: Story = {
  args: {
    options: [
      {
        id: "starter",
        label: "Starter",
        iconSrc:
          "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F59fcc340e00701033e01ce79aebc1d1adc43ea13.svg?generation=1765503447597149&alt=media",
        iconBgColor: "rgb(74, 222, 128)",
        iconTextColor: "rgb(20, 83, 45)",
      },
      {
        id: "pro",
        label: "Pro",
        iconSrc:
          "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F1b7ca9e32a993780cf4bcc369b7274b170285915.svg?generation=1765503447621979&alt=media",
        iconBgColor: "rgb(251, 146, 60)",
        iconTextColor: "rgb(124, 45, 18)",
      },
    ],
    defaultSelected: "starter",
  },
};
