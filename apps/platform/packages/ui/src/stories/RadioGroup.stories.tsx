import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import { Label } from "../label";

const meta: Meta<typeof RadioGroup> = {
    title: "Form/RadioGroup",
    component: RadioGroup,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
    render: () => (
        <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">Option One</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">Option Two</Label>
            </div>
        </RadioGroup>
    ),
};

export const WithThreeOptions: Story = {
    render: () => (
        <RadioGroup defaultValue="monthly">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly">Weekly</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="yearly" id="yearly" />
                <Label htmlFor="yearly">Yearly</Label>
            </div>
        </RadioGroup>
    ),
};

export const Disabled: Story = {
    render: () => (
        <RadioGroup defaultValue="option-one" disabled>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="d-option-one" />
                <Label htmlFor="d-option-one">Disabled Option One</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="d-option-two" />
                <Label htmlFor="d-option-two">Disabled Option Two</Label>
            </div>
        </RadioGroup>
    ),
};

export const Horizontal: Story = {
    render: () => (
        <RadioGroup defaultValue="left" className="flex flex-row gap-4">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="left" />
                <Label htmlFor="left">Left</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="center" id="center" />
                <Label htmlFor="center">Center</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="right" id="right" />
                <Label htmlFor="right">Right</Label>
            </div>
        </RadioGroup>
    ),
};
