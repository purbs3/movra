import React, { useState, useEffect } from 'react';
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
  TrendingUp, 
  Target, 
  Apple, 
  ChevronDown, 
  Phone, 
  Home, 
  X, 
  Stethoscope,
  MessageSquare,
  FileText,
  UserCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { TodayPlanData, Exercise, BookingRequest } from '../types';
import { ExerciseModal } from './ExerciseModal';
import { api } from '../services/api';

interface DashboardViewProps {
  planData: TodayPlanData;
  onStartExercise: (exercise: Exercise) => void;
  onOpenVoiceModal: () => void;
  onNavigateToChat: () => void;
  onToggleExerciseComplete: (id: string) => void;
  onOpenBookVisit?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  planData,
  onStartExercise,
  onOpenVoiceModal,
  onNavigateToChat,
  onToggleExerciseComplete,
  onOpenBookVisit,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isDietaryExpanded, setIsDietaryExpanded] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  // Bookings state
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.getMyBookings({ user_id: planData.patient.id }).then((list) => {
      if (isMounted && list && list.length > 0) {
        setBookings(list);
      }
    });
    return () => { isMounted = false; };
  }, [planData.patient.id]);

  const latestBooking = bookings.find(b => b.status === 'PENDING' || b.status === 'CONFIRMED') || bookings[0];

  const handleStart = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsExerciseModalOpen(true);
  };

  // Completed metrics
  const completedCount = planData.exercises.filter((e) => e.completed).length;
  const totalCount = planData.exercises.length;
  const exercisePercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const greeting = planData.greeting || `Good morning, ${planData.patient.name}`;
  const recoveryScore = planData.recovery_progress_percentage || 72;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-200">
      {/* Clinician Oversight & Demo Status Banner */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
        <div className="flex items-center gap-1.5 text-teal-800 font-semibold">
          <span className="w-2 h-2 rounded-full bg-teal-600"></span>
          <span>Post-Op Day {planData.patient.post_op_day} · {planData.patient.surgery}</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
          Demo Clinical Telemetry
        </span>
      </div>

      {/* Patient Greeting & Recovery Score Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-950 tracking-tight">
              {greeting}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Recovery roadmap verified by primary physiotherapist.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
            {planData.patient.name ? planData.patient.name.slice(0, 2).toUpperCase() : 'RS'}
          </div>
        </div>

        {/* Core KPI Metrics Grid (Section 8: Score, Pain Trend, Exercises, Next Appt) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Recovery Score */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Recovery Score
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-slate-950 font-mono">{recoveryScore}%</span>
              <span className="text-[10px] text-teal-700 font-semibold">On Track</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-teal-700 rounded-full" style={{ width: `${recoveryScore}%` }} />
            </div>
          </div>

          {/* Pain Trend */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Pain Trend (VAS)
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-semibold text-slate-400 line-through">4/10</span>
              <span className="text-xs font-bold text-slate-400">→</span>
              <span className="text-2xl font-black text-emerald-700 font-mono">2/10</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">Reduced after icing</span>
          </div>

          {/* Today's Exercises */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Today's Exercises
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-slate-950 font-mono">{completedCount}</span>
              <span className="text-xs text-slate-400">/ {totalCount} completed</span>
            </div>
            <span className="text-[10px] text-teal-700 font-semibold block mt-1">{exercisePercentage}% Completed</span>
          </div>

          {/* Next Appointment */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Next Home Visit
            </span>
            <span className="text-xs font-bold text-slate-900 block mt-1 truncate">
              {latestBooking ? latestBooking.preferred_date : 'Tomorrow · 6:30 PM'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {latestBooking ? latestBooking.preferred_time : 'Dr. Ananya Iyer, PT'}
            </span>
          </div>
        </div>
      </div>

      {/* Assigned Physiotherapist Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900">Dr. Ananya Iyer</h3>
                <span className="text-[9px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  PT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Primary Physiotherapist · Patna Hub</p>
            </div>
          </div>
          <a
            href="tel:+919820144829"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Call Care Coordinator"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Latest Clinical Note from PT */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
            <MessageSquare className="w-3 h-3 text-teal-700" />
            <span>Latest Note from Dr. Iyer</span>
          </div>
          <p className="italic leading-relaxed">
            "Good quadriceps recruitment with reduced joint warmth. Maintain terminal extension towel rolls for 5 mins morning and evening."
          </p>
        </div>
      </div>

      {/* Mobility & Joint Telemetry (Goniometer Tracking) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Joint Mobility Telemetry
            </span>
            <h2 className="text-base font-bold text-slate-950 mt-0.5">
              Active Knee Range of Motion
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            Day 14 Stage
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-slate-500 text-[11px] block">Active Knee Flexion</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {planData.metrics.knee_flexion_degrees}°
              </span>
              <span className="text-[11px] text-slate-400">Target: {planData.metrics.knee_flexion_goal_degrees}°</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div 
                className="h-full bg-teal-700 rounded-full" 
                style={{ width: `${Math.min(100, (planData.metrics.knee_flexion_degrees / planData.metrics.knee_flexion_goal_degrees) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-slate-500 text-[11px] block">Extension Lag</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {planData.metrics.knee_extension_degrees}°
              </span>
              <span className="text-[11px] text-slate-400">Target: {planData.metrics.knee_extension_goal_degrees}°</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">
              Clearing extensor lag ✓
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Daily Ambulation Steps:</span>
          <span className="font-mono font-bold text-slate-900">{planData.metrics.daily_steps || 1420} steps</span>
        </div>
      </div>

      {/* Today's Prescribed Exercises Module */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Prescribed Regimen
            </span>
            <h2 className="text-base font-bold text-slate-950 mt-0.5">
              Today's Rehabilitation Routine
            </h2>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
            {completedCount}/{totalCount} Completed
          </span>
        </div>

        <div className="space-y-2.5">
          {planData.exercises.map((exercise) => {
            const isDone = exercise.completed;
            return (
              <div
                key={exercise.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isDone 
                    ? 'bg-slate-50/70 border-slate-200/70 opacity-80' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => onToggleExerciseComplete(exercise.id)}
                      className={`mt-0.5 p-1 rounded-md transition-colors cursor-pointer ${
                        isDone 
                          ? 'text-emerald-700 bg-emerald-50' 
                          : 'text-slate-300 hover:text-teal-700 hover:bg-teal-50'
                      }`}
                      title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isDone ? 'fill-emerald-100' : ''}`} />
                    </button>
                    <div>
                      <h3 className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {exercise.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{exercise.sets} sets × {exercise.reps} reps</span>
                        <span>·</span>
                        <span>{exercise.hold_seconds ? `${exercise.hold_seconds}s hold` : `${exercise.duration_minutes} min`}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {exercise.clinical_tip}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStart(exercise)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold shrink-0 cursor-pointer"
                  >
                    Guide
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consistency Streak & Quick Voice Consultation Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white">6-Day Rehabilitation Streak</span>
          </div>
          <span className="text-[10px] font-mono text-teal-400">94% Adherence</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          Consistent daily terminal extension prevents flexion contracture and accelerates unassisted cane walking.
        </p>

        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={onOpenVoiceModal}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5 text-teal-700" />
            <span>Voice Form Consultation</span>
          </button>
          <button
            onClick={onNavigateToChat}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
            title="Open Chat"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Exercise Modal Guide */}
      {selectedExercise && (
        <ExerciseModal
          isOpen={isExerciseModalOpen}
          exercise={selectedExercise}
          onClose={() => setIsExerciseModalOpen(false)}
          onComplete={(id) => {
            onToggleExerciseComplete(id);
            setIsExerciseModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
