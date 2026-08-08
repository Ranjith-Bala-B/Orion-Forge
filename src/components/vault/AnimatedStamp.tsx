import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedStamp = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`pointer-events-none ${className}`}>
      {/* The Ink */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.1, type: "spring", stiffness: 400 }}
      >
        {children}
      </motion.div>

      {/* The Physical Stamp Tool */}
      <motion.div
        initial={{ y: -500, x: 300, opacity: 0, rotate: -45, scale: 2 }}
        animate={{ 
          y: [-500, 0, 0, -400], 
          x: [300, 0, 0, 300],
          opacity: [0, 1, 1, 0], 
          rotate: [-45, 0, 0, 45],
          scale: [2, 1, 1, 1.5]
        }}
        transition={{ duration: 1.2, times: [0, 0.25, 0.45, 1], ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        <svg width="220" height="220" viewBox="0 0 100 100" className="drop-shadow-2xl transform -translate-y-16 translate-x-4">
          <defs>
            {/* Glossy wood gradient for handle */}
            <linearGradient id="woodHandle" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A67B5B" />
              <stop offset="15%" stopColor="#FDEBC2" />
              <stop offset="40%" stopColor="#D4A373" />
              <stop offset="100%" stopColor="#5C3A21" />
            </linearGradient>
            
            {/* Linear wood gradient for base front */}
            <linearGradient id="woodBase" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4A373" />
              <stop offset="100%" stopColor="#8B5A2B" />
            </linearGradient>
          </defs>

          {/* Handle Bulb & Neck */}
          <path d="M 32 25 C 32 -2, 68 -2, 68 25 C 68 40, 58 45, 58 50 L 42 50 C 42 45, 32 40, 32 25 Z" fill="url(#woodHandle)" />
          
          {/* Base Top Bevel (Simulates 3D block top) */}
          <polygon points="20,50 80,50 85,55 15,55" fill="#E6C280" />
          
          {/* Base Front */}
          <rect x="15" y="55" width="70" height="15" fill="url(#woodBase)" />
          
          {/* Black Rubber Pad */}
          <rect x="15" y="70" width="70" height="8" fill="#1e293b" />
          
          {/* Red Ink Layer */}
          <rect x="16" y="78" width="68" height="3" rx="1.5" fill="#ef4444" />
        </svg>
      </motion.div>
    </div>
  );
};
