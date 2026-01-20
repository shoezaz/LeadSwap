"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Pause,
  Settings,
  Users,
  Mail,
  DollarSign,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Search,
  Filter,
  Send,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@leadswap/ui";
import { fetcher, timeAgo } from "@leadswap/utils";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import { AgentControl } from "./agent-control";
import { AddCreatorsModal } from "./add-creators-modal";

interface CampaignData {
  id: string;
  name: string;
  type: string;
  status: string;
  brandName: string;
  budgetTotal: number;
  budgetSpent: number;
  budgetReserved: number;
  budgetAvailable: number;
  budgetMaxPerCreator: number | null;
  currency: string;
  approvalMode: string;
  aiEnabled: boolean;
  createdAt: string;
  stats: {
    totalCreators: number;
    contacted: number;
    responded: number;
    negotiating: number;
    accepted: number;
    declined: number;
    responseRate: number;
    conversionRate: number;
  };
}

interface Creator {
  id: string;
  name: string | null;
  email: string;
  handle: string | null;
  platform: string | null;
  status: string;
  lastActivity: string | null;
  latestOffer: {
    id: string;
    amount: number;
    currency: string;
    status: string;
  } | null;
}

export function CampaignDetailClient() {
  const { slug, campaignId } = useParams() as { slug: string; campaignId: string };
  const [activeTab, setActiveTab] = useState<"creators" | "conversations" | "offers" | "analytics">("creators");
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddCreatorsModal, setShowAddCreatorsModal] = useState(false);

  // Fetch campaign data
  const { data: campaign, isLoading: campaignLoading, error: campaignError } = useSWR<CampaignData>(
    `/api/workspaces/${slug}/outreach/campaigns/${campaignId}`,
    fetcher
  );

  // Fetch creators data
  const { data: creatorsData, isLoading: creatorsLoading } = useSWR<{ creators: Creator[] }>(
    `/api/workspaces/${slug}/outreach/campaigns/${campaignId}/creators`,
    fetcher
  );

  const creators = creatorsData?.creators || [];

  const updateCampaignStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/workspaces/${slug}/outreach/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update campaign");
      
      mutate(`/api/workspaces/${slug}/outreach/campaigns/${campaignId}`);
      mutate(`/api/workspaces/${slug}/outreach/campaigns`);
      toast.success(`Campaign ${newStatus === "active" ? "activated" : newStatus}`);
    } catch (error) {
      toast.error("Failed to update campaign");
    } finally {
      setIsUpdating(false);
    }
  };

  if (campaignLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (campaignError || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <XCircle className="h-12 w-12 text-red-400 mb-4" />
        <h2 className="text-lg font-medium text-neutral-900">Campaign not found</h2>
        <p className="text-sm text-neutral-500 mt-1">This campaign may have been deleted or you don't have access.</p>
        <Link href={`/${slug}/outreach`} className="mt-4 text-blue-600 hover:underline text-sm">
          Back to campaigns
        </Link>
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    pending_outreach: { label: "Pending", color: "neutral", icon: Clock },
    awaiting_response: { label: "Contacted", color: "blue", icon: Mail },
    outreach_sent: { label: "Contacted", color: "blue", icon: Mail },
    follow_up_1: { label: "Follow-up 1", color: "amber", icon: Clock },
    follow_up_2: { label: "Follow-up 2", color: "amber", icon: Clock },
    follow_up_3: { label: "Follow-up 3", color: "amber", icon: Clock },
    replied: { label: "Replied", color: "blue", icon: MessageSquare },
    in_negotiation: { label: "Negotiating", color: "purple", icon: MessageSquare },
    negotiating: { label: "Negotiating", color: "purple", icon: MessageSquare },
    offer_sent: { label: "Offer Sent", color: "purple", icon: DollarSign },
    offer_accepted: { label: "Accepted", color: "green", icon: CheckCircle },
    deal_closed: { label: "Deal Closed", color: "green", icon: CheckCircle },
    accepted: { label: "Accepted", color: "green", icon: CheckCircle },
    declined: { label: "Declined", color: "red", icon: XCircle },
    not_interested: { label: "Not Interested", color: "red", icon: XCircle },
  };

  const budgetPercent = campaign.budgetTotal > 0
    ? Math.round(((campaign.budgetSpent + campaign.budgetReserved) / campaign.budgetTotal) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/${slug}/outreach`}
            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-neutral-900">
              {campaign.name}
            </h1>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              campaign.status === "active" 
                ? "bg-green-100 text-green-700"
                : "bg-neutral-100 text-neutral-700"
            }`}>
              {campaign.status}
            </span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            {campaign.brandName} • Created {timeAgo(new Date(campaign.createdAt))}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {campaign.status === "active" ? (
            <Button 
              variant="secondary" 
              className="gap-2"
              disabled={isUpdating}
              onClick={() => updateCampaignStatus("paused")}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pause className="h-4 w-4" />}
              Pause
            </Button>
          ) : (
            <Button 
              className="gap-2"
              disabled={isUpdating}
              onClick={() => updateCampaignStatus("active")}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {campaign.status === "draft" ? "Activate" : "Resume"}
            </Button>
          )}
          <Button variant="secondary" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatBox
          label="Total Creators"
          value={campaign.stats.totalCreators}
          icon={<Users className="h-4 w-4" />}
        />
        <StatBox
          label="Contacted"
          value={campaign.stats.contacted}
          subtext={`${Math.round((campaign.stats.contacted / campaign.stats.totalCreators) * 100)}%`}
          icon={<Mail className="h-4 w-4" />}
        />
        <StatBox
          label="Responded"
          value={campaign.stats.responded}
          subtext={`${Math.round((campaign.stats.responded / campaign.stats.contacted) * 100)}% rate`}
          icon={<MessageSquare className="h-4 w-4" />}
        />
        <StatBox
          label="Accepted"
          value={campaign.stats.accepted}
          icon={<CheckCircle className="h-4 w-4" />}
          highlight
        />
        <StatBox
          label="Budget Used"
          value={`$${(campaign.budgetSpent + campaign.budgetReserved).toLocaleString()}`}
          subtext={`of $${campaign.budgetTotal.toLocaleString()} (${budgetPercent}%)`}
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* AI Agent Control */}
      {campaign.aiEnabled && (
        <AgentControl campaignId={campaignId} workspaceSlug={slug} />
      )}

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <nav className="flex gap-6">
          {[
            { id: "creators", label: "Creators", count: campaign.stats.totalCreators },
            { id: "conversations", label: "Conversations", count: campaign.stats.contacted },
            { id: "offers", label: "Offers", count: campaign.stats.negotiating + campaign.stats.accepted },
            { id: "analytics", label: "Analytics" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-neutral-100">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "creators" && (
        <div className="bg-white rounded-lg border border-neutral-200">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search creators..."
                  className="pl-9 pr-4 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="secondary" className="gap-2 text-sm">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {selectedCreators.length > 0 && (
                <Button className="gap-2">
                  <Send className="h-4 w-4" />
                  Send Outreach ({selectedCreators.length})
                </Button>
              )}
              <Button 
                variant="secondary" 
                className="gap-2"
                onClick={() => setShowAddCreatorsModal(true)}
              >
                <Plus className="h-4 w-4" />
                Add Creators
              </Button>
            </div>
          </div>

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 text-left text-sm text-neutral-500">
                <th className="px-4 py-3 font-medium">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCreators(creators.map(c => c.id));
                      } else {
                        setSelectedCreators([]);
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-3 font-medium">Creator</th>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Offer</th>
                <th className="px-4 py-3 font-medium">Last Activity</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {creatorsLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <Loader2 className="h-6 w-6 mx-auto animate-spin text-neutral-400" />
                  </td>
                </tr>
              ) : creators.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-neutral-500">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p>No creators added yet</p>
                  </td>
                </tr>
              ) : (
                creators.map((creator) => {
                  const statusInfo = statusConfig[creator.status] || statusConfig.pending_outreach;
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={creator.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-neutral-300"
                          checked={selectedCreators.includes(creator.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCreators([...selectedCreators, creator.id]);
                            } else {
                              setSelectedCreators(selectedCreators.filter(id => id !== creator.id));
                            }
                          }}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium text-neutral-900">{creator.name || creator.email}</span>
                          <div className="text-sm text-neutral-500">{creator.handle || creator.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">{creator.platform || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full ${
                          statusInfo.color === "green" ? "bg-green-100 text-green-700" :
                          statusInfo.color === "blue" ? "bg-blue-100 text-blue-700" :
                          statusInfo.color === "amber" ? "bg-amber-100 text-amber-700" :
                          statusInfo.color === "purple" ? "bg-purple-100 text-purple-700" :
                          statusInfo.color === "red" ? "bg-red-100 text-red-700" :
                          "bg-neutral-100 text-neutral-700"
                        }`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {creator.latestOffer ? (
                          <span className={`text-sm font-medium ${
                            creator.latestOffer.status === "accepted" ? "text-green-600" : "text-neutral-600"
                          }`}>
                            ${creator.latestOffer.amount}
                          </span>
                        ) : (
                          <span className="text-sm text-neutral-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-500">
                          {creator.lastActivity ? timeAgo(new Date(creator.lastActivity)) : "Never"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="secondary" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "conversations" && (
        <ConversationsList 
          creators={creators} 
          slug={slug} 
          campaignId={campaignId} 
          statusConfig={statusConfig} 
          isLoading={creatorsLoading} 
        />
      )}

      {activeTab === "offers" && (
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center text-neutral-500">
          <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Offers view coming soon...</p>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center text-neutral-500">
          <div className="h-12 w-12 mx-auto mb-3 opacity-30">📊</div>
          <p>Analytics coming soon...</p>
        </div>
      )}

      {/* Add Creators Modal */}
      {showAddCreatorsModal && (
        <AddCreatorsModal
          campaignId={campaignId}
          workspaceSlug={slug}
          onClose={() => setShowAddCreatorsModal(false)}
        />
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  subtext,
  icon,
  highlight,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg border ${
      highlight 
        ? "border-green-200 bg-green-50" 
        : "border-neutral-200 bg-white"
    }`}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-neutral-400">{icon}</span>}
        <span className="text-sm text-neutral-600">{label}</span>
      </div>
      <div className={`text-2xl font-semibold ${highlight ? "text-green-700" : "text-neutral-900"}`}>
        {value}
      </div>
      {subtext && (
        <div className="text-xs text-neutral-500 mt-0.5">{subtext}</div>
      )}
    </div>
  );
}

