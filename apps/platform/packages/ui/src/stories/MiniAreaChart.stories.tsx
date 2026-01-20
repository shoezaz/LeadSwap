import type { Meta, StoryObj } from "@storybook/react";
import { MiniAreaChart } from "../mini-area-chart";

const meta: Meta<typeof MiniAreaChart> = {
    title: "Data Display/MiniAreaChart",
    component: MiniAreaChart,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MiniAreaChart>;

// Generate sample data
const generateData = (length: number, trend: "up" | "down" | "wave" = "wave") => {
    const now = new Date();
    return Array.from({ length }, (_, i) => {
        let value: number;
        if (trend === "up") {
            value = 10 + i * 3 + Math.random() * 10;
        } else if (trend === "down") {
            value = 100 - i * 3 + Math.random() * 10;
        } else {
            value = 50 + Math.sin(i * 0.5) * 30 + Math.random() * 10;
        }
        return {
            date: new Date(now.getTime() - (length - i) * 24 * 60 * 60 * 1000),
            value: Math.max(0, value),
        };
    });
};

export const Default: Story = {
    render: () => (
        <div className="h-16 w-48">
            <MiniAreaChart data={generateData(14)} />
        </div>
    ),
};

export const UpwardTrend: Story = {
    render: () => (
        <div className="h-16 w-48">
            <MiniAreaChart data={generateData(14, "up")} color="#22c55e" />
        </div>
    ),
};

export const DownwardTrend: Story = {
    render: () => (
        <div className="h-16 w-48">
            <MiniAreaChart data={generateData(14, "down")} color="#ef4444" />
        </div>
    ),
};

export const NoCurve: Story = {
    render: () => (
        <div className="h-16 w-48">
            <MiniAreaChart data={generateData(14)} curve={false} />
        </div>
    ),
};

export const CustomColor: Story = {
    render: () => (
        <div className="h-16 w-48">
            <MiniAreaChart data={generateData(14)} color="#3b82f6" />
        </div>
    ),
};

export const LargeSample: Story = {
    render: () => (
        <div className="h-24 w-64">
            <MiniAreaChart data={generateData(30)} />
        </div>
    ),
};

export const InContext: Story = {
    render: () => (
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-neutral-500">Page Views</p>
                    <p className="text-2xl font-semibold text-neutral-900">12,543</p>
                </div>
                <div className="h-12 w-32">
                    <MiniAreaChart data={generateData(14, "up")} color="#22c55e" />
                </div>
            </div>
            <p className="mt-2 text-xs text-green-600">↑ 12% from last week</p>
        </div>
    ),
};

export const MultipleCharts: Story = {
    render: () => (
        <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3">
                <div className="flex-1">
                    <p className="text-sm font-medium">Clicks</p>
                    <p className="text-lg font-semibold">4,521</p>
                </div>
                <div className="h-10 w-24">
                    <MiniAreaChart data={generateData(7, "up")} color="#22c55e" />
                </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3">
                <div className="flex-1">
                    <p className="text-sm font-medium">Conversions</p>
                    <p className="text-lg font-semibold">342</p>
                </div>
                <div className="h-10 w-24">
                    <MiniAreaChart data={generateData(7)} />
                </div>
            </div>
            <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3">
                <div className="flex-1">
                    <p className="text-sm font-medium">Bounce Rate</p>
                    <p className="text-lg font-semibold">24%</p>
                </div>
                <div className="h-10 w-24">
                    <MiniAreaChart data={generateData(7, "down")} color="#ef4444" />
                </div>
            </div>
        </div>
    ),
};
