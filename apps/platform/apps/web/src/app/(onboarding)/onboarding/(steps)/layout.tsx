import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen w-full bg-white lg:bg-[#111111]">
      {/* Left Empty Dark Area - Hidden on mobile */}
      <div className="hidden lg:block lg:w-[60%]" />

      {/* Right Panel with Content - Full width on mobile */}
      <div className="flex min-h-screen w-full lg:w-[40%] lg:p-2">
        <div className="relative flex min-h-full w-full flex-col overflow-hidden bg-white lg:rounded-lg">
          {/* Content Area */}
          <div className="flex flex-1 flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
