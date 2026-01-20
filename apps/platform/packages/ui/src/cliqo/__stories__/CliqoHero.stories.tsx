import type { Meta, StoryObj } from "@storybook/react";
import { CliqoHero, CliqoHeroMinimal } from "../cliqo-hero";
import { CliqoHeader, CliqoLogo } from "../cliqo-header";
import { CliqoFooter } from "../cliqo-footer";
import { CliqoButton } from "../cliqo-button";
import { CliqoInput, CliqoTextarea } from "../cliqo-input";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const meta: Meta<typeof CliqoHero> = {
  title: "Cliqo/Layout/CliqoHero",
  component: CliqoHero,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#0a0a0a" }],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CliqoHero>;

export const Default: Story = {
  args: {
    title: "start ©",
    subtitle: "The modern affiliate platform for ambitious brands.",
    primaryCta: {
      label: "Get Started",
      href: "/signup",
      icon: <ArrowRight className="w-4 h-4" />,
    },
    secondaryCta: {
      label: "Learn More",
      href: "/about",
    },
  },
  render: (args) => (
    <div className="bg-neutral-950 min-h-screen relative">
      <CliqoHeader
        logo={<CliqoLogo />}
        links={[
          { label: "home", href: "/" },
          { label: "network", href: "/network" },
          { label: "start", href: "/start", active: true },
        ]}
        ctaLabel="let's work"
        ctaHref="/contact"
        ctaIcon={<ArrowUpRight className="w-4 h-4" />}
      />
      <CliqoHero {...args} />
    </div>
  ),
};

export const Centered: Story = {
  args: {
    title: "cliqo",
    subtitle: "The modern affiliate platform for ambitious brands.",
    align: "center",
    primaryCta: {
      label: "Start for free",
      href: "/signup",
    },
    secondaryCta: {
      label: "Talk to sales",
      href: "/contact",
    },
    titleOpacity: 1,
  },
};

export const WithFooterContent: Story = {
  args: {
    title: "start ©",
    titleOpacity: 0.7,
    footer: (
      <div
        className="text-neutral-400 text-[12px] leading-[16px]"
        style={{ fontFamily: '"IBM Plex Mono", monospace' }}
      >
        LET'S GET TO WORK / <a href="mailto:hello@cliqo.com" className="hover:text-neutral-50">HELLO@CLIQO.COM</a>
      </div>
    ),
  },
};

export const ContactPage: Story = {
  render: () => (
    <div className="bg-neutral-950 min-h-screen relative">
      <CliqoHeader
        logo={<CliqoLogo />}
        links={[
          { label: "home", href: "/" },
          { label: "network", href: "/network" },
          { label: "start", href: "/start", active: true },
        ]}
        ctaLabel="let's work"
        ctaHref="/contact"
        ctaIcon={<ArrowUpRight className="w-4 h-4" />}
      />
      <CliqoHeroMinimal title="start ©" titleOpacity={0.7}>
        <form className="flex flex-col gap-4 max-w-lg mt-[-14px]">
          {/* Category tags */}
          <div className="flex flex-wrap gap-2">
            <CliqoButton variant="secondary" size="sm">cinematics</CliqoButton>
            <CliqoButton variant="selected" size="sm">ugc</CliqoButton>
            <CliqoButton variant="secondary" size="sm">design</CliqoButton>
            <CliqoButton variant="secondary" size="sm">influencer</CliqoButton>
            <CliqoButton variant="secondary" size="sm">clipping</CliqoButton>
            <CliqoButton variant="secondary" size="sm">ads</CliqoButton>
          </div>

          {/* Message */}
          <CliqoTextarea placeholder="how can we get started?*" rows={3} />

          {/* Email + Submit */}
          <div className="flex gap-2">
            <CliqoInput
              type="email"
              placeholder="hello@cliqo.com*"
              className="flex-1 max-w-52"
            />
            <CliqoButton variant="selected" size="md">
              <ArrowRight className="w-4 h-4" />
            </CliqoButton>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-auto pt-8">
          <div
            className="text-neutral-400 text-[12px] leading-[16px]"
            style={{ fontFamily: '"IBM Plex Mono", monospace' }}
          >
            LET'S GET TO WORK / <a href="mailto:hello@cliqo.com" className="hover:text-neutral-50">HELLO@CLIQO.COM</a>
          </div>
        </div>
      </CliqoHeroMinimal>

      <CliqoFooter
        fixed
        copyright="© 2025 CLIQO"
        links={[
          { label: "X", href: "#" },
          { label: "LinkedIn", href: "#" },
        ]}
      />
    </div>
  ),
};

export const FullPage: Story = {
  render: () => (
    <div className="bg-neutral-950 min-h-screen relative">
      <CliqoHeader
        logo={<CliqoLogo />}
        links={[
          { label: "pricing", href: "/pricing" },
          { label: "partners", href: "/partners" },
          { label: "creators", href: "/creators" },
        ]}
        ctaLabel="Get Started"
        ctaHref="/signup"
        ctaIcon={<ArrowUpRight className="w-4 h-4" />}
      />
      <CliqoHero
        title="cliqo"
        subtitle="The modern affiliate platform for ambitious brands. Track, reward, and grow your partner network."
        titleOpacity={0.7}
        primaryCta={{
          label: "Start for free",
          href: "/signup",
          icon: <ArrowRight className="w-4 h-4" />,
        }}
        secondaryCta={{
          label: "Book a demo",
          href: "/demo",
        }}
      />
      <CliqoFooter
        fixed
        copyright="© 2025 CLIQO"
        links={[
          { label: "X", href: "#" },
          { label: "LinkedIn", href: "#" },
          { label: "GitHub", href: "#" },
        ]}
      />
    </div>
  ),
};
