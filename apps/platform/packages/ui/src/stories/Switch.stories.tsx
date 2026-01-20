import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch } from "../switch";

const meta: Meta<typeof Switch> = {
    title: "Components/Switch",
    component: Switch,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        checked: { control: "boolean" },
        loading: { control: "boolean" },
        disabled: { control: "boolean" },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
    args: {
        checked: true,
    },
};

export const Unchecked: Story = {
    args: {
        checked: false,
    },
};

export const Loading: Story = {
    args: {
        loading: true,
    },
};

export const Disabled: Story = {
    args: {
        checked: true,
        disabled: true,
    },
};

const InteractiveSwitch = () => {
    const [checked, setChecked] = useState(false);
    return (
        <div className="flex items-center gap-3">
            <Switch checked={checked} fn={setChecked} />
            <span className="text-sm text-neutral-600">
                {checked ? "Enabled" : "Disabled"}
            </span>
        </div>
    );
};

export const Interactive: Story = {
    render: () => <InteractiveSwitch />,
};

export const AllStates: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <Switch checked={true} />
                <span className="text-sm text-neutral-600">Checked</span>
            </div>
            <div className="flex items-center gap-3">
                <Switch checked={false} />
                <span className="text-sm text-neutral-600">Unchecked</span>
            </div>
            <div className="flex items-center gap-3">
                <Switch loading />
                <span className="text-sm text-neutral-600">Loading</span>
            </div>
            <div className="flex items-center gap-3">
                <Switch checked disabled />
                <span className="text-sm text-neutral-600">Disabled</span>
            </div>
        </div>
    ),
};
