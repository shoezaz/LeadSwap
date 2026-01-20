"use client";

import { useState, useCallback } from "react";
import {
  Sparkles,
  Send,
  RefreshCw,
  ChevronDown,
  Copy,
  Check,
  FileText,
  Zap,
  Wand2,
} from "lucide-react";
import { Button } from "@leadswap/ui";

type TemplateType =
  | "initial_outreach_short"
  | "initial_outreach_detailed"
  | "gifting_proposal"
  | "follow_up_1"
  | "follow_up_2"
  | "follow_up_final"
  | "negotiation_counter"
  | "usage_rights_request"
  | "custom";

interface Creator {
  name: string;
  email: string;
  handle?: string;
  platform?: string;
  icebreaker?: string;
  specificContent?: string;
}

interface ComposerProps {
  creator: Creator;
  brandName: string;
  productName?: string;
  onSend: (subject: string, content: string, requiresApproval: boolean) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TEMPLATES: Record<TemplateType, { name: string; description: string }> = {
  initial_outreach_short: {
    name: "Short Intro",
    description: "Brief, casual introduction",
  },
  initial_outreach_detailed: {
    name: "Detailed Intro",
    description: "Full pitch with context",
  },
  gifting_proposal: {
    name: "Gifting Offer",
    description: "Product seeding proposal",
  },
  follow_up_1: {
    name: "Follow-up 1",
    description: "First gentle reminder",
  },
  follow_up_2: {
    name: "Follow-up 2",
    description: "Second check-in",
  },
  follow_up_final: {
    name: "Final Follow-up",
    description: "Last attempt before closing",
  },
  negotiation_counter: {
    name: "Counter Offer",
    description: "Respond to rate request",
  },
  usage_rights_request: {
    name: "Usage Rights",
    description: "Request content rights",
  },
  custom: {
    name: "Custom",
    description: "Write from scratch",
  },
};

const AI_TONE_OPTIONS = [
  { id: "professional", label: "Professional", emoji: "👔" },
  { id: "friendly", label: "Friendly", emoji: "😊" },
  { id: "casual", label: "Casual", emoji: "✌️" },
  { id: "enthusiastic", label: "Enthusiastic", emoji: "🔥" },
];

export function AIEmailComposer({
  creator,
  brandName,
  productName,
  onSend,
  onCancel,
  isSubmitting,
}: ComposerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("initial_outreach_detailed");
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTones, setShowTones] = useState(false);
  const [copied, setCopied] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);

  const generateContent = useCallback(async () => {
    setIsGenerating(true);

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const creatorName = creator.name || "there";
    const icebreaker = creator.icebreaker || "your amazing content";

    // Generate based on template type and tone
    let generatedSubject = "";
    let generatedContent = "";

    switch (selectedTemplate) {
      case "initial_outreach_short":
        generatedSubject = `Quick question about a collab 🤝`;
        generatedContent = `Hey ${creatorName}!

I've been following your work and ${icebreaker.toLowerCase()} caught my eye.

We're at ${brandName}${productName ? ` (we make ${productName})` : ""} and think you'd be an amazing fit for a partnership.

Interested in chatting?`;
        break;

      case "initial_outreach_detailed":
        generatedSubject = `Partnership opportunity with ${brandName}`;
        generatedContent = `Hi ${creatorName},

I hope this email finds you well! I've been following your ${creator.platform || "content"} for a while, and I have to say – ${icebreaker}.

I'm reaching out because I think there could be a great opportunity to work together. At ${brandName}${productName ? `, we're building ${productName}` : ""}, and we're looking for creators who can authentically connect with their audience about products they genuinely love.

Here's what we're thinking:
• Sponsored content that fits naturally with your style
• Competitive compensation based on your reach
• Creative freedom to present the product your way

Would you be open to a quick chat to explore this? I'd love to share more details and hear your thoughts.

Looking forward to connecting!

Best,
The ${brandName} Team`;
        break;

      case "gifting_proposal":
        generatedSubject = `We'd love to send you ${productName || "something"} 🎁`;
        generatedContent = `Hey ${creatorName}!

I noticed ${icebreaker} and thought you might genuinely enjoy ${productName || "what we're building"}.

We'd love to send you one – no strings attached. If you end up loving it and want to share it with your audience, that would be amazing, but there's absolutely no obligation.

Just let me know your shipping address and preference, and we'll get it out to you!

Cheers,
The ${brandName} Team`;
        break;

      case "follow_up_1":
        generatedSubject = `Following up – partnership with ${brandName}`;
        generatedContent = `Hi ${creatorName},

Just wanted to bump this to the top of your inbox! I know things get busy.

We're still very interested in exploring a partnership with you. Your content style would be a perfect match for ${brandName}.

Would love to hear your thoughts when you get a chance!

Best,
The ${brandName} Team`;
        break;

      case "negotiation_counter":
        generatedSubject = `Re: Partnership details`;
        generatedContent = `Hi ${creatorName},

Thanks for sharing your rates! I really appreciate your transparency.

After discussing with the team, here's what we can offer:
• [INSERT COUNTER OFFER]
• Plus [ADDITIONAL BENEFITS]

We believe this is a fair package that values your work while aligning with our campaign budget.

Let me know your thoughts!

Best,
The ${brandName} Team`;
        break;

      default:
        generatedSubject = `Let's work together!`;
        generatedContent = `Hi ${creatorName},

I wanted to reach out about a potential partnership opportunity with ${brandName}.

[Your message here]

Looking forward to hearing from you!

Best,
The ${brandName} Team`;
    }

    // Apply tone adjustments
    if (selectedTone === "enthusiastic") {
      generatedContent = generatedContent
        .replace("Hi", "Hey")
        .replace("Best,", "Can't wait to hear from you!\n\nCheers,")
        .replace("would be amazing", "would be AMAZING");
    } else if (selectedTone === "professional") {
      generatedContent = generatedContent
        .replace("Hey", "Dear")
        .replace("!", ".")
        .replace("Cheers,", "Kind regards,");
    }

    setSubject(generatedSubject);
    setContent(generatedContent);
    setIsGenerating(false);
  }, [creator, brandName, productName, selectedTemplate, selectedTone]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    if (subject && content) {
      onSend(subject, content, requiresApproval);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-100 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">AI Email Composer</h3>
              <p className="text-sm text-neutral-500">
                Writing to {creator.name || creator.email}
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-4">
        {/* Template Selector */}
        <div className="relative">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm hover:border-neutral-300 transition-colors"
          >
            <FileText className="h-4 w-4 text-neutral-500" />
            <span>{TEMPLATES[selectedTemplate].name}</span>
            <ChevronDown className="h-4 w-4 text-neutral-400" />
          </button>

          {showTemplates && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
              {Object.entries(TEMPLATES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedTemplate(key as TemplateType);
                    setShowTemplates(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-neutral-50 ${
                    selectedTemplate === key ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="font-medium text-sm">{value.name}</div>
                  <div className="text-xs text-neutral-500">{value.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tone Selector */}
        <div className="relative">
          <button
            onClick={() => setShowTones(!showTones)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm hover:border-neutral-300 transition-colors"
          >
            <span>
              {AI_TONE_OPTIONS.find((t) => t.id === selectedTone)?.emoji}
            </span>
            <span>
              {AI_TONE_OPTIONS.find((t) => t.id === selectedTone)?.label}
            </span>
            <ChevronDown className="h-4 w-4 text-neutral-400" />
          </button>

          {showTones && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
              {AI_TONE_OPTIONS.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => {
                    setSelectedTone(tone.id);
                    setShowTones(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center gap-2 ${
                    selectedTone === tone.id ? "bg-blue-50" : ""
                  }`}
                >
                  <span>{tone.emoji}</span>
                  <span>{tone.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="secondary"
          className="gap-2"
          onClick={generateContent}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 text-purple-500" />
          )}
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>

      {/* Composer */}
      <div className="p-6 space-y-4">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject line..."
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Content */}
        <div className="relative">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing or generate with AI..."
            rows={12}
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {isGenerating && (
            <div className="absolute inset-0 mt-6 bg-white/90 flex items-center justify-center rounded-lg">
              <div className="flex items-center gap-3 text-purple-600">
                <Sparkles className="h-6 w-6 animate-pulse" />
                <span className="font-medium">AI is crafting your email...</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {content && !isGenerating && (
            <div className="absolute top-8 right-2 flex gap-1">
              <button
                onClick={handleCopy}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={generateContent}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded"
                title="Regenerate"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Personalization Hint */}
        {creator.icebreaker && (
          <div className="flex items-start gap-2 p-3 bg-purple-50 rounded-lg border border-purple-100">
            <Zap className="h-4 w-4 text-purple-500 mt-0.5" />
            <div className="text-sm">
              <span className="font-medium text-purple-700">
                Personalization:
              </span>{" "}
              <span className="text-purple-600">{creator.icebreaker}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={requiresApproval}
            onChange={(e) => setRequiresApproval(e.target.checked)}
            className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-neutral-600">
            Send for approval before sending
          </span>
        </label>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={!subject || !content || isSubmitting}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {requiresApproval ? "Send for Approval" : "Send Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}

