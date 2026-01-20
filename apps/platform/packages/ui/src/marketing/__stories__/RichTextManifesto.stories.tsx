import type { Meta, StoryObj } from "@storybook/react";
import {
  RichTextManifesto,
  InlineProductBadge,
  DEFAULT_FLOATING_CARDS,
  DEFAULT_FLOATING_ICONS,
} from "../rich-text-manifesto";

// Default product icons for inline badges
const DEFAULT_PRODUCT_ICONS = {
  links: {
    href: "https://dub.co/links",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fadd495da7aaed41aa1026839dd5731132db66463.svg?generation=1762752200611947&alt=media",
    bgColor: "rgb(251, 146, 60)",
    textColor: "rgb(124, 45, 18)",
    glowColor: "rgb(249, 115, 22)",
    rotation: "rotate-10",
    translateY: "translate-y-[-6px]",
  },
  analytics: {
    href: "https://dub.co/analytics",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F515ab7f9db176d4d563a211b35b9481cd7c043f5.svg?generation=1762752200643485&alt=media",
    bgColor: "rgb(74, 222, 128)",
    textColor: "rgb(20, 83, 45)",
    glowColor: "rgb(74, 222, 128)",
    translateY: "translate-y-[-2px]",
  },
  partners: {
    href: "https://dub.co/partners",
    iconSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F4c6e83160131915a54ce43fff90529821a23f33b.svg?generation=1762752200670301&alt=media",
    bgColor: "rgb(192, 132, 252)",
    textColor: "rgb(88, 28, 135)",
    glowColor: "rgb(147, 51, 234)",
    translateY: "translate-y-[-2px]",
  },
};

const meta: Meta<typeof RichTextManifesto> = {
  title: "Marketing/Landing/RichTextManifesto",
  component: RichTextManifesto,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RichTextManifesto>;

// Default manifesto content with inline product icons
const DefaultManifestoContent = () => (
  <>
    <p>Marketing isn&apos;t just about clicks. &nbsp; It&apos;s about outcomes.</p>
    <p className="mt-[32px]">
      Dub is the modern link attribution platform that unifies short links{" "}
      <InlineProductBadge icon={DEFAULT_PRODUCT_ICONS.links} />
      real-time analytics <InlineProductBadge icon={DEFAULT_PRODUCT_ICONS.analytics} /> and
      affiliate programs <InlineProductBadge icon={DEFAULT_PRODUCT_ICONS.partners} /> – all in one
      place.
    </p>
    <p className="mt-[32px]">
      It&apos;s fast. It&apos;s reliable. It&apos;s beautiful. And it scales with you.
    </p>
    <p className="mt-[32px]">
      Because you deserve more than vanity metrics. You deserve clarity.
    </p>
  </>
);

export const Default: Story = {
  args: {
    paragraphs: [<DefaultManifestoContent key="content" />],
    floatingCards: DEFAULT_FLOATING_CARDS,
    floatingIcons: DEFAULT_FLOATING_ICONS,
    screenshotSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F29fc3fb20397449b04019a90fb2a344fe00b2770.jpg&w=384&q=75?generation=1762752200841238&alt=media",
  },
};

export const SimpleText: Story = {
  args: {
    paragraphs: [
      <p key="1">The future of link management is here.</p>,
      <p key="2" className="mt-[32px]">
        Track every click. Understand every conversion. Scale every campaign.
      </p>,
      <p key="3" className="mt-[32px]">
        This is Dub.
      </p>,
    ],
    floatingCards: [],
    floatingIcons: [],
  },
};

export const WithFloatingElements: Story = {
  args: {
    paragraphs: [
      <p key="1">Build your marketing stack on a solid foundation.</p>,
      <p key="2" className="mt-[32px]">
        Dub provides the infrastructure you need to turn clicks into revenue.
      </p>,
    ],
    floatingCards: DEFAULT_FLOATING_CARDS.slice(0, 2),
    floatingIcons: DEFAULT_FLOATING_ICONS.slice(0, 2),
  },
};

// Story for inline product badge standalone
export const InlineProductBadgeOnly: StoryObj = {
  render: () => (
    <div className="p-8 bg-white">
      <p className="text-[24px] leading-[32px]">
        Unify your
        <InlineProductBadge icon={DEFAULT_PRODUCT_ICONS.links} />
        short links with
        <InlineProductBadge icon={DEFAULT_PRODUCT_ICONS.analytics} />
        analytics and
        <InlineProductBadge icon={DEFAULT_PRODUCT_ICONS.partners} />
        partner programs.
      </p>
    </div>
  ),
};
