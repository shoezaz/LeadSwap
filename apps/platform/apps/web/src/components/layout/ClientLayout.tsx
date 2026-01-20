"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen w-full bg-[#f4f4f5] overflow-hidden">
            {/* Sidebar */}
            <div
                className={`flex-none h-full bg-[#f4f4f5] transition-[width] duration-300 ease-in-out ${isCollapsed ? "w-[80px]" : "w-[240px]"
                    }`}
            >
                <div className="w-full h-full relative">
                    <Sidebar
                        isCollapsed={isCollapsed}
                        onToggle={() => setIsCollapsed(!isCollapsed)}
                    />
                </div>
            </div>

            {/* Main Content Area - White Card floating on gray background */}
            <div className="flex-1 h-full p-2 pt-2 sm:pl-0 sm:pt-2 overflow-hidden"> {/* Reduced padding to 2 to minimize gray gap if preferred, or keep consistent */}
                {children}
            </div>
        </div>
    );
}
