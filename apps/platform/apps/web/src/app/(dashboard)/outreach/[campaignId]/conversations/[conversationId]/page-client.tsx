"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  MailOpen,
  MousePointer,
  User,
  Building,
  DollarSign,
  MessageSquare,
  MoreHorizontal,
  Copy,
  RefreshCw,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@leadswap/ui";
import { timeAgo } from "@leadswap/utils";

type Message = {
  id: string;
  sender: "brand" | "creator" | "system";
  content: string;
  subject?: string;
  sentAt: Date | null;
  deliveredAt: Date | null;
  openedAt: Date | null;
  clickedAt: Date | null;
  bouncedAt: Date | null;
  generatedBy: "ai" | "human" | "template" | null;
  templateType: string | null;
  requiresApproval: boolean;
  approvedAt: Date | null;
};

type Offer = {
  id: string;
  amount: number;
  status: string;
  deliverables: Record<string, number>;
  sentAt: Date | null;
  expiresAt: Date | null;
};

type Conversation = {
  id: string;
  creatorName: string | null;
  creatorEmail: string;
  creatorHandle: string | null;
  creatorPlatform: string | null;
  creatorProfileUrl: string | null;
  status: string;
  icebreaker: string | null;
  specificContent: string | null;
  messages: Message[];
  offers: Offer[];
};

