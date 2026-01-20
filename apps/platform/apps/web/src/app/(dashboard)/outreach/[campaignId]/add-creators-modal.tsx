"use client";

import { useState } from "react";
import {
  X,
  Plus,
  Upload,
  Search,
  Users,
  Mail,
  AtSign,
  Globe,
  Loader2,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@leadswap/ui";
import { toast } from "sonner";
import { mutate } from "swr";

interface AddCreatorsModalProps {
  campaignId: string;
  workspaceSlug: string;
  onClose: () => void;
}

interface CreatorInput {
  email: string;
  name: string;
  platform: string;
  handle: string;
  profileUrl: string;
}

export function AddCreatorsModal({
  campaignId,
  workspaceSlug,
  onClose,
}: AddCreatorsModalProps) {
  const [mode, setMode] = useState<"manual" | "bulk" | "discover">("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Manual mode state
  const [creators, setCreators] = useState<CreatorInput[]>([
    { email: "", name: "", platform: "instagram", handle: "", profileUrl: "" },
  ]);

  // Bulk mode state
  const [bulkText, setBulkText] = useState("");

  // Discover mode state
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveredCreators, setDiscoveredCreators] = useState<any[]>([]);

  const addCreatorRow = () => {
    setCreators([
      ...creators,
      { email: "", name: "", platform: "instagram", handle: "", profileUrl: "" },
    ]);
  };

  const removeCreatorRow = (index: number) => {
    if (creators.length > 1) {
      setCreators(creators.filter((_, i) => i !== index));
    }
  };

  const updateCreator = (index: number, field: keyof CreatorInput, value: string) => {
    const updated = [...creators];
    updated[index][field] = value;
    setCreators(updated);
  };

  const parseBulkText = (): CreatorInput[] => {
    const lines = bulkText.trim().split("\n").filter(Boolean);
    return lines.map((line) => {
      const parts = line.split(/[,\t]+/).map((p) => p.trim());
      return {
        email: parts[0] || "",
        name: parts[1] || "",
        platform: parts[2] || "instagram",
        handle: parts[3] || "",
        profileUrl: parts[4] || "",
      };
    });
  };

  const handleSubmit = async () => {
    let creatorsToAdd: CreatorInput[] = [];

    if (mode === "manual") {
      creatorsToAdd = creators.filter((c) => c.email);
    } else if (mode === "bulk") {
      creatorsToAdd = parseBulkText().filter((c) => c.email);
    } else if (mode === "discover") {
      creatorsToAdd = discoveredCreators
        .filter((c) => c.selected && c.email)
        .map((c) => ({
          email: c.email,
          name: c.name,
          platform: c.platform,
          handle: c.handle,
          profileUrl: c.profileUrl,
        }));
    }

    if (creatorsToAdd.length === 0) {
      toast.error("Please add at least one creator with an email");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `/api/workspaces/${workspaceSlug}/outreach/campaigns/${campaignId}/creators`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creators: creatorsToAdd }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add creators");
      }

      const result = await res.json();
      
      // Refresh data
      mutate(`/api/workspaces/${workspaceSlug}/outreach/campaigns/${campaignId}/creators`);
      mutate(`/api/workspaces/${workspaceSlug}/outreach/campaigns/${campaignId}`);
      
      toast.success(
        `Added ${result.summary.created} creators. ${result.summary.existing} already existed.`
      );
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscover = async () => {
    if (!discoverQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsDiscovering(true);
    try {
      // This would call the creator discovery API
      // For now, we'll show a placeholder
      toast.info("Discovery feature coming soon! Add creators manually for now.");
      
      // Mock discovered creators for UI demonstration
      // In production, this would call the SCIRA-powered discovery
      setDiscoveredCreators([]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDiscovering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Add Creators
            </h2>
            <p className="text-sm text-neutral-500">
              Add creators to your outreach campaign
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-neutral-100">
          {[
            { id: "manual", label: "Manual Entry", icon: Users },
            { id: "bulk", label: "Bulk Import", icon: Upload },
            { id: "discover", label: "AI Discovery", icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${
                mode === tab.id
                  ? "border-violet-600 text-violet-600 bg-violet-50"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {mode === "manual" && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                Enter creator details. Email is required.
              </p>

              {creators.map((creator, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-end p-4 bg-neutral-50 rounded-lg"
                >
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type="email"
                        value={creator.email}
                        onChange={(e) => updateCreator(index, "email", e.target.value)}
                        placeholder="email@example.com"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={creator.name}
                      onChange={(e) => updateCreator(index, "name", e.target.value)}
                      placeholder="Creator name"
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Platform
                    </label>
                    <select
                      value={creator.platform}
                      onChange={(e) => updateCreator(index, "platform", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="twitter">Twitter/X</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Handle
                    </label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type="text"
                        value={creator.handle}
                        onChange={(e) => updateCreator(index, "handle", e.target.value)}
                        placeholder="handle"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Profile URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <input
                        type="url"
                        value={creator.profileUrl}
                        onChange={(e) => updateCreator(index, "profileUrl", e.target.value)}
                        placeholder="https://..."
                        className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <button
                      onClick={() => removeCreatorRow(index)}
                      className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                      disabled={creators.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addCreatorRow}
                className="w-full py-3 border-2 border-dashed border-neutral-200 rounded-lg text-neutral-500 hover:border-violet-300 hover:text-violet-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Another Creator
              </button>
            </div>
          )}

          {mode === "bulk" && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Format:</strong> One creator per line. Use commas or tabs to separate fields.
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  email, name, platform, handle, profile_url
                </p>
              </div>

              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`creator1@email.com, John Doe, instagram, @johndoe, https://instagram.com/johndoe
creator2@email.com, Jane Smith, tiktok, @janesmith, https://tiktok.com/@janesmith`}
                className="w-full h-64 px-4 py-3 text-sm font-mono border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />

              <div className="text-sm text-neutral-500">
                {bulkText.trim() ? (
                  <span>
                    <strong>{parseBulkText().filter((c) => c.email).length}</strong> creators detected
                  </span>
                ) : (
                  <span>Paste your creator list above</span>
                )}
              </div>
            </div>
          )}

          {mode === "discover" && (
            <div className="space-y-4">
              <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-violet-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-violet-900">
                      AI-Powered Creator Discovery
                    </p>
                    <p className="text-xs text-violet-700 mt-1">
                      Describe the type of creators you're looking for and we'll find matches
                      using SCIRA's multi-platform search.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  type="text"
                  value={discoverQuery}
                  onChange={(e) => setDiscoverQuery(e.target.value)}
                  placeholder="e.g., Tech reviewers on YouTube with 10k-100k subscribers"
                  className="w-full pl-12 pr-4 py-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleDiscover();
                  }}
                />
              </div>

              <Button
                onClick={handleDiscover}
                disabled={isDiscovering || !discoverQuery.trim()}
                className="w-full gap-2"
              >
                {isDiscovering ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Discover Creators
              </Button>

              {discoveredCreators.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-neutral-700">
                    Found {discoveredCreators.length} creators
                  </h4>
                  {/* Discovery results would be displayed here */}
                </div>
              )}

              {discoveredCreators.length === 0 && !isDiscovering && (
                <div className="text-center py-8 text-neutral-500">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Enter a search query to discover creators</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 bg-neutral-50">
          <div className="text-sm text-neutral-500">
            {mode === "manual" && `${creators.filter((c) => c.email).length} creators ready`}
            {mode === "bulk" && `${parseBulkText().filter((c) => c.email).length} creators ready`}
            {mode === "discover" && `${discoveredCreators.filter((c) => c.selected).length} selected`}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Add Creators
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


