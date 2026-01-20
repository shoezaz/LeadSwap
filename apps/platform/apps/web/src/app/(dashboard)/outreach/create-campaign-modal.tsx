"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  ChevronRight,
  Users,
  Gift,
  Camera,
  FileCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@leadswap/ui";
import { createOutreachCampaignAction } from "@/lib/actions/outreach";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

interface CreateCampaignModalProps {
  workspaceSlug: string;
  onClose: () => void;
}

type CampaignType = "paid_collaboration" | "gifting" | "no_strings_seeding" | "usage_rights";
type Step = "type" | "details" | "budget" | "review";

export function CreateCampaignModal({ workspaceSlug, onClose }: CreateCampaignModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("type");
  const [formData, setFormData] = useState({
    type: "" as CampaignType | "",
    name: "",
    description: "",
    brandName: "",
    brandWebsite: "",
    brandInstagram: "",
    productName: "",
    productDescription: "",
    budgetTotal: 5000,
    budgetMaxPerCreator: 500,
    currency: "USD",
    approvalMode: "manual" as "manual" | "auto" | "hybrid",
    aiEnabled: true,
    targetAudience: "",
    targetNiches: [] as string[],
    targetPlatforms: [] as string[],
    deliverables: {
      posts: 1,
      stories: 3,
      reels: 0,
    },
  });

  const { execute, status } = useAction(createOutreachCampaignAction, {
    onSuccess: ({ data }) => {
      if (data?.success && data?.campaign) {
        toast.success("Campaign created successfully!");
        router.push(`/${workspaceSlug}/outreach/${data.campaign.id}`);
        onClose();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "Failed to create campaign");
    },
  });

  const handleSubmit = () => {
    if (!formData.type || !formData.name || !formData.brandName) {
      toast.error("Please fill in all required fields");
      return;
    }

    execute({
      workspaceId: workspaceSlug, // TODO: Get actual workspace ID
      type: formData.type,
      name: formData.name,
      description: formData.description,
      brandName: formData.brandName,
      brandWebsite: formData.brandWebsite,
      brandInstagram: formData.brandInstagram,
      productName: formData.productName,
      productDescription: formData.productDescription,
      budgetTotal: formData.budgetTotal,
      budgetMaxPerCreator: formData.budgetMaxPerCreator,
      currency: formData.currency,
      approvalMode: formData.approvalMode,
      aiEnabled: formData.aiEnabled,
      targetAudience: formData.targetAudience,
      targetNiches: formData.targetNiches,
      targetPlatforms: formData.targetPlatforms,
      deliverables: formData.deliverables,
    });
  };

  const campaignTypes = [
    {
      type: "paid_collaboration" as const,
      icon: <Users className="h-6 w-6" />,
      title: "Paid Collaboration",
      description: "Pay creators for sponsored content",
      color: "blue",
    },
    {
      type: "gifting" as const,
      icon: <Gift className="h-6 w-6" />,
      title: "Gifting / Seeding",
      description: "Send products in exchange for content",
      color: "purple",
    },
    {
      type: "no_strings_seeding" as const,
      icon: <Sparkles className="h-6 w-6" />,
      title: "No-Strings Seeding",
      description: "Free product gift, no obligation",
      color: "amber",
    },
    {
      type: "usage_rights" as const,
      icon: <FileCheck className="h-6 w-6" />,
      title: "Usage Rights",
      description: "Request rights to existing content",
      color: "green",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Create Outreach Campaign
            </h2>
            <p className="text-sm text-neutral-500">
              {step === "type" && "Choose your campaign type"}
              {step === "details" && "Campaign details"}
              {step === "budget" && "Set your budget"}
              {step === "review" && "Review and create"}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Type Selection */}
          {step === "type" && (
            <div className="grid grid-cols-2 gap-4">
              {campaignTypes.map((ct) => (
                <button
                  key={ct.type}
                  onClick={() => {
                    setFormData({ ...formData, type: ct.type });
                    setStep("details");
                  }}
                  className={`flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                    formData.type === ct.type
                      ? "border-blue-500 bg-blue-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className={`p-2 rounded-lg mb-3 ${
                    ct.color === "blue" ? "bg-blue-100 text-blue-600" :
                    ct.color === "purple" ? "bg-purple-100 text-purple-600" :
                    ct.color === "amber" ? "bg-amber-100 text-amber-600" :
                    "bg-green-100 text-green-600"
                  }`}>
                    {ct.icon}
                  </div>
                  <span className="font-medium text-neutral-900">{ct.title}</span>
                  <span className="text-sm text-neutral-500 mt-1">{ct.description}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Details */}
          {step === "details" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Q1 Product Launch Campaign"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Brand Name *
                </label>
                <input
                  type="text"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  placeholder="Your brand name"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.brandWebsite}
                    onChange={(e) => setFormData({ ...formData, brandWebsite: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.brandInstagram}
                    onChange={(e) => setFormData({ ...formData, brandInstagram: e.target.value })}
                    placeholder="@yourbrand"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="What are you promoting?"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Target Audience
                </label>
                <textarea
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="Describe your ideal audience..."
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 3: Budget */}
          {step === "budget" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Total Campaign Budget ({formData.currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                  <input
                    type="number"
                    value={formData.budgetTotal}
                    onChange={(e) => setFormData({ ...formData, budgetTotal: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Max Budget Per Creator ({formData.currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">$</span>
                  <input
                    type="number"
                    value={formData.budgetMaxPerCreator}
                    onChange={(e) => setFormData({ ...formData, budgetMaxPerCreator: Number(e.target.value) })}
                    className="w-full pl-8 pr-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Maximum amount you'll pay any single creator
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Approval Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "manual", label: "Manual", desc: "Review all emails" },
                    { value: "hybrid", label: "Hybrid", desc: "Auto under threshold" },
                    { value: "auto", label: "Auto", desc: "AI handles everything" },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => setFormData({ ...formData, approvalMode: mode.value as any })}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.approvalMode === mode.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <span className="font-medium text-sm">{mode.label}</span>
                      <p className="text-xs text-neutral-500">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <span className="text-sm font-medium text-blue-900">AI-Powered Negotiation</span>
                  <p className="text-xs text-blue-700">Let AI handle negotiations within your budget limits</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.aiEnabled}
                  onChange={(e) => setFormData({ ...formData, aiEnabled: e.target.checked })}
                  className="h-5 w-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === "review" && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Campaign Type</span>
                  <span className="font-medium capitalize">{formData.type.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Name</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Brand</span>
                  <span className="font-medium">{formData.brandName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Budget</span>
                  <span className="font-medium">${formData.budgetTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Max Per Creator</span>
                  <span className="font-medium">${formData.budgetMaxPerCreator.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Approval Mode</span>
                  <span className="font-medium capitalize">{formData.approvalMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">AI Negotiation</span>
                  <span className="font-medium">{formData.aiEnabled ? "Enabled" : "Disabled"}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-amber-800">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm">
                  Your campaign will be created in <strong>draft</strong> status. 
                  You can add creators and configure emails before activating it.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 bg-neutral-50">
          <div>
            {step !== "type" && (
              <Button
                variant="secondary"
                onClick={() => {
                  if (step === "details") setStep("type");
                  if (step === "budget") setStep("details");
                  if (step === "review") setStep("budget");
                }}
              >
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            {step !== "review" ? (
              <Button
                onClick={() => {
                  if (step === "type" && formData.type) setStep("details");
                  if (step === "details") setStep("budget");
                  if (step === "budget") setStep("review");
                }}
                disabled={step === "type" && !formData.type}
                className="gap-1"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={status === "executing"}
              >
                {status === "executing" ? "Creating..." : "Create Campaign"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

