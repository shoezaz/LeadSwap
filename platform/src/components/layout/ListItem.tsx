import React from "react";

interface ListItemProps {
    personName: string;
    itemScore: string; // "Score" column
    location: string;
    companyName: string;
    companyLocation: string;
    companySize: string;
    phoneNumber: string;
    email: string;
    isSelected?: boolean;
    onToggle?: () => void;
}

export function ListItem({
    personName,
    itemScore,
    location,
    companyName,
    companyLocation,
    companySize,
    phoneNumber,
    email,
    isSelected = false,
    onToggle
}: ListItemProps) {
    return (
        <div className={`flex items-center bg-white border-b border-[#eef0f2] h-[40px] min-w-max w-full hover:bg-gray-50 transition-colors group ${isSelected ? "bg-blue-50/50" : ""}`}>
            {/* Checkbox Column */}
            <div
                className="w-[61px] h-full flex items-center justify-center border-r border-[#eef0f2] shrink-0 sticky left-0 bg-white group-hover:bg-gray-50 z-10 cursor-pointer"
                onClick={onToggle}
            >
                <div className={`w-4 h-4 border rounded-[4px] flex items-center justify-center transition-colors ${isSelected ? "bg-[#1b56e0] border-[#1b56e0]" : "border-[#d1d5db] bg-white group-hover:border-[#9ca3af]"}`}>
                    {isSelected && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 1L3.5 7L1 4.27273" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Person */}
            <div className="w-[220px] h-full flex items-center px-3 border-r border-[#eef0f2] shrink-0">
                <div className="flex items-center gap-2">
                    {/* Avatar placeholder */}
                    <div className="w-5 h-5 rounded-full bg-gray-200 shrink-0"></div>
                    <span className="text-[#3a4455] text-[14px] leading-[20px] truncate">{personName}</span>
                </div>
            </div>

            {/* Score */}
            <div className="w-[189px] h-full flex items-center px-3 border-r border-[#eef0f2] shrink-0">
                <span className="text-[#3a4455] text-[14px] leading-[20px]">{itemScore}</span>
            </div>

            {/* Location */}
            <div className="w-[189px] h-full flex items-center px-3 border-r border-[#eef0f2] shrink-0">
                <span className="text-[#3a4455] text-[14px] leading-[20px] truncate">{location}</span>
            </div>

            {/* Company */}
            <div className="w-[220px] h-full flex items-center px-3 border-r border-[#eef0f2] shrink-0">
                <div className="flex items-center gap-2">
                    {/* Company logo placeholder */}
                    <div className="w-4 h-4 bg-gray-200 rounded-[2px] shrink-0"></div>
                    <span className="text-[#3a4455] text-[14px] leading-[20px] truncate">{companyName}</span>
                </div>
            </div>

            {/* Company Location */}
            <div className="w-[189px] h-full flex items-center px-3 border-r border-[#eef0f2] shrink-0">
                <span className="text-[#3a4455] text-[14px] leading-[20px] truncate">{companyLocation}</span>
            </div>

            {/* Company Size */}
            <div className="w-[189px] h-full flex items-center px-3 border-r border-[#eef0f2] shrink-0">
                <span className="text-[#3a4455] text-[14px] leading-[20px]">{companySize}</span>
            </div>

            {/* Phone Number */}
            <div className="w-[189px] h-full flex items-center px-3 border-r border-[#eef0f2] shrink-0">
                <span className="text-[#3a4455] text-[14px] leading-[20px]">{phoneNumber}</span>
            </div>

            {/* Email Address */}
            <div className="w-[189px] h-full flex items-center px-3 border-r border-[#eef0f2] shrink-0">
                <span className="text-[#3a4455] text-[14px] leading-[20px] truncate">{email}</span>
            </div>

            {/* Spacer / Remaining */}
            <div className="flex-1 min-w-[50px] h-full border-r border-[#eef0f2] shrink-0"></div>
        </div>
    );
}
