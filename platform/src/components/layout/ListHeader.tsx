import React from "react";

export function ListHeader() {
    return (
        <div className="sticky top-0 z-10 flex items-center bg-[#f4f4f5] border-b border-[#eef0f2] h-[40px] min-w-max w-full">
            {/* Checkbox Column */}
            <div className="w-[61px] h-full flex items-center justify-center border-r border-transparent relative shrink-0">
                {/* Checkbox - using a simple styled div for now to match the look, or SVG if needed. 
                     Figma shows "Button -> Checkbox". 
                     I'll assume a standard checkbox appearance: 16x16 or similar.
                 */}
                <div className="w-4 h-4 border border-[#d1d5db] rounded-[4px] bg-white"></div>
                {/* Divider effect pattern from Figma:
                    <div className="absolute bg-[#1b56e0] bottom-px right-0 opacity-0... /> 
                    Figma has invisible dividers. Standard border-r is not visible in the design screenshot except maybe strictly between headers if hovered?
                    The metadata showed "HorizontalBorder" and "Vertical Divider" (opacity 0).
                    I will skip vertical dividers for now unless visible.
                 */}
            </div>

            {/* Person */}
            <div className="w-[220px] h-full flex items-center px-3 shrink-0">
                <span className="text-[#3a4455] text-[14px] font-medium leading-[20px]">Person</span>
            </div>

            {/* Score */}
            <div className="w-[189px] h-full flex items-center px-3 shrink-0">
                <span className="text-[#3a4455] text-[14px] font-medium leading-[20px]">Score</span>
            </div>

            {/* Location */}
            <div className="w-[189px] h-full flex items-center px-3 shrink-0">
                <span className="text-[#3a4455] text-[14px] font-medium leading-[20px]">Location</span>
            </div>

            {/* Company */}
            <div className="w-[220px] h-full flex items-center px-3 shrink-0">
                <span className="text-[#3a4455] text-[14px] font-medium leading-[20px]">Company</span>
            </div>

            {/* Company Location */}
            <div className="w-[189px] h-full flex items-center px-3 shrink-0">
                <span className="text-[#3a4455] text-[14px] font-medium leading-[20px]">Company location</span>
            </div>

            {/* Company Size */}
            <div className="w-[189px] h-full flex items-center px-3 shrink-0">
                <span className="text-[#3a4455] text-[14px] font-medium leading-[20px]">Company size</span>
            </div>

            {/* Phone Number */}
            <div className="w-[189px] h-full flex items-center px-3 shrink-0">
                <span className="text-[#3a4455] text-[14px] font-medium leading-[20px]">Phone number</span>
            </div>

            {/* Email Address */}
            <div className="w-[189px] h-full flex items-center px-3 shrink-0">
                <span className="text-[#3a4455] text-[14px] font-medium leading-[20px]">Email address</span>
            </div>

            {/* Spacer / Remaining */}
            <div className="flex-1 min-w-[50px]"></div>
        </div>
    );
}
