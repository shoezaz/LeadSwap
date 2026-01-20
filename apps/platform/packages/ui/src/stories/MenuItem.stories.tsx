import type { Meta, StoryObj } from "@storybook/react";
import { MenuItem } from "../menu-item";
import { Settings, Trash2, Copy, Download, Edit, User } from "lucide-react";

const meta: Meta<typeof MenuItem> = {
    title: "Navigation/MenuItem",
    component: MenuItem,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "danger"],
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MenuItem>;

export const Default: Story = {
    render: () => (
        <div className="w-48 rounded-md border border-neutral-200 bg-white p-1">
            <MenuItem>Default Item</MenuItem>
        </div>
    ),
};

export const WithIcon: Story = {
    render: () => (
        <div className="w-48 rounded-md border border-neutral-200 bg-white p-1">
            <MenuItem icon={Settings}>Settings</MenuItem>
        </div>
    ),
};

export const WithShortcut: Story = {
    render: () => (
        <div className="w-48 rounded-md border border-neutral-200 bg-white p-1">
            <MenuItem icon={Copy} shortcut="⌘C">Copy</MenuItem>
        </div>
    ),
};

export const Danger: Story = {
    render: () => (
        <div className="w-48 rounded-md border border-neutral-200 bg-white p-1">
            <MenuItem variant="danger" icon={Trash2}>Delete</MenuItem>
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div className="w-48 rounded-md border border-neutral-200 bg-white p-1">
            <MenuItem icon={Edit} disabledTooltip="You need permission to edit">
                Edit
            </MenuItem>
        </div>
    ),
};

export const MenuExample: Story = {
    render: () => (
        <div className="w-56 rounded-md border border-neutral-200 bg-white p-1 shadow-lg">
            <MenuItem icon={User}>Profile</MenuItem>
            <MenuItem icon={Settings} shortcut="⌘,">Settings</MenuItem>
            <MenuItem icon={Copy} shortcut="⌘C">Copy Link</MenuItem>
            <MenuItem icon={Download}>Download</MenuItem>
            <div className="my-1 border-t border-neutral-200" />
            <MenuItem variant="danger" icon={Trash2}>Delete</MenuItem>
        </div>
    ),
};

export const AsLink: Story = {
    render: () => (
        <div className="w-48 rounded-md border border-neutral-200 bg-white p-1">
            <MenuItem as="a" href="#" icon={User}>
                View Profile
            </MenuItem>
        </div>
    ),
};
