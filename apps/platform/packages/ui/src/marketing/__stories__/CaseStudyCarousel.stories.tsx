import type { Meta, StoryObj } from "@storybook/react";
import {
  CaseStudyCarousel,
  DEFAULT_CASE_STUDIES,
  DEFAULT_CAROUSEL_PROPS,
} from "../case-study-carousel";

const meta: Meta<typeof CaseStudyCarousel> = {
  title: "Marketing/Partners/CaseStudyCarousel",
  component: CaseStudyCarousel,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CaseStudyCarousel>;

export const Default: Story = {
  args: {
    ...DEFAULT_CAROUSEL_PROPS,
    caseStudies: DEFAULT_CASE_STUDIES,
  },
};

export const SingleCaseStudy: Story = {
  args: {
    ...DEFAULT_CAROUSEL_PROPS,
    caseStudies: [DEFAULT_CASE_STUDIES[0]],
  },
};

export const CustomContent: Story = {
  args: {
    title: "Customer success stories",
    description: "See how companies are growing with our platform.",
    caseStudies: DEFAULT_CASE_STUDIES,
  },
};
