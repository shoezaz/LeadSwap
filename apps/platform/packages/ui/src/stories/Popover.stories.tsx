import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "../popover";
import { Button } from "../button";
import { useState } from "react";

const meta: Meta<typeof Popover> = {
    title: "Layout/Popover",
    component: Popover,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        align: {
            control: "select",
            options: ["start", "center", "end"],
        },
        side: {
            control: "select",
            options: ["top", "bottom", "left", "right"],
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Popover>;

const PopoverWithState = ({
    align = "center",
    side = "bottom",
    content,
}: {
    align?: "start" | "center" | "end";
    side?: "top" | "bottom" | "left" | "right";
    content?: React.ReactNode;
}) => {
    const [open, setOpen] = useState(false);
    return (
        <Popover
            openPopover={open}
            setOpenPopover={setOpen}
            align={align}
            side={side}
            content={
                content || (
                    <div className="p-4 w-64">
                        <h3 className="font-medium text-sm mb-2">Popover Content</h3>
                        <p className="text-sm text-neutral-600">
                            This is a popover with some content inside it.
                        </p>
                    </div>
                )
            }
        >
            <Button text="Open Popover" onClick={() => setOpen(!open)} />
        </Popover>
    );
};

export const Default: Story = {
    render: () => <PopoverWithState />,
};

export const AlignStart: Story = {
    render: () => <PopoverWithState align="start" />,
};

export const AlignEnd: Story = {
    render: () => <PopoverWithState align="end" />,
};

export const SideTop: Story = {
    render: () => (
        <div className="pt-48">
            <PopoverWithState side="top" />
        </div>
    ),
};

export const SideLeft: Story = {
    render: () => (
        <div className="pl-64">
            <PopoverWithState side="left" />
        </div>
    ),
};

export const SideRight: Story = {
    render: () => <PopoverWithState side="right" />,
};

export const WithMenu: Story = {
    render: () => {
        const MenuPopover = () => {
            const [open, setOpen] = useState(false);
            return (
                <Popover
                    openPopover={open}
                    setOpenPopover={setOpen}
                    content={
                        <div className="py-2 w-48">
                            {["Edit", "Duplicate", "Archive", "Delete"].map((item) => (
                                <button
                                    key={item}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100"
                                    onClick={() => setOpen(false)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    }
                >
                    <Button text="Actions" onClick={() => setOpen(!open)} variant="secondary" />
                </Popover>
            );
        };
        return <MenuPopover />;
    },
};
