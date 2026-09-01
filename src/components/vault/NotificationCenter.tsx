import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertTriangle, FileUp, CheckCircle, Check } from 'lucide-react';
import { NotificationItem, Hackathon } from '../../types/vault';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  hackathons?: Hackathon[];
  onMarkRead: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  hackathons = [],
  onMarkRead,
}) => {
  if (!isOpen) return null;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const todayDeadlines = hackathons
    .filter(h => !h.isGameOver)
    .flatMap(h => h.rounds
      .filter(r => !r.completed && r.status !== 'Closed' && r.deadlineDate === todayStr)
      .map(r => ({
        id: `today-dl-${h.id}-${r.id}`,
        title: `Deadline Today: ${h.name}`,
        message: `Round '${r.name}' is due today at ${r.deadlineTime || '23:59'}.`,
        timestamp: 'Today',
        type: 'deadline' as const,
        read: false,
      }))
    );

  const tomorrowDeadlines = hackathons
    .filter(h => !h.isGameOver)
    .flatMap(h => h.rounds
      .filter(r => !r.completed && r.status !== 'Closed' && r.deadlineDate === tomorrowStr)
      .map(r => ({
        id: `tmrw-dl-${h.id}-${r.id}`,
        title: `Deadline Tomorrow: ${h.name}`,
        message: `Round '${r.name}' is due tomorrow at ${r.deadlineTime || '23:59'}.`,
        timestamp: 'Tomorrow',
        type: 'deadline' as const,
        read: false,
      }))
    );

  const allNotifications = [...todayDeadlines, ...tomorrowDeadlines, ...notifications];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Slide Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative z-10 w-full max-w-md bg-white shadow-2xl overflow-y-auto flex flex-col h-full border-l border-slate-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#5B3DF5]" />
              <h2 className="font-heading text-sm font-bold text-slate-900">Notification Center</h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* List */}
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            {allNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No notifications right now.
              </div>
            ) : (
              allNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.read
                      ? 'bg-slate-50 border-slate-200/80 text-slate-600'
                      : 'bg-white border-[#5B3DF5]/30 shadow-sm text-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {item.type === 'deadline' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      {item.type === 'upload' && <FileUp className="h-4 w-4 text-[#38BDF8]" />}
                      {item.type === 'round_closed' && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                      <h4 className="font-heading text-xs font-bold">{item.title}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-600 mb-3">{item.message}</p>

                  {!item.read && (
                    <button
                      onClick={() => onMarkRead(item.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5B3DF5] hover:underline"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Mark as read</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
