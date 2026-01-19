import React from "react";

interface SelectionMenuProps {
    selectedCount: number;
    onClose: () => void;
}

export function SelectionMenu({ selectedCount, onClose }: SelectionMenuProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center bg-[#19222e] text-white rounded-[12px] shadow-2xl border border-[#ffffff1a] p-1.5 h-[56px]">
                {/* Left: Count */}
                <div className="flex items-center h-full px-4 border-r border-[#ffffff1a]">
                    <span className="text-[14px] font-medium text-white">{selectedCount.toLocaleString()} selected</span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 pl-2">
                    {/* Add to sequence */}
                    <button className="flex items-center gap-2 px-3 py-2 rounded-[8px] hover:bg-[#ffffff0d] transition-colors text-[#e2e8f0]">
                        <svg className="w-4 h-4 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[14px] font-medium">Send email</span>
                    </button>



                    {/* Export to CSV */}
                    <button className="flex items-center gap-2 px-3 py-2 rounded-[8px] hover:bg-[#ffffff0d] transition-colors text-[#e2e8f0]">
                        <svg className="w-4 h-4 text-[#94a3b8]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 13H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M8 17H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-[14px] font-medium">Export to CSV</span>
                    </button>

                    {/* Divider */}
                    <div className="w-px h-6 bg-[#ffffff1a] mx-1"></div>

                    {/* More Actions (Ellipsis) */}
                    <button className="flex items-center justify-center w-8 h-8 rounded-[8px] hover:bg-[#ffffff0d] transition-colors text-[#94a3b8]">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2" />
                            <circle cx="19" cy="12" r="1" stroke="currentColor" strokeWidth="2" />
                            <circle cx="5" cy="12" r="1" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>

                    {/* Close (X) */}
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-8 h-8 rounded-[8px] hover:bg-[#ffffff0d] transition-colors text-[#94a3b8]"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
