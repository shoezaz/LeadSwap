"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SubNav } from "./SubNav";
import { Toolbar } from "./Toolbar";
import { ListHeader } from "./ListHeader";
import { ListItem } from "./ListItem";
import { SelectionMenu } from "./SelectionMenu";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const toggleSelection = (id: number) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const sidebarWidth = isCollapsed ? 60 : 232;
    const contentLeft = isCollapsed ? "60px" : "232px";

    return (
        <>
            <div
                className="absolute bg-[#f4f4f5] bottom-0 left-0 overflow-clip top-0 transition-[width] duration-300 ease-in-out"
                style={{ width: sidebarWidth }}
            >
                <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
                {/* Horizontal Divider */}
                <div className="absolute border-[#eef0f2] border-solid border-t h-px left-0 right-0 top-[1119px]" />
            </div>

            {/* Top Header */}
            <div
                className="absolute bg-white h-[48px] overflow-clip right-0 rounded-tl-[8px] top-[8px] transition-[left] duration-300 ease-in-out"
                style={{ left: contentLeft }} // Use style for dynamic transition
            >
                <Header />
                <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(25,34,46,0.03),inset_0px_1px_2px_0px_rgba(25,34,46,0.06),inset_0px_0px_2px_0px_rgba(25,34,46,0.08)]" />
            </div>

            {/* Main Content Area */}
            <div
                className="absolute bg-[#f4f4f5] inset-y-0 right-0 top-[56px] overflow-auto transition-[left] duration-300 ease-in-out"
                style={{ left: contentLeft }}
            >
                <div className="absolute bg-white inset-[-4px_0_8px_0] overflow-clip rounded-bl-[8px]">
                    <SubNav />
                    <Toolbar />
                    <div className="absolute inset-[96px_1px_1px_1px] overflow-auto">
                        <ListHeader />
                        <div className="flex flex-col">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <ListItem
                                    key={i}
                                    personName={`Person ${i + 1}`}
                                    itemScore={`${Math.floor(Math.random() * 100)}`}
                                    location="New York, NY"
                                    companyName={`Company ${i + 1}`}
                                    companyLocation="San Francisco, CA"
                                    companySize="10-50"
                                    phoneNumber="+1 555-0123"
                                    email={`person${i + 1}@example.com`}
                                    isSelected={selectedIds.has(i)}
                                    onToggle={() => toggleSelection(i)}
                                />
                            ))}
                        </div>
                    </div>
                    <SelectionMenu
                        selectedCount={selectedIds.size}
                        onClose={() => setSelectedIds(new Set())}
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(25,34,46,0.03),inset_0px_1px_2px_0px_rgba(25,34,46,0.06),inset_0px_0px_2px_0px_rgba(25,34,46,0.08)]" />
                </div>
            </div>
        </>
    );
}
