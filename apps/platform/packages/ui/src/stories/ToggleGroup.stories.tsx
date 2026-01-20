import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup } from "../toggle-group";
import { useState } from "react";
import { Grid, List, Table } from "lucide-react";

const meta: Meta<typeof ToggleGroup> = {
    title: "Navigation/ToggleGroup",
    component: ToggleGroup,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

const ToggleGroupWithState = ({
    options,
    defaultValue,
}: {
    options: { value: string; label: string | React.ReactNode; badge?: React.ReactNode }[];
    defaultValue: string;
}) => {
    const [selected, setSelected] = useState(defaultValue);
    return (
        <ToggleGroup
            options={options}
            selected={selected}
            selectAction={setSelected}
        />
    );
};

export const Default: Story = {
    render: () => (
        <ToggleGroupWithState
            options={[
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
            ]}
            defaultValue="week"
        />
    ),
};

export const WithBadges: Story = {
    render: () => (
        <ToggleGroupWithState
            options={[
                { value: "all", label: "All", badge: <span className="ml-1 rounded-full bg-neutral-200 px-2 py-0.5 text-xs">42</span> },
                { value: "active", label: "Active", badge: <span className="ml-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs">12</span> },
                { value: "archived", label: "Archived", badge: <span className="ml-1 rounded-full bg-neutral-200 px-2 py-0.5 text-xs">30</span> },
            ]}
            defaultValue="all"
        />
    ),
};

export const WithIcons: Story = {
    render: () => {
        const IconToggle = () => {
            const [selected, setSelected] = useState("grid");
            return (
                <ToggleGroup
                    options={[
                        { value: "grid", label: <Grid className="h-4 w-4" /> },
                        { value: "list", label: <List className="h-4 w-4" /> },
                        { value: "table", label: <Table className="h-4 w-4" /> },
                    ]}
                    selected={selected}
                    selectAction={setSelected}
                />
            );
        };
        return <IconToggle />;
    },
};

export const TwoOptions: Story = {
    render: () => (
        <ToggleGroupWithState
            options={[
                { value: "monthly", label: "Monthly" },
                { value: "yearly", label: "Yearly" },
            ]}
            defaultValue="monthly"
        />
    ),
};

export const CustomStyles: Story = {
    render: () => {
        const CustomToggle = () => {
            const [selected, setSelected] = useState("option1");
            return (
                <ToggleGroup
                    options={[
                        { value: "option1", label: "Option 1" },
                        { value: "option2", label: "Option 2" },
                        { value: "option3", label: "Option 3" },
                    ]}
                    selected={selected}
                    selectAction={setSelected}
                    className="bg-neutral-100"
                    indicatorClassName="bg-white shadow-sm"
                />
            );
        };
        return <CustomToggle />;
    },
};
