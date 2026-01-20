"use client";

import { getPlanCapabilities } from "@/lib/plan-capabilities";
import {
  SubmissionsCountByStatus,
  useBountySubmissionsCount,
} from "@/lib/swr/use-bounty-submissions-count";
import { usePartnerMessagesCount } from "@/lib/swr/use-partner-messages-count";
import usePayoutsCount from "@/lib/swr/use-payouts-count";
import useProgram from "@/lib/swr/use-program";
import useWorkspace from "@/lib/swr/use-workspace";
import { useRouterStuff } from "@leadswap/ui";
import {
  Bell,
  ConnectedDots4,
  Gear2,
  Globe,
  LifeRing,
  LinesY as LinesYStatic,
  MoneyBills2,
  Msgs,
  PaperPlane,
  Receipt2,
  ShieldCheck,
  UserCheck,
  Users,
  Users6,
} from "@leadswap/ui/icons";
import { Home, Trophy } from "lucide-react";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";

import { Compass } from "./icons/compass";
import { SidebarNav, SidebarNavAreas, SidebarNavGroups } from "./sidebar-nav";
import { SidebarUsage } from "./sidebar-usage";
import { useProgramApplicationsCount } from "./use-program-applications-count";
import { WorkspaceDropdown } from "./workspace-dropdown";

type SidebarNavData = {
  slug: string;
  pathname: string;
  queryString: string;
  defaultProgramId?: string;
  session?: Session | null;
  showNews?: boolean;
  pendingPayoutsCount?: number;
  applicationsCount?: number;
  submittedBountiesCount?: number;
  unreadMessagesCount?: number;
  showConversionGuides?: boolean;
  emailCampaignsEnabled?: boolean;
};

const FIVE_YEARS_SECONDS = 60 * 60 * 24 * 365 * 5;

const NAV_GROUPS: SidebarNavGroups<SidebarNavData> = ({
  slug,
  pathname,
}) => [
    {
      name: "Prospect",
      description: "Find and score leads.",
      icon: Users,
      href: (slug ? `/${slug}/prospect/searcher` : "/prospect/searcher") as `/${string}`,
      active: pathname.includes("/prospect"),
    },
    {
      name: "Outreach",
      description: "Manage email campaigns.",
      icon: PaperPlane,
      href: (slug ? `/${slug}/outreach` : "/outreach") as `/${string}`,
      active: pathname.includes("/outreach"),
    },
    {
      name: "Settings",
      description: "Workspace settings.",
      icon: Gear2,
      href: (slug ? `/${slug}/settings` : "/settings") as `/${string}`,
      active: pathname.includes("/settings") && !pathname.includes("/account/settings"),
    },
  ];

const NAV_AREAS: SidebarNavAreas<SidebarNavData> = {
  // Prospect Area
  prospect: ({ slug }) => ({
    title: "Prospect",
    direction: "left",
    content: [
      {
        items: [
          {
            name: "Searcher",
            icon: Compass,
            href: `/${slug}/prospect/searcher` as `/${string}`,
          },
          {
            name: "Lists",
            icon: LinesYStatic,
            href: `/${slug}/prospect/lists` as `/${string}`,
          },
        ],
      },
    ],
  }),

  // Outreach Area
  outreach: ({ slug }) => ({
    title: "Outreach",
    direction: "left",
    content: [
      {
        items: [
          {
            name: "Campaigns",
            icon: PaperPlane,
            href: `/${slug}/outreach` as `/${string}`,
            exact: true,
          },
        ],
      },
    ],
  }),

  // Workspace settings
  workspaceSettings: ({ slug }) => ({
    title: "Settings",
    backHref: `/${slug}/prospect/searcher` as `/${string}`,
    content: [
      {
        name: "Workspace",
        items: [
          {
            name: "General",
            icon: Gear2,
            href: `/${slug}/settings` as `/${string}`,
            exact: true,
          },
          {
            name: "Billing",
            icon: Receipt2,
            href: `/${slug}/settings/billing` as `/${string}`,
          },
          {
            name: "Members",
            icon: Users6,
            href: `/${slug}/settings/people` as `/${string}`,
          },
        ],
      },
    ],
  }),

  // User settings
  userSettings: ({ slug }) => ({
    title: "Account",
    backHref: `/${slug}/prospect/searcher` as `/${string}`,
    hideSwitcherIcons: true,
    content: [
      {
        name: "Account",
        items: [
          {
            name: "General",
            icon: Gear2,
            href: "/account/settings" as `/${string}`,
            exact: true,
          },
        ],
      },
    ],
  }),
};

export function AppSidebarNav({
  toolContent,
  newsContent,
  children,
}: {
  toolContent?: ReactNode;
  newsContent?: ReactNode;
  children?: ReactNode;
}) {
  const { slug } = useParams() as { slug?: string };
  const pathname = usePathname();
  const { getQueryString } = useRouterStuff();
  const { data: session } = useSession();
  const { plan, defaultProgramId, flags } = useWorkspace();

  const currentArea = useMemo(() => {
    if (pathname.startsWith("/account/settings")) return "userSettings";
    if (pathname.startsWith(`/${slug}/settings`)) return "workspaceSettings";

    if (pathname.includes("/prospect")) {
      return "prospect";
    }

    if (pathname.includes("/outreach")) {
      return "outreach";
    }

    // Default to prospect if on root or unknown
    return "prospect";
  }, [slug, pathname]);

  const { program } = useProgram({
    enabled: Boolean(
      (currentArea === "manage" ||
        currentArea === "messages" ||
        currentArea === "email" ||
        currentArea === "track" ||
        currentArea === "pay") &&
      defaultProgramId
    ),
  });

  const { payoutsCount: pendingPayoutsCount } = usePayoutsCount<
    number | undefined
  >({
    eligibility: "eligible",
    status: "pending",
    enabled: Boolean(
      (currentArea === "manage" || currentArea === "pay") && defaultProgramId
    ),
  });

  const applicationsCount = useProgramApplicationsCount({
    enabled: Boolean(currentArea === "manage" && defaultProgramId),
  });

  const { submissionsCount } = useBountySubmissionsCount<
    SubmissionsCountByStatus[]
  >({
    enabled: Boolean(currentArea === "manage" && defaultProgramId),
  });

  const submittedBountiesCount =
    submissionsCount?.find(({ status }) => status === "submitted")?.count || 0;

  const { count: unreadMessagesCount } = usePartnerMessagesCount({
    enabled: Boolean(currentArea === "manage" || currentArea === "messages"),
    query: {
      unread: true,
    },
  });

  const { canTrackConversions } =
    getPlanCapabilities(plan);

  return (
    <SidebarNav
      groups={NAV_GROUPS}
      areas={NAV_AREAS}
      currentArea={currentArea}
      data={{
        slug: slug || "",
        pathname,
        queryString: getQueryString(undefined, {
          include: ["folderId", "tagIds"],
        }),
        session: session || undefined,
        showNews: pathname.startsWith(`/${slug}/campaigns`) ? false : true,
        defaultProgramId: defaultProgramId || undefined,
        pendingPayoutsCount,
        applicationsCount,
        submittedBountiesCount,
        unreadMessagesCount,
        showConversionGuides: canTrackConversions,
        emailCampaignsEnabled: flags?.emailCampaigns,
      }}
      toolContent={toolContent}
      newsContent={newsContent}
      bottom={plan === "free" ? <SidebarUsage /> : undefined}
      switcher={<WorkspaceDropdown />}
    >
      {children}
    </SidebarNav>
  );
}
