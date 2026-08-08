import React from 'react';
import { Search, Bell, Command, User, Sparkles } from 'lucide-react';
import { VaultTab } from './VaultSidebar';

interface VaultTopbarProps {
  activeTab: VaultTab;
  onSelectTab: (tab: VaultTab) => void;
  onOpenCommandPalette: () => void;
  onToggleNotifications: () => void;
  unreadNotificationCount: number;
}

export const VaultTopbar: React.FC<VaultTopbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenCommandPalette,
  onToggleNotifications,
  unreadNotificationCount,
}) => {
  return (
    <header className="sticky top-6 z-40 mb-8">
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl border-2 border-[#5B3DF5]/20 px-6 py-3.5 shadow-[0_8px_32px_0_rgba(91,61,245,0.08)] flex items-center justify-between gap-4">
        
        {/* Global Search Bar (Ctrl + K) Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex-1 max-w-md flex items-center justify-between gap-3 px-4 py-2 rounded-2xl bg-slate-100/80 border border-slate-200/60 text-xs text-slate-500 hover:border-[#5B3DF5] hover:bg-white transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" />
            <span className="font-medium">Search hackathons, deadlines, history, CMS...</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </button>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">
          {/* Notification Center Bell Trigger */}
          <button
            onClick={onToggleNotifications}
            aria-label="Toggle Notification Center"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-[#5B3DF5]/10 hover:text-[#5B3DF5] transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white shadow-md animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Profile Badge */}
          <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-xs shadow-sm">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-heading text-xs font-bold text-slate-900">Forge Admin</span>
              <span className="text-[10px] font-semibold text-[#5B3DF5]">Master Control</span>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Horizontal Navigation Tabs */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto pt-3 pb-1 scrollbar-none">
        {(['dashboard', 'calendar', 'hackathons', 'history', 'cms', 'settings'] as VaultTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-full capitalize whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#5B3DF5] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
};
