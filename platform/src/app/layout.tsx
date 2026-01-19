import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google"; // Import Source Sans 3
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
        className={`${sourceSans.variable} antialiased h-screen w-full flex overflow-hidden bg-[#f4f4f5]`}
      >
        <Sidebar />
        <main className="flex-1 relative">
          {/* Top Bar Container matching Node 2109:317 */}
          <div className="absolute top-[8px] left-0 right-0 h-[48px] bg-white rounded-tl-[8px] overflow-hidden shadow-[inset_0px_0px_0px_1px_rgba(25,34,46,0.03),inset_0px_1px_2px_0px_rgba(25,34,46,0.06),inset_0px_0px_2px_0px_rgba(25,34,46,0.08)]">
            {/* Header Content Placeholder */}
          </div>

          {/* Main Content Area - Below header */}
          <div className="absolute top-[56px] left-0 right-0 bottom-0 overflow-hidden flex flex-col">
            <div className="flex-1 h-full w-full overflow-auto relative">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

