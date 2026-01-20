import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip, TooltipProvider, InfoTooltip, TooltipContent, SimpleTooltipContent } from "../tooltip";
import { Button } from "../button";
import { HelpCircle } from "lucide-react";

const meta: Meta<typeof Tooltip> = {
    title: "Components/Tooltip",
    component: Tooltip,
    decorators: [
        (Story) => (
            <TooltipProvider>
                <div className="p-20">
                    <Story />
                </div>
            </TooltipProvider>
        ),
    ],
    parameters: {
        layout: "centered",
    },
    argTypes: {
        side: {
            control: "select",
            options: ["top", "right", "bottom", "left"],
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
    args: {
        content: "This is a tooltip",
        children: <Button text="Hover me" variant="secondary" />,
    },
};

export const Top: Story = {
    args: {
        content: "Tooltip on top",
        side: "top",
        children: <Button text="Top" variant="secondary" />,
    },
};

export const Right: Story = {
    args: {
        content: "Tooltip on right",
        side: "right",
        children: <Button text="Right" variant="secondary" />,
    },
};

export const Bottom: Story = {
    args: {
        content: "Tooltip on bottom",
        side: "bottom",
        children: <Button text="Bottom" variant="secondary" />,
    },
};

export const Left: Story = {
    args: {
        content: "Tooltip on left",
        side: "left",
        children: <Button text="Left" variant="secondary" />,
    },
};

export const WithRichContent: Story = {
    args: {
        content: (
            <TooltipContent
                title="This is a rich tooltip with more content and formatting options."
                cta="Learn more"
                href="https://example.com"
                target="_blank"
            />
        ),
        children: <Button text="Hover for rich content" variant="secondary" />,
    },
};

export const SimpleContent: Story = {
    args: {
        content: (
            <SimpleTooltipContent
                title="Simple tooltip with a link"
                cta="Click here"
                href="https://example.com"
            />
        ),
        children: <Button text="Simple content" variant="secondary" />,
    },
};

export const InfoTooltipStory: Story = {
    name: "Info Tooltip",
    render: () => (
        <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">What is this?</span>
            <InfoTooltip content="This is an info tooltip that explains something important." />
        </div>
    ),
};

export const AllPositions: Story = {
    render: () => (
        <div className="grid grid-cols-3 gap-8 p-12">
            <div />
            <Tooltip content="Top tooltip" side="top">
                <Button text="Top" variant="secondary" />
            </Tooltip>
            <div />

            <Tooltip content="Left tooltip" side="left">
                <Button text="Left" variant="secondary" />
            </Tooltip>
            <div />
            <Tooltip content="Right tooltip" side="right">
                <Button text="Right" variant="secondary" />
            </Tooltip>

            <div />
            <Tooltip content="Bottom tooltip" side="bottom">
                <Button text="Bottom" variant="secondary" />
            </Tooltip>
            <div />
        </div>
    ),
};
