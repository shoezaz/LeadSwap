"use client";

import { useState } from "react";

const imgPlaceholder1 = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";
const imgPlaceholder2 = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face";
const imgPlaceholder3 = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face";

type FilterType = "all" | "new" | "engaged" | "qualified";

export default function Page() {
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");

    const contacts = [
        { id: 1, name: "Sarah Chen", email: "sarah@omnitech.io", company: "Omni Technologies", title: "VP of Marketing", status: "new", score: 920, lastActivity: "Visited pricing page", avatar: imgPlaceholder3 },
        { id: 2, name: "Daniel Okon", email: "daniel@activsales.com", company: "ACTIV Sales", title: "Chief Executive Officer", status: "engaged", score: 850, lastActivity: "Opened email campaign", avatar: imgPlaceholder1 },
        { id: 3, name: "Michael Park", email: "michael@fluxai.co", company: "Flux AI", title: "Head of Growth", status: "qualified", score: 780, lastActivity: "Requested demo", avatar: imgPlaceholder2 },
        { id: 4, name: "Emily Watson", email: "emily@startuphq.com", company: "StartupHQ", title: "CMO", status: "new", score: 890, lastActivity: "Downloaded whitepaper", avatar: imgPlaceholder3 },
        { id: 5, name: "James Liu", email: "james@techventures.io", company: "Tech Ventures", title: "Director of Sales", status: "engaged", score: 760, lastActivity: "Clicked CTA link", avatar: imgPlaceholder1 },
    ];

    const filteredContacts = activeFilter === "all"
        ? contacts
        : contacts.filter(c => c.status === activeFilter);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "new": return "bg-blue-500";
            case "engaged": return "bg-amber-500";
            case "qualified": return "bg-emerald-500";
            default: return "bg-gray-400";
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 850) return "bg-emerald-500";
        if (score >= 700) return "bg-amber-500";
        return "bg-red-500";
    };

    return (
        <div className="h-full w-full bg-white p-6 font-sans overflow-y-auto">
            <div className="w-full h-full flex flex-col">
                {/* Page Header */}
                <div className="flex flex-col gap-2 mb-0">
                    <h1 className="text-[26px] font-medium text-[#212529] leading-[34px] tracking-[-0.078px]">
                        Contacts
                    </h1>
                    <p className="text-[14px] font-normal text-[#3a4455] leading-[20px] tracking-[-0.042px]">
                        Manage and track all your leads and contacts.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="w-full h-[40px] border-b border-[#eef0f2] flex items-end mb-6">
                    <FilterTab label="All" count={contacts.length} isActive={activeFilter === "all"} onClick={() => setActiveFilter("all")} />
                    <FilterTab label="New" count={contacts.filter(c => c.status === "new").length} isActive={activeFilter === "new"} onClick={() => setActiveFilter("new")} />
                    <FilterTab label="Engaged" count={contacts.filter(c => c.status === "engaged").length} isActive={activeFilter === "engaged"} onClick={() => setActiveFilter("engaged")} />
                    <FilterTab label="Qualified" count={contacts.filter(c => c.status === "qualified").length} isActive={activeFilter === "qualified"} onClick={() => setActiveFilter("qualified")} />
                </div>

                {/* DataTable */}
                <div className="w-full flex-1 rounded-[8px] border border-[#e5e8eb] overflow-hidden flex flex-col">
                    {/* Header Row */}
                    <div className="w-full h-[40px] bg-[#f4f4f5] flex items-center px-[16px] gap-4 shrink-0">
                        <div className="w-[16px] h-[16px] bg-white border border-[#e5e8eb] rounded-[6px] shrink-0" />
                        <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px] w-[200px]">Contact</span>
                        <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px] w-[200px]">Company</span>
                        <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px] flex-1">Last Activity</span>
                        <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px] w-[80px] text-center">Status</span>
                        <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px] w-[80px] text-center">Score</span>
                    </div>

                    {/* Contact Rows */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact.id}
                                className="w-full h-[64px] bg-white flex items-center px-[16px] gap-4 border-t border-[#eef0f2] hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                {/* Checkbox */}
                                <div className="w-[16px] h-[16px] bg-white border border-[#e5e8eb] rounded-[6px] shrink-0" />

                                {/* Contact Info */}
                                <div className="flex items-center gap-3 w-[200px] shrink-0">
                                    <img
                                        src={contact.avatar}
                                        alt=""
                                        className="w-[36px] h-[36px] rounded-full object-cover shrink-0"
                                    />
                                    <div className="flex flex-col gap-0 min-w-0">
                                        <span className="text-[14px] font-medium text-[#10161e] leading-[20px] truncate">{contact.name}</span>
                                        <span className="text-[13px] font-normal text-[#6b7280] leading-[18px] truncate">{contact.email}</span>
                                    </div>
                                </div>

                                {/* Company */}
                                <div className="flex flex-col gap-0 w-[200px] shrink-0">
                                    <span className="text-[14px] font-medium text-[#10161e] leading-[20px] truncate">{contact.company}</span>
                                    <span className="text-[13px] font-normal text-[#6b7280] leading-[18px] truncate">{contact.title}</span>
                                </div>

                                {/* Last Activity */}
                                <div className="flex-1 flex items-center">
                                    <div className="h-[20px] px-[6px] bg-white border border-[#eef0f2] rounded-[6px] flex items-center gap-2">
                                        <div className="w-[12px] h-[12px] rounded-[4px] bg-[#14b8a6] shrink-0" />
                                        <span className="text-[13px] font-medium text-[#3a4455] tracking-[-0.039px]">{contact.lastActivity}</span>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="w-[80px] flex items-center justify-center">
                                    <div className="h-[20px] px-[6px] bg-white border border-[#eef0f2] rounded-[6px] flex items-center gap-2">
                                        <div className={`w-[12px] h-[12px] rounded-[4px] shrink-0 ${getStatusColor(contact.status)}`} />
                                        <span className="text-[13px] font-medium text-[#3a4455] capitalize">{contact.status}</span>
                                    </div>
                                </div>

                                {/* Score Badge */}
                                <div className="w-[80px] flex items-center justify-center">
                                    <div className="h-[20px] px-[6px] bg-white border border-[#eef0f2] rounded-[6px] flex items-center gap-2">
                                        <div className={`w-[12px] h-[12px] rounded-[4px] shrink-0 ${getScoreColor(contact.score)}`} />
                                        <span className="text-[13px] font-medium text-[#3a4455]">{contact.score}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FilterTab({ label, count, isActive, onClick }: { label: string; count: number; isActive: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`relative h-[40px] px-[8px] flex items-center gap-2 transition-colors ${isActive ? 'text-[#10161e]' : 'text-[#3a4455] hover:text-[#10161e]'
                }`}
        >
            <span className="text-[14px] font-medium tracking-[-0.042px] leading-[20px]">{label}</span>
            <span className={`text-[12px] font-medium px-1.5 py-0.5 rounded ${isActive ? 'bg-[#10161e] text-white' : 'bg-gray-100 text-gray-600'}`}>
                {count}
            </span>
            {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3a4455] rounded-[1000px]" />
            )}
        </button>
    );
}
