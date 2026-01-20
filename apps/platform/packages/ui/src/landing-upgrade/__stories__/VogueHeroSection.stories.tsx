import type { Meta, StoryObj } from "@storybook/react";
import { VogueHeroSection } from "../VogueHeroSection";

const meta: Meta<typeof VogueHeroSection> = {
    title: "Landing Upgrade/VogueHeroSection",
    component: VogueHeroSection,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof VogueHeroSection>;

export const Default: Story = {
    render: () => <VogueHeroSection />,
};

export const WithCustomClass: Story = {
    render: () => <VogueHeroSection className="min-h-[800px]" />,
};
