import React, { useEffect, useState } from "react";

interface DetailDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    personData?: Record<string, any> | null;
}

// Get first displayable field as title
function getTitle(data: Record<string, any> | null | undefined): string {
    if (!data) return "Details";
    const titleKeys = ["name", "company", "title", "email", "firstName", "lastName"];
    for (const key of titleKeys) {
        if (data[key]) return String(data[key]);
    }
    const firstKey = Object.keys(data).find(k => k !== "id" && data[k]);
    return firstKey ? String(data[firstKey]) : "Details";
}

export function DetailDrawer({ isOpen, onClose, personData }: DetailDrawerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    // Get all fields except id for display
    const fields = personData
        ? Object.entries(personData).filter(([key]) => key !== "id")
        : [];

    const title = getTitle(personData);

    return (
        <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
            <div
                className={`fixed inset-0 transition-opacity duration-300 pointer-events-auto ${isOpen ? "bg-black/20" : "opacity-0"}`}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div
                className={`pointer-events-auto relative w-[500px] h-full bg-white shadow-[0px_0px_0px_1px_rgba(25,34,46,0.03),0px_1px_2px_0px_rgba(25,34,46,0.06),0px_0px_2px_0px_rgba(25,34,46,0.08)] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#eef0f2]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-[#10161e] font-bold text-sm">
                                {title[0]?.toUpperCase() || "?"}
                            </span>
                        </div>
                        <h2 className="text-[16px] font-medium text-[#10161e]">
                            {title}
                        </h2>
                    </div>

                    <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-[6px] text-[#4b5563]">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M1 1L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Dynamic Fields List */}
                <div className="p-6 pb-20 overflow-y-auto flex-1">
                    <div className="space-y-4">
                        {fields.map(([key, value]) => (
                            <div key={key} className="flex flex-col gap-1">
                                <span className="text-[12px] font-medium text-[#6b7280] uppercase tracking-wide">
                                    {key.replace(/_/g, " ")}
                                </span>
                                <span className="text-[14px] text-[#10161e] break-words">
                                    {value !== undefined && value !== null && value !== ""
                                        ? String(value)
                                        : "—"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#eef0f2] bg-white">
                    <button
                        onClick={onClose}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-[#eef0f2] rounded-[6px] hover:bg-gray-50 transition-colors"
                    >
                        <span className="text-[14px] font-medium text-[#3a4455]">Close</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
