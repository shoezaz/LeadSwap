import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LeadSwap Platform",
  description: "LeadSwap Web Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans.variable} antialiased h-screen w-full relative overflow-hidden`}
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgb(244, 244, 245) 0%, rgb(244, 244, 245) 100%), linear-gradient(90deg, rgb(248, 249, 250) 0%, rgb(248, 249, 250) 100%)",
        }}
      >
        {/* Sidebar - Nav - expanded sidebar → List (Node 2109:106) */}
        <div className="absolute bg-[#f4f4f5] bottom-0 left-0 overflow-clip top-0 w-[232px]">
          <Sidebar />
          {/* Horizontal Divider (Node 2109:304) */}
          <div className="absolute border-[#eef0f2] border-solid border-t h-px left-0 right-0 top-[1119px]" />
        </div>

        {/* Top Header - Background+Shadow (Node 2109:317) */}
        <div className="absolute bg-white h-[48px] left-[232px] overflow-clip right-0 rounded-tl-[8px] top-[8px]">
          {/* Button dialog placeholder (Node 2109:323) - positioned at right */}
          <div className="absolute right-[120px] rounded-[6px] size-[28px] top-1/2 -translate-y-1/2">
            {/* Img - Start button icon placeholder */}
          </div>
          {/* Inset shadow overlay */}
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(25,34,46,0.03),inset_0px_1px_2px_0px_rgba(25,34,46,0.06),inset_0px_0px_2px_0px_rgba(25,34,46,0.08)]" />
        </div>

        {/* Main Content Area - Background (Node 2109:70) */}
        <div className="absolute bg-[#f4f4f5] inset-[56px_0_0_232px] overflow-auto">
          {/* Background+Shadow (Node 2109:71) */}
          <div className="absolute bg-white inset-[-4px_0_8px_0] overflow-clip rounded-bl-[8px]">
            {/* Container (Node 2109:72) - Children go here */}
            <div className="absolute inset-[4px_1px_1px_1px] overflow-auto">
              {children}
            </div>
            {/* Inset shadow overlay */}
            <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_0px_0px_1px_rgba(25,34,46,0.03),inset_0px_1px_2px_0px_rgba(25,34,46,0.06),inset_0px_0px_2px_0px_rgba(25,34,46,0.08)]" />
          </div>
        </div>
      </body>
    </html>
  );
}