export function ConversationThreadClient() {
  const { slug, campaignId, conversationId } = useParams() as {
    slug: string;
    campaignId: string;
    conversationId: string;
  };

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIOptions, setShowAIOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setConversation({
        id: conversationId,
        creatorName: "Alex Tech",
        creatorEmail: "alex@techcreator.com",
        creatorHandle: "@alextech",
        creatorPlatform: "YouTube",
        creatorProfileUrl: "https://youtube.com/@alextech",
        status: "negotiating",
        icebreaker: "Loved your recent video on AI productivity tools!",
        specificContent: "Your AI productivity video with 500K views",
        messages: [
          {
            id: "msg_1",
            sender: "brand",
            subject: "Partnership opportunity with Cliqo",
            content:
              "Hi Alex,\n\nI've been following your content for a while, and I particularly loved your recent video on AI productivity tools! Your explanation of prompt engineering was super clear.\n\nWe're reaching out because Cliqo would love to partner with you for an upcoming campaign. We're looking for creators who can authentically showcase our product to their tech-savvy audience.\n\nWould you be interested in learning more?\n\nBest,\nSarah from Cliqo",
            sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 1000),
            openedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            clickedAt: null,
            bouncedAt: null,
            generatedBy: "template",
            templateType: "initial_outreach_detailed",
            requiresApproval: false,
            approvedAt: null,
          },
          {
            id: "msg_2",
            sender: "creator",
            content:
              "Hi Sarah!\n\nThanks for reaching out - I actually use Cliqo already and love the product! I'd definitely be interested in discussing a partnership.\n\nCould you share more details about what you're looking for in terms of deliverables and compensation?\n\nBest,\nAlex",
            sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            deliveredAt: null,
            openedAt: null,
            clickedAt: null,
            bouncedAt: null,
            generatedBy: null,
            templateType: null,
            requiresApproval: false,
            approvedAt: null,
          },
          {
            id: "msg_3",
            sender: "brand",
            content:
              "That's great to hear you're already a fan! Here's what we're thinking:\n\nDeliverables:\n• 1 dedicated YouTube video (10+ minutes)\n• 3 Instagram Stories\n• 1 tweet/X post\n\nWe're offering $800 for the full package, plus we'll provide you with a custom affiliate link that earns you 15% commission on any sales.\n\nLet me know what you think!",
            sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2000),
            openedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60000),
            clickedAt: null,
            bouncedAt: null,
            generatedBy: "ai",
            templateType: null,
            requiresApproval: false,
            approvedAt: null,
          },
          {
            id: "msg_4",
            sender: "creator",
            content:
              "Thanks for the detailed breakdown! I'm definitely interested, but I typically charge $1,000 for a dedicated video of that length. Would you be able to meet me at $950?\n\nThe stories and tweet are no problem.",
            sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            deliveredAt: null,
            openedAt: null,
            clickedAt: null,
            bouncedAt: null,
            generatedBy: null,
            templateType: null,
            requiresApproval: false,
            approvedAt: null,
          },
        ],
        offers: [
          {
            id: "offer_1",
            amount: 800,
            status: "counter_offered",
            deliverables: { youtube_video: 1, instagram_stories: 3, twitter_post: 1 },
            sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          },
        ],
      });
      setIsLoading(false);
    }, 500);
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const handleSend = async () => {
    if (!replyContent.trim()) return;
    // Implementation would send the message
    setReplyContent("");
  };

  const handleGenerateReply = async (style: string) => {
    setIsGenerating(true);
    setShowAIOptions(false);
    // Simulate AI generation
    setTimeout(() => {
      if (style === "accept") {
        setReplyContent(
          "Hi Alex,\n\nThanks for your counter-offer! I've discussed this with the team, and we can meet you at $900 - that's the best we can do for this campaign.\n\nThis includes all the deliverables we discussed, plus the 15% affiliate commission.\n\nLet me know if this works for you!\n\nBest,\nSarah"
        );
      } else if (style === "negotiate") {
        setReplyContent(
          "Hi Alex,\n\nI appreciate you sharing your rates! While we can't quite reach $950, we could offer $850 plus an increased affiliate commission of 20% (up from 15%).\n\nGiven your existing audience engagement, this could actually work out to more than the flat rate over time.\n\nWhat do you think?\n\nBest,\nSarah"
        );
      } else {
        setReplyContent(
          "Hi Alex,\n\nThanks for getting back to me! I'll need to check with the team on the budget adjustment and will get back to you shortly.\n\nBest,\nSarah"
        );
      }
      setIsGenerating(false);
    }, 1500);
  };

  if (isLoading || !conversation) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    pending_outreach: { label: "Pending Outreach", color: "neutral" },
    outreach_sent: { label: "Outreach Sent", color: "blue" },
    awaiting_response: { label: "Awaiting Response", color: "amber" },
    negotiating: { label: "Negotiating", color: "purple" },
    offer_sent: { label: "Offer Sent", color: "blue" },
    accepted: { label: "Accepted", color: "green" },
    declined: { label: "Declined", color: "red" },
    no_response: { label: "No Response", color: "neutral" },
  };

  const status = statusConfig[conversation.status] || statusConfig.pending_outreach;

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-neutral-200 bg-white">
        <div className="px-6 py-4">
          <Link
            href={`/${slug}/outreach/${campaignId}`}
            className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Campaign
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                {conversation.creatorName?.[0] || "?"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold text-neutral-900">
                    {conversation.creatorName || conversation.creatorEmail}
                  </h1>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      status.color === "green"
                        ? "bg-green-100 text-green-700"
                        : status.color === "blue"
                        ? "bg-blue-100 text-blue-700"
                        : status.color === "amber"
                        ? "bg-amber-100 text-amber-700"
                        : status.color === "purple"
                        ? "bg-purple-100 text-purple-700"
                        : status.color === "red"
                        ? "bg-red-100 text-red-700"
                        : "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                  {conversation.creatorHandle && (
                    <span>{conversation.creatorHandle}</span>
                  )}
                  {conversation.creatorPlatform && (
                    <>
                      <span>•</span>
                      <span>{conversation.creatorPlatform}</span>
                    </>
                  )}
                  <span>•</span>
                  <span>{conversation.creatorEmail}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" className="gap-2">
                <DollarSign className="h-4 w-4" />
                Create Offer
              </Button>
              <Button variant="secondary" className="h-9 w-9 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {conversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Compose Area */}
          <div className="flex-shrink-0 border-t border-neutral-200 bg-white p-4">
            <div className="relative">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply..."
                className="w-full min-h-[120px] p-3 pr-12 border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isGenerating}
              />
              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                    <span className="text-sm font-medium">AI is writing...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="relative">
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={() => setShowAIOptions(!showAIOptions)}
                  disabled={isGenerating}
                >
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  AI Assist
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {showAIOptions && (
                  <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-10">
                    <button
                      onClick={() => handleGenerateReply("accept")}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Accept Counter-Offer
                    </button>
                    <button
                      onClick={() => handleGenerateReply("negotiate")}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      Counter-Negotiate
                    </button>
                    <button
                      onClick={() => handleGenerateReply("generic")}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4 text-neutral-500" />
                      Generic Response
                    </button>
                  </div>
                )}
              </div>

              <Button onClick={handleSend} disabled={!replyContent.trim() || isGenerating}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 border-l border-neutral-200 bg-neutral-50 overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Creator Info */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">Creator Info</h3>
              <div className="space-y-2">
                <InfoRow icon={<User className="h-4 w-4" />} label="Name" value={conversation.creatorName || "—"} />
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={conversation.creatorEmail} />
                <InfoRow icon={<Building className="h-4 w-4" />} label="Platform" value={conversation.creatorPlatform || "—"} />
              </div>
            </div>

            {/* Personalization */}
            {conversation.icebreaker && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">Personalization</h3>
                <div className="p-3 bg-white rounded-lg border border-neutral-200">
                  <p className="text-sm text-neutral-600 italic">"{conversation.icebreaker}"</p>
                  {conversation.specificContent && (
                    <p className="text-xs text-neutral-400 mt-2">
                      Re: {conversation.specificContent}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Current Offer */}
            {conversation.offers.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-700 mb-3">Current Offer</h3>
                <div className="p-3 bg-white rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-neutral-900">
                      ${conversation.offers[0].amount}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                      Counter Offered
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600 space-y-1">
                    {Object.entries(conversation.offers[0].deliverables).map(([key, val]) => (
                      <div key={key} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>
                          {val}x {key.replace(/_/g, " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                  {conversation.offers[0].expiresAt && (
                    <p className="text-xs text-neutral-400 mt-3">
                      Expires {timeAgo(conversation.offers[0].expiresAt, { withAgo: true })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">Timeline</h3>
              <div className="space-y-3">
                {conversation.messages.slice().reverse().slice(0, 5).map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2">
                    <div className={`h-2 w-2 rounded-full mt-1.5 ${
                      msg.sender === "brand" ? "bg-blue-500" : "bg-purple-500"
                    }`} />
                    <div>
                      <p className="text-xs font-medium text-neutral-700">
                        {msg.sender === "brand" ? "You sent" : "Reply received"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {msg.sentAt ? timeAgo(msg.sentAt) : "Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isBrand = message.sender === "brand";

  return (
    <div className={`flex ${isBrand ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] ${isBrand ? "order-2" : "order-1"}`}>
        {/* Sender Label */}
        <div className={`flex items-center gap-2 mb-1 ${isBrand ? "justify-end" : "justify-start"}`}>
          <span className="text-xs font-medium text-neutral-500">
            {isBrand ? "You" : "Creator"}
          </span>
          {message.generatedBy === "ai" && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
              <Sparkles className="h-3 w-3" />
              AI
            </span>
          )}
          {message.sentAt && (
            <span className="text-xs text-neutral-400">
              {timeAgo(message.sentAt)}
            </span>
          )}
        </div>

        {/* Message Content */}
        <div
          className={`p-4 rounded-2xl ${
            isBrand
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-md"
          }`}
        >
          {message.subject && (
            <div className={`text-sm font-medium mb-2 ${isBrand ? "text-blue-100" : "text-neutral-600"}`}>
              Re: {message.subject}
            </div>
          )}
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        </div>

        {/* Email Status */}
        {isBrand && message.sentAt && (
          <div className="flex items-center gap-3 mt-1.5 justify-end">
            <StatusIndicator
              icon={<Mail className="h-3 w-3" />}
              label="Sent"
              active={!!message.sentAt}
            />
            <StatusIndicator
              icon={<CheckCircle className="h-3 w-3" />}
              label="Delivered"
              active={!!message.deliveredAt}
            />
            <StatusIndicator
              icon={<MailOpen className="h-3 w-3" />}
              label="Opened"
              active={!!message.openedAt}
            />
            <StatusIndicator
              icon={<MousePointer className="h-3 w-3" />}
              label="Clicked"
              active={!!message.clickedAt}
            />
            {message.bouncedAt && (
              <StatusIndicator
                icon={<AlertCircle className="h-3 w-3" />}
                label="Bounced"
                active={true}
                error
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusIndicator({
  icon,
  label,
  active,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  error?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1 text-xs ${
        error
          ? "text-red-500"
          : active
          ? "text-green-600"
          : "text-neutral-300"
      }`}
      title={label}
    >
      {icon}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-neutral-400">{icon}</span>
      <span className="text-sm text-neutral-500 w-16">{label}</span>
      <span className="text-sm text-neutral-700 truncate">{value}</span>
    </div>
  );
}

