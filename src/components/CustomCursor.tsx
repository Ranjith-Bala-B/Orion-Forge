import React from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../hooks/useCursor';

export const CustomCursor: React.FC = () => {
  const { position, isPointer } = useCursor();

  return (
    <>
      {/* Main Cursor Dot */}
      <motion.div
        className="pointer-events-none fixed z-[9999] hidden lg:block rounded-full bg-[#5B3DF5]"
        animate={{
          x: position.x - (isPointer ? 12 : 6),
          y: position.y - (isPointer ? 12 : 6),
          width: isPointer ? 24 : 12,
          height: isPointer ? 24 : 12,
          opacity: 0.85,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.1 }}
      />
      {/* Outer Glow Halo */}
      <motion.div
        className="pointer-events-none fixed z-[9998] hidden lg:block rounded-full border border-[#38BDF8]/40 bg-[#38BDF8]/10 blur-[1px]"
        animate={{
          x: position.x - (isPointer ? 24 : 18),
          y: position.y - (isPointer ? 24 : 18),
          width: isPointer ? 48 : 36,
          height: isPointer ? 48 : 36,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, mass: 0.2 }}
      />
    </>
  );
};
