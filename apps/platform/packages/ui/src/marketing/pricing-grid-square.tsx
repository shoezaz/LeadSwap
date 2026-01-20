"use client";

import { ReactNode } from "react";

/**
 * PricingGridSquare - Cliqo Design System
 * Square version of PricingGrid (no rounded corners)
 */

export interface PricingGridSquareProps {
    /** Pricing card children */
    children: ReactNode;
    /** CSS class for container */
    className?: string;
}

export function PricingGridSquare({ children, className }: PricingGridSquareProps) {
    return (
        <div
            className={
                className || "overflow-clip relative pt-0 pr-4 pb-0 pl-4 bg-neutral-950"
            }
        >
            {/* Removed rounded-2xl */}
            <div className="border-b border-l border-r ml-auto mr-auto relative border-neutral-800 max-w-[1080px] z-[0] overflow-hidden">
                <div className="overflow-x-hidden overflow-y-auto">
                    <div
                        className="grid overflow-hidden"
                        style={{ gridTemplateColumns: "repeat(4, minmax(0px, 1fr))" }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
