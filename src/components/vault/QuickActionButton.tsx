import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trophy, CheckSquare, FileUp, Award, Image, Code2, Sparkles } from 'lucide-react';
import { VaultTab } from './VaultSidebar';

interface QuickActionButtonProps {
  onSelectTab: (tab: VaultTab) => void;
  onOpenNewHackathonModal: () => void;
  onAddPublicProject: () => void;
  onAddAchievement: () => void;
  onViewPublicDashboard: () => void;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  onSelectTab,
  onOpenNewHackathonModal,
  onAddPublicProject,
  onAddAchievement,
  onViewPublicDashboard,
}) => {
  const [open, setOpen] = useState(false);

  const handleAction = (action: () => void) => {
    setOpen(false);
    action();
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9000] flex items-end gap-4">
      {/* Future AI Assistant Button */}
      <motion.button
        onClick={() => { /* Future API integration */ }}
        aria-label="AI Assistant"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#5B3DF5] to-[#38BDF8] text-white shadow-[0_8px_30px_rgba(91,61,245,0.4)] hover:shadow-[0_12px_35px_rgba(56,189,248,0.6)] z-10"
        animate={{ x: open ? -80 : 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      <div className="relative flex flex-col items-end">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              className="absolute bottom-full right-0 flex flex-col items-end gap-2 mb-4 whitespace-nowrap"
            >
              <button
                onClick={() => handleAction(onOpenNewHackathonModal)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-lg hover:bg-[#5B3DF5] transition-colors"
              >
                <Trophy className="h-4 w-4 text-[#38BDF8]" />
                <span>New Hackathon</span>
              </button>

              <button
                onClick={() => handleAction(onAddPublicProject)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-lg hover:bg-[#5B3DF5] transition-colors"
              >
                <Code2 className="h-4 w-4 text-[#38BDF8]" />
                <span>Add Public Project</span>
              </button>

              <button
                onClick={() => handleAction(onAddAchievement)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-lg hover:bg-[#5B3DF5] transition-colors"
              >
                <Award className="h-4 w-4 text-[#38BDF8]" />
                <span>Add New Achievement</span>
              </button>

              <button
                onClick={() => handleAction(onViewPublicDashboard)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-lg hover:bg-[#5B3DF5] transition-colors"
              >
                <Sparkles className="h-4 w-4 text-[#38BDF8]" />
                <span>View Public Dashboard</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen(!open)}
          aria-label="Quick Action Speed Dial"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#5B3DF5] to-[#38BDF8] text-white shadow-[0_8px_30px_rgba(91,61,245,0.4)] hover:shadow-[0_12px_35px_rgba(56,189,248,0.6)] z-10"
          animate={{ x: open ? -80 : 0, rotate: open ? -315 : 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        >
          <Plus className="h-7 w-7" />
        </motion.button>
      </div>
    </div>
  );
};
