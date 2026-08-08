import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Instagram, Download, ArrowRight, X } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { TeamMember } from '../types/team';
import { useCMS } from '../hooks/useCMS';
import { TeamSlideOver } from './TeamSlideOver';

export const TeamSection: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { data: cmsData, loading } = useCMS();
  
  if (loading || !cmsData) return null;
  const teamMembers = cmsData.team;

  return (
    <AnimatedSection id="team" className="py-24 bg-white relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5B3DF5]/20 bg-[#5B3DF5]/5 px-3.5 py-1.5 text-xs font-bold text-[#5B3DF5] mb-4">
            THE INNOVATORS
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Meet the Builders Behind <br /> <span className="text-[#5B3DF5]">Orion Forge</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            A specialized group of AI engineers, systems architects, and robotics researchers.
          </p>
        </div>

        {/* 2x2 Grid of Square Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="group relative rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(91,61,245,0.18)] hover:border-[#5B3DF5]/40 transition-all flex flex-col justify-between"
            >
              {/* Top Row: Square Photo + About Button */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="relative h-28 w-28 rounded-2xl overflow-hidden shadow-md flex-shrink-0 bg-slate-100 cursor-pointer">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    onClick={() => setPreviewImage(member.avatar)}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <button
                  onClick={() => setSelectedMember(member)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 hover:bg-[#5B3DF5] hover:text-white hover:border-[#5B3DF5] transition-all group/btn"
                >
                  <span>About</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Info Body */}
              <div className="mb-6">
                <h3 className="font-heading text-xl font-bold text-slate-900 group-hover:text-[#5B3DF5] transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-bold text-[#5B3DF5] uppercase tracking-wider mt-0.5">
                  {member.role}
                </p>
                <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                  {member.bio}
                </p>
              </div>

              {/* Social Icons & Download CV Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} LinkedIn`}
                    className="p-2 rounded-full text-slate-500 hover:text-[#5B3DF5] hover:bg-slate-100 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={member.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} GitHub`}
                    className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} Instagram`}
                    className="p-2 rounded-full text-slate-500 hover:text-[#38BDF8] hover:bg-slate-100 transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>

                <a
                  href={member.cvUrl}
                  download
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#5B3DF5] transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>CV</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Slide-Over Drawer */}
      <TeamSlideOver member={selectedMember} onClose={() => setSelectedMember(null)} onImageClick={setPreviewImage} />

      {previewImage && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
            <button className="absolute -top-12 right-0 text-white hover:text-slate-300 p-2" onClick={() => setPreviewImage(null)}>
              <X className="h-8 w-8" />
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </AnimatedSection>
  );
};
