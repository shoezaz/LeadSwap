import type { Meta, StoryObj } from "@storybook/react";
import { Sheet } from "../sheet";
import { Button } from "../button";
import { useState } from "react";

const meta: Meta<typeof Sheet> = {
    title: "Layout/Sheet",
    component: Sheet,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

const SheetWithTrigger = ({ children, title }: { children?: React.ReactNode; title?: string }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="p-4">
            <Button onClick={() => setOpen(true)} text="Open Sheet" />
            <Sheet open={open} onOpenChange={setOpen}>
                <div className="p-6">
                    <Sheet.Title>{title || "Sheet Title"}</Sheet.Title>
                    <Sheet.Description className="mt-2 text-sm text-neutral-600">
                        This is a sheet panel that slides in from the right side.
                    </Sheet.Description>
                    <div className="mt-6">
                        {children || (
                            <p className="text-neutral-700">
                                Sheet content goes here. This panel can contain forms,
                                details, or any interactive content.
                            </p>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Sheet.Close asChild>
                            <Button text="Close" variant="secondary" />
                        </Sheet.Close>
                    </div>
                </div>
            </Sheet>
        </div>
    );
};

export const Default: Story = {
    render: () => <SheetWithTrigger />,
};

export const WithForm: Story = {
    render: () => (
        <SheetWithTrigger title="Edit Settings">
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-neutral-900">Name</label>
                    <input
                        type="text"
                        className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
                        placeholder="Enter your name"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-neutral-900">Email</label>
                    <input
                        type="email"
                        className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
                        placeholder="you@example.com"
                    />
                </div>
            </div>
        </SheetWithTrigger>
    ),
};

export const WithList: Story = {
    render: () => (
        <SheetWithTrigger title="Recent Activity">
            <div className="divide-y divide-neutral-200">
                {["Created new project", "Updated settings", "Invited team member", "Deleted old files"].map(
                    (item, i) => (
                        <div key={i} className="py-3 text-sm text-neutral-700">
                            {item}
                        </div>
                    )
                )}
            </div>
        </SheetWithTrigger>
    ),
};
