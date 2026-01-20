import { nFormatter } from "../functions/nformatter";
import { INFINITY_NUMBER } from "./misc";

export type PlanFeature = {
  id?: string;
  text: string;
  tooltip?: {
    title: string;
    cta: string;
    href: string;
  };
};

const LEGACY_PRO_PRICE_IDS = [
  "price_1LodNLAlJJEpqkPVQSrt33Lc", // old monthly
  "price_1LodNLAlJJEpqkPVRxUyCQgZ", // old yearly
  "price_1OTcQBAlJJEpqkPViGtGEsbb", // new monthly (test)
  "price_1OYJeBAlJJEpqkPVLjTsjX0E", // new monthly (prod)
  "price_1OTcQBAlJJEpqkPVYlCMqdLL", // new yearly (test)
  "price_1OYJeBAlJJEpqkPVnPGEZeb0", // new yearly (prod)
];

// 2025 pricing
const NEW_PRO_PRICE_IDS = [
  "price_1R8XtyAlJJEpqkPV5WZ4c0jF", //  yearly
  "price_1R8XtEAlJJEpqkPV4opVvVPq", // monthly
  "price_1R8XxZAlJJEpqkPVqGi0wOqD", // yearly (test),
  "price_1R7oeBAlJJEpqkPVh6q5q3h8", // monthly (test),
];

const LEGACY_BUSINESS_PRICE_IDS = [
  "price_1LodLoAlJJEpqkPV9rD0rlNL", // old monthly
  "price_1LodLoAlJJEpqkPVJdwv5zrG", // oldest yearly
  "price_1OZgmnAlJJEpqkPVOj4kV64R", // old yearly
  "price_1OzNlmAlJJEpqkPV7s9HXNAC", // new monthly (test)
  "price_1OzNmXAlJJEpqkPVYO89lTdx", // new yearly (test)
  "price_1OzOFIAlJJEpqkPVJxzc9irl", // new monthly (prod)
  "price_1OzOXMAlJJEpqkPV9ERrjjbw", // new yearly (prod)
];

// 2025 pricing
export const NEW_BUSINESS_PRICE_IDS = [
  "price_1R3j01AlJJEpqkPVXuG1eNzm", //  yearly
  "price_1R6JedAlJJEpqkPVMUkfjch4", // monthly
  "price_1R8XypAlJJEpqkPVdjzOcYUC", // yearly (test),
  "price_1R7ofLAlJJEpqkPV3MlgDpyx", // monthly (test),
];

