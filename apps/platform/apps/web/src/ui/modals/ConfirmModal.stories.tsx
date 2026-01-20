import type { Meta, StoryObj } from "@storybook/react";
import { useConfirmModal } from "./confirm-modal";
import { Button } from "@leadswap/ui";
import { useState } from "react";

const meta: Meta = {
    title: "App/Modals/ConfirmModal",
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

const ConfirmModalDemo = ({
    title,
    description,
    confirmText,
    cancelText,
}: {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
}) => {
    const { setShowConfirmModal, confirmModal } = useConfirmModal({
        title,
        description,
        confirmText,
        cancelText,
        onConfirm: async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Confirmed!");
        },
    });

    return (
        <>
            <Button text="Open Modal" onClick={() => setShowConfirmModal(true)} />
            {confirmModal}
        </>
    );
};

export const Default: Story = {
    render: () => (
        <ConfirmModalDemo
            title="Confirm action"
            description="Are you sure you want to proceed with this action?"
        />
    ),
};

export const DeleteConfirmation: Story = {
    render: () => (
        <ConfirmModalDemo
            title="Delete item"
            description="This action cannot be undone. Are you sure you want to delete this item?"
            confirmText="Delete"
            cancelText="Keep"
        />
    ),
};

export const SaveChanges: Story = {
    render: () => (
        <ConfirmModalDemo
            title="Save changes?"
            description="You have unsaved changes. Do you want to save them before leaving?"
            confirmText="Save"
            cancelText="Discard"
        />
    ),
};

export const SimpleConfirm: Story = {
    render: () => (
        <ConfirmModalDemo
            title="Proceed?"
        />
    ),
};
