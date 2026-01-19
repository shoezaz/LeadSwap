import React from "react";

export function Toolbar() {
    const [activeTab, setActiveTab] = React.useState<"people" | "companies">("people");

    return (
        <div className="w-full h-[48px] border-b border-[#eef0f2] flex items-center justify-between px-5 bg-white">
            {/* Left: Tabs */}
            <div className="flex items-center h-full gap-6">
                {/* Active Tab: People */}
                <div
                    onClick={() => setActiveTab("people")}
                    className={`h-full flex items-center gap-2 cursor-pointer transition-colors ${activeTab === "people"
                        ? "border-b-[2px] border-[#3a4455]"
                        : "text-[#4b5563] hover:text-[#10161e]"
                        }`}
                >
                    <span className={`text-[14px] font-medium ${activeTab === "people" ? "text-[#10161e]" : ""}`}>People</span>
                    <div className="bg-[#eef0f2] px-1.5 h-5 rounded-[6px] flex items-center justify-center">
                        <span className="text-[#3a4455] text-[13px] font-medium leading-none">11,251</span>
                    </div>
                </div>

                {/* Inactive Tab: Companies */}
                <div
                    onClick={() => setActiveTab("companies")}
                    className={`h-full flex items-center gap-2 cursor-pointer transition-colors ${activeTab === "companies"
                        ? "border-b-[2px] border-[#3a4455]"
                        : "text-[#4b5563] hover:text-[#10161e]"
                        }`}
                >
                    <span className={`text-[14px] font-medium ${activeTab === "companies" ? "text-[#10161e]" : ""}`}>Companies</span>
                    <div className="bg-[#eef0f2] px-1.5 h-5 rounded-[6px] flex items-center justify-center">
                        <span className="text-[#3a4455] text-[13px] font-medium leading-none">9,409</span>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Sort by Date added */}
                <button className="h-[28px] px-3 border border-[#eef0f2] rounded-[6px] flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors">
                    <span className="text-[#3a4455] text-[13px] font-medium">Sort by Date added</span>
                    {/* SVG 3: Chevron Down */}
                    <svg width="10" height="6" viewBox="0 0 14 27" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[10px] h-[10px] pt-1">
                        {/* ViewBox 0 0 14 27 is very tall for a chevron. Let's trust the path. */}
                        <path d="M6.93105 16.3398L3.50332 12.9297C3.34512 12.7539 3.34512 12.4902 3.50332 12.332L3.90762 11.9277C4.06582 11.7695 4.32949 11.7695 4.50527 11.9277L7.22988 14.6348L9.93691 11.9277C10.1127 11.7695 10.3764 11.7695 10.5346 11.9277L10.9389 12.332C11.0971 12.4902 11.0971 12.7539 10.9389 12.9297L7.51113 16.3398C7.35293 16.498 7.08926 16.498 6.93105 16.3398Z" fill="#4B5563" />
                    </svg>
                    {/* Note: The user SVG 3 has viewBox 0 0 14 27 which is unusual. Path coordinates seem centered. I'll use it as is. */}
                </button>

                {/* Settings Button */}
                <button className="h-[28px] w-[28px] border border-[#eef0f2] rounded-[6px] flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                    {/* SVG 2: Gear */}
                    <svg width="14" height="14" viewBox="3 8 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.8539 15.9062C14.9711 15.9766 15.018 16.1172 14.9945 16.2344C14.7133 17.0781 14.2914 17.8281 13.7055 18.4609C13.6117 18.5547 13.4711 18.5781 13.3539 18.5078L12.3461 17.9453C11.9242 18.2969 11.4555 18.5781 10.9398 18.7656V19.9141C10.9398 20.0312 10.8461 20.1484 10.7055 20.1953C9.88516 20.3594 9.01797 20.3828 8.15078 20.1953C8.03359 20.1484 7.93984 20.0312 7.93984 19.9141V18.7656C7.40078 18.5781 6.93203 18.2969 6.51016 17.9453L5.50234 18.5078C5.38516 18.5781 5.24453 18.5547 5.15078 18.4609C4.58828 17.8281 4.14297 17.0781 3.88516 16.2344C3.83828 16.1172 3.88516 15.9766 4.00234 15.9062L5.01016 15.3438C4.91641 14.7812 4.91641 14.2422 5.01016 13.6797L4.00234 13.1172C3.88516 13.0469 3.83828 12.9062 3.88516 12.7891C4.14297 11.9453 4.58828 11.1953 5.15078 10.5625C5.24453 10.4688 5.38516 10.4453 5.50234 10.5156L6.51016 11.1016C6.93203 10.7266 7.40078 10.4453 7.93984 10.2578V9.10938C7.93984 8.99219 8.01016 8.875 8.15078 8.85156C8.97109 8.66406 9.83828 8.64062 10.7055 8.85156C10.8461 8.875 10.9398 8.99219 10.9398 9.10938V10.2578C11.4555 10.4453 11.9242 10.7266 12.3461 11.0781L13.3539 10.5156C13.4711 10.4453 13.6117 10.4688 13.7055 10.5625C14.268 11.1953 14.7133 11.9453 14.9711 12.7891C15.018 12.9062 14.9711 13.0469 14.8539 13.1172L13.8461 13.6797C13.9633 14.2422 13.9633 14.7812 13.8461 15.3438L14.8539 15.9062ZM9.43984 16.375C10.4711 16.375 11.3148 15.5547 11.3148 14.5C11.3148 13.4688 10.4711 12.625 9.43984 12.625C8.38516 12.625 7.56484 13.4688 7.56484 14.5C7.56484 15.5547 8.38516 16.375 9.43984 16.375Z" fill="#4B5563" />
                    </svg>
                </button>

                {/* Sort by Relevancy */}
                <button className="h-[28px] px-3 border border-[#eef0f2] rounded-[6px] flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                    <span className="text-[#3a4455] text-[13px] font-medium">Sort by Relevancy</span>
                </button>

                {/* Save List */}
                <button className="h-[28px] px-3 border border-[#eef0f2] rounded-[6px] flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors">
                    {/* SVG 1: Bookmark */}
                    <svg width="9" height="12" viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.000391006 12V1.125C0.000391006 0.515625 0.492579 0 1.12539 0H7.87539C8.48477 0 9.00039 0.515625 9.00039 1.125V12L4.50039 9.375L0.000391006 12Z" fill="#4B5563" />
                    </svg>
                    <span className="text-[#3a4455] text-[13px] font-medium">Save List</span>
                </button>
            </div>
        </div>
    );
}
