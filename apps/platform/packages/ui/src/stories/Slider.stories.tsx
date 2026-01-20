import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "../slider";
import { useState } from "react";

const meta: Meta<typeof Slider> = {
    title: "Form/Slider",
    component: Slider,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        value: { control: { type: "range", min: 0, max: 100 } },
        min: { control: "number" },
        max: { control: "number" },
        step: { control: "number" },
        disabled: { control: "boolean" },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Slider>;

const SliderWithState = (props: Partial<Parameters<typeof Slider>[0]>) => {
    const [value, setValue] = useState(props.value ?? 50);
    return (
        <div className="w-64">
            <Slider
                value={value}
                onChange={setValue}
                min={props.min ?? 0}
                max={props.max ?? 100}
                step={props.step}
                marks={props.marks}
                hint={props.hint}
                disabled={props.disabled}
            />
            <p className="mt-4 text-center text-sm text-neutral-600">Value: {value}</p>
        </div>
    );
};

export const Default: Story = {
    render: () => <SliderWithState value={50} min={0} max={100} />,
};

export const WithHint: Story = {
    render: () => (
        <SliderWithState
            value={75}
            min={0}
            max={100}
            hint="Adjust the volume level"
        />
    ),
};

export const CustomMarks: Story = {
    render: () => (
        <SliderWithState
            value={50}
            min={0}
            max={100}
            marks={[0, 25, 50, 75, 100]}
        />
    ),
};

export const StepIncrement: Story = {
    render: () => (
        <SliderWithState
            value={20}
            min={0}
            max={100}
            step={10}
            hint="Steps of 10"
        />
    ),
};

export const Disabled: Story = {
    render: () => (
        <SliderWithState
            value={60}
            min={0}
            max={100}
            disabled
            hint="This slider is disabled"
        />
    ),
};

export const SmallRange: Story = {
    render: () => (
        <SliderWithState
            value={3}
            min={1}
            max={5}
            step={1}
            marks={[1, 2, 3, 4, 5]}
            hint="Rating: 1-5"
        />
    ),
};