export const PLANS = [
  {
    name: "Free",
    price: {
      monthly: 0,
      yearly: 0,
    },
    limits: {
      links: INFINITY_NUMBER,
      clicks: INFINITY_NUMBER,
      payouts: INFINITY_NUMBER,
      domains: 100,
      tags: INFINITY_NUMBER,
      folders: INFINITY_NUMBER,
      groups: INFINITY_NUMBER,
      networkInvites: 100,
      users: 50,
      ai: INFINITY_NUMBER,
      api: 3000,
      retention: "Unlimited",
    },
  },
  {
    name: "Pro",
    link: "https://dub.co/help/article/pro-plan",
    price: {
      monthly: 30,
      yearly: 25,
      ids: [...LEGACY_PRO_PRICE_IDS, ...NEW_PRO_PRICE_IDS],
    },
    limits: {
      links: 1_000,
      clicks: 50_000,
      payouts: 0,
      domains: 10,
      tags: 25,
      folders: 3,
      groups: 0,
      networkInvites: 0,
      users: 3,
      ai: 1_000,
      api: 600,
      retention: "1-year",
    },
    featureTitle: "Everything in Free, plus:",
    features: [
      { id: "clicks", text: "50K tracked clicks/mo" },
      { id: "links", text: "1K new links/mo" },
      { id: "retention", text: "1-year analytics retention" },
      { id: "domains", text: "10 domains" },
      { id: "users", text: "3 users" },
      {
        id: "advanced",
        text: "Advanced link features",
        tooltip: "ADVANCED_LINK_FEATURES",
      },
      {
        id: "ai",
        text: "Unlimited AI credits",
        tooltip: {
          title:
            "Subject to fair use policy – you will be notified if you exceed the limit, which are high enough for frequent usage.",
          cta: "Learn more.",
          href: "https://dub.co/blog/introducing-dub-ai",
        },
      },
      {
        id: "dotlink",
        text: "Free .link domain",
        tooltip: {
          title:
            "All our paid plans come with a free .link custom domain, which helps improve click-through rates.",
          cta: "Learn more.",
          href: "https://dub.co/help/article/free-dot-link-domain",
        },
      },
      {
        id: "folders",
        text: "Link folders",
        tooltip: {
          title:
            "Organize and manage access to your links on Cliqo using folders.",
          cta: "Learn more.",
          href: "https://dub.co/help/article/link-folders",
        },
      },
      {
        id: "deeplinks",
        text: "Deep links",
        tooltip: {
          title:
            "Redirect users to a specific page within your mobile application using deep links.",
          cta: "Learn more.",
          href: "https://dub.co/docs/concepts/deep-links/quickstart",
        },
      },
    ] as PlanFeature[],
  },
  {
    name: "Business",
    price: {
      monthly: 90,
      yearly: 75,
      ids: [...LEGACY_BUSINESS_PRICE_IDS, ...NEW_BUSINESS_PRICE_IDS],
    },
    limits: {
      links: 10_000,
      clicks: 250_000,
      payouts: 2_500_00,
      domains: 100,
      tags: INFINITY_NUMBER,
      folders: 20,
      groups: 3,
      networkInvites: 0,
      users: 10,
      ai: 1_000,
      api: 1_200,
      retention: "3-year",
    },
    featureTitle: "Everything in Pro, plus:",
    features: [
      {
        id: "clicks",
        text: "250K tracked clicks/mo",
      },
      {
        id: "links",
        text: "10K new links/mo",
      },
      {
        id: "retention",
        text: "3-year analytics retention",
      },
      {
        id: "payouts",
        text: "$2.5K partner payouts/mo",
        tooltip: {
          title:
            "Send payouts to your partners with 1-click (or automate it completely) – all across the world.",
          cta: "Learn more.",
          href: "https://dub.co/help/article/partner-payouts",
        },
      },
      {
        id: "users",
        text: "10 users",
      },
      {
        id: "events",
        text: "Real-time events stream",
        tooltip: {
          title:
            "Get more data on your link clicks and QR code scans with a detailed, real-time stream of events in your workspace",
          cta: "Learn more.",
          href: "https://dub.co/help/article/real-time-events-stream",
        },
      },
      {
        id: "partners",
        text: "Partner management",
        tooltip: {
          title: "Use Cliqo Partners to manage and pay out your affiliates.",
          cta: "Learn more.",
          href: "https://dub.co/partners",
        },
      },
      {
        id: "tests",
        text: "A/B testing",
      },
      {
        id: "roles",
        text: "Customer insights",
        tooltip: {
          title:
            "Get real-time insights into your customers' behavior and preferences.",
          cta: "Learn more.",
          href: "https://dub.co/help/article/customer-insights",
        },
      },
      {
        id: "webhooks",
        text: "Event webhooks",
        tooltip: {
          title:
            "Get real-time notifications when a link is clicked or a QR code is scanned using webhooks.",
          cta: "Learn more.",
          href: "https://dub.co/docs/concepts/webhooks/introduction",
        },
      },
    ] as PlanFeature[],
  },
  {
    name: "Advanced",
    price: {
      monthly: 300,
      yearly: 250,
      ids: [
        "price_1R8Xw4AlJJEpqkPV6nwdink9", //  yearly
        "price_1R3j0qAlJJEpqkPVkfGNXRwb", // monthly
        "price_1R8XztAlJJEpqkPVnHmIU2tf", // yearly (test),
        "price_1R7ofzAlJJEpqkPV0L2TwyJo", // monthly (test),
      ],
    },
    limits: {
      links: 50_000,
      clicks: 1_000_000,
      payouts: 15_000_00,
      domains: 250,
      tags: INFINITY_NUMBER,
      folders: 50,
      groups: 10,
      networkInvites: 0,
      users: 20,
      ai: 1_000,
      api: 3_000,
      retention: "5-year",
    },
    featureTitle: "Everything in Business, plus:",
    features: [
      {
        id: "clicks",
        text: "1M tracked clicks/mo",
      },
      {
        id: "links",
        text: "50K new links/mo",
      },
      {
        id: "retention",
        text: "5-year analytics retention",
      },
      {
        id: "payouts",
        text: "$15K partner payouts/mo",
        tooltip: {
          title:
            "Send payouts to your partners with 1-click (or automate it completely) – all across the world.",
          cta: "Learn more.",
          href: "https://dub.co/help/article/partner-payouts",
        },
      },
      {
        id: "users",
        text: "20 users",
      },
      {
        id: "flexiblerewards",
        text: "Advanced reward structures",
        tooltip: {
          title:
            "Create dynamic click, lead, or sale-based rewards with country and product-specific modifiers.",
          cta: "Learn more.",
          href: "https://dub.co/help/article/partner-rewards",
        },
      },
      {
        id: "embeddedreferrals",
        text: "Embedded referral dashboard",
        tooltip: {
          title:
            "Create an embedded referral dashboard directly in your app in just a few lines of code.",
          cta: "Learn more.",
          href: "https://dub.co/docs/partners/embedded-referrals",
        },
      },
      {
        id: "messages",
        text: "Messaging center",
        tooltip: {
          title:
            "Easily communicate with your partners using our messaging center.",
        },
      },
      {
        id: "api",
        text: "Partners API",
        tooltip: {
          title:
            "Leverage our partners API to build a bespoke, white-labeled referral program that lives within your app.",
          cta: "Learn more.",
          href: "https://dub.co/docs/api-reference/endpoint/create-a-partner",
        },
      },
      {
        id: "slack",
        text: "Priority Slack support",
      },
    ] as PlanFeature[],
  },
  {
    name: "Enterprise",
    price: {
      monthly: null,
      yearly: null,
    },
    limits: {
      links: 500_000,
      clicks: 5_000_000,
      payouts: INFINITY_NUMBER,
      domains: 250,
      tags: INFINITY_NUMBER,
      folders: INFINITY_NUMBER,
      groups: INFINITY_NUMBER,
      networkInvites: 20,
      users: 30,
      ai: 1_000,
      api: 3_000,
      retention: "Unlimited",
    },
  },
];

