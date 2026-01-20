"use client";

import { motion } from "motion/react";

export interface ScrollIndicatorProps {
    className?: string;
}

export function ScrollIndicator({ className }: ScrollIndicatorProps) {
    return (
        <motion.div
            className={`flex flex-col items-center gap-2 ${className || ""}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
        >
            <span className="text-xs text-neutral-500 uppercase tracking-wider">
                Scroll
            </span>
            <motion.div
                className="w-6 h-10 rounded-full border-2 border-neutral-600 flex items-start justify-center p-1.5"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
                <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-neutral-400"
                    animate={{ y: [0, 16, 0] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>
        </motion.div>
    );
}

// Simple bouncing arrow version
export function ScrollArrowIndicator({ className }: ScrollIndicatorProps) {
    return (
        <motion.div
            className={`flex flex-col items-center ${className || ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
        >
            <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-500"
                animate={{ y: [0, 8, 0] }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
            </motion.svg>
        </motion.div>
    );
}
