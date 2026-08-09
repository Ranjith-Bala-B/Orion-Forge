import { Hackathon, HistoryEntry, NotificationItem, VaultSettings, Round, TaskItem, DocumentItem, LinkItem, TeamAssignment, NoteItem } from '../types/vault';
import { supabase } from '../config/supabase';

const SETTINGS_KEY = 'orion_vault_settings';

const defaultSettings: VaultSettings = {
  rememberDevice: true,
  theme: 'light',
  notificationsEnabled: true,
  emailAlerts: true,
  lastBackupDate: undefined,
};

export const vaultService = {
  getHackathons: async (): Promise<Hackathon[]> => {
    const { data, error } = await supabase
      .from('hackathons')
      .select(`
        *,
        rounds:hackathon_rounds(*),
        tasks:hackathon_tasks(*),
        documents:hackathon_documents(*),
        links:hackathon_links(*),
        team:hackathon_team(*),
        notes:hackathon_notes(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching hackathons:', error);
      return [];
    }

    const todayStr = new Date().toISOString().split('T')[0];

    return (data || []).map((h: any) => {
      let updatedRounds = (h.rounds || []).map((r: any) => {
        let status = r.status;
        if (r.deadline_date < todayStr && !r.completed && r.status !== 'Closed') {
          status = 'Closed';
          // Fire-and-forget update to Supabase
          supabase.from('hackathon_rounds').update({ status: 'Closed' }).eq('id', r.id).then();
        }
        return {
          id: r.id,
          name: r.name,
          type: r.type,
          mode: r.mode,
          startDate: r.start_date,
          startTime: r.start_time,
          deadlineDate: r.deadline_date,
          deadlineTime: r.deadline_time,
          submissionDetails: r.submission_details,
          submissionRequirements: r.submission_requirements,
          resultDate: r.result_date,
          status: status,
          remarks: r.remarks,
          completed: r.completed,
        } as Round;
      });

      return {
        id: h.id,
        name: h.name,
        type: h.type,
        organizer: h.organizer,
        mode: h.mode,
        websiteUrl: h.website_url,
        registrationUrl: h.registration_url,
        problemStatement: h.problem_statement,
        description: h.description,
        status: h.status,
        createdAt: h.created_at,
        isGameOver: h.is_game_over,
        rounds: updatedRounds,
        tasks: (h.tasks || []).map((t: any) => ({
          id: t.id, title: t.title, priority: t.priority, assignedMember: t.assigned_member,
          dueDate: t.due_date, completed: t.completed
        })) as TaskItem[],
        documents: (h.documents || []).map((d: any) => ({
          id: d.id, name: d.name, type: d.type, url: d.url, size: d.size,
          uploadedAt: d.uploaded_at, category: d.category
        })) as DocumentItem[],
        links: (h.links || []).map((l: any) => ({
          id: l.id, title: l.title, url: l.url, type: l.type
        })) as LinkItem[],
        team: (h.team || []).map((t: any) => ({
          id: t.id, memberName: t.member_name, role: t.role, responsibility: t.responsibility
        })) as TeamAssignment[],
        notes: (h.notes || []).map((n: any) => ({
          id: n.id, title: n.title, content: n.content, updatedAt: n.updated_at
        })) as NoteItem[]
      } as Hackathon;
    });
  },

  calculateHackathonProgress: (hackathon: Hackathon): number => {
    if (!hackathon.rounds || hackathon.rounds.length === 0) return 0;
    const completedCount = hackathon.rounds.filter((r) => r.completed).length;
    return Math.round((completedCount / hackathon.rounds.length) * 100);
  },

  saveHackathonItem: async (hackathon: Hackathon): Promise<void> => {
    // 1. Upsert Hackathon
    await supabase.from('hackathons').upsert({
      id: hackathon.id, name: hackathon.name, type: hackathon.type, organizer: hackathon.organizer,
      mode: hackathon.mode, website_url: hackathon.websiteUrl, registration_url: hackathon.registrationUrl,
      problem_statement: hackathon.problemStatement, description: hackathon.description,
      status: hackathon.status, created_at: hackathon.createdAt, is_game_over: hackathon.isGameOver
    });

    // 2. Delete existing child records and re-insert (simplest sync approach)
    await Promise.all([
      supabase.from('hackathon_rounds').delete().eq('hackathon_id', hackathon.id),
      supabase.from('hackathon_tasks').delete().eq('hackathon_id', hackathon.id),
      supabase.from('hackathon_documents').delete().eq('hackathon_id', hackathon.id),
      supabase.from('hackathon_links').delete().eq('hackathon_id', hackathon.id),
      supabase.from('hackathon_team').delete().eq('hackathon_id', hackathon.id),
      supabase.from('hackathon_notes').delete().eq('hackathon_id', hackathon.id)
    ]);

    const inserts = [];
    if (hackathon.rounds?.length) {
      inserts.push(supabase.from('hackathon_rounds').insert(hackathon.rounds.map(r => ({
        id: r.id, hackathon_id: hackathon.id, name: r.name, type: r.type, mode: r.mode,
        start_date: r.startDate, start_time: r.startTime, deadline_date: r.deadlineDate,
        deadline_time: r.deadlineTime, submission_details: r.submissionDetails,
        submission_requirements: r.submissionRequirements, result_date: r.resultDate,
        status: r.status, remarks: r.remarks, completed: r.completed
      }))));
    }
    if (hackathon.tasks?.length) {
      inserts.push(supabase.from('hackathon_tasks').insert(hackathon.tasks.map(t => ({
        id: t.id, hackathon_id: hackathon.id, title: t.title, priority: t.priority,
        assigned_member: t.assignedMember, due_date: t.dueDate, completed: t.completed
      }))));
    }
    if (hackathon.documents?.length) {
      inserts.push(supabase.from('hackathon_documents').insert(hackathon.documents.map(d => ({
        id: d.id, hackathon_id: hackathon.id, name: d.name, type: d.type, url: d.url,
        size: d.size, uploaded_at: d.uploadedAt, category: d.category
      }))));
    }
    if (hackathon.links?.length) {
      inserts.push(supabase.from('hackathon_links').insert(hackathon.links.map(l => ({
        id: l.id, hackathon_id: hackathon.id, title: l.title, url: l.url, type: l.type
      }))));
    }
    if (hackathon.team?.length) {
      inserts.push(supabase.from('hackathon_team').insert(hackathon.team.map(t => ({
        id: t.id, hackathon_id: hackathon.id, member_name: t.memberName, role: t.role,
        responsibility: t.responsibility
      }))));
    }
    if (hackathon.notes?.length) {
      inserts.push(supabase.from('hackathon_notes').insert(hackathon.notes.map(n => ({
        id: n.id, hackathon_id: hackathon.id, title: n.title, content: n.content,
        updated_at: n.updatedAt
      }))));
    }
    
    await Promise.all(inserts);
  },

  deleteHackathonItem: async (id: string): Promise<void> => {
    await supabase.from('hackathons').delete().eq('id', id);
  },

  getHistory: async (): Promise<HistoryEntry[]> => {
    const { data, error } = await supabase.from('vault_history').select('*');
    if (error) return [];
    return (data || []).map((h: any) => ({
      id: h.id, hackathonId: h.hackathon_id, hackathonName: h.hackathon_name,
      projectName: h.project_name, organizer: h.organizer, date: h.date,
      roundsCount: h.rounds_count, result: h.result, resultDetails: h.result_details,
      description: h.description, problemStatement: h.problem_statement,
      teamMembers: h.team_members || [], rounds: h.rounds || [],
      documents: h.documents || [], githubUrl: h.github_url, demoUrl: h.demo_url,
      videoUrl: h.video_url, certificateUrl: h.certificate_url, certificates: h.certificates || [],
      pptUrl: h.ppt_url, gallery: h.gallery || [], overview: h.overview,
      roundResults: h.round_results || {}, projectLinks: h.project_links || [],
      hackathonLinks: h.hackathon_links || []
    } as HistoryEntry));
  },

  saveHistoryItem: async (entry: HistoryEntry): Promise<void> => {
    await supabase.from('vault_history').upsert({
      id: entry.id, hackathon_id: entry.hackathonId, hackathon_name: entry.hackathonName,
      project_name: entry.projectName, organizer: entry.organizer, date: entry.date,
      rounds_count: entry.roundsCount, result: entry.result, result_details: entry.resultDetails,
      description: entry.description, problem_statement: entry.problemStatement,
      team_members: entry.teamMembers, rounds: entry.rounds, documents: entry.documents,
      github_url: entry.githubUrl, demo_url: entry.demoUrl, video_url: entry.videoUrl,
      certificate_url: entry.certificateUrl, certificates: entry.certificates, ppt_url: entry.pptUrl,
      gallery: entry.gallery, overview: entry.overview, round_results: entry.roundResults,
      project_links: entry.projectLinks, hackathon_links: entry.hackathonLinks
    });
  },

  deleteHistoryItem: async (id: string): Promise<void> => {
    await supabase.from('vault_history').delete().eq('id', id);
  },

  getNotifications: async (): Promise<NotificationItem[]> => {
    const { data, error } = await supabase.from('vault_notifications').select('*').order('timestamp', { ascending: false });
    if (error) return [];
    return (data || []).map((n: any) => ({
      id: n.id, title: n.title, message: n.message, type: n.type,
      timestamp: n.timestamp, read: n.read, link: n.link
    } as NotificationItem));
  },

  saveNotifications: async (notifications: NotificationItem[]): Promise<void> => {
    if (notifications.length === 0) return;
    await supabase.from('vault_notifications').upsert(notifications.map(n => ({
      id: n.id, title: n.title, message: n.message, type: n.type,
      timestamp: n.timestamp, read: n.read, link: n.link
    })));
  },
  
  markNotificationRead: async (id: string): Promise<void> => {
    await supabase.from('vault_notifications').update({ read: true }).eq('id', id);
  },

  getSettings: (): VaultSettings => {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : defaultSettings;
  },

  saveSettings: (settings: VaultSettings): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
};
