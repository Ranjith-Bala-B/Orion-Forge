import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { useNavbar } from '../hooks/useNavbar';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { NAV_ITEMS, ROUTES } from '../constants/routes';
import { cmsService } from '../services/cmsService';
import { useCMS } from '../hooks/useCMS';

interface DynamicIslandNavProps {
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export const DynamicIslandNav: React.FC<DynamicIslandNavProps> = ({
  onNavigate,
  currentPath = '/',
}) => {
  const { data: cmsData, loading } = useCMS();
  const { isScrolled } = useNavbar(120);
  const activeSection = useScrollSpy(['about', 'team', 'achievements', 'projects', 'contact']);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading || !cmsData) return null;
  const siteConfig = cmsData.site;

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (currentPath !== ROUTES.HOME) {
      if (onNavigate) onNavigate(ROUTES.HOME);
      setTimeout(() => {
        const element = document.querySelector(href);
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVaultClick = () => {
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(ROUTES.FORGE_VAULT);
  };

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(ROUTES.HOME);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-[900] flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          scale: isScrolled ? 0.95 : 1,
          width: isScrolled ? '90%' : '95%',
          maxWidth: isScrolled ? '920px' : '1080px',
        }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="pointer-events-auto relative flex items-center justify-between rounded-full bg-white/80 backdrop-blur-xl border border-slate-200/80 px-4 py-2.5 shadow-[0_8px_32px_0_rgba(91,61,245,0.08)] transition-shadow hover:shadow-[0_12px_40px_0_rgba(91,61,245,0.12)]"
      >
        {/* Brand Logo */}
        <button
          onClick={handleLogoClick}
          className="group flex items-center gap-2.5 pl-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B3DF5] rounded-full"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#5B3DF5] to-[#38BDF8] text-white shadow-[0_0_15px_rgba(91,61,245,0.4)] group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-extrabold tracking-tight text-slate-900 group-hover:text-[#5B3DF5] transition-colors">
              {siteConfig.name}
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase hidden sm:inline-block">
              Innovation Lab
            </span>
          </div>
        </button>

        {/* Center Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/50">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === ROUTES.HOME && activeSection === item.href.substring(1);
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-[#5B3DF5] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Primary CTA Button: Launch Forge Vault */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleVaultClick}
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-[#5B3DF5] to-[#38BDF8] px-4 py-2 text-xs font-bold text-white shadow-[0_4px_20px_rgba(91,61,245,0.3)] hover:shadow-[0_6px_25px_rgba(56,189,248,0.5)] active:scale-95 transition-all duration-200"
          >
            <span className="relative z-10 flex items-center gap-1">
              Launch Forge Vault
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto absolute top-20 left-4 right-4 z-[990] flex flex-col gap-2 rounded-2xl bg-white/95 backdrop-blur-2xl p-4 border border-slate-200 shadow-2xl md:hidden"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
