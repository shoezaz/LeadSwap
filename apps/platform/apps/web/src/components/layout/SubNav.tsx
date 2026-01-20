import React, { useRef } from "react";

interface SubNavProps {
    prompt?: string;
    onPromptChange?: (value: string) => void;
    onFileUpload?: (file: File) => void;
    onSubmit?: () => void;
    isLoading?: boolean;
    leadsCount?: number;
}

export function SubNav({
    prompt = "",
    onPromptChange,
    onFileUpload,
    onSubmit,
    isLoading = false,
    leadsCount = 0
}: SubNavProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.name.endsWith(".csv") && onFileUpload) {
            onFileUpload(file);
        }
        if (e.target) e.target.value = "";
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && onSubmit) {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <div className="w-full h-[48px] border-b border-[#eef0f2] flex items-center justify-center relative bg-white">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Central Search Container */}
            <div className="w-[560px] h-[28px] bg-[#eef0f2] rounded-[8px] flex items-center relative px-2">
                {/* Paperclip Button - Upload CSV */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center w-5 h-5 text-[#4b5563] ml-1 hover:text-gray-900 transition-colors"
                    title="Upload CSV"
                >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* Input Field */}
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => onPromptChange?.(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-[#10161e] px-2 h-full placeholder-gray-400"
                    placeholder="Describe your ICP..."
                />

                {/* Leads count badge */}
                {leadsCount > 0 && (
                    <span className="text-[10px] text-gray-500 mr-2">{leadsCount} leads</span>
                )}

                {/* Submit Button */}
                <button
                    onClick={onSubmit}
                    disabled={isLoading || leadsCount === 0}
                    className="w-5 h-5 bg-white rounded-[6px] shadow-[0px_0px_2px_0px_rgba(229,232,235,0.6),0px_3px_6px_-2px_rgba(25,34,46,0.08),0px_4px_4px_-4px_rgba(25,34,46,0.02)] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Score Leads"
                >
                    {isLoading ? (
                        <svg className="animate-spin w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                    ) : (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.3398 0.544922L3.72652 0.158203C3.9023 0 4.16598 0 4.32418 0.158203L7.75191 3.56836C7.91012 3.74414 7.91012 4.00781 7.75191 4.16602L4.32418 7.59375C4.16598 7.75195 3.9023 7.75195 3.72652 7.59375L3.3398 7.20703C3.1816 7.03125 3.1816 6.76758 3.3398 6.5918L5.46676 4.57031H0.421836C0.175742 4.57031 -3.91006e-05 4.39453 -3.91006e-05 4.14844V3.58594C-3.91006e-05 3.35742 0.175742 3.16406 0.421836 3.16406H5.46676L3.3398 1.16016C3.1816 0.984375 3.16402 0.720703 3.3398 0.544922Z" fill="#4B5563" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Info Button (Right side) */}
            <div className="absolute right-[24px]">
                <button className="w-5 h-5 border border-[#eef0f2] rounded-[6px] flex items-center justify-center bg-white transition-colors hover:bg-gray-50">
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.35934 0C6.74996 0 8.71871 1.96875 8.71871 4.35938C8.71871 6.76758 6.74996 8.71875 4.35934 8.71875C1.95113 8.71875 -3.91006e-05 6.76758 -3.91006e-05 4.35938C-3.91006e-05 1.96875 1.95113 0 4.35934 0ZM4.35934 1.93359C3.93746 1.93359 3.62105 2.26758 3.62105 2.67188C3.62105 3.09375 3.93746 3.41016 4.35934 3.41016C4.76363 3.41016 5.09762 3.09375 5.09762 2.67188C5.09762 2.26758 4.76363 1.93359 4.35934 1.93359ZM5.34371 6.39844V5.97656C5.34371 5.87109 5.23824 5.76562 5.13277 5.76562H4.92184V4.00781C4.92184 3.90234 4.81637 3.79688 4.7109 3.79688H3.5859C3.46285 3.79688 3.37496 3.90234 3.37496 4.00781V4.42969C3.37496 4.55273 3.46285 4.64062 3.5859 4.64062H3.79684V5.76562H3.5859C3.46285 5.76562 3.37496 5.87109 3.37496 5.97656V6.39844C3.37496 6.52148 3.46285 6.60938 3.5859 6.60938H5.13277C5.23824 6.60938 5.34371 6.52148 5.34371 6.39844Z" fill="#4B5563" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
