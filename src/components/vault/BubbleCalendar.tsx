import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, X, ArrowRight, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { Hackathon, Round } from '../../types/vault';

interface BubbleCalendarProps {
  hackathons: Hackathon[];
  onOpenHackathonWorkspace: (id: string) => void;
}

interface DateDeadlineInfo {
  hackathonId: string;
  hackathonName: string;
  round: Round;
}

export const BubbleCalendar: React.FC<BubbleCalendarProps> = ({
  hackathons,
  onOpenHackathonWorkspace,
}) => {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(currentDate.getMonth());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const monthsShort = [
    { code: 'JAN', name: 'January', index: 0 },
    { code: 'FEB', name: 'February', index: 1 },
    { code: 'MAR', name: 'March', index: 2 },
    { code: 'APR', name: 'April', index: 3 },
    { code: 'MAY', name: 'May', index: 4 },
    { code: 'JUN', name: 'June', index: 5 },
    { code: 'JUL', name: 'July', index: 6 },
    { code: 'AUG', name: 'August', index: 7 },
    { code: 'SEP', name: 'September', index: 8 },
    { code: 'OCT', name: 'October', index: 9 },
    { code: 'NOV', name: 'November', index: 10 },
    { code: 'DEC', name: 'December', index: 11 },
  ];

  // Calendar Math
  const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
  // Monday start offset (0 = Mon, 6 = Sun)
  const firstDayIndex = (new Date(selectedYear, selectedMonthIndex, 1).getDay() + 6) % 7;

  const todayObj = new Date();
  const todayStr = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  // Map dates (YYYY-MM-DD) to deadlines
  const deadlinesByDate: Record<string, DateDeadlineInfo[]> = {};

  hackathons.forEach((h) => {
    h.rounds.forEach((r) => {
      if (r.deadlineDate) {
        if (!deadlinesByDate[r.deadlineDate]) {
          deadlinesByDate[r.deadlineDate] = [];
        }
        deadlinesByDate[r.deadlineDate].push({
          hackathonId: h.id,
          hackathonName: h.name,
          round: r,
        });
      }
    });
  });

  const selectedDeadlines = selectedDateStr ? deadlinesByDate[selectedDateStr] || [] : [];

  return (
    <div className="space-y-8">
      {/* Top Controls & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] shadow-sm">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-slate-900">Forge Operations Scheduler</h1>
            <p className="text-xs text-slate-500">Planning Every Challenge. Managing Every Milestone. Delivering Every Success.</p>
          </div>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200">
          <button
            onClick={() => setSelectedYear(y => y - 1)}
            className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-1">
            {[selectedYear - 1, selectedYear, selectedYear + 1].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                  selectedYear === yr
                    ? 'bg-[#3B82F6] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSelectedYear(y => y + 1)}
            className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3D Physical Board Wrapper in Sky Blue Blending with White Theme */}
      <div className="relative rounded-[36px] bg-gradient-to-br from-[#3B82F6] via-[#38BDF8] to-white p-6 sm:p-10 border border-white/80 shadow-[0_25px_60px_-15px_rgba(59,130,246,0.35)] overflow-hidden">
        {/* Ambient Subtle Glow Orbs */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-white/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#3B82F6]/20 blur-3xl pointer-events-none" />

        {/* Calendar Board Main Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: 2 Columns of Month Selector Pills */}
          <div className="lg:col-span-4 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="font-heading text-xs font-extrabold tracking-widest text-[#1D4ED8] uppercase drop-shadow-sm">
                SELECT MONTH
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">{selectedYear}</span>
            </div>

            {/* 2 Column Month Grid */}
            <div className="grid grid-cols-2 gap-3">
              {monthsShort.map((m) => {
                const isSelected = selectedMonthIndex === m.index;
                return (
                  <motion.button
                    key={m.code}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMonthIndex(m.index)}
                    className={`relative py-3 px-4 rounded-full font-heading text-xs font-extrabold tracking-wider transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.08)] ${
                      isSelected
                        ? 'bg-[#E0F2FE] text-[#1D4ED8] border-2 border-[#3B82F6] ring-4 ring-[#3B82F6]/30 shadow-[0_8px_25px_rgba(59,130,246,0.3)] scale-105 font-black'
                        : 'bg-white text-slate-800 border border-slate-200 hover:text-[#3B82F6] hover:border-[#3B82F6]'
                    }`}
                  >
                    <span>{m.code}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Main Panel: Weekdays & Tactile Date Bubbles */}
          <div className="lg:col-span-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 p-6 sm:p-8 shadow-xl space-y-6">
            
            {/* Header: Selected Month Display */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2 drop-shadow-sm">
                <span>{monthsShort[selectedMonthIndex].name}</span>
                <span className="text-[#3B82F6]">{selectedYear}</span>
              </h2>

              {/* Status Legend Pills */}
              <div className="hidden sm:flex items-center gap-3 text-[11px] font-bold">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span>1 Deadline</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-600">
                  <span className="h-2 w-2 rounded-full bg-amber-600" />
                  <span>2 Deadlines</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                  <span>2+ Deadlines</span>
                </div>
              </div>
            </div>

            {/* Top Row: 7 Weekday Buttons */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, idx) => (
                <div
                  key={day}
                  className={`py-2.5 rounded-full font-heading text-[11px] sm:text-xs font-extrabold tracking-wider bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] ${
                    idx >= 5
                      ? 'text-[#3B82F6] border-2 border-[#3B82F6]'
                      : 'text-slate-800 border border-slate-200'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Tactile Date Bubbles Grid (Full Light Color Body + Dark Matching Border) */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 text-center">
              {/* Empty leading padding slots */}
              {Array.from({ length: firstDayIndex }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-11 w-11 sm:h-14 sm:w-14 mx-auto opacity-0" />
              ))}

              {/* Date Bubbles */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const monthStr = String(selectedMonthIndex + 1).padStart(2, '0');
                const dayStr = String(dayNum).padStart(2, '0');
                const dateStr = `${selectedYear}-${monthStr}-${dayStr}`;

                const isToday = dateStr === todayStr;
                const isPast = dateStr < todayStr;
                const deadlines = deadlinesByDate[dateStr] || [];
                const count = deadlines.length;

                // Full Light Color Body + Dark Matching Border Styles
                let bubbleBg = 'bg-white border border-slate-200 shadow-[0_6px_14px_rgba(0,0,0,0.08)] hover:shadow-lg';
                let textColor = 'text-slate-900';
                let dotColor = '';

                if (isToday) {
                  bubbleBg = 'bg-[#E0F2FE] border-2 border-[#3B82F6] shadow-[0_0_20px_rgba(59,130,246,0.35)]';
                  textColor = 'text-[#1D4ED8] font-black';
                  dotColor = 'bg-[#3B82F6]';
                } else if (count >= 3) {
                  bubbleBg = 'bg-red-100 border-2 border-red-600 shadow-md';
                  textColor = 'text-red-800 font-extrabold';
                  dotColor = 'bg-red-600';
                } else if (count === 2) {
                  bubbleBg = 'bg-amber-100 border-2 border-amber-600 shadow-md';
                  textColor = 'text-amber-800 font-extrabold';
                  dotColor = 'bg-amber-600';
                } else if (count === 1) {
                  bubbleBg = 'bg-emerald-100 border-2 border-emerald-600 shadow-md';
                  textColor = 'text-emerald-800 font-extrabold';
                  dotColor = 'bg-emerald-600';
                } else if (isPast) {
                  bubbleBg = 'bg-slate-100 border border-slate-200';
                  textColor = 'text-slate-400';
                }

                return (
                  <motion.div
                    key={dateStr}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.90, y: 2 }}
                    className="relative group mx-auto"
                  >
                    <button
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`relative flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full font-heading text-sm sm:text-base font-extrabold transition-all duration-200 ${bubbleBg} ${textColor}`}
                    >
                      <span>{dayNum}</span>

                      {/* Matching Dark Indicator Dot */}
                      {count > 0 && (
                        <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full shadow-sm animate-pulse ${dotColor}`} />
                      )}
                    </button>

                    {/* Hover Tooltip */}
                    {count > 0 && (
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-40 w-52 rounded-2xl bg-slate-950 border border-slate-700 text-white p-3 shadow-2xl text-left">
                        <span className="text-[10px] font-extrabold text-[#38BDF8] uppercase tracking-wider block mb-1">
                          {count} Deadline{count > 1 ? 's' : ''} Scheduled
                        </span>
                        <ul className="space-y-1 text-[11px]">
                          {deadlines.map((d, i) => (
                            <li key={i} className="truncate font-medium text-slate-200">
                              • {d.hackathonName} ({d.round.name})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>
      </div>

      {/* Right Slide-Over Drawer for Selected Date */}
      <AnimatePresence>
        {selectedDateStr && (
          <div className="fixed inset-0 z-[9990] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDateStr(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative z-10 w-full max-w-lg bg-white shadow-2xl overflow-y-auto flex flex-col h-full border-l border-slate-200"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#5B3DF5]" />
                  <h2 className="font-heading text-sm font-bold text-slate-900">
                    Deadlines for {selectedDateStr}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedDateStr(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                {selectedDeadlines.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No deadlines scheduled for {selectedDateStr}.
                  </div>
                ) : (
                  selectedDeadlines.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#5B3DF5]/10 text-[#5B3DF5]">
                          {item.round.type} Round
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          Due: {item.round.deadlineTime || '23:59'}
                        </span>
                      </div>

                      <h3 className="font-heading text-base font-bold text-slate-900">
                        {item.hackathonName}
                      </h3>
                      <p className="text-xs font-semibold text-[#5B3DF5]">
                        Round: {item.round.name}
                      </p>

                      {item.round.remarks && (
                        <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/60">
                          {item.round.remarks}
                        </p>
                      )}

                      <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                        <span className={`text-xs font-bold ${
                          item.round.status === 'Completed'
                            ? 'text-emerald-600'
                            : item.round.status === 'Closed'
                            ? 'text-red-600'
                            : 'text-amber-600'
                        }`}>
                          Status: {item.round.status}
                        </span>

                        <button
                          onClick={() => {
                            setSelectedDateStr(null);
                            onOpenHackathonWorkspace(item.hackathonId);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#5B3DF5] hover:underline"
                        >
                          <span>Open Workspace</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