function ConversationsList({
  creators,
  slug,
  campaignId,
  statusConfig,
  isLoading,
}: {
  creators: Creator[];
  slug: string;
  campaignId: string;
  statusConfig: Record<string, { label: string; color: string; icon: any }>;
  isLoading?: boolean;
}) {
  // Filter to only show contacted creators
  const conversations = creators.filter(c => c.status !== "pending_outreach");

  return (
    <div className="bg-white rounded-lg border border-neutral-200">
      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="font-medium text-neutral-900">All Conversations</h3>
        <div className="flex items-center gap-2">
          <select className="text-sm border border-neutral-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Statuses</option>
            <option value="awaiting">Awaiting Response</option>
            <option value="negotiating">Negotiating</option>
            <option value="no_response">No Response</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-neutral-100">
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-neutral-400" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No conversations yet. Send outreach to get started!</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const statusInfo = statusConfig[conv.status] || statusConfig.pending_outreach;
            const StatusIcon = statusInfo.icon;
            const displayName = conv.name || conv.email;

            return (
              <Link
                key={conv.id}
                href={`/${slug}/outreach/${campaignId}/conversations/${conv.id}`}
                className="flex items-center justify-between px-4 py-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {displayName[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">{displayName}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                        statusInfo.color === "green" ? "bg-green-100 text-green-700" :
                        statusInfo.color === "blue" ? "bg-blue-100 text-blue-700" :
                        statusInfo.color === "amber" ? "bg-amber-100 text-amber-700" :
                        statusInfo.color === "purple" ? "bg-purple-100 text-purple-700" :
                        statusInfo.color === "red" ? "bg-red-100 text-red-700" :
                        "bg-neutral-100 text-neutral-700"
                      }`}>
                        <StatusIcon className="h-3 w-3" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 truncate max-w-md">
                      {conv.handle || conv.email} • {conv.platform || "Email"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {conv.latestOffer && (
                    <span className="text-sm font-medium text-neutral-600">
                      ${conv.latestOffer.amount}
                    </span>
                  )}
                  <span className="text-sm text-neutral-400">
                    {conv.lastActivity ? timeAgo(new Date(conv.lastActivity)) : "—"}
                  </span>
                  <Eye className="h-4 w-4 text-neutral-400" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

