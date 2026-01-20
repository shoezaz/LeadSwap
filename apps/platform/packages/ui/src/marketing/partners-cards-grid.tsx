"use client";

export interface PartnerGridCardData {
  name: string;
  flagSrc: string;
  flagAlt: string;
  avatarPosition: string;
  revenue: string;
  payouts: string;
}

export interface PartnersCardsGridProps {
  partners?: PartnerGridCardData[];
}

// Asset URLs from mockup
const ASSETS = {
  avatarSprite:
    "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F1fc1ccce812f240314551df42c8d6a4143b173a5.jpg?generation=1762752201013689&alt=media",
  flags: {
    us: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fa256f1e769db18bf371149cf06ef7db1c8a53bcb.svg?generation=1760345897975288&alt=media",
    ca: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F300cd59b5f8fe460822642ad29519c701ab149e3.svg?generation=1761254900086681&alt=media",
    jp: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F2b24ca207beedb749437751511a7b3a20b32f98d.svg?generation=1765503409508138&alt=media",
    de: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fde9dcedb88543ce9cbcae9dff5462107a27803fa.svg?generation=1765503409503242&alt=media",
    ar: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F9e67e4f2da68a75026e5566c0b9bcaaf7a35116f.svg?generation=1765503409479760&alt=media",
    gb: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2F24e83c3c9cf1626ea28c55f70c95080ab740ca00.svg?generation=1761254896637045&alt=media",
    es: "https://storage.googleapis.com/download/storage/v1/b/prd-shared-services.firebasestorage.app/o/h2m-assets%2Fde3ad6b4acd09c76f70045312d5b14acc394d0af.svg?generation=1765503409485614&alt=media",
  },
};

export const DEFAULT_PARTNER_GRID_DATA: PartnerGridCardData[] = [
  { name: "Lauren Anderson", flagSrc: ASSETS.flags.us, flagAlt: "US flag", avatarPosition: "1400%", revenue: "$ 1.8K", payouts: "$ 550" },
  { name: "Mia Taylor", flagSrc: ASSETS.flags.us, flagAlt: "US flag", avatarPosition: "1300%", revenue: "$ 22.6K", payouts: "$ 6.8K" },
  { name: "Hiroshi Tanaka", flagSrc: ASSETS.flags.jp, flagAlt: "JP flag", avatarPosition: "1100%", revenue: "$ 19.2K", payouts: "$ 5.7K" },
  { name: "Elias Weber", flagSrc: ASSETS.flags.de, flagAlt: "DE flag", avatarPosition: "1000%", revenue: "$ 783", payouts: "$ 235" },
  { name: "Sophie Laurent", flagSrc: ASSETS.flags.ca, flagAlt: "CA flag", avatarPosition: "1200%", revenue: "$ 11K", payouts: "$ 3.3K" },
  { name: "Liam Carter", flagSrc: ASSETS.flags.us, flagAlt: "US flag", avatarPosition: "900%", revenue: "$ 30K", payouts: "$ 9.2K" },
  { name: "Lucia Gonzalez", flagSrc: ASSETS.flags.ar, flagAlt: "AR flag", avatarPosition: "800%", revenue: "$ 24K", payouts: "$ 7.2K" },
  { name: "Samantha Johnson", flagSrc: ASSETS.flags.us, flagAlt: "US flag", avatarPosition: "700%", revenue: "$ 17K", payouts: "$ 5.2K" },
  { name: "Derek Forbes", flagSrc: ASSETS.flags.gb, flagAlt: "GB flag", avatarPosition: "600%", revenue: "$ 1.5K", payouts: "$ 450" },
  { name: "Marvin Ta", flagSrc: ASSETS.flags.ca, flagAlt: "CA flag", avatarPosition: "500%", revenue: "$ 18.3K", payouts: "$ 5.4K" },
  { name: "Oliver Hawthorne", flagSrc: ASSETS.flags.gb, flagAlt: "GB flag", avatarPosition: "400%", revenue: "$ 850", payouts: "$ 255" },
  { name: "Diego Alvarez", flagSrc: ASSETS.flags.es, flagAlt: "ES flag", avatarPosition: "300%", revenue: "$ 1.3K", payouts: "$ 390" },
];

function PartnerGridCard({ partner }: { partner: PartnerGridCardData }) {
  return (
    <div className="text-center w-[300px] h-[120px] p-2">
      <div className="border flex size-full overflow-hidden text-center bg-neutral-900 border-neutral-800 p-2 rounded-xl hover:border-neutral-700 transition-colors">
        {/* Avatar using sprite */}
        <div
          className="aspect-square border h-full text-center bg-neutral-800 bg-size-[1400%] border-neutral-700 rounded-lg"
          style={{
            backgroundImage: `url("${ASSETS.avatarSprite}")`,
            backgroundPosition: `${partner.avatarPosition} 0%`,
          }}
        ></div>

        {/* Content */}
        <div className="flex flex-col h-full justify-between text-center pt-3 pr-4 pb-3 pl-4">
          {/* Name and flag */}
          <div className="items-center flex text-center gap-[6px]">
            <img
              alt={partner.flagAlt}
              src={partner.flagSrc}
              className="block max-w-full overflow-clip text-center align-middle w-[14px] h-[14px] rounded-[2097150rem]"
            />
            <span className="block font-medium text-center whitespace-nowrap text-neutral-50 text-[14px] leading-[20px]">
              {partner.name}
            </span>
          </div>

          {/* Stats */}
          <div className="flex text-center">
            <div className="flex flex-col text-center pt-0 pr-6 pb-0 pl-0">
              <span className="block font-medium text-center text-neutral-500 text-[12px] leading-[16px]">
                Revenue
              </span>
              <span className="block font-medium text-center text-neutral-300 text-[14px] leading-[20px]">
                {partner.revenue}
              </span>
            </div>
            <div className="border-l flex flex-col text-center border-neutral-800 pt-0 pr-0 pb-0 pl-6">
              <span className="block font-medium text-center text-neutral-500 text-[12px] leading-[16px]">
                Payouts
              </span>
              <span className="block font-medium text-center text-green-400 text-[14px] leading-[20px]">
                {partner.payouts}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PartnersCardsGrid({ partners = DEFAULT_PARTNER_GRID_DATA }: PartnersCardsGridProps) {
  return (
    <div className="relative text-center h-[420px] mt-[80px] bg-neutral-950">
      <div className="absolute text-center left-[50%] bottom-[60px] translate-x-[-50%]">
        <div className="grid text-center" style={{ gridTemplateColumns: "repeat(4, 300px)" }}>
          {partners.map((partner, index) => (
            <PartnerGridCard key={index} partner={partner} />
          ))}
        </div>
      </div>
    </div>
  );
}