export const FREE_PLAN = PLANS.find((plan) => plan.name === "Free")!;
export const PRO_PLAN = PLANS.find((plan) => plan.name === "Pro")!;
export const BUSINESS_PLAN = PLANS.find((plan) => plan.name === "Business")!;
export const ADVANCED_PLAN = PLANS.find((plan) => plan.name === "Advanced")!;

export const SELF_SERVE_PAID_PLANS = PLANS.filter((p) =>
  ["Pro", "Business", "Advanced"].includes(p.name),
);

export const FREE_WORKSPACES_LIMIT = 2;

export const getPlanFromPriceId = (priceId: string) => {
  return PLANS.find((plan) => plan.price.ids?.includes(priceId)) || null;
};

export const getPlanDetails = (plan: string) => {
  return SELF_SERVE_PAID_PLANS.find(
    (p) => p.name.toLowerCase() === plan.toLowerCase(),
  )!;
};

export const getCurrentPlan = (plan: string) => {
  return (
    PLANS.find((p) => p.name.toLowerCase() === plan.toLowerCase()) || FREE_PLAN
  );
};

export const getNextPlan = (plan?: string | null) => {
  if (!plan) return PRO_PLAN;
  const currentPlan = plan.toLowerCase().split(" ")[0]; // to account for old Business plans (e.g. "Business Plus")
  return PLANS[
    Math.min(
      // returns the next plan, or the last plan if the current plan is the last plan
      PLANS.findIndex((p) => p.name.toLowerCase() === currentPlan) + 1,
      PLANS.length - 1,
    )
  ];
};

export const isDowngradePlan = (currentPlan: string, newPlan: string) => {
  const currentPlanIndex = PLANS.findIndex(
    (p) => p.name.toLowerCase() === currentPlan.toLowerCase(),
  );
  const newPlanIndex = PLANS.findIndex(
    (p) => p.name.toLowerCase() === newPlan.toLowerCase(),
  );
  return currentPlanIndex > newPlanIndex;
};

export const isLegacyBusinessPlan = ({
  plan = "business",
  payoutsLimit = 0,
}: {
  plan?: string;
  payoutsLimit?: number;
}) => plan === "business" && payoutsLimit === 0;

// ==============================================================================
// CLIQO PRICING (V2.2 - 2026)
// Based on Product Brief: AI Growth Team positioning
// ==============================================================================

export type CliqoPlanTier = "free_trial" | "startup" | "growth" | "elite";
export type CliqoBillingCycle = "monthly" | "annual";
export type CliqoAgentMode = "supervised" | "semi_autonomous" | "autonomous";

