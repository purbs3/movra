import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Sparkles, 
  Mic, 
  Activity, 
  Flame, 
  ChevronRight, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  Target,
  Apple,
  Lightbulb,
  ChevronDown,
  Info
} from 'lucide-react';
import { TodayPlanData, Exercise } from '../types';
import { ExerciseModal } from './ExerciseModal';

interface DashboardViewProps {
  planData: TodayPlanData;
  onStartExercise: (exercise: Exercise) => void;
  onOpenVoiceModal: () => void;
  onNavigateToChat: () => void;
  onToggleExerciseComplete: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  planData,
  onStartExercise,
  onOpenVoiceModal,
  onNavigateToChat,
  onToggleExerciseComplete,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isDietaryExpanded, setIsDietaryExpanded] = useState(false);
  const [isTipsExpanded, setIsTipsExpanded] = useState(false);

  const handleStart = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsExerciseModalOpen(true);
  };

  const handleCompleteExercise = (exerciseId: string) => {
    onToggleExerciseComplete(exerciseId);
  };

  // Calculate dynamic progress
  const completedCount = planData.exercises.filter((e) => e.completed).length;
  const totalCount = planData.exercises.length;
  const exercisePercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const greeting = planData.greeting || `Good morning, ${planData.patient.name}`;
  const streakLabel = planData.gamification?.streak_label || `${planData.consistency.current_streak_days}-Day Streak`;
  const accuracyLabel = planData.gamification?.ai_accuracy_label || '94% AI Accuracy';
  const weeklyGoalPercent = planData.weekly_recovery_goal?.percentage ?? planData.recovery_progress_percentage ?? 80;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Patient Greeting & Status */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            Post-Op Day {planData.patient.post_op_day} • {planData.patient.surgery}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
            {greeting}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your knee extension stability is on track for Day {planData.patient.post_op_day} milestones.
          </p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-teal-500 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-teal-600/20 border-2 border-white">
          {planData.patient.name ? planData.patient.name.slice(0, 2).toUpperCase() : 'RS'}
        </div>
      </div>

      {/* Gamification Stats: 6-Day Streak & 94% AI Accuracy */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/80 border border-amber-200/70 p-3.5 rounded-2xl flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs shadow-amber-500/30">
            <Flame className="w-5 h-5 fill-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
              Consistency Streak
            </span>
            <span className="text-base font-extrabold text-amber-950">
              {streakLabel}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-emerald-50/80 border border-teal-200/70 p-3.5 rounded-2xl flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 bg-teal-600 text-white rounded-xl shadow-xs shadow-teal-600/30">
            <Target className="w-5 h-5 stroke-[2.25]" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
              Clinical Precision
            </span>
            <span className="text-base font-extrabold text-teal-950">
              {accuracyLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Prominent "AI Voice Physio Ready" Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-800 via-teal-700 to-teal-900 text-white p-5 shadow-lg shadow-teal-900/15 border border-teal-600/30">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 -mb-6 w-24 h-24 rounded-full bg-emerald-400/15 blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-600/60 backdrop-blur-md border border-teal-400/30 text-[11px] font-semibold text-teal-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              AI Voice Physio Ready
            </div>
            <span className="text-[11px] text-teal-200/80 font-mono">Gemini 2.5 Live</span>
          </div>

          <h2 className="text-lg font-bold mt-2.5 text-white tracking-tight">
            Consult Dr. Movra by Voice
          </h2>
          <p className="text-xs text-teal-100/90 mt-1 leading-relaxed max-w-[280px]">
            Speak naturally to evaluate knee joint clicking, pain flare-ups, or form cues.
          </p>

          <div className="mt-4 flex items-center gap-2.5">
            <button
              onClick={onOpenVoiceModal}
              className="flex-1 py-2.5 px-4 bg-white text-teal-900 hover:bg-teal-50 rounded-2xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Mic className="w-4 h-4 text-teal-700" />
              <span>Start Voice Consultation</span>
            </button>
            <button
              onClick={onNavigateToChat}
              className="p-2.5 bg-teal-700/60 hover:bg-teal-600/70 border border-teal-500/40 rounded-2xl text-teal-100 transition-colors"
              title="Open Chat with RAG Clinical Agent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Recovery Goal (Progress Bar) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Weekly Recovery Goal
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {weeklyGoalPercent}%
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                On Schedule
              </span>
            </div>
          </div>
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
            <Activity className="w-6 h-6 stroke-[2.25]" />
          </div>
        </div>

        {/* Custom Progress Track */}
        <div className="space-y-1.5">
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500 rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${weeklyGoalPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-medium">
            <span>Day 1: Acute Healing</span>
            <span className="text-teal-700 font-semibold">
              {planData.weekly_recovery_goal?.label || `Day ${planData.patient.post_op_day} Recovery`}
            </span>
            <span>Target: 100% Return</span>
          </div>
        </div>

        {/* Quick Micro-Metrics */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Knee Flexion</span>
            <span className="text-sm font-bold text-slate-800">
              {planData.metrics.knee_flexion_degrees}°
            </span>
            <span className="text-[10px] text-teal-600 font-medium block">
              Goal: {planData.metrics.knee_flexion_goal_degrees}°
            </span>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Extension</span>
            <span className="text-sm font-bold text-slate-800">
              {planData.metrics.knee_extension_degrees}°
            </span>
            <span className="text-[10px] text-teal-600 font-medium block">
              Goal: {planData.metrics.knee_extension_goal_degrees}°
            </span>
          </div>

          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 block font-medium">Accuracy</span>
            <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-0.5 text-teal-700">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              94%
            </span>
            <span className="text-[10px] text-emerald-600 font-medium block">
              Physio Aligned
            </span>
          </div>
        </div>
      </div>

      {/* "Today's Plan" Cards (Knee Extension, Ankle Pumps) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Today's Plan</h2>
            <p className="text-xs text-slate-500">
              {completedCount} of {totalCount} prescribed sessions completed
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-200/60">
            {exercisePercentage}% Done
          </span>
        </div>

        {/* Exercises Cards List */}
        <div className="space-y-3">
          {planData.exercises.map((exercise) => {
            const isDone = exercise.completed;

            return (
              <div
                key={exercise.id}
                className={`p-4 rounded-3xl border transition-all duration-200 ${
                  isDone
                    ? 'bg-slate-50/80 border-slate-200/80 opacity-90'
                    : 'bg-white border-slate-200/80 hover:border-teal-300 shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleExerciseComplete(exercise.id)}
                      className={`mt-0.5 p-1 rounded-full transition-colors ${
                        isDone
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-slate-300 hover:text-teal-600 hover:bg-teal-50'
                      }`}
                      title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      <CheckCircle2 className={`w-5 h-5 ${isDone ? 'fill-emerald-100' : ''}`} />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-sm ${isDone ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                          {exercise.name}
                        </h3>
                        {exercise.difficulty && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full font-medium bg-slate-100 text-slate-600">
                            {exercise.difficulty}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-medium">
                          {exercise.sets} sets × {exercise.reps} reps
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {exercise.duration_minutes} min
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-1">
                        {exercise.clinical_tip}
                      </p>
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={() => handleStart(exercise)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      isDone
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs shadow-teal-700/20 active:scale-95'
                    }`}
                  >
                    {isDone ? 'Review' : 'Start'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recovery Dietary Advice (Agno Agent) */}
      {planData.dietary_plan && (
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3">
          <div 
            onClick={() => setIsDietaryExpanded(!isDietaryExpanded)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <Apple className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Recovery Dietary Advice
                </h3>
                <p className="text-[11px] text-slate-400">
                  {planData.dietary_plan.why_this_plan_works}
                </p>
              </div>
            </div>
            <button className="text-slate-400 p-1">
              <ChevronDown className={`w-4 h-4 transition-transform ${isDietaryExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {isDietaryExpanded && (
            <div className="pt-2 border-t border-slate-100 space-y-2.5 text-xs text-slate-600 animate-in fade-in">
              <div className="bg-slate-50 p-3 rounded-2xl whitespace-pre-line text-slate-700 leading-relaxed font-normal">
                {planData.dietary_plan.meal_plan}
              </div>

              {planData.dietary_plan.important_considerations && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    Important Considerations:
                  </span>
                  {planData.dietary_plan.important_considerations.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-amber-900 bg-amber-50/70 p-2 rounded-xl border border-amber-200/60">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pro Tips (Agno Physio Expert) */}
      {planData.tips && planData.tips.length > 0 && (
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] space-y-3">
          <div 
            onClick={() => setIsTipsExpanded(!isTipsExpanded)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  Clinical Pro Tips (Day {planData.patient.post_op_day})
                </h3>
                <p className="text-[11px] text-slate-400">
                  Cryotherapy, elevation & knee extension precautions
                </p>
              </div>
            </div>
            <button className="text-slate-400 p-1">
              <ChevronDown className={`w-4 h-4 transition-transform ${isTipsExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {isTipsExpanded && (
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs animate-in fade-in">
              {planData.tips.map((tip, idx) => (
                <div key={idx} className="p-2.5 bg-teal-50/60 border border-teal-100 rounded-xl text-teal-950 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Guided Exercise Coach Modal */}
      {isExerciseModalOpen && selectedExercise && (
        <ExerciseModal
          exercise={selectedExercise}
          isOpen={isExerciseModalOpen}
          onClose={() => setIsExerciseModalOpen(false)}
          onComplete={handleCompleteExercise}
        />
      )}
    </div>
  );
};
