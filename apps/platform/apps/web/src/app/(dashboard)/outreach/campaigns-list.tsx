"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Play,
  Pause,
  Archive,
  Trash2,
  ExternalLink,
  Users,
  Mail,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Button } from "@leadswap/ui";
import useSWR, { mutate } from "swr";
import { fetcher, timeAgo } from "@leadswap/utils";
import { toast } from "sonner";

interface OutreachCampaignsListProps {
  workspaceSlug: string;
}

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  brandName: string;
  budgetTotal: number;
  budgetSpent: number;
  budgetReserved: number;
  currency: string;
  createdAt: string;
  stats: {
    totalCreators: number;
    contacted: number;
    responded: number;
    negotiating: number;
    accepted: number;
    declined: number;
  };
}

export function OutreachCampaignsList({ workspaceSlug }: OutreachCampaignsListProps) {
  const { data, error, isLoading } = useSWR<{ campaigns: Campaign[] }>(
    `/api/workspaces/${workspaceSlug}/outreach/campaigns`,
    fetcher
  );

  const campaigns = data?.campaigns || [];

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-neutral-400" />
        <p className="text-sm text-neutral-500">Loading campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p className="font-medium">Failed to load campaigns</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-100">
      {campaigns.map((campaign) => (
        <CampaignRow
          key={campaign.id}
          campaign={campaign}
          workspaceSlug={workspaceSlug}
        />
      ))}
      
      {campaigns.length === 0 && (
        <div className="p-8 text-center text-neutral-500">
          <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No campaigns yet</p>
          <p className="text-sm">Create your first outreach campaign to get started</p>
        </div>
      )}
    </div>
  );
}

interface CampaignRowProps {
  campaign: Campaign;
  workspaceSlug: string;
}

function CampaignRow({ campaign, workspaceSlug }: CampaignRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusColors: Record<string, string> = {
    draft: "bg-neutral-100 text-neutral-700",
    active: "bg-green-100 text-green-700",
    paused: "bg-amber-100 text-amber-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const typeLabels: Record<string, string> = {
    paid_collaboration: "Paid",
    gifting: "Gifting",
    no_strings_seeding: "Seeding",
    usage_rights: "Rights",
  };

  const budgetUsedPercent = campaign.budgetTotal > 0
    ? Math.round(((campaign.budgetSpent + campaign.budgetReserved) / campaign.budgetTotal) * 100)
    : 0;

  const responseRate = campaign.stats.contacted > 0
    ? Math.round((campaign.stats.responded / campaign.stats.contacted) * 100)
    : 0;

  const updateCampaignStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceSlug}/outreach/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update campaign");
      
      // Revalidate the campaigns list
      mutate(`/api/workspaces/${workspaceSlug}/outreach/campaigns`);
      toast.success(`Campaign ${newStatus === "active" ? "activated" : newStatus}`);
    } catch (error) {
      toast.error("Failed to update campaign");
    } finally {
      setIsUpdating(false);
      setShowMenu(false);
    }
  };

  const deleteCampaign = async () => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/workspaces/${workspaceSlug}/outreach/campaigns/${campaign.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete campaign");
      
      mutate(`/api/workspaces/${workspaceSlug}/outreach/campaigns`);
      toast.success("Campaign deleted");
    } catch (error) {
      toast.error("Failed to delete campaign");
    } finally {
      setIsUpdating(false);
      setShowMenu(false);
    }
  };

  return (
    <Link
      href={`/${workspaceSlug}/outreach/${campaign.id}`}
      className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors"
    >
      {/* Campaign Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-neutral-900 truncate">
            {campaign.name}
          </span>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            statusColors[campaign.status] || statusColors.draft
          }`}>
            {campaign.status}
          </span>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100 text-neutral-600">
            {typeLabels[campaign.type] || campaign.type}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span>{campaign.brandName}</span>
          <span>•</span>
          <span>Created {timeAgo(new Date(campaign.createdAt))}</span>
        </div>
      </div>

      {/* Creators Progress */}
      <div className="w-32 hidden md:block">
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-4 w-4 text-neutral-400" />
          <span className="text-sm font-medium">
            {campaign.stats.accepted}/{campaign.stats.totalCreators}
          </span>
        </div>
        <div className="text-xs text-neutral-500">
          {responseRate}% response rate
        </div>
      </div>

      {/* Budget Progress */}
      <div className="w-40 hidden lg:block">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="font-medium">
            ${(campaign.budgetSpent + campaign.budgetReserved).toLocaleString()}
          </span>
          <span className="text-neutral-500">
            / ${campaign.budgetTotal.toLocaleString()}
          </span>
        </div>
        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
            style={{ width: `${Math.min(budgetUsedPercent, 100)}%` }}
          />
        </div>
        <div className="text-xs text-neutral-400 mt-0.5">
          {budgetUsedPercent}% utilized
        </div>
      </div>

      {/* Actions */}
      <div className="relative">
        <Button
          variant="secondary"
          className="h-8 w-8 p-0"
          disabled={isUpdating}
          onClick={(e) => {
            e.preventDefault();
            setShowMenu(!showMenu);
          }}
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
        
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10">
            <button 
              className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-50 flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
              View Campaign
            </button>
            {campaign.status === "active" ? (
              <button 
                className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-50 flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateCampaignStatus("paused");
                }}
              >
                <Pause className="h-4 w-4" />
                Pause
              </button>
            ) : campaign.status === "paused" || campaign.status === "draft" ? (
              <button 
                className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-50 flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateCampaignStatus("active");
                }}
              >
                <Play className="h-4 w-4" />
                {campaign.status === "draft" ? "Activate" : "Resume"}
              </button>
            ) : null}
            <button 
              className="w-full px-3 py-2 text-sm text-left hover:bg-neutral-50 flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                updateCampaignStatus("completed");
              }}
            >
              <Archive className="h-4 w-4" />
              Archive
            </button>
            <hr className="my-1 border-neutral-100" />
            <button 
              className="w-full px-3 py-2 text-sm text-left hover:bg-red-50 text-red-600 flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteCampaign();
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}

