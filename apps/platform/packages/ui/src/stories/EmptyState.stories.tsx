import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "../empty-state";
import { Button } from "../button";
import { FileSearch, Inbox, Users, FolderOpen } from "lucide-react";

const meta: Meta<typeof EmptyState> = {
    title: "Layout/EmptyState",
    component: EmptyState,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
    args: {
        icon: Inbox,
        title: "No items found",
        description: "There are no items to display at the moment.",
    },
};

export const WithLearnMore: Story = {
    args: {
        icon: FileSearch,
        title: "No results",
        description: "We couldn't find any results matching your query.",
        learnMore: "https://example.com/docs",
    },
};

export const WithAction: Story = {
    render: () => (
        <EmptyState
            icon={Users}
            title="No team members"
            description="You haven't added any team members yet."
        >
            <Button text="Add Team Member" variant="primary" />
        </EmptyState>
    ),
};

export const WithMultipleActions: Story = {
    render: () => (
        <EmptyState
            icon={FolderOpen}
            title="No projects"
            description="Get started by creating your first project."
        >
            <div className="flex gap-2">
                <Button text="Create Project" variant="primary" />
                <Button text="Import" variant="secondary" />
            </div>
        </EmptyState>
    ),
};

export const Simple: Story = {
    args: {
        icon: Inbox,
        title: "Nothing here",
    },
};
