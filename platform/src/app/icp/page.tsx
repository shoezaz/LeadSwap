"use client";

import { useState } from "react";

const imgPlaceholder1 = "http://localhost:3845/assets/537bd3422a5d728e53a8dbc65b738d160d043bcb.png";
const imgPlaceholder2 = "http://localhost:3845/assets/4b62552331186abafb05076b0a0ca478d58de4af.png";

type TabType = "signals" | "competitors" | "mailbox";

export default function Page() {
    const [activeTab, setActiveTab] = useState<TabType>("signals");

    return (
        <div className="h-full w-full bg-white p-6 font-sans overflow-y-auto">
            <div className="w-full h-full flex flex-col">
                {/* Page Header (Node 2099:1720, 2099:1721, 2099:1722) */}
                <div className="flex flex-col gap-2 mb-0">
                    {/* Title */}
                    <h1 className="text-[26px] font-medium text-[#212529] leading-[34px] tracking-[-0.078px]">
                        ICP
                    </h1>
                    {/* Description */}
                    <p className="text-[14px] font-normal text-[#3a4455] leading-[20px] tracking-[-0.042px]">
                        Configure your ICP settings.
                    </p>
                </div>

                {/* Tab List (Node 2099:1722) */}
                <div className="w-full h-[40px] border-b border-[#eef0f2] flex items-end mb-6">
                    <Tab label="Signals" isActive={activeTab === "signals"} onClick={() => setActiveTab("signals")} />
                    <Tab label="Ideal Customer" isActive={activeTab === "competitors"} onClick={() => setActiveTab("competitors")} />
                </div>

                {/* Tab Content */}
                {activeTab === "signals" && (

                    <div className="w-full flex-1 rounded-[8px] border border-[#e5e8eb] overflow-hidden flex flex-col">

                        {/* Header Row (Node 2096:1167) */}
                        <div className="w-full h-[32px] bg-[#f4f4f5] flex items-center px-[12px] gap-3">
                            {/* Checkbox */}
                            <div className="w-[16px] h-[16px] bg-white border border-[#e5e8eb] rounded-[6px] shrink-0" />

                            {/* Column Headers */}
                            <div className="flex-1 flex items-center">
                                <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px] w-[260px]">Contact</span>
                                <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px] flex-1">Activity</span>
                                <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px] w-[100px] text-center">Scoring</span>
                                <div className="flex items-center gap-1 w-[80px] justify-end">
                                    <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px]">Due</span>
                                    <div className="h-[20px] px-[6px] bg-white rounded-[6px] flex items-center justify-center shadow-[inset_0px_0px_0px_1px_#eef0f2]">
                                        <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px]">15</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Contact Rows (Node 2096:835) */}
                        <ContactRow
                            name="ACTIV"
                            title="Daniel Okon · Chief Executive Officer"
                            avatarUrl={imgPlaceholder1}
                            companyLogoUrl={imgPlaceholder2}
                            activity="Posted about UGC ads"
                            score={850}
                            timestamp="1d ago"
                        />
                        <ContactRow
                            name="Omni"
                            title="Sarah Chen · VP of Marketing"
                            avatarUrl={imgPlaceholder1}
                            companyLogoUrl={imgPlaceholder2}
                            activity="Company raised funding"
                            score={720}
                            timestamp="2d ago"
                        />
                        <ContactRow
                            name="Flux AI"
                            title="Michael Park · Head of Growth"
                            avatarUrl={imgPlaceholder1}
                            companyLogoUrl={imgPlaceholder2}
                            activity="Hiring for SDR roles"
                            score={910}
                            timestamp="3d ago"
                        />

                    </div>
                )}

                {activeTab === "competitors" && (
                    <div className="w-full flex-1 flex flex-col gap-6">
                        {/* Section Header */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-[20px] font-medium text-[#212529] leading-[28px]">Ideal Customer</h2>
                                <div className="h-[20px] px-[6px] bg-white rounded-[6px] flex items-center justify-center shadow-[inset_0px_0px_0px_1px_#eef0f2]">
                                    <span className="text-[13px] font-medium text-[#3a4455]">ICP</span>
                                </div>
                            </div>
                            <p className="text-[14px] font-normal text-[#3a4455] leading-[20px]">
                                Describe your ideal customer profile to help Duo find the best matches.
                            </p>
                        </div>

                        {/* Form with Textarea */}
                        <div className="flex flex-col gap-4">
                            {/* Fieldset / Textarea */}
                            <div className="w-full rounded-[8px] border border-[#eef0f2] overflow-hidden">
                                <textarea
                                    className="w-full h-[156px] p-4 text-[14px] text-[#10161e] placeholder:text-[#6b7280] resize-none outline-none bg-white"
                                    placeholder="Example: B2B SaaS companies in the US with 50-200 employees, focused on marketing automation. Decision makers are typically VP of Marketing or CMO..."
                                />
                            </div>

                            {/* Suggestions */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[13px] font-medium text-[#6b7280]">Suggestions</span>
                                <button className="h-[23px] px-[5px] bg-white border border-[#eef0f2] rounded-[8px] text-[13px] font-medium text-[#3a4455] hover:border-gray-300 transition-colors">
                                    Tech startups Series A-B
                                </button>
                                <button className="h-[23px] px-[5px] bg-white border border-[#eef0f2] rounded-[8px] text-[13px] font-medium text-[#3a4455] hover:border-gray-300 transition-colors">
                                    E-commerce brands with 10M+ revenue
                                </button>
                                <button className="h-[23px] px-[5px] border border-dashed border-[#eef0f2] rounded-[8px] text-[13px] font-medium text-[#6b7280] hover:border-gray-400 transition-colors">
                                    Add your own criteria...
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}

function ContactRow({
    name,
    title,
    avatarUrl,
    companyLogoUrl,
    activity,
    score,
    timestamp
}: {
    name: string;
    title: string;
    avatarUrl: string;
    companyLogoUrl: string;
    activity: string;
    score: number;
    timestamp: string;
}) {
    // Calculate color based on score (green for high, yellow for mid, red for low)
    const getScoreColor = (s: number) => {
        if (s >= 800) return "text-emerald-600 bg-emerald-50";
        if (s >= 600) return "text-amber-600 bg-amber-50";
        return "text-red-600 bg-red-50";
    };

    return (
        <div className="w-full h-[56px] bg-white flex items-center px-[12px] gap-3 border-t border-[#eef0f2] hover:bg-gray-50 transition-colors cursor-pointer">
            {/* Checkbox */}
            <div className="w-[16px] h-[16px] bg-white border border-[#e5e8eb] rounded-[6px] shrink-0" />

            {/* Avatar Group */}
            <div className="relative w-[40px] h-[40px] shrink-0">
                <img
                    src={avatarUrl}
                    alt=""
                    className="w-[32px] h-[32px] rounded-full object-cover absolute top-0 left-0"
                />
                <div className="absolute bottom-0 right-0 w-[20px] h-[20px] rounded-full bg-white border border-white shadow-sm overflow-hidden">
                    <img
                        src={companyLogoUrl}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Name & Title */}
            <div className="flex flex-col gap-0 w-[200px] shrink-0">
                <span className="text-[14px] font-medium text-[#10161e] leading-[20px] tracking-[-0.042px] truncate">{name}</span>
                <span className="text-[14px] font-normal text-[#6b7280] leading-[20px] tracking-[-0.042px] truncate">{title}</span>
            </div>

            {/* Activity Badge (Node 2096:982) */}
            <div className="flex-1 flex items-center gap-2">
                {/* Activity Pill */}
                <div className="h-[20px] px-[6px] bg-white border border-[#eef0f2] rounded-[6px] flex items-center gap-2">
                    <div className="w-[12px] h-[12px] rounded-[4px] bg-[#14b8a6] shrink-0" />
                    <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px]">{activity}</span>
                </div>
            </div>

            {/* Score Badge (same style as Activity) */}
            <div className="flex items-center justify-center">
                <div className="h-[20px] px-[6px] bg-white border border-[#eef0f2] rounded-[6px] flex items-center gap-2">
                    <div className={`w-[12px] h-[12px] rounded-[4px] shrink-0 ${score >= 800 ? 'bg-emerald-500' : score >= 600 ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px]">{score}</span>
                </div>
            </div>

            {/* Timestamp (Node 2096:986) */}
            <div className="h-[20px] px-[6px] bg-white rounded-[6px] flex items-center justify-center shadow-[inset_0px_0px_0px_1px_#eef0f2] shrink-0">
                <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px]">{timestamp}</span>
            </div>

        </div>
    );
}


function Tab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`relative h-[40px] px-[6px] flex items-center justify-center transition-colors ${isActive ? 'text-[#10161e]' : 'text-[#3a4455] hover:text-[#10161e]'
                }`}
        >
            <span className="text-[14px] font-medium tracking-[-0.042px] leading-[20px]">{label}</span>
            {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3a4455] rounded-[1000px]" />
            )}
        </button>
    );
}

