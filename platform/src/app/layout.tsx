import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
