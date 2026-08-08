import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Linkedin, Github, Instagram, Download, Mail, Phone, ExternalLink, Code2 } from 'lucide-react';
import { TeamMember } from '../types/team';

interface TeamSlideOverProps {
  member: TeamMember | null;
  onClose: () => void;
  onImageClick?: (imageUrl: string) => void;
}

export const TeamSlideOver: React.FC<TeamSlideOverProps> = ({ member, onClose, onImageClick }) => {
  if (!member) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex justify-end">
        {/* Backdrop Blur Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Right Slide-Over Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-w-xl bg-white shadow-2xl overflow-y-auto flex flex-col h-full border-l border-slate-200"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between bg-white/90 backdrop-blur-md px-6 py-4 border-b border-slate-200">
            <span className="font-heading text-xs font-bold uppercase tracking-wider text-[#5B3DF5]">
              MEMBER PROFILE
            </span>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 flex-1 space-y-8">
            {/* Top Photo & Identity */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="relative h-28 w-28 rounded-2xl overflow-hidden shadow-lg border-2 border-slate-100 flex-shrink-0 cursor-pointer">
                <img
                  src={member.avatar}
                  alt={member.name}
                  onClick={() => onImageClick?.(member.avatar)}
                  className="h-full w-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-2xl font-extrabold text-slate-900">{member.name}</h2>
                <p className="text-sm font-semibold text-[#5B3DF5] mt-1">{member.role}</p>

                {/* Social Links Row */}
                <div className="flex items-center gap-3 mt-4">
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-[#5B3DF5] hover:text-white transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={member.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-colors"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-[#38BDF8] hover:text-white transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href={member.cvUrl}
                    download
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5B3DF5]/10 text-xs font-bold text-[#5B3DF5] hover:bg-[#5B3DF5] hover:text-white transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download CV</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Detailed About */}
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">About</h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {member.detailedAbout}
              </p>
            </div>

            {/* Technical Skills */}
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Core Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs font-semibold rounded-full bg-white border border-slate-200 text-slate-800 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Achievements & Highlights */}
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Highlights</h3>
              <ul className="space-y-2">
                {member.experience.map((exp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5B3DF5] mt-1.5 flex-shrink-0" />
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured Work */}
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Code2 className="h-4 w-4 text-[#5B3DF5]" />
                Featured Projects
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.projects.map((proj) => (
                  <span key={proj} className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-800">
                    {proj}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Direct */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail className="h-4 w-4 text-[#5B3DF5]" />
                <a href={`mailto:${member.email}`} className="hover:underline">{member.email}</a>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone className="h-4 w-4 text-[#38BDF8]" />
                <span>{member.phone}</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
