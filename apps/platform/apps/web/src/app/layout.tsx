import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";


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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sourceSans.variable} antialiased h-screen w-full relative overflow-hidden`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
