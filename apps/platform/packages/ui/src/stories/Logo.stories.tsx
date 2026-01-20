import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "../logo";
import { Wordmark } from "../wordmark";

const LogoMeta: Meta<typeof Logo> = {
    title: "Branding/Logo",
    component: Logo,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default LogoMeta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {
    render: () => <Logo />,
};

export const DifferentSizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Logo className="h-6 w-6" />
            <Logo className="h-8 w-8" />
            <Logo className="h-10 w-10" />
            <Logo className="h-12 w-12" />
            <Logo className="h-16 w-16" />
        </div>
    ),
};

export const WithWordmark: Story = {
    render: () => (
        <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-bold">Cliqo</span>
        </div>
    ),
};

export const OnDarkBackground: Story = {
    render: () => (
        <div className="rounded-lg bg-neutral-900 p-8">
            <Logo className="h-12 w-12 text-white" />
        </div>
    ),
};

export const WordmarkComponent: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <Wordmark className="h-8 w-8" />
                <span className="text-sm text-neutral-600">Wordmark sizes:</span>
            </div>
            <div className="flex items-center gap-4">
                <Wordmark className="h-4 w-4" />
                <Wordmark className="h-6 w-6" />
                <Wordmark className="h-8 w-8" />
                <Wordmark className="h-10 w-10" />
            </div>
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="mb-3 text-sm font-medium text-neutral-500">Light Mode</h3>
                <div className="flex items-center gap-4 rounded-lg bg-white p-4">
                    <Logo className="h-10 w-10" />
                    <Wordmark className="h-8 w-8" />
                </div>
            </div>
            <div>
                <h3 className="mb-3 text-sm font-medium text-neutral-500">Dark Mode</h3>
                <div className="flex items-center gap-4 rounded-lg bg-neutral-900 p-4">
                    <Logo className="h-10 w-10 text-white" />
                    <Wordmark className="h-8 w-8 text-white" />
                </div>
            </div>
        </div>
    ),
};
