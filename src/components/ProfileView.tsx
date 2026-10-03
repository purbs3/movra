import React, { useState } from 'react';
import { 
  User, 
  Brain, 
  ShieldCheck, 
  Plus, 
  Check, 
  Sliders, 
  Phone, 
  FileText, 
  Calendar, 
  AlertCircle, 
  Heart, 
  Stethoscope, 
  ExternalLink,
  ChevronRight,
  Terminal,
  Activity
} from 'lucide-react';
import { PatientProfile, RetainedContextItem } from '../types';

interface ProfileViewProps {
  patient: PatientProfile;
  memoryEnabled: boolean;
  onToggleMemory: (enabled: boolean) => Promise<void>;
  retainedContext: RetainedContextItem[];
  onAddMemoryItem: (category: string, summary: string) => Promise<void>;
  onOpenDevDrawer: () => void;
  isBackendOnline: boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  patient,
  memoryEnabled,
  onToggleMemory,
  retainedContext,
  onAddMemoryItem,
  onOpenDevDrawer,
  isBackendOnline,
}) => {
  const [isAddingContext, setIsAddingContext] = useState(false);
  const [newCategory, setNewCategory] = useState('Pain Threshold');
  const [newSummary, setNewSummary] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Pain Threshold',
    'Mobility Milestone',
    'Cryotherapy Preference',
    'Comorbidities',
    'Psychological Barrier',
    'Exercise Pacing'
  ];

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSummary.trim() || isSaving) return;
    setIsSaving(true);
    await onAddMemoryItem(newCategory, newSummary.trim());
    setNewSummary('');
    setIsAddingContext(false);
    setIsSaving(false);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Pain Threshold':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 'Mobility Milestone':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Cryotherapy Preference':
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
      case 'Comorbidities':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Psychological Barrier':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      default:
        return 'bg-teal-50 text-teal-700 border-teal-200/80';
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
          Patient Profile & AI Context
        </span>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
          Clinical Profile
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Demographics, surgical history, and adaptive AI memory retention.
        </p>
      </div>

      {/* Patient Details Card (Rahul, 64 years old) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-teal-700/20 border-2 border-white">
            RS
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">{patient.name}</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {patient.age} years old
              </span>
            </div>
            <p className="text-xs text-teal-700 font-semibold mt-0.5">
              {patient.surgery}
            </p>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
              <span>Patient ID: #{patient.id}</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">Post-Op Day {patient.post_op_day}</span>
            </div>
          </div>
        </div>

        {/* Clinical Care Team Info */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
              Attending Physical Therapist
            </span>
            <span className="font-bold text-slate-800 block mt-0.5">
              {patient.primary_clinician}
            </span>
            <span className="text-[10px] text-teal-700 font-medium mt-0.5 block">
              City Ortho Rehabilitation
            </span>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
              Caregiver Emergency
            </span>
            <span className="font-bold text-slate-800 block mt-0.5">
              Pooja Sharma (Daughter)
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
              +91 98201 44829
            </span>
          </div>
        </div>
      </div>

      {/* AI Clinical Memory Toggle Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${memoryEnabled ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
              <Brain className="w-6 h-6 stroke-[2.25]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-sm">AI Clinical Memory</h3>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                  memoryEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                }`}>
                  {memoryEnabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Retains pain thresholds, tolerances, and milestone history
              </p>
            </div>
          </div>

          {/* iOS-Style Toggle Switch */}
          <button
            onClick={() => onToggleMemory(!memoryEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none ${
              memoryEnabled ? 'bg-teal-600' : 'bg-slate-300'
            }`}
            title="Toggle AI Clinical Memory on/off"
          >
            <span
              className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-200 ease-in-out ${
                memoryEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="p-3 bg-teal-50/70 border border-teal-200/70 rounded-2xl text-xs text-teal-900 leading-relaxed">
          {memoryEnabled ? (
            <span>
              <strong>Active Clinical Retention:</strong> RAG and Voice agents personalize exercises and answers using the {retainedContext.length} retained observations below.
            </span>
          ) : (
            <span>
              <strong>Memory Disabled:</strong> Conversations and exercises are treated as stateless sessions for privacy.
            </span>
          )}
        </div>
      </div>

      {/* Retained Context List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Retained Clinical Context
            </h2>
            <p className="text-xs text-slate-500">
              Longitudinal memory observations stored in backend
            </p>
          </div>

          <button
            onClick={() => setIsAddingContext(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 rounded-xl text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Context</span>
          </button>
        </div>

        {/* Add Context Form */}
        {isAddingContext && (
          <form
            onSubmit={handleAddSubmit}
            className="p-4 bg-white border border-teal-300 rounded-3xl shadow-sm space-y-3 animate-in fade-in"
          >
            <div className="text-xs font-bold text-slate-800">Log New Clinical Context</div>

            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-500 block mb-1">
                Clinical Observation / Summary
              </label>
              <textarea
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                rows={2}
                placeholder="e.g. Reports slight tightness on lateral side during 80 deg flexion..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddingContext(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newSummary.trim() || isSaving}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving to Backend...' : 'Save Context'}
              </button>
            </div>
          </form>
        )}

        {/* Memory Items List */}
        <div className="space-y-2.5">
          {retainedContext.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.date_logged}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {item.summary}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-teal-700 font-medium">
                  <Check className="w-3 h-3 text-teal-600" />
                  Synced to MemoryAgent
                </span>
                <span>ID: {item.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer FastAPI Integration Card */}
      <div className="p-4 bg-slate-900 text-slate-100 rounded-3xl shadow-md border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              FastAPI Agent Bridge
            </span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${isBackendOnline ? 'bg-emerald-900 text-emerald-300' : 'bg-amber-900 text-amber-300'}`}>
            {isBackendOnline ? 'Port 8000 Live' : 'Port 8000 Standby'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The app calls <code className="text-teal-300 font-mono">http://localhost:8000/api/...</code>.
          Simply paste your RAG, Voice, and Memory agents into <code className="text-teal-300 font-mono">backend/agents/</code> to run locally.
        </p>

        <button
          onClick={onOpenDevDrawer}
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <span>Open Full Local Run & Drop-in Guide</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
