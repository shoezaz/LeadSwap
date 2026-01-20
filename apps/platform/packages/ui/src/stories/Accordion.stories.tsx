import type { Meta, StoryObj } from "@storybook/react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../accordion";

const meta: Meta<typeof Accordion> = {
    title: "Components/Accordion",
    component: Accordion,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
    render: () => (
        <Accordion type="single" collapsible className="w-96">
            <AccordionItem value="item-1">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                    Yes. It comes with beautiful default styles that matches the design system.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                    Yes. It's animated by default with smooth transitions.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};

export const PlusVariant: Story = {
    render: () => (
        <Accordion type="single" collapsible className="w-96">
            <AccordionItem value="item-1">
                <AccordionTrigger variant="plus">What is Cliqo?</AccordionTrigger>
                <AccordionContent>
                    Cliqo is the open-source link management platform for modern marketing teams.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger variant="plus">How does it work?</AccordionTrigger>
                <AccordionContent>
                    Create short links, track analytics, and manage your links all in one place.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger variant="plus">Is it free?</AccordionTrigger>
                <AccordionContent>
                    Yes, we have a generous free tier. Upgrade to Pro for more features.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};

export const Multiple: Story = {
    render: () => (
        <Accordion type="multiple" className="w-96">
            <AccordionItem value="item-1">
                <AccordionTrigger>First section</AccordionTrigger>
                <AccordionContent>
                    This accordion allows multiple sections to be open at the same time.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Second section</AccordionTrigger>
                <AccordionContent>
                    Try clicking on multiple sections - they'll all stay open!
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Third section</AccordionTrigger>
                <AccordionContent>
                    This is useful for displaying multiple pieces of related content.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};

export const DefaultOpen: Story = {
    render: () => (
        <Accordion type="single" collapsible defaultValue="item-2" className="w-96">
            <AccordionItem value="item-1">
                <AccordionTrigger>First question</AccordionTrigger>
                <AccordionContent>
                    This is the first answer.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Second question (default open)</AccordionTrigger>
                <AccordionContent>
                    This section is open by default using the defaultValue prop.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Third question</AccordionTrigger>
                <AccordionContent>
                    This is the third answer.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};
