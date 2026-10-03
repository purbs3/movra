import React from 'react';
import { Server, CheckCircle2, AlertCircle, RefreshCw, Terminal } from 'lucide-react';

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
    <div className="flex items-center gap-2">
      <button
        onClick={onOpenDevInfo}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
          isOnline
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
        }`}
        title="Click to view FastAPI Local Backend integration guide"
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
        <span className="font-mono text-[11px]">
          {isOnline ? 'FastAPI 8000: Connected' : 'FastAPI: Standby'}
        </span>
        <Terminal className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      <button
        onClick={onRefresh}
        disabled={isChecking}
        className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        title="Check localhost:8000 connection"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-teal-600' : ''}`} />
      </button>
    </div>
  );
};
