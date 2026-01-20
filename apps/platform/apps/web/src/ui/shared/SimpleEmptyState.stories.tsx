import type { Meta, StoryObj } from "@storybook/react";
import { SimpleEmptyState } from "./simple-empty-state";
import { Button } from "@leadswap/ui";
import { Inbox, Users, FolderOpen, Search } from "lucide-react";

const meta: Meta<typeof SimpleEmptyState> = {
    title: "App/Shared/SimpleEmptyState",
    component: SimpleEmptyState,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SimpleEmptyState>;

export const Default: Story = {
    args: {
        title: "No items found",
        description: "There are no items to display at the moment.",
    },
};

export const WithGraphic: Story = {
    args: {
        title: "No creators yet",
        description: "Start by inviting your first creator to the program.",
        graphic: (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100">
                <Users className="h-8 w-8 text-neutral-400" />
            </div>
        ),
    },
};

export const WithPill: Story = {
    args: {
        title: "Pro feature",
        description: "Upgrade to Pro to unlock this feature.",
        pillContent: "Pro",
    },
};

export const WithAddButton: Story = {
    args: {
        title: "No folders created",
        description: "Create a folder to organize your links.",
        graphic: (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100">
                <FolderOpen className="h-8 w-8 text-neutral-400" />
            </div>
        ),
        addButton: <Button text="Create Folder" />,
    },
};

export const WithLearnMore: Story = {
    args: {
        title: "No results found",
        description: "Try adjusting your search or filter to find what you're looking for.",
        graphic: (
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-neutral-100">
                <Search className="h-8 w-8 text-neutral-400" />
            </div>
        ),
        learnMoreHref: "https://cliqo.com/help",
        learnMoreText: "Learn more",
    },
};

export const WithButtonAndLearnMore: Story = {
    args: {
        title: "No links found",
        description: "Create your first short link to get started.",
        addButton: <Button text="Create Link" />,
        learnMoreHref: "https://cliqo.com/help",
    },
};