export interface CliqoPlanLimits {
  partners: number;
  campaigns: number;
  discoverySearches: number;
  users: number;
  workspaces: number;
}

export interface CliqoPlan {
  name: string;
  tier: CliqoPlanTier;
  price: {
    monthly: number | null;
    yearly: number | null;
    ids?: string[];
  };
  limits: CliqoPlanLimits;
  agentMode: CliqoAgentMode;
  trialDays?: number;
  featureTitle?: string;
  features?: PlanFeature[];
}

export const CLIQO_PLANS: CliqoPlan[] = [
  {
    name: "Free Trial",
    tier: "free_trial",
    price: { monthly: 0, yearly: 0 },
    limits: {
      partners: 10,
      campaigns: 1,
      discoverySearches: 5,
      users: 2,
      workspaces: 1,
    },
    agentMode: "supervised",
    trialDays: 14,
    featureTitle: "14-day free trial includes:",
    features: [
      { id: "partners", text: "10 active creators" },
      { id: "discovery", text: "5 AI Discovery searches" },
      { id: "campaigns", text: "1 active campaign" },
      { id: "agent", text: "Supervised AI Agent" },
    ],
  },
  {
    name: "Startup",
    tier: "startup",
    price: {
      monthly: 597,
      yearly: 497, // per month, billed annually ($5,964/year)
      ids: [
        // Production (LIVE)
        "price_1SndlgGV6PKZJKyhn6vA80qi", // Monthly $597
        "price_1SndlrGV6PKZJKyhl0cLmbhH", // Annual $5,964
      ],
    },
    limits: {
      partners: 100,
      campaigns: 5,
      discoverySearches: 25,
      users: 2,
      workspaces: 1,
    },
    agentMode: "supervised",
    featureTitle: "Everything in Trial, plus:",
    features: [
      { id: "partners", text: "100 active creators" },
      { id: "discovery", text: "25 AI Discovery searches/mo" },
      { id: "campaigns", text: "5 active campaigns" },
      { id: "agent", text: "Supervised AI Agent" },
      { id: "validation", text: "Basic content validation" },
      { id: "fraud", text: "Anomaly detection (auto-flag)" },
      { id: "payments", text: "Stripe + PayPal payouts" },
      { id: "guarantee", text: "Founder's Guarantee" },
    ],
  },
  {
    name: "Growth",
    tier: "growth",
    price: {
      monthly: 1697,
      yearly: 1397, // per month, billed annually ($16,764/year)
      ids: [
        // Production (LIVE)
        "price_1SndmOGV6PKZJKyhTkhBEtry", // Monthly $1,697
        "price_1SndnLGV6PKZJKyhvZfOA8wW", // Annual $16,764
      ],
    },
    limits: {
      partners: 500,
      campaigns: 20,
      discoverySearches: 200,
      users: 5,
      workspaces: 3,
    },
    agentMode: "semi_autonomous",
    featureTitle: "Everything in Startup, plus:",
    features: [
      { id: "partners", text: "500 active creators" },
      { id: "discovery", text: "200 AI Discovery searches/mo" },
      { id: "campaigns", text: "20 active campaigns" },
      { id: "agent", text: "Semi-Autonomous AI Agent" },
      { id: "audit", text: "AI Creator Audit" },
      { id: "validation", text: "Advanced content validation" },
      { id: "shopify", text: "Shopify integration" },
      { id: "api", text: "Read-only API access" },
      { id: "webhooks", text: "Event webhooks" },
      { id: "support", text: "Email + Chat support (24h)" },
    ],
  },
  {
    name: "Elite",
    tier: "elite",
    price: {
      monthly: null, // Custom pricing
      yearly: null,
    },
    limits: {
      partners: INFINITY_NUMBER,
      campaigns: INFINITY_NUMBER,
      discoverySearches: INFINITY_NUMBER,
      users: 10,
      workspaces: INFINITY_NUMBER,
    },
    agentMode: "autonomous",
    featureTitle: "Everything in Growth, plus:",
    features: [
      { id: "partners", text: "Unlimited creators" },
      { id: "discovery", text: "Unlimited AI Discovery" },
      { id: "campaigns", text: "Unlimited campaigns" },
      { id: "agent", text: "Full Autonomous AI Agent" },
      { id: "intel", text: "Competitive Intelligence" },
      { id: "fraud", text: "Custom fraud rules engine" },
      { id: "hubspot", text: "HubSpot integration" },
      { id: "api", text: "Full API access" },
      { id: "whitelabel", text: "White-label option" },
      { id: "csm", text: "Dedicated Customer Success Manager" },
      { id: "reviews", text: "Quarterly business reviews" },
    ],
  },
];

