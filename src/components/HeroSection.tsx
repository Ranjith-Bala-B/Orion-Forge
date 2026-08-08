import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Terminal, Cpu, ShieldCheck } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';

interface HeroSectionProps {
  onNavigateToVault?: () => void;
}

export const HeroSection = ({ onNavigateToVault }: { onNavigateToVault?: () => void }) => {
  const { data: cmsData, loading } = useCMS();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 3D Canvas Particle Sphere Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const numParticles = 70;
    const particles: { x: number; y: number; z: number; radius: number; color: string; speedX: number; speedY: number }[] = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 0.8,
        y: (Math.random() - 0.5) * height * 0.8,
        z: Math.random() * width * 0.5,
        radius: Math.random() * 2.5 + 1.5,
        color: i % 2 === 0 ? '#5B3DF5' : '#38BDF8',
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
      });
    }

    let angleX = 0.003;
    let angleY = 0.005;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw outer ambient ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.32, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(91, 61, 245, 0.08)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Render 3D particles & connecting wireframe lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 3D Rotation Math
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);

        const y1 = p.y * cosX - p.z * sinX;
        const z1 = p.z * cosX + p.y * sinX;
        const x1 = p.x * cosY + z1 * sinY;
        const z2 = z1 * cosY - p.x * sinY;

        p.x = x1;
        p.y = y1;
        p.z = z2;

        const fov = 350;
        const scale = fov / (fov + p.z);
        const projX = centerX + p.x * scale;
        const projY = centerY + p.y * scale;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(1, p.radius * scale), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, Math.max(0.2, scale - 0.3));
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();

        // Connect nearby nodes with subtle lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dz = p.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 100) {
            const scale2 = fov / (fov + p2.z);
            const projX2 = centerX + p2.x * scale2;
            const projY2 = centerY + p2.y * scale2;

            ctx.beginPath();
            ctx.moveTo(projX, projY);
            ctx.lineTo(projX2, projY2);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 100) * 0.25;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (loading || !cmsData) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"><div className="animate-pulse flex flex-col items-center"><div className="h-12 w-12 rounded-2xl bg-blue-100 mb-4"></div><div className="h-4 w-32 bg-slate-200 rounded"></div></div></div>;
  }
  
  const siteConfig = cmsData.site;

  return (
    <section className="relative min-h-[92vh] pt-32 pb-20 flex items-center justify-center overflow-hidden bg-[#FAFBFC]">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* Floating Gradient Ambient Circles */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-tr from-[#5B3DF5]/20 to-[#38BDF8]/20 blur-3xl opacity-60 animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-[#38BDF8]/20 to-[#5B3DF5]/10 blur-3xl opacity-50 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="lg:col-span-7 flex flex-col items-start z-10"
        >
          {/* Innovation Lab Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#5B3DF5]/20 bg-[#5B3DF5]/5 px-3.5 py-1.5 text-xs font-bold text-[#5B3DF5] mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>{siteConfig.hero.badge}</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6">
            <span className="block text-slate-900">{siteConfig.hero.titleLine1}</span>
            <span className="bg-gradient-to-r from-[#5B3DF5] via-[#4A2CE2] to-[#38BDF8] bg-clip-text text-transparent block">
              {siteConfig.hero.titleLine2} {siteConfig.hero.titleLine3}
            </span>
            <span className="block text-slate-900">{siteConfig.hero.titleLine4}</span>
          </h1>

          {/* Subtitle intro */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mb-8">
            {siteConfig.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateToVault}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#5B3DF5] to-[#38BDF8] px-8 py-4 text-base font-bold text-white shadow-[0_8px_30px_rgba(91,61,245,0.35)] hover:shadow-[0_12px_35px_rgba(56,189,248,0.5)] active:scale-98 transition-all duration-300"
            >
              <span>{siteConfig.hero.primaryCtaText}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </button>

            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/80 backdrop-blur-md px-6 py-4 text-sm font-semibold text-slate-700 hover:border-[#5B3DF5] hover:text-[#5B3DF5] transition-all duration-200"
            >
              Explore Mission ↓
            </a>
          </div>

          {/* Mini Feature Chips */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500 border-t border-slate-200/80 pt-6 w-full">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#5B3DF5]" />
              <span>Edge AI Neural Engines</span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-[#38BDF8]" />
              <span>Full Stack Systems</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#5B3DF5]" />
              <span>Defense & Robotics Research</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side 3D Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-5 relative flex items-center justify-center min-h-[420px]"
        >
          {siteConfig.hero.coreGraphicImage ? (
            <div className="relative w-full aspect-square max-w-[480px] rounded-3xl shadow-[0_20px_50px_rgba(91,61,245,0.12)] flex items-center justify-center overflow-hidden animate-float">
              <img src={siteConfig.hero.coreGraphicImage} alt="Hero Graphic Logo" className="w-full h-full object-cover rounded-3xl hover:scale-105 transition-transform duration-500" />
            </div>
          ) : (
            <div className="relative w-full aspect-square max-w-[480px] rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 p-6 shadow-[0_20px_50px_rgba(91,61,245,0.12)] flex items-center justify-center overflow-hidden animate-float">
              <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
              
              <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center rounded-2xl bg-white/80 backdrop-blur-md border border-slate-100 shadow-xl">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#5B3DF5] to-[#38BDF8] flex items-center justify-center text-white mb-3 shadow-lg">
                  <Cpu className="h-6 w-6 animate-pulse" />
                </div>
                <span className="font-heading text-xs font-bold tracking-widest text-slate-900 uppercase">
                  ORION NEURAL CORE v1.0
                </span>
                <span className="text-[10px] font-medium text-slate-500 mt-1">
                  Real-Time Autonomous Telemetry
                </span>
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};
