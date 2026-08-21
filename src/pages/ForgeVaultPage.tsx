import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useVault } from '../hooks/useVault';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { AuthScreen } from '../components/vault/AuthScreen';
import { VaultSidebar, VaultTab } from '../components/vault/VaultSidebar';
import { VaultTopbar } from '../components/vault/VaultTopbar';
import { CommandPalette } from '../components/vault/CommandPalette';
import { NotificationCenter } from '../components/vault/NotificationCenter';
import { QuickActionButton } from '../components/vault/QuickActionButton';

import { DashboardView } from '../components/vault/DashboardView';
import { BubbleCalendar } from '../components/vault/BubbleCalendar';
import { HackathonManager } from '../components/vault/HackathonManager';
import { HackathonWorkspace } from '../components/vault/HackathonWorkspace';
import { HistoryWorkspace } from '../components/vault/HistoryWorkspace';
import { ForgeHistoryView } from '../components/vault/ForgeHistoryView';
import { OrionForgeCMS } from '../components/vault/OrionForgeCMS';
import { VaultSettingsView } from '../components/vault/VaultSettingsView';

interface ForgeVaultPageProps {
  onNavigate?: (path: string) => void;
}

export const ForgeVaultPage: React.FC<ForgeVaultPageProps> = ({ onNavigate }) => {
  const { isAuthenticated, login, logout } = useAuth();
  const {
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
  } = useVault();

  const commandPalette = useCommandPalette();

  const [activeTab, setActiveTab] = useState<VaultTab>('dashboard');
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [activeWorkspaceTargetTab, setActiveWorkspaceTargetTab] = useState<'overview' | 'rounds' | 'tasks' | 'documents' | 'links' | 'team' | 'notes' | undefined>(undefined);
  const [activeHistoryWorkspaceId, setActiveHistoryWorkspaceId] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [cmsInitialSection, setCmsInitialSection] = useState<'hero' | 'team' | 'projects' | 'achievements' | 'stats' | 'footer'>('hero');
  const [cmsInitialDrawer, setCmsInitialDrawer] = useState<'project' | 'achievement' | null>(null);
  const [hackathonInitialModal, setHackathonInitialModal] = useState(false);

  // Unread notification count
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  if (!isAuthenticated) {
    return <AuthScreen onLogin={login} />;
  }

  const activeHackathonWorkspace = activeWorkspaceId
    ? hackathons.find((h) => h.id === activeWorkspaceId)
    : null;

  const activeHistoryWorkspace = activeHistoryWorkspaceId
    ? history.find((h) => h.id === activeHistoryWorkspaceId)
    : null;

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-slate-900 pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto flex gap-8">

        {/* Floating Sidebar Navigation */}
        <VaultSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveWorkspaceId(null);
            setActiveWorkspaceTargetTab(undefined);
            setActiveHistoryWorkspaceId(null);
            setCmsInitialDrawer(null);
            setHackathonInitialModal(false);
            setActiveTab(tab);
          }}
          onLogout={logout}
          onNavigate={onNavigate}
        />

        {/* Main Content Workspace Area */}
        <div className="flex-1 min-w-0">
          <VaultTopbar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveWorkspaceId(null);
              setActiveWorkspaceTargetTab(undefined);
              setActiveHistoryWorkspaceId(null);
              setCmsInitialDrawer(null);
              setHackathonInitialModal(false);
              setActiveTab(tab);
            }}
            onOpenCommandPalette={commandPalette.open}
            onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
            unreadNotificationCount={unreadNotificationsCount}
          />

          {/* Active Workspace or Tab Page View */}
          {activeWorkspaceId && activeHackathonWorkspace ? (
            <HackathonWorkspace
              hackathon={activeHackathonWorkspace}
              initialTab={activeWorkspaceTargetTab}
              onBack={() => setActiveWorkspaceId(null)}
              onSaveHackathon={saveHackathon}
              onSaveHistoryEntry={saveHistoryEntry}
              isArchived={history.some(h => h.hackathonId === activeHackathonWorkspace.id)}
              onNavigateToHistory={() => {
                setActiveWorkspaceId(null);
                setActiveTab('history');
              }}
            />
          ) : activeHistoryWorkspaceId && activeHistoryWorkspace ? (
            <HistoryWorkspace
              entry={activeHistoryWorkspace}
              onBack={() => setActiveHistoryWorkspaceId(null)}
              onSaveEntry={saveHistoryEntry}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  hackathons={hackathons}
                  history={history}
                  onSelectTab={setActiveTab}
                  onOpenHackathonWorkspace={(id, targetTab) => {
                    setActiveWorkspaceTargetTab(targetTab);
                    setActiveWorkspaceId(id);
                    setActiveTab('hackathons');
                  }}
                />
              )}

              {activeTab === 'calendar' && (
                <BubbleCalendar
                  hackathons={hackathons}
                  onOpenHackathonWorkspace={(id) => {
                    setActiveWorkspaceId(id);
                    setActiveTab('hackathons');
                  }}
                />
              )}

              {activeTab === 'hackathons' && (
                <HackathonManager
                  hackathons={hackathons}
                  onOpenWorkspace={(id) => setActiveWorkspaceId(id)}
                  onSaveHackathon={saveHackathon}
                  onDeleteHackathon={deleteHackathon}
                  initialOpenModal={hackathonInitialModal}
                />
              )}

              {activeTab === 'history' && (
                <ForgeHistoryView
                  history={history}
                  onSaveHistoryEntry={saveHistoryEntry}
                  onDeleteHistoryEntry={deleteHistoryEntry}
                  onOpenHistoryWorkspace={(id) => setActiveHistoryWorkspaceId(id)}
                />
              )}

              {activeTab === 'cms' && (
                <OrionForgeCMS
                  initialSection={cmsInitialSection}
                  initialOpenDrawer={cmsInitialDrawer}
                />
              )}

              {activeTab === 'settings' && (
                <VaultSettingsView
                  settings={settings}
                  onUpdateSettings={updateSettings}
                  onRefreshAllData={refreshData}
                />
              )}
            </>
          )}
        </div>

      </div>

      {/* Floating Action Speed Dial (+) */}
      <QuickActionButton
        onSelectTab={(tab) => {
          setActiveWorkspaceId(null);
          setCmsInitialDrawer(null);
          setHackathonInitialModal(false);
          setActiveTab(tab);
        }}
        onOpenNewHackathonModal={() => {
          setActiveWorkspaceId(null);
          setHackathonInitialModal(true);
          setActiveTab('hackathons');
        }}
        onAddPublicProject={() => {
          setActiveWorkspaceId(null);
          setActiveHistoryWorkspaceId(null);
          setCmsInitialSection('projects');
          setCmsInitialDrawer('project');
          setActiveTab('cms');
        }}
        onAddAchievement={() => {
          setActiveWorkspaceId(null);
          setActiveHistoryWorkspaceId(null);
          setCmsInitialSection('achievements');
          setCmsInitialDrawer('achievement');
          setActiveTab('cms');
        }}
        onLockVault={() => {
          logout();
          if (onNavigate) {
            onNavigate('/');
          } else {
            window.location.href = '/';
          }
        }}
      />

      {/* Command Palette Modal (Ctrl + K) */}
      <CommandPalette
        isOpen={commandPalette.isOpen}
        onClose={commandPalette.close}
        hackathons={hackathons}
        history={history}
        onSelectTab={(tab) => {
          setActiveWorkspaceId(null);
          setActiveTab(tab);
        }}
      />

      {/* Notification Center Slide Panel */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkRead={markNotificationRead}
      />
    </div>
  );
};
