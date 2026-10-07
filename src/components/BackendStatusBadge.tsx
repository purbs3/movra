import React from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface BackendStatusBadgeProps {
  isOnline: boolean;
  onOpenDevInfo: () => void;
  onRefresh: () => void;
  isChecking: boolean;
}

export const BackendStatusBadge: React.FC<BackendStatusBadgeProps> = ({
  isOnline,
  onOpenDevInfo,
  onRefresh,
  isChecking,
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onOpenDevInfo}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
          isOnline
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100'
            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
        }`}
        title="Clinical system status"
      >
        <span className="relative flex h-2 w-2">
          {isOnline ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          )}
        </span>
        <span className="text-[11px]">
          {isOnline ? 'Care system active' : 'Offline Mode'}
        </span>
      </button>

      <button
        onClick={onRefresh}
        disabled={isChecking}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        title="Refresh care system connection"
      >
        <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-teal-600' : ''}`} />
      </button>
    </div>
  );
};
