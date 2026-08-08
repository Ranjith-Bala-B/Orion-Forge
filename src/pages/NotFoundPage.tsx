import React from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { ROUTES } from '../constants/routes';

interface NotFoundPageProps {
  onNavigate?: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[75vh] pt-32 pb-20 flex items-center justify-center bg-[#FAFBFC] text-slate-900">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 mx-auto mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="font-heading text-6xl font-extrabold text-slate-900 mb-2">404</h1>
        <h2 className="font-heading text-xl font-bold text-slate-800 mb-4">Signal Not Found</h2>
        <p className="text-xs text-slate-600 mb-8">
          The vector trajectory you requested does not exist on the Orion Forge network node.
        </p>
        <button
          onClick={() => onNavigate && onNavigate(ROUTES.HOME)}
          className="inline-flex items-center gap-2 rounded-full bg-[#5B3DF5] px-6 py-3 text-xs font-bold text-white hover:bg-[#4A2CE2] transition-colors shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </button>
      </div>
    </div>
  );
};
