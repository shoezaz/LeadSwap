"use client";

export interface PartnersTestimonialProps {
  companyLogo: {
    src: string;
    alt: string;
  };
  quote: string;
  quoteLinks?: Array<{
    text: string;
    href: string;
  }>;
  authorImage: string;
  authorName: string;
  authorRole: string;
}

export const DEFAULT_PARTNERS_TESTIMONIAL: PartnersTestimonialProps = {
  companyLogo: {
    src: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fd594c6b064b96a3b6f651d696d0679b2fe5a2f2c.svg?generation=1765503409622223&alt=media",
    alt: "Anara logo",
  },
  quote:
    '"The Dub team was an absolute dream to work with. They made the process of migrating from {Tolt} and {Rewardful} seamless - quickly adding features we needed, answering questions within minutes, and guiding us through every step. Highly recommend."',
  quoteLinks: [
    { text: "Tolt", href: "https://dub.co/help/article/migrating-from-tolt" },
    { text: "Rewardful", href: "https://dub.co/help/article/migrating-from-rewardful" },
  ],
  authorImage:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F0580f1c06efcc8f46d4839b1ff6f8edf846a2549.jpeg?generation=1765503410159879&alt=media",
  authorName: "Naveed Janmohamed",
  authorRole: "Founder & CEO, Anara",
};

function parseQuoteWithLinks(
  quote: string,
  links?: Array<{ text: string; href: string }>
): React.ReactNode {
  if (!links || links.length === 0) {
    return quote;
  }

  const parts: React.ReactNode[] = [];
  let remaining = quote;
  let key = 0;

  links.forEach((link) => {
    const placeholder = `{${link.text}}`;
    const index = remaining.indexOf(placeholder);
    if (index !== -1) {
      // Add text before the placeholder
      if (index > 0) {
        parts.push(remaining.slice(0, index));
      }
      // Add the link
      parts.push(
        <a
          key={key++}
          href={link.href}
          className="font-medium text-center underline text-neutral-200 hover:text-neutral-50 transition-colors"
          style={{ textDecorationStyle: "dotted" }}
        >
          {link.text}
        </a>
      );
      remaining = remaining.slice(index + placeholder.length);
    }
  });

  // Add any remaining text
  if (remaining) {
    parts.push(remaining);
  }

  return parts;
}

export function PartnersTestimonial({
  companyLogo,
  quote,
  quoteLinks,
  authorImage,
  authorName,
  authorRole,
}: PartnersTestimonialProps) {
  return (
    <div className="border-b overflow-clip relative border-neutral-800 pt-0 pr-4 pb-0 pl-4 bg-neutral-950">
      <div className="border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] pt-20 pr-0 pb-20 pl-0 z-[0]">
        <div className="items-center flex flex-col">
          {/* Company logo */}
          <div className="relative w-full h-6 mb-[24px] pt-2 pr-0 pb-2 pl-0">
            <img
              alt={companyLogo.alt}
              src={companyLogo.src}
              className="block size-full max-w-full object-contain overflow-clip absolute align-middle left-0 top-0 right-0 bottom-0 invert opacity-70"
            />
          </div>

          {/* Quote */}
          <div
            className="bg-clip-text text-center text-transparent text-[24px] leading-[32px] max-w-2xl pt-2 pr-0 pb-2 pl-0"
            style={{
              backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.6), rgb(255, 255, 255))",
            }}
          >
            <p className="text-center">{parseQuoteWithLinks(quote, quoteLinks)}</p>
          </div>

          {/* Author image */}
          <img
            alt={authorName}
            src={authorImage}
            className="block max-w-full overflow-clip align-middle w-12 h-12 mt-[12px] aspect-[auto_48_/_48] rounded-[624.9375rem] border border-neutral-700"
          />

          {/* Author name */}
          <span className="block font-semibold mt-[16px] text-neutral-200 text-[14px] leading-[20px]">
            {authorName}
          </span>

          {/* Author role */}
          <span className="block font-medium mt-[4px] text-neutral-400 text-[14px] leading-[20px]">
            {authorRole}
          </span>
        </div>
      </div>
    </div>
  );
}
