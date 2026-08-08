import { useState, useEffect } from 'react';
import { Hackathon, HistoryEntry, NotificationItem, VaultSettings } from '../types/vault';
import { vaultService } from '../services/vaultService';

export const useVault = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>(() => vaultService.getHackathons());
  const [history, setHistory] = useState<HistoryEntry[]>(() => vaultService.getHistory());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => vaultService.getNotifications());
  const [settings, setSettings] = useState<VaultSettings>(() => vaultService.getSettings());

  const refreshData = () => {
    setHackathons(vaultService.getHackathons());
    setHistory(vaultService.getHistory());
    setNotifications(vaultService.getNotifications());
    setSettings(vaultService.getSettings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const saveHackathon = (item: Hackathon) => {
    const updated = vaultService.saveHackathonItem(item);
    setHackathons([...updated]);
    
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
      // We use the vaultService directly here and then update state, 
      // instead of calling saveHistoryEntry which triggers another state update 
      // and might cause race conditions with the current history state closure.
      const updatedHistory = vaultService.saveHistoryItem(updatedEntry);
      setHistory([...updatedHistory]);
    }
  };

  const deleteHackathon = (id: string) => {
    const updated = vaultService.deleteHackathonItem(id);
    setHackathons([...updated]);
  };

  const saveHistoryEntry = (entry: HistoryEntry) => {
    const updated = vaultService.saveHistoryItem(entry);
    setHistory([...updated]);

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
      
      const updatedHackathons = vaultService.saveHackathonItem(updatedHackathon);
      setHackathons([...updatedHackathons]);
    }
  };

  const deleteHistoryEntry = (id: string) => {
    const updated = vaultService.deleteHistoryItem(id);
    setHistory([...updated]);
  };

  const markNotificationRead = (id: string) => {
    const updated = vaultService.markNotificationRead(id);
    setNotifications([...updated]);
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
