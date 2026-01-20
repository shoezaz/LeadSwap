"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";

export default function ICPPage() {
    const [activeTab, setActiveTab] = useState("Tone of voice");

    const tabs = [
        "Company value propositions",
        "Tone of voice",
        "Mail instructions",
        "Enforcement rules"
    ];

    const suggestions = [
        "Insightful and witty",
        "Follow the Challenger sales methodology",
        "Use German if the prospect is located in Germany"
    ];

    return (
        <div className="w-full h-full bg-white rounded-tl-[12px] rounded-lg shadow-sm border border-[#eef0f2] flex flex-col relative overflow-hidden">

            {/* Header (Same as Searcher) */}
            <div className="flex-none h-[60px] border-b border-[#eef0f2]">
                <Header />
            </div>

            {/* Header Section (Container Node 2101:165 part 1) */}
            <div className="px-8 pt-8 pb-0">
                <h1 className="text-[26px] font-medium text-[#212529] tracking-[-0.078px] leading-[34px]">
                    Settings
                </h1>
                <p className="text-[14px] text-[#3a4455] tracking-[-0.042px] leading-[20px] mt-1 mb-6">
                    These are the general messaging guidelines that apply to multiple Duo products.
                </p>

                {/* Tabs (Tablist Node 2101:168) */}
                <div className="flex border-b border-[#eef0f2]">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-1 mr-6 text-[14px] font-medium transition-colors relative ${activeTab === tab
                                ? "text-[#10161e]"
                                : "text-[#3a4455] hover:text-[#10161e]"
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3a4455] rounded-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">
                {activeTab === "Tone of voice" && (
                    <div className="flex flex-col h-full max-w-4xl">
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <h2 className="text-[18px] font-medium text-[#10161e] tracking-[-0.054px]">
                                    Tone of voice
                                </h2>
                                <span className="bg-[#e6f4ea] text-[#1e7e34] text-[12px] px-2 py-0.5 rounded-[4px] font-medium">
                                    Emails
                                </span>
                            </div>
                            <button className="text-[14px] font-medium text-[#3a4455] px-3 py-1.5 border border-[#eef0f2] rounded-[6px] hover:bg-gray-50 transition-colors shadow-sm">
                                Learn more
                            </button>
                        </div>

                        <p className="text-[14px] text-[#3a4455] tracking-[-0.042px] mb-4">
                            How do you want your AI outreach to sound? Customize it to fit your style.
                        </p>

                        {/* Input Area (Node 2101:183) */}
                        <div className="flex-1 bg-white border border-[#eef0f2] rounded-[8px] p-4 mb-4 shadow-sm min-h-[300px] cursor-text">
                            <textarea
                                className="w-full h-full resize-none outline-none text-[14px] text-[#10161e] placeholder-gray-400"
                                placeholder="Describe the tone of voice..."
                            />
                        </div>

                        {/* Suggestions (Node 2101:190) */}
                        <div className="flex items-center gap-3 pt-2">
                            <span className="text-[13px] text-[#6b7280]">Suggestions</span>
                            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        className="whitespace-nowrap px-3 py-1 text-[13px] font-medium text-[#6b7280] border border-[#eef0f2] border-dashed rounded-[8px] hover:bg-gray-50 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Placeholders for other tabs */}
                {activeTab !== "Tone of voice" && (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        Content for {activeTab}
                    </div>
                )}
            </div>
        </div>
    );
}
