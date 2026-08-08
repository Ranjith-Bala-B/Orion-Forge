import { Hackathon, HistoryEntry, NotificationItem, VaultSettings, Round } from '../types/vault';
import { initialHackathons, initialHistoryEntries, initialNotifications } from '../data/vaultInitialData';

const HACKATHONS_KEY = 'orion_vault_hackathons';
const HISTORY_KEY = 'orion_vault_history';
const NOTIFICATIONS_KEY = 'orion_vault_notifications';
const SETTINGS_KEY = 'orion_vault_settings';

const defaultSettings: VaultSettings = {
  rememberDevice: true,
  theme: 'light',
  notificationsEnabled: true,
  emailAlerts: true,
  lastBackupDate: undefined,
};

export const vaultService = {
  // Load Hackathons with automatic round status calculation
  getHackathons: (): Hackathon[] => {
    const raw = localStorage.getItem(HACKATHONS_KEY);
    let list: Hackathon[] = raw ? JSON.parse(raw) : initialHackathons;

    const todayStr = new Date().toISOString().split('T')[0];

    // Auto-update past round deadlines to Closed
    list = list.map((h) => {
      let updatedRounds = h.rounds.map((r) => {
        if (r.deadlineDate < todayStr && !r.completed && r.status !== 'Closed') {
          return { ...r, status: 'Closed' as const };
        }
        return r;
      });

      return { ...h, rounds: updatedRounds };
    });

    return list;
  },

  saveHackathons: (hackathons: Hackathon[]): void => {
    localStorage.setItem(HACKATHONS_KEY, JSON.stringify(hackathons));
  },

  getHackathonById: (id: string): Hackathon | undefined => {
    const list = vaultService.getHackathons();
    return list.find((h) => h.id === id);
  },

  calculateHackathonProgress: (hackathon: Hackathon): number => {
    if (!hackathon.rounds || hackathon.rounds.length === 0) return 0;
    const completedCount = hackathon.rounds.filter((r) => r.completed).length;
    return Math.round((completedCount / hackathon.rounds.length) * 100);
  },

  // Save / Update a Single Hackathon
  saveHackathonItem: (hackathon: Hackathon): Hackathon[] => {
    const list = vaultService.getHackathons();
    const index = list.findIndex((h) => h.id === hackathon.id);
    if (index >= 0) {
      list[index] = hackathon;
    } else {
      list.unshift(hackathon);
    }
    vaultService.saveHackathons(list);
    return list;
  },

  deleteHackathonItem: (id: string): Hackathon[] => {
    let list = vaultService.getHackathons();
    list = list.filter((h) => h.id !== id);
    vaultService.saveHackathons(list);
    return list;
  },

  // History Entries
  getHistory: (): HistoryEntry[] => {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : initialHistoryEntries;
  },

  saveHistory: (history: HistoryEntry[]): void => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  },

  saveHistoryItem: (entry: HistoryEntry): HistoryEntry[] => {
    const list = vaultService.getHistory();
    const index = list.findIndex((h) => h.id === entry.id);
    if (index >= 0) {
      list[index] = entry;
    } else {
      list.unshift(entry);
    }
    vaultService.saveHistory(list);
    return list;
  },

  deleteHistoryItem: (id: string): HistoryEntry[] => {
    let list = vaultService.getHistory();
    list = list.filter((h) => h.id !== id);
    vaultService.saveHistory(list);
    return list;
  },

  // Notifications
  getNotifications: (): NotificationItem[] => {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : initialNotifications;
  },

  saveNotifications: (notifications: NotificationItem[]): void => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  },

  markNotificationRead: (id: string): NotificationItem[] => {
    const list = vaultService.getNotifications().map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    vaultService.saveNotifications(list);
    return list;
  },

  // Settings & JSON Backup/Restore
  getSettings: (): VaultSettings => {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : defaultSettings;
  },

  saveSettings: (settings: VaultSettings): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  exportBackupJSON: (): string => {
    const backupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      hackathons: vaultService.getHackathons(),
      history: vaultService.getHistory(),
      notifications: vaultService.getNotifications(),
      settings: vaultService.getSettings(),
    };
    return JSON.stringify(backupData, null, 2);
  },

  importBackupJSON: (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.hackathons) localStorage.setItem(HACKATHONS_KEY, JSON.stringify(data.hackathons));
      if (data.history) localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
      if (data.notifications) localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(data.notifications));
      if (data.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
      return true;
    } catch (e) {
      console.error('Failed to import JSON backup', e);
      return false;
    }
  },
};
