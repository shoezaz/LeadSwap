"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  RefreshCw,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Mail,
  DollarSign,
  Activity,
  Zap,
  Settings2,
} from "lucide-react";
import { Button } from "@leadswap/ui";
import useSWR, { mutate } from "swr";
import { fetcher, timeAgo } from "@leadswap/utils";
import { toast } from "sonner";

interface AgentControlProps {
  campaignId: string;
  workspaceSlug: string;
}

interface AgentStatus {
  campaignId: string;
  isActive: boolean;
  aiEnabled: boolean;
  approvalMode: string;
  status: string;
  phase: string;
  stats: {
    creatorsFound: number;
    creatorsContacted: number;
    dealsInProgress: number;
    dealsClosed: number;
    pendingApprovals: number;
  };
  recentActivity: {
    id: string;
    action: string;
    metadata: any;
    createdAt: string;
  }[];
  lastUpdate: string | null;
}

export function AgentControl({ campaignId, workspaceSlug }: AgentControlProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [streamEvents, setStreamEvents] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch agent status
  const { data: agentStatus, error, isLoading: statusLoading } = useSWR<AgentStatus>(
    `/api/workspaces/${workspaceSlug}/outreach/campaigns/${campaignId}/agent`,
    fetcher,
    { refreshInterval: 5000 } // Refresh every 5 seconds
  );

  // Connect to SSE stream when agent is active
  useEffect(() => {
    if (agentStatus?.isActive && !isStreaming) {
      connectStream();
    } else if (!agentStatus?.isActive && isStreaming) {
      disconnectStream();
    }

    return () => {
      disconnectStream();
    };
  }, [agentStatus?.isActive]);

  const connectStream = () => {
    if (eventSourceRef.current) return;

    const url = `/api/workspaces/${workspaceSlug}/outreach/campaigns/${campaignId}/agent/stream`;
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setIsStreaming(true);
      console.log("[AgentControl] SSE connected");
    };

    eventSource.addEventListener("activity", (event) => {
      const data = JSON.parse(event.data);
      setStreamEvents((prev) => [data, ...prev.slice(0, 19)]);
      
      // Refresh stats
      mutate(`/api/workspaces/${workspaceSlug}/outreach/campaigns/${campaignId}/agent`);
    });

    eventSource.addEventListener("stats", (event) => {
      const data = JSON.parse(event.data);
      // Could update local state for more responsive UI
    });

    eventSource.onerror = (error) => {
      console.error("[AgentControl] SSE error:", error);
      setIsStreaming(false);
      eventSource.close();
      eventSourceRef.current = null;
    };

    eventSourceRef.current = eventSource;
  };

  const disconnectStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsStreaming(false);
    }
  };

  const controlAgent = async (action: "start" | "stop" | "pause" | "resume") => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/workspaces/${workspaceSlug}/outreach/campaigns/${campaignId}/agent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to control agent");
      }

      const result = await res.json();
      toast.success(result.message);
      
      // Refresh status
      mutate(`/api/workspaces/${workspaceSlug}/outreach/campaigns/${campaignId}/agent`);
      mutate(`/api/workspaces/${workspaceSlug}/outreach/campaigns/${campaignId}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (statusLoading) {
    return (
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3" />
          <div className="h-20 bg-neutral-100 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg border border-red-200 p-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to load agent status</span>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    idle: "bg-neutral-100 text-neutral-700",
    researching: "bg-blue-100 text-blue-700",
    outreaching: "bg-purple-100 text-purple-700",
    negotiating: "bg-amber-100 text-amber-700",
    paused: "bg-orange-100 text-orange-700",
    completed: "bg-green-100 text-green-700",
  };

  const phaseIcons: Record<string, any> = {
    research: Users,
    outreach: Mail,
    negotiation: DollarSign,
    monitoring: Activity,
    idle: Clock,
  };

  const PhaseIcon = phaseIcons[agentStatus?.phase || "idle"] || Clock;

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-100 bg-gradient-to-r from-violet-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-violet-100 rounded-lg">
              <Sparkles className="h-4 w-4 text-violet-600" />
            </div>
            <h3 className="font-medium text-neutral-900">AI Campaign Agent</h3>
            {isStreaming && (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              statusColors[agentStatus?.status || "idle"]
            }`}>
              {agentStatus?.status || "idle"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 divide-x divide-neutral-100 border-b border-neutral-100">
        <StatItem
          icon={<Users className="h-4 w-4" />}
          label="Found"
          value={agentStatus?.stats.creatorsFound || 0}
        />
        <StatItem
          icon={<Mail className="h-4 w-4" />}
          label="Contacted"
          value={agentStatus?.stats.creatorsContacted || 0}
        />
        <StatItem
          icon={<Activity className="h-4 w-4" />}
          label="In Progress"
          value={agentStatus?.stats.dealsInProgress || 0}
        />
        <StatItem
          icon={<CheckCircle className="h-4 w-4" />}
          label="Closed"
          value={agentStatus?.stats.dealsClosed || 0}
          highlight
        />
      </div>

      {/* Controls */}
      <div className="p-4 space-y-4">
        {/* Current Phase */}
        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              agentStatus?.isActive ? "bg-violet-100 text-violet-600" : "bg-neutral-200 text-neutral-500"
            }`}>
              <PhaseIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900 capitalize">
                {agentStatus?.phase || "Idle"} Phase
              </p>
              <p className="text-xs text-neutral-500">
                {agentStatus?.isActive 
                  ? "Agent is actively working" 
                  : "Click Start to begin"}
              </p>
            </div>
          </div>

          {/* Pending Approvals Badge */}
          {(agentStatus?.stats.pendingApprovals || 0) > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {agentStatus?.stats.pendingApprovals} pending
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!agentStatus?.isActive ? (
            <Button
              className="flex-1 gap-2"
              onClick={() => controlAgent("start")}
              disabled={isLoading}
            >
              <Play className="h-4 w-4" />
              Start Agent
            </Button>
          ) : agentStatus?.status === "paused" ? (
            <>
              <Button
                className="flex-1 gap-2"
                onClick={() => controlAgent("resume")}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4" />
                Resume
              </Button>
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => controlAgent("stop")}
                disabled={isLoading}
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                className="flex-1 gap-2"
                onClick={() => controlAgent("pause")}
                disabled={isLoading}
              >
                <Pause className="h-4 w-4" />
                Pause
              </Button>
              <Button
                variant="secondary"
                className="gap-2 text-red-600 hover:text-red-700"
                onClick={() => controlAgent("stop")}
                disabled={isLoading}
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Mode Info */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <Settings2 className="h-3 w-3" />
            <span>Mode: <span className="font-medium capitalize">{agentStatus?.approvalMode || "manual"}</span></span>
          </div>
          {agentStatus?.lastUpdate && (
            <span>Last update: {timeAgo(new Date(agentStatus.lastUpdate))}</span>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {(agentStatus?.recentActivity?.length || 0) > 0 && (
        <div className="border-t border-neutral-100">
          <div className="px-4 py-2 bg-neutral-50">
            <h4 className="text-xs font-medium text-neutral-600 uppercase tracking-wide">
              Recent Activity
            </h4>
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-neutral-50">
            {agentStatus?.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-violet-500" />
                  <span className="text-sm text-neutral-700 capitalize">
                    {activity.action.replace(/_/g, " ")}
                  </span>
                </div>
                <span className="text-xs text-neutral-400">
                  {timeAgo(new Date(activity.createdAt))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`p-3 text-center ${highlight ? "bg-green-50" : ""}`}>
      <div className={`flex items-center justify-center mb-1 ${highlight ? "text-green-600" : "text-neutral-400"}`}>
        {icon}
      </div>
      <p className={`text-lg font-semibold ${highlight ? "text-green-700" : "text-neutral-900"}`}>
        {value}
      </p>
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  );
}


