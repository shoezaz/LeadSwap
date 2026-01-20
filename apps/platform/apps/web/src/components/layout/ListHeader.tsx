import React from "react";

export interface Column {
    key: string;
    label: string;
    width?: number;
}

interface ListHeaderProps {
    columns: Column[];
    onSelectAll?: () => void;
    allSelected?: boolean;
}

export function ListHeader({ columns, onSelectAll, allSelected = false }: ListHeaderProps) {
    return (
        <div className="sticky top-0 z-10 flex items-center bg-[#f4f4f5] border-b border-[#eef0f2] h-[40px] min-w-max w-full">
            {/* Checkbox Column */}
            <div
                className="w-[44px] h-full flex items-center justify-center shrink-0 cursor-pointer"
                onClick={onSelectAll}
            >
                <div className={`w-4 h-4 border rounded-[4px] flex items-center justify-center transition-colors ${allSelected ? "bg-[#1b56e0] border-[#1b56e0]" : "border-[#d1d5db] bg-white"}`}>
                    {allSelected && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 1L3.5 7L1 4.27273" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Dynamic Columns */}
            {columns.map((col) => (
                <div
                    key={col.key}
                    className="h-full flex items-center px-3 shrink-0"
                    style={{ width: col.width || 160 }}
                >
                    <span className="text-[#3a4455] text-[14px] font-medium leading-[20px] truncate">
                        {col.label}
                    </span>
                </div>
            ))}

            {/* Spacer */}
            <div className="flex-1 min-w-[50px]"></div>
        </div>
    );
}
