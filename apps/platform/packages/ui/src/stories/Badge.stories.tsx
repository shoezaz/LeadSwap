import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../badge";

const meta: Meta<typeof Badge> = {
    title: "Components/Badge",
    component: Badge,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "violet", "blue", "green", "sky", "black", "gray", "neutral", "amber", "blueGradient", "rainbow"],
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
    args: {
        children: "Default",
        variant: "default",
    },
};

export const Violet: Story = {
    args: {
        children: "Violet",
        variant: "violet",
    },
};

export const Blue: Story = {
    args: {
        children: "Blue",
        variant: "blue",
    },
};

export const Green: Story = {
    args: {
        children: "Green",
        variant: "green",
    },
};

export const Sky: Story = {
    args: {
        children: "Sky",
        variant: "sky",
    },
};

export const Black: Story = {
    args: {
        children: "Black",
        variant: "black",
    },
};

export const Gray: Story = {
    args: {
        children: "Gray",
        variant: "gray",
    },
};

export const Amber: Story = {
    args: {
        children: "Amber",
        variant: "amber",
    },
};

export const BlueGradient: Story = {
    args: {
        children: "Blue Gradient",
        variant: "blueGradient",
    },
};

export const Rainbow: Story = {
    args: {
        children: "Rainbow",
        variant: "rainbow",
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="violet">Violet</Badge>
            <Badge variant="blue">Blue</Badge>
            <Badge variant="green">Green</Badge>
            <Badge variant="sky">Sky</Badge>
            <Badge variant="black">Black</Badge>
            <Badge variant="gray">Gray</Badge>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="amber">Amber</Badge>
            <Badge variant="blueGradient">Blue Gradient</Badge>
            <Badge variant="rainbow">Rainbow</Badge>
        </div>
    ),
};
