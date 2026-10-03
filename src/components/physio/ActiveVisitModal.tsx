import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  FileText, 
  Save, 
  AlertCircle,
  HelpCircle,
  Stethoscope,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { ClinicalAppointment, ClinicalSOAPNote } from '../../types';
import { api } from '../../services/api';

interface ActiveVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: ClinicalAppointment;
  onVisitCompleted: (completedAppointment: ClinicalAppointment, receipt: any) => void;
}

export const ActiveVisitModal: React.FC<ActiveVisitModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onVisitCompleted,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeStep, setActiveStep] = useState<'treatment' | 'soap' | 'summary'>('treatment');

  // Treatment Checklist
  const [vitalsChecked, setVitalsChecked] = useState(true);
  const [currentPain, setCurrentPain] = useState(2);
  const [measuredFlexion, setMeasuredFlexion] = useState(88);
  const [measuredExtension, setMeasuredExtension] = useState(-3);
  const [interventions, setInterventions] = useState([
    { id: 1, name: 'Cryotherapy & Elevation (15 mins)', done: true },
    { id: 2, name: 'Patellar Glides (Superior/Inferior mobilization)', done: true },
    { id: 3, name: 'Isometric Quadriceps Setting (3 sets x 10 reps)', done: true },
    { id: 4, name: 'Active-Assisted Seated Heel Slides (3 sets x 10 reps)', done: false },
    { id: 5, name: 'Gait Re-education & Single Cane Weight Transfer', done: false }
  ]);

  // SOAP State
  const [subjective, setSubjective] = useState(
    'Patient reports improved comfort during transfers. Evening stiffness reduced with cryotherapy.'
  );
  const [objective, setObjective] = useState(
    'Active right knee flexion measured at 88° (gain of +6° from previous session). Extension lag at -3°. Quadriceps recruitment firm and voluntary.'
  );
  const [assessment, setAssessment] = useState(
    'Post-Op Day 14 TKA recovery milestone achieved. Excellent adherence to bedside quad activation. Swelling minimal.'
  );
  const [plan, setPlan] = useState(
    '1. Advance seated heel slides to 3 sets of 10.\n2. Initiate straight leg raises with 5s terminal hold.\n3. Cryotherapy 20 mins post-exercise.\n4. Review in 72 hours.'
  );
  const [aiDraftDisclaimer, setAiDraftDisclaimer] = useState<string | null>(null);
  const [isGeneratingAIDraft, setIsGeneratingAIDraft] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleIntervention = (id: number) => {
    setInterventions(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleGenerateAIDraft = async () => {
    setIsGeneratingAIDraft(true);
    try {
      const res = await api.generateAISOAPDraft({
        patient_id: appointment.patient_id,
        current_pain: currentPain,
        current_flexion: measuredFlexion,
        previous_flexion: 82,
        previous_pain: 3,
        observations: 'Patellar glide free. Vastus medialis recruitment firm without extensor lag.'
      });

      if (res && res.draft) {
        setSubjective(res.draft.subjective);
        setObjective(res.draft.objective);
        setAssessment(res.draft.assessment);
        setPlan(res.draft.plan);
        setAiDraftDisclaimer(res.disclaimer || 'AI-assisted draft — therapist review required.');
      }
    } finally {
      setIsGeneratingAIDraft(false);
    }
  };

  const handleFinalizeVisit = async () => {
    setIsCompleting(true);
    try {
      // 1. Save SOAP Note
      await api.saveSOAPNote(appointment.patient_id, {
        therapist_name: 'Dr. Ananya Iyer, PT',
        date: new Date().toLocaleDateString('en-GB'),
        subjective,
        objective,
        assessment,
        plan,
        ai_assisted: !!aiDraftDisclaimer,
        ai_draft_used: !!aiDraftDisclaimer,
        status: 'FINALIZED'
      });

      // 2. Complete Visit
      const res = await api.completeVisit(appointment.id);
      onVisitCompleted(res.appointment || { ...appointment, status: 'COMPLETED' }, res.receipt);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-6 border border-slate-100 shadow-2xl relative max-h-[92vh] flex flex-col space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900">{appointment.patient_name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                  Live Session
                </span>
              </div>
              <p className="text-[11px] text-teal-700 font-semibold">{appointment.condition}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-xl font-mono text-xs font-bold text-slate-800">
              <Clock className="w-3.5 h-3.5 text-teal-600 animate-spin" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Navigation Pill */}
        <div className="flex p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveStep('treatment')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeStep === 'treatment' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            1. Treatment Protocol
          </button>
          <button
            onClick={() => setActiveStep('soap')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeStep === 'soap' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            2. SOAP Documentation
          </button>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: TREATMENT PROTOCOL */}
        {/* ======================================================== */}
        {activeStep === 'treatment' && (
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
            {/* Vitals & Angle Telemetry */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">VAS Pain (1-10)</span>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={currentPain}
                  onChange={(e) => setCurrentPain(Number(e.target.value))}
                  className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg font-bold text-center text-teal-800 text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Flexion Angle</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={measuredFlexion}
                    onChange={(e) => setMeasuredFlexion(Number(e.target.value))}
                    className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg font-bold text-center text-emerald-700 text-sm focus:outline-none"
                  />
                  <span className="text-slate-400 font-bold">°</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ext. Lag</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={measuredExtension}
                    onChange={(e) => setMeasuredExtension(Number(e.target.value))}
                    className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg font-bold text-center text-slate-800 text-sm focus:outline-none"
                  />
                  <span className="text-slate-400 font-bold">°</span>
                </div>
              </div>
            </div>

            {/* In-Session Treatment Interventions */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Session Interventions Completed:
              </span>
              <div className="space-y-1.5">
                {interventions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleIntervention(item.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      item.done
                        ? 'bg-teal-50/70 border-teal-300 text-teal-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        item.done ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                      }`}>
                        {item.done && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700">
                      {item.done ? 'Done' : 'Tap to mark'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveStep('soap')}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span>Proceed to SOAP Note</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: SOAP DOCUMENTATION WITH AI ASSISTANT */}
        {/* ======================================================== */}
        {activeStep === 'soap' && (
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
            {/* AI Assistant Banner */}
            <div className="p-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <div>
                  <span className="font-extrabold text-teal-950 block text-[11px]">AI Clinical SOAP Assistant</span>
                  <span className="text-[10px] text-teal-700">Synthesizes measured angles and pain trends into a draft</span>
                </div>
              </div>

              <button
                onClick={handleGenerateAIDraft}
                disabled={isGeneratingAIDraft}
                className="py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
              >
                {isGeneratingAIDraft ? 'Drafting...' : 'Auto-Draft SOAP'}
              </button>
            </div>

            {aiDraftDisclaimer && (
              <div className="p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-[10px] font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{aiDraftDisclaimer}</span>
              </div>
            )}

            {/* S - Subjective */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                S — Subjective (Patient Report & Pain)
              </label>
              <textarea
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* O - Objective */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                O — Objective (ROM & Strength Measurements)
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* A - Assessment */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                A — Assessment (Clinical Reasoning & Milestones)
              </label>
              <textarea
                value={assessment}
                onChange={(e) => setAssessment(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* P - Plan */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                P — Plan (Home Program & Next Review)
              </label>
              <textarea
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Completion Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setActiveStep('treatment')}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleFinalizeVisit}
                disabled={isCompleting}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompleting ? 'Finalizing Visit...' : 'Complete Visit & Generate Receipt'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveVisitModal;
