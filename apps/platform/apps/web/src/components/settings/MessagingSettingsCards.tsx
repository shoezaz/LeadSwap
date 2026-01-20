"use client";

import React from "react";

export function MessagingSettingsCards() {
    return (
        <div className="bg-white rounded-[8px] p-6 shadow-[0px_1px_2px_0px_rgba(25,34,46,0.06),0px_0px_0px_1px_rgba(25,34,46,0.03)] relative overflow-hidden">
            {/* Gradient/Icon decoration top-right */}
            <div className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 pointer-events-none opacity-50">
                <span className="text-xl">✨</span>
            </div>

            <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-6 h-6 rounded-[6px] bg-slate-100 text-slate-500">
                    <i className="fas fa-magic text-xs"></i>
                    {/* Placeholder icon if FontAwesome not available, using simple svg or text */}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1L7.5 4.5L11 6L7.5 7.5L6 11L4.5 7.5L1 6L4.5 4.5L6 1Z" fill="currentColor" />
                    </svg>
                </div>
                <h3 className="text-[16px] font-medium text-[#10161e]">Messaging Settings</h3>
            </div>

            <div className="space-y-4">
                {/* Language Input */}
                <div className="space-y-1">
                    <label className="text-[13px] font-medium text-[#3a4455]">Language</label>
                    <div className="relative">
                        <select className="appearance-none w-full bg-white border border-[#d1d5db] rounded-[6px] py-2 px-3 pr-8 text-[14px] text-[#374151] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm">
                            <option>English (US)</option>
                            <option>German</option>
                            <option>French</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 mt-2">
                        <input type="checkbox" id="auto-german" className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                        <label htmlFor="auto-german" className="text-[13px] text-[#6b7280]">Use German if the prospect is located in Germany</label>
                    </div>
                </div>

                {/* Tone of Voice Input */}
                <div className="space-y-1">
                    <label className="text-[13px] font-medium text-[#3a4455]">Tone of voice</label>
                    <div className="relative">
                        <select className="appearance-none w-full bg-white border border-[#d1d5db] rounded-[6px] py-2 px-3 pr-8 text-[14px] text-[#374151] focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm">
                            <option>Auto-match prospect tone</option>
                            <option>Professional</option>
                            <option>Casual</option>
                            <option>Enthusiastic</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
