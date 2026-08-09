import { useState, useEffect } from 'react';
import { Hackathon, HistoryEntry, NotificationItem, VaultSettings } from '../types/vault';
import { vaultService } from '../services/vaultService';
import { supabase } from '../config/supabase';

export const useVault = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [settings, setSettings] = useState<VaultSettings>(() => vaultService.getSettings());

  const refreshData = async () => {
    const [h, hist, notifs] = await Promise.all([
      vaultService.getHackathons(),
      vaultService.getHistory(),
      vaultService.getNotifications()
    ]);
    setHackathons(h);
    setHistory(hist);
    setNotifications(notifs);
    setSettings(vaultService.getSettings());
  };

  useEffect(() => {
    refreshData();

    // Setup Supabase Realtime subscriptions
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          // Instead of piecemeal updates, just refresh all data on any table change
          // For a team of 4 members, this is perfectly fine and ensures all nested data is consistent.
          refreshData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const saveHackathon = async (item: Hackathon) => {
    // Optimistic update
    setHackathons(prev => {
      const idx = prev.findIndex(h => h.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = item;
        return next;
      }
      return [item, ...prev];
    });

    await vaultService.saveHackathonItem(item);
    
    // Auto-update history entry if it exists
    const historyEntry = history.find(h => h.hackathonId === item.id);
    if (historyEntry) {
      const updatedEntry = {
        ...historyEntry,
        name: item.name,
        organizer: item.organizer,
        description: item.description,
        problemStatement: item.problemStatement,
        documents: item.documents,
        rounds: item.rounds,
        roundsCount: item.rounds.length,
        projectLinks: [
          ...item.links.filter(l => l.type === 'Project'),
          ...(historyEntry.projectLinks || []).filter(hl => !item.links.some(il => il.id === hl.id))
        ],
        hackathonLinks: [
          ...(item.websiteUrl ? [{ id: 'official-website', title: 'Official Website', url: item.websiteUrl, type: 'Website' as const }] : []),
          ...(item.registrationUrl ? [{ id: 'registration-portal', title: 'Registration Portal', url: item.registrationUrl, type: 'Registration' as const }] : []),
          ...item.links.filter(l => l.type !== 'Project'),
          ...(historyEntry.hackathonLinks || []).filter(hl => hl.id !== 'official-website' && hl.id !== 'registration-portal' && !item.links.some(il => il.id === hl.id))
        ],
      };
      await vaultService.saveHistoryItem(updatedEntry);
    }
  };

  const deleteHackathon = async (id: string) => {
    setHackathons(prev => prev.filter(h => h.id !== id));
    await vaultService.deleteHackathonItem(id);
  };

  const saveHistoryEntry = async (entry: HistoryEntry) => {
    setHistory(prev => {
      const idx = prev.findIndex(h => h.id === entry.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = entry;
        return next;
      }
      return [entry, ...prev];
    });
    
    await vaultService.saveHistoryItem(entry);

    // Auto-update hackathon if it exists
    const hackathon = hackathons.find(h => h.id === entry.hackathonId);
    if (hackathon) {
      const customLinks = [
        ...(entry.hackathonLinks || []),
        ...(entry.projectLinks || [])
      ].filter(l => l.id !== 'official-website' && l.id !== 'registration-portal');

      const updatedHackathon = {
        ...hackathon,
        name: entry.hackathonName || hackathon.name,
        organizer: entry.organizer || hackathon.organizer,
        description: entry.overview || entry.description || hackathon.description,
        problemStatement: entry.problemStatement || hackathon.problemStatement,
        links: customLinks,
      };
      
      await vaultService.saveHackathonItem(updatedHackathon);
    }
  };

  const deleteHistoryEntry = async (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
    await vaultService.deleteHistoryItem(id);
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await vaultService.markNotificationRead(id);
  };

  const updateSettings = (newSettings: VaultSettings) => {
    vaultService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  return {
    hackathons,
    history,
    notifications,
    settings,
    saveHackathon,
    deleteHackathon,
    saveHistoryEntry,
    deleteHistoryEntry,
    markNotificationRead,
    updateSettings,
    refreshData,
  };
};
