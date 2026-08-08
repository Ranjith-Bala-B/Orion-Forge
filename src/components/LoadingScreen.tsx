import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 1200);
    const timer3 = setTimeout(() => {
      setIsFinished(true);
      if (onComplete) onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden pointer-events-none">
          {/* Left Door */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#FAFBFC] pointer-events-auto"
          />
          {/* Right Door */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: "100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
            className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#FAFBFC] pointer-events-auto"
          />

          <motion.div 
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4, ease: 'easeInOut' } }}
            className="relative z-10 flex flex-col items-center pointer-events-auto"
          >
            {/* Outer Pulsing Glow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -inset-8 rounded-full bg-gradient-to-r from-[#5B3DF5] to-[#38BDF8] blur-2xl opacity-20"
            />

            {/* Forge Emblem SVG */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5B3DF5] to-[#38BDF8] p-4 shadow-[0_0_40px_rgba(91,61,245,0.5)]"
            >
              <svg className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </motion.div>

            {/* Typewriter Header */}
            <div className="mt-8 h-8 text-center">
              {stage >= 1 && (
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-heading text-2xl font-bold tracking-wider text-[#111827]"
                >
                  Welcome to Orion Forge
                </motion.h1>
              )}
            </div>


          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
