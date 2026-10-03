import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Activity, 
  Clock, 
  ChevronRight, 
  FileText, 
  Target, 
  Sparkles, 
  MessageCircle, 
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  TrendingUp
} from 'lucide-react';
import { api } from '../../services/api';

interface PatientClinicalProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  onStartVisit?: (patientId: string) => void;
  onPrescribeProgram?: (patientId: string) => void;
}

export const PatientClinicalProfileModal: React.FC<PatientClinicalProfileModalProps> = ({
  isOpen,
  onClose,
  patientId,
  onStartVisit,
  onPrescribeProgram,
}) => {
  const [profile, setProfile] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'goals' | 'soaps'>('overview');
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<any | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    api.getPatientClinicalProfile(patientId).then((data) => {
      if (isMounted && data) {
        setProfile(data);
      }
    });
    return () => { isMounted = false; };
  }, [isOpen, patientId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-6 border border-slate-100 shadow-2xl relative max-h-[92vh] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white font-black text-lg flex items-center justify-center shadow-md">
              {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'PT'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-slate-900">{profile?.name || 'Patient Clinical Record'}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {profile?.age || 64}y • {profile?.gender || 'Male'}
                </span>
              </div>
              <p className="text-xs text-teal-700 font-semibold">{profile?.condition}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          {(['overview', 'timeline', 'goals', 'soaps'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-xl capitalize transition-all ${
                activeTab === tab ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
              }`}
            >
              {tab === 'soaps' ? 'SOAP Notes' : tab}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && profile && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Address & Contacts</span>
                <p className="text-slate-800 font-medium">📍 {profile.address}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500">Emergency:</span>
                  <span className="font-bold text-slate-800">{profile.emergency_contact}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical History</span>
                <div>
                  <span className="text-slate-400 block text-[10px]">Surgery Details</span>
                  <span className="font-bold text-slate-800">{profile.surgical_history?.[0]}</span>
                  <span className="text-[10px] text-teal-700 block mt-0.5">{profile.surgery_date}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[10px]">Comorbidities</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {profile.medical_history?.map((m: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-[11px] text-teal-900 leading-relaxed">
                <span className="font-bold block mb-0.5">Primary Functional Goal:</span>
                {profile.goals_summary}
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {activeTab === 'timeline' && profile && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Chronological Episode of Care
              </span>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-200">
                {profile.timeline?.map((event: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedTimelineItem(event)}
                    className="relative cursor-pointer group bg-slate-50 p-3 rounded-2xl border border-slate-200/70 hover:border-teal-400 transition-all"
                  >
                    <span className="absolute -left-6 top-3 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-xs"></span>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 text-xs group-hover:text-teal-700 transition-colors">
                        {event.title}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">{event.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{event.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GOALS */}
          {activeTab === 'goals' && profile && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Measurable Milestones (ROM & Pain)
              </span>
              <div className="space-y-2.5">
                {profile.goals?.map((g: any, idx: number) => {
                  const percent = Math.min(Math.round(((g.current_value - g.baseline) / ((g.target_value || 100) - g.baseline)) * 100), 100);
                  return (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{g.goal_name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase tracking-wider">
                          {g.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span>Baseline: {g.baseline}{g.unit}</span>
                        <span className="text-teal-700 font-bold">Current: {g.current_value}{g.unit}</span>
                        <span>Target: {g.target_value}{g.unit}</span>
                      </div>

                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-teal-600 h-full rounded-full transition-all" style={{ width: `${Math.max(percent, 15)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: SOAPS */}
          {activeTab === 'soaps' && profile && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Documented Clinical SOAP History
              </span>
              <div className="space-y-3">
                {profile.recent_soaps?.map((s: any, idx: number) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 font-mono">
                      <span className="font-bold text-slate-700 font-sans">Session Date</span>
                      <span className="text-[10px] text-teal-700 font-bold">{s.date}</span>
                    </div>
                    <div>
                      <strong className="text-[10px] text-slate-500 uppercase tracking-wider block">Subjective:</strong>
                      <p className="text-slate-700 text-[11px] leading-relaxed">{s.subjective}</p>
                    </div>
                    <div>
                      <strong className="text-[10px] text-slate-500 uppercase tracking-wider block">Objective:</strong>
                      <p className="text-slate-700 text-[11px] leading-relaxed">{s.objective}</p>
                    </div>
                    <div>
                      <strong className="text-[10px] text-slate-500 uppercase tracking-wider block">Assessment:</strong>
                      <p className="text-slate-700 text-[11px] leading-relaxed">{s.assessment}</p>
                    </div>
                    <div>
                      <strong className="text-[10px] text-slate-500 uppercase tracking-wider block">Plan:</strong>
                      <p className="text-slate-700 text-[11px] leading-relaxed whitespace-pre-line">{s.plan}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${profile?.phone}`}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <span>Call</span>
            </a>
            <a
              href={`https://wa.me/${profile?.phone?.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(profile?.name || '')}%2C%20Dr.%20Ananya%20here%20from%20MOVRA.`}
              target="_blank"
              rel="noreferrer"
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs rounded-xl flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            {onPrescribeProgram && (
              <button
                onClick={() => onPrescribeProgram(patientId)}
                className="py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs rounded-xl"
              >
                Prescribe HEP
              </button>
            )}
            {onStartVisit && (
              <button
                onClick={() => onStartVisit(patientId)}
                className="py-2 px-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Start Visit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientClinicalProfileModal;
