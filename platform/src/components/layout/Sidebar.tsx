"use client";

import React, { useState } from "react";
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
    LayoutGrid,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Figma SVG for Duo Copilot
    const DuoCopilotIcon = "http://localhost:3845/assets/2004332056f2ad79bc432c16785f07ac781afe3a.svg";

    return (
        <div
            className={`h-full bg-[#f4f4f5] flex flex-col font-sans border-r border-[#E5E8EB] transition-all duration-300 ease-in-out ${isCollapsed ? "w-[60px]" : "w-[232px]"
                }`}
        >
            {/* Header Section */}
            <div className={`relative w-full px-3 py-5 ${isCollapsed ? 'flex flex-col items-center gap-4' : 'h-[73px]'}`}>
                <div className="flex items-center justify-between w-full">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold shrink-0">
                            L
                        </div>
                    </div>

                    {!isCollapsed && (
                        <button
                            onClick={() => setIsCollapsed(true)}
                            className="w-7 h-7 flex items-center justify-center text-[#4b5563] hover:bg-black/5 rounded-md transition-colors"
                        >
                            <LayoutGrid size={16} />
                        </button>
                    )}
                </div>

                {isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(false)}
                        className="w-7 h-7 flex items-center justify-center text-[#4b5563] hover:bg-black/5 rounded-md transition-colors"
                    >
                        <LayoutGrid size={16} />
                    </button>
                )}
            </div>

            {/* Quick Actions */}
            <div className="px-2 mb-2">
                <button className={`w-full h-9 bg-white rounded-md shadow-[0px_0px_2px_0px_rgba(229,232,235,0.6),0px_3px_6px_-2px_rgba(25,34,46,0.08),0px_4px_4px_-4px_rgba(25,34,46,0.02)] flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-2.5'} text-sm text-[#3a4455] hover:bg-gray-50 transition-colors border border-transparent overflow-hidden`}>
                    <Plus size={16} className={`text-[#4b5563] shrink-0 ${isCollapsed ? '' : 'mr-2.5'}`} />
                    {!isCollapsed && (
                        <>
                            <span className="font-medium whitespace-nowrap">Quick actions</span>
                            <div className="ml-auto border border-gray-200 rounded px-1.5 py-0.5 text-[10px] text-gray-500 font-medium">
                                ⌘K
                            </div>
                        </>
                    )}
                </button>
            </div>

            {/* Main Navigation */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-0.5">
                {/* Duo Copilot */}
                <button className={`w-full h-9 flex items-center px-2 rounded-md text-[#4b5563] hover:bg-black/5 transition-colors group relative ${isCollapsed ? 'justify-center' : ''}`}>
                    <span className={`w-5 flex justify-center items-center shrink-0 ${isCollapsed ? '' : 'mr-3'}`}>
                        <img src={DuoCopilotIcon} alt="" className="w-4 h-4" />
                    </span>
                    {!isCollapsed && (
                        <>
                            <span className="text-sm font-medium text-[#3a4455] whitespace-nowrap">ICP</span>
                            <div className="ml-auto bg-[#2d72f0] text-white text-[10px] font-medium h-[18px] min-w-[18px] flex items-center justify-center rounded px-1">
                                1
                            </div>
                        </>
                    )}
                </button>

                <div className="mb-2">
                    <NavItem isCollapsed={isCollapsed} icon={<ChevronLeft size={14} className="rotate-180" />} label="Prospect" />
                </div>

                {/* SEARCH Section */}
                <NavItem isCollapsed={isCollapsed} icon={<Search size={16} />} label="Searcher" />
                <NavItem isCollapsed={isCollapsed} icon={<Bookmark size={16} />} label="Saved Searches" />
                <NavItem isCollapsed={isCollapsed} icon={<List size={16} />} label="Lists" />
                <NavItem isCollapsed={isCollapsed} icon={<Megaphone size={16} />} label="Campaigns" />

                <div className="h-4" /> {/* Spacer */}

                <div className="mb-2">
                    <NavItem isCollapsed={isCollapsed} icon={<ChevronLeft size={14} className="rotate-180" />} label="Engage" />
                </div>

                {/* ENGAGE Section */}
                <NavItem isCollapsed={isCollapsed} icon={<CheckSquare size={16} />} label="Tasks" />
                <NavItem isCollapsed={isCollapsed} icon={<Users size={16} />} label="Contacts" />
            </div>

            {/* Footer Section */}
            <div className="px-3 py-3 flex flex-col justify-end gap-1 border-t border-transparent">
                <NavItem isCollapsed={isCollapsed} icon={<ExternalLink size={16} />} label="Try on ChatGPT" />
                <NavItem isCollapsed={isCollapsed} icon={<HelpCircle size={16} />} label="Get Help" />
                <NavItem isCollapsed={isCollapsed} icon={<Settings size={16} />} label="Settings" />
            </div>
        </div>
    );
}

function NavItem({ icon, label, isCollapsed }: { icon: React.ReactNode; label: string; isCollapsed: boolean }) {
    return (
        <button
            className={`w-full h-9 flex items-center rounded-md text-[#4b5563] hover:bg-black/5 transition-colors group relative ${isCollapsed ? 'justify-center px-0' : 'px-2'
                }`}
            title={isCollapsed ? label : undefined}
        >
            <span className={`w-5 flex justify-center items-center shrink-0 opacity-80 group-hover:opacity-100 ${isCollapsed ? '' : 'mr-3'}`}>
                {icon}
            </span>
            {!isCollapsed && (
                <span className="text-sm font-medium text-[#3a4455] whitespace-nowrap overflow-hidden text-ellipsis">
                    {label}
                </span>
            )}
        </button>
    );
}
