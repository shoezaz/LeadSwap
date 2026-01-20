import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "../progress-bar";

const meta: Meta<typeof ProgressBar> = {
    title: "Data Display/ProgressBar",
    component: ProgressBar,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        value: { control: { type: "range", min: 0, max: 150 } },
        max: { control: "number" },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
    render: () => (
        <div className="w-64">
            <ProgressBar value={50} max={100} />
        </div>
    ),
};

export const Quarter: Story = {
    render: () => (
        <div className="w-64">
            <ProgressBar value={25} max={100} />
        </div>
    ),
};

export const ThreeQuarters: Story = {
    render: () => (
        <div className="w-64">
            <ProgressBar value={75} max={100} />
        </div>
    ),
};

export const Complete: Story = {
    render: () => (
        <div className="w-64">
            <ProgressBar value={100} max={100} />
        </div>
    ),
};

export const Overflow: Story = {
    render: () => (
        <div className="w-64">
            <p className="text-sm text-neutral-600 mb-2">Over limit (shows red)</p>
            <ProgressBar value={120} max={100} />
        </div>
    ),
};

export const AllStates: Story = {
    render: () => (
        <div className="w-64 space-y-6">
            <div>
                <p className="text-sm text-neutral-600 mb-2">Empty (0%)</p>
                <ProgressBar value={0} max={100} />
            </div>
            <div>
                <p className="text-sm text-neutral-600 mb-2">Partial (40%)</p>
                <ProgressBar value={40} max={100} />
            </div>
            <div>
                <p className="text-sm text-neutral-600 mb-2">Complete (100%)</p>
                <ProgressBar value={100} max={100} />
            </div>
            <div>
                <p className="text-sm text-neutral-600 mb-2">Over limit (120%)</p>
                <ProgressBar value={120} max={100} />
            </div>
        </div>
    ),
};
