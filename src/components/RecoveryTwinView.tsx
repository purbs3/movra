import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ReferenceLine,
  CartesianGrid 
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { api } from '../services/api';

interface RecoveryTwinViewProps {
  patientId?: string;
  onBack?: () => void;
}

export const RecoveryTwinView: React.FC<RecoveryTwinViewProps> = ({
  patientId = 'rahul_123',
  onBack
}) => {
  const [twinData, setTwinData] = useState<any | null>(null);
  const [scenario, setScenario] = useState<'regular' | 'skipped'>('regular');
  const [selectedMetric, setSelectedMetric] = useState<'flexion' | 'pain'>('flexion');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    api.getRecoveryTwin(patientId).then((data) => {
      if (isMounted && data) {
        setTwinData(data);
      }
      setIsLoading(false);
    });
    return () => { isMounted = false; };
  }, [patientId]);

  if (isLoading || !twinData) {
    return (
      <div className="p-8 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80 shadow-2xs">
        <Activity className="w-6 h-6 text-teal-700 animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Computing predictive rehabilitation trajectory...</p>
      </div>
    );
  }

  // Determine current active projection based on scenario
  const predictedFlexion7d = scenario === 'regular' ? twinData.predicted_flexion_next_7d : 89.2;
  const predictedPain7d = scenario === 'regular' ? twinData.predicted_pain_next_7d : 3.8;
  const predictedFlexion30d = scenario === 'regular' ? twinData.predicted_flexion_next_30d : 91.5;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Header and Model Badge */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Recovery Forecast
              </h2>
              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Experimental Trend Model
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Estimated recovery trend based on available data. Not a medical prediction.
            </p>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 self-start sm:self-auto cursor-pointer"
            >
              ← Back to Overview
            </button>
          )}
        </div>

        {/* Clinical Recommendation Callout */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
          <div className="flex items-center justify-between font-bold text-[11px] text-teal-900 uppercase tracking-wider">
            <span>Model Projection &amp; Recommendation</span>
            <span className="text-[10px] font-mono text-slate-500">Day {twinData.current_day} Baseline</span>
          </div>
          <p className="leading-relaxed font-normal">
            {twinData.recommendation}
          </p>
        </div>
      </div>

      {/* KPI Cards: 7-Day & 30-Day Projections */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Next 7 Days Forecast */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Predicted Flexion (+7 Days)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {predictedFlexion7d}°
            </span>
            <span className={`text-[11px] font-semibold ${scenario === 'regular' ? 'text-emerald-700' : 'text-amber-700'}`}>
              {scenario === 'regular' ? '+8.5° Expected' : 'Stagnation Lag'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Goal: {twinData.benchmarks.day_7_goal}° · Day 21 Benchmark
          </p>
        </div>

        {/* 7-Day Pain Projection */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Predicted Pain (+7 Days)
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {predictedPain7d} / 10
            </span>
            <span className={`text-[11px] font-semibold ${scenario === 'regular' ? 'text-emerald-700' : 'text-rose-700'}`}>
              {scenario === 'regular' ? '0.4 pt drop' : '+1.8 pt flare'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            VAS Pain Scale on Evening Transfers
          </p>
        </div>

        {/* Dropout Risk Score */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Adherence Dropout Risk
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {twinData.dropout_risk_percentage}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-700">
              Low Risk (Compliant)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Risk Factors: 0 missed sessions, stable steps
          </p>
        </div>
      </div>

      {/* Interactive What-If Scenario Simulator & Recharts Chart */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recovery Simulation: Actual vs. Forecast Curve
            </h3>
            <p className="text-xs text-slate-500">
              Solid line represents recorded historical clinical sessions. Dashed line represents algorithmic projections.
            </p>
          </div>

          {/* Metric Selector (Flexion vs Pain) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedMetric('flexion')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedMetric === 'flexion' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Knee Flexion (ROM)
            </button>
            <button
              onClick={() => setSelectedMetric('pain')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedMetric === 'pain' ? 'bg-white text-teal-800 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Pain Level (VAS)
            </button>
          </div>
        </div>

        {/* "What-If" Counterfactual Simulation Switcher */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-bold text-slate-800">
              "What-If" Adherence Scenario:
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setScenario('regular')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                scenario === 'regular'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              If I do exercises regularly
            </button>
            <button
              onClick={() => setScenario('skipped')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                scenario === 'skipped'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              If I skip exercises
            </button>
          </div>
        </div>

        {/* Recharts LineChart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={twinData.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 10, fill: '#64748B' }} 
                interval={4}
                tickLine={false}
              />
              <YAxis 
                domain={selectedMetric === 'flexion' ? [40, 130] : [0, 10]} 
                tick={{ fontSize: 10, fill: '#64748B' }}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderRadius: '12px', 
                  border: 'none', 
                  color: '#fff',
                  fontSize: '11px' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {/* Functional Milestone Benchmark Reference Line */}
              {selectedMetric === 'flexion' && (
                <ReferenceLine 
                  y={110} 
                  stroke="#0D9488" 
                  strokeDasharray="4 4" 
                  label={{ value: 'Functional Threshold (110°)', fill: '#0D9488', fontSize: 10 }} 
                />
              )}

              {/* 1. Actual Historical Line (Solid Line) */}
              <Line
                type="monotone"
                dataKey={selectedMetric === 'flexion' ? 'actual_flexion' : 'actual_pain'}
                name={selectedMetric === 'flexion' ? 'Actual Flexion (Day 1-14)' : 'Actual Pain VAS'}
                stroke="#0F172A"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#0F172A' }}
                activeDot={{ r: 5 }}
              />

              {/* 2. Projected Line (Dashed Line) - Regular Scenario */}
              {scenario === 'regular' && (
                <Line
                  type="monotone"
                  dataKey={selectedMetric === 'flexion' ? 'predicted_flexion_regular' : 'predicted_pain_regular'}
                  name={selectedMetric === 'flexion' ? 'Predicted (Regular Exercise)' : 'Predicted Pain (Regular)'}
                  stroke="#0D9488"
                  strokeWidth={2.2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}

              {/* 3. Projected Line (Dashed Line) - Skipped Scenario */}
              {scenario === 'skipped' && (
                <Line
                  type="monotone"
                  dataKey={selectedMetric === 'flexion' ? 'predicted_flexion_skipped' : 'predicted_pain_skipped'}
                  name={selectedMetric === 'flexion' ? 'Projected Plateaue (Skipped)' : 'Projected Pain (Skipped)'}
                  stroke="#E11D48"
                  strokeWidth={2.2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Explanation Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-900 inline-block"></span>
              <span>Solid: Real in-home logs</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`w-3 h-0.5 inline-block border-b-2 border-dashed ${scenario === 'regular' ? 'border-teal-600' : 'border-rose-600'}`}></span>
              <span>Dashed: AI regression projection</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <Info className="w-3 h-3" />
            <span>Linear trend fitted with physiologic damping.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
