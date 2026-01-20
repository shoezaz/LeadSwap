import type { Meta, StoryObj } from "@storybook/react";
import { NumberStepper } from "../number-stepper";
import { useState } from "react";

const meta: Meta<typeof NumberStepper> = {
    title: "Form/NumberStepper",
    component: NumberStepper,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        min: { control: "number" },
        max: { control: "number" },
        step: { control: "number" },
        disabled: { control: "boolean" },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NumberStepper>;

const NumberStepperWithState = (props: Partial<Parameters<typeof NumberStepper>[0]>) => {
    const [value, setValue] = useState(props.value ?? 5);
    return (
        <div className="w-64">
            <NumberStepper
                value={value}
                onChange={setValue}
                min={props.min}
                max={props.max}
                step={props.step}
                disabled={props.disabled}
                formatValue={props.formatValue}
            />
        </div>
    );
};

export const Default: Story = {
    render: () => <NumberStepperWithState value={5} />,
};

export const WithMinMax: Story = {
    render: () => <NumberStepperWithState value={3} min={1} max={10} />,
};

export const WithStep: Story = {
    render: () => <NumberStepperWithState value={10} min={0} max={100} step={10} />,
};

export const WithFormatValue: Story = {
    render: () => (
        <NumberStepperWithState
            value={50}
            min={0}
            max={100}
            step={10}
            formatValue={(v) => `${v}%`}
        />
    ),
};

export const CurrencyFormat: Story = {
    render: () => (
        <NumberStepperWithState
            value={25}
            min={0}
            max={1000}
            step={5}
            formatValue={(v) => `$${v}`}
        />
    ),
};

export const Disabled: Story = {
    render: () => <NumberStepperWithState value={7} disabled />,
};

export const AtMinimum: Story = {
    render: () => <NumberStepperWithState value={0} min={0} max={10} />,
};

export const AtMaximum: Story = {
    render: () => <NumberStepperWithState value={10} min={0} max={10} />,
};
