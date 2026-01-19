"use client";

import React from "react";

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    return (
        <div
            className={`h-full bg-[#f4f4f5] flex flex-col relative w-full`}
            data-name="Nav - expanded sidebar → List"
            data-node-id="2109:106"
        >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-3`}>
                {!isCollapsed && <div className="font-bold text-gray-700 whitespace-nowrap overflow-hidden">LeadSwap</div>}

                <button
                    onClick={onToggle}
                    className="p-1.5 hover:bg-gray-200/50 rounded-md transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_2108_1995)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.4135 2.9375H4.20192C2.84776 2.9375 1.75 4.03527 1.75 5.38942V10.7981C1.75 12.1522 2.84776 13.25 4.20192 13.25H11.4135C12.7676 13.25 13.8654 12.1522 13.8654 10.7981V5.38942C13.8654 4.03526 12.7676 2.9375 11.4135 2.9375ZM3 5.38942C3 4.72562 3.53812 4.1875 4.20192 4.1875H7.20673V12H4.20192C3.53812 12 3 11.4619 3 10.7981V5.38942ZM8.45673 12H11.4135C12.0773 12 12.6154 11.4619 12.6154 10.7981V5.38942C12.6154 4.72562 12.0773 4.1875 11.4135 4.1875H8.45673V12ZM4.2019 5.96635C4.2019 5.62117 4.48173 5.34135 4.8269 5.34135H5.37979C5.72497 5.34135 6.00479 5.62117 6.00479 5.96635C6.00479 6.31152 5.72497 6.59135 5.37979 6.59135H4.8269C4.48173 6.59135 4.2019 6.31152 4.2019 5.96635ZM4.8269 7.14423C4.48173 7.14423 4.2019 7.42405 4.2019 7.76923C4.2019 8.1144 4.48173 8.39423 4.8269 8.39423H5.37979C5.72497 8.39423 6.00479 8.1144 6.00479 7.76923C6.00479 7.42405 5.72497 7.14423 5.37979 7.14423H4.8269Z" fill="#566684" />
                        </g>
                        <defs>
                            <clipPath id="clip0_2108_1995">
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>
        </div>
    );
}
