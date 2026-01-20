'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { TextShimmer } from './text-shimmer';

const SCAN_MESSAGES = [
  'Connecting to your website...',
  'Extracting business information...',
  'Analyzing your industry...',
  'Finding your competitors...',
  'Researching social presence...',
  'Generating recommendations...',
];

interface ScanningAnimationProps {
  isScanning: boolean;
}

export function ScanningAnimation({ isScanning }: ScanningAnimationProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (!isScanning) {
      setCurrentMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % SCAN_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isScanning]);

  const currentMessage = SCAN_MESSAGES[currentMessageIndex];

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-white">
      {/* Dots Pattern Background with Radial Mask */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/dots-pattern.png)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          maskImage: 'radial-gradient(ellipse 50% 40% at 50% 50%, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 50% 40% at 50% 50%, black 0%, transparent 70%)',
        }}
      />

      {/* Content - Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 text-center">
        {/* Spinner */}
        <motion.div
          className="h-4 w-4 rounded-full border-2 border-neutral-300 border-t-neutral-900"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Single Transforming Text */}
        <div className="h-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <TextShimmer className="text-sm text-neutral-500">
                {currentMessage}
              </TextShimmer>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
