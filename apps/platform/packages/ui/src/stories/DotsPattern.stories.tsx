import type { Meta, StoryObj } from "@storybook/react";
import { DotsPattern } from "../dots-pattern";

const meta: Meta<typeof DotsPattern> = {
    title: "Visual/DotsPattern",
    component: DotsPattern,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        dotSize: { control: { type: "range", min: 1, max: 6 } },
        gapSize: { control: { type: "range", min: 4, max: 20 } },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DotsPattern>;

export const Default: Story = {
    render: () => (
        <div className="relative h-48 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <DotsPattern />
            <div className="relative z-10 flex h-full items-center justify-center">
                <p className="text-neutral-600">Content here</p>
            </div>
        </div>
    ),
};

export const LargeDots: Story = {
    render: () => (
        <div className="relative h-48 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <DotsPattern dotSize={4} gapSize={12} />
        </div>
    ),
};

export const SmallDots: Story = {
    render: () => (
        <div className="relative h-48 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <DotsPattern dotSize={1} gapSize={6} />
        </div>
    ),
};

export const DenseDots: Story = {
    render: () => (
        <div className="relative h-48 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <DotsPattern dotSize={2} gapSize={4} />
        </div>
    ),
};

export const CustomColor: Story = {
    render: () => (
        <div className="relative h-48 w-64 overflow-hidden rounded-lg border border-blue-200 bg-blue-50">
            <DotsPattern className="text-blue-300" />
        </div>
    ),
};

export const AsBackground: Story = {
    render: () => (
        <div className="relative h-64 w-96 overflow-hidden rounded-xl border border-neutral-200 bg-white p-6">
            <DotsPattern />
            <div className="relative z-10">
                <h3 className="text-lg font-semibold text-neutral-900">Card Title</h3>
                <p className="mt-2 text-sm text-neutral-600">
                    This card uses a dots pattern as a subtle background decoration.
                </p>
            </div>
        </div>
    ),
};
