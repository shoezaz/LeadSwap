"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Search,
  Users,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@leadswap/utils";

interface ScanStage {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "pending" | "in_progress" | "completed" | "error";
  message?: string;
  data?: any;
}

interface MarketScanAnimationProps {
  stages: ScanStage[];
  currentStage: string;
  onComplete?: () => void;
}

const stageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  website: Globe,
  competitors: Search,
  social: Users,
  mentions: MessageSquare,
  recommendations: Sparkles,
};

export function MarketScanAnimation({
  stages,
  currentStage,
  onComplete,
}: MarketScanAnimationProps) {
  const [dots, setDots] = useState("");

  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Check if all complete
  useEffect(() => {
    if (stages.every((s) => s.status === "completed") && onComplete) {
      onComplete();
    }
  }, [stages, onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Animated Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 mb-4"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
            AI Deep Research
          </span>
        </motion.div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Analyzing Your Business
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
          Our AI is scanning your website and researching your market
        </p>
      </motion.div>

      {/* Stage List */}
      <div className="space-y-3">
        {stages.map((stage, index) => {
          const Icon = stageIcons[stage.id] || Globe;
          const isActive = stage.id === currentStage;
          const isComplete = stage.status === "completed";
          const isError = stage.status === "error";

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border-violet-200 dark:border-violet-800 shadow-lg shadow-violet-500/10"
                  : isComplete
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                    : isError
                      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                      : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 opacity-60"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                  isActive
                    ? "bg-violet-500 text-white"
                    : isComplete
                      ? "bg-green-500 text-white"
                      : isError
                        ? "bg-red-500 text-white"
                        : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500"
                )}
              >
                {isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-5 w-5" />
                  </motion.div>
                ) : isComplete ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </motion.div>
                ) : isError ? (
                  <AlertCircle className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "font-medium",
                      isActive
                        ? "text-violet-900 dark:text-violet-100"
                        : isComplete
                          ? "text-green-900 dark:text-green-100"
                          : "text-neutral-700 dark:text-neutral-300"
                    )}
                  >
                    {stage.label}
                  </span>
                  {isActive && (
                    <span className="text-violet-500 font-mono">{dots}</span>
                  )}
                </div>
                {stage.message && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "text-sm mt-1 truncate",
                      isActive
                        ? "text-violet-600 dark:text-violet-300"
                        : isComplete
                          ? "text-green-600 dark:text-green-300"
                          : "text-neutral-500"
                    )}
                  >
                    {stage.message}
                  </motion.p>
                )}
              </div>

              {/* Progress indicator for active stage */}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-b-xl"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 10, ease: "linear" }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Pulsing Orb Animation */}
      <div className="flex justify-center mt-8">
        <motion.div
          className="relative w-16 h-16"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 opacity-20 blur-xl" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 opacity-40 blur-lg" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 opacity-60 blur-md" />
          <div className="absolute inset-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
        </motion.div>
      </div>
    </div>
  );
}

// Thinking indicator component (SCIRA-style)
export function ThinkingIndicator({ message }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-violet-500"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
      {message && (
        <span className="text-sm text-neutral-600 dark:text-neutral-300">
          {message}
        </span>
      )}
    </motion.div>
  );
}

// Data streaming component
export function StreamingData({ items }: { items: string[] }) {
  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-neutral-600 dark:text-neutral-400 font-mono bg-neutral-100 dark:bg-neutral-800 px-3 py-2 rounded"
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

