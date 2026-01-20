import type { Meta, StoryObj } from "@storybook/react";
import {
    LoadingSpinner,
    LoadingDots,
    LoadingCircle,
    Copy,
    Magic,
    Success,
    Tick,
    Photo,
    ExpandingArrow,
    CrownSmall,
    LockSmall,
    ArrowUpRight2,
} from "../icons";
import {
    Google,
    Github,
    Twitter,
    LinkedIn,
    Facebook,
    Instagram,
    YouTube,
    Slack,
    TikTok,
} from "../icons";
import {
    Typescript,
    Python,
    Go,
    Ruby,
    Php,
} from "../icons";
import {
    CardVisa,
    CardMastercard,
    CardAmex,
    CardDiscover,
} from "../icons";

const meta: Meta = {
    title: "Icons/Gallery",
    parameters: {
        layout: "padded",
    },
};

export default meta;
type Story = StoryObj;

const IconBox = ({ children, name }: { children: React.ReactNode; name: string }) => (
    <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors">
        <div className="h-6 w-6 flex items-center justify-center text-neutral-700">
            {children}
        </div>
        <span className="text-xs text-neutral-500">{name}</span>
    </div>
);

export const Loaders: Story = {
    render: () => (
        <div>
            <h3 className="text-lg font-semibold mb-4">Loading Icons</h3>
            <div className="grid grid-cols-4 gap-4">
                <IconBox name="LoadingSpinner">
                    <LoadingSpinner />
                </IconBox>
                <IconBox name="LoadingDots">
                    <LoadingDots />
                </IconBox>
                <IconBox name="LoadingCircle">
                    <LoadingCircle />
                </IconBox>
            </div>
        </div>
    ),
};

export const UIIcons: Story = {
    render: () => (
        <div>
            <h3 className="text-lg font-semibold mb-4">UI Icons</h3>
            <div className="grid grid-cols-6 gap-4">
                <IconBox name="Copy">
                    <Copy className="h-5 w-5" />
                </IconBox>
                <IconBox name="Magic">
                    <Magic className="h-5 w-5" />
                </IconBox>
                <IconBox name="Success">
                    <Success className="h-5 w-5" />
                </IconBox>
                <IconBox name="Tick">
                    <Tick className="h-5 w-5" />
                </IconBox>
                <IconBox name="Photo">
                    <Photo className="h-5 w-5" />
                </IconBox>
                <IconBox name="ExpandingArrow">
                    <ExpandingArrow className="h-5 w-5" />
                </IconBox>
                <IconBox name="CrownSmall">
                    <CrownSmall className="h-5 w-5" />
                </IconBox>
                <IconBox name="LockSmall">
                    <LockSmall className="h-5 w-5" />
                </IconBox>
                <IconBox name="ArrowUpRight2">
                    <ArrowUpRight2 className="h-5 w-5" />
                </IconBox>
            </div>
        </div>
    ),
};

export const BrandLogos: Story = {
    render: () => (
        <div>
            <h3 className="text-lg font-semibold mb-4">Brand Logos</h3>
            <div className="grid grid-cols-6 gap-4">
                <IconBox name="Google">
                    <Google className="h-5 w-5" />
                </IconBox>
                <IconBox name="Github">
                    <Github className="h-5 w-5" />
                </IconBox>
                <IconBox name="Twitter">
                    <Twitter className="h-5 w-5" />
                </IconBox>
                <IconBox name="LinkedIn">
                    <LinkedIn className="h-5 w-5" />
                </IconBox>
                <IconBox name="Facebook">
                    <Facebook className="h-5 w-5" />
                </IconBox>
                <IconBox name="Instagram">
                    <Instagram className="h-5 w-5" />
                </IconBox>
                <IconBox name="YouTube">
                    <YouTube className="h-5 w-5" />
                </IconBox>
                <IconBox name="Slack">
                    <Slack className="h-5 w-5" />
                </IconBox>
                <IconBox name="TikTok">
                    <TikTok className="h-5 w-5" />
                </IconBox>
            </div>
        </div>
    ),
};

