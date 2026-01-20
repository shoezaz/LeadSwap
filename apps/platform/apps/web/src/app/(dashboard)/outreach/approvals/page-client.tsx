"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  Edit,
  Eye,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Sparkles,
  User,
  Mail,
  DollarSign,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Button } from "@leadswap/ui";
import { fetcher, timeAgo } from "@leadswap/utils";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";

type ApprovalItem = {
  id: string;
  type: "email" | "offer" | "action";
  campaignId: string;
  campaignName: string;
  conversationId?: string;
  creatorName?: string;
  creatorEmail?: string;
  subject?: string;
  content?: string;
  templateType?: string;
  generatedBy?: string;
  amount?: number;
  currency?: string;
  deliverables?: any;
  actionType?: string;
  metadata?: any;
  createdAt: string;
};

interface ApprovalsData {
  approvals: ApprovalItem[];
  pagination: { total: number };
  summary: { emails: number; offers: number; actions: number };
}

export function ApprovalQueueClient() {
  const { slug } = useParams() as { slug: string };
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Fetch pending approvals
  const { data, isLoading, error } = useSWR<ApprovalsData>(
    `/api/workspaces/${slug}/outreach/approvals`,
    fetcher
  );

  const pendingMessages = data?.approvals || [];

  const handleApprove = async (item: ApprovalItem, modifications?: { content?: string; amount?: number }) => {
    setProcessingIds(prev => new Set(prev).add(item.id));
    try {
      const res = await fetch(`/api/workspaces/${slug}/outreach/approvals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          itemType: item.type,
          action: "approve",
          modifications,
        }),
      });

      if (!res.ok) throw new Error("Failed to approve");
      
      mutate(`/api/workspaces/${slug}/outreach/approvals`);
      mutate(`/api/workspaces/${slug}/outreach/stats`);
      toast.success("Approved successfully");
    } catch (error) {
      toast.error("Failed to approve");
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  const handleReject = async (item: ApprovalItem, reason?: string) => {
    setProcessingIds(prev => new Set(prev).add(item.id));
    try {
      const res = await fetch(`/api/workspaces/${slug}/outreach/approvals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          itemType: item.type,
          action: "reject",
          reason,
        }),
      });

      if (!res.ok) throw new Error("Failed to reject");
      
      mutate(`/api/workspaces/${slug}/outreach/approvals`);
      toast.success("Rejected");
    } catch (error) {
      toast.error("Failed to reject");
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  const handleBulkApprove = async () => {
    const selected = pendingMessages.filter(m => selectedMessages.includes(m.id));
    for (const item of selected) {
      await handleApprove(item);
    }
    setSelectedMessages([]);
  };

  const handleEdit = (message: ApprovalItem) => {
    setEditingMessage(message.id);
    setEditedContent(message.content || "");
  };

  const handleSaveEdit = async (item: ApprovalItem) => {
    await handleApprove(item, { content: editedContent });
    setEditingMessage(null);
  };

  const toggleExpand = (messageId: string) => {
    setExpandedMessage(expandedMessage === messageId ? null : messageId);
  };

  const toggleSelect = (messageId: string) => {
    if (selectedMessages.includes(messageId)) {
      setSelectedMessages(selectedMessages.filter((id) => id !== messageId));
    } else {
      setSelectedMessages([...selectedMessages, messageId]);
    }
  };

  const selectAll = () => {
    if (selectedMessages.length === pendingMessages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(pendingMessages.map((m) => m.id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Link
            href={`/${slug}/outreach`}
            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Outreach
          </Link>
          <h1 className="text-2xl font-semibold text-neutral-900">Approval Queue</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      </div>
    );
  }

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
            Back to Outreach
          </Link>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Approval Queue
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Review and approve AI-generated messages before sending
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedMessages.length > 0 && (
            <>
              <Button
                variant="secondary"
                className="gap-2 text-red-600 hover:text-red-700"
                onClick={() => setSelectedMessages([])}
              >
                <X className="h-4 w-4" />
                Clear Selection
              </Button>
              <Button className="gap-2" onClick={handleBulkApprove}>
                <Check className="h-4 w-4" />
                Approve Selected ({selectedMessages.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2 text-amber-700">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">
            {pendingMessages.length} items awaiting approval
          </span>
        </div>
        {data?.summary && (
          <div className="flex items-center gap-4 text-sm text-amber-600">
            {data.summary.emails > 0 && <span>{data.summary.emails} emails</span>}
            {data.summary.offers > 0 && <span>{data.summary.offers} offers</span>}
            {data.summary.actions > 0 && <span>{data.summary.actions} actions</span>}
          </div>
        )}
        <div className="flex-1" />
        {pendingMessages.length > 0 && (
          <div className="text-sm text-amber-600">
            Oldest: {timeAgo(new Date(pendingMessages[pendingMessages.length - 1]?.createdAt))}
          </div>
        )}
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg border border-neutral-200 divide-y divide-neutral-100">
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-4 bg-neutral-50">
          <input
            type="checkbox"
            className="rounded border-neutral-300"
            checked={selectedMessages.length === pendingMessages.length}
            onChange={selectAll}
          />
          <span className="text-sm font-medium text-neutral-700 flex-1">
            Pending Messages
          </span>
          <span className="text-sm text-neutral-500">
            {selectedMessages.length} selected
          </span>
        </div>

        {/* Messages */}
        {pendingMessages.length === 0 ? (
          <div className="p-12 text-center">
            <Check className="h-12 w-12 mx-auto mb-4 text-green-500 opacity-50" />
            <p className="text-lg font-medium text-neutral-700">
              All caught up!
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              No items are waiting for approval
            </p>
          </div>
        ) : (
          pendingMessages.map((message) => {
            const isExpanded = expandedMessage === message.id;
            const isEditing = editingMessage === message.id;
            const isSelected = selectedMessages.includes(message.id);
            const isProcessing = processingIds.has(message.id);

            return (
              <div
                key={message.id}
                className={`${isSelected ? "bg-blue-50" : ""}`}
              >
                {/* Message Row */}
                <div className="px-4 py-4">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-neutral-300"
                      checked={isSelected}
                      onChange={() => toggleSelect(message.id)}
                      disabled={isProcessing}
                    />

                    <button
                      onClick={() => toggleExpand(message.id)}
                      className="mt-1 text-neutral-400 hover:text-neutral-600"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-neutral-900">
                            {message.creatorName || "Unknown"}
                          </span>
                          {message.creatorEmail && (
                            <span className="text-sm text-neutral-500">
                              &lt;{message.creatorEmail}&gt;
                            </span>
                          )}
                        </div>
                        <span className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-600 rounded">
                          {message.campaignName}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          message.type === "email" ? "bg-blue-100 text-blue-700" :
                          message.type === "offer" ? "bg-green-100 text-green-700" :
                          "bg-purple-100 text-purple-700"
                        }`}>
                          {message.type}
                        </span>
                        {message.generatedBy === "ai" && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                            <Sparkles className="h-3 w-3" />
                            AI Generated
                          </span>
                        )}
                        {message.amount && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded">
                            <DollarSign className="h-3 w-3" />
                            ${message.amount}
                          </span>
                        )}
                      </div>

                      {message.subject && (
                        <div className="text-sm text-neutral-700 mb-1">
                          {message.subject}
                        </div>
                      )}

                      {message.type === "action" && message.actionType && (
                        <div className="text-sm text-neutral-700 mb-1">
                          Action: <span className="font-medium">{message.actionType}</span>
                        </div>
                      )}

                      {!isExpanded && message.content && (
                        <p className="text-sm text-neutral-500 truncate">
                          {message.content.split("\n")[0]}...
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400">
                        <Clock className="h-3 w-3" />
                        Created {timeAgo(new Date(message.createdAt))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {message.type === "email" && (
                        <Button
                          variant="secondary"
                          className="h-8 gap-1 text-sm"
                          onClick={() => handleEdit(message)}
                          disabled={isProcessing}
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        className="h-8 gap-1 text-sm text-red-600 hover:text-red-700"
                        onClick={() => handleReject(message)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                        Reject
                      </Button>
                      <Button
                        className="h-8 gap-1 text-sm"
                        onClick={() => handleApprove(message)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-16 pb-4">
                    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                      {isEditing ? (
                        <div className="space-y-3">
                          <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full min-h-[200px] p-3 border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="secondary"
                              onClick={() => setEditingMessage(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => handleSaveEdit(message)}
                              disabled={isProcessing}
                            >
                              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                              Save & Approve
                            </Button>
                          </div>
                        </div>
                      ) : message.content ? (
                        <div className="whitespace-pre-wrap text-sm text-neutral-700">
                          {message.content}
                        </div>
                      ) : message.deliverables ? (
                        <div className="text-sm text-neutral-700">
                          <p className="font-medium mb-2">Offer Details:</p>
                          <p>Amount: ${message.amount} {message.currency}</p>
                          <p>Deliverables: {JSON.stringify(message.deliverables)}</p>
                        </div>
                      ) : message.metadata ? (
                        <div className="text-sm text-neutral-700">
                          <p className="font-medium mb-2">Action Details:</p>
                          <pre className="text-xs bg-neutral-100 p-2 rounded overflow-auto">
                            {JSON.stringify(message.metadata, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-500">No additional details</p>
                      )}
                    </div>

                    {/* Quick Actions */}
                    {message.conversationId && (
                      <div className="flex items-center gap-2 mt-3">
                        <Link
                          href={`/${slug}/outreach/${message.campaignId}/conversations/${message.conversationId}`}
                          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View Conversation
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

