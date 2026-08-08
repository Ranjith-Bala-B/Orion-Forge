import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Trophy, Award, BookOpen, Users } from 'lucide-react';
import { cmsService } from '../services/cmsService';
import { useCountUp } from '../hooks/useCountUp';
import { useCMS } from '../hooks/useCMS';
import { StatItem } from '../types/stat';

const iconMap: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="h-6 w-6 text-[#38BDF8]" />,
  Trophy: <Trophy className="h-6 w-6 text-[#5B3DF5]" />,
  Award: <Award className="h-6 w-6 text-[#38BDF8]" />,
  BookOpen: <BookOpen className="h-6 w-6 text-[#5B3DF5]" />,
  Users: <Users className="h-6 w-6 text-[#38BDF8]" />,
};

interface StatCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  description: string;
  iconName: string;
  inView: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix,
  description,
  iconName,
  inView,
}) => {
  const stringValue = String(value);
  const match = stringValue.match(/^(\d+(?:\.\d+)?)(.*)$/);
  
  const numValue = match ? parseFloat(match[1]) : NaN;
  const explicitSuffix = match ? match[2] : '';
  const isNumber = !isNaN(numValue);
  
  const animatedValue = useCountUp(isNumber ? numValue : 0, 2000, inView);
  const finalSuffix = explicitSuffix;

  return (
    <div className="relative group p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(91,61,245,0.15)] hover:border-[#5B3DF5]/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 group-hover:bg-[#5B3DF5]/10 transition-colors">
          {iconMap[iconName]}
        </div>
        <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">VERIFIED</span>
      </div>

      <div className="flex items-baseline gap-1 font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 mb-1">
        {isNumber ? (
          <>
            <span>{animatedValue}</span>
            <span className="text-[#5B3DF5]">{finalSuffix}</span>
          </>
        ) : (
          <span>{stringValue}</span>
        )}
      </div>

      <h3 className="font-heading text-sm font-bold text-slate-800 mb-1">{label}</h3>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
};

export const StatsSection = () => {
  const { data: cmsData, loading } = useCMS();
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  if (loading || !cmsData) return null;
  const statsData = cmsData.stats;

  return (
    <section ref={sectionRef} className="py-16 bg-[#FAFBFC] relative z-10 border-y border-slate-200/60">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold tracking-widest text-[#5B3DF5] uppercase">
            ORION FORGE AT A GLANCE
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Proven Track Record in Innovation
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {statsData.map((stat: StatItem, index: number) => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              description={stat.description}
              iconName={stat.iconName}
              inView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
