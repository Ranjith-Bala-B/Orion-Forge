import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Layout,
  Layers,
  FileText,
  Link as LinkIcon,
  Users,
  Image as ImageIcon,
  ExternalLink,
  Download,
  Archive,
  Trophy,
  Check,
  X,
  Plus,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { HistoryEntry } from '../../types/vault';

interface HistoryWorkspaceProps {
  entry: HistoryEntry;
  onBack: () => void;
  onSaveEntry?: (entry: HistoryEntry) => void;
}

type WorkspaceTab = 'overview' | 'rounds' | 'documents' | 'links' | 'team' | 'gallery' | 'certificates';

export const HistoryWorkspace: React.FC<HistoryWorkspaceProps> = ({
  entry,
  onBack,
  onSaveEntry,
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [deletePromptMedia, setDeletePromptMedia] = useState<string | null>(null);

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onSaveEntry) {
      const newFiles = Array.from(e.target.files).map(file => {
        const isVideo = file.type.startsWith('video/');
        return URL.createObjectURL(file) + (isVideo ? '#video' : '#image');
      });
      onSaveEntry({
        ...entry,
        gallery: [...(entry.gallery || []), ...newFiles]
      });
    }
  };

  const handleGalleryDelete = (url: string) => {
    setDeletePromptMedia(url);
  };

  const confirmDeleteMedia = () => {
    if (!onSaveEntry || !deletePromptMedia) return;
    onSaveEntry({
      ...entry,
      gallery: (entry.gallery || []).filter(g => g !== deletePromptMedia)
    });
    setDeletePromptMedia(null);
  };

  const handleGalleryDownload = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.includes('#video') ? 'video.mp4' : 'image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Edit State
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [editedOverview, setEditedOverview] = useState(entry.overview || entry.description);

  const [isEditingProblemStatement, setIsEditingProblemStatement] = useState(false);
  const [editedProblemStatement, setEditedProblemStatement] = useState(entry.problemStatement || '');

  // Add Link State
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [newLinkType, setNewLinkType] = useState<'hackathon' | 'project'>('hackathon');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Add Certificate State
  const [isAddCertModalOpen, setIsAddCertModalOpen] = useState(false);
  const [newCertName, setNewCertName] = useState('');
  const [newCertFile, setNewCertFile] = useState<File | null>(null);
  const [newCertDate, setNewCertDate] = useState('');

  // Delete Prompt State
  const [itemDeletePrompt, setItemDeletePrompt] = useState<{ id: string, name: string, type: string, action: () => void } | null>(null);

  // Expanded Rounds State
  const [expandedRounds, setExpandedRounds] = useState<Record<string, boolean>>({});

  const toggleRound = (id: string) => {
    setExpandedRounds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl || !onSaveEntry) return;

    const newLink = {
      id: Date.now().toString(),
      title: newLinkTitle,
      url: newLinkUrl,
      type: newLinkType === 'hackathon' ? 'General' as const : 'Project' as const
    };

    const updatedEntry = { ...entry };
    if (newLinkType === 'hackathon') {
      updatedEntry.hackathonLinks = [...(updatedEntry.hackathonLinks || []), newLink];
    } else {
      updatedEntry.projectLinks = [...(updatedEntry.projectLinks || []), newLink];
    }

    onSaveEntry(updatedEntry);
    setIsAddLinkModalOpen(false);
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const handleDeleteLink = (linkId: string, linkType: 'hackathon' | 'project') => {
    if (!onSaveEntry) return;
    setItemDeletePrompt({
      id: linkId,
      name: 'Link',
      type: 'link',
      action: () => {
        const updatedEntry = { ...entry };
        if (linkType === 'hackathon') {
          updatedEntry.hackathonLinks = updatedEntry.hackathonLinks?.filter(l => l.id !== linkId);
        } else {
          updatedEntry.projectLinks = updatedEntry.projectLinks?.filter(l => l.id !== linkId);
        }
        onSaveEntry(updatedEntry);
        setItemDeletePrompt(null);
      }
    });
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertName || !newCertFile || !onSaveEntry) return;

    const newCert = {
      id: Date.now().toString(),
      name: newCertName,
      url: URL.createObjectURL(newCertFile),
      date: newCertDate || new Date().toISOString().split('T')[0],
    };

    const updatedEntry = {
      ...entry,
      certificates: [...(entry.certificates || []), newCert]
    };

    onSaveEntry(updatedEntry);
    setIsAddCertModalOpen(false);
    setNewCertName('');
    setNewCertFile(null);
    setNewCertDate('');
  };

  const handleDeleteCert = (certId: string) => {
    if (!onSaveEntry) return;
    setItemDeletePrompt({
      id: certId,
      name: 'Certificate',
      type: 'certificate',
      action: () => {
        const updatedEntry = {
          ...entry,
          certificates: entry.certificates?.filter(c => c.id !== certId),
          documents: entry.documents?.filter(d => d.id !== certId)
        };
        onSaveEntry(updatedEntry);
        setItemDeletePrompt(null);
      }
    });
  };

  const roundEntries = entry.roundResults ? Object.entries(entry.roundResults) : [];
  const hasHackathonLinks = entry.hackathonLinks && entry.hackathonLinks.length > 0;
  const hasProjectLinks = entry.projectLinks && entry.projectLinks.length > 0;

  return (
    <div className="space-y-6 relative h-full">
      {/* Top Bar with Back Button */}
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
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                WORKSPACE
              </span>
              <span className="text-xs font-semibold text-slate-500">{entry.organizer}</span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <h1 className="font-heading text-2xl font-extrabold text-slate-900">{entry.hackathonName}</h1>
            </div>
          </div>
        </div>

        {/* Completion Stamp / Achievement */}
        <div className="text-right flex items-center gap-4">
            <div>
              <span className="text-xs font-bold text-slate-700 block text-right">Achievement</span>
              <span className={`font-heading text-lg font-extrabold ${
                entry.result === 'Winner' ? 'text-blue-600' :
                entry.result === 'Runner-up' ? 'text-blue-500' :
                'text-emerald-500'
              }`}>
                {entry.result}
              </span>
            </div>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center font-heading text-xl shadow-inner ${
                entry.result === 'Winner' ? 'bg-blue-100 text-blue-600 border border-blue-200' :
                entry.result === 'Runner-up' ? 'bg-blue-100 text-blue-500 border border-blue-300' :
                'bg-emerald-100 text-emerald-500 border border-emerald-300'
            }`}>
              <Trophy className="h-6 w-6" />
            </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1 overflow-x-auto bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: <Layout className="h-4 w-4" /> },
          { id: 'rounds', label: `Rounds (${entry.rounds ? entry.rounds.length : (roundEntries.length || entry.roundsCount || 0)})`, icon: <Layers className="h-4 w-4" /> },
          { id: 'documents', label: `Document Vault (${entry.documents?.length || 0})`, icon: <FileText className="h-4 w-4" /> },
          { id: 'certificates', label: `Certificates (${(entry.certificates?.length || 0) + (entry.documents?.filter(d => d.category === 'Certificate').length || 0)})`, icon: <Award className="h-4 w-4" /> },
          { id: 'links', label: `Links (${(entry.hackathonLinks?.length || 0) + (entry.projectLinks?.length || 0)})`, icon: <LinkIcon className="h-4 w-4" /> },
          { id: 'team', label: `Team (${entry.teamMembers?.length || 0})`, icon: <Users className="h-4 w-4" /> },
          { id: 'gallery', label: `Gallery (${entry.gallery?.length || 0})`, icon: <ImageIcon className="h-4 w-4" /> },
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
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Organized By</span>
              <span className="font-heading text-sm font-bold text-slate-900">{entry.organizer}</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Hackathon Name</span>
              <span className="font-heading text-sm font-bold text-[#5B3DF5]">{entry.hackathonName}</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Achievement</span>
              <span className="font-heading text-sm font-bold text-emerald-600">{entry.result}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">About Hackathon</h3>
              {!isEditingOverview && onSaveEntry && (
                <button
                  onClick={() => setIsEditingOverview(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
            </div>
            
            {isEditingOverview ? (
              <div className="space-y-3">
                <textarea
                  value={editedOverview}
                  onChange={(e) => setEditedOverview(e.target.value)}
                  className="w-full text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border-2 border-[#5B3DF5] shadow-sm min-h-[120px] focus:outline-none focus:ring-4 focus:ring-[#5B3DF5]/10 resize-y"
                  placeholder="Enter details about the hackathon..."
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (onSaveEntry) {
                        onSaveEntry({ ...entry, overview: editedOverview });
                        setIsEditingOverview(false);
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B3DF5] text-white text-xs font-bold hover:bg-[#4A2DD4] transition-colors shadow-lg shadow-[#5B3DF5]/20"
                  >
                    <Check className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditedOverview(entry.overview || entry.description);
                      setIsEditingOverview(false);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200/80 whitespace-pre-wrap">
                {entry.overview || entry.description}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 mt-8">
              <h3 className="font-heading text-xs font-bold text-slate-900 uppercase tracking-wider">Problem Statement</h3>
              {!isEditingProblemStatement && onSaveEntry && (
                <button
                  onClick={() => setIsEditingProblemStatement(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
              )}
            </div>
            
            {isEditingProblemStatement ? (
              <div className="space-y-3">
                <textarea
                  value={editedProblemStatement}
                  onChange={(e) => setEditedProblemStatement(e.target.value)}
                  className="w-full text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl border-2 border-emerald-500 shadow-sm min-h-[120px] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 resize-y"
                  placeholder="Enter the problem statement..."
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (onSaveEntry) {
                        onSaveEntry({ ...entry, problemStatement: editedProblemStatement });
                        setIsEditingProblemStatement(false);
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditedProblemStatement(entry.problemStatement || '');
                      setIsEditingProblemStatement(false);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200/80 whitespace-pre-wrap">
                {entry.problemStatement || "No problem statement recorded."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Rounds */}
      {activeTab === 'rounds' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-900">Evaluation Rounds (Legacy Archive)</h3>
          </div>

          <div className="space-y-4">
            {entry.rounds && entry.rounds.length > 0 ? (
              entry.rounds.map((r, idx) => {
                const isExpanded = expandedRounds[r.id];
                return (
                <div
                  key={r.id}
                  className="p-6 rounded-2xl border transition-all space-y-4 bg-slate-50 border-slate-200 shadow-sm"
                >
                  <div className={`flex items-center justify-between ${isExpanded ? 'border-b pb-4' : ''}`}>
                    <div className="flex items-center gap-3">
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
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">
                          {entry.roundResults && entry.roundResults[r.name] ? entry.roundResults[r.name] : 'N/A'}
                        </span>
                        <button
                          onClick={() => toggleRound(r.id)}
                          className="text-[#3B82F6] hover:text-blue-600 transition-colors focus:outline-none p-1"
                        >
                          <ChevronDown className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 pt-2">
                          {/* Dates and Times */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Start</span>
                              <span className="text-sm font-semibold text-slate-800">{r.startDate || '-----'} {r.startTime && `at ${r.startTime}`}</span>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Deadline</span>
                              <span className="text-sm font-semibold text-slate-800">{r.deadlineDate || '-----'} {r.deadlineTime && `at ${r.deadlineTime}`}</span>
                            </div>
                          </div>
          
                          {/* Details & Results */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Round Details</span>
                              <p className="text-sm text-slate-700 whitespace-pre-wrap bg-white p-3 rounded-xl border border-slate-100 min-h-[60px]">
                                {r.submissionDetails || '-----'}
                              </p>
                            </div>
                            <div className="md:col-span-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Result Date</span>
                              <div className="text-sm font-semibold text-slate-800 bg-white p-3 rounded-xl border border-slate-100 h-[60px] flex items-center">
                                {r.resultDate || '-----'}
                              </div>
                            </div>
                          </div>
          
                          {/* Requirements */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Submission Requirements</span>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap bg-white p-3 rounded-xl border border-slate-100 min-h-[60px]">
                              {r.submissionRequirements || '-----'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )})
            ) : roundEntries.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No specific round details were recorded.</p>
            ) : (
              roundEntries.map(([roundName, roundResult], idx) => {
                const isExpanded = expandedRounds[`legacy-${idx}`];
                return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border transition-all space-y-4 bg-slate-50 border-slate-200 shadow-sm"
                >
                  <div className={`flex items-center justify-between ${isExpanded ? 'border-b pb-4' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-slate-500">Legacy Round {idx + 1}</span>
                        </div>
                        <h4 className="font-heading text-lg font-bold text-slate-900">{roundName}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300">
                          {roundResult || 'N/A'}
                        </span>
                        <button
                          onClick={() => toggleRound(`legacy-${idx}`)}
                          className="text-[#3B82F6] hover:text-blue-600 transition-colors focus:outline-none p-1"
                        >
                          <ChevronDown className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 text-sm text-slate-500 italic">
                          Detailed legacy round information is not available.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )})
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Documents */}
      {activeTab === 'documents' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-900">Document Vault</h3>
          </div>

          {(!entry.documents || entry.documents.length === 0) ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <FileText className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm font-semibold">No documents archived.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entry.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="group flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#5B3DF5] hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{doc.name}</h4>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">{doc.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-slate-200 text-slate-600 hover:bg-[#5B3DF5] hover:text-white transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Links */}
      {activeTab === 'links' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-900">Important Links</h3>
            {onSaveEntry && (
              <button
                onClick={() => setIsAddLinkModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5B3DF5] text-xs font-bold text-white shadow-sm hover:bg-[#4A2CE2] transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Link</span>
              </button>
            )}
          </div>

          {!hasHackathonLinks && !hasProjectLinks && (
             <div className="py-12 flex flex-col items-center justify-center text-slate-400">
             <LinkIcon className="h-12 w-12 mb-3 opacity-20" />
             <p className="text-sm font-semibold">No links archived.</p>
           </div>
          )}

          {hasHackathonLinks && (
             <div>
                <h4 className="text-sm font-bold text-slate-600 mb-4 border-b pb-2">Hackathon Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {entry.hackathonLinks!.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#5B3DF5] hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-3 overflow-hidden flex-1">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <LinkIcon className="h-5 w-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <h5 className="font-bold text-slate-900 text-sm truncate pr-2">{link.title}</h5>
                                    <span className="text-[10px] text-slate-500 truncate mt-0.5 block pr-2">{link.url}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-[#5B3DF5]" />
                                {onSaveEntry && link.id !== 'official-website' && link.id !== 'registration-portal' && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDeleteLink(link.id, 'hackathon');
                                        }}
                                        className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </a>
                    ))}
                </div>
             </div>
          )}

          {hasProjectLinks && (
             <div>
                <h4 className="text-sm font-bold text-slate-600 mb-4 border-b pb-2">Project Links</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {entry.projectLinks!.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#5B3DF5] hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-3 overflow-hidden flex-1">
                                <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <ExternalLink className="h-5 w-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <h5 className="font-bold text-slate-900 text-sm truncate pr-2">{link.title}</h5>
                                    <span className="text-[10px] text-slate-500 truncate mt-0.5 block pr-2">{link.url}</span>
                                </div>
                            </div>
                            {onSaveEntry && link.id && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteLink(link.id, 'project');
                                    }}
                                    className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0 ml-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </a>
                    ))}
                </div>
             </div>
          )}
        </div>
      )}

      {/* Tab 5: Team */}
      {activeTab === 'team' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-900">Team Members</h3>
          </div>

          {(!entry.teamMembers || entry.teamMembers.length === 0) ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <Users className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm font-semibold">No team members archived.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {entry.teamMembers.map((member: any, idx: number) => {
                const name = typeof member === 'string' ? member : (member.memberName || 'Unknown');
                const role = typeof member === 'string' ? 'Member' : (member.role || 'Member');
                return (
                  <div
                    key={typeof member === 'string' ? member : (member.id || idx)}
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{name}</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{role}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Gallery */}
      {activeTab === 'gallery' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-900">Gallery</h3>
            {onSaveEntry && (
              <div>
                <input 
                  type="file" 
                  ref={galleryInputRef} 
                  onChange={handleGalleryUpload} 
                  accept="image/*,video/*" 
                  multiple 
                  className="hidden" 
                />
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#5B3DF5] text-white hover:bg-[#4A2CE2] transition-colors shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add image/video
                </button>
              </div>
            )}
          </div>

          {(!entry.gallery || entry.gallery.length === 0) ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <ImageIcon className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm font-semibold">No images or videos in gallery.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {entry.gallery.some(g => !g.includes('#video')) && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Images</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {entry.gallery.filter(g => !g.includes('#video')).map((img, i) => (
                      <div key={i} className="group relative aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                        <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                          <button onClick={() => setSelectedMedia(img)} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition-colors">
                            View Fullscreen
                          </button>
                          <div className="flex gap-2">
                            <button onClick={() => handleGalleryDownload(img)} className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors" title="Download">
                              <Download className="h-4 w-4" />
                            </button>
                            {onSaveEntry && (
                              <button onClick={() => handleGalleryDelete(img)} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {entry.gallery.some(g => g.includes('#video')) && (
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Videos</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {entry.gallery.filter(g => g.includes('#video')).map((vid, i) => (
                      <div key={i} className="group relative aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-200 bg-black flex items-center justify-center">
                        <video src={vid} className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                          <button onClick={() => setSelectedMedia(vid)} className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-xs font-bold transition-colors">
                            Play Fullscreen
                          </button>
                          <div className="flex gap-2">
                            <button onClick={() => handleGalleryDownload(vid)} className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors" title="Download">
                              <Download className="h-4 w-4" />
                            </button>
                            {onSaveEntry && (
                              <button onClick={() => handleGalleryDelete(vid)} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors" title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 7: Certificates */}
      {activeTab === 'certificates' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-900">Certificates</h3>
            {onSaveEntry && (
              <button
                onClick={() => setIsAddCertModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#5B3DF5] text-white hover:bg-[#4A2CE2] transition-colors shadow-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Certificate
              </button>
            )}
          </div>

          {(!entry.certificates || entry.certificates.length === 0) && !entry.certificateUrl ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <Award className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-sm font-semibold">No certificates archived.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Legacy certificateUrl rendering removed to prevent duplicates with documents */}
              {entry.documents?.filter(d => d.category === 'Certificate').map((cert) => (
                <div key={cert.id} className="flex flex-col p-4 rounded-2xl border border-slate-200 bg-slate-50 relative group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <Award className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1" title={cert.name}>{cert.name}</h4>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{cert.uploadedAt}</p>
                      </div>
                    </div>
                    {onSaveEntry && (
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all absolute top-2 right-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#5B3DF5] transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </a>
                    <a
                      href={cert.url}
                      download
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#5B3DF5] transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Save
                    </a>
                  </div>
                </div>
              ))}
              {entry.certificates?.map((cert) => (
                <div key={cert.id} className="flex flex-col p-4 rounded-2xl border border-slate-200 bg-slate-50 relative group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                        <Award className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1" title={cert.name}>{cert.name}</h4>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{cert.date}</p>
                      </div>
                    </div>
                    {onSaveEntry && (
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all absolute top-2 right-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#5B3DF5] transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </a>
                    <a
                      href={cert.url}
                      download
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-[#5B3DF5] transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Save
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Link Modal */}
      <AnimatePresence>
        {isAddLinkModalOpen && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
            <div onClick={() => setIsAddLinkModalOpen(false)} className="fixed inset-0 bg-slate-950/70" />
            <div className="relative z-10 w-full max-w-md bg-[#FAFBFC] rounded-3xl p-6 shadow-2xl border border-slate-200">
              <form onSubmit={handleAddLink} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-lg font-bold text-slate-900">Add New Link</h3>
                  <button type="button" onClick={() => setIsAddLinkModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
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

      {/* Add Certificate Modal */}
      <AnimatePresence>
        {isAddCertModalOpen && (
          <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4">
            <div onClick={() => setIsAddCertModalOpen(false)} className="fixed inset-0 bg-slate-950/70" />
            <div className="relative z-10 w-full max-w-md bg-[#FAFBFC] rounded-3xl p-6 shadow-2xl border border-slate-200">
              <form onSubmit={handleAddCert} className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-heading text-lg font-bold text-slate-900">Add Certificate</h3>
                  <button type="button" onClick={() => setIsAddCertModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Certificate Name</label>
                  <input
                    type="text"
                    required
                    value={newCertName}
                    onChange={(e) => setNewCertName(e.target.value)}
                    placeholder="e.g. Winner Certificate"
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Certificate File</label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setNewCertFile(e.target.files[0]);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-1 focus:ring-[#5B3DF5] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#5B3DF5]/10 file:text-[#5B3DF5] hover:file:bg-[#5B3DF5]/20 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Issue Date (Optional)</label>
                  <input
                    type="date"
                    value={newCertDate}
                    onChange={(e) => setNewCertDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:ring-1 focus:ring-[#5B3DF5]"
                  />
                </div>

                <button type="submit" className="w-full mt-2 py-2.5 rounded-xl bg-[#5B3DF5] hover:bg-[#4A2CE2] text-xs font-bold text-white shadow-sm transition-colors">
                  Add Certificate
                </button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {itemDeletePrompt && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div 
              onClick={() => setItemDeletePrompt(null)} 
              className="fixed inset-0 bg-slate-950/70" 
            />
            <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">Delete {itemDeletePrompt.type}</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Are you sure you want to delete this {itemDeletePrompt.type.toLowerCase()}? This action cannot be undone.
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
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Fullscreen Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div 
              onClick={() => setSelectedMedia(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm cursor-zoom-out"
            />
            <div className="relative z-10 w-full max-w-6xl max-h-[90vh] flex items-center justify-center">
              <button 
                onClick={() => setSelectedMedia(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              {selectedMedia.includes('#video') ? (
                <video src={selectedMedia} controls autoPlay className="max-w-full max-h-[85vh] rounded-xl shadow-2xl" />
              ) : (
                <img src={selectedMedia} alt="Fullscreen Media" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Media Confirmation Modal */}
      <AnimatePresence>
        {deletePromptMedia && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div 
              onClick={() => setDeletePromptMedia(null)} 
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">Delete Media</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Are you sure you want to delete this {deletePromptMedia.includes('#video') ? 'video' : 'image'} from the gallery? This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeletePromptMedia(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteMedia}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                  >
                    Delete Media
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