export const SDKIcons: Story = {
    render: () => (
        <div>
            <h3 className="text-lg font-semibold mb-4">SDK / Language Icons</h3>
            <div className="grid grid-cols-6 gap-4">
                <IconBox name="TypeScript">
                    <Typescript className="h-5 w-5" />
                </IconBox>
                <IconBox name="Python">
                    <Python className="h-5 w-5" />
                </IconBox>
                <IconBox name="Go">
                    <Go className="h-5 w-5" />
                </IconBox>
                <IconBox name="Ruby">
                    <Ruby className="h-5 w-5" />
                </IconBox>
                <IconBox name="PHP">
                    <Php className="h-5 w-5" />
                </IconBox>
            </div>
        </div>
    ),
};

export const PaymentCards: Story = {
    render: () => (
        <div>
            <h3 className="text-lg font-semibold mb-4">Payment Card Icons</h3>
            <div className="grid grid-cols-4 gap-4">
                <IconBox name="Visa">
                    <CardVisa className="h-6 w-10" />
                </IconBox>
                <IconBox name="Mastercard">
                    <CardMastercard className="h-6 w-10" />
                </IconBox>
                <IconBox name="Amex">
                    <CardAmex className="h-6 w-10" />
                </IconBox>
                <IconBox name="Discover">
                    <CardDiscover className="h-6 w-10" />
                </IconBox>
            </div>
        </div>
    ),
};

export const AllIcons: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Loading Icons</h3>
                <div className="grid grid-cols-8 gap-4">
                    <IconBox name="LoadingSpinner">
                        <LoadingSpinner />
                    </IconBox>
                    <IconBox name="LoadingDots">
                        <LoadingDots />
                    </IconBox>
                    <IconBox name="LoadingCircle">
                        <LoadingCircle />
                    </IconBox>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">UI Icons</h3>
                <div className="grid grid-cols-8 gap-4">
                    <IconBox name="Copy">
                        <Copy className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="Magic">
                        <Magic className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="Success">
                        <Success className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="Tick">
                        <Tick className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="Photo">
                        <Photo className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="CrownSmall">
                        <CrownSmall className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="LockSmall">
                        <LockSmall className="h-5 w-5" />
                    </IconBox>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Brand Logos</h3>
                <div className="grid grid-cols-8 gap-4">
                    <IconBox name="Google">
                        <Google className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="Github">
                        <Github className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="Twitter">
                        <Twitter className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="LinkedIn">
                        <LinkedIn className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="Facebook">
                        <Facebook className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="Instagram">
                        <Instagram className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="YouTube">
                        <YouTube className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="Slack">
                        <Slack className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="TikTok">
                        <TikTok className="h-5 w-5" />
                    </IconBox>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">SDK Icons</h3>
                <div className="grid grid-cols-8 gap-4">
                    <IconBox name="TypeScript">
                        <Typescript className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="Python">
                        <Python className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="Go">
                        <Go className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="Ruby">
                        <Ruby className="h-5 w-5" />
                    </IconBox>
                    <IconBox name="PHP">
                        <Php className="h-5 w-5" />
                    </IconBox>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Payment Cards</h3>
                <div className="grid grid-cols-8 gap-4">
                    <IconBox name="Visa">
                        <CardVisa className="h-6 w-10" />
                    </IconBox>
                    <IconBox name="Mastercard">
                        <CardMastercard className="h-6 w-10" />
                    </IconBox>
                    <IconBox name="Amex">
                        <CardAmex className="h-6 w-10" />
                    </IconBox>
                    <IconBox name="Discover">
                        <CardDiscover className="h-6 w-10" />
                    </IconBox>
                </div>
            </div>
        </div>
    ),
};
