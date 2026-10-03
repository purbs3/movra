import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Activity, 
  Target, 
  Video, 
  Camera, 
  Sparkles, 
  Check, 
  X, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Edit3, 
  RotateCcw, 
  Plus, 
  TrendingUp,
  User,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { ClinicalPatientGoal, ClinicalSOAPNote } from '../../types';

interface PhysioClinicalWorkspaceViewProps {
  patientId: string;
  onClose?: () => void;
  initialSubTab?: 'timeline' | 'assessment' | 'soap' | 'movement' | 'goals';
}

export const PhysioClinicalWorkspaceView: React.FC<PhysioClinicalWorkspaceViewProps> = ({
  patientId,
  onClose,
  initialSubTab = 'timeline'
}) => {
  const [subTab, setSubTab] = useState<'timeline' | 'assessment' | 'soap' | 'movement' | 'goals'>(initialSubTab);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // ==========================================
  // 1. INITIAL ASSESSMENT STATE
  // ==========================================
  const [assessmentSubjective, setAssessmentSubjective] = useState({
    main_complaint: 'Right knee stiffness and post-surgical pain following Total Knee Arthroplasty (TKA)',
    onset: '14 days post-op (discharge on Day 3)',
    pain_score: '3',
    limitations: 'Difficulty with independent stair ascent; requires walker for prolonged domestic ambulation',
    goals: 'Walk unassisted with symmetrical stride length; resume driving in 6 weeks',
    patient_report: 'Adhering to cold compression 3 times daily. Sleeping improved on left lateral position.'
  });

  const [assessmentObjective, setAssessmentObjective] = useState({
    rom_flexion: '88° active / 92° passive',
    rom_extension: '-3° extension lag',
    strength_quads: 'Grade 4-/5 (Good voluntary isometric recruitment)',
    balance: 'Romberg static balance test: 22 seconds without sway',
    gait: 'Antalgic gait with mild right trunk shift; step length slightly decreased on right',
    outcome_measures: 'WOMAC Stiffness Index: 4/8 · Oxford Knee Score: 28/48',
    therapist_observations: 'Surgical wound clean and well-apposed. Moderate suprapatellar effusion without erythema or warmth.'
  });

  const [assessmentClinicalReasoning, setAssessmentClinicalReasoning] = useState(
    'Patient demonstrates positive trajectory in acute TKA recovery phase. Key focus is clearing terminal -3° extension lag and reinforcing vastus medialis obliquus (VMO) tone before full walker weaning.'
  );

  const [assessmentPlan, setAssessmentPlan] = useState({
    frequency: '3 sessions per week (Home Visit)',
    home_program: 'Active-assisted seated heel slides, isometric quad sets, prone terminal knee extension hangs',
    precautions: 'No deep knee flexion beyond 110° under axial load; monitor for calf tenderness or swelling',
    review_date: 'Day 21 post-op milestone evaluation'
  });

  const [assessmentStatus, setAssessmentStatus] = useState<'DRAFT' | 'FINALIZED'>('FINALIZED');
  const [assessmentSuccessMsg, setAssessmentSuccessMsg] = useState<string | null>(null);

  // ==========================================
  // 2. SOAP NOTES STATE
  // ==========================================
  const [soapSubjective, setSoapSubjective] = useState(
    'Patient reports improved comfort during bed-to-chair transfers. VAS pain 2/10 during morning movement.'
  );
  const [soapObjective, setSoapObjective] = useState(
    'Active right knee flexion: 88° (+6° gain). Extension lag: -3°. Voluntary quad activation firm and sustained.'
  );
  const [soapAssessment, setSoapAssessment] = useState(
    'Post-Op Day 14 milestone achieved. Steady quadriceps motor unit recruitment. Soft tissue guarding resolving.'
  );
  const [soapPlan, setSoapPlan] = useState(
    '1. Advance seated heel slides 3x10.\n2. Initiate straight leg raises with 5s hold.\n3. Cryotherapy 20 mins.\n4. Review in 72 hours.'
  );
  const [aiDraftDisclaimer, setAiDraftDisclaimer] = useState<string | null>(null);
  const [isGeneratingAIDraft, setIsGeneratingAIDraft] = useState(false);
  const [soapSuccessMsg, setSoapSuccessMsg] = useState<string | null>(null);
  const [previousSoaps, setPreviousSoaps] = useState<any[]>([]);

  // ==========================================
  // 3. MOVEMENT / CAMERA ANALYSIS STATE
  // ==========================================
  const [isAnalyzingMovement, setIsAnalyzingMovement] = useState(false);
  const [movementMetric, setMovementMetric] = useState({
    movement_type: 'Right Knee Flexion',
    estimated_angle: 88.0,
    previous_angle: 82.0,
    change: '+6.0°',
    reps: 10,
    duration: '45 seconds',
    verified: false,
    corrected_angle: '88'
  });
  const [movementVerificationMsg, setMovementVerificationMsg] = useState<string | null>(null);

  // ==========================================
  // 4. GOALS MANAGEMENT STATE
  // ==========================================
  const [goals, setGoals] = useState<ClinicalPatientGoal[]>([
    {
      id: 1,
      patient_id: patientId,
      goal_name: 'Active Knee Flexion',
      baseline: 45,
      current_value: 88,
      target_value: 120,
      unit: '°',
      target_date: '2026-11-15',
      status: 'IN_PROGRESS'
    },
    {
      id: 2,
      patient_id: patientId,
      goal_name: 'Terminal Extension Lag',
      baseline: -10,
      current_value: -3,
      target_value: 0,
      unit: '°',
      target_date: '2026-10-25',
      status: 'IN_PROGRESS'
    },
    {
      id: 3,
      patient_id: patientId,
      goal_name: 'Pain on Evening Ambulation',
      baseline: 7,
      current_value: 2,
      target_value: 0,
      unit: '/10',
      target_date: '2026-10-30',
      status: 'IN_PROGRESS'
    },
    {
      id: 4,
      patient_id: patientId,
      goal_name: 'Independent Single Cane Gait',
      baseline: 0,
      current_value: 75,
      target_value: 100,
      unit: '%',
      target_date: '2026-11-05',
      status: 'IN_PROGRESS'
    }
  ]);

  const [newGoalForm, setNewGoalForm] = useState({
    goal_name: '',
    baseline: 0,
    current_value: 0,
    target_value: 100,
    unit: '°',
    target_date: new Date().toISOString().split('T')[0]
  });
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingProfile(true);
    api.getPatientClinicalProfile(patientId).then((data) => {
      if (isMounted && data) {
        setProfile(data);
        if (data.recent_soaps) setPreviousSoaps(data.recent_soaps);
        if (data.goals) setGoals(data.goals);
      }
      setIsLoadingProfile(false);
    });
    return () => { isMounted = false; };
  }, [patientId]);

  // AI SOAP Generator Action
  const handleGenerateAIDraft = async () => {
    setIsGeneratingAIDraft(true);
    setAiDraftDisclaimer(null);
    try {
      const res = await api.generateAISOAPDraft({
        patient_id: patientId,
        current_pain: 2,
        current_flexion: 88,
        previous_flexion: 82,
        previous_pain: 3,
        observations: 'Good quadriceps recruitment with reduced joint warmth and symmetrical scar alignment.'
      });
      if (res && res.draft) {
        setSoapSubjective(res.draft.subjective);
        setSoapObjective(res.draft.objective);
        setSoapAssessment(res.draft.assessment);
        setSoapPlan(res.draft.plan);
        setAiDraftDisclaimer(res.disclaimer || 'AI-assisted draft — therapist review required.');
      }
    } finally {
      setIsGeneratingAIDraft(false);
    }
  };

  const handleSaveSOAP = async (status: 'DRAFT' | 'FINALIZED') => {
    await api.saveSOAPNote(patientId, {
      subjective: soapSubjective,
      objective: soapObjective,
      assessment: soapAssessment,
      plan: soapPlan,
      ai_assisted: Boolean(aiDraftDisclaimer),
      status
    });
    setSoapSuccessMsg(`SOAP Note successfully saved as ${status} in patient clinical timeline.`);
    setTimeout(() => setSoapSuccessMsg(null), 4000);
  };

  const handleSimulateMovementAnalysis = () => {
    setIsAnalyzingMovement(true);
    setTimeout(() => {
      setMovementMetric({
        movement_type: 'Right Knee Flexion',
        estimated_angle: 88.0,
        previous_angle: 82.0,
        change: '+6.0°',
        reps: 10,
        duration: '45 seconds',
        verified: false,
        corrected_angle: '88'
      });
      setIsAnalyzingMovement(false);
    }, 1200);
  };

  const handleVerifyMovement = (corrected?: boolean) => {
    setMovementMetric(prev => ({
      ...prev,
      verified: true,
      estimated_angle: corrected ? parseFloat(prev.corrected_angle) : prev.estimated_angle
    }));
    setMovementVerificationMsg(
      corrected 
        ? `Therapist corrected measurement to ${movementMetric.corrected_angle}° and saved to clinical goniometry log.`
        : 'Therapist verified AI estimated angle of 88° and committed to patient record.'
    );
    setTimeout(() => setMovementVerificationMsg(null), 4000);
  };

  const handleSaveAssessment = (status: 'DRAFT' | 'FINALIZED') => {
    setAssessmentStatus(status);
    setAssessmentSuccessMsg(`Initial Clinical Assessment marked as ${status} for ${profile?.name || 'patient'}.`);
    setTimeout(() => setAssessmentSuccessMsg(null), 4000);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalForm.goal_name) return;
    const g: ClinicalPatientGoal = {
      id: Date.now(),
      patient_id: patientId,
      goal_name: newGoalForm.goal_name,
      baseline: Number(newGoalForm.baseline),
      current_value: Number(newGoalForm.current_value),
      target_value: Number(newGoalForm.target_value),
      unit: newGoalForm.unit,
      target_date: newGoalForm.target_date,
      status: 'IN_PROGRESS'
    };
    setGoals(prev => [...prev, g]);
    setIsAddingGoal(false);
    setNewGoalForm({
      goal_name: '',
      baseline: 0,
      current_value: 0,
      target_value: 100,
      unit: '°',
      target_date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Patient Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white font-extrabold text-base flex items-center justify-center shadow-xs">
              {profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'PT'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">{profile?.name || 'Rahul Sharma'}</h2>
                <span className="text-xs text-slate-400 font-medium">({profile?.age || 64}y · {profile?.gender || 'Male'})</span>
              </div>
              <p className="text-xs text-teal-700 font-semibold">{profile?.condition || 'Right Total Knee Arthroplasty (TKA)'}</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {patientId} · Referring: Dr. S. K. Mukherjee, MS (Ortho)</p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Post-Op Day 14
          </span>
        </div>

        {/* Clinical Workspace Navigation Bar */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar text-xs font-bold pt-1">
          <button
            onClick={() => setSubTab('timeline')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              subTab === 'timeline' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Clinical Timeline
          </button>
          <button
            onClick={() => setSubTab('assessment')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              subTab === 'assessment' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Initial Assessment
          </button>
          <button
            onClick={() => setSubTab('soap')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              subTab === 'soap' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            SOAP Notes & AI
          </button>
          <button
            onClick={() => setSubTab('movement')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              subTab === 'movement' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Movement Analysis
          </button>
          <button
            onClick={() => setSubTab('goals')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              subTab === 'goals' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Goals Management
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. CLINICAL TIMELINE & OVERVIEW */}
      {/* ======================================================== */}
      {subTab === 'timeline' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Medical Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Medical History</span>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {(profile?.medical_history || ['Type 2 Diabetes (HbA1c 6.8%)', 'Mild Essential Hypertension']).map((m: string, i: number) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Surgical Details</span>
              <p className="text-slate-700 leading-relaxed">
                Right Total Knee Arthroplasty (TKA). Spinal anesthesia, cemented posterior cruciate-retaining prosthesis. Clean wound closure.
              </p>
            </div>
          </div>

          {/* Chronological Clinical Timeline */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-700" />
              <span>Chronological Care Timeline</span>
            </h3>

            <div className="space-y-4 relative pl-4 border-l-2 border-teal-200 ml-3">
              {(profile?.timeline || [
                { title: 'Initial Assessment', date: '19 Sep 2026', summary: 'Baseline post-discharge assessment. Flexion 45°, pain 6/10.' },
                { title: 'Visit 1 - Bedside Cryotherapy & Quad Setting', date: '23 Sep 2026', summary: 'Quad sets initiated. Extension lag reduced from -10° to -6°.' },
                { title: 'Visit 2 - Passive Range Expansion', date: '28 Sep 2026', summary: 'Active-assisted flexion reached 72°. Tolerated seated heel slides.' },
                { title: 'Visit 3 - Milestone Evaluation', date: '03 Oct 2026', summary: 'Active flexion reached 88°. Patellar glide free. Walker transition started.' },
                { title: 'Follow-Up Review Scheduled', date: '07 Oct 2026', summary: 'Stair navigation and single cane weight transfer protocol.' }
              ]).map((event: any, i: number) => (
                <div key={i} className="relative group cursor-pointer">
                  <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-teal-600 border-2 border-white shadow-2xs" />
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 hover:border-teal-300 transition-all space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800">{event.title}</h4>
                      <span className="text-[10px] font-mono text-teal-700 font-bold">{event.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{event.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. INITIAL ASSESSMENT FORM */}
      {/* ======================================================== */}
      {subTab === 'assessment' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" />
                <span>Comprehensive Clinical Assessment</span>
              </h3>
              <p className="text-xs text-slate-500">Subjective, objective, clinical reasoning and recovery plan</p>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
              assessmentStatus === 'FINALIZED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {assessmentStatus}
            </span>
          </div>

          {assessmentSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{assessmentSuccessMsg}</span>
            </div>
          )}

          {/* Section 1: Subjective */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
            <span className="text-xs font-extrabold text-teal-900 uppercase tracking-wider block">
              1. Subjective Examination
            </span>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Main Complaint</label>
                <input
                  type="text"
                  value={assessmentSubjective.main_complaint}
                  onChange={(e) => setAssessmentSubjective({ ...assessmentSubjective, main_complaint: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Onset / Post-Op Day</label>
                  <input
                    type="text"
                    value={assessmentSubjective.onset}
                    onChange={(e) => setAssessmentSubjective({ ...assessmentSubjective, onset: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">VAS Pain Score (1-10)</label>
                  <input
                    type="text"
                    value={assessmentSubjective.pain_score}
                    onChange={(e) => setAssessmentSubjective({ ...assessmentSubjective, pain_score: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Functional Limitations</label>
                <input
                  type="text"
                  value={assessmentSubjective.limitations}
                  onChange={(e) => setAssessmentSubjective({ ...assessmentSubjective, limitations: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Patient Rehabilitation Goals</label>
                <input
                  type="text"
                  value={assessmentSubjective.goals}
                  onChange={(e) => setAssessmentSubjective({ ...assessmentSubjective, goals: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Objective */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
            <span className="text-xs font-extrabold text-teal-900 uppercase tracking-wider block">
              2. Objective Physical Examination
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Knee Flexion (ROM)</label>
                <input
                  type="text"
                  value={assessmentObjective.rom_flexion}
                  onChange={(e) => setAssessmentObjective({ ...assessmentObjective, rom_flexion: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Knee Extension Lag</label>
                <input
                  type="text"
                  value={assessmentObjective.rom_extension}
                  onChange={(e) => setAssessmentObjective({ ...assessmentObjective, rom_extension: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Quadriceps MMT Strength</label>
                <input
                  type="text"
                  value={assessmentObjective.strength_quads}
                  onChange={(e) => setAssessmentObjective({ ...assessmentObjective, strength_quads: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Balance / Gait Analysis</label>
                <input
                  type="text"
                  value={assessmentObjective.gait}
                  onChange={(e) => setAssessmentObjective({ ...assessmentObjective, gait: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Therapist Clinical Observations</label>
              <textarea
                value={assessmentObjective.therapist_observations}
                onChange={(e) => setAssessmentObjective({ ...assessmentObjective, therapist_observations: e.target.value })}
                rows={2}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          {/* Section 3: Assessment Reasoning */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
            <span className="text-xs font-extrabold text-teal-900 uppercase tracking-wider block">
              3. Physiotherapist Clinical Reasoning
            </span>
            <textarea
              value={assessmentClinicalReasoning}
              onChange={(e) => setAssessmentClinicalReasoning(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium leading-relaxed"
            />
          </div>

          {/* Section 4: Care Plan */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
            <span className="text-xs font-extrabold text-teal-900 uppercase tracking-wider block">
              4. Treatment Plan & Milestones
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Visit Frequency</label>
                <input
                  type="text"
                  value={assessmentPlan.frequency}
                  onChange={(e) => setAssessmentPlan({ ...assessmentPlan, frequency: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Review Date</label>
                <input
                  type="text"
                  value={assessmentPlan.review_date}
                  onChange={(e) => setAssessmentPlan({ ...assessmentPlan, review_date: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Home Program Exercises</label>
              <textarea
                value={assessmentPlan.home_program}
                onChange={(e) => setAssessmentPlan({ ...assessmentPlan, home_program: e.target.value })}
                rows={2}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
          </div>

          {/* Action Buttons: Save Draft & Finalize */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => handleSaveAssessment('DRAFT')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={() => handleSaveAssessment('FINALIZED')}
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finalize Assessment</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SOAP NOTES & AI ASSISTANT */}
      {/* ======================================================== */}
      {subTab === 'soap' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-700" />
                <span>Clinical SOAP Documentation</span>
              </h3>
              <p className="text-xs text-slate-500">Daily visit notes with AI-assisted clinical delta synthesis</p>
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={handleGenerateAIDraft}
              disabled={isGeneratingAIDraft}
              className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAIDraft ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAIDraft ? 'Analyzing Delta...' : 'Generate AI SOAP Draft'}</span>
            </button>
          </div>

          {/* AI Clinical Disclaimer Banner */}
          {aiDraftDisclaimer && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between text-xs text-teal-900 animate-in fade-in">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="font-bold">{aiDraftDisclaimer}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setAiDraftDisclaimer(null)}
                  className="px-2 py-0.5 bg-white text-teal-800 border border-teal-200 rounded-md font-bold text-[10px]"
                >
                  Use Draft
                </button>
                <button
                  onClick={() => {
                    setAiDraftDisclaimer(null);
                    setSoapSubjective('');
                    setSoapObjective('');
                    setSoapAssessment('');
                    setSoapPlan('');
                  }}
                  className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md font-bold text-[10px]"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {soapSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{soapSuccessMsg}</span>
            </div>
          )}

          {/* S - Subjective */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-900 font-extrabold flex items-center justify-center text-[10px]">S</span>
                <span>SUBJECTIVE (Patient Symptoms & Adherence)</span>
              </label>
            </div>
            <textarea
              value={soapSubjective}
              onChange={(e) => setSoapSubjective(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          {/* O - Objective */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-900 font-extrabold flex items-center justify-center text-[10px]">O</span>
                <span>OBJECTIVE (Range of Motion, Goniometry, Vitals)</span>
              </label>
            </div>
            <textarea
              value={soapObjective}
              onChange={(e) => setSoapObjective(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          {/* A - Assessment */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-900 font-extrabold flex items-center justify-center text-[10px]">A</span>
                <span>ASSESSMENT (Therapist Clinical Reasoning)</span>
              </label>
            </div>
            <textarea
              value={soapAssessment}
              onChange={(e) => setSoapAssessment(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          {/* P - Plan */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-900 font-extrabold flex items-center justify-center text-[10px]">P</span>
                <span>PLAN (Interventions, Next Review & Home Dosage)</span>
              </label>
            </div>
            <textarea
              value={soapPlan}
              onChange={(e) => setSoapPlan(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            />
          </div>

          {/* Actions: Save Draft & Finalize */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => handleSaveSOAP('DRAFT')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={() => handleSaveSOAP('FINALIZED')}
              className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Commit Note</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MOVEMENT / CAMERA ANALYSIS */}
      {/* ======================================================== */}
      {subTab === 'movement' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-teal-700" />
                <span>Camera / Pose Goniometry Analysis</span>
              </h3>
              <p className="text-xs text-slate-500">Record or upload exercise execution for angle measurement</p>
            </div>

            <button
              onClick={handleSimulateMovementAnalysis}
              disabled={isAnalyzingMovement}
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isAnalyzingMovement ? 'Detecting Pose...' : 'Start Camera Check'}</span>
            </button>
          </div>

          {/* Disclaimer Banner */}
          <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-2xl text-xs text-teal-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span className="font-bold">AI-assisted measurement — therapist verification required.</span>
          </div>

          {movementVerificationMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{movementVerificationMsg}</span>
            </div>
          )}

          {/* Goniometry Telemetry Display */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">Target Joint</span>
                <span className="text-sm font-extrabold text-white">{movementMetric.movement_type}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                movementMetric.verified ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
              }`}>
                {movementMetric.verified ? 'Therapist Verified' : 'Pending Verification'}
              </span>
            </div>

            {/* Measured Angle Box */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-medium">Estimated Angle</span>
                <span className="text-xl font-black text-teal-300">{movementMetric.estimated_angle}°</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-medium">Previous Angle</span>
                <span className="text-xl font-black text-slate-300">{movementMetric.previous_angle}°</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-medium">Progress Change</span>
                <span className="text-xl font-black text-emerald-400">{movementMetric.change}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Repetitions Detected: <strong className="text-white">{movementMetric.reps} reps</strong></span>
              <span>Duration: <strong className="text-white">{movementMetric.duration}</strong></span>
            </div>
          </div>

          {/* Clinician Angle Verification & Correction Controls */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-800">Therapist Verification Action</h4>
            <p className="text-slate-600">
              Verify whether the computer vision goniometry aligns with your physical manual goniometer assessment:
            </p>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] font-bold text-slate-500">Correct Value (°):</label>
                <input
                  type="number"
                  value={movementMetric.corrected_angle}
                  onChange={(e) => setMovementMetric({ ...movementMetric, corrected_angle: e.target.value })}
                  className="w-16 p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center"
                />
              </div>

              <button
                onClick={() => handleVerifyMovement(true)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
              >
                Correct & Save
              </button>

              <button
                onClick={() => handleVerifyMovement(false)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-xs ml-auto"
              >
                Verify 88°
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. GOALS MANAGEMENT */}
      {/* ======================================================== */}
      {subTab === 'goals' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-teal-700" />
                <span>Rehabilitation Target Goals</span>
              </h3>
              <p className="text-xs text-slate-500">Track longitudinal recovery targets and milestone dates</p>
            </div>

            <button
              onClick={() => setIsAddingGoal(!isAddingGoal)}
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </button>
          </div>

          {/* Add Goal Form */}
          {isAddingGoal && (
            <form onSubmit={handleAddGoal} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800">Create New Clinical Target</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Goal Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quadriceps Terminal Extension"
                    value={newGoalForm.goal_name}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, goal_name: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Target Date</label>
                  <input
                    type="date"
                    value={newGoalForm.target_date}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, target_date: e.target.value })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Baseline</label>
                  <input
                    type="number"
                    value={newGoalForm.baseline}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, baseline: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Current</label>
                  <input
                    type="number"
                    value={newGoalForm.current_value}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, current_value: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-0.5">Target</label>
                  <input
                    type="number"
                    value={newGoalForm.target_value}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, target_value: Number(e.target.value) })}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingGoal(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Goal
                </button>
              </div>
            </form>
          )}

          {/* Goals List */}
          <div className="space-y-3">
            {goals.map((g, idx) => {
              // Calculate progress percentage
              const totalSpan = Math.abs(g.target_value - g.baseline);
              const currentSpan = Math.abs(g.current_value - g.baseline);
              const progressPct = totalSpan > 0 ? Math.min(100, Math.round((currentSpan / totalSpan) * 100)) : 100;

              return (
                <div key={g.id || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800">{g.goal_name}</h4>
                      <p className="text-[10px] text-slate-400">Target Date: {g.target_date}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 uppercase">
                      {g.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                      <span>Baseline: {g.baseline}{g.unit}</span>
                      <span className="text-teal-700">Current: {g.current_value}{g.unit}</span>
                      <span>Target: {g.target_value}{g.unit}</span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
