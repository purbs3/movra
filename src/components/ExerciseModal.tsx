import React, { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle2, RotateCcw, Volume2, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import { Exercise } from '../types';

interface ExerciseModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (exerciseId: string) => void;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(1);
  const [isHolding, setIsHolding] = useState(false);
  const [holdTimer, setHoldTimer] = useState(exercise?.hold_seconds || 5);
  const [isPaused, setIsPaused] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Sync holdTimer when exercise changes
  useEffect(() => {
    if (exercise?.hold_seconds) {
      setHoldTimer(exercise.hold_seconds);
    }
  }, [exercise]);

  // Hold timer countdown effect
  useEffect(() => {
    if (!isOpen || !exercise) return;

    let interval: any = null;
    if (isHolding && !isPaused && holdTimer > 0) {
      interval = setInterval(() => {
        setHoldTimer((prev) => prev - 1);
      }, 1000);
    } else if (isHolding && holdTimer === 0) {
      setIsHolding(false);
      setHoldTimer(exercise.hold_seconds || 5);
      // Advance rep
      if (currentRep < exercise.reps) {
        setCurrentRep((r) => r + 1);
      } else {
        // Advance set or complete
        if (currentSet < exercise.sets) {
          setCurrentSet((s) => s + 1);
          setCurrentRep(1);
        } else {
          setIsDone(true);
        }
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, exercise, isHolding, isPaused, holdTimer, currentRep, currentSet]);

  if (!isOpen || !exercise) return null;

  const handleStartHold = () => {
    setIsHolding(true);
    setHoldTimer(exercise.hold_seconds || 5);
  };

  const handleFinish = () => {
    onComplete(exercise.id);
    onClose();
  };

  const resetSession = () => {
    setCurrentSet(1);
    setCurrentRep(1);
    setIsHolding(false);
    setHoldTimer(exercise.hold_seconds || 5);
    setIsDone(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-teal-50/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-full">
              {exercise.category}
            </span>
            <h3 className="font-bold text-slate-800 text-lg mt-1">{exercise.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Visual Coaching Animation & Goniometer graphic */}
          <div className="relative bg-gradient-to-b from-teal-50/80 to-slate-50 border border-teal-100/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            {/* Visual Movement Demonstration SVG */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Outer ring */}
              <div
                className={`w-32 h-32 rounded-full border-4 border-dashed border-teal-200 flex items-center justify-center transition-transform duration-700 ${
                  isHolding ? 'scale-105 border-teal-500 animate-spin-slow' : ''
                }`}
              >
                {/* Leg movement visualization */}
                <svg viewBox="0 0 100 100" className="w-24 h-24 text-teal-600">
                  {/* Hip joint */}
                  <circle cx="35" cy="40" r="4" fill="currentColor" />
                  {/* Femur (Thigh) */}
                  <line x1="35" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  {/* Knee joint */}
                  <circle cx="60" cy="40" r="4" fill="#0f766e" />
                  {/* Tibia (Shin/Foot) dynamically extending based on hold */}
                  <line
                    x1="60"
                    y1="40"
                    x2={isHolding ? "85" : "75"}
                    y2={isHolding ? "42" : "70"}
                    stroke="#0d9488"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  {/* Foot indicator */}
                  <line
                    x1={isHolding ? "85" : "75"}
                    y1={isHolding ? "42" : "70"}
                    x2={isHolding ? "90" : "80"}
                    y2={isHolding ? "38" : "70"}
                    stroke="#0d9488"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
              </div>

              {/* Countdown overlay during hold */}
              {isHolding && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-teal-600/90 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold shadow-lg animate-pulse">
                    {holdTimer}s
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {isHolding ? 'Hold Quadriceps Tight...' : isDone ? 'Exercise Finished!' : 'Ready for Repetition'}
              </span>
              <p className="text-xs text-teal-800 font-medium mt-0.5">
                Target: {exercise.target_muscle}
              </p>
            </div>
          </div>

          {/* Reps & Sets Counters */}
          {!isDone ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
                <span className="text-xs font-medium text-slate-500">Set</span>
                <div className="text-2xl font-bold text-slate-800">
                  {currentSet} <span className="text-slate-400 text-sm">/ {exercise.sets}</span>
                </div>
              </div>
              <div className="p-3.5 bg-teal-50/60 border border-teal-200/60 rounded-2xl text-center">
                <span className="text-xs font-medium text-teal-700">Rep</span>
                <div className="text-2xl font-bold text-teal-900">
                  {currentRep} <span className="text-teal-500 text-sm">/ {exercise.reps}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-900">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
              <div className="font-bold text-base">Great Work, Rahul!</div>
              <p className="text-xs text-emerald-700 mt-1">
                Prescribed sets completed. Recorded in your recovery journal.
              </p>
            </div>
          )}

          {/* Clinical Tip */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Physio Form Cue: </span>
              {exercise.clinical_tip}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/70 flex items-center gap-3">
          {!isDone ? (
            <>
              {!isHolding ? (
                <button
                  onClick={handleStartHold}
                  className="flex-1 py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl shadow-sm shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Begin {exercise.hold_seconds}s Hold</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="flex-1 py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all"
                >
                  <Pause className="w-4 h-4" />
                  <span>{isPaused ? 'Resume Hold' : 'Pause'}</span>
                </button>
              )}
              <button
                onClick={resetSession}
                className="p-3.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-2xl hover:bg-slate-100"
                title="Restart exercise"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-sm shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Mark Session as Complete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
