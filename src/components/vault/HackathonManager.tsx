import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Plus, ArrowRight, Trash2, Edit3, Globe, Calendar, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { Hackathon, HackathonMode, HackathonType, Round, LinkItem, DocumentItem } from '../../types/vault';
import { playStampSound } from '../../utils/audio';
import { AnimatedStamp } from './AnimatedStamp';

interface HackathonManagerProps {
  hackathons: Hackathon[];
  onOpenWorkspace: (id: string) => void;
  onSaveHackathon: (hackathon: Hackathon) => void;
  onDeleteHackathon: (id: string) => void;
  initialOpenModal?: boolean;
}

export const HackathonManager: React.FC<HackathonManagerProps> = ({
  hackathons,
  onOpenWorkspace,
  onSaveHackathon,
  onDeleteHackathon,
  initialOpenModal = false,
}) => {
  const [modalOpen, setModalOpen] = useState(initialOpenModal);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [itemDeletePrompt, setItemDeletePrompt] = useState<{ name: string, type: string, action: () => void } | null>(null);

  React.useEffect(() => {
    if (initialOpenModal && !modalOpen) {
      openNewModal();
    }
  }, [initialOpenModal]);

  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState<HackathonType>('Hackathon');
  const [organizer, setOrganizer] = useState('');
  const [mode, setMode] = useState<HackathonMode>('Hybrid');
  const [platform, setPlatform] = useState('Unstop');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [registrationUrl, setRegistrationUrl] = useState('');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const openNewModal = () => {
    setEditingId(null);
    setName('');
    setType('Hackathon');
    setOrganizer('');
    setMode('Hybrid');
    setPlatform('Unstop');
    setWebsiteUrl('');
    setRegistrationUrl('');
    setRounds([]);
    setLinks([]);
    setDocuments([]);
    setModalOpen(true);
  };

  const openEditModal = (h: Hackathon) => {
    setEditingId(h.id);
    setName(h.name);
    setType(h.type || 'Hackathon');
    setOrganizer(h.organizer);
    setMode(h.mode);
    setPlatform(h.platform || 'Unstop');
    setWebsiteUrl(h.websiteUrl);
    setRegistrationUrl(h.registrationUrl);
    setRounds(h.rounds || []);
    setLinks(h.links || []);
    setDocuments(h.documents || []);
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hackathonItem: Hackathon = {
      id: editingId || `h-${Date.now()}`,
      name,
      type,
      organizer,
      mode,
      platform,
      websiteUrl,
      registrationUrl,
      problemStatement: editingId ? hackathons.find((h) => h.id === editingId)?.problemStatement || '' : '',
      description: editingId ? hackathons.find((h) => h.id === editingId)?.description || '' : '',
      status: 'Upcoming',
      createdAt: new Date().toISOString().split('T')[0],
      rounds: rounds,
      tasks: editingId ? hackathons.find((h) => h.id === editingId)?.tasks || [] : [],
      documents: documents,
      links: links,
      team: editingId ? hackathons.find((h) => h.id === editingId)?.team || [] : [],
      notes: editingId ? hackathons.find((h) => h.id === editingId)?.notes || [] : [],
    };

    onSaveHackathon(hackathonItem);
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner in Sky Blue Blending with White Theme */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-sky-100 border border-white/80 shadow-[0_20px_50px_-15px_rgba(59,130,246,0.3)]">
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#1D4ED8] shadow-md">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-white">Hackathon Manager</h1>
            <p className="text-xs font-medium text-white">Core operational workspace for active, upcoming, and completed hackathons.</p>
          </div>
        </div>

        <button
          onClick={openNewModal}
          className="relative z-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#1D4ED8] text-xs font-bold shadow-lg hover:bg-[#1D4ED8] hover:text-white border border-slate-200/80 active:scale-98 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>New Hackathon</span>
        </button>
      </div>

      {/* Hackathons Table / List View */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        {hackathons.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            No hackathons configured. Click "New Hackathon" to add your first entry.
          </div>
        ) : (
          <div className="space-y-3">
            {hackathons.map((h) => {
              const totalRounds = h.rounds.length;
              const completedRounds = h.rounds.filter((r) => r.completed).length;
              const progressPct = totalRounds > 0 ? Math.round((completedRounds / totalRounds) * 100) : 0;

              return (
                <motion.div
                  key={h.id}
                  whileHover={!h.isGameOver ? { y: -2 } : {}}
                  className="group relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-[#3B82F6] hover:bg-white transition-all shadow-sm"
                >
                  {h.isGameOver && (
                    <AnimatedStamp className="absolute inset-0 z-10 flex items-center justify-start pl-[280px] md:pl-[320px]">
                      <div className="transform -rotate-12 border-4 border-red-500 text-red-500 text-3xl font-black tracking-widest px-6 py-2 rounded-2xl opacity-40 select-none bg-white/30 backdrop-blur-sm">
                        GAME OVER
                      </div>
                    </AnimatedStamp>
                  )}
                  {/* Left Column Info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
                        {h.mode} Mode
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {h.status}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-[#3B82F6] transition-colors">
                      {h.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Organized by {h.organizer}
                    </p>
                  </div>

                  {/* Center Column: Round & Progress Bar */}
                  <div className="w-full md:w-64 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Round {completedRounds} of {totalRounds}</span>
                      <span className="text-[#3B82F6]">{progressPct}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#3B82F6] to-[#38BDF8] transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-col items-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                    <div className="flex items-center gap-2">
                      {!h.isGameOver && (
                        <>
                          <button
                            onClick={() => openEditModal(h)}
                            className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                            aria-label="Edit Hackathon"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(h.id)}
                            className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-[#3B82F6] transition-colors"
                            aria-label="Delete Hackathon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => onOpenWorkspace(h.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#3B82F6] text-xs font-bold text-white shadow-md hover:bg-[#1D4ED8] transition-colors"
                      >
                        <span>Workspace</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        const togglingOn = !h.isGameOver;
                        if (togglingOn) playStampSound();
                        onSaveHackathon({ ...h, isGameOver: togglingOn });
                      }}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm transition-all border text-center w-full max-w-[120px] ${h.isGameOver
                          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                    >
                      {h.isGameOver ? 'Continue...' : 'Game Over'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* New / Edit Hackathon Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[9990] flex justify-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 w-[75%] h-full bg-white shadow-2xl border-r border-slate-200 overflow-hidden flex flex-col rounded-r-3xl"
            >
              <div className="flex items-center justify-between bg-slate-900 text-white px-6 py-4">
                <h3 className="font-heading text-sm font-bold">
                  {editingId ? 'Edit Hackathon Details' : 'Create New Hackathon'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-white/70 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-6">

                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 border-b pb-2">Basic Info</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Hackathon Name *</label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Smart India Hackathon 2026" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Type *</label>
                      <div className="flex gap-2">
                        <select
                          value={['Hackathon', 'Coding Contest', 'Quiz'].includes(type) ? type : 'Custom'}
                          onChange={(e) => setType(e.target.value as HackathonType)}
                          className={`${['Hackathon', 'Coding Contest', 'Quiz'].includes(type) ? 'w-full' : 'w-1/2'} rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]`}
                        >
                          <option value="Hackathon">Hackathon</option>
                          <option value="Coding Contest">Coding Contest</option>
                          <option value="Quiz">Quiz</option>
                          <option value="Custom">Custom</option>
                        </select>
                        {!['Hackathon', 'Coding Contest', 'Quiz'].includes(type) && (
                          <input
                            type="text"
                            required
                            value={type === 'Custom' ? '' : type}
                            onChange={(e) => setType(e.target.value)}
                            placeholder="Enter type"
                            className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Organized By *</label>
                      <input type="text" required value={organizer} onChange={(e) => setOrganizer(e.target.value)} placeholder="e.g. Ministry of Education & AICTE" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1/3">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Event Mode</label>
                        <select value={mode} onChange={(e) => setMode(e.target.value as HackathonMode)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]">
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div className="w-2/3">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Event Platform</label>
                        <div className="flex gap-2">
                          <select
                            value={['Unstop', 'Hack2Skill', 'Devpost', 'Naukri', 'Devfolio', 'Hackculture'].includes(platform) ? platform : 'Custom'}
                            onChange={(e) => setPlatform(e.target.value)}
                            className={`${['Unstop', 'Hack2Skill', 'Devpost', 'Naukri', 'Devfolio', 'Hackculture'].includes(platform) ? 'w-full' : 'w-1/2'} rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]`}
                          >
                            <option value="Unstop">Unstop</option>
                            <option value="Hack2Skill">Hack2Skill</option>
                            <option value="Devpost">Devpost</option>
                            <option value="Naukri">Naukri</option>
                            <option value="Devfolio">Devfolio</option>
                            <option value="Hackculture">Hackculture</option>
                            <option value="Custom">Custom</option>
                          </select>
                          {!['Unstop', 'Hack2Skill', 'Devpost', 'Naukri', 'Devfolio', 'Hackculture'].includes(platform) && (
                            <input
                              type="text"
                              required
                              value={platform === 'Custom' ? '' : platform}
                              onChange={(e) => setPlatform(e.target.value)}
                              placeholder="Platform name"
                              className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Registration Link</label>
                      <input type="url" value={registrationUrl} onChange={(e) => setRegistrationUrl(e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Official Link</label>
                      <input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" />
                    </div>
                  </div>
                </div>

                {/* Rounds Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-sm font-bold text-slate-800">Rounds ({rounds.length})</h4>
                    <button type="button" onClick={() => setRounds([...rounds, { id: `r-${Date.now()}`, name: `Round ${rounds.length + 1}`, type: 'Custom', mode: 'Online', startDate: '', startTime: '', deadlineDate: '', deadlineTime: '', submissionDetails: '', submissionRequirements: '', resultDate: '', status: 'Pending', remarks: '', completed: false }])} className="text-xs font-bold text-[#3B82F6] hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add Round</button>
                  </div>
                  {rounds.map((r, i) => (
                    <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative">
                      <button type="button" onClick={() => setItemDeletePrompt({ name: r.name || `Round ${i + 1}`, type: 'round', action: () => setRounds(rounds.filter((_, idx) => idx !== i)) })} className="absolute top-3 right-3 text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                      <div className="flex flex-wrap items-center gap-3 pr-8">
                        <div className="font-bold text-xs whitespace-nowrap">Round {i + 1}</div>
                        <input type="text" placeholder="Round Name" value={r.name} onChange={(e) => { const newR = [...rounds]; newR[i].name = e.target.value; setRounds(newR); }} className="w-1/4 min-w-[120px] rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium" />
                        
                        <select
                          value={r.mode}
                          onChange={(e) => { const newR = [...rounds]; newR[i].mode = e.target.value as HackathonMode; setRounds(newR); }}
                          className="w-1/5 min-w-[100px] rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-white"
                        >
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                          <option value="Hybrid">Hybrid</option>
                        </select>

                        <div className="flex flex-1 gap-2 min-w-[200px]">
                          <select
                            value={['Quiz', 'Coding', 'PPT', 'Prototype', 'Presentation', 'Interview'].includes(r.type) ? r.type : 'Custom'}
                            onChange={(e) => { const newR = [...rounds]; newR[i].type = e.target.value as any; setRounds(newR); }}
                            className={`${['Quiz', 'Coding', 'PPT', 'Prototype', 'Presentation', 'Interview'].includes(r.type) ? 'w-full' : 'w-1/2'} rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium bg-white`}
                          >
                            <option value="Quiz">Quiz</option>
                            <option value="Coding">Coding</option>
                            <option value="PPT">PPT</option>
                            <option value="Prototype">Prototype</option>
                            <option value="Presentation">Presentation</option>
                            <option value="Interview">Interview</option>
                            <option value="Custom">Custom</option>
                          </select>
                          {!['Quiz', 'Coding', 'PPT', 'Prototype', 'Presentation', 'Interview'].includes(r.type) && (
                            <input
                              type="text"
                              placeholder="Type Submission format"
                              value={r.type === 'Custom' ? '' : r.type}
                              onChange={(e) => { const newR = [...rounds]; newR[i].type = e.target.value as any; setRounds(newR); }}
                              className="w-1/2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium"
                            />
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Start</label>
                          <div className="flex gap-2">
                            <input type="date" value={r.startDate} onChange={(e) => { const newR = [...rounds]; newR[i].startDate = e.target.value; setRounds(newR); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" />
                            <input type="time" value={r.startTime} onChange={(e) => { const newR = [...rounds]; newR[i].startTime = e.target.value; setRounds(newR); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Deadline</label>
                          <div className="flex gap-2">
                            <input type="date" value={r.deadlineDate} onChange={(e) => { const newR = [...rounds]; newR[i].deadlineDate = e.target.value; setRounds(newR); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" />
                            <input type="time" value={r.deadlineTime} onChange={(e) => { const newR = [...rounds]; newR[i].deadlineTime = e.target.value; setRounds(newR); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs" />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 items-start">
                        <textarea placeholder="Round Details" value={r.submissionDetails} onChange={(e) => { const newR = [...rounds]; newR[i].submissionDetails = e.target.value; setRounds(newR); }} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs resize-none" rows={2} />
                        <input type="text" placeholder="Result Date" value={r.resultDate} onChange={(e) => { const newR = [...rounds]; newR[i].resultDate = e.target.value; setRounds(newR); }} className="w-1/3 rounded-lg border border-slate-200 px-3 py-2 text-xs h-[52px]" />
                      </div>
                      <textarea placeholder="Submission Requirements" value={r.submissionRequirements || ''} onChange={(e) => { const newR = [...rounds]; newR[i].submissionRequirements = e.target.value; setRounds(newR); }} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs resize-none" rows={2} />
                    </div>
                  ))}
                </div>

                {/* Social Links Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-sm font-bold text-slate-800">Social Links ({links.length})</h4>
                    <button type="button" onClick={() => setLinks([...links, { id: `l-${Date.now()}`, title: 'WhatsApp', url: '', type: 'WhatsApp' }])} className="text-xs font-bold text-[#3B82F6] hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add Link</button>
                  </div>
                  {links.map((l, i) => (
                    <div key={l.id} className="flex gap-2 items-center">
                      <select
                        value={['WhatsApp', 'Slack', 'Discord', 'Instagram', 'Telegram', 'LinkedIn'].includes(l.title) ? l.title : 'Other'}
                        onChange={(e) => { const newL = [...links]; newL[i].title = e.target.value; newL[i].type = e.target.value; setLinks(newL); }}
                        className={`${['WhatsApp', 'Slack', 'Discord', 'Instagram', 'Telegram', 'LinkedIn'].includes(l.title) ? 'w-1/3' : 'w-1/4'} rounded-lg border border-slate-200 px-3 py-2 text-xs`}
                      >
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Slack">Slack</option>
                        <option value="Discord">Discord</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Telegram">Telegram</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Other">Other</option>
                      </select>
                      {!['WhatsApp', 'Slack', 'Discord', 'Instagram', 'Telegram', 'LinkedIn'].includes(l.title) && (
                        <input
                          type="text"
                          placeholder="Link Name"
                          value={l.title === 'Other' ? '' : l.title}
                          onChange={(e) => { const newL = [...links]; newL[i].title = e.target.value; newL[i].type = e.target.value; setLinks(newL); }}
                          className="w-1/4 rounded-lg border border-slate-200 px-3 py-2 text-xs"
                        />
                      )}
                      <input type="url" placeholder="https://..." value={l.url} onChange={(e) => { const newL = [...links]; newL[i].url = e.target.value; setLinks(newL); }} className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs" />
                      <button type="button" onClick={() => setItemDeletePrompt({ name: l.title || 'Link', type: 'link', action: () => setLinks(links.filter((_, idx) => idx !== i)) })} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>

                {/* Documents Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-sm font-bold text-slate-800">Documents ({documents.length})</h4>
                    <button type="button" onClick={() => setDocuments([...documents, { id: `d-${Date.now()}`, name: 'New Document', type: 'link', url: '', uploadedAt: new Date().toISOString(), category: 'Rulebook' }])} className="text-xs font-bold text-[#3B82F6] hover:underline flex items-center gap-1"><Plus className="h-3 w-3" /> Add Document</button>
                  </div>
                  {documents.map((d, i) => (
                    <div key={d.id} className="flex gap-2 items-center">
                      <input type="text" placeholder="File Name" value={d.name} onChange={(e) => { const newD = [...documents]; newD[i].name = e.target.value; setDocuments(newD); }} className="w-1/3 rounded-lg border border-slate-200 px-3 py-2 text-xs" />
                      <input type="file" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const newD = [...documents];
                          newD[i].url = URL.createObjectURL(file);
                          newD[i].size = `${(file.size / 1024).toFixed(1)} KB`;
                          setDocuments(newD);
                        }
                      }} className="flex-1 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#3B82F6] file:text-white hover:file:bg-[#1D4ED8]" />
                      <button type="button" onClick={() => setItemDeletePrompt({ name: d.name || 'Document', type: 'document', action: () => setDocuments(documents.filter((_, idx) => idx !== i)) })} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-6 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#38BDF8] text-xs font-bold text-white shadow-md hover:opacity-95"
                >
                  {editingId ? 'Save Changes' : 'Create Hackathon Workspace'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">
                  Delete {hackathons.find(h => h.id === deleteConfirmId)?.name}?
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Are you sure you want to delete "{hackathons.find(h => h.id === deleteConfirmId)?.name}"? This action cannot be undone and will permanently remove all associated tasks, rounds, and files.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onDeleteHackathon(deleteConfirmId);
                      setDeleteConfirmId(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm shadow-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Item Delete Confirmation Modal */}
      <AnimatePresence>
        {itemDeletePrompt && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setItemDeletePrompt(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">
                  Delete {itemDeletePrompt.name}
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Are you sure you want to delete this {itemDeletePrompt.type}? This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setItemDeletePrompt(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      itemDeletePrompt.action();
                      setItemDeletePrompt(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm shadow-sm hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
