import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Trophy,
  History,
  FileCode,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';

export type VaultTab = 'dashboard' | 'calendar' | 'hackathons' | 'connect' | 'history' | 'cms' | 'settings';

interface VaultSidebarProps {
  activeTab: VaultTab;
  onSelectTab: (tab: VaultTab) => void;
  onLogout: () => void;
  onNavigate?: (path: string) => void;
}

const navItems: { id: VaultTab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: 'calendar', label: 'Calendar', icon: <CalendarDays className="h-4 w-4" /> },
  { id: 'hackathons', label: 'Hackathons', icon: <Trophy className="h-4 w-4" /> },
  { id: 'connect', label: 'Connect Hackathons', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'history', label: 'Forge History', icon: <History className="h-4 w-4" /> },
  { id: 'cms', label: 'CMS', icon: <FileCode className="h-4 w-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

export const VaultSidebar: React.FC<VaultSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  onNavigate,
}) => {
  return (
    <aside className="w-64 flex-shrink-0 hidden md:block">
      <div 
        className="sticky top-6 mb-6 text-center cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => {
          onLogout();
          onNavigate?.('/');
        }}
      >
        <h1 
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#5B3DF5] to-[#38BDF8] tracking-tight drop-shadow-sm py-2"
          style={{ fontFamily: "'Berkshire Swash', cursive" }}
        >
          Orion Forge
        </h1>
      </div>
      <div className="sticky top-24 rounded-3xl bg-white/80 backdrop-blur-xl border-2 border-[#5B3DF5]/20 p-4 shadow-[0_10px_30px_-10px_rgba(91,61,245,0.08)] flex flex-col justify-between h-[calc(100vh-120px)]">
        {/* Top Section */}
        <div className="space-y-6">
          {/* Brand Badge */}
          <div className="flex items-center gap-2.5 px-3 py-2 border-b border-slate-100 pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5B3DF5] to-[#38BDF8] text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-sm font-extrabold tracking-tight text-slate-900">
                FORGE VAULT
              </span>
              <span className="text-[10px] font-bold text-[#5B3DF5] uppercase tracking-wider">
                Hackathon OS v1.0
              </span>
            </div>
          </div>

          {/* Navigation Options */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActivePill"
                      className="absolute inset-0 bg-gradient-to-r from-[#5B3DF5] to-[#38BDF8] rounded-2xl"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Logout */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              onLogout();
              if (onNavigate) {
                onNavigate('/');
              } else {
                window.location.href = '/';
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Lock Vault</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
