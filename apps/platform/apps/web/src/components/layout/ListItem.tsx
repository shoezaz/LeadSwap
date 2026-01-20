import React from "react";
import { Column } from "./ListHeader";

interface ListItemProps {
    id: string;
    data: Record<string, any>;
    columns: Column[];
    isSelected?: boolean;
    onToggle?: () => void;
    onClick?: () => void;
}

export function ListItem({
    data,
    columns,
    isSelected = false,
    onToggle,
    onClick
}: ListItemProps) {
    return (
        <div
            className={`flex items-center bg-white border-b border-[#eef0f2] h-[40px] min-w-max w-full hover:bg-gray-50 transition-colors group cursor-pointer ${isSelected ? "bg-blue-50/50" : ""}`}
            onClick={onClick}
        >
            {/* Checkbox Column */}
            <div
                className="w-[44px] h-full flex items-center justify-center shrink-0 sticky left-0 bg-white group-hover:bg-gray-50 z-10 cursor-default"
                onClick={(e) => {
                    e.stopPropagation();
                    onToggle?.();
                }}
            >
                <div className={`w-4 h-4 border rounded-[4px] flex items-center justify-center transition-colors ${isSelected ? "bg-[#1b56e0] border-[#1b56e0]" : "border-[#d1d5db] bg-white group-hover:border-[#9ca3af]"}`}>
                    {isSelected && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 1L3.5 7L1 4.27273" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Dynamic Columns */}
            {columns.map((col) => {
                const value = data[col.key];
                const displayValue = value !== undefined && value !== null && value !== "" ? String(value) : "—";

                return (
                    <div
                        key={col.key}
                        className="h-full flex items-center px-3 border-r border-[#eef0f2] shrink-0"
                        style={{ width: col.width || 160 }}
                    >
                        <span className="text-[#3a4455] text-[14px] leading-[20px] truncate">
                            {displayValue}
                        </span>
                    </div>
                );
            })}

            {/* Spacer */}
            <div className="flex-1 min-w-[50px] h-full shrink-0"></div>
        </div>
    );
}
