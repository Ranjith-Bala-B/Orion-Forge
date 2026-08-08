import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Github, ExternalLink, Code2 } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { Project } from '../types/project';
import { useCMS } from '../hooks/useCMS';
import { ProjectModal } from './ProjectModal';

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { data: cmsData, loading } = useCMS();
  
  if (loading || !cmsData) return null;
  const projectsData = cmsData.projects;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -420 : 420;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <AnimatedSection id="projects" className="py-24 bg-white relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header with Arrow Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#5B3DF5]/20 bg-[#5B3DF5]/5 px-3.5 py-1.5 text-xs font-bold text-[#5B3DF5] mb-4">
              PROJECT PORTFOLIO
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Featured <span className="text-[#5B3DF5]">Innovations & Systems</span>
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Swipe or use navigation controls to explore our high-impact AI models and systems.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll Carousel Left"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-[#5B3DF5] hover:text-[#5B3DF5] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll Carousel Right"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-[#5B3DF5] hover:text-[#5B3DF5] transition-colors"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Snap Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 scrollbar-none scroll-smooth"
        >
          {projectsData.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -8 }}
              className="snap-start flex-shrink-0 w-[340px] sm:w-[400px] rounded-3xl bg-white border border-slate-200/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(91,61,245,0.18)] hover:border-[#5B3DF5]/40 transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Image */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-[11px] font-extrabold bg-slate-900/80 text-[#38BDF8] backdrop-blur-md rounded-full border border-white/20">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading text-xl font-bold text-slate-900 group-hover:text-[#5B3DF5] transition-colors mb-2">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 mb-4">
                    {project.shortDescription}
                  </p>

                  {/* Tech stack tags preview */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span key={tech} className="px-2.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={project.links.repository}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#5B3DF5] hover:text-[#4A2CE2] transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </AnimatedSection>
  );
};
