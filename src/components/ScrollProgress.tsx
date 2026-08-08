import React from 'react';
import { useNavbar } from '../hooks/useNavbar';

export const ScrollProgress: React.FC = () => {
  const { scrollProgress } = useNavbar();

  return (
    <div className="fixed top-0 left-0 right-0 z-[9990] h-[3px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#5B3DF5] via-[#38BDF8] to-[#5B3DF5] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(56,189,248,0.7)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
