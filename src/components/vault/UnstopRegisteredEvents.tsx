import React, { useState, useEffect } from 'react';
import { AlertCircle, Link, Download, Search, Upload, Trophy, CheckCircle2 } from 'lucide-react';
import { Hackathon } from '../../types/vault';
import { UnstopRegisteredEvent } from '../../types/unstop';
import { mapUnstopEventToHackathon } from '../../services/unstopService';

interface Props {
  hackathons: Hackathon[];
  unstopEvents: any[];
  onImport: (hackathon: Hackathon) => Promise<void>;
  onPreview: (data: Partial<Hackathon>) => void;
}

export const UnstopRegisteredEvents: React.FC<Props> = ({ hackathons, unstopEvents, onPreview, onImport }) => {
  const [events, setEvents] = useState<any[]>(unstopEvents);
  const [error, setError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('Idle');

  useEffect(() => {
    setEvents(unstopEvents);
  }, [unstopEvents]);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Starting manual sync...');
    try {
      await fetch('/api/sync-unstop', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isSyncing) {
      interval = setInterval(async () => {
        try {
          const res = await fetch('/api/sync-unstop');
          const data = await res.json();
          setSyncStatus(data.status);
          setIsSyncing(data.isSyncing);
        } catch (e) {}
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSyncing]);

  const importedIds = new Set(hackathons.map(h => h.unstopEventId).filter(Boolean));

  const handlePreview = (event: UnstopRegisteredEvent) => {
    const partialData = mapUnstopEventToHackathon(event);
    onPreview(partialData);
  };

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6]">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-slate-900">Unstop Registered Events</h2>
            <p className="text-xs text-slate-500">Automatically loaded from your local script.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-[#3B82F6]/5 p-4 border border-[#3B82F6]/20 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Unstop Synchronization</h3>
          <p className="text-xs text-slate-600 mt-1">
            Status: <span className="font-semibold text-[#3B82F6]">{syncStatus}</span>
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            isSyncing 
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-sm'
          }`}
        >
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      {error && (
        <div className="flex gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      
      {events.filter(e => {
        const s = e.status?.toUpperCase() || '';
        const regDateStr = e.raw_data?.registered_teams?.[0]?.created_at || e.source_updated_at;
        const regDate = new Date(regDateStr || Date.now());
        const diffHours = (new Date().getTime() - regDate.getTime()) / (1000 * 60 * 60);
        return s !== 'FINISHED' && s !== 'COMPLETED' && diffHours <= 24;
      }).length === 0 ? (
        <p className="rounded-2xl bg-slate-50 p-6 text-center text-xs text-slate-500">
          No live events found. Click Sync Now to fetch your latest registered hackathons.
        </p>
      ) : (
        <div className="space-y-3">
          {events.filter(e => {
            const s = e.status?.toUpperCase() || '';
            const regDateStr = e.raw_data?.registered_teams?.[0]?.created_at || e.source_updated_at;
            const regDate = new Date(regDateStr || Date.now());
            const diffHours = (new Date().getTime() - regDate.getTime()) / (1000 * 60 * 60);
            return s !== 'FINISHED' && s !== 'COMPLETED' && diffHours <= 24;
          }).map(event => {
            const added = importedIds.has(event.sourceEventId || event.source_event_id);
            const mainRound = event.rounds?.[0];
            const dateDisplay = mainRound && (mainRound.startDate || mainRound.deadlineDate) 

              ? `${mainRound.startDate || '?'} to ${mainRound.deadlineDate || '?'}`
              : 'Dates not available';

            return (
              <div key={event.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-white transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 truncate">{event.title}</h3>
                    <span className="rounded-full bg-[#3B82F6]/10 px-2 py-0.5 text-[10px] font-bold text-[#3B82F6]">{event.type || event.event_type || 'Event'}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 truncate">
                    {event.organizer || 'Organizer not provided'} · {event.status}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-600">
                    📅 {dateDisplay}
                  </p>
                </div>
                <button
                  onClick={() => handlePreview(event)}
                  disabled={added}
                  className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                    added ? 'bg-emerald-50 text-emerald-700' : 'bg-[#3B82F6] text-white hover:bg-[#2563EB]'
                  } disabled:opacity-70`}
                >
                  {added ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Already added
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Preview & Import
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
