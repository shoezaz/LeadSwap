"use client";

export interface LandingTestimonialProps {
  quote: string;
  companyLogo: {
    src: string;
    alt: string;
  };
  author: {
    name: string;
    role: string;
    avatarSrc: string;
  };
  backgroundPatternSrc?: string;
}

const DEFAULT_BACKGROUND_PATTERN =
  "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F26535e390b661079f82464815822c3a2ca435529.svg?generation=1762752202238333&alt=media";

export const DEFAULT_TESTIMONIAL: LandingTestimonialProps = {
  quote:
    '" Dub has been a game-changer for our marketing campaigns. Our links get tens of millions of clicks monthly – with Dub, we are able to easily design our link previews, attribute clicks, and visualize our data. "',
  companyLogo: {
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F0fa65d8340716dfab2fb8f4010cc57ef662ecc54.svg?generation=1762752202261845&alt=media",
    alt: "Perplexity logo",
  },
  author: {
    name: "Johnny Ho",
    role: "Co-founder  at  Perplexity",
    avatarSrc:
      "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fae59ef2c889d6ebb33e21232de05037536554867.jpeg?generation=1762752202274489&alt=media",
  },
};

export function LandingTestimonial({
  quote,
  companyLogo,
  author,
  backgroundPatternSrc = DEFAULT_BACKGROUND_PATTERN,
}: LandingTestimonialProps) {
  return (
    <div className="border-b relative border-neutral-800 pt-14 pr-12 pb-14 pl-12 bg-neutral-950">
      {/* Background pattern */}
      <div className="absolute left-4 top-4 right-4 bottom-4">
        <div
          className="size-full overflow-hidden pointer-events-none absolute align-middle left-0 top-0 right-0 bottom-0 text-neutral-800/50 opacity-30"
        >
          <img
            src={backgroundPatternSrc}
            className="block size-full invert"
            alt=""
          />
        </div>
      </div>

      {/* Content */}
      <div className="items-start flex relative gap-[48px]">
        {/* Quote */}
        <div>
          <p
            className="bg-clip-text text-left text-transparent text-[24px] leading-[32px]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0.6), rgb(255, 255, 255))",
            }}
          >
            {quote}
          </p>
        </div>

        {/* Author info */}
        <div className="items-end flex flex-col text-right min-w-36 shrink-[0]">
          {/* Company logo */}
          <div className="relative text-right w-full h-7 pt-2 pr-0 pb-2 pl-0">
            <img
              alt={companyLogo.alt}
              src={companyLogo.src}
              className="block size-full max-w-full object-contain object-right overflow-clip absolute text-right align-middle left-0 top-0 right-0 bottom-0 invert"
            />
          </div>

          {/* Author name */}
          <span className="block font-semibold text-right mt-[16px] text-neutral-200 text-[14px] leading-[20px]">
            {author.name}
          </span>

          {/* Author role */}
          <span className="block font-medium text-right text-neutral-400 text-[12px] leading-[16px]">
            {author.role}
          </span>

          {/* Author avatar */}
          <img
            alt={author.name}
            src={author.avatarSrc}
            className="border block max-w-full overflow-clip text-right align-middle w-8 h-8 mt-[16px] aspect-[auto_64_/_64] border-neutral-700 rounded-[624.9375rem]"
          />
        </div>
      </div>
    </div>
  );
}
