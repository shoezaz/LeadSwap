import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "../label";

const meta: Meta<typeof Label> = {
    title: "Form/Label",
    component: Label,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
    args: {
        children: "Email address",
    },
};

export const WithHtmlFor: Story = {
    args: {
        children: "Username",
        htmlFor: "username",
    },
};

export const WithInput: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <input
                id="email"
                type="email"
                className="rounded-md border border-neutral-300 px-3 py-2"
                placeholder="you@example.com"
            />
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            <Label htmlFor="disabled-input" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Disabled field
            </Label>
            <input
                id="disabled-input"
                type="text"
                disabled
                className="peer rounded-md border border-neutral-300 px-3 py-2"
                placeholder="Cannot edit"
            />
        </div>
    ),
};
