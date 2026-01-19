import React from "react";

export function SubNav() {
    return (
        <div className="w-full h-[48px] border-b border-[#eef0f2] flex items-center justify-center relative bg-white">
            {/* Central Search Container */}
            <div className="w-[480px] h-[28px] bg-[#eef0f2] rounded-[8px] flex items-center relative px-2">

                {/* Search Icon Slot (Using User SVG 1: Refresh/Sync Icon) */}
                <div className="flex items-center justify-center w-5 h-5 text-[#4b5563] ml-1">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.8363 10.3828C12.0473 10.6172 12.0473 10.9688 11.8129 11.1797L11.1566 11.8359C10.9457 12.0703 10.5941 12.0703 10.3598 11.8359L8.03945 9.51562C7.92227 9.39844 7.87539 9.25781 7.87539 9.11719V8.71875C7.03164 9.375 6.00039 9.75 4.87539 9.75C2.18008 9.75 0.000391006 7.57031 0.000391006 4.875C0.000391006 2.20312 2.18008 0 4.87539 0C7.54727 0 9.75039 2.20312 9.75039 4.875C9.75039 6.02344 9.35195 7.05469 8.71914 7.875H9.09414C9.23477 7.875 9.37539 7.94531 9.49258 8.03906L11.8363 10.3828ZM4.87539 7.875C6.51602 7.875 7.87539 6.53906 7.87539 4.875C7.87539 3.23438 6.51602 1.875 4.87539 1.875C3.21133 1.875 1.87539 3.23438 1.87539 4.875C1.87539 6.53906 3.21133 7.875 4.87539 7.875Z" fill="#4B5563" />
                    </svg>
                </div>

                {/* Input Field */}
                <input
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-sm text-[#10161e] px-2 h-full placeholder-gray-400"
                // placeholder="Search..."  // Placeholder text not specified in design, keeping empty or minimal
                />

                {/* Right Arrow Button (Using User SVG 2) */}
                <button className="w-5 h-5 bg-white rounded-[6px] shadow-[0px_0px_2px_0px_rgba(229,232,235,0.6),0px_3px_6px_-2px_rgba(25,34,46,0.08),0px_4px_4px_-4px_rgba(25,34,46,0.02)] flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.3398 0.544922L3.72652 0.158203C3.9023 0 4.16598 0 4.32418 0.158203L7.75191 3.56836C7.91012 3.74414 7.91012 4.00781 7.75191 4.16602L4.32418 7.59375C4.16598 7.75195 3.9023 7.75195 3.72652 7.59375L3.3398 7.20703C3.1816 7.03125 3.1816 6.76758 3.3398 6.5918L5.46676 4.57031H0.421836C0.175742 4.57031 -3.91006e-05 4.39453 -3.91006e-05 4.14844V3.58594C-3.91006e-05 3.35742 0.175742 3.16406 0.421836 3.16406H5.46676L3.3398 1.16016C3.1816 0.984375 3.16402 0.720703 3.3398 0.544922Z" fill="#4B5563" />
                    </svg>
                </button>
            </div>

            {/* Info Button (Right side) (Using User SVG 3) */}
            <div className="absolute right-[24px]"> {/* Positioning relative to container right padding/margin equivalent */}
                {/* Wait, design shows it at x=1075 relative to complete width 1686, which is roughly 63%. 
              Figma: Button x=1075, Container width=1686.
              Actually, looking at the layout, it seems the search bar is centered, and this button is to the right of it?
              Figma: Background+Border (Search) x=591 (~35%). center is 843. 591+240=831. So Search is roughly centered.
              Button x=1075. 
              Let's use a flex container efficiently.
              The design shows the button is NOT inside the search bar.
           */}
                <button className="w-5 h-5 border border-[#eef0f2] rounded-[6px] flex items-center justify-center bg-white transition-colors hover:bg-gray-50">
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.35934 0C6.74996 0 8.71871 1.96875 8.71871 4.35938C8.71871 6.76758 6.74996 8.71875 4.35934 8.71875C1.95113 8.71875 -3.91006e-05 6.76758 -3.91006e-05 4.35938C-3.91006e-05 1.96875 1.95113 0 4.35934 0ZM4.35934 1.93359C3.93746 1.93359 3.62105 2.26758 3.62105 2.67188C3.62105 3.09375 3.93746 3.41016 4.35934 3.41016C4.76363 3.41016 5.09762 3.09375 5.09762 2.67188C5.09762 2.26758 4.76363 1.93359 4.35934 1.93359ZM5.34371 6.39844V5.97656C5.34371 5.87109 5.23824 5.76562 5.13277 5.76562H4.92184V4.00781C4.92184 3.90234 4.81637 3.79688 4.7109 3.79688H3.5859C3.46285 3.79688 3.37496 3.90234 3.37496 4.00781V4.42969C3.37496 4.55273 3.46285 4.64062 3.5859 4.64062H3.79684V5.76562H3.5859C3.46285 5.76562 3.37496 5.87109 3.37496 5.97656V6.39844C3.37496 6.52148 3.46285 6.60938 3.5859 6.60938H5.13277C5.23824 6.60938 5.34371 6.52148 5.34371 6.39844Z" fill="#4B5563" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
