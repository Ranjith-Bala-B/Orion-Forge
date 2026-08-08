import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, CheckSquare, Clock, ArrowRight, AlertCircle, Activity, ChevronRight, X } from 'lucide-react';
import { Hackathon, HistoryEntry } from '../../types/vault';
import { useCountUp } from '../../hooks/useCountUp';
import { VaultTab } from './VaultSidebar';

interface DashboardViewProps {
  hackathons: Hackathon[];
  history: HistoryEntry[];
  onSelectTab: (tab: VaultTab) => void;
  onOpenHackathonWorkspace: (id: string, targetTab?: 'overview' | 'rounds' | 'tasks' | 'documents' | 'links' | 'team' | 'notes') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  hackathons,
  history,
  onSelectTab,
  onOpenHackathonWorkspace,
}) => {
  const activeCount = hackathons.filter((h) => !h.isGameOver && (h.status === 'In Progress' || h.status === 'Upcoming' || h.status === 'Archived')).length;
  const completedCount = history.length + hackathons.filter((h) => h.status === 'Completed').length;
  
  // Total pending tasks (exclude game over)
  const pendingTasksCount = hackathons
    .filter((h) => !h.isGameOver)
    .reduce((acc, h) => acc + h.tasks.filter((t) => !t.completed).length, 0);

  // Upcoming deadlines (exclude game over)
  const upcomingDeadlines: { hackathonName: string; roundName: string; date: string; hackathonId: string }[] = [];
  hackathons.filter((h) => !h.isGameOver).forEach((h) => {
    h.rounds.forEach((r) => {
      if (!r.completed && r.status !== 'Closed') {
        upcomingDeadlines.push({
          hackathonName: h.name,
          roundName: r.name,
          date: r.deadlineDate,
          hackathonId: h.id,
        });
      }
    });
  });

  upcomingDeadlines.sort((a, b) => a.date.localeCompare(b.date));

  const activeCountUp = useCountUp(activeCount, 1500, true);
  const completedCountUp = useCountUp(completedCount, 1500, true);
  const tasksCountUp = useCountUp(pendingTasksCount, 1500, true);
  const deadlinesCountUp = useCountUp(upcomingDeadlines.length, 1500, true);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'active' | 'deadlines' | 'tasks' | 'completed' | null>(null);

  const openDrawer = (type: 'active' | 'deadlines' | 'tasks' | 'completed') => {
    setDrawerType(type);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Sky Blue Blending with White Header Banner */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-sky-100 border border-white/80 shadow-[0_20px_50px_-15px_rgba(59,130,246,0.3)]">
        {/* Subtle Ambient Background Lighting */}
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/40 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <span className="text-xs font-extrabold text-blue-100 uppercase tracking-wider block mb-1 drop-shadow-sm">
            ORION FORGE CONTROL CENTER
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Hackathon OS Dashboard
          </h1>
          <p className="text-xs font-medium text-white mt-1">
            Real-time telemetry, deadline schedules, and team workspace progress.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('hackathons')}
          className="relative z-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#1D4ED8] text-xs font-bold shadow-lg hover:bg-[#1D4ED8] hover:text-white border border-slate-200/80 active:scale-98 transition-all"
        >
          <span>Manage Hackathons</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => openDrawer('active')}
          className="text-left w-full p-6 rounded-3xl bg-white border-2 border-[#5B3DF5]/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6]">
              <Trophy className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">ACTIVE</span>
          </div>
          <div className="font-heading text-4xl font-extrabold text-slate-900 mb-1">
            {activeCountUp}
          </div>
          <h3 className="font-heading text-xs font-bold text-slate-700 uppercase tracking-wider">Active Hackathons</h3>
          <p className="text-[11px] text-slate-500 mt-1">Currently in progress or registered</p>
        </button>

        <button
          onClick={() => openDrawer('deadlines')}
          className="text-left w-full p-6 rounded-3xl bg-white border-2 border-[#5B3DF5]/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Clock className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">PENDING</span>
          </div>
          <div className="font-heading text-4xl font-extrabold text-slate-900 mb-1">
            {deadlinesCountUp}
          </div>
          <h3 className="font-heading text-xs font-bold text-slate-700 uppercase tracking-wider">Upcoming Deadlines</h3>
          <p className="text-[11px] text-slate-500 mt-1">Rounds requiring submission</p>
        </button>

        <button
          onClick={() => openDrawer('tasks')}
          className="text-left w-full p-6 rounded-3xl bg-white border-2 border-[#5B3DF5]/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#38BDF8]/10 text-[#38BDF8]">
              <CheckSquare className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-[#38BDF8]/10 text-[#38BDF8]">TASKS</span>
          </div>
          <div className="font-heading text-4xl font-extrabold text-slate-900 mb-1">
            {tasksCountUp}
          </div>
          <h3 className="font-heading text-xs font-bold text-slate-700 uppercase tracking-wider">Pending Team Tasks</h3>
          <p className="text-[11px] text-slate-500 mt-1">Assigned checklist items</p>
        </button>

        <button
          onClick={() => openDrawer('completed')}
          className="text-left w-full p-6 rounded-3xl bg-white border-2 border-[#5B3DF5]/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">HISTORY</span>
          </div>
          <div className="font-heading text-4xl font-extrabold text-slate-900 mb-1">
            {completedCountUp}
          </div>
          <h3 className="font-heading text-xs font-bold text-slate-700 uppercase tracking-wider">Completed Portfolio</h3>
          <p className="text-[11px] text-slate-500 mt-1">Archived victories & papers</p>
        </button>
      </div>

      {/* Widened Full-Width Upcoming Deadlines Timeline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6 w-full">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">Upcoming Deadlines Timeline</h2>
              <p className="text-xs text-slate-500">Live submission schedules across all active hackathons</p>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('calendar')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white hover:border-[#3B82F6] transition-all"
          >
            <span>Bubble Calendar</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Scrollable Container if > 4 items */}
        <div className={`space-y-3 pr-1 ${upcomingDeadlines.length > 4 ? 'max-h-[380px] overflow-y-auto scrollbar-thin' : ''}`}>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No pending round deadlines.</p>
          ) : (
            upcomingDeadlines.map((d, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                onClick={() => onOpenHackathonWorkspace(d.hackathonId, 'rounds')}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#3B82F6] hover:bg-gradient-to-r hover:from-[#3B82F6]/10 hover:to-[#38BDF8]/10 hover:shadow-[0_8px_25px_rgba(59,130,246,0.15)] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors flex-shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#3B82F6] transition-colors">
                      {d.hackathonName}
                    </h4>
                    <p className="text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">
                      Round: {d.roundName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/80 group-hover:bg-[#3B82F6] group-hover:text-white transition-colors">
                    <Clock className="h-3.5 w-3.5 text-slate-600 group-hover:text-white" />
                    <span className="text-xs font-bold text-slate-900 group-hover:text-white">
                      Due: {d.date}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-[#3B82F6] group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Details Drawer */}
      {createPortal(
        <AnimatePresence>
          {drawerOpen && (
            <div className="fixed inset-0 z-[9999] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 w-full sm:w-[450px] h-full bg-[#FAFBFC] shadow-2xl border-l border-slate-200/60 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 bg-white border-b border-slate-200">
                <h2 className="font-heading text-lg font-bold text-slate-900">
                  {drawerType === 'active' && 'Active Hackathons'}
                  {drawerType === 'deadlines' && 'Upcoming Deadlines'}
                  {drawerType === 'tasks' && 'Pending Team Tasks'}
                  {drawerType === 'completed' && 'Completed Portfolio'}
                </h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {drawerType === 'active' && hackathons
                  .filter((h) => !h.isGameOver && (h.status === 'In Progress' || h.status === 'Upcoming' || h.status === 'Archived'))
                  .map((h) => (
                    <div key={h.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#3B82F6] transition-colors cursor-pointer" onClick={() => { setDrawerOpen(false); onOpenHackathonWorkspace(h.id); }}>
                      <h4 className="font-bold text-slate-900">{h.name}</h4>
                      <p className="text-xs text-slate-500">{h.organizer}</p>
                    </div>
                  ))}

                {drawerType === 'deadlines' && upcomingDeadlines.map((d, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#3B82F6] transition-colors cursor-pointer" onClick={() => { setDrawerOpen(false); onOpenHackathonWorkspace(d.hackathonId, 'rounds'); }}>
                    <h4 className="font-bold text-slate-900">{d.hackathonName}</h4>
                    <p className="text-xs text-[#3B82F6] font-bold mt-1">Round: {d.roundName}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-600 font-medium">
                      <Clock className="h-3 w-3" /> Due: {d.date}
                    </div>
                  </div>
                ))}

                {drawerType === 'tasks' && hackathons
                  .filter((h) => !h.isGameOver)
                  .map((h) => {
                    const pendingTasks = h.tasks.filter((t) => !t.completed);
                    if (pendingTasks.length === 0) return null;
                    return (
                      <div key={h.id} className="space-y-2 mb-6">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{h.name}</h4>
                        {pendingTasks.map((t) => (
                          <div key={t.id} className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 cursor-pointer" onClick={() => { setDrawerOpen(false); onOpenHackathonWorkspace(h.id, 'tasks'); }}>
                            <CheckSquare className="h-4 w-4 text-slate-300 mt-0.5" />
                            <p className="text-sm text-slate-700">{t.title}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })}

                {drawerType === 'completed' && (
                  <>
                    {hackathons.filter(h => h.status === 'Completed').map(h => (
                      <div key={h.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900">{h.name}</h4>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Completed</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{h.organizer}</p>
                      </div>
                    ))}
                    {history.map(h => (
                      <div key={h.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900">{h.hackathonName}</h4>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">Legacy</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{h.organizer}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
