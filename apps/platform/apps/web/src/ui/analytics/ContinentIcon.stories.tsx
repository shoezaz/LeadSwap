import type { Meta, StoryObj } from "@storybook/react";
import ContinentIcon from "./continent-icon";

const meta: Meta<typeof ContinentIcon> = {
    title: "App/Analytics/ContinentIcon",
    component: ContinentIcon,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        display: {
            control: "select",
            options: ["AF", "AS", "EU", "NA", "OC", "SA", "Unknown"],
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ContinentIcon>;

export const Africa: Story = {
    args: {
        display: "AF",
        className: "h-5 w-5 text-neutral-600",
    },
};

export const Asia: Story = {
    args: {
        display: "AS",
        className: "h-5 w-5 text-neutral-600",
    },
};

export const Europe: Story = {
    args: {
        display: "EU",
        className: "h-5 w-5 text-neutral-600",
    },
};

export const NorthAmerica: Story = {
    args: {
        display: "NA",
        className: "h-5 w-5 text-neutral-600",
    },
};

export const Oceania: Story = {
    args: {
        display: "OC",
        className: "h-5 w-5 text-neutral-600",
    },
};

export const SouthAmerica: Story = {
    args: {
        display: "SA",
        className: "h-5 w-5 text-neutral-600",
    },
};

export const Unknown: Story = {
    args: {
        display: "Unknown",
        className: "h-5 w-5 text-neutral-600",
    },
};

export const AllContinents: Story = {
    render: () => (
        <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
                <ContinentIcon display="AF" className="h-6 w-6 text-neutral-600" />
                <span className="text-xs">Africa</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <ContinentIcon display="AS" className="h-6 w-6 text-neutral-600" />
                <span className="text-xs">Asia</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <ContinentIcon display="EU" className="h-6 w-6 text-neutral-600" />
                <span className="text-xs">Europe</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <ContinentIcon display="NA" className="h-6 w-6 text-neutral-600" />
                <span className="text-xs">N. America</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <ContinentIcon display="OC" className="h-6 w-6 text-neutral-600" />
                <span className="text-xs">Oceania</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <ContinentIcon display="SA" className="h-6 w-6 text-neutral-600" />
                <span className="text-xs">S. America</span>
            </div>
        </div>
    ),
};
