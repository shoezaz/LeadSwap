import type { Meta, StoryObj } from "@storybook/react";
import { TabSelect } from "../tab-select";
import { useState } from "react";

const meta: Meta<typeof TabSelect> = {
    title: "Navigation/TabSelect",
    component: TabSelect,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "accent"],
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TabSelect>;

const TabSelectWithState = ({
    options,
    defaultValue,
    variant,
}: {
    options: { id: string; label: string }[];
    defaultValue: string;
    variant?: "default" | "accent";
}) => {
    const [selected, setSelected] = useState(defaultValue);
    return (
        <TabSelect
            options={options}
            selected={selected}
            onSelect={setSelected}
            variant={variant}
        />
    );
};

export const Default: Story = {
    render: () => (
        <TabSelectWithState
            options={[
                { id: "overview", label: "Overview" },
                { id: "analytics", label: "Analytics" },
                { id: "settings", label: "Settings" },
            ]}
            defaultValue="overview"
        />
    ),
};

export const AccentVariant: Story = {
    render: () => (
        <TabSelectWithState
            options={[
                { id: "overview", label: "Overview" },
                { id: "analytics", label: "Analytics" },
                { id: "settings", label: "Settings" },
            ]}
            defaultValue="analytics"
            variant="accent"
        />
    ),
};

export const TwoTabs: Story = {
    render: () => (
        <TabSelectWithState
            options={[
                { id: "active", label: "Active" },
                { id: "archived", label: "Archived" },
            ]}
            defaultValue="active"
        />
    ),
};

export const ManyTabs: Story = {
    render: () => (
        <TabSelectWithState
            options={[
                { id: "all", label: "All" },
                { id: "pending", label: "Pending" },
                { id: "active", label: "Active" },
                { id: "completed", label: "Completed" },
                { id: "archived", label: "Archived" },
            ]}
            defaultValue="all"
        />
    ),
};

export const WithExternalLink: Story = {
    render: () => {
        const [selected, setSelected] = useState("overview");
        return (
            <TabSelect
                options={[
                    { id: "overview", label: "Overview" },
                    { id: "analytics", label: "Analytics" },
                    { id: "docs", label: "Documentation", href: "https://example.com", target: "_blank" },
                ]}
                selected={selected}
                onSelect={setSelected}
            />
        );
    },
};
