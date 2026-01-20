"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { SubNav } from "@/components/layout/SubNav";
import { ListHeader, Column } from "@/components/layout/ListHeader";
import { ListItem } from "@/components/layout/ListItem";
import { SelectionMenu } from "@/components/layout/SelectionMenu";
import { DetailDrawer } from "@/components/layout/DetailDrawer";

// Generic lead type - stores all CSV fields dynamically
type Lead = Record<string, any> & { id: string };

type ScoringState = "idle" | "uploading" | "scoring" | "done" | "error";

export default function SearcherPage() {
    // State
    const [prompt, setPrompt] = useState("");
    const [leads, setLeads] = useState<Lead[]>([]);
    const [scoringState, setScoringState] = useState<ScoringState>("idle");
    const [error, setError] = useState<string | null>(null);
    const [tierBreakdown, setTierBreakdown] = useState({ tierA: 0, tierB: 0, tierC: 0 });
    const [processingTime, setProcessingTime] = useState<number | null>(null);

    const [selectedDrawerItem, setSelectedDrawerItem] = useState<Lead | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Extract columns dynamically from leads
    const columns = useMemo<Column[]>(() => {
        if (leads.length === 0) return [];

        const firstLead = leads[0];
        const keys = Object.keys(firstLead).filter(k => k !== "id");

        return keys.map(key => ({
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
            width: key.length > 15 ? 200 : 160
        }));
    }, [leads]);

    // Handle CSV upload
    const handleFileUpload = useCallback(async (file: File) => {
        setScoringState("uploading");
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/scoring/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Upload failed");
            }

            setLeads(data.leads);
            setScoringState("idle");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
            setScoringState("error");
        }
    }, []);

    // Handle scoring
    const handleScore = useCallback(async () => {
        if (!prompt.trim() || leads.length === 0) {
            setError("Please enter a prompt and upload a CSV file");
            return;
        }

        setScoringState("scoring");
        setError(null);

        try {
            const res = await fetch("/api/scoring/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    leads,
                    options: { enrichWithExa: true, batchSize: 5 },
                }),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || "Scoring failed");
            }

            // Merge scored data back into leads
            const scoredMap = new Map(data.scoredLeads.map((s: any) => [s.id, s]));
            setLeads(prev => prev.map(lead => {
                const scored = scoredMap.get(lead.id);
                return scored ? { ...lead, ...scored } : lead;
            }));
            setTierBreakdown(data.tierBreakdown);
            setProcessingTime(data.processingTimeMs);
            setScoringState("done");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Scoring failed");
            setScoringState("error");
        }
    }, [prompt, leads]);

    // File drop handler
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith(".csv")) {
            handleFileUpload(file);
        }
    }, [handleFileUpload]);

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === leads.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(leads.map(l => l.id)));
        }
    };

    return (
        <div className="w-full h-full bg-white rounded-tl-[12px] rounded-lg shadow-sm border border-[#eef0f2] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="flex-none h-[60px] border-b border-[#eef0f2]">
                <Header />
            </div>

            <SubNav
                prompt={prompt}
                onPromptChange={setPrompt}
                onFileUpload={handleFileUpload}
                onSubmit={handleScore}
                isLoading={scoringState === "scoring"}
                leadsCount={leads.length}
            />

            {/* Status messages */}
            {error && (
                <div className="flex-none px-4 py-2 bg-red-50 border-b border-red-200 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Tier Breakdown (visible after scoring) */}
            {scoringState === "done" && (
                <div className="flex-none p-4 border-b border-[#eef0f2]">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">Scoring Results</h3>
                        {processingTime && (
                            <span className="text-xs text-gray-400">{processingTime}ms</span>
                        )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                            <div className="text-xs font-semibold text-green-600 uppercase">Tier A</div>
                            <div className="text-2xl font-bold text-green-700">{tierBreakdown.tierA}</div>
                            <div className="text-[10px] text-green-500">80-100 pts</div>
                        </div>
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                            <div className="text-xs font-semibold text-yellow-600 uppercase">Tier B</div>
                            <div className="text-2xl font-bold text-yellow-700">{tierBreakdown.tierB}</div>
                            <div className="text-[10px] text-yellow-500">50-79 pts</div>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                            <div className="text-xs font-semibold text-red-600 uppercase">Tier C</div>
                            <div className="text-2xl font-bold text-red-700">{tierBreakdown.tierC}</div>
                            <div className="text-[10px] text-red-500">0-49 pts</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State / Drop Zone */}
            {leads.length === 0 && (
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex-1 flex items-center justify-center"
                >
                    <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl max-w-md mx-auto">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload your leads</h3>
                        <p className="text-sm text-gray-500">
                            Drag & drop a CSV file here or use the paperclip icon above.
                            <br />
                            Make sure your CSV has a "company" column.
                        </p>
                    </div>
                </div>
            )}

            {/* List Area */}
            {leads.length > 0 && (
                <div className="flex-1 relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col overflow-x-auto">
                        <div className="flex-none z-10">
                            <ListHeader
                                columns={columns}
                                onSelectAll={toggleSelectAll}
                                allSelected={selectedIds.size === leads.length && leads.length > 0}
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex flex-col pb-24">
                                {leads.map((lead) => (
                                    <ListItem
                                        key={lead.id}
                                        id={lead.id}
                                        data={lead}
                                        columns={columns}
                                        isSelected={selectedIds.has(lead.id)}
                                        onToggle={() => toggleSelection(lead.id)}
                                        onClick={() => setSelectedDrawerItem(lead)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlays */}
            <SelectionMenu
                selectedCount={selectedIds.size}
                onClose={() => setSelectedIds(new Set())}
            />

            <DetailDrawer
                isOpen={!!selectedDrawerItem}
                onClose={() => setSelectedDrawerItem(null)}
                personData={selectedDrawerItem}
            />
        </div>
    );
}
