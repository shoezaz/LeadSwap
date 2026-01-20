import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "../checkbox";

const meta: Meta<typeof Checkbox> = {
    title: "Components/Checkbox",
    component: Checkbox,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args: {},
};

export const Checked: Story = {
    args: {
        checked: true,
    },
};

export const Unchecked: Story = {
    args: {
        checked: false,
    },
};

export const Indeterminate: Story = {
    args: {
        checked: "indeterminate",
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};

export const DisabledChecked: Story = {
    args: {
        disabled: true,
        checked: true,
    },
};

const InteractiveCheckbox = () => {
    const [checked, setChecked] = useState(false);
    return (
        <div className="flex items-center gap-3">
            <Checkbox
                checked={checked}
                onCheckedChange={(value) => setChecked(value === true)}
            />
            <label className="text-sm text-neutral-600">
                {checked ? "Checked" : "Unchecked"}
            </label>
        </div>
    );
};

export const Interactive: Story = {
    render: () => <InteractiveCheckbox />,
};

export const WithLabel: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Checkbox id="terms" />
            <label htmlFor="terms" className="text-sm text-neutral-600">
                Accept terms and conditions
            </label>
        </div>
    ),
};

export const AllStates: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <Checkbox checked={false} />
                <span className="text-sm text-neutral-600">Unchecked</span>
            </div>
            <div className="flex items-center gap-3">
                <Checkbox checked={true} />
                <span className="text-sm text-neutral-600">Checked</span>
            </div>
            <div className="flex items-center gap-3">
                <Checkbox checked="indeterminate" />
                <span className="text-sm text-neutral-600">Indeterminate</span>
            </div>
            <div className="flex items-center gap-3">
                <Checkbox disabled />
                <span className="text-sm text-neutral-600">Disabled</span>
            </div>
            <div className="flex items-center gap-3">
                <Checkbox disabled checked />
                <span className="text-sm text-neutral-600">Disabled Checked</span>
            </div>
        </div>
    ),
};
