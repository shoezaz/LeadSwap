import type { Meta, StoryObj } from "@storybook/react";
import { PartnersHero, DEFAULT_PARTNERS_HERO_PROPS } from "../partners-hero";
import { PartnersCardsGrid, DEFAULT_PARTNER_GRID_DATA } from "../partners-cards-grid";
import { PartnersLogosGrid, DEFAULT_PARTNER_LOGOS } from "../partners-logos-grid";
import { CaseStudyCarousel, DEFAULT_CASE_STUDIES, DEFAULT_CAROUSEL_PROPS } from "../case-study-carousel";
import { PartnersTestimonial, DEFAULT_PARTNERS_TESTIMONIAL } from "../partners-testimonial";
import { PartnersDarkCta, DEFAULT_DARK_CTA_PROPS, DEFAULT_REVIEW_PLATFORMS } from "../partners-dark-cta";

// Combined Partners page component
function PartnersPageComponent() {
  return (
    <div className="bg-white">
      {/* Hero with Partner Cards */}
      <div className="border-b overflow-clip relative border-neutral-200 pt-0 pr-4 pb-0 pl-4">
        <div className="ml-auto mr-auto relative text-center max-w-[1080px] pt-20 pr-0 pb-0 pl-0 z-[0]">
          {/* Decorative borders */}
          <div className="border-l border-r pointer-events-none absolute text-center left-0 top-0 right-0 bottom-0 border-neutral-200"></div>

          {/* Content from PartnersHero minus wrapper */}
          <div className="relative text-center">
            <div className="items-center flex flex-col ml-auto mr-auto relative text-center w-full max-w-2xl">
              <div
                className="items-center border flex font-medium ml-auto mr-auto overflow-hidden relative text-center w-fit border-neutral-200 text-neutral-600 text-[12px] gap-[8px] leading-[15px] pt-[6px] pr-3 pb-[6px] pl-3 rounded-[624.9375rem]"
              >
                <div className="items-center flex justify-center text-center w-4 h-4 bg-[rgb(167,_139,_250)] rounded-sm">
                  <div className="fill-none overflow-hidden text-center align-middle w-[10px] h-[10px] text-[rgb(76,_29,_149)]">
                    <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fb6f7c5dd2f6394053fb02e5c5b809681b19447f4.svg?generation=1765503409522812&alt=media" className="block size-full" alt="" />
                  </div>
                </div>
                Dub Partners
              </div>

              <h1
                className="font-medium text-center mt-[24px] text-neutral-900 text-[48px] leading-[55.2px]"
                style={{ fontFamily: 'satoshi, "satoshi Fallback", system-ui, sans-serif' }}
              >
                {DEFAULT_PARTNERS_HERO_PROPS.title}
              </h1>

              <p className="text-center mt-[24px] text-neutral-600 text-[20px] leading-[28px]">
                {DEFAULT_PARTNERS_HERO_PROPS.description}
              </p>
            </div>

            <div className="flex justify-center relative text-center mt-[40px] gap-[16px]">
              <a
                href={DEFAULT_PARTNERS_HERO_PROPS.ctaHref}
                className="border block font-medium max-w-fit text-center bg-black border-black shadow-sm text-white text-[14px] leading-[20px] pt-2 pr-5 pb-2 pl-5 rounded-lg"
              >
                {DEFAULT_PARTNERS_HERO_PROPS.ctaText}
              </a>
              <button className="items-center border flex justify-center text-center whitespace-nowrap w-fit h-10 bg-white border-neutral-200 text-neutral-900 text-[14px] gap-[8px] leading-[20px] pt-0 pr-4 pb-0 pl-4 rounded-lg">
                <div className="overflow-hidden text-center align-middle w-4 h-4">
                  <img src="https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fa447a2469d139920e244324b76a6d044627a77fb.svg?generation=1765503409495881&alt=media" className="block size-full" alt="" />
                </div>
                {DEFAULT_PARTNERS_HERO_PROPS.secondaryCtaText}
              </button>
            </div>
          </div>

          {/* Partner Cards Grid */}
          <PartnersCardsGrid partners={DEFAULT_PARTNER_GRID_DATA} />
        </div>
      </div>

      {/* Customer Logos */}
      <PartnersLogosGrid logos={DEFAULT_PARTNER_LOGOS} />

      {/* Case Study Carousel */}
      <CaseStudyCarousel {...DEFAULT_CAROUSEL_PROPS} caseStudies={DEFAULT_CASE_STUDIES} />

      {/* Testimonial */}
      <PartnersTestimonial {...DEFAULT_PARTNERS_TESTIMONIAL} />

      {/* Dark CTA */}
      <PartnersDarkCta {...DEFAULT_DARK_CTA_PROPS} reviewPlatforms={DEFAULT_REVIEW_PLATFORMS} />
    </div>
  );
}

const meta: Meta<typeof PartnersPageComponent> = {
  title: "Marketing/Partners/PartnersPage",
  component: PartnersPageComponent,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PartnersPageComponent>;

export const FullPage: Story = {};
