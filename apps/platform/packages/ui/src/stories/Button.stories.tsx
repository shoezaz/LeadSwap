import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Copy, Settings, Plus } from "lucide-react";

const meta: Meta<typeof Button> = {
    title: "Components/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "secondary", "outline", "success", "danger", "danger-outline"],
        },
        loading: { control: "boolean" },
        disabled: { control: "boolean" },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        text: "Primary Button",
        variant: "primary",
    },
};

export const Secondary: Story = {
    args: {
        text: "Secondary Button",
        variant: "secondary",
    },
};

export const Outline: Story = {
    args: {
        text: "Outline Button",
        variant: "outline",
    },
};

export const Success: Story = {
    args: {
        text: "Success Button",
        variant: "success",
    },
};

export const Danger: Story = {
    args: {
        text: "Danger Button",
        variant: "danger",
    },
};

export const DangerOutline: Story = {
    args: {
        text: "Danger Outline",
        variant: "danger-outline",
    },
};

export const WithIcon: Story = {
    args: {
        text: "Copy Link",
        variant: "secondary",
        icon: <Copy className="h-4 w-4" />,
    },
};

export const WithShortcut: Story = {
    args: {
        text: "Settings",
        variant: "secondary",
        icon: <Settings className="h-4 w-4" />,
        shortcut: "⌘K",
    },
};

export const Loading: Story = {
    args: {
        text: "Loading...",
        variant: "primary",
        loading: true,
    },
};

export const Disabled: Story = {
    args: {
        text: "Disabled",
        variant: "primary",
        disabled: true,
    },
};

export const IconOnly: Story = {
    args: {
        icon: <Plus className="h-4 w-4" />,
        variant: "secondary",
        className: "w-10",
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <Button text="Primary" variant="primary" />
                <Button text="Secondary" variant="secondary" />
                <Button text="Outline" variant="outline" />
            </div>
            <div className="flex gap-4">
                <Button text="Success" variant="success" />
                <Button text="Danger" variant="danger" />
                <Button text="Danger Outline" variant="danger-outline" />
            </div>
            <div className="flex gap-4">
                <Button text="With Icon" variant="secondary" icon={<Copy className="h-4 w-4" />} />
                <Button text="Loading" variant="primary" loading />
                <Button text="Disabled" variant="primary" disabled />
            </div>
        </div>
    ),
};
