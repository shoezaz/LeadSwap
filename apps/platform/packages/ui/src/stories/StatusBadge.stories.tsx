import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "../status-badge";

const meta: Meta<typeof StatusBadge> = {
    title: "Data Display/StatusBadge",
    component: StatusBadge,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["neutral", "new", "success", "pending", "warning", "error"],
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Neutral: Story = {
    args: {
        variant: "neutral",
        children: "Neutral",
    },
};

export const New: Story = {
    args: {
        variant: "new",
        children: "New",
    },
};

export const Success: Story = {
    args: {
        variant: "success",
        children: "Success",
    },
};

export const Pending: Story = {
    args: {
        variant: "pending",
        children: "Pending",
    },
};

export const Warning: Story = {
    args: {
        variant: "warning",
        children: "Warning",
    },
};

export const Error: Story = {
    args: {
        variant: "error",
        children: "Error",
    },
};

export const WithTooltip: Story = {
    args: {
        variant: "pending",
        children: "Processing",
        tooltip: "This operation is currently being processed",
    },
};

export const NoIcon: Story = {
    args: {
        variant: "success",
        children: "Completed",
        icon: null,
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-2">
            <StatusBadge variant="neutral">Neutral</StatusBadge>
            <StatusBadge variant="new">New</StatusBadge>
            <StatusBadge variant="success">Success</StatusBadge>
            <StatusBadge variant="pending">Pending</StatusBadge>
            <StatusBadge variant="warning">Warning</StatusBadge>
            <StatusBadge variant="error">Error</StatusBadge>
        </div>
    ),
};