// Cliqo Plan Helper Functions
export const FREE_TRIAL_PLAN = CLIQO_PLANS.find((p) => p.tier === "free_trial")!;
export const STARTUP_PLAN = CLIQO_PLANS.find((p) => p.tier === "startup")!;
export const GROWTH_PLAN = CLIQO_PLANS.find((p) => p.tier === "growth")!;
export const ELITE_PLAN = CLIQO_PLANS.find((p) => p.tier === "elite")!;

export const getCliqoPlan = (tier: CliqoPlanTier): CliqoPlan => {
  return CLIQO_PLANS.find((p) => p.tier === tier) || FREE_TRIAL_PLAN;
};

export const getCliqoPlanFromPriceId = (priceId: string): CliqoPlan | null => {
  return CLIQO_PLANS.find((p) => p.price.ids?.includes(priceId)) || null;
};

export const getCliqoNextPlan = (currentTier: CliqoPlanTier): CliqoPlan | null => {
  const tierOrder: CliqoPlanTier[] = ["free_trial", "startup", "growth", "elite"];
  const currentIndex = tierOrder.indexOf(currentTier);
  if (currentIndex === -1 || currentIndex >= tierOrder.length - 1) return null;
  return getCliqoPlan(tierOrder[currentIndex + 1]);
};

export const isCliqoDowngrade = (
  currentTier: CliqoPlanTier,
  newTier: CliqoPlanTier
): boolean => {
  const tierOrder: CliqoPlanTier[] = ["free_trial", "startup", "growth", "elite"];
  return tierOrder.indexOf(currentTier) > tierOrder.indexOf(newTier);
};

export const getCliqoAnnualSavings = (plan: CliqoPlan): number => {
  if (!plan.price.monthly || !plan.price.yearly) return 0;
  const monthlyCost = plan.price.monthly * 12;
  const annualCost = plan.price.yearly * 12;
  return monthlyCost - annualCost;
};

export const getCliqoMonthsFree = (plan: CliqoPlan): number => {
  if (!plan.price.monthly || !plan.price.yearly) return 0;
  const savings = getCliqoAnnualSavings(plan);
  return Math.round(savings / plan.price.monthly);
};

