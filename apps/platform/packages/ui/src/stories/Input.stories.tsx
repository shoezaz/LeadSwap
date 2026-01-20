import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../input";

const meta: Meta<typeof Input> = {
    title: "Components/Input",
    component: Input,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        type: {
            control: "select",
            options: ["text", "email", "password", "number", "url"],
        },
        disabled: { control: "boolean" },
        readOnly: { control: "boolean" },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        placeholder: "Enter text...",
        type: "text",
    },
};

export const Email: Story = {
    args: {
        placeholder: "Enter your email...",
        type: "email",
    },
};

export const Password: Story = {
    args: {
        placeholder: "Enter password...",
        type: "password",
        defaultValue: "secretpassword123",
    },
};

export const WithValue: Story = {
    args: {
        type: "text",
        defaultValue: "Hello World",
    },
};

export const WithError: Story = {
    args: {
        placeholder: "Enter email...",
        type: "email",
        error: "Please enter a valid email address",
        defaultValue: "invalid-email",
    },
};

export const Disabled: Story = {
    args: {
        placeholder: "Disabled input",
        disabled: true,
    },
};

export const ReadOnly: Story = {
    args: {
        value: "Read only value",
        readOnly: true,
    },
};

export const Number: Story = {
    args: {
        type: "number",
        placeholder: "Enter a number...",
        min: 0,
        max: 100,
    },
};

export const AllStates: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-80">
            <Input placeholder="Default input" />
            <Input placeholder="With value" defaultValue="Some value" />
            <Input type="password" placeholder="Password" defaultValue="secret123" />
            <Input error="This field has an error" defaultValue="Invalid" />
            <Input disabled placeholder="Disabled" />
            <Input readOnly value="Read only" />
        </div>
    ),
};
