"use client";

import React from "react";

export function Sidebar() {
    return (
        <div
            className="h-full w-[232px] bg-[#f4f4f5] flex flex-col relative shrink-0"
            data-name="Nav - expanded sidebar"
        >
            {/* Horizontal Divider at bottom as per Figma Node 2109:304 position, though usually relative to bottom */}
            {/* The Figma node 2109:304 is at top 1119px, likely fixed at bottom or just a separator */}
            <div className="absolute bottom-[80px] left-0 right-0 h-px bg-[#eef0f2]" />

            {/* Navigation Content Placeholder */}
        </div>
    );
}
