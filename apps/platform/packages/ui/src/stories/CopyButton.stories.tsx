import type { Meta, StoryObj } from "@storybook/react";
import { CopyButton } from "../copy-button";
import { Toaster } from "sonner";

const meta: Meta<typeof CopyButton> = {
    title: "Utilities/CopyButton",
    component: CopyButton,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <>
                <Toaster position="bottom-center" />
                <Story />
            </>
        ),
    ],
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
    args: {
        value: "Hello, World!",
    },
};

export const WithCustomMessage: Story = {
    args: {
        value: "api_key_12345",
        successMessage: "API key copied!",
    },
};

export const InContext: Story = {
    render: () => (
        <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
            <code className="text-sm text-neutral-700">npm install @leadswap/ui</code>
            <CopyButton value="npm install @leadswap/ui" successMessage="Command copied!" />
        </div>
    ),
};

export const WithLink: Story = {
    render: () => (
        <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2">
            <span className="text-sm text-blue-600">https://dub.co/short-link</span>
            <CopyButton value="https://dub.co/short-link" successMessage="Link copied!" />
        </div>
    ),
};

export const MultipleButtons: Story = {
    render: () => (
        <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                <code className="text-sm text-neutral-700">CLIENT_ID=abc123</code>
                <CopyButton value="CLIENT_ID=abc123" />
            </div>
            <div className="flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2">
                <code className="text-sm text-neutral-700">CLIENT_SECRET=xyz789</code>
                <CopyButton value="CLIENT_SECRET=xyz789" />
            </div>
        </div>
    ),
};
