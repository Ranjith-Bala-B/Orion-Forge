import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Calendar, Download, Users, FileText, Maximize2 } from 'lucide-react';
import { Achievement } from '../types/achievement';

interface AchievementModalProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, onClose }) => {
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-[#38BDF8]" />
              <span className="font-heading text-xs font-bold tracking-widest uppercase text-slate-300">
                ACHIEVEMENT DETAILS
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Title & Badge */}
            <div>
              <span className="inline-block text-xs font-extrabold text-[#5B3DF5] bg-[#5B3DF5]/10 px-3 py-1 rounded-full mb-2">
                {achievement.badge}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900">
                {achievement.title}
              </h2>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-2">
                <span>{achievement.event}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#38BDF8]" />
                  <span>{achievement.date}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Overview</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {achievement.fullDescription}
              </p>
            </div>

            {/* Certificates Collage */}
            {(() => {
              const images = achievement.gallery && achievement.gallery.length > 0 
                ? achievement.gallery 
                : (achievement.certificatePreview ? [achievement.certificatePreview] : []);

              if (images.length === 0) return null;

              return (
                <div>
                  <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#5B3DF5]" />
                    {images.length > 1 ? 'Official Certificates' : 'Official Certificate Preview'}
                  </h3>
                  
                  <div className={
                    images.length > 2 
                      ? "flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory"
                      : `grid gap-3 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`
                  } style={images.length > 2 ? { scrollbarWidth: 'thin' } : {}}>
                    {images.map((img, idx) => {
                      const isScrollable = images.length > 2;
                      const isFirstFull = !isScrollable && images.length % 2 !== 0 && idx === 0;
                      
                      return (
                        <div 
                          key={idx} 
                          className={`relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 group shrink-0 ${isScrollable ? 'w-72 h-52 snap-center' : (isFirstFull ? 'col-span-2 h-64' : 'h-48')}`}
                        >
                          <img
                            src={img}
                            alt={`Certificate ${idx + 1}`}
                            onClick={() => setFullScreenImage(img)}
                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="text-xs font-medium text-slate-200">Official Document</span>
                            <div className="flex items-center gap-2 pointer-events-auto">
                              <button
                                onClick={() => setFullScreenImage(img)}
                                className="flex items-center justify-center h-7 w-7 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-[#5B3DF5] transition-colors"
                                title="View Full Screen"
                              >
                                <Maximize2 className="h-3 w-3" />
                              </button>
                              <a
                                href={img}
                                download={`certificate-${idx + 1}.png`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold text-white hover:bg-[#5B3DF5] transition-colors"
                              >
                                <Download className="h-3 w-3" />
                                <span>Download</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Team Members Involved */}
            <div>
              <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-[#38BDF8]" />
                Contributors
              </h3>
              <div className="flex flex-wrap gap-2">
                {achievement.teamMembers.map((member) => (
                  <span
                    key={member}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-slate-100 border border-slate-200 text-slate-800"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Full Screen Image Viewer */}
      <AnimatePresence>
        {fullScreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4 sm:p-8"
            onClick={() => setFullScreenImage(null)}
          >
            <button
              onClick={() => setFullScreenImage(null)}
              className="absolute top-6 right-6 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/30 transition-colors z-50"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              src={fullScreenImage}
              alt="Full Screen Certificate"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};
