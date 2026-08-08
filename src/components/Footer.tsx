import React, { useState } from 'react';
import { Linkedin, Github, Youtube, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { PrivacyTermsModal } from './PrivacyTermsModal';
import { useCMS } from '../hooks/useCMS';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);
  const { data: cmsData, loading } = useCMS();

  if (loading || !cmsData) return null;
  const siteConfig = cmsData.site;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-900">
          
          {/* Left Column: Brand & Tagline */}
          <div className="md:col-span-4 flex flex-col items-start">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#5B3DF5] to-[#38BDF8] text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg font-extrabold tracking-tight text-white">
                {siteConfig.name}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm mb-6">
              {siteConfig.tagline}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.socials?.github || 'https://github.com/orionforge'}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="p-2.5 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-[#5B3DF5] transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.socials?.linkedin || 'https://linkedin.com/company/orionforge'}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-2.5 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-[#38BDF8] transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.socials?.youtube || 'https://youtube.com/@orionforge'}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="p-2.5 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-red-600 transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Email"
                className="p-2.5 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-[#38BDF8] transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Center Column: Navigation */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider mb-4">
                Explore
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#about" className="hover:text-white transition-colors">About Orion Forge</a></li>
                <li><a href="#team" className="hover:text-white transition-colors">Team Members</a></li>
                <li><a href="#achievements" className="hover:text-white transition-colors">Achievements</a></li>
                <li><a href="#projects" className="hover:text-white transition-colors">Project Portfolio</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider mb-4">
                Ecosystem
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button onClick={() => onNavigate && onNavigate('/forge-vault')} className="hover:text-white transition-colors text-left">
                    Launch Forge Vault
                  </button>
                </li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Engineering</a></li>
              </ul>
            </div>
          </div>

          {/* Right Column: Newsletter Signup */}
          <div className="md:col-span-4 flex flex-col items-start">
            <h4 className="font-heading text-xs font-bold text-white uppercase tracking-wider mb-2">
              Stay Updated
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Subscribe to Orion Forge technical releases and paper announcements.
            </p>

            <form onSubmit={handleSubscribe} className="w-full space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-full bg-slate-900 border border-slate-800 px-4 py-2.5 pr-10 text-xs text-white placeholder-slate-500 focus:border-[#5B3DF5] focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#5B3DF5] text-white hover:bg-[#4A2CE2] transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              {subscribed && (
                <span className="text-[11px] font-semibold text-emerald-400">
                  ✓ Subscribed successfully!
                </span>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Orion Forge. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setModalType('privacy')} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setModalType('terms')} className="hover:text-slate-300 transition-colors">
              Terms of Service
            </button>
            <span className="text-slate-700">|</span>
            <span className="font-mono text-[11px]">v1.0.0-2026</span>
          </div>
        </div>

      </div>

      <PrivacyTermsModal
        isOpen={modalType !== null}
        type={modalType}
        onClose={() => setModalType(null)}
      />
    </footer>
  );
};
