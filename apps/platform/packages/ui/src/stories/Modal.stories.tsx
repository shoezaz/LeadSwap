import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "../modal";
import { Button } from "../button";
import { useState } from "react";

const meta: Meta<typeof Modal> = {
    title: "Layout/Modal",
    component: Modal,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

const ModalWithTrigger = ({ children, title }: { children?: React.ReactNode, title?: string }) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <Button onClick={() => setShowModal(true)} text="Open Modal" />
            <Modal showModal={showModal} setShowModal={setShowModal}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">{title || "Modal Title"}</h2>
                    {children || (
                        <p className="text-neutral-600">
                            This is the modal content. You can put any content here.
                        </p>
                    )}
                    <div className="mt-6 flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            text="Cancel"
                            onClick={() => setShowModal(false)}
                        />
                        <Button
                            variant="primary"
                            text="Confirm"
                            onClick={() => setShowModal(false)}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export const Default: Story = {
    render: () => <ModalWithTrigger />,
};

export const WithCustomContent: Story = {
    render: () => (
        <ModalWithTrigger title="Custom Content">
            <div className="space-y-4">
                <p className="text-neutral-600">
                    This modal has custom content with form elements.
                </p>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full rounded-md border border-neutral-300 px-3 py-2"
                        placeholder="you@example.com"
                    />
                </div>
            </div>
        </ModalWithTrigger>
    ),
};

export const DeleteConfirmation: Story = {
    render: () => {
        const DeleteModal = () => {
            const [showModal, setShowModal] = useState(false);
            return (
                <>
                    <Button variant="danger" onClick={() => setShowModal(true)} text="Delete Item" />
                    <Modal showModal={showModal} setShowModal={setShowModal}>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-2 text-red-600">Delete Item</h2>
                            <p className="text-neutral-600 mb-6">
                                Are you sure you want to delete this item? This action cannot be undone.
                            </p>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="secondary"
                                    text="Cancel"
                                    onClick={() => setShowModal(false)}
                                />
                                <Button
                                    variant="danger"
                                    text="Delete"
                                    onClick={() => setShowModal(false)}
                                />
                            </div>
                        </div>
                    </Modal>
                </>
            );
        };
        return <DeleteModal />;
    },
};
