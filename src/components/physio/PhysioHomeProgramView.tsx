import React, { useState } from 'react';
import { 
  Activity, 
  Plus, 
  Trash2, 
  Send, 
  Save, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  Dumbbell, 
  Clock, 
  Check, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Exercise } from '../../types';

interface PhysioHomeProgramViewProps {
  patientId: string;
  patientName?: string;
  onSendToPatient?: (program: any) => void;
}

export const PhysioHomeProgramView: React.FC<PhysioHomeProgramViewProps> = ({
  patientId,
  patientName = 'Rahul Sharma',
  onSendToPatient
}) => {
  const [activeTab, setActiveTab] = useState<'program' | 'library'>('program');
  const [searchLibraryQuery, setSearchLibraryQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Home Program Activities State
  const [activities, setActivities] = useState<any[]>([
    {
      id: 1,
      name: 'Active-Assisted Seated Heel Slides',
      instructions: 'Sit tall on firm surface with towel beneath right heel. Slowly draw heel toward chair while flexing knee to tolerance.',
      sets: 3,
      reps: 10,
      duration: '5 minutes',
      frequency: '3 times daily',
      precautions: 'Do not force past sharp 4/10 pain. Maintain upright lumbar posture.',
      notes: 'Focus on smooth deceleration when releasing back to extension.'
    },
    {
      id: 2,
      name: 'Isometric Quadriceps Setting (Towel Roll)',
      instructions: 'Place rolled small towel beneath knee. Contract quadriceps firmly pushing back of knee down into towel roll.',
      sets: 3,
      reps: 12,
      duration: '5-second terminal hold',
      frequency: 'Every 2 hours during day',
      precautions: 'Ensure patella glides superiorly during voluntary recruitment.',
      notes: 'Vital for clearing remaining -3° extension lag.'
    },
    {
      id: 3,
      name: 'Prone Terminal Knee Extension Hangs',
      instructions: 'Lie prone with lower legs hanging off edge of mattress just above patella. Relax hamstrings allowing gravity to provide gentle extension stretch.',
      sets: 2,
      reps: 1,
      duration: '3 to 5 minutes',
      frequency: 'Twice daily',
      precautions: 'Stop if anterior knee pinching occurs. Support contralateral ankle.',
      notes: 'Assists passive terminal extension.'
    }
  ]);

  // Exercise Library
  const exerciseLibrary = [
    {
      id: 'ex-1',
      name: 'Seated Heel Slides with Towel Assist',
      category: 'Orthopedic / Post-operative',
      target: 'Knee Flexion & Hamstring Co-contraction',
      instructions: 'Slide heel back towards glutes using strap/towel assist. Hold 3 seconds at end range.',
      dosage: '3 sets × 10 reps',
      precautions: 'Avoid jerking at terminal flexion; do not substitute with hip adduction.',
      ai_suggested: true
    },
    {
      id: 'ex-2',
      name: 'Straight Leg Raises (SLR) with Terminal Hold',
      category: 'Orthopedic / Post-operative',
      target: 'Vastus Medialis Obliquus & Hip Flexors',
      instructions: 'Keep knee fully locked straight. Raise leg 8-10 inches off table, hold 5 seconds, slowly lower.',
      dosage: '3 sets × 10 reps',
      precautions: 'Do not allow extensor lag during initial lift phase.',
      ai_suggested: false
    },
    {
      id: 'ex-3',
      name: 'Ankle Plantar & Dorsiflexion Pumps',
      category: 'Post-operative / Geriatric',
      target: 'Calf Muscle Pump & Venous Return',
      instructions: 'Pump feet briskly up and down through full range of motion.',
      dosage: '20 reps every hour',
      precautions: 'Stop and alert clinician if unilateral calf tenderness develops.',
      ai_suggested: false
    },
    {
      id: 'ex-4',
      name: 'Single Leg Stance Balance (Parallel Bar)',
      category: 'Geriatric / Neurological',
      target: 'Proprioception & Ankle Strategy',
      instructions: 'Stand near kitchen counter or table. Lift unaffected foot and hold balance on surgical limb.',
      dosage: '4 sets × 15-30 seconds',
      precautions: 'Keep hand hover-ready above support surface for fall prevention.',
      ai_suggested: true
    },
    {
      id: 'ex-5',
      name: 'McKenzie Prone Press-ups',
      category: 'Orthopedic / Back Care',
      target: 'Lumbar Extension & Disc Centralization',
      instructions: 'Lie prone. Place hands under shoulders and press upper body up keeping pelvis firmly on mattress.',
      dosage: '2 sets × 10 reps',
      precautions: 'Do not perform if symptoms peripheralize into calf or foot.',
      ai_suggested: true
    },
    {
      id: 'ex-6',
      name: 'Bridging with Pelvic Neutral',
      category: 'Sports / Orthopedic',
      target: 'Gluteus Maximus & Core Stability',
      instructions: 'Bend knees with feet flat. Squeeze glutes and raise pelvis until thighs align with torso.',
      dosage: '3 sets × 10 reps with 3s hold',
      precautions: 'Do not hyperextend lumbar spine.',
      ai_suggested: false
    }
  ];

  const handleAddFromLibrary = (item: any) => {
    const newAct = {
      id: Date.now(),
      name: item.name,
      instructions: item.instructions,
      sets: 3,
      reps: 10,
      duration: '3 mins',
      frequency: '2-3 times daily',
      precautions: item.precautions,
      notes: `Target: ${item.target}`
    };
    setActivities(prev => [...prev, newAct]);
    setActiveTab('program');
    setSuccessMessage(`Added "${item.name}" to ${patientName}'s home exercise program.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleRemoveActivity = (id: number) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const handleSendToPatient = () => {
    if (onSendToPatient) {
      onSendToPatient({
        patient_id: patientId,
        activities
      });
    }
    setSuccessMessage(`Home Exercise Program sent directly to ${patientName}'s patient app & today's recovery plan!`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const filteredLibrary = exerciseLibrary.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchLibraryQuery.toLowerCase()) ||
      ex.target.toLowerCase().includes(searchLibraryQuery.toLowerCase());
    if (selectedCategory === 'All') return matchesSearch;
    return matchesSearch && ex.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Banner and Navigation */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-teal-700" />
              <span>Home Exercise Program (HEP) Builder</span>
            </h2>
            <p className="text-xs text-slate-500">
              Prescribe therapist-curated home activities for <strong>{patientName}</strong>
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('program')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'program' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
              }`}
            >
              Prescribed Program ({activities.length})
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'library' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
              }`}
            >
              Exercise Library
            </button>
          </div>
        </div>

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: PRESCRIBED EXERCISE PROGRAM */}
      {/* ======================================================== */}
      {activeTab === 'program' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Active Prescribed Activities</span>
            <button
              onClick={() => setActiveTab('library')}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add From Library</span>
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((act, index) => (
              <div
                key={act.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3 hover:border-teal-300 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{act.name}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{act.instructions}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveActivity(act.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="Remove from Program"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Dosage Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Dosage Sets</span>
                    <span className="font-bold text-slate-800">{act.sets} Sets × {act.reps} Reps</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Hold / Duration</span>
                    <span className="font-bold text-slate-800">{act.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Frequency</span>
                    <span className="font-bold text-teal-700">{act.frequency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Precautions</span>
                    <span className="font-medium text-slate-600 truncate block">{act.precautions}</span>
                  </div>
                </div>

                {act.notes && (
                  <p className="text-[11px] text-slate-500 italic">
                    <strong>Therapist Note:</strong> {act.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveTab('library')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Activity</span>
            </button>

            <button
              onClick={handleSendToPatient}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Send Program to Patient</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: EXERCISE LIBRARY */}
      {/* ======================================================== */}
      {activeTab === 'library' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Clinical Exercise Library</h3>
              <p className="text-xs text-slate-500">Rehabilitation activities categorized by pathology</p>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchLibraryQuery}
                onChange={(e) => setSearchLibraryQuery(e.target.value)}
                placeholder="Search exercise by target muscle, joint, or technique..."
                className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              {(['All', 'Orthopedic', 'Neurological', 'Geriatric', 'Sports', 'Post-operative'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-teal-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="space-y-3">
            {filteredLibrary.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-teal-400 transition-all space-y-2 bg-slate-50/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-xs text-slate-900">{item.name}</h4>
                      {item.ai_suggested && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-teal-600" />
                          Suggested for therapist review
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block mt-0.5">
                      {item.category} · Target: {item.target}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddFromLibrary(item)}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all shadow-2xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to HEP</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{item.instructions}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/70">
                  <span><strong>Dosage:</strong> {item.dosage}</span>
                  <span className="truncate max-w-[200px]"><strong>Precautions:</strong> {item.precautions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
