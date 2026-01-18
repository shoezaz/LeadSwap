"use client";

import React from "react";
import Image from "next/image";
import {
    Plus,
    Settings,
    HelpCircle,
    ExternalLink,
    ChevronLeft,
    Search,
    Bookmark,
    List,
    Megaphone,
    CheckSquare,
    Users,
    LayoutGrid
} from "lucide-react";

export function Sidebar() {
    // Figma SVG for Duo Copilot (Node 2099:1223)
    const DuoCopilotIcon = "http://localhost:3845/assets/2004332056f2ad79bc432c16785f07ac781afe3a.svg";

    return (
        <div className="w-[232px] h-full bg-sidebar-bg flex flex-col font-sans border-r border-[#E5E8EB]">
            {/* Header Section (73px) */}
            <div className="h-[73px] relative w-full px-3 py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Logo placehoder */}
                        <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold">
                            L
                        </div>
                    </div>

                    <button className="w-7 h-7 flex items-center justify-center text-sidebar-icon hover:bg-black/5 rounded-md transition-colors">
                        <LayoutGrid size={16} />
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-2 mb-2">
                <button className="w-full h-9 bg-white rounded-md shadow-[0px_0px_2px_0px_rgba(229,232,235,0.6),0px_3px_6px_-2px_rgba(25,34,46,0.08),0px_4px_4px_-4px_rgba(25,34,46,0.02)] flex items-center px-2.5 text-sm text-sidebar-text hover:bg-gray-50 transition-colors border border-transparent">
                    <Plus size={16} className="text-sidebar-icon mr-2.5" />
                    <span className="font-medium">Quick actions</span>
                    <div className="ml-auto border border-gray-200 rounded px-1.5 py-0.5 text-[10px] text-gray-500 font-medium">
                        ⌘K
                    </div>
                </button>
            </div>

            {/* Main Navigation (Node 2099:1221) */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
                {/* Duo Copilot - with Badge */}
                <button className="w-full h-9 flex items-center px-2 rounded-md text-sidebar-icon hover:bg-black/5 transition-colors group relative">
                    <span className="w-5 flex justify-center items-center mr-3">
                        <img src={DuoCopilotIcon} alt="" className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-medium text-sidebar-text">ICP</span>
                    <div className="ml-auto bg-[#2d72f0] text-white text-[10px] font-medium h-[18px] min-w-[18px] flex items-center justify-center rounded px-1">
                        1
                    </div>
                </button>

                <div className="mb-2">
                    <NavItem icon={<ChevronLeft size={14} className="rotate-180" />} label="Prospect" />
                </div>

                {/* SEARCH Section */}
                <NavItem icon={<Search size={16} />} label="Searcher" />
                <NavItem icon={<Bookmark size={16} />} label="Saved Searches" />
                <NavItem icon={<List size={16} />} label="Lists" />
                <NavItem icon={<Megaphone size={16} />} label="Campaigns" />

                <div className="h-4" /> {/* Spacer */}

                <div className="mb-2">
                    <NavItem icon={<ChevronLeft size={14} className="rotate-180" />} label="Engage" />
                </div>

                {/* ENGAGE Section */}
                <NavItem icon={<CheckSquare size={16} />} label="Tasks" />
                <NavItem icon={<Users size={16} />} label="Contacts" />

            </div>

            {/* Footer Section */}
            <div className="h-[112px] px-3 py-3 flex flex-col justify-end gap-1">
                <NavItem icon={<ExternalLink size={16} />} label="Try on ChatGPT" />
                <NavItem icon={<HelpCircle size={16} />} label="Get Help" />
                <NavItem icon={<Settings size={16} />} label="Settings" />
            </div>
        </div>
    );
}

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <button className="w-full h-9 flex items-center px-2 rounded-md text-sidebar-icon hover:bg-black/5 transition-colors group">
            <span className="w-5 flex justify-center items-center mr-3 opacity-80 group-hover:opacity-100">
                {icon}
            </span>
            <span className="text-sm font-medium text-sidebar-text">{label}</span>
        </button>
    );
}
