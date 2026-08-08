import React from 'react';
import { RefreshCw, ShieldAlert } from 'lucide-react';
import { ROUTES } from '../constants/routes';

interface ErrorPageProps {
  onNavigate?: (path: string) => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[75vh] pt-32 pb-20 flex items-center justify-center bg-[#FAFBFC] text-slate-900">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mx-auto mb-6">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="font-heading text-6xl font-extrabold text-slate-900 mb-2">500</h1>
        <h2 className="font-heading text-xl font-bold text-slate-800 mb-4">System Anomaly Detected</h2>
        <p className="text-xs text-slate-600 mb-8">
          An unexpected hardware interrupt occurred. Our telemetry logs have isolated the issue.
        </p>
        <button
          onClick={() => {
            if (onNavigate) onNavigate(ROUTES.HOME);
            window.location.reload();
          }}
          className="inline-flex items-center gap-2 rounded-full bg-[#5B3DF5] px-6 py-3 text-xs font-bold text-white hover:bg-[#4A2CE2] transition-colors shadow-md"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reload Application</span>
        </button>
      </div>
    </div>
  );
};
