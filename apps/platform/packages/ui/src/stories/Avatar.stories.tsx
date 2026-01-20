import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, TokenAvatar } from "../avatar";

const meta: Meta<typeof Avatar> = {
    title: "Components/Avatar",
    component: Avatar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
    args: {
        user: {
            id: "user_123",
            name: "John Doe",
            email: "john@example.com",
        },
    },
};

export const WithImage: Story = {
    args: {
        user: {
            id: "user_456",
            name: "Jane Smith",
            email: "jane@example.com",
            image: "https://avatars.githubusercontent.com/u/1?v=4",
        },
    },
};

export const WithEmail: Story = {
    args: {
        user: {
            id: "user_789",
            name: "Bob Wilson",
            email: "bob.wilson@example.com",
        },
    },
};

export const Loading: Story = {
    args: {
        user: undefined,
    },
};

export const CustomSize: Story = {
    args: {
        user: {
            id: "user_123",
            name: "John Doe",
            email: "john@example.com",
        },
        className: "h-16 w-16",
    },
};

export const SmallSize: Story = {
    args: {
        user: {
            id: "user_123",
            name: "John Doe",
            email: "john@example.com",
        },
        className: "h-6 w-6",
    },
};

const TokenAvatarStory = () => (
    <div className="flex gap-4">
        <TokenAvatar id="token_abc123" />
        <TokenAvatar id="token_def456" />
        <TokenAvatar id="token_ghi789" />
        <TokenAvatar id="token_jkl012" />
    </div>
);

export const TokenAvatars: Story = {
    render: () => <TokenAvatarStory />,
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Avatar
                user={{ id: "1", name: "User 1", email: "user1@example.com" }}
                className="h-6 w-6"
            />
            <Avatar
                user={{ id: "2", name: "User 2", email: "user2@example.com" }}
                className="h-8 w-8"
            />
            <Avatar
                user={{ id: "3", name: "User 3", email: "user3@example.com" }}
                className="h-10 w-10"
            />
            <Avatar
                user={{ id: "4", name: "User 4", email: "user4@example.com" }}
                className="h-12 w-12"
            />
            <Avatar
                user={{ id: "5", name: "User 5", email: "user5@example.com" }}
                className="h-16 w-16"
            />
        </div>
    ),
};
