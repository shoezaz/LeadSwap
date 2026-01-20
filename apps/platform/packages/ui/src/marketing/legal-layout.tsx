"use client";

import { ReactNode } from "react";
import { cn } from "@leadswap/utils";

interface TableOfContentsItem {
    id: string;
    title: string;
}

interface LegalLayoutProps {
    title: string;
    children: ReactNode;
    tableOfContents?: TableOfContentsItem[];
    className?: string;
}

export function LegalLayout({
    title,
    children,
    tableOfContents,
    className,
}: LegalLayoutProps) {
    return (
        <div className={cn("bg-white", className)}>
            {/* Grid Header */}
            <div className="grid-section relative overflow-clip border-b border-neutral-200 px-4">
                <div className="relative z-0 mx-auto max-w-6xl border-neutral-200">
                    <div className="pointer-events-none absolute inset-0 border-x border-neutral-200 [mask-image:linear-gradient(transparent,black)]" />
                    <div className="relative mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
                        <h1 className="mt-5 text-center font-display text-4xl font-medium text-neutral-900 sm:text-5xl sm:leading-[1.15]">
                            {title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid-section relative overflow-clip border-b border-neutral-200 px-4">
                <div className="relative z-0 mx-auto max-w-6xl border-x border-neutral-200">
                    <div className="relative grid grid-cols-4 gap-10 bg-white p-8 sm:p-12 lg:gap-20">
                        {/* Main Content */}
                        <div className="col-span-4 md:col-span-3">
                            <article className="prose prose-neutral max-w-none transition-all prose-headings:relative prose-headings:scroll-mt-20 prose-headings:font-display prose-a:font-medium prose-a:text-neutral-500 prose-a:underline-offset-4 hover:prose-a:text-black prose-thead:text-lg">
                                {children}
                            </article>
                        </div>

                        {/* Table of Contents Sidebar */}
                        {tableOfContents && tableOfContents.length > 0 && (
                            <div className="hidden md:block">
                                <div className="sticky top-20 flex-col">
                                    <p className="-ml-0.5 flex items-center gap-1.5 text-sm text-neutral-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-4 w-4"
                                        >
                                            <line x1="21" x2="3" y1="6" y2="6" />
                                            <line x1="15" x2="3" y1="12" y2="12" />
                                            <line x1="17" x2="3" y1="18" y2="18" />
                                        </svg>
                                        On this page
                                    </p>
                                    <div className="mt-4 grid gap-4 border-l-2 border-neutral-200">
                                        {tableOfContents.map((item) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                className="relative -ml-0.5 pl-4"
                                            >
                                                <p className="text-sm text-neutral-500 transition-colors hover:text-black">
                                                    {item.title}
                                                </p>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface LegalSectionProps {
    id: string;
    number: number;
    title: string;
    children: ReactNode;
    isLast?: boolean;
}

export function LegalSection({
    id,
    number,
    title,
    children,
    isLast = false,
}: LegalSectionProps) {
    return (
        <div className="relative">
            {!isLast && (
                <div className="absolute bottom-0 left-4 top-0 w-px bg-neutral-300" />
            )}
            <div className="not-prose">
                <a
                    href={`#${id}`}
                    className="group relative flex items-center gap-4 py-0"
                >
                    <div className="flex size-8 flex-none items-center justify-center rounded-full border border-neutral-200 bg-white">
                        <p className="font-display font-bold text-neutral-700 group-hover:hidden">
                            {number}
                        </p>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="hidden size-4 text-neutral-600 group-hover:block"
                        >
                            <path d="M9 17H7A5 5 0 0 1 7 7h2" />
                            <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
                            <line x1="8" x2="16" y1="12" y2="12" />
                        </svg>
                    </div>
                    <h2
                        className="!m-0 scroll-mt-20 font-display text-xl font-medium text-neutral-800"
                        id={id}
                    >
                        {title}
                    </h2>
                </a>
            </div>
            <div className="ml-12 pb-4">{children}</div>
        </div>
    );
}
