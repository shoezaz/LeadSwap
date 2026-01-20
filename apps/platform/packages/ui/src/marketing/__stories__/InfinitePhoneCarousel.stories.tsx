import type { Meta, StoryObj } from "@storybook/react";
import {
  InfinitePhoneCarousel,
  HeroPhoneCarousel,
  CompactPhoneCarousel,
  DEFAULT_PHONE_COLUMNS,
  type PhoneColumn,
} from "../infinite-phone-carousel";

const meta: Meta<typeof InfinitePhoneCarousel> = {
  title: "Marketing/InfinitePhoneCarousel",
  component: InfinitePhoneCarousel,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0a0a0a" },
        { name: "gradient", value: "linear-gradient(to bottom, #1a1a2e, #0a0a0a)" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    phoneWidth: {
      control: { type: "range", min: 80, max: 200, step: 10 },
      description: "Width of each phone card in pixels",
    },
    phoneHeight: {
      control: { type: "range", min: 140, max: 350, step: 10 },
      description: "Height of each phone card in pixels",
    },
    gap: {
      control: { type: "range", min: 4, max: 24, step: 2 },
      description: "Gap between phone cards in pixels",
    },
    overlayGradient: {
      control: "boolean",
      description: "Show fade gradient overlay at top and bottom",
    },
    overlayColor: {
      control: "color",
      description: "Color for the overlay gradient",
    },
  },
};

export default meta;
type Story = StoryObj<typeof InfinitePhoneCarousel>;

// Default story with all controls
export const Default: Story = {
  args: {
    columns: DEFAULT_PHONE_COLUMNS,
    phoneWidth: 120,
    phoneHeight: 213,
    gap: 10,
    overlayGradient: true,
    overlayColor: "rgba(0, 0, 0, 0.3)",
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-full bg-neutral-950 flex items-center justify-center">
        <div className="h-[700px] w-full">
          <Story />
        </div>
      </div>
    ),
  ],
};

// Hero section variant (larger phones)
export const HeroVariant: Story = {
  render: () => (
    <div className="h-screen w-full bg-gradient-to-b from-neutral-900 to-neutral-950 flex items-center justify-center">
      <HeroPhoneCarousel />
    </div>
  ),
};

// Compact variant (smaller phones)
export const CompactVariant: Story = {
  render: () => (
    <div className="h-screen w-full bg-neutral-950 flex items-center justify-center">
      <CompactPhoneCarousel />
    </div>
  ),
};

// Single column
export const SingleColumn: Story = {
  args: {
    columns: [DEFAULT_PHONE_COLUMNS[0]],
    phoneWidth: 140,
    phoneHeight: 249,
    overlayGradient: true,
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-full bg-neutral-950 flex items-center justify-center">
        <div className="h-[700px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

// Five columns layout
const fiveColumns: PhoneColumn[] = [
  ...DEFAULT_PHONE_COLUMNS,
  {
    images: DEFAULT_PHONE_COLUMNS[0].images,
    direction: "down",
    speed: 22,
  },
  {
    images: DEFAULT_PHONE_COLUMNS[1].images,
    direction: "up",
    speed: 28,
  },
];

export const FiveColumns: Story = {
  args: {
    columns: fiveColumns,
    phoneWidth: 100,
    phoneHeight: 178,
    gap: 8,
    overlayGradient: true,
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-full bg-neutral-950 flex items-center justify-center">
        <div className="h-[600px] w-full max-w-4xl">
          <Story />
        </div>
      </div>
    ),
  ],
};

// Different speeds demonstration
const variedSpeedColumns: PhoneColumn[] = [
  {
    images: DEFAULT_PHONE_COLUMNS[0].images,
    direction: "up",
    speed: 15, // Slow
  },
  {
    images: DEFAULT_PHONE_COLUMNS[1].images,
    direction: "down",
    speed: 40, // Fast
  },
  {
    images: DEFAULT_PHONE_COLUMNS[2].images,
    direction: "up",
    speed: 25, // Medium
  },
];

export const VariedSpeeds: Story = {
  args: {
    columns: variedSpeedColumns,
    phoneWidth: 120,
    phoneHeight: 213,
    gap: 10,
    overlayGradient: true,
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-full bg-neutral-950 flex items-center justify-center">
        <div className="h-[700px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

// No overlay
export const NoOverlay: Story = {
  args: {
    columns: DEFAULT_PHONE_COLUMNS,
    phoneWidth: 120,
    phoneHeight: 213,
    gap: 10,
    overlayGradient: false,
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-full bg-neutral-950 flex items-center justify-center">
        <div className="h-[700px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

// Custom overlay color (purple theme)
export const PurpleOverlay: Story = {
  args: {
    columns: DEFAULT_PHONE_COLUMNS,
    phoneWidth: 120,
    phoneHeight: 213,
    gap: 10,
    overlayGradient: true,
    overlayColor: "rgba(88, 28, 135, 0.5)",
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-full bg-gradient-to-b from-purple-950 to-neutral-950 flex items-center justify-center">
        <div className="h-[700px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

// With hero text overlay (common use case)
export const WithHeroContent: Story = {
  render: () => (
    <div className="relative h-screen w-full bg-neutral-950 overflow-hidden">
      {/* Background carousel */}
      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <div className="h-full w-full max-w-5xl">
          <InfinitePhoneCarousel
            columns={fiveColumns}
            phoneWidth={140}
            phoneHeight={249}
            overlayGradient={false}
          />
        </div>
      </div>

      {/* Overlay gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.8) 70%, #0a0a0a 100%)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Build Your Empire
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mb-8">
          Join the creators who are monetizing their audience with our platform.
        </p>
        <button className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-neutral-200 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  ),
};

// Mobile responsive preview
export const MobilePreview: Story = {
  render: () => (
    <div className="h-screen w-full bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-[375px] h-[667px] bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800">
        <div className="h-full flex items-center justify-center">
          <InfinitePhoneCarousel
            columns={DEFAULT_PHONE_COLUMNS.slice(0, 2)}
            phoneWidth={80}
            phoneHeight={142}
            gap={6}
            overlayGradient={true}
          />
        </div>
      </div>
    </div>
  ),
};
