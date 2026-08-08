import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, FileText, Video, Layers, Cpu, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col my-auto"
        >
          {/* Top Banner */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
            <img
              src={project.coverImage}
              alt={project.name}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 sm:p-8 flex flex-col justify-end">
              <span className="text-xs font-bold text-[#38BDF8] uppercase tracking-wider mb-1">
                {project.category}
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-white">
                {project.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur-md hover:bg-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
            
            {/* Quick Action Links Bar */}
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <a
                href={project.links.repository}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-[#5B3DF5] transition-colors"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Repository</span>
              </a>
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#5B3DF5] text-white text-xs font-bold hover:bg-[#4A2CE2] transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Live Demo</span>
                </a>
              )}
              {project.links.ppt && (
                <a
                  href={project.links.ppt}
                  download
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  <FileText className="h-4 w-4 text-[#5B3DF5]" />
                  <span>Download Deck (PPT)</span>
                </a>
              )}
              {project.gallery && project.gallery.length > 0 && (
                <button
                  onClick={() => galleryRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  <ImageIcon className="h-4 w-4 text-[#38BDF8]" />
                  <span>View Gallery</span>
                </button>
              )}
            </div>

            {/* Problem & Solution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100">
                <h3 className="font-heading text-xs font-bold text-red-900 uppercase tracking-wider mb-2">Problem Statement</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{project.problemStatement}</p>
              </div>
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                <h3 className="font-heading text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">Proposed Solution</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{project.solution}</p>
              </div>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Key Capabilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <CheckCircle2 className="h-4 w-4 text-[#5B3DF5] mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-800">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack */}
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#38BDF8]" />
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-white border border-slate-200 shadow-sm text-slate-900">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Architecture Diagram */}
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#5B3DF5]" />
                Architecture Overview
              </h3>
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                <img
                  src={project.architectureDiagram}
                  alt="Architecture Diagram"
                  onClick={() => setPreviewImage(project.architectureDiagram)}
                  className="w-full h-56 object-cover opacity-90 cursor-pointer hover:opacity-100 transition-opacity"
                />
              </div>
            </div>

            {/* Results & Impact */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#5B3DF5]/10 to-[#38BDF8]/10 border border-[#5B3DF5]/20">
              <h3 className="font-heading text-xs font-bold text-[#5B3DF5] uppercase tracking-wider mb-2">Results & Operational Impact</h3>
              <p className="text-xs font-medium text-slate-800 leading-relaxed">
                {project.resultsImpact}
              </p>
            </div>

            {/* Gallery Images */}
            {project.gallery && project.gallery.length > 0 && (
              <div ref={galleryRef} className="pt-4 border-t border-slate-100">
                <h3 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-[#5B3DF5]" />
                  Project Gallery
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.gallery.map((imgSrc, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video">
                      <img src={imgSrc} alt={`Gallery image ${idx + 1}`} onClick={() => setPreviewImage(imgSrc)} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center">
            <button className="absolute -top-12 right-0 text-white hover:text-slate-300 p-2" onClick={() => setPreviewImage(null)}>
              <X className="h-8 w-8" />
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
