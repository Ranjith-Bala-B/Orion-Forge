import React from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, Award, Lightbulb, CheckCircle2, ChevronRight } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { useCMS } from '../hooks/useCMS';

export const AboutSection: React.FC = () => {
  const { data: cmsData, loading } = useCMS();
  
  if (loading || !cmsData) return null;
  const siteConfig = cmsData.site;
  return (
    <AnimatedSection id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-[#38BDF8]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-[#5B3DF5]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5B3DF5]/20 bg-[#5B3DF5]/5 px-3.5 py-1.5 text-xs font-bold text-[#5B3DF5] mb-4">
            ABOUT ORION FORGE
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Where Pioneering AI Meets <span className="text-[#5B3DF5]">Real-World Impact</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Founded by researchers and engineers passionate about pushing the boundaries of artificial intelligence, autonomous robotics, and edge systems.
          </p>
        </div>

        {/* Split Screen Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Innovation Visual */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 group">
              <img
                src={siteConfig.about?.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'}
                alt="Orion Forge Innovation Lab Collaboration"
                className="w-full h-80 object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                <span className="text-xs font-semibold tracking-wider text-[#38BDF8] uppercase mb-1">
                  RESEARCH & DEVELOPMENT
                </span>
                <h3 className="font-heading text-xl font-bold text-white">
                  Collaborative Engineering Ecosystem
                </h3>
                <p className="text-xs text-slate-300 mt-2">
                  Building open, modular, and high-performance intelligent software.
                </p>
              </div>
            </div>

            {/* Core Values Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#FAFBFC] border border-slate-200/80 shadow-sm hover:border-[#5B3DF5]/30 transition-colors">
                <Target className="h-6 w-6 text-[#5B3DF5] mb-2" />
                <h4 className="font-heading text-sm font-bold text-slate-900">Mission</h4>
                <p className="text-xs text-slate-600 mt-1">Deploying zero-latency AI systems for mission-critical operations.</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#FAFBFC] border border-slate-200/80 shadow-sm hover:border-[#38BDF8]/30 transition-colors">
                <Compass className="h-6 w-6 text-[#38BDF8] mb-2" />
                <h4 className="font-heading text-sm font-bold text-slate-900">Vision</h4>
                <p className="text-xs text-slate-600 mt-1">Empowering humanity through reliable, autonomous intelligence.</p>
              </div>
            </div>
          </div>

          {/* Right Side: Who We Are & Timeline */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="p-8 rounded-3xl bg-[#FAFBFC] border border-slate-200/80 shadow-sm">
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[#5B3DF5]" />
                Who We Are
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Orion Forge is a technology-driven team that turns bold ideas into working solutions. We combine AI, Data Science, Computer Vision, and Software Engineering to tackle real-world problems through rapid prototyping, experimentation, and collaborative innovation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#5B3DF5]" />
                  <span>AI & Machine Learning Solutions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#38BDF8]" />
                  <span>Real-Time Computer Vision Systems</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#5B3DF5]" />
                  <span>Data-Driven Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#38BDF8]" />
                  <span>Intelligent Software Platforms</span>
                </div>
              </div>
            </div>

            {/* Interactive Timeline */}
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-[#38BDF8]" />
                Journey & Milestones
              </h3>

              <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                {cmsData.timeline.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    {/* Timeline Node Icon */}
                    <div className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-white ${
                      item.highlight ? 'bg-[#5B3DF5] ring-4 ring-[#5B3DF5]/20' : 'bg-slate-400'
                    }`} />

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm group-hover:border-[#5B3DF5]/40 transition-all">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-heading text-xs font-extrabold text-[#5B3DF5] tracking-wider uppercase">
                          {item.year}
                        </span>
                        {item.tag && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <h4 className="font-heading text-base font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 mb-2">
                        {item.subtitle}
                      </p>
                      <p className="text-xs text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </AnimatedSection>
  );
};
