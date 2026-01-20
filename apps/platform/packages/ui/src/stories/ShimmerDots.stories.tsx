import type { Meta, StoryObj } from "@storybook/react";
import { ShimmerDots } from "../shimmer-dots";

const meta: Meta<typeof ShimmerDots> = {
    title: "Visual/ShimmerDots",
    component: ShimmerDots,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        dotSize: { control: { type: "range", min: 1, max: 4 } },
        cellSize: { control: { type: "range", min: 2, max: 10 } },
        speed: { control: { type: "range", min: 1, max: 10 } },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ShimmerDots>;

export const Default: Story = {
    render: () => (
        <div className="relative h-48 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <ShimmerDots />
        </div>
    ),
};

export const LargeDots: Story = {
    render: () => (
        <div className="relative h-48 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <ShimmerDots dotSize={2} cellSize={6} />
        </div>
    ),
};

export const FastAnimation: Story = {
    render: () => (
        <div className="relative h-48 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <ShimmerDots speed={10} />
        </div>
    ),
};

export const SlowAnimation: Story = {
    render: () => (
        <div className="relative h-48 w-64 overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <ShimmerDots speed={2} />
        </div>
    ),
};

export const CustomColor: Story = {
    render: () => (
        <div className="relative h-48 w-64 overflow-hidden rounded-lg border border-purple-200 bg-purple-50">
            <ShimmerDots color={[0.5, 0.2, 0.8]} />
        </div>
    ),
};

export const AsLoadingBackground: Story = {
    render: () => (
        <div className="relative h-64 w-96 overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <ShimmerDots />
            <div className="relative z-10 flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-neutral-800" />
                    <p className="mt-4 text-sm text-neutral-600">Loading...</p>
                </div>
            </div>
        </div>
    ),
};
