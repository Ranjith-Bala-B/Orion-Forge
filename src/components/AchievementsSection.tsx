import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Calendar } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';
import { Achievement } from '../types/achievement';
import { AchievementModal } from './AchievementModal';

export const AchievementsSection: React.FC = () => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const { data: cmsData, loading } = useCMS();

  if (loading || !cmsData) return null;
  const achievementsData = cmsData.achievements;

  return (
    <section id="achievements" className="py-24 bg-[#FAFBFC] relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5B3DF5]/20 bg-[#5B3DF5]/5 px-3.5 py-1.5 text-xs font-bold text-[#5B3DF5] mb-4">
            ACHIEVEMENTS OF ORION FORGE
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Recognized for <span className="text-[#5B3DF5]">Technical Excellence</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Scroll down to explore our top Hackathon Victories, Proud Moments, and Industry Awards.
          </p>
        </div>

        {/* Stacked Cards Container */}
        <div className="relative space-y-12 max-w-5xl mx-auto">
          {achievementsData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                top: `${index * 24}px`,
              }}
              className="sticky top-28 rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:shadow-[0_25px_60px_rgba(91,61,245,0.12)] transition-shadow duration-300"
            >
              {/* Left Side Large Image */}
              <div className="lg:col-span-6 relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-lg bg-slate-900 group">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-extrabold bg-[#5B3DF5] text-white rounded-full shadow-md">
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Right Side Content */}
              <div className="lg:col-span-6 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#5B3DF5] uppercase tracking-wider mb-2">
                    <Trophy className="h-4 w-4" />
                    <span>{item.event}</span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-3">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4">
                    <Calendar className="h-3.5 w-3.5 text-[#38BDF8]" />
                    <span>{item.date}</span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* View Details Button */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedAchievement(item)}
                    className="group inline-flex items-center gap-2 text-sm font-bold text-[#5B3DF5] hover:text-[#4A2CE2] transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Details Modal */}
      <AchievementModal
        achievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
    </section>
  );
};
