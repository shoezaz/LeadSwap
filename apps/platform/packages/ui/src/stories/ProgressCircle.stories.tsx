import type { Meta, StoryObj } from "@storybook/react";
import { ProgressCircle } from "../progress-circle";

const meta: Meta<typeof ProgressCircle> = {
    title: "Data Display/ProgressCircle",
    component: ProgressCircle,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        progress: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
        strokeWidth: { control: { type: "range", min: 4, max: 24 } },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProgressCircle>;

export const Default: Story = {
    args: {
        progress: 0.5,
    },
    render: (args) => (
        <div className="flex items-center gap-2">
            <ProgressCircle {...args} className="size-8" />
            <span className="text-sm text-neutral-600">{Math.round(args.progress * 100)}%</span>
        </div>
    ),
};

export const Empty: Story = {
    args: {
        progress: 0,
    },
    render: (args) => <ProgressCircle {...args} className="size-8" />,
};

export const Quarter: Story = {
    args: {
        progress: 0.25,
    },
    render: (args) => <ProgressCircle {...args} className="size-8" />,
};

export const ThreeQuarters: Story = {
    args: {
        progress: 0.75,
    },
    render: (args) => <ProgressCircle {...args} className="size-8" />,
};

export const Complete: Story = {
    args: {
        progress: 1,
    },
    render: (args) => <ProgressCircle {...args} className="size-8" />,
};

export const DifferentSizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <ProgressCircle progress={0.7} className="size-4" />
            <ProgressCircle progress={0.7} className="size-6" />
            <ProgressCircle progress={0.7} className="size-8" />
            <ProgressCircle progress={0.7} className="size-12" />
            <ProgressCircle progress={0.7} className="size-16" />
        </div>
    ),
};

export const AllStates: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
                <ProgressCircle progress={0} className="size-8" />
                <span className="text-xs text-neutral-500">0%</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <ProgressCircle progress={0.25} className="size-8" />
                <span className="text-xs text-neutral-500">25%</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <ProgressCircle progress={0.5} className="size-8" />
                <span className="text-xs text-neutral-500">50%</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <ProgressCircle progress={0.75} className="size-8" />
                <span className="text-xs text-neutral-500">75%</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <ProgressCircle progress={1} className="size-8" />
                <span className="text-xs text-neutral-500">100%</span>
            </div>
        </div>
    ),
};
