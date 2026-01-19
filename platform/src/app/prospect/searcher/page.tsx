import { Search, ArrowRight, Plus } from "lucide-react";

export default function Page() {
    return (
        <div className="h-full w-full flex flex-col items-center pt-[120px] bg-[#ffffff] font-sans">
            <div className="flex flex-col items-center gap-8 w-full max-w-[800px] px-4">

                {/* Heading (Node 2099:8) */}
                <h1 className="text-[26px] leading-[34px] font-medium text-[#10161e] tracking-[-0.078px] text-center">
                    How would you describe your ideal customer?
                </h1>

                {/* Search Bar Container (Node 2101:103 Inspired) */}
                <div className="w-full h-[56px] bg-white rounded-[28px] relative flex items-center px-[18px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.04),0px_0px_1px_0px_rgba(0,0,0,0.62)] border border-transparent">
                    {/* Upload/Add Button (Node 2101:108) */}
                    <button
                        className="w-[24px] h-[24px] flex items-center justify-center shrink-0 hover:bg-gray-100 rounded-full transition-colors group"
                        title="Upload CSV or XLSX"
                    >
                        <Plus size={20} className="text-[#10161e] opacity-60 group-hover:opacity-100" strokeWidth={2} />
                    </button>

                    {/* Input Field */}
                    <input
                        type="text"
                        className="w-full h-full bg-transparent border-none outline-none px-3 text-[#10161e] placeholder:text-[#6b7280] text-[15px] font-normal"
                        placeholder="Search or upload a file..."
                    />

                    {/* Right side spacer or additional action if needed (keeping clear for now) */}
                </div>

                {/* Suggestions Section (Node 2099:29) */}
                <div className="w-full flex flex-col gap-4 mt-8">
                    <h2 className="text-[13px] font-medium text-[#6b7280] tracking-[-0.039px]">
                        Suggestions tailored just for you
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <SuggestionCard
                            title="Marketing leaders at startups and SaaS brands"
                            description="Marketing leaders and growth leaders at startups and SaaS companies in the US and Canada, Europe"
                            gradient="linear-gradient(135deg, #E0F2FE 0%, #bae6fd 50%, #a5b4fc 100%)"
                        />
                        <SuggestionCard
                            title="CEOs of US startups that have doubled their headcount"
                            description="Search for CEOs of US-based startups that have doubled their headcount in the last year"
                            gradient="linear-gradient(135deg, #ecfccb 0%, #dcfce7 50%, #bfdbfe 100%)"
                        />
                        <SuggestionCard
                            title="Software engineers at YC startups"
                            description="Software engineers and engineering managers at Y Combinator baked startups"
                            gradient="linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fca5a5 100%)"
                        />
                        <SuggestionCard
                            title="Finance people who joined a new firm within the past quarter"
                            description="Target finance professionals who joined a new firm in the past quarter"
                            gradient="linear-gradient(151deg, rgb(255, 238, 216) 31.13%, rgb(255, 215, 240) 67.68%, rgb(208, 178, 255) 100%)"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function SuggestionCard({ title, description, gradient }: { title: string, description: string, gradient: string }) {
    return (
        <button className="w-full h-[88px] bg-white border border-[#eef0f2] rounded-[12px] p-[12px] flex items-start gap-3 relative hover:border-gray-300 transition-colors text-left group overflow-visible">
            {/* Icon Box with Design Effect */}
            <div className="relative w-[24px] h-[24px] shrink-0">
                {/* Blur Effect Layer (Node 2099:39) */}
                <div
                    className="absolute -inset-1 blur-[12.5px] opacity-60 rounded-[6px]"
                    style={{
                        backgroundImage: gradient
                    }}
                />

                {/* Main Icon Content - Placeholder using same gradient for visual consistency or white/image */}
                <div className="relative w-full h-full rounded-[6px] shadow-sm overflow-hidden border border-[rgba(255,255,255,0.5)]">
                    <div
                        className="w-full h-full opacity-80"
                        style={{
                            backgroundImage: gradient
                        }}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-0.5 max-w-[calc(100%-60px)]">
                <h3 className="text-[14px] font-medium text-[#10161e] leading-[20px] line-clamp-1">
                    {title}
                </h3>
                <p className="text-[14px] text-[#6b7280] leading-[20px] line-clamp-2">
                    {description}
                </p>
            </div>

            {/* Arrow Button */}
            <div className="absolute right-[12px] bottom-[12px] w-[20px] h-[20px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={14} className="text-[#2d72f0]" strokeWidth={2.5} />
            </div>
        </button>
    );
}
