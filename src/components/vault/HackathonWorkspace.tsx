import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Layout,
  Layers,
  CheckSquare,
  FileText,
  Link as LinkIcon,
  Users,
  StickyNote,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileUp,
  Github,
  Archive,
  Trophy,
  X,
} from 'lucide-react';
import {
  Hackathon, Round, TaskItem, DocumentItem, LinkItem, TeamAssignment, NoteItem,
  HackathonType, HackathonMode, RoundType, TaskPriority, HistoryEntry, HistoryResult
} from '../../types/vault';
import { playStampSound } from '../../utils/audio';
import { AnimatedStamp } from './AnimatedStamp';

interface HackathonWorkspaceProps {
  hackathon: Hackathon;
  onBack: () => void;
  onSaveHackathon: (hackathon: Hackathon) => void;
  onSaveHistoryEntry?: (entry: HistoryEntry) => void;
  onNavigateToHistory?: () => void;
  isArchived?: boolean;
  initialTab?: WorkspaceTab;
}

type WorkspaceTab = 'overview' | 'rounds' | 'tasks' | 'documents' | 'links' | 'team' | 'notes';

export const HackathonWorkspace: React.FC<HackathonWorkspaceProps> = ({
  hackathon,
  onBack,
  onSaveHackathon,
  onSaveHistoryEntry,
  onNavigateToHistory,
  isArchived = false,
  initialTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialTab);

  // Legacy feature states
  const [legacyModalOpen, setLegacyModalOpen] = useState(false);
  const [legacyResult, setLegacyResult] = useState<HistoryResult | 'Custom'>('Participation');
  const [legacyCustomResult, setLegacyCustomResult] = useState('');
  
  const [legacyRoundResults, setLegacyRoundResults] = useState<Record<string, string>>({});
  const [legacyRoundCustomResults, setLegacyRoundCustomResults] = useState<Record<string, string>>({});
  
  const [legacyCertificates, setLegacyCertificates] = useState<{name: string, file: File | null}[]>([]);
  
  const [legacyLinks, setLegacyLinks] = useState<{title: string, url: string}[]>([]);

  const handleAddToLegacy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSaveHistoryEntry) return;

    // Build the round results map
    const finalRoundResults: Record<string, string> = {};
    hackathon.rounds.forEach(r => {
      let res = legacyRoundResults[r.id] || 'N/A';
      if (res === 'Custom') {
        res = legacyRoundCustomResults[r.id] || 'N/A';
      }
      finalRoundResults[r.name] = res;
    });
    
    // Add certificates to documents if uploaded
    const updatedDocs = [...hackathon.documents];
    const certNames: string[] = [];
    legacyCertificates.forEach((cert, idx) => {
      if (cert.name && cert.file) {
        certNames.push(cert.name);
        updatedDocs.push({
          id: `doc-cert-${Date.now()}-${idx}`,
          name: cert.name,
          type: cert.file.type.includes('pdf') ? 'pdf' : 'image',
          url: URL.createObjectURL(cert.file),
          uploadedAt: new Date().toISOString().split('T')[0],
          category: 'Certificate'
        });
      }
    });

    const finalResult = legacyResult === 'Custom' ? (legacyCustomResult as HistoryResult) : legacyResult;
    
    // We only set resultDetails to custom result text if custom, else keep it blank or clean.
    const finalResultDetails = legacyResult === 'Custom' ? legacyCustomResult : '';

    // Store custom links in description or if we map it to githubUrl/demoUrl
    // We'll map the first link to demoUrl for now, second to githubUrl as fallback
    const firstLink = legacyLinks[0];
    const secondLink = legacyLinks[1];

    const newEntry: HistoryEntry = {
      id: `history-${Date.now()}`,
      hackathonId: hackathon.id,
      hackathonName: hackathon.name,
      projectName: hackathon.name + ' Project',
      organizer: hackathon.organizer,
      date: new Date().toISOString().split('T')[0],
      roundsCount: hackathon.rounds.length,
      result: finalResult,
      resultDetails: finalResultDetails || `Completed ${hackathon.name}`,
      description: hackathon.description,
      problemStatement: hackathon.problemStatement,
      teamMembers: hackathon.team.map((t) => t.memberName),
      documents: updatedDocs,
      demoUrl: firstLink?.url,
      githubUrl: secondLink?.url,
      certificateUrl: legacyCertificates.length > 0 && legacyCertificates[0].file ? URL.createObjectURL(legacyCertificates[0].file) : undefined,
      gallery: [],
      overview: hackathon.description,
      roundResults: finalRoundResults,
      projectLinks: legacyLinks.filter(l => l.title && l.url).map(l => ({ id: Date.now().toString() + Math.random(), title: l.title, url: l.url, type: 'Project' as const })),
      hackathonLinks: [
        ...(hackathon.websiteUrl ? [{ id: 'official-website', title: 'Official Website', url: hackathon.websiteUrl, type: 'Website' as const }] : []),
        ...(hackathon.registrationUrl ? [{ id: 'registration-portal', title: 'Registration Portal', url: hackathon.registrationUrl, type: 'Registration' as const }] : []),
        ...hackathon.links
      ],
      rounds: hackathon.rounds,
    };

    const newLinks = [
      ...hackathon.links,
      ...legacyLinks.filter(l => l.title && l.url).map(l => ({
        id: Date.now().toString() + Math.random(),
        title: l.title,
        url: l.url,
        type: 'Project' as const
      }))
    ];

    onSaveHistoryEntry(newEntry);
    onSaveHackathon({ 
      ...hackathon, 
      status: 'Archived',
      documents: updatedDocs,
      links: newLinks
    });
    setLegacyModalOpen(false);
    
    if (onNavigateToHistory) {
      onNavigateToHistory();
    } else {
      onBack();
    }
  };

  const [itemDeletePrompt, setItemDeletePrompt] = useState<{ id: string, name: string, type: string, action: () => void } | null>(null);

  // Compute Overall Progress & Completion Stamp
  const totalRounds = hackathon.rounds.length;
  const completedRounds = hackathon.rounds.filter((r) => r.completed).length;
  const progressPct = totalRounds > 0 ? Math.round((completedRounds / totalRounds) * 100) : 0;
  const isAllCompleted = totalRounds > 0 && completedRounds === totalRounds;

  // Round Toggle Helper
  const handleToggleRound = (roundId: string) => {
    const updatedRounds = hackathon.rounds.map((r) => {
      if (r.id === roundId) {
        const nextCompleted = !r.completed;
        if (nextCompleted) playStampSound();
        return {
          ...r,
          completed: nextCompleted,
          status: nextCompleted ? ('Completed' as const) : ('Pending' as const),
        };
      }
      return r;
    });

    const nextCompletedRounds = updatedRounds.filter((r) => r.completed).length;
    const nextStatus = nextCompletedRounds === updatedRounds.length ? ('Completed' as const) : ('In Progress' as const);

    onSaveHackathon({
      ...hackathon,
      rounds: updatedRounds,
      status: nextStatus,
    });
  };

  const handleDeleteRound = (roundId: string) => {
    const r = hackathon.rounds.find(x => x.id === roundId);
    setItemDeletePrompt({
      id: roundId,
      name: r?.name || 'Round',
      type: 'round',
      action: () => {
        const updatedRounds = hackathon.rounds.filter(r => r.id !== roundId);
        
        const nextCompletedRounds = updatedRounds.filter((r) => r.completed).length;
        const nextStatus = updatedRounds.length > 0 && nextCompletedRounds === updatedRounds.length ? ('Completed' as const) : ('In Progress' as const);

        onSaveHackathon({
          ...hackathon,
          rounds: updatedRounds,
          status: nextStatus,
        });
      }
    });
  };

  // Edit Problem Statement State
  const [isEditingPS, setIsEditingPS] = useState(false);
  const [editedPS, setEditedPS] = useState(hackathon.problemStatement);

  // Add Round Modal State
  const [addRoundOpen, setAddRoundOpen] = useState(false);
  const [newRoundName, setNewRoundName] = useState('');
  const [newRoundType, setNewRoundType] = useState<RoundType | 'Select Type...'>('Select Type...');
  const [newRoundStartDate, setNewRoundStartDate] = useState('');
  const [newRoundStartTime, setNewRoundStartTime] = useState('');
  const [newRoundDate, setNewRoundDate] = useState('');
  const [newRoundTime, setNewRoundTime] = useState('23:59');
  const [newRoundDetails, setNewRoundDetails] = useState('');
  const [newRoundResultDate, setNewRoundResultDate] = useState('');
  const [newRoundRequirements, setNewRoundRequirements] = useState('');

  // Add Document Modal State
  const [addDocOpen, setAddDocOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocFile, setNewDocFile] = useState<File | null>(null);

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName || !newDocFile) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      type: newDocFile.type.includes('pdf') ? 'pdf' : 'image',
      url: URL.createObjectURL(newDocFile),
      uploadedAt: new Date().toISOString().split('T')[0],
      category: 'Report',
      size: (newDocFile.size / (1024 * 1024)).toFixed(1) + ' MB'
    };

    onSaveHackathon({
      ...hackathon,
      documents: [...hackathon.documents, newDoc],
    });

    setNewDocName('');
    setNewDocFile(null);
    setAddDocOpen(false);
  };

  const handleDeleteDocument = (docId: string) => {
    setItemDeletePrompt({
      id: docId,
      name: 'Document',
      type: 'document',
      action: () => {
        onSaveHackathon({
          ...hackathon,
          documents: hackathon.documents.filter((d) => d.id !== docId),
        });
      }
    });
  };

  // Add Link Modal State
  const [addLinkOpen, setAddLinkOpen] = useState(false);
  const [newLinkType, setNewLinkType] = useState<'hackathon' | 'project'>('hackathon');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) return;

    const newLink = {
      id: Date.now().toString(),
      title: newLinkTitle,
      url: newLinkUrl,
      type: newLinkType === 'hackathon' ? 'General' : 'Project'
    };

    onSaveHackathon({
      ...hackathon,
      links: [...hackathon.links, newLink]
    });
    setAddLinkOpen(false);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleDeleteLink = (linkId: string) => {
    setItemDeletePrompt({
      id: linkId,
      name: 'Link',
      type: 'link',
      action: () => {
        onSaveHackathon({
          ...hackathon,
          links: hackathon.links.filter(l => l.id !== linkId)
        });
      }
    });
  };

  const handleAddRound = (e: React.FormEvent) => {
    e.preventDefault();
    const newRound: Round = {
      id: `r-${Date.now()}`,
      name: newRoundName || 'New Round',
      type: newRoundType === 'Select Type...' ? 'Quiz' : newRoundType as RoundType,
      mode: hackathon.mode,
      startDate: newRoundStartDate || new Date().toISOString().split('T')[0],
      startTime: newRoundStartTime || '00:00',
      deadlineDate: newRoundDate || new Date().toISOString().split('T')[0],
      deadlineTime: newRoundTime,
      submissionDetails: newRoundDetails,
      submissionRequirements: newRoundRequirements,
      resultDate: newRoundResultDate,
      status: 'Pending',
      remarks: '',
      completed: false,
    };

    onSaveHackathon({
      ...hackathon,
      rounds: [...hackathon.rounds, newRound],
    });

    setNewRoundName('');
    setNewRoundType('Select Type...');
    setNewRoundStartDate('');
    setNewRoundStartTime('');
    setNewRoundDate('');
    setNewRoundTime('23:59');
    setNewRoundDetails('');
    setNewRoundResultDate('');
    setNewRoundRequirements('');
    setAddRoundOpen(false);
  };

  // Task Toggle & Delete Helper
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = hackathon.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onSaveHackathon({ ...hackathon, tasks: updatedTasks });
  };

  const handleDeleteTask = (taskId: string) => {
    setItemDeletePrompt({
      id: taskId,
      name: 'Task',
      type: 'task',
      action: () => {
        onSaveHackathon({
          ...hackathon,
          tasks: hackathon.tasks.filter((t) => t.id !== taskId),
        });
      }
    });
  };

  // Add Task Helper
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskMember, setNewTaskMember] = useState('Ranjith Bala');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('High');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      title: newTaskTitle,
      priority: newTaskPriority,
      assignedMember: newTaskMember,
      dueDate: new Date().toISOString().split('T')[0],
      completed: false,
    };

    onSaveHackathon({
      ...hackathon,
      tasks: [...hackathon.tasks, newTask],
    });
    setNewTaskTitle('');
  };

  // Add Note Helper
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle || !newNoteContent) return;
    const newNote: NoteItem = {
      id: `n-${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSaveHackathon({
      ...hackathon,
      notes: [...hackathon.notes, newNote],
    });
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const handleDeleteNote = (noteId: string) => {
    setItemDeletePrompt({
      id: noteId,
      name: 'Note',
      type: 'note',
      action: () => {
        onSaveHackathon({
          ...hackathon,
          notes: hackathon.notes.filter((n) => n.id !== noteId),
        });
      }
    });
  };

  // Team Member Management
  const inbuiltMembers = ['Ranjith Bala B', 'Arul Raj W', 'Ragul S', 'Vishal M', 'Custom Member'];
  const [selectedMember, setSelectedMember] = useState('');
  const [customMemberName, setCustomMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberResponsibility, setNewMemberResponsibility] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const name = selectedMember === 'Custom Member' ? customMemberName : selectedMember;
    if (!name) return;
    
    const newMember = {
      id: `m-${Date.now()}`,
      memberName: name,
      role: newMemberRole || 'Member', // Default fallback or can just be empty string
      responsibility: newMemberResponsibility,
    };
    onSaveHackathon({
      ...hackathon,
      team: [...hackathon.team, newMember],
    });
    setSelectedMember('');
    setCustomMemberName('');
    setNewMemberRole('');
    setNewMemberResponsibility('');
  };

  const handleDeleteMember = (memberId: string) => {
    const m = hackathon.team.find(x => x.id === memberId);
    setItemDeletePrompt({
      id: memberId,
      name: m?.memberName || 'Team Member',
      type: 'team member',
      action: () => {
        onSaveHackathon({
          ...hackathon,
          team: hackathon.team.filter((t) => t.id !== memberId),
        });
      }
    });
  };

  return (
    <div className="space-y-6 relative h-full">
      {hackathon.isGameOver && (
        <AnimatedStamp className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div className="transform -rotate-12 border-8 border-red-500 text-red-500 text-[120px] font-black tracking-widest px-12 py-6 rounded-3xl opacity-30 select-none bg-white/20 backdrop-blur-sm">
            GAME OVER
          </div>
        </AnimatedStamp>
      )}

      {/* Top Bar with Back Button & Completion Stamp */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#5B3DF5]/10 text-[#5B3DF5]">
                WORKSPACE
              </span>
              <span className="text-xs font-semibold text-slate-500">{hackathon.organizer}</span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <h1 className="font-heading text-2xl font-extrabold text-slate-900">{hackathon.name}</h1>
              <button
                onClick={() => {
                  const togglingOn = !hackathon.isGameOver;
                  if (togglingOn) playStampSound();
                  onSaveHackathon({ ...hackathon, isGameOver: togglingOn });
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm transition-all border ${
                  hackathon.isGameOver 
                    ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {hackathon.isGameOver ? 'Continue...' : 'Game Over'}
              </button>
            </div>
          </div>
        </div>

        {/* Completion Stamp / Status */}
        {isAllCompleted ? (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-heading text-xs font-extrabold shadow-sm animate-bounce">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>COMPLETED ✓</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-slate-700 block">Overall Progress</span>
              <span className="font-heading text-base font-extrabold text-[#5B3DF5]">{progressPct}% ({completedRounds}/{totalRounds} Rounds)</span>
            </div>
            <div className="h-10 w-10 rounded-full border-4 border-[#5B3DF5] flex items-center justify-center font-heading text-xs font-bold text-slate-900">
              {progressPct}%
            </div>
          </div>
        )}
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1 overflow-x-auto bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: <Layout className="h-4 w-4" /> },
          { id: 'rounds', label: `Rounds (${hackathon.rounds.length})`, icon: <Layers className="h-4 w-4" /> },
          { id: 'tasks', label: `Tasks (${hackathon.tasks.length})`, icon: <CheckSquare className="h-4 w-4" /> },
          { id: 'documents', label: `Document Vault (${hackathon.documents.length})`, icon: <FileText className="h-4 w-4" /> },
          { id: 'links', label: `Links (${hackathon.links.length + (hackathon.websiteUrl ? 1 : 0) + (hackathon.registrationUrl ? 1 : 0)})`, icon: <LinkIcon className="h-4 w-4" /> },
          { id: 'team', label: `Team (${hackathon.team.length})`, icon: <Users className="h-4 w-4" /> },
          { id: 'notes', label: `Notes (${hackathon.notes.length})`, icon: <StickyNote className="h-4 w-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as WorkspaceTab)}
            className={`relative flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
        
        <div className="ml-auto flex items-center pr-1">
          <button
            onClick={() => setLegacyModalOpen(true)}
            disabled={isArchived}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-95 ${
              isArchived 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-orange-500/30'
            }`}
          >
            <Archive className="h-4 w-4" />
            {isArchived ? 'Already in Legacy' : 'Add to Legacy'}
          </button>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Organized By</span>
              <span className="font-heading text-sm font-bold text-slate-900">{hackathon.organizer}</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Event Mode</span>
              <span className="font-heading text-sm font-bold text-[#5B3DF5]">{hackathon.mode}</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</span>
              <span className="font-heading text-sm font-bold text-slate-900">{hackathon.status}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">Problem Statement</h3>
              {!isEditingPS && !hackathon.isGameOver ? (
                <button onClick={() => setIsEditingPS(true)} className="text-[10px] font-bold text-[#3B82F6] hover:underline px-2 py-1 rounded bg-[#3B82F6]/10">Edit PS</button>
              ) : isEditingPS ? (
                <div className="flex gap-2">
                  <button onClick={() => { onSaveHackathon({ ...hackathon, problemStatement: editedPS }); setIsEditingPS(false); }} className="text-[10px] font-bold text-white bg-[#3B82F6] hover:bg-[#1D4ED8] px-2 py-1 rounded">Save</button>
                  <button onClick={() => { setIsEditingPS(false); setEditedPS(hackathon.problemStatement); }} className="text-[10px] font-bold text-slate-500 hover:bg-slate-100 px-2 py-1 rounded">Cancel</button>
                </div>
              ) : null}
            </div>
            {!isEditingPS ? (
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {hackathon.problemStatement}
              </p>
            ) : (
              <textarea
                className="w-full text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border border-[#3B82F6] outline-none focus:ring-2 focus:ring-[#3B82F6]/20 min-h-[100px] resize-y"
                value={editedPS}
                onChange={(e) => setEditedPS(e.target.value)}
              />
            )}
          </div>

          {(hackathon.websiteUrl || hackathon.registrationUrl) && (
            <div>
              <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Official Resources</h3>
              <div className="flex flex-wrap gap-3">
                {hackathon.websiteUrl && (
                  <a
                    href={hackathon.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-[#5B3DF5] transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Official Website</span>
                  </a>
                )}
                {hackathon.registrationUrl && (
                  <a
                    href={hackathon.registrationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5B3DF5] text-white text-xs font-bold hover:bg-[#4A2CE2] transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Registration Portal</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Rounds */}
      {activeTab === 'rounds' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-900">Evaluation Rounds Timeline</h3>
            {!hackathon.isGameOver && (
              <button
                onClick={() => setAddRoundOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5B3DF5] text-xs font-bold text-white shadow-sm hover:bg-[#4A2CE2] transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Round</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {hackathon.rounds.map((r, idx) => (
              <div
                key={r.id}
                className={`p-6 rounded-2xl border transition-all space-y-4 ${
                  r.completed
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : r.status === 'Closed'
                    ? 'bg-red-50/60 border-red-200'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                {/* Header: Name and Checkbox */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={r.completed}
                      disabled={hackathon.isGameOver}
                      onChange={() => handleToggleRound(r.id)}
                      className="h-5 w-5 rounded border-slate-300 text-[#5B3DF5] focus:ring-[#5B3DF5] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500">Round {idx + 1}</span>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {r.type}
                        </span>
                      </div>
                      <h4 className="font-heading text-lg font-bold text-slate-900">{r.name}</h4>
                    </div>
                  </div>
                  {!hackathon.isGameOver && (
                    <button 
                      onClick={() => handleDeleteRound(r.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Dates and Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Start</span>
                    <span className="text-sm font-semibold text-slate-800">{r.startDate || '-----'} {r.startTime && `at ${r.startTime}`}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Deadline</span>
                    <span className="text-sm font-semibold text-slate-800">{r.deadlineDate || '-----'} {r.deadlineTime && `at ${r.deadlineTime}`}</span>
                  </div>
                </div>

                {/* Details & Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Round Details</span>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[60px]">
                      {r.submissionDetails || '-----'}
                    </p>
                  </div>
                  <div className="md:col-span-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Result Date</span>
                    <div className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 h-[60px] flex items-center">
                      {r.resultDate || '-----'}
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Submission Requirements</span>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[60px]">
                    {r.submissionRequirements || '-----'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Tasks */}
      {activeTab === 'tasks' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          {!hackathon.isGameOver && (
            <form onSubmit={handleAddTask} className="flex gap-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add new task title..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]"
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#5B3DF5] text-xs font-bold text-white shadow-sm hover:bg-[#4A2CE2]"
              >
                Add Task
              </button>
            </form>
          )}

          <div className="space-y-2">
            {hackathon.tasks.length === 0 && (
              <div className="text-center py-6 text-sm text-slate-500 font-medium">
                Add new tasks to stay on track
              </div>
            )}
            {hackathon.tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    disabled={hackathon.isGameOver}
                    onChange={() => handleToggleTask(task.id)}
                    className="h-4 w-4 rounded border-slate-300 text-[#5B3DF5] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className={`text-xs font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                  {!hackathon.isGameOver && (
                    <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Document Vault */}
      {activeTab === 'documents' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-900">Document Repository</h3>
            {!hackathon.isGameOver && (
              <button
                onClick={() => setAddDocOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5B3DF5] text-xs font-bold text-white shadow-sm hover:bg-[#4A2CE2] transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Document</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hackathon.documents.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-[#5B3DF5]" />
                  <div>
                    <h4 className="font-heading text-xs font-bold text-slate-900">{doc.name}</h4>
                    <span className="text-[10px] text-slate-500">{doc.size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={doc.url}
                    download
                    className="p-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#5B3DF5] hover:bg-slate-50 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                  {!hackathon.isGameOver && (
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Links */}
      {activeTab === 'links' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-900">Important Links</h3>
            {!hackathon.isGameOver && (
              <button
                onClick={() => setAddLinkOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5B3DF5] text-xs font-bold text-white shadow-sm hover:bg-[#4A2CE2] transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Link</span>
              </button>
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-600 mb-4 border-b pb-2">Hackathon Links</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ...(hackathon.websiteUrl ? [{ id: 'official-website', title: 'Official Website', url: hackathon.websiteUrl, type: 'Website' }] : []),
                ...(hackathon.registrationUrl ? [{ id: 'registration-portal', title: 'Registration Portal', url: hackathon.registrationUrl, type: 'Registration' }] : []),
                ...hackathon.links.filter(l => l.type !== 'Project')
              ].map((link) => (
                <div key={link.id} className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#5B3DF5] hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <LinkIcon className="h-5 w-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="font-bold text-slate-900 text-sm truncate pr-2">{link.title}</h5>
                      <a href={link.url} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 hover:text-[#5B3DF5] hover:underline truncate mt-0.5 block pr-2">
                        {link.url}
                      </a>
                    </div>
                  </div>
                  {!hackathon.isGameOver && link.id !== 'official-website' && link.id !== 'registration-portal' && (
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {hackathon.links.some(l => l.type === 'Project') && (
            <div>
              <h4 className="text-sm font-bold text-slate-600 mb-4 border-b pb-2">Project Links</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hackathon.links.filter(l => l.type === 'Project').map((link) => (
                  <div key={link.id} className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#5B3DF5] hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 overflow-hidden flex-1">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <ExternalLink className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <h5 className="font-bold text-slate-900 text-sm truncate pr-2">{link.title}</h5>
                        <a href={link.url} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 hover:text-[#5B3DF5] hover:underline truncate mt-0.5 block pr-2">
                          {link.url}
                        </a>
                      </div>
                    </div>
                    {!hackathon.isGameOver && (
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Team */}
      {activeTab === 'team' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          {!hackathon.isGameOver && (
            <form onSubmit={handleAddMember} className="space-y-4 border-b border-slate-200 pb-6">
              <h4 className="font-heading text-sm font-bold text-slate-900">+ Add Team Member</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    required
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]"
                  >
                    <option value="" disabled>Select Member</option>
                    {inbuiltMembers.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  {selectedMember === 'Custom Member' && (
                    <input
                      type="text"
                      value={customMemberName}
                      onChange={(e) => setCustomMemberName(e.target.value)}
                      placeholder="Enter member name"
                      required
                      className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]"
                    />
                  )}
                </div>
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="Role (Ex: Frontend Developer) (optional)"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]"
                />
                <input
                  type="text"
                  value={newMemberResponsibility}
                  onChange={(e) => setNewMemberResponsibility(e.target.value)}
                  placeholder="Responsibility (optional)"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#5B3DF5] text-xs font-bold text-white shadow-sm hover:bg-[#4A2CE2]"
              >
                Add Member
              </button>
            </form>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hackathon.team.map((t) => (
              <div key={t.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                {!hackathon.isGameOver && (
                  <button onClick={() => handleDeleteMember(t.id)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <h4 className="font-heading text-sm font-bold text-slate-900 pr-8">{t.memberName}</h4>
                <span className="text-xs font-bold text-[#5B3DF5] block mt-0.5">{t.role}</span>
                <p className="text-xs text-slate-600 mt-2 pr-8">{t.responsibility}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Notes */}
      {activeTab === 'notes' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          {!hackathon.isGameOver && (
            <form onSubmit={handleAddNote} className="space-y-3">
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Note title..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-900 focus:bg-white"
              />
              <textarea
                rows={3}
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Note details & scratchpad info..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-900 focus:bg-white resize-none"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-[#5B3DF5] text-xs font-bold text-white">
                Save Note
              </button>
            </form>
          )}

          <div className="space-y-3">
            {hackathon.notes.map((note) => (
              <div key={note.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 relative">
                {!hackathon.isGameOver && (
                  <button onClick={() => handleDeleteNote(note.id)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <h4 className="font-heading text-xs font-bold text-slate-900 pr-8">{note.title}</h4>
                <p className="text-xs text-slate-600 mt-1 pr-8">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Round Modal */}
      <AnimatePresence>
        {addRoundOpen && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
            <div onClick={() => setAddRoundOpen(false)} className="fixed inset-0 bg-slate-950/70" />
            <div className="relative z-10 w-full max-w-4xl bg-[#FAFBFC] rounded-3xl p-6 shadow-2xl border border-slate-200">
              <form onSubmit={handleAddRound} className="space-y-4">
                <div className="flex gap-4 items-center">
                  <h3 className="font-heading text-sm font-bold w-20">Round {hackathon.rounds.length + 1}</h3>
                  <input
                    type="text"
                    required
                    value={newRoundName}
                    onChange={(e) => setNewRoundName(e.target.value)}
                    placeholder="Round Name"
                    className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                  />
                  <select
                    value={newRoundType}
                    onChange={(e) => setNewRoundType(e.target.value as any)}
                    className="w-48 rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                  >
                    <option value="Select Type...">Select Type...</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Coding">Coding</option>
                    <option value="PPT">PPT</option>
                    <option value="Prototype">Prototype</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">START</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={newRoundStartDate}
                        onChange={(e) => setNewRoundStartDate(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                      />
                      <input
                        type="time"
                        value={newRoundStartTime}
                        onChange={(e) => setNewRoundStartTime(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">DEADLINE</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={newRoundDate}
                        onChange={(e) => setNewRoundDate(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                      />
                      <input
                        type="time"
                        value={newRoundTime}
                        onChange={(e) => setNewRoundTime(e.target.value)}
                        className="flex-1 rounded-xl border border-slate-200 p-2 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Round Details"
                    value={newRoundDetails}
                    onChange={(e) => setNewRoundDetails(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                  />
                  <input
                    type="date"
                    placeholder="Result Date"
                    value={newRoundResultDate}
                    onChange={(e) => setNewRoundResultDate(e.target.value)}
                    className="w-48 rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Submission Requirements"
                  value={newRoundRequirements}
                  onChange={(e) => setNewRoundRequirements(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                />

                <div className="flex justify-end pt-2">
                  <button type="submit" className="w-full py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
                    Add Round
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Item Delete Confirmation Modal */}
      <AnimatePresence>
        {itemDeletePrompt && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
      {/* Add Document Modal */}
      <AnimatePresence>
        {addDocOpen && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
            <div onClick={() => setAddDocOpen(false)} className="fixed inset-0 bg-slate-950/70" />
            <div className="relative z-10 w-full max-w-md bg-[#FAFBFC] rounded-3xl p-6 shadow-2xl border border-slate-200">
              <form onSubmit={handleAddDocument} className="space-y-4">
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-4">Add Document</h3>
                <div>
                  <input
                    type="text"
                    required
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="Document Name (e.g. Presentation Template)"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:ring-2 focus:ring-[#5B3DF5] mb-4"
                  />
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-slate-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileUp className="w-6 h-6 mb-2 text-slate-500" />
                        <p className="mb-1 text-sm text-slate-500">
                          <span className="font-bold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-400">PDF, PPT, DOC, or Images</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setNewDocFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {newDocFile && (
                    <div className="mt-3 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center justify-between border border-emerald-100">
                      <span className="truncate">{newDocFile.name}</span>
                      <button type="button" onClick={() => setNewDocFile(null)} className="text-emerald-700 hover:text-emerald-900 p-1">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setAddDocOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newDocName || !newDocFile}
                    className="px-5 py-2.5 rounded-xl bg-[#5B3DF5] text-white text-xs font-bold hover:bg-[#4A2CE2] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload Document
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Legacy Entry Modal */}
      <AnimatePresence>
        {legacyModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLegacyModalOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl bg-white rounded-t-[40px] shadow-2xl border-t border-slate-200 overflow-hidden z-10 flex flex-col max-h-[75vh]"
            >
              {/* Drawer Handle */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full" />

              <div className="flex items-center justify-between p-6 pt-8 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-extrabold text-slate-900">Add to Forge Legacy</h2>
                    <p className="text-sm text-slate-500 font-medium">Archive hackathon to your history portfolio</p>
                  </div>
                </div>
                <button
                  onClick={() => setLegacyModalOpen(false)}
                  className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleAddToLegacy} className="p-8 space-y-6 overflow-y-auto flex-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Achievement</label>
                  <div className="flex gap-3">
                    <select
                      value={legacyResult}
                      onChange={(e) => setLegacyResult(e.target.value as HistoryResult | 'Custom')}
                      className={`rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                        legacyResult === 'Custom' ? 'w-1/3' : 'w-full'
                      }`}
                      required
                    >
                      <option value="Winner">Winner</option>
                      <option value="1st Runner Up">1st Runner Up</option>
                      <option value="2nd Runner Up">2nd Runner Up</option>
                      <option value="Participation">Participation</option>
                      <option value="Custom">Custom</option>
                    </select>

                    {legacyResult === 'Custom' && (
                      <motion.input
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        type="text"
                        value={legacyCustomResult}
                        onChange={(e) => setLegacyCustomResult(e.target.value)}
                        placeholder="e.g. Best UI/UX Award"
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                        autoFocus
                      />
                    )}
                  </div>
                </div>

                {hackathon.rounds.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Round Results</label>
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {hackathon.rounds.map((round, idx) => {
                        const res = legacyRoundResults[round.id] || '';
                        const isCustom = res === 'Custom';
                        return (
                          <div key={round.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <span className="text-sm font-semibold text-slate-800 w-full sm:w-1/3">Round {idx + 1}: {round.name}</span>
                            <div className="flex-1 flex gap-2">
                              <select
                                value={res}
                                onChange={(e) => setLegacyRoundResults(prev => ({ ...prev, [round.id]: e.target.value }))}
                                className={`rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${isCustom ? 'w-1/2 sm:w-1/3' : 'w-full'}`}
                                required
                              >
                                <option value="" disabled>Select Result</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Not Shortlisted">Not Shortlisted</option>
                                <option value="Participated">Participated</option>
                                <option value="Not participated">Not participated</option>
                                <option value="Custom">Custom</option>
                              </select>
                              {isCustom && (
                                <motion.input
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  type="text"
                                  value={legacyRoundCustomResults[round.id] || ''}
                                  onChange={(e) => setLegacyRoundCustomResults(prev => ({ ...prev, [round.id]: e.target.value }))}
                                  placeholder="Enter result"
                                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  required
                                  autoFocus
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Certificate Details</label>
                    <button
                      type="button"
                      onClick={() => setLegacyCertificates(prev => [...prev, { name: '', file: null }])}
                      className="text-xs font-bold text-[#5B3DF5] hover:text-[#4A2CE2] flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add Certificate
                    </button>
                  </div>
                  
                  {legacyCertificates.length === 0 ? (
                    <div className="text-xs text-slate-500 italic text-center py-2 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                      No certificates added. Click "+ Add Certificate" to upload one.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {legacyCertificates.map((cert, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => {
                              const newCerts = [...legacyCertificates];
                              newCerts[idx].name = e.target.value;
                              setLegacyCertificates(newCerts);
                            }}
                            placeholder="Certificate Name (e.g. Certificate of Excellence)"
                            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                          />
                          <label className="w-56 cursor-pointer flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 hover:bg-slate-100 focus-within:ring-2 focus-within:ring-amber-500 transition-colors">
                            <span className="text-sm text-slate-500 truncate mr-2">
                              {cert.file ? cert.file.name : 'Click to Upload PDF/Image'}
                            </span>
                            <FileUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <input 
                              type="file" 
                              accept="image/*,.pdf"
                              className="hidden" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const newCerts = [...legacyCertificates];
                                  newCerts[idx].file = e.target.files[0];
                                  setLegacyCertificates(newCerts);
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const newCerts = [...legacyCertificates];
                              newCerts.splice(idx, 1);
                              setLegacyCertificates(newCerts);
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Project Links</label>
                    <button
                      type="button"
                      onClick={() => setLegacyLinks(prev => [...prev, { title: '', url: '' }])}
                      className="text-xs font-bold text-[#5B3DF5] hover:text-[#4A2CE2] flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Add Link
                    </button>
                  </div>
                  
                  {legacyLinks.length === 0 ? (
                    <div className="text-xs text-slate-500 italic text-center py-2 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                      No project links added. Click "+ Add Link" to add GitHub, Demo, etc.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {legacyLinks.map((link, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={link.title}
                            onChange={(e) => {
                              const newLinks = [...legacyLinks];
                              newLinks[idx].title = e.target.value;
                              setLegacyLinks(newLinks);
                            }}
                            placeholder="Title (e.g. GitHub)"
                            className="w-1/3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...legacyLinks];
                              newLinks[idx].url = e.target.value;
                              setLegacyLinks(newLinks);
                            }}
                            placeholder="https://..."
                            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newLinks = [...legacyLinks];
                              newLinks.splice(idx, 1);
                              setLegacyLinks(newLinks);
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setLegacyModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Archive className="h-4 w-4" />
                    <span>Archive to Legacy</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Link Modal */}
      <AnimatePresence>
        {addLinkOpen && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
            <div onClick={() => setAddLinkOpen(false)} className="fixed inset-0 bg-slate-950/70" />
            <div className="relative z-10 w-full max-w-md bg-[#FAFBFC] rounded-3xl p-6 shadow-2xl border border-slate-200">
              <form onSubmit={handleAddLink} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-lg font-bold text-slate-900">Add New Link</h3>
                  <button type="button" onClick={() => setAddLinkOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Link Type</label>
                  <select
                    value={newLinkType}
                    onChange={(e) => setNewLinkType(e.target.value as 'hackathon' | 'project')}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                  >
                    <option value="hackathon">Hackathon Link</option>
                    <option value="project">Project Link</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Link Name</label>
                  <input
                    type="text"
                    required
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    placeholder="e.g. GitHub Repository"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Link URL</label>
                  <input
                    type="url"
                    required
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    placeholder="https://"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                  />
                </div>

                <button type="submit" className="w-full mt-2 py-2.5 rounded-xl bg-[#5B3DF5] hover:bg-[#4A2CE2] text-xs font-bold text-white shadow-sm transition-colors">
                  Add Link
                </button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
