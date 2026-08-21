import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Edit3, Plus, Trash2, Save, RefreshCw, CheckCircle2, X, Check } from 'lucide-react';
import { cmsService } from '../../services/cmsService';
import { CMSData } from '../../types/cms';
import { ImageCropperModal } from './ImageCropperModal';

const BubbleArrayEditor = ({ items, onChange, label, placeholder }: { items: string[], onChange: (newItems: string[]) => void, label: string, placeholder?: string }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...items, inputValue.trim()]);
      setInputValue('');
    }
  };

  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-bold border border-[#3B82F6]/20">
            {item}
            <button type="button" onClick={() => onChange(items.filter((_, index) => index !== i))} className="hover:text-blue-900 cms-edit-only"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2 cms-edit-only">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-slate-200 p-2 text-xs" 
        />
        <button type="button" onClick={handleAdd} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors shadow-sm border border-slate-200">Add</button>
      </div>
    </div>
  );
};

const ContributorsEditor = ({ teamMembers, onChange }: { teamMembers: string[], onChange: (newMembers: string[]) => void }) => {
  const predefinedMembers = ["Ranjith Bala B", "Ragul S", "Vishal M", "Arul Raj W"];
  const [selectedOption, setSelectedOption] = useState(predefinedMembers[0]);
  const [customName, setCustomName] = useState('');

  const handleAdd = () => {
    const nameToAdd = selectedOption === 'custom' ? customName.trim() : selectedOption;
    if (nameToAdd && !teamMembers.includes(nameToAdd)) {
      onChange([...teamMembers, nameToAdd]);
      if (selectedOption === 'custom') setCustomName('');
    }
  };

  return (
    <div>
      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Contributors</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {teamMembers.map((member, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-bold border border-purple-500/20">
            {member}
            <button type="button" onClick={() => onChange(teamMembers.filter((_, index) => index !== i))} className="hover:text-purple-900 cms-edit-only"><X className="h-3 w-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2 cms-edit-only">
        <div className="flex items-center gap-2">
          <select 
            value={selectedOption} 
            onChange={(e) => setSelectedOption(e.target.value)}
            className="rounded-lg border border-slate-200 p-2 text-xs bg-white focus:outline-none"
          >
            {predefinedMembers.map(m => <option key={m} value={m}>{m}</option>)}
            <option value="custom">custom...</option>
          </select>
          {selectedOption === 'custom' && (
            <input 
              type="text" 
              value={customName} 
              onChange={(e) => setCustomName(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              placeholder="Enter custom name"
              className="flex-1 rounded-lg border border-slate-200 p-2 text-xs min-w-[120px] focus:outline-none" 
            />
          )}
          <button type="button" onClick={handleAdd} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors shadow-sm border border-slate-200">Add</button>
        </div>
      </div>
    </div>
  );
};

const EditToggleButton = ({ isEditing, onToggle }: { isEditing: boolean, onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors shadow-sm border z-10 always-visible ${
      isEditing 
        ? 'bg-emerald-100 text-emerald-600 border-emerald-200 hover:bg-emerald-600 hover:text-white' 
        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#5B3DF5] hover:text-white'
    }`}
    title={isEditing ? "Done Editing" : "Edit Details"}
  >
    {isEditing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
  </button>
);

interface OrionForgeCMSProps {
  initialSection?: 'hero' | 'team' | 'projects' | 'achievements' | 'stats' | 'footer';
  initialOpenDrawer?: 'project' | 'achievement' | null;
}

export const OrionForgeCMS: React.FC<OrionForgeCMSProps> = (props) => {
  const [cmsData, setCmsData] = useState<CMSData | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    cmsService.getCMSData().then(data => {
      setCmsData(data);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold animate-pulse">Connecting to Supabase and loading CMS Data...</div>;
  }
  if (!cmsData) {
    return <div className="p-8 text-center text-red-500 font-bold">Failed to load CMS data. Check Supabase connection.</div>;
  }

  return <OrionForgeCMSInner {...props} initialData={cmsData} />;
};

const OrionForgeCMSInner: React.FC<OrionForgeCMSProps & { initialData: CMSData }> = ({
  initialSection = 'hero',
  initialOpenDrawer = null,
  initialData,
}) => {
  const [cmsData, setCmsData] = useState<CMSData>(initialData);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<'hero' | 'team' | 'projects' | 'achievements' | 'stats' | 'footer'>(initialSection);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [croppingImageSrc, setCroppingImageSrc] = useState('');
  const [croppingTarget, setCroppingTarget] = useState<{ type: 'hero' } | { type: 'team', index: number } | { type: 'projectArchitecture', index: number } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [isAddProjectDrawerOpen, setIsAddProjectDrawerOpen] = useState(initialOpenDrawer === 'project');
  const [draftProject, setDraftProject] = useState<any>(initialOpenDrawer === 'project' ? {
    id: Date.now().toString(),
    name: 'New Project',
    category: 'NEW CATEGORY',
    shortDescription: '',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600',
    problemStatement: '',
    solution: '',
    features: [],
    techStack: [],
    architectureDiagram: '',
    resultsImpact: '',
    links: { repository: '', demo: '', ppt: '', video: '' },
    gallery: []
  } : null);
  const [isAddAchievementDrawerOpen, setIsAddAchievementDrawerOpen] = useState(initialOpenDrawer === 'achievement');
  const [draftAchievement, setDraftAchievement] = useState<any>(initialOpenDrawer === 'achievement' ? {
    id: Date.now().toString(),
    event: 'New Event',
    title: 'New Achievement Title',
    badge: '🏆 Winner',
    date: new Date().toLocaleDateString(),
    description: '',
    fullDescription: '',
    image: 'https://images.unsplash.com/photo-1567168539593-59673ababaae?auto=format&fit=crop&q=80&w=800',
    gallery: [],
    teamMembers: []
  } : null);
  const [achievementToDelete, setAchievementToDelete] = useState<number | null>(null);
  const [editModes, setEditModes] = useState<Record<string, boolean>>({});
  const [showPublishAlert, setShowPublishAlert] = useState(false);

  React.useEffect(() => {
    if (initialSection) setActiveSection(initialSection);
    
    if (initialOpenDrawer === 'project') {
      setIsAddProjectDrawerOpen(true);
      if (!draftProject) {
        setDraftProject({
          id: Date.now().toString(),
          name: 'New Project',
          category: 'NEW CATEGORY',
          shortDescription: '',
          thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
          coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600',
          problemStatement: '',
          solution: '',
          features: [],
          techStack: [],
          architectureDiagram: '',
          resultsImpact: '',
          links: { repository: '', demo: '', ppt: '', video: '' },
          gallery: []
        });
      }
    } else if (initialOpenDrawer === 'achievement') {
      setIsAddAchievementDrawerOpen(true);
      if (!draftAchievement) {
        setDraftAchievement({
          id: Date.now().toString(),
          event: 'New Event',
          title: 'New Achievement Title',
          badge: '🏆 Winner',
          date: new Date().toLocaleDateString(),
          description: '',
          fullDescription: '',
          image: 'https://images.unsplash.com/photo-1567168539593-59673ababaae?auto=format&fit=crop&q=80&w=800',
          gallery: [],
          teamMembers: []
        });
      }
    }
  }, [initialSection, initialOpenDrawer]);

  const toggleEditMode = (key: string) => {
    setEditModes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const renderProjectForm = (proj: any, onChange: (updated: any) => void, idx: number, isEditing: boolean = true) => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">Project Name</label>
          <input type="text" value={proj.name} onChange={(e) => onChange({ ...proj, name: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1 font-bold text-slate-900" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">Short Description</label>
          <input type="text" value={proj.shortDescription} onChange={(e) => onChange({ ...proj, shortDescription: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1" />
        </div>
      </div>

      {/* Detailed Texts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">Problem Statement</label>
          <textarea rows={3} readOnly={!isEditing} value={proj.problemStatement} onChange={(e) => onChange({ ...proj, problemStatement: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1 resize-none focus:outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase">Proposed Solution</label>
          <textarea rows={3} readOnly={!isEditing} value={proj.solution} onChange={(e) => onChange({ ...proj, solution: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1 resize-none focus:outline-none" />
        </div>
      </div>

      {/* Bubble Arrays */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <BubbleArrayEditor
          label="Key Capabilities"
          placeholder="Add capability..."
          items={proj.features}
          onChange={(newFeatures) => onChange({ ...proj, features: newFeatures })}
        />
        <BubbleArrayEditor
          label="Technology Stack"
          placeholder="Add tech..."
          items={proj.techStack}
          onChange={(newTech) => onChange({ ...proj, techStack: newTech })}
        />
      </div>

      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase">Results & Operational Impact</label>
        <textarea rows={2} readOnly={!isEditing} value={proj.resultsImpact} onChange={(e) => onChange({ ...proj, resultsImpact: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1 resize-none focus:outline-none" />
      </div>

      {/* Architecture & Media */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Architecture Overview</label>
          {proj.architectureDiagram ? (
            <div className="relative group rounded-xl overflow-hidden border border-slate-200 mb-2">
              <img src={proj.architectureDiagram} alt="Architecture" onClick={() => setPreviewImage(proj.architectureDiagram)} className="w-full h-24 object-cover cursor-pointer hover:opacity-80 transition-opacity" />
              <button type="button" onClick={() => onChange({ ...proj, architectureDiagram: '' })} className="absolute top-1 right-1 bg-white/80 p-1 rounded hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cms-edit-only"><X className="h-3 w-3" /></button>
            </div>
          ) : null}
          <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setCroppingImageSrc(reader.result as string); setCroppingTarget({ type: 'projectArchitecture', index: idx }); setIsCropperOpen(true); e.target.value = ''; }; reader.readAsDataURL(file); } }} className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#3B82F6]/10 file:text-[#3B82F6] w-full" />
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase">GitHub Repo Link</label>
            <input type="url" value={proj.links.repository} onChange={(e) => onChange({ ...proj, links: { ...proj.links, repository: e.target.value } })} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Demo Video Upload</label>
            <div className="flex items-center gap-2">
              <input type="file" accept="video/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { if (file.size > 1024 * 1024) { alert('Video file is too large (max 1MB for Local CMS). Please use a URL instead.'); return; } const reader = new FileReader(); reader.onloadend = () => { onChange({ ...proj, links: { ...proj.links, video: reader.result as string } }) }; reader.readAsDataURL(file); } }} className="flex-1 text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-purple-500/10 file:text-purple-600 w-full" />
              {proj.links.video && ( <a href={proj.links.video} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-bold hover:underline whitespace-nowrap">View</a> )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Presentation Deck (PPT/PDF)</label>
            <div className="flex items-center gap-2">
              <input type="file" accept=".pdf,.ppt,.pptx" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { onChange({ ...proj, links: { ...proj.links, ppt: reader.result as string } }) }; reader.readAsDataURL(file); } }} className="flex-1 text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-emerald-500/10 file:text-emerald-600 w-full" />
              {proj.links.ppt && ( <a href={proj.links.ppt} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-bold hover:underline whitespace-nowrap">View</a> )}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="pt-4 border-t border-slate-200">
        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Gallery Images</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {proj.gallery.map((imgSrc: string, imgIdx: number) => (
            <div key={imgIdx} className="relative group rounded-lg overflow-hidden border border-slate-200 h-16 w-24">
              <img src={imgSrc} alt="Gallery item" onClick={() => setPreviewImage(imgSrc)} className="h-full w-full object-cover cursor-pointer hover:opacity-80 transition-opacity" />
              <button type="button" onClick={() => { const copyGallery = [...proj.gallery]; copyGallery.splice(imgIdx, 1); onChange({ ...proj, gallery: copyGallery }) }} className="absolute top-1 right-1 bg-white/90 p-1 rounded-sm hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cms-edit-only"><X className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={(e) => { const files = Array.from(e.target.files || []); Promise.all(files.map(file => new Promise<string>((resolve) => { const reader = new FileReader(); reader.onloadend = () => resolve(reader.result as string); reader.readAsDataURL(file); }))).then(base64s => { onChange({ ...proj, gallery: [...proj.gallery, ...base64s] }) }); e.target.value = ''; }} className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-slate-200 file:text-slate-700" />
      </div>
    </div>
  );

  const renderAchievementForm = (item: any, onChange: (updated: any) => void, idx: number, isEditing: boolean = true) => (
    <div className="space-y-4 relative group">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Hackathon Name</label>
          <input type="text" value={item.event} onChange={(e) => onChange({ ...item, event: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold" readOnly={!isEditing} />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Prize Details</label>
          <input type="text" value={item.badge} onChange={(e) => onChange({ ...item, badge: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold" readOnly={!isEditing} />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Headline</label>
          <input type="text" value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold" readOnly={!isEditing} />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Achievement Date</label>
          <input type="text" value={item.date} onChange={(e) => onChange({ ...item, date: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-xs font-bold" readOnly={!isEditing} />
        </div>
      </div>
      
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Short Description</label>
        <textarea rows={2} value={item.description} onChange={(e) => onChange({ ...item, description: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-xs resize-none focus:outline-none" readOnly={!isEditing} />
      </div>
      
      <div>
        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Overview</label>
        <textarea rows={3} value={item.fullDescription} onChange={(e) => onChange({ ...item, fullDescription: e.target.value })} className="w-full rounded-lg border border-slate-200 p-2 text-xs resize-none focus:outline-none" readOnly={!isEditing} />
      </div>

      <div className="pt-4 border-t border-slate-200">
        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Cover Image (Front)</label>
        {item.image && (
          <div className="relative group rounded-lg overflow-hidden border border-slate-200 h-24 w-40 mb-3">
            <img src={item.image} alt="Cover" onClick={() => setPreviewImage(item.image)} className="h-full w-full object-cover cursor-pointer hover:opacity-80 transition-opacity" />
            <button type="button" onClick={() => onChange({ ...item, image: '' })} className="absolute top-1 right-1 bg-white/90 p-1 rounded-sm hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cms-edit-only"><X className="h-4 w-4" /></button>
          </div>
        )}
        <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { onChange({ ...item, image: reader.result as string }) }; reader.readAsDataURL(file); } e.target.value = ''; }} className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-slate-200 file:text-slate-700 cms-edit-only" />
      </div>

      <div className="pt-4 border-t border-slate-200">
        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Certificates (Images)</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {(item.gallery || []).map((imgSrc: string, imgIdx: number) => (
            <div key={imgIdx} className="relative group rounded-lg overflow-hidden border border-slate-200 h-16 w-24">
              <img src={imgSrc} alt="Certificate" onClick={() => setPreviewImage(imgSrc)} className="h-full w-full object-cover cursor-pointer hover:opacity-80 transition-opacity" />
              <button type="button" onClick={() => { const copyGallery = [...(item.gallery || [])]; copyGallery.splice(imgIdx, 1); onChange({ ...item, gallery: copyGallery }) }} className="absolute top-1 right-1 bg-white/90 p-1 rounded-sm hover:bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cms-edit-only"><X className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={(e) => { const files = Array.from(e.target.files || []); Promise.all(files.map(file => new Promise<string>((resolve) => { const reader = new FileReader(); reader.onloadend = () => resolve(reader.result as string); reader.readAsDataURL(file); }))).then(base64s => { onChange({ ...item, gallery: [...(item.gallery || []), ...base64s] }) }); e.target.value = ''; }} className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-slate-200 file:text-slate-700 cms-edit-only" />
      </div>

      <ContributorsEditor 
        teamMembers={item.teamMembers || []}
        onChange={(newMembers) => onChange({ ...item, teamMembers: newMembers })}
      />
    </div>
  );

  const handleSave = () => {
    try {
      cmsService.saveCMSData(cmsData);
      setSavedSuccess(true);
      setShowPublishAlert(false);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error("Save failed:", e);
      alert("Failed to publish CMS changes. The data size might exceed local storage limits. Try reducing image sizes.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner in Sky Blue Blending with White Theme */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-sky-100 border border-white/80 shadow-[0_20px_50px_-15px_rgba(59,130,246,0.3)]">
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#1D4ED8] shadow-md">
            <FileCode className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-white">Orion Forge Live CMS</h1>
            <p className="text-xs font-medium text-white">Edit every section of the public website in real-time without touching source code.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setShowPublishAlert(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1D4ED8] text-xs font-bold text-white shadow-lg hover:bg-blue-800 active:scale-98"
          >
            <Save className="h-4 w-4" />
            <span>Publish CMS Changes</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>Public website content updated & persisted in LocalStorage!</span>
        </motion.div>
      )}

      {/* Section Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-hide">
        {(['hero', 'team', 'projects', 'achievements', 'stats', 'footer'] as const).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-5 py-2 text-xs font-bold rounded-full capitalize transition-colors flex-shrink-0 whitespace-nowrap ${
              activeSection === section
                ? 'bg-[#3B82F6] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200'
            }`}
          >
            {section} Section
          </button>
        ))}
      </div>

      {/* Editor Content Area */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        {activeSection === 'hero' && (
          <div className={`space-y-4 max-w-2xl ${!editModes['hero'] ? 'cms-readonly-mode' : ''}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-slate-900">Hero Section Headlines</h3>
              <EditToggleButton isEditing={!!editModes['hero']} onToggle={() => toggleEditMode('hero')} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Badge Text</label>
              <input
                type="text"
                readOnly={!editModes['hero']}
                value={cmsData.site.hero.badge}
                onChange={(e) =>
                  setCmsData({
                    ...cmsData,
                    site: {
                      ...cmsData.site,
                      hero: { ...cmsData.site.hero, badge: e.target.value },
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Heading Line 1 (Max 15)</label>
              <input
                type="text"
                maxLength={15}
                readOnly={!editModes['hero']}
                value={cmsData.site.hero.titleLine1}
                onChange={(e) =>
                  setCmsData({
                    ...cmsData,
                    site: {
                      ...cmsData.site,
                      hero: { ...cmsData.site.hero, titleLine1: e.target.value },
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Heading Line 2 (Max 15)</label>
              <input
                type="text"
                maxLength={15}
                readOnly={!editModes['hero']}
                value={cmsData.site.hero.titleLine2}
                onChange={(e) =>
                  setCmsData({
                    ...cmsData,
                    site: {
                      ...cmsData.site,
                      hero: { ...cmsData.site.hero, titleLine2: e.target.value },
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Heading Line 3 (Max 15)</label>
              <input
                type="text"
                maxLength={15}
                readOnly={!editModes['hero']}
                value={cmsData.site.hero.titleLine3}
                onChange={(e) =>
                  setCmsData({
                    ...cmsData,
                    site: {
                      ...cmsData.site,
                      hero: { ...cmsData.site.hero, titleLine3: e.target.value },
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Heading Line 4 (Max 15)</label>
              <input
                type="text"
                maxLength={15}
                readOnly={!editModes['hero']}
                value={cmsData.site.hero.titleLine4}
                onChange={(e) =>
                  setCmsData({
                    ...cmsData,
                    site: {
                      ...cmsData.site,
                      hero: { ...cmsData.site.hero, titleLine4: e.target.value },
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subtitle Summary (Max 170)</label>
              <textarea
                rows={3}
                maxLength={170}
                readOnly={!editModes['hero']}
                value={cmsData.site.hero.subtitle}
                onChange={(e) =>
                  setCmsData({
                    ...cmsData,
                    site: {
                      ...cmsData.site,
                      hero: { ...cmsData.site.hero, subtitle: e.target.value },
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Logo Text (Header)</label>
              <input
                type="text"
                readOnly={!editModes['hero']}
                value={cmsData.site.name}
                onChange={(e) =>
                  setCmsData({
                    ...cmsData,
                    site: {
                      ...cmsData.site,
                      name: e.target.value,
                    },
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Graphic Logo Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setCroppingImageSrc(reader.result as string);
                      setCroppingTarget({ type: 'hero' });
                      setIsCropperOpen(true);
                      e.target.value = '';
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#3B82F6]/10 file:text-[#3B82F6] hover:file:bg-[#3B82F6]/20"
              />
              {cmsData.site.hero.coreGraphicImage && (
                 <div className="mt-3 flex items-center gap-4 p-3 border border-slate-200 rounded-xl bg-slate-50">
                   <img src={cmsData.site.hero.coreGraphicImage} alt="Preview" className="h-16 object-contain rounded drop-shadow-sm" />
                   <button type="button" onClick={() => setCmsData({...cmsData, site: {...cmsData.site, hero: {...cmsData.site.hero, coreGraphicImage: ''}}})} className="text-xs text-red-500 font-bold hover:underline cms-edit-only">Remove Image</button>
                 </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'team' && (
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-slate-900">Team Members Manager ({cmsData.team.length})</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {cmsData.team.map((member, idx) => {
                const isEditing = !!editModes[`team-${idx}`];
                return (
                <div key={member.id} className={`p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-sm relative group ${!isEditing ? 'cms-readonly-mode' : ''}`}>
                  <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    <EditToggleButton isEditing={isEditing} onToggle={() => toggleEditMode(`team-${idx}`)} />
                  </div>
                  <div className="flex items-center gap-4 border-b border-slate-200 pb-4 pr-12">
                    {member.avatar ? (
                      <img src={member.avatar} alt="Avatar" onClick={() => setPreviewImage(member.avatar)} className="h-16 w-16 rounded-xl object-cover shadow-sm border border-slate-200 cursor-pointer hover:opacity-80 transition-opacity" />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">?</div>
                    )}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => {
                          const copy = [...cmsData.team];
                          copy[idx].name = e.target.value;
                          setCmsData({ ...cmsData, team: copy });
                        }}
                        placeholder="Name..."
                        className="w-full rounded-lg border border-slate-200 p-2 text-sm font-bold text-slate-900 mb-2"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCroppingImageSrc(reader.result as string);
                              setCroppingTarget({ type: 'team', index: idx });
                              setIsCropperOpen(true);
                              e.target.value = '';
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-[#3B82F6]/10 file:text-[#3B82F6]"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Role</label>
                      <input type="text" value={member.role} onChange={(e) => { const copy = [...cmsData.team]; copy[idx].role = e.target.value; setCmsData({ ...cmsData, team: copy }); }} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Short Bio</label>
                      <textarea rows={2} readOnly={!isEditing} value={member.bio} onChange={(e) => { const copy = [...cmsData.team]; copy[idx].bio = e.target.value; setCmsData({ ...cmsData, team: copy }); }} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1 resize-none focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Detailed About</label>
                      <textarea rows={3} readOnly={!isEditing} value={member.detailedAbout} onChange={(e) => { const copy = [...cmsData.team]; copy[idx].detailedAbout = e.target.value; setCmsData({ ...cmsData, team: copy }); }} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1 resize-none focus:outline-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Email</label>
                        <input type="email" value={member.email} onChange={(e) => { const copy = [...cmsData.team]; copy[idx].email = e.target.value; setCmsData({ ...cmsData, team: copy }); }} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Phone</label>
                        <input type="text" value={member.phone} onChange={(e) => { const copy = [...cmsData.team]; copy[idx].phone = e.target.value; setCmsData({ ...cmsData, team: copy }); }} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">LinkedIn URL</label>
                        <input type="url" value={member.socials.linkedin} onChange={(e) => { const copy = [...cmsData.team]; copy[idx].socials.linkedin = e.target.value; setCmsData({ ...cmsData, team: copy }); }} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">GitHub URL</label>
                        <input type="url" value={member.socials.github} onChange={(e) => { const copy = [...cmsData.team]; copy[idx].socials.github = e.target.value; setCmsData({ ...cmsData, team: copy }); }} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Instagram URL</label>
                      <input type="url" value={member.socials.instagram} onChange={(e) => { const copy = [...cmsData.team]; copy[idx].socials.instagram = e.target.value; setCmsData({ ...cmsData, team: copy }); }} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1" />
                    </div>

                    <BubbleArrayEditor
                      label="Core Expertise"
                      placeholder="Add expertise..."
                      items={member.skills}
                      onChange={(newSkills) => {
                        const copy = [...cmsData.team];
                        copy[idx].skills = newSkills;
                        setCmsData({ ...cmsData, team: copy });
                      }}
                    />
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Key Highlights (newline separated)</label>
                      <textarea rows={3} readOnly={!isEditing} value={member.experience.join('\n')} onChange={(e) => { const copy = [...cmsData.team]; copy[idx].experience = e.target.value.split('\n'); setCmsData({ ...cmsData, team: copy }); }} className="w-full rounded-lg border border-slate-200 p-2 text-xs mt-1 resize-none focus:outline-none" />
                    </div>
                    <BubbleArrayEditor
                      label="Featured Projects"
                      placeholder="Add project..."
                      items={member.projects}
                      onChange={(newProjects) => {
                        const copy = [...cmsData.team];
                        copy[idx].projects = newProjects;
                        setCmsData({ ...cmsData, team: copy });
                      }}
                    />

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Resume PDF</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const copy = [...cmsData.team];
                                copy[idx].cvUrl = reader.result as string;
                                setCmsData({ ...cmsData, team: copy });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="flex-1 text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-emerald-500/10 file:text-emerald-600"
                        />
                        {member.cvUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              if (member.cvUrl.startsWith('data:')) {
                                const arr = member.cvUrl.split(',');
                                const bstr = atob(arr[1]);
                                let n = bstr.length;
                                const u8arr = new Uint8Array(n);
                                while (n--) {
                                  u8arr[n] = bstr.charCodeAt(n);
                                }
                                const blob = new Blob([u8arr], { type: 'application/pdf' });
                                const url = URL.createObjectURL(blob);
                                window.open(url, '_blank');
                              } else {
                                window.open(member.cvUrl, '_blank');
                              }
                            }}
                            className="text-[10px] text-blue-600 font-bold hover:underline whitespace-nowrap"
                          >
                            View Current CV
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-slate-900">Projects Manager ({cmsData.projects.length})</h3>
              <button
                type="button"
                onClick={() => {
                  setDraftProject({
                    id: Date.now().toString(),
                    name: 'New Project',
                    category: 'NEW CATEGORY',
                    shortDescription: '',
                    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
                    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600',
                    problemStatement: '',
                    solution: '',
                    features: [],
                    techStack: [],
                    architectureDiagram: '',
                    resultsImpact: '',
                    links: { repository: '', demo: '', ppt: '', video: '' },
                    gallery: []
                  });
                  setIsAddProjectDrawerOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5B3DF5] text-white text-xs font-bold hover:bg-[#4A2CE2] transition-colors"
              >
                + Add Project
              </button>
            </div>
            <div className="space-y-6">
              {cmsData.projects.map((proj, idx) => {
                const isEditing = !!editModes[`project-${idx}`];
                return (
                <div key={proj.id} className={`p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm space-y-6 relative group/project ${!isEditing ? 'cms-readonly-mode' : ''}`}>
                  <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    <EditToggleButton isEditing={isEditing} onToggle={() => toggleEditMode(`project-${idx}`)} />
                    <button
                      type="button"
                      onClick={() => setProjectToDelete(idx)}
                      className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-sm border border-red-200 cms-edit-only"
                      title="Delete Project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {renderProjectForm(
                    proj,
                    (updated) => {
                      const copy = [...cmsData.projects];
                      copy[idx] = updated;
                      setCmsData({ ...cmsData, projects: copy });
                    },
                    idx,
                    isEditing
                  )}
                </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'achievements' && (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-slate-900">Achievements Manager ({cmsData.achievements.length})</h3>
              <button
                type="button"
                onClick={() => {
                  const newAchievement = {
                    id: Date.now().toString(),
                    title: 'New Achievement',
                    event: '',
                    date: '',
                    badge: '',
                    description: '',
                    fullDescription: '',
                    image: '',
                    certificatePreview: '',
                    gallery: [],
                    teamMembers: []
                  };
                  setDraftAchievement(newAchievement);
                  setIsAddAchievementDrawerOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#5B3DF5] text-white text-xs font-bold hover:bg-[#4A2CE2] transition-colors"
              >
                + Add Achievement
              </button>
            </div>
            <div className="space-y-6">
              {cmsData.achievements.map((item, idx) => {
                const isEditing = !!editModes[`achievement-${idx}`];
                return (
                <div key={item.id} className={`p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative group ${!isEditing ? 'cms-readonly-mode' : ''}`}>
                  <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                    <EditToggleButton isEditing={isEditing} onToggle={() => toggleEditMode(`achievement-${idx}`)} />
                    <button
                      type="button"
                      onClick={() => setAchievementToDelete(idx)}
                      className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors shadow-sm border border-red-200 cms-edit-only"
                      title="Delete Achievement"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {renderAchievementForm(
                    item,
                    (updated) => {
                      const copy = [...cmsData.achievements];
                      copy[idx] = updated;
                      setCmsData({ ...cmsData, achievements: copy });
                    },
                    idx,
                    isEditing
                  )}
                </div>
              );
              })}
              <button
                type="button"
                onClick={() => {
                  const newAchievement = {
                    id: Date.now().toString(),
                    title: 'New Achievement',
                    event: '',
                    date: '',
                    badge: '',
                    description: '',
                    fullDescription: '',
                    image: '',
                    certificatePreview: '',
                    gallery: [],
                    teamMembers: []
                  };
                  setDraftAchievement(newAchievement);
                  setIsAddAchievementDrawerOpen(true);
                }}
                className="w-full p-8 rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-[#5B3DF5] hover:bg-slate-50 transition-all flex flex-col items-center justify-center gap-3 text-slate-500 hover:text-[#5B3DF5] group"
              >
                <div className="h-12 w-12 rounded-full bg-slate-100 group-hover:bg-[#5B3DF5]/10 flex items-center justify-center transition-colors">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="font-bold text-sm">Add New Achievement</span>
              </button>
            </div>
          </div>
        )}

        {activeSection === 'stats' && (
          <div className={`space-y-4 max-w-3xl ${!editModes['stats'] ? 'cms-readonly-mode' : ''}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-slate-900">AI Startup Stats Counters</h3>
              <EditToggleButton isEditing={!!editModes['stats']} onToggle={() => toggleEditMode('stats')} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cmsData.stats.map((stat, idx) => (
                <div key={stat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={stat.label}
                      readOnly={!editModes['stats']}
                      onChange={(e) => {
                        const copy = [...cmsData.stats];
                        copy[idx].label = e.target.value;
                        setCmsData({ ...cmsData, stats: copy });
                      }}
                      className={`w-full bg-transparent font-heading text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 rounded-md px-1 -ml-1 ${editModes['stats'] ? 'border border-slate-200 bg-white shadow-sm' : ''}`}
                    />
                    <input
                      type="text"
                      value={stat.description}
                      readOnly={!editModes['stats']}
                      onChange={(e) => {
                        const copy = [...cmsData.stats];
                        copy[idx].description = e.target.value;
                        setCmsData({ ...cmsData, stats: copy });
                      }}
                      className={`w-full bg-transparent text-[11px] text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#5B3DF5]/20 rounded-md px-1 -ml-1 ${editModes['stats'] ? 'border border-slate-200 bg-white shadow-sm mt-1' : ''}`}
                    />
                  </div>
                  <input
                    type="text"
                    value={stat.value}
                    readOnly={!editModes['stats']}
                    onChange={(e) => {
                      const copy = [...cmsData.stats];
                      copy[idx].value = e.target.value;
                      setCmsData({ ...cmsData, stats: copy });
                    }}
                    className={`w-20 rounded-lg p-2 text-xs text-center font-bold text-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 ${editModes['stats'] ? 'border border-[#3B82F6]/30 bg-blue-50/50' : 'bg-transparent'}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'footer' && (
          <div className={`space-y-4 max-w-2xl ${!editModes['footer'] ? 'cms-readonly-mode' : ''}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-slate-900">Footer Settings & General Image</h3>
              <EditToggleButton isEditing={!!editModes['footer']} onToggle={() => toggleEditMode('footer')} />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">About Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setCmsData({
                        ...cmsData,
                        site: {
                          ...cmsData.site,
                          about: { ...cmsData.site.about, image: reader.result as string },
                        },
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                  e.target.value = '';
                }}
                className="w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#3B82F6]/10 file:text-[#3B82F6] hover:file:bg-[#3B82F6]/20 cms-edit-only"
              />
              {cmsData.site.about?.image && (
                 <div className="mt-3 flex items-center gap-4 p-3 border border-slate-200 rounded-xl bg-slate-50">
                   <img src={cmsData.site.about.image} alt="Preview" className="h-20 object-cover rounded drop-shadow-sm" />
                   <button type="button" onClick={() => setCmsData({...cmsData, site: {...cmsData.site, about: {...cmsData.site.about, image: ''}}})} className="text-xs text-red-500 font-bold hover:underline cms-edit-only">Remove Image</button>
                 </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email</label>
              <input
                type="email"
                value={cmsData.site.email || ''}
                onChange={(e) =>
                  setCmsData({
                    ...cmsData,
                    site: { ...cmsData.site, email: e.target.value },
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">GitHub Link</label>
              <input
                type="url"
                value={cmsData.site.socials?.github || ''}
                onChange={(e) =>
                  setCmsData({
                    ...cmsData,
                    site: { ...cmsData.site, socials: { ...cmsData.site.socials, github: e.target.value } },
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">LinkedIn Link</label>
              <input
                type="url"
                value={cmsData.site.socials?.linkedin || ''}
                onChange={(e) =>
                  setCmsData({
                    ...cmsData,
                    site: { ...cmsData.site, socials: { ...cmsData.site.socials, linkedin: e.target.value } },
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">YouTube Link</label>
              <input
                type="url"
                value={cmsData.site.socials?.youtube || ''}
                onChange={(e) =>
                  setCmsData({
                    ...cmsData,
                    site: { ...cmsData.site, socials: { ...cmsData.site.socials, youtube: e.target.value } },
                  })
                }
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900"
              />
            </div>
          </div>
        )}

      </div>

      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={croppingImageSrc}
        onClose={() => {
          setIsCropperOpen(false);
          setCroppingImageSrc('');
          setCroppingTarget(null);
        }}
        onCropComplete={(croppedBase64) => {
          if (croppingTarget?.type === 'hero') {
            setCmsData({
              ...cmsData,
              site: {
                ...cmsData.site,
                hero: { ...cmsData.site.hero, coreGraphicImage: croppedBase64 },
              },
            });
          } else if (croppingTarget?.type === 'team') {
            const copy = [...cmsData.team];
            copy[croppingTarget.index].avatar = croppedBase64;
            setCmsData({ ...cmsData, team: copy });
          } else if (croppingTarget?.type === 'projectArchitecture') {
            if (croppingTarget.index === -1 && draftProject) {
              setDraftProject({ ...draftProject, architectureDiagram: croppedBase64 });
            } else {
              const copy = [...cmsData.projects];
              copy[croppingTarget.index].architectureDiagram = croppedBase64;
              setCmsData({ ...cmsData, projects: copy });
            }
          }
          setIsCropperOpen(false);
          setCroppingImageSrc('');
          setCroppingTarget(null);
        }}
      />

      {previewImage && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center">
            <button className="absolute -top-12 right-0 text-white hover:text-slate-300 p-2" onClick={() => setPreviewImage(null)}>
              <X className="h-8 w-8" />
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
      {projectToDelete !== null && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-red-200 w-full max-w-sm overflow-hidden text-center p-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 border border-red-100 mb-5">
              <Trash2 className="h-7 w-7 text-red-500" />
            </div>
            <h3 className="text-xl font-heading font-extrabold text-slate-900 mb-2">
              Delete "{cmsData.projects[projectToDelete]?.name}"?
            </h3>
            <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed">This action cannot be undone. Are you sure you want to permanently delete this project?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setProjectToDelete(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const copy = [...cmsData.projects];
                  copy.splice(projectToDelete, 1);
                  setCmsData({ ...cmsData, projects: copy });
                  setProjectToDelete(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-sm shadow-red-500/20 text-xs transition-colors"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
      {achievementToDelete !== null && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-red-200 w-full max-w-sm overflow-hidden text-center p-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 border border-red-100 mb-5">
              <Trash2 className="h-7 w-7 text-red-500" />
            </div>
            <h3 className="text-xl font-heading font-extrabold text-slate-900 mb-2">
              Delete "{cmsData.achievements[achievementToDelete]?.title}"?
            </h3>
            <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed">This action cannot be undone. Are you sure you want to permanently delete this achievement?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setAchievementToDelete(null)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const copy = [...cmsData.achievements];
                  copy.splice(achievementToDelete, 1);
                  setCmsData({ ...cmsData, achievements: copy });
                  setAchievementToDelete(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-sm shadow-red-500/20 text-xs transition-colors"
              >
                Delete Achievement
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isAddProjectDrawerOpen && draftProject && (
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[9990] bg-white flex flex-col h-screen w-screen"
          >
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-xl font-heading font-extrabold text-slate-900">Add New Project</h2>
                <p className="text-xs text-slate-500 mt-1">Fill in the details below to add a new project to your portfolio.</p>
              </div>
              <button onClick={() => setIsAddProjectDrawerOpen(false)} className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {renderProjectForm(draftProject, setDraftProject, -1)}
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsAddProjectDrawerOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setCmsData({ ...cmsData, projects: [...cmsData.projects, draftProject] });
                  setIsAddProjectDrawerOpen(false);
                  setDraftProject(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#5B3DF5] text-white font-bold hover:bg-[#4A2CE2] shadow-sm shadow-[#5B3DF5]/20 text-sm transition-colors"
              >
                Add Project
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddAchievementDrawerOpen && draftAchievement && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9980] bg-slate-950/20 backdrop-blur-sm"
              onClick={() => setIsAddAchievementDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[9990] bg-white shadow-2xl flex flex-col w-[75vw]"
            >
              <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-slate-900">Add New Achievement</h2>
                  <p className="text-xs text-slate-500 mt-1">Fill in the details below to add a new achievement.</p>
                </div>
                <button onClick={() => setIsAddAchievementDrawerOpen(false)} className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {renderAchievementForm(draftAchievement, setDraftAchievement, -1, true)}
              </div>

              <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsAddAchievementDrawerOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setCmsData({ ...cmsData, achievements: [draftAchievement, ...cmsData.achievements] });
                    setIsAddAchievementDrawerOpen(false);
                    setDraftAchievement(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#5B3DF5] text-white font-bold hover:bg-[#4A2CE2] shadow-sm shadow-[#5B3DF5]/20 text-sm transition-colors"
                >
                  Add Achievement
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Publish Confirmation Alert */}
      <AnimatePresence>
        {showPublishAlert && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setShowPublishAlert(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-100"
            >
              <div className="bg-red-50 p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-extrabold text-slate-900 mb-2">Publish Changes to Live Site?</h3>
                <p className="text-sm text-slate-600 mb-6">
                  This action will instantly update the public dashboard and make your changes visible to all visitors. Are you sure you want to proceed?
                </p>
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => setShowPublishAlert(false)}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
                  >
                    Yes, Publish Now
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
