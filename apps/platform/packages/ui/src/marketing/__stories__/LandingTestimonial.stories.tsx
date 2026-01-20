import type { Meta, StoryObj } from "@storybook/react";
import { LandingTestimonial, DEFAULT_TESTIMONIAL } from "../landing-testimonial";

const meta: Meta<typeof LandingTestimonial> = {
  title: "Marketing/Landing/LandingTestimonial",
  component: LandingTestimonial,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LandingTestimonial>;

export const Default: Story = {
  args: DEFAULT_TESTIMONIAL,
};

export const CustomTestimonial: Story = {
  args: {
    quote:
      '" The analytics insights have completely transformed how we approach our marketing campaigns. We can now see exactly which channels are driving conversions. "',
    companyLogo: {
      src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F1ce8081f640740f124a45d82a44420bc4023c8b5.svg?generation=1762752200293957&alt=media",
      alt: "Company logo",
    },
    author: {
      name: "Sarah Chen",
      role: "Head of Growth at TechCorp",
      avatarSrc:
        "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fae59ef2c889d6ebb33e21232de05037536554867.jpeg?generation=1762752202274489&alt=media",
    },
  },
};
