import type { Meta, StoryObj } from "@storybook/react";
import { BackLink } from "./back-link";

const meta: Meta<typeof BackLink> = {
    title: "App/Shared/BackLink",
    component: BackLink,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BackLink>;

export const Default: Story = {
    args: {
        href: "#",
        children: "Back",
    },
};

export const BackToHome: Story = {
    args: {
        href: "/",
        children: "Back to Home",
    },
};

export const BackToSettings: Story = {
    args: {
        href: "/settings",
        children: "Back to Settings",
    },
};

export const BackToDashboard: Story = {
    args: {
        href: "/dashboard",
        children: "Back to Dashboard",
    },
};

export const CustomStyled: Story = {
    args: {
        href: "#",
        children: "Go Back",
        className: "text-blue-600 hover:text-blue-700",
    },
};
