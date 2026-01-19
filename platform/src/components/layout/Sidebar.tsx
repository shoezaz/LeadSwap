"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Plus,
    Settings,
    HelpCircle,
    ExternalLink,
    ChevronRight,
    Search,
    List,
    Users,
    LayoutGrid,
} from "lucide-react";


export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    // Sections state
    const [sections, setSections] = useState({
        prospect: true,
        engage: true,
    });

    const toggleSection = (section: keyof typeof sections) => {
        setSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

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
                <button className={`w-full h-9 bg-white rounded-md shadow-[0px_0px_2px_0px_rgba(229,232,235,0.6),0px_3px_6px_-2px_rgba(25,34,46,0.08),0px_4px_4px_-4px_rgba(25,34,46,0.02)] flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-2.5'} text-sm text-[#3a4455] hover:bg-gray-50 transition-colors border border-transparent overflow-hidden shrink-0`}>
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
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-0.5 custom-scrollbar">
                {/* Duo Copilot */}
                <Link href="/icp" className={`w-full h-9 flex items-center px-2 rounded-md ${pathname === '/icp' ? 'bg-black/5' : 'text-[#4b5563] hover:bg-black/5'} transition-colors group relative ${isCollapsed ? 'justify-center' : ''}`}>
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
                </Link>

                {/* PROSPECT Section */}
                <CollapsibleSection
                    title="Prospect"
                    isOpen={sections.prospect}
                    onToggle={() => toggleSection('prospect')}
                    isSidebarCollapsed={isCollapsed}
                >
                    <NavItem href="/prospect/searcher" icon={<Search size={16} />} label="Searcher" isSidebarCollapsed={isCollapsed} pathname={pathname} />
                    <NavItem href="/prospect/lists" icon={<List size={16} />} label="Lists" isSidebarCollapsed={isCollapsed} pathname={pathname} />
                </CollapsibleSection>

                {/* ENGAGE Section */}
                <CollapsibleSection
                    title="Engage"
                    isOpen={sections.engage}
                    onToggle={() => toggleSection('engage')}
                    isSidebarCollapsed={isCollapsed}
                >
                    <NavItem href="/engage/contacts" icon={<Users size={16} />} label="Contacts" isSidebarCollapsed={isCollapsed} pathname={pathname} />
                </CollapsibleSection>

            </div>

            {/* Footer Section */}
            <div className="px-3 py-3 flex flex-col justify-end gap-1 border-t border-transparent shrink-0">
                <NavItem href="#" icon={<ExternalLink size={16} />} label="Try on ChatGPT" isSidebarCollapsed={isCollapsed} pathname={pathname} />
                <NavItem href="#" icon={<HelpCircle size={16} />} label="Get Help" isSidebarCollapsed={isCollapsed} pathname={pathname} />
                <NavItem href="#" icon={<Settings size={16} />} label="Settings" isSidebarCollapsed={isCollapsed} pathname={pathname} />
            </div>
        </div>
    );
}

function CollapsibleSection({
    title,
    isOpen,
    onToggle,
    children,
    isSidebarCollapsed
}: {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    isSidebarCollapsed: boolean;
}) {
    if (isSidebarCollapsed) {
        // When sidebar is collapsed, we don't show the header, just the icons?
        // Or we show icons in a flat list? Figma behavior assumption: usually shows icons directly or has a popup.
        // For simple sidebar collapse without popups, showing children directly is common.
        return <div className="space-y-0.5 mt-2 mb-2 border-t border-transparent pt-2">{children}</div>;
    }

    return (
        <div className="mt-2 mb-1">
            <button
                onClick={onToggle}
                className="w-full h-8 flex items-center px-1 rounded-md text-[#4b5563] hover:bg-black/5 transition-colors group mb-0.5"
            >
                <div className={`w-5 flex justify-center items-center shrink-0 mr-1 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>
                    <ChevronRight size={12} strokeWidth={2.5} />
                </div>
                <span className="text-[13px] font-semibold text-[#3a4455] opacity-90">{title}</span>
            </button>
            <div
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}

function NavItem({
    icon,
    label,
    isCollapsed, /* alias for isSidebarCollapsed */
    isSidebarCollapsed,
    href,
    pathname
}: {
    icon: React.ReactNode;
    label: string;
    isCollapsed?: boolean;
    isSidebarCollapsed: boolean;
    href: string;
    pathname: string;
}) {
    const collapsed = isSidebarCollapsed || isCollapsed; // Handle both prop names for compatibility
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`w-full h-9 flex items-center rounded-md text-[#4b5563] transition-colors group relative ${collapsed ? 'justify-center px-0' : 'px-2'
                } ${isActive ? 'bg-black/5 font-medium text-[#1a1a1a]' : 'hover:bg-black/5'}`}
            title={collapsed ? label : undefined}
        >
            <span className={`w-5 flex justify-center items-center shrink-0 group-hover:opacity-100 ${isActive ? 'opacity-100 text-[#2d72f0]' : 'opacity-80'} ${collapsed ? '' : 'mr-3'}`}>
                {icon}
            </span>
            {!collapsed && (
                <span className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis ${isActive ? 'text-[#1a1a1a]' : 'text-[#3a4455]'}`}>
                    {label}
                </span>
            )}
        </Link>
    );
}
