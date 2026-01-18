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
        className={`${sourceSans.variable} antialiased h-screen flex overflow-hidden bg-background`}
      >
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}

