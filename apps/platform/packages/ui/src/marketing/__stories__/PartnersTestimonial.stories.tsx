import type { Meta, StoryObj } from "@storybook/react";
import { PartnersTestimonial, DEFAULT_PARTNERS_TESTIMONIAL } from "../partners-testimonial";

const meta: Meta<typeof PartnersTestimonial> = {
  title: "Marketing/Partners/PartnersTestimonial",
  component: PartnersTestimonial,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PartnersTestimonial>;

export const Default: Story = {
  args: DEFAULT_PARTNERS_TESTIMONIAL,
};

export const SimpleQuote: Story = {
  args: {
    companyLogo: DEFAULT_PARTNERS_TESTIMONIAL.companyLogo,
    quote: '"This platform has transformed our affiliate program. Highly recommended for any SaaS company."',
    authorImage: DEFAULT_PARTNERS_TESTIMONIAL.authorImage,
    authorName: "John Doe",
    authorRole: "CEO, Example Co",
  },
};
