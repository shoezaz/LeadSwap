import type { Meta, StoryObj } from "@storybook/react";
import { EmojiPicker } from "./emoji-picker";
import { useState } from "react";

const meta: Meta<typeof EmojiPicker> = {
    title: "App/Shared/EmojiPicker",
    component: EmojiPicker,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmojiPicker>;

const EmojiPickerWithState = () => {
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    return (
        <div className="flex flex-col items-center gap-4">
            <EmojiPicker onSelect={setSelectedEmoji} />
            {selectedEmoji && (
                <div className="text-center">
                    <p className="text-sm text-neutral-500">Selected:</p>
                    <span className="text-4xl">{selectedEmoji}</span>
                </div>
            )}
        </div>
    );
};

export const Default: Story = {
    render: () => <EmojiPickerWithState />,
};

export const InContext: Story = {
    render: () => {
        const [emoji, setEmoji] = useState("📝");
        return (
            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4">
                <span className="text-2xl">{emoji}</span>
                <div className="flex-1">
                    <input
                        type="text"
                        defaultValue="My Project"
                        className="w-full rounded border border-neutral-300 px-3 py-2"
                    />
                </div>
                <EmojiPicker onSelect={setEmoji} />
            </div>
        );
    },
};
