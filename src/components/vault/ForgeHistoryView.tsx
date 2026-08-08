import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Plus, Trophy, Award, Github, ExternalLink, Download, Trash2, Edit3, X, Link, FileText, Image as ImageIcon } from 'lucide-react';
import { HistoryEntry, HistoryResult } from '../../types/vault';

interface ForgeHistoryViewProps {
  history: HistoryEntry[];
  onSaveHistoryEntry: (entry: HistoryEntry) => void;
  onDeleteHistoryEntry: (id: string) => void;
  onOpenHistoryWorkspace: (id: string) => void;
}

export const ForgeHistoryView: React.FC<ForgeHistoryViewProps> = ({
  history,
  onSaveHistoryEntry,
  onDeleteHistoryEntry,
  onOpenHistoryWorkspace,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletePromptId, setDeletePromptId] = useState<string | null>(null);

  // Form State
  const [hackathonName, setHackathonName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [date, setDate] = useState('');
  const [result, setResult] = useState<HistoryResult>('Winner');
  const [resultDetails, setResultDetails] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');

  const openNewModal = () => {
    setEditingId(null);
    setHackathonName('');
    setProjectName('');
    setOrganizer('');
    setDate('2025-10');
    setResult('Winner');
    setResultDetails('🏆 1st Place Winner');
    setDescription('');
    setGithubUrl('');
    setDemoUrl('');
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: HistoryEntry = {
      id: editingId || `h-${Date.now()}`,
      hackathonId: `h-id-${Date.now()}`,
      hackathonName,
      projectName,
      organizer,
      date,
      roundsCount: 3,
      result,
      resultDetails,
      description,
      teamMembers: ['Ranjith Bala', 'Aarav Sharma', 'Priya Verma', 'Karthik Rajan'],
      documents: [],
      githubUrl,
      demoUrl,
      gallery: [],
    };

    onSaveHistoryEntry(entry);
    setModalOpen(false);
  };

  const wonCount = history.filter((h) => h.result === 'Winner').length;
  const runnerUpCount = history.filter((h) => h.result === 'Runner-up' || h.result === '1st Runner Up' || h.result === '2nd Runner Up').length;
  const participatedCount = history.filter((h) => h.result === 'Participation').length;

  return (
    <div className="space-y-8">
      {/* Header Banner in Sky Blue Blending with White Theme */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-sky-100 border border-white/80 shadow-[0_20px_50px_-15px_rgba(59,130,246,0.3)]">
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#1D4ED8] shadow-md">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-white">Forge History Portfolio</h1>
            <p className="text-xs font-medium text-white">Isolated archive of completed hackathons, trophies, research papers, and public project awards.</p>
          </div>
        </div>


      </div>

      {/* Top Portfolio Statistics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Entries</span>
          <span className="font-heading text-3xl font-extrabold text-slate-900">{history.length}</span>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Hackathons Won</span>
          <span className="font-heading text-3xl font-extrabold text-[#3B82F6]">{wonCount}</span>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Runner-up Titles</span>
          <span className="font-heading text-3xl font-extrabold text-[#38BDF8]">{runnerUpCount}</span>
        </div>
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Participated</span>
          <span className="font-heading text-3xl font-extrabold text-emerald-600">{participatedCount}</span>
        </div>
      </div>

      {/* History Entries Grid */}
      <div className="space-y-6">
        {history.map((item) => (
          <div
            key={item.id}
            className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 inline-block mb-2 shadow-sm border border-emerald-200">
                  {item.result}
                </span>
                <h3 className="font-heading text-xl font-bold text-slate-900">{item.hackathonName}</h3>
                <p className="text-xs font-bold text-[#3B82F6] mt-0.5">Organized by: {item.organizer}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDeletePromptId(item.id)}
                  className="p-2.5 rounded-full bg-slate-100 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              {item.overview || item.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 mr-1">Team:</span>
                {item.teamMembers?.map((m: any, idx: number) => {
                  const name = typeof m === 'string' ? m : (m.memberName || 'Unknown');
                  const key = typeof m === 'string' ? m : (m.id || idx);
                  return (
                    <span key={key} className="px-3 py-1 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-700">
                      {name}
                    </span>
                  );
                })}
              </div>
              
              <button
                onClick={() => onOpenHistoryWorkspace(item.id)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 active:scale-95"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New History Entry Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
            <div onClick={() => setModalOpen(false)} className="fixed inset-0 bg-slate-950/70" />
            <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 shadow-2xl">
              <h3 className="font-heading text-sm font-bold">Add History Entry</h3>
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  value={hackathonName}
                  onChange={(e) => setHackathonName(e.target.value)}
                  placeholder="Hackathon Name..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                />
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Project Name..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                />
                <input
                  type="text"
                  required
                  value={resultDetails}
                  onChange={(e) => setResultDetails(e.target.value)}
                  placeholder="Result Details (e.g. 🏆 1st Place Winner)..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                />
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the entry..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs resize-none"
                />
                <button type="submit" className="w-full bg-[#1D4ED8] text-white p-3 rounded-xl text-xs font-bold">
                  Save Entry
                </button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletePromptId && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div 
              onClick={() => setDeletePromptId(null)} 
              className="fixed inset-0 bg-slate-950/70" 
            />
            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">Delete History Entry</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Are you sure you want to delete this hackathon history entry? This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeletePromptId(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDeleteHistoryEntry(deletePromptId);
                      setDeletePromptId(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm shadow-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
