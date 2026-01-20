import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from "../alert";
import { AlertCircle, CheckCircle, Info } from "lucide-react";

const meta: Meta<typeof Alert> = {
    title: "Feedback/Alert",
    component: Alert,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "destructive"],
        },
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
    render: () => (
        <Alert className="max-w-md">
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
                This is a default alert with some important information.
            </AlertDescription>
        </Alert>
    ),
};

export const Destructive: Story = {
    render: () => (
        <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Something went wrong. Please try again later.
            </AlertDescription>
        </Alert>
    ),
};

export const Success: Story = {
    render: () => (
        <Alert className="max-w-md border-green-500 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Success</AlertTitle>
            <AlertDescription className="text-green-700">
                Your changes have been saved successfully.
            </AlertDescription>
        </Alert>
    ),
};

export const TitleOnly: Story = {
    render: () => (
        <Alert className="max-w-md">
            <AlertTitle>Heads up!</AlertTitle>
        </Alert>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4 max-w-md">
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>Default variant for general info.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Destructive variant for errors.</AlertDescription>
            </Alert>
        </div>
    ),
};
