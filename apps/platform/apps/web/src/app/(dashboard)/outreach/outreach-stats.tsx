"use client";

import { 
  Users, 
  Mail, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Percent,
  Loader2
} from "lucide-react";
import useSWR from "swr";
import { fetcher } from "@leadswap/utils";

interface OutreachStatsProps {
  workspaceSlug: string;
}

interface StatsData {
  totalCampaigns: number;
  activeCampaigns: number;
  totalCreators: number;
  emailsSent: number;
  responseRate: number;
  acceptedDeals: number;
  totalBudget: number;
  totalBudgetSpent: number;
  totalBudgetReserved: number;
  averageDealSize: number;
  conversionRate: number;
}

export function OutreachStats({ workspaceSlug }: OutreachStatsProps) {
  const { data: stats, isLoading, error } = useSWR<StatsData>(
    `/api/workspaces/${workspaceSlug}/outreach/stats`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border p-4 bg-neutral-50 animate-pulse">
            <div className="h-10 bg-neutral-200 rounded mb-2" />
            <div className="h-6 bg-neutral-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    // Show zeros if error or no data
    const emptyStats = {
      totalCreators: 0,
      emailsSent: 0,
      responseRate: 0,
      acceptedDeals: 0,
      totalBudgetSpent: 0,
      totalBudgetReserved: 0,
      conversionRate: 0,
    };
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Users className="h-5 w-5" />} label="Total Creators" value="0" color="blue" />
        <StatCard icon={<Mail className="h-5 w-5" />} label="Emails Sent" value="0" subtext="0% response rate" color="purple" />
        <StatCard icon={<CheckCircle className="h-5 w-5" />} label="Accepted Deals" value="0" subtext="0% conversion" color="green" />
        <StatCard icon={<DollarSign className="h-5 w-5" />} label="Budget Spent" value="$0" subtext="$0 reserved" color="amber" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        icon={<Users className="h-5 w-5" />}
        label="Total Creators"
        value={stats.totalCreators.toLocaleString()}
        color="blue"
      />
      <StatCard
        icon={<Mail className="h-5 w-5" />}
        label="Emails Sent"
        value={stats.emailsSent.toLocaleString()}
        subtext={`${stats.responseRate}% response rate`}
        color="purple"
      />
      <StatCard
        icon={<CheckCircle className="h-5 w-5" />}
        label="Accepted Deals"
        value={stats.acceptedDeals.toLocaleString()}
        subtext={`${stats.conversionRate}% conversion`}
        color="green"
      />
      <StatCard
        icon={<DollarSign className="h-5 w-5" />}
        label="Budget Spent"
        value={`$${stats.totalBudgetSpent.toLocaleString()}`}
        subtext={`$${stats.totalBudgetReserved.toLocaleString()} reserved`}
        color="amber"
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  trend?: { value: number; positive: boolean };
  color: "blue" | "purple" | "green" | "amber" | "red";
}

function StatCard({ icon, label, value, subtext, trend, color }: StatCardProps) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    green: "bg-green-50 text-green-600 border-green-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };

  const iconBgStyles = {
    blue: "bg-blue-100",
    purple: "bg-purple-100",
    green: "bg-green-100",
    amber: "bg-amber-100",
    red: "bg-red-100",
  };

  return (
    <div className={`rounded-lg border p-4 ${colorStyles[color]}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-full ${iconBgStyles[color]}`}>
          {icon}
        </div>
        <span className="text-sm font-medium opacity-80">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {trend && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${
            trend.positive ? "text-green-600" : "text-red-600"
          }`}>
            <TrendingUp className={`h-3 w-3 ${!trend.positive && "rotate-180"}`} />
            {trend.value}%
          </span>
        )}
      </div>
      {subtext && (
        <p className="text-xs opacity-70 mt-1">{subtext}</p>
      )}
    </div>
  );
}

