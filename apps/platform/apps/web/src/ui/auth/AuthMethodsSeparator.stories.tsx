import type { Meta, StoryObj } from "@storybook/react";
import { AuthMethodsSeparator } from "./auth-methods-separator";

const meta: Meta<typeof AuthMethodsSeparator> = {
    title: "App/Auth/AuthMethodsSeparator",
    component: AuthMethodsSeparator,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AuthMethodsSeparator>;

export const Default: Story = {};

export const InContext: Story = {
    render: () => (
        <div className="w-80 rounded-lg border border-neutral-200 bg-white p-6">
            <button className="w-full rounded-md bg-black px-4 py-2 text-white">
                Continue with Google
            </button>
            <AuthMethodsSeparator />
            <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-md border border-neutral-300 px-4 py-2"
            />
            <button className="mt-2 w-full rounded-md bg-neutral-100 px-4 py-2 text-neutral-700">
                Continue with Email
            </button>
        </div>
    ),
};
