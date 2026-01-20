import { ExtendedWorkspaceProps } from "@/lib/types";
import { STARTUP_PLAN, fetcher, getCliqoNextPlan, type CliqoPlanTier } from "@leadswap/utils";
import { useParams, useSearchParams } from "next/navigation";
import useSWR, { SWRConfiguration } from "swr";

export default function useWorkspace({
  swrOpts,
}: {
  swrOpts?: SWRConfiguration;
} = {}) {
  let { slug } = useParams() as { slug: string | null };
  const searchParams = useSearchParams();
  if (!slug) {
    slug = searchParams.get("slug") || searchParams.get("workspace");
  }

  const {
    data: workspace,
    error,
    mutate,
  } = useSWR<ExtendedWorkspaceProps>(
    slug && `/api/workspaces/${slug}`,
    fetcher,
    {
      dedupingInterval: 60000,
      ...swrOpts,
    },
  );

  // Get Cliqo plan tier from workspace
  const planTier = (workspace?.planTier as CliqoPlanTier) || "free_trial";

  return {
    ...workspace,
    planTier,
    nextPlan: getCliqoNextPlan(planTier) ?? STARTUP_PLAN,
    role: (workspace?.users && workspace.users[0].role) || "member",
    isOwner: workspace?.users && workspace.users[0].role === "owner",
    // Legacy Dub metrics (keep for backwards compat)
    exceededClicks: workspace && workspace.usage >= workspace.usageLimit,
    exceededLinks: workspace && workspace.linksUsage >= workspace.linksLimit,
    exceededAI: workspace && workspace.aiUsage >= workspace.aiLimit,
    exceededDomains:
      workspace?.domains && workspace.domains.length >= workspace.domainsLimit,
    // Cliqo-specific limits
    exceededPartners:
      workspace && workspace.partnersActiveCount >= workspace.partnersLimit,
    exceededCampaigns:
      workspace && workspace.campaignsActiveCount >= workspace.campaignsLimit,
    exceededDiscovery:
      workspace && workspace.discoverySearchUsage >= workspace.discoverySearchLimit,
    error,
    defaultFolderId: workspace?.users && workspace.users[0].defaultFolderId,
    mutate,
    loading: slug && !workspace && !error ? true : false,
  };
}