// Cliqo Plan Compare Features (for upgrade page comparison table)
export const CLIQO_PLAN_COMPARE_FEATURES: {
  category: string;
  href?: string;
  features: {
    text:
    | string
    | ((d: { id: string; plan: CliqoPlan }) => React.ReactNode);
    href?: string;
    check?:
    | boolean
    | {
      default?: boolean;
      free_trial?: boolean;
      startup?: boolean;
      growth?: boolean;
      elite?: boolean;
    };
  }[];
}[] = [
    {
      category: "Creators",
      href: "https://cliqo.com/help/creators",
      features: [
        {
          text: ({ plan }) => (
            <>
              <strong>
                {plan.limits.partners === INFINITY_NUMBER
                  ? "Unlimited"
                  : nFormatter(plan.limits.partners)}
              </strong>{" "}
              active creators
            </>
          ),
        },
        {
          check: {
            default: true,
          },
          text: "Creator inbox & messaging",
        },
        {
          check: {
            default: true,
          },
          text: "Automated payouts (Stripe + PayPal)",
        },
        {
          check: {
            startup: true,
            growth: true,
            elite: true,
          },
          text: "Creator performance tracking",
        },
        {
          check: {
            startup: false,
            growth: true,
            elite: true,
          },
          text: "Advanced creator analytics",
        },
      ],
    },
    {
      category: "Campaigns",
      href: "https://cliqo.com/help/campaigns",
      features: [
        {
          text: ({ plan }) => (
            <>
              <strong>
                {plan.limits.campaigns === INFINITY_NUMBER
                  ? "Unlimited"
                  : nFormatter(plan.limits.campaigns)}
              </strong>{" "}
              active campaigns
            </>
          ),
        },
        {
          check: {
            default: true,
          },
          text: "Campaign templates",
        },
        {
          check: {
            default: true,
          },
          text: "Multi-format content (Posts, Stories, Reels)",
        },
        {
          check: {
            startup: true,
            growth: true,
            elite: true,
          },
          text: "Payment models (Fixed, CPM, Hybrid)",
        },
        {
          check: {
            startup: false,
            growth: true,
            elite: true,
          },
          text: "Advanced content validation",
        },
        {
          check: {
            startup: false,
            growth: false,
            elite: true,
          },
          text: "Custom fraud rules engine",
        },
      ],
    },
    {
      category: "AI Discovery",
      href: "https://cliqo.com/help/ai-discovery",
      features: [
        {
          text: ({ plan }) => (
            <>
              <strong>
                {plan.limits.discoverySearches === INFINITY_NUMBER
                  ? "Unlimited"
                  : nFormatter(plan.limits.discoverySearches)}
              </strong>{" "}
              AI searches/month
            </>
          ),
        },
        {
          check: {
            startup: true,
            growth: true,
            elite: true,
          },
          text: "AI Creator Matching",
        },
        {
          check: {
            startup: false,
            growth: true,
            elite: true,
          },
          text: "AI Creator Audit",
        },
        {
          check: {
            startup: false,
            growth: true,
            elite: true,
          },
          text: "Audience persona analysis",
        },
        {
          check: {
            startup: false,
            growth: false,
            elite: true,
          },
          text: "Competitive Intelligence",
        },
      ],
    },
    {
      category: "AI Agent",
      href: "https://cliqo.com/help/ai-agent",
      features: [
        {
          check: {
            startup: false,
            growth: false,
            elite: false,
          },
          text: ({ id }) => (
            <>
              <strong>
                {{
                  free_trial: "No AI Agent",
                  startup: "Supervised",
                  growth: "Semi-Autonomous",
                  elite: "Full Autonomous",
                }[id] || "Supervised"}
              </strong>{" "}
              AI Agent mode
            </>
          ),
        },
        {
          check: {
            startup: true,
            growth: true,
            elite: true,
          },
          text: "AI brief generation",
        },
        {
          check: {
            startup: false,
            growth: true,
            elite: true,
          },
          text: "Automated outreach drafts",
        },
        {
          check: {
            startup: false,
            growth: false,
            elite: true,
          },
          text: "Full campaign automation",
        },
      ],
    },
    {
      category: "Integrations",
      href: "https://cliqo.com/help/integrations",
      features: [
        {
          check: {
            startup: false,
            growth: true,
            elite: true,
          },
          text: "Shopify integration",
        },
        {
          check: {
            startup: false,
            growth: false,
            elite: true,
          },
          text: "HubSpot integration",
        },
        {
          check: {
            startup: false,
            growth: true,
            elite: true,
          },
          text: "Read-only API access",
        },
        {
          check: {
            startup: false,
            growth: false,
            elite: true,
          },
          text: "Full API access",
        },
        {
          check: {
            startup: false,
            growth: true,
            elite: true,
          },
          text: "Event webhooks",
        },
      ],
    },
    {
      category: "Workspace",
      href: "https://cliqo.com/help/workspace",
      features: [
        {
          text: ({ plan }) => (
            <>
              <strong>
                {plan.limits.users === INFINITY_NUMBER
                  ? "Unlimited"
                  : nFormatter(plan.limits.users)}
              </strong>{" "}
              team member{plan.limits.users === 1 ? "" : "s"}
            </>
          ),
        },
        {
          check: {
            startup: false,
            growth: false,
            elite: true,
          },
          text: "White-label option",
        },
        {
          check: {
            startup: false,
            growth: false,
            elite: true,
          },
          text: "Custom branding",
        },
      ],
    },
    {
      category: "Support",
      href: "https://cliqo.com/help/support",
      features: [
        {
          text: ({ id }) => (
            <>
              <strong>
                {{
                  free_trial: "Email support",
                  startup: "Email support (48h)",
                  growth: "Email + Chat (24h)",
                  elite: "Priority + Slack",
                }[id] || "Email support"}
              </strong>
            </>
          ),
        },
        {
          check: {
            startup: false,
            growth: false,
            elite: true,
          },
          text: "Dedicated Customer Success Manager",
        },
        {
          check: {
            startup: false,
            growth: false,
            elite: true,
          },
          text: "Quarterly business reviews",
        },
        {
          check: {
            startup: true,
            growth: true,
            elite: true,
          },
          text: "Founder's Guarantee",
        },
      ],
    },
  ];
