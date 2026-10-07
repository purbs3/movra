import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Award, 
  Flame, 
  Compass, 
  FileCheck, 
  ChevronRight, 
  Info,
  ShieldAlert,
  BarChart3,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight,
  Database
} from 'lucide-react';
import { TodayPlanData, ClinicalMilestone, ProgressAnalyticsData } from '../types';
import { api } from '../services/api';
import { RecoveryTwinView } from './RecoveryTwinView';

interface ProgressViewProps {
  planData: TodayPlanData;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ planData }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'twin'>('analytics');
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<ProgressAnalyticsData | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(true);

  // Fetch telemetry insights from AnalystAgent (Agno, DuckDB, Pandas on CSV)
  useEffect(() => {
    let isMounted = true;
    api.getProgressInsights('rahul_123')
      .then((data) => {
        if (isMounted) {
          setAnalytics(data);
          setIsLoadingAnalytics(false);
        }
      })
      .catch((err) => {
        console.warn('Analytics fetch error:', err);
        if (isMounted) setIsLoadingAnalytics(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const milestones: ClinicalMilestone[] = [
    {
      id: "m-ext-0",
      title: "Terminal Knee Extension (0°)",
      target: "0° (Full extension)",
      current_value: "-3° achieved",
      status: "achieved",
      date_achieved: "Day 14 (Today)",
      clinician_note: "Full passive extension achieved on supine roll. Extension lag reduced from -12° to -3°."
    },
    {
      id: "m-flex-90",
      title: "90° Knee Joint Flexion Goal",
      target: "90° Functional Flexion",
      current_value: "88° (2° to milestone)",
      status: "in_progress",
      clinician_note: "Expected clearance within 48 hours. Gained +43° from Day 1 baseline of 45°."
    },
    {
      id: "m-cane",
      title: "Single-Cane Ambulation",
      target: "Discard rolling walker",
      current_value: "Achieved",
      status: "achieved",
      date_achieved: "Day 7 (Sep 26)",
      clinician_note: "Gait symmetry verified. Pacing 1,420 steps daily with cane on opposite side."
    },
    {
      id: "m-stairs",
      title: "Reciprocal Stair Climbing",
      target: "Step-over-step ascent",
      current_value: "Upcoming (Target: Week 4)",
      status: "upcoming",
      clinician_note: "Requires 100° flexion and 4/5 quadriceps strength before initiating."
    },
    {
      id: "m-flex-120",
      title: "Full Physiological Flexion (120°)",
      target: "120° Flexion",
      current_value: "Target: Month 3",
      status: "upcoming",
      clinician_note: "Long-term surgical benchmark for low-impact cycling and kneeling comfort."
    }
  ];

  const flexionCurrent = planData.metrics.knee_flexion_degrees;
  const flexionGoal = planData.metrics.knee_flexion_goal_degrees;
  const flexionPercent = Math.min(100, Math.round((flexionCurrent / flexionGoal) * 100));

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 uppercase tracking-wider">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Clinical Telemetry & Progress</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
          Knee Recovery Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Objective telemetry and AI recovery forecasting based on recovery metrics.
        </p>

        {/* View Switcher: Historical Analytics vs AI Recovery Twin */}
        <div className="flex p-1 bg-slate-100 rounded-2xl text-xs font-bold mt-4">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Historical Analytics
          </button>
          <button
            onClick={() => setActiveTab('twin')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'twin' ? 'bg-white text-teal-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-teal-700" />
            <span>AI Recovery Twin</span>
          </button>
        </div>
      </div>

      {activeTab === 'twin' ? (
        <RecoveryTwinView patientId={planData.patient.id} />
      ) : (
        <>
          {/* AnalystAgent Insights Card */}
      {analytics && (
        <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-5 shadow-lg shadow-teal-950/20 border border-teal-700/40 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-[11px] font-semibold text-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>AI Analyst Agent (DuckDB + Pandas)</span>
            </div>
            <span className="text-[10px] text-teal-300/80 font-mono flex items-center gap-1">
              <Database className="w-3 h-3" />
              14-Day CSV
            </span>
          </div>

          <p className="text-xs text-teal-50/95 leading-relaxed font-normal">
            {analytics.analysis_narrative}
          </p>

          {/* Quick Stats Grid from CSV Analytics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-teal-700/40 text-center">
            <div className="bg-teal-950/50 p-2.5 rounded-xl border border-teal-600/30">
              <span className="text-[10px] text-teal-300 block font-medium">Pain (VAS)</span>
              <span className="text-base font-extrabold text-white flex items-center justify-center gap-0.5">
                {analytics.metrics_summary.latest_pain_level}/10
                <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
              </span>
              <span className="text-[9px] text-emerald-300 font-semibold block">
                -{analytics.metrics_summary.pain_reduction_percentage}%
              </span>
            </div>

            <div className="bg-teal-950/50 p-2.5 rounded-xl border border-teal-600/30">
              <span className="text-[10px] text-teal-300 block font-medium">Flexion</span>
              <span className="text-base font-extrabold text-white flex items-center justify-center gap-0.5">
                {analytics.metrics_summary.latest_flexion_degrees}°
                <ArrowUpRight className="w-3.5 h-3.5 text-teal-300" />
              </span>
              <span className="text-[9px] text-teal-300 font-semibold block">
                +{analytics.metrics_summary.flexion_gain_degrees}° gained
              </span>
            </div>

            <div className="bg-teal-950/50 p-2.5 rounded-xl border border-teal-600/30">
              <span className="text-[10px] text-teal-300 block font-medium">Compliance</span>
              <span className="text-base font-extrabold text-white">
                {analytics.metrics_summary.compliance_percentage}%
              </span>
              <span className="text-[9px] text-teal-300 font-semibold block">
                14/14 days
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Recovery Trends: 14-Day Trajectory */}
      {analytics?.history && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                14-Day Mobility & Pain Trajectory
              </h3>
              <p className="text-[11px] text-slate-400">
                Flexion (teal bars) vs Pain score (amber line)
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              Positive Trend
            </span>
          </div>

          {/* Bar / Sparkline Chart */}
          <div className="space-y-2 pt-2">
            <div className="h-28 flex items-end justify-between gap-1.5 px-1 border-b border-slate-200 pb-1">
              {analytics.history.map((record, idx) => {
                const heightPercent = Math.round((record.flexion_degrees / 100) * 100);
                const isLatest = idx === analytics.history.length - 1;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-12 bg-slate-900 text-white text-[10px] py-1 px-1.5 rounded shadow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                      Day {record.post_op_day}: {record.flexion_degrees}° (Pain {record.pain_level})
                    </div>

                    <div 
                      className={`w-full rounded-t-sm transition-all duration-500 ${
                        isLatest 
                          ? 'bg-teal-600 shadow-xs' 
                          : 'bg-teal-200/90 group-hover:bg-teal-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[9px] text-slate-400 font-mono">
                      D{record.post_op_day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-teal-600 rounded-xs"></span>
                Active Flexion (45° ➔ 88°)
              </span>
              <span className="flex items-center gap-1.5 text-amber-700">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                Pain (7/10 ➔ 2/10)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Knee Joint Flexion Goniometer (88 degrees) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Goniometer Angle Measurement</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {flexionCurrent}°
              </span>
              <span className="text-slate-400 text-sm font-medium">
                / {flexionGoal}° Target Flexion
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200/70">
              {flexionPercent}% of Max ROM
            </span>
          </div>
        </div>

        {/* Goniometer Angle Graphic Visualization */}
        <div className="relative bg-gradient-to-b from-teal-50/70 to-slate-50 border border-teal-100/70 rounded-2xl p-5 flex items-center justify-around">
          <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden">
            <svg viewBox="0 0 100 55" className="w-44 h-24">
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 10 50 A 40 40 0 0 1 90 50"
                fill="none"
                stroke="url(#tealGradient)"
                strokeWidth="8"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * (flexionCurrent / 120))}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="5" fill="#0f766e" />
              <line
                x1="50"
                y1="50"
                x2="78"
                y2="22"
                stroke="#0f766e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute bottom-1 text-center">
              <span className="text-xs font-bold text-teal-900 font-mono">88°</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-teal-600"></span>
              <span className="text-slate-700 font-medium">Stage 2: 90° Comfort Target</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-300"></span>
              <span className="text-slate-500">Stage 3: 120° Full Flexion</span>
            </div>
            <div className="p-2 bg-teal-100/60 rounded-xl text-teal-900 font-semibold text-[11px]">
              Only 2° away from Day 14 milestone!
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Milestones Timeline */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-700" />
            <h2 className="font-bold text-slate-800 text-sm">Post-Op Clinical Milestones</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">3 of 5 achieved</span>
        </div>

        <div className="space-y-3">
          {milestones.map((milestone) => {
            const isAchieved = milestone.status === 'achieved';
            const isInProgress = milestone.status === 'in_progress';
            const isSelected = selectedMilestone === milestone.id;

            return (
              <div
                key={milestone.id}
                onClick={() => setSelectedMilestone(isSelected ? null : milestone.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isAchieved
                    ? 'bg-emerald-50/50 border-emerald-200/80'
                    : isInProgress
                    ? 'bg-teal-50/50 border-teal-300 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200/60 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isAchieved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : isInProgress ? (
                        <div className="w-5 h-5 rounded-full border-2 border-teal-600 flex items-center justify-center">
                          <div className="w-2 h-2 bg-teal-600 rounded-full animate-ping"></div>
                        </div>
                      ) : (
                        <Clock className="w-5 h-5 text-slate-300" />
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{milestone.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Target: <span className="font-medium text-slate-700">{milestone.target}</span> • {milestone.current_value}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isAchieved
                        ? 'bg-emerald-100 text-emerald-800'
                        : isInProgress
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isAchieved ? 'Achieved' : isInProgress ? 'In Progress' : 'Upcoming'}
                  </span>
                </div>

                {/* Expanded Clinician Note */}
                {isSelected && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs text-slate-600 space-y-1 animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700 text-[11px]">
                      <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>Clinician Observation:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed pl-5 bg-white/70 p-2 rounded-xl border border-slate-200/50">
                      {milestone.clinician_note}
                    </p>
                    {milestone.date_achieved && (
                      <span className="text-[10px] text-slate-400 block pl-5">
                        Logged: {milestone.date_achieved}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </>
      )}
    </div>
  );
};
