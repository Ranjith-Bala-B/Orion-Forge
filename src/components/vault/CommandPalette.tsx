import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, FileText, Calendar, History, Settings, ArrowRight, X } from 'lucide-react';
import { Hackathon, HistoryEntry } from '../../types/vault';
import { VaultTab } from './VaultSidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  hackathons: Hackathon[];
  history: HistoryEntry[];
  onSelectTab: (tab: VaultTab) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  hackathons,
  history,
  onSelectTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const lower = query.toLowerCase();

  const filteredHackathons = hackathons.filter(
    (h) => h.name.toLowerCase().includes(lower) || h.organizer.toLowerCase().includes(lower)
  );

  const filteredHistory = history.filter(
    (h) => h.hackathonName.toLowerCase().includes(lower) || h.projectName.toLowerCase().includes(lower)
  );

  const handleNavigate = (tab: VaultTab) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9995] flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          className="relative z-10 w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Input Header */}
          <div className="flex items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
            <Search className="h-5 w-5 text-slate-400 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hackathons, deadlines, documents, settings..."
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results List */}
          <div className="p-4 overflow-y-auto space-y-4">
            
            {/* Quick Navigation Commands */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2 block">
                Quick Navigation
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavigate('dashboard')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-[#5B3DF5]/10 hover:text-[#5B3DF5] text-xs font-bold text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span>Go to Dashboard</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleNavigate('calendar')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-[#5B3DF5]/10 hover:text-[#5B3DF5] text-xs font-bold text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Open Bubble Calendar</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleNavigate('hackathons')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-[#5B3DF5]/10 hover:text-[#5B3DF5] text-xs font-bold text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Hackathon Manager</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleNavigate('cms')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-[#5B3DF5]/10 hover:text-[#5B3DF5] text-xs font-bold text-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Orion Forge Live CMS</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Hackathons Search Results */}
            {filteredHackathons.length > 0 && (
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2 block">
                  Active Hackathons ({filteredHackathons.length})
                </span>
                <div className="space-y-1">
                  {filteredHackathons.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => handleNavigate('hackathons')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 text-left transition-colors"
                    >
                      <div>
                        <h4 className="font-heading text-xs font-bold text-slate-900">{h.name}</h4>
                        <p className="text-[11px] text-slate-500">{h.organizer} • {h.status}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#5B3DF5]/10 text-[#5B3DF5]">
                        Workspace →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* History Search Results */}
            {filteredHistory.length > 0 && (
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2 block">
                  Forge Portfolio History ({filteredHistory.length})
                </span>
                <div className="space-y-1">
                  {filteredHistory.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => handleNavigate('history')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-100 text-left transition-colors"
                    >
                      <div>
                        <h4 className="font-heading text-xs font-bold text-slate-900">{entry.hackathonName}</h4>
                        <p className="text-[11px] text-slate-500">{entry.projectName} • {entry.resultDetails}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {entry.result}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Info */}
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Navigation: Click or press Enter</span>
            <span>ESC to close</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
