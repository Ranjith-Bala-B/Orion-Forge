import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, ShieldCheck, Download, Upload, CheckCircle2, RefreshCw } from 'lucide-react';
import { VaultSettings } from '../../types/vault';
import { vaultService } from '../../services/vaultService';

interface VaultSettingsViewProps {
  settings: VaultSettings;
  onUpdateSettings: (settings: VaultSettings) => void;
  onRefreshAllData: () => void;
}

export const VaultSettingsView: React.FC<VaultSettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onRefreshAllData,
}) => {
  const [importedStatus, setImportedStatus] = useState<string | null>(null);

  const handleExportBackup = () => {
    const jsonStr = vaultService.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orion_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (vaultService.importBackupJSON(content)) {
        onRefreshAllData();
        setImportedStatus('Backup imported successfully!');
        setTimeout(() => setImportedStatus(null), 3000);
      } else {
        alert('Invalid JSON backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner in Sky Blue Blending with White Theme */}
      <div className="relative overflow-hidden flex items-center justify-between p-8 rounded-3xl bg-gradient-to-r from-[#3B82F6] via-[#38BDF8] to-sky-100 border border-white/80 shadow-[0_20px_50px_-15px_rgba(59,130,246,0.3)]">
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#1D4ED8] shadow-md">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-extrabold text-white">Vault Settings & Backups</h1>
            <p className="text-xs font-medium text-white">Security configurations, notification rules, and JSON database backup/restore tools.</p>
          </div>
        </div>
      </div>

      {importedStatus && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>{importedStatus}</span>
        </div>
      )}

      {/* Security & Authentication Panel */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#3B82F6]" />
          <span>Security & Authentication</span>
        </h3>

        <div className="max-w-md">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-700">Master Password</span>
            <p className="text-xs text-slate-500">Current vault password is configured to: <code className="font-mono text-[#3B82F6] font-bold">varr@Forge</code></p>
          </div>
        </div>
      </div>

      {/* Data Backup & Export/Import */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-6">
        <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
          <Download className="h-5 w-5 text-[#38BDF8]" />
          <span>Database Export & Import (Backup / Restore)</span>
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed">
          Export your entire hackathon database, rounds, tasks, document metadata, portfolio history, and notification logs as a portable JSON backup file.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#38BDF8] text-xs font-bold text-white shadow-md hover:opacity-95"
          >
            <Download className="h-4 w-4" />
            <span>Export Full JSON Backup</span>
          </button>

          <label className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer shadow-sm">
            <Upload className="h-4 w-4 text-[#3B82F6]" />
            <span>Import JSON Backup File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
