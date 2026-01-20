"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { 
  Users, 
  Mail, 
  DollarSign, 
  MessageSquare,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@leadswap/ui";
import { CreateCampaignModal } from "./create-campaign-modal";
import { OutreachCampaignsList } from "./campaigns-list";
import { OutreachStats } from "./outreach-stats";

export function OutreachPageClient() {
  const { slug } = useParams() as { slug: string };
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Creator Outreach
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage your creator outreach campaigns and negotiations
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Stats Overview */}
      <OutreachStats workspaceSlug={slug} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard
          icon={<Mail className="h-5 w-5" />}
          title="Pending Approvals"
          count={12}
          description="Emails waiting for your review"
          href={`/${slug}/outreach/approvals`}
          variant="warning"
        />
        <QuickActionCard
          icon={<MessageSquare className="h-5 w-5" />}
          title="Active Negotiations"
          count={8}
          description="Conversations in progress"
          href={`/${slug}/outreach/conversations?status=negotiating`}
          variant="info"
        />
        <QuickActionCard
          icon={<Clock className="h-5 w-5" />}
          title="Follow-ups Due"
          count={24}
          description="Scheduled for today"
          href={`/${slug}/outreach/conversations?status=follow_up`}
          variant="default"
        />
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="font-medium text-neutral-900">Campaigns</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="pl-9 pr-4 py-1.5 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="secondary" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        <OutreachCampaignsList workspaceSlug={slug} />
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          workspaceSlug={slug}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  count,
  description,
  href,
  variant = "default",
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  description: string;
  href: string;
  variant?: "default" | "warning" | "info" | "success";
}) {
  const variantStyles = {
    default: "bg-neutral-50 border-neutral-200 text-neutral-600",
    warning: "bg-amber-50 border-amber-200 text-amber-600",
    info: "bg-blue-50 border-blue-200 text-blue-600",
    success: "bg-green-50 border-green-200 text-green-600",
  };

  return (
    <a
      href={href}
      className={`flex items-start gap-4 p-4 rounded-lg border transition-all hover:shadow-sm ${variantStyles[variant]}`}
    >
      <div className={`p-2 rounded-full bg-white/50`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold">{count}</span>
          <span className="text-sm font-medium">{title}</span>
        </div>
        <p className="text-xs opacity-80 mt-0.5">{description}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 opacity-50" />
    </a>
  );
}

