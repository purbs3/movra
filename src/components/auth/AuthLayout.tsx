import React from 'react';
import { Activity, ShieldCheck, Stethoscope, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F7FAFC] flex flex-col justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_8px_30px_rgba(7,17,31,0.06)] overflow-hidden lg:grid lg:grid-cols-12">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Premium MOVRA Clinical & Brand Visual Panel   */}
        {/* ========================================================= */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-[#07111F] text-white p-10 xl:p-12 flex-col justify-between relative overflow-hidden selection:bg-[#0EA5A0]/30 selection:text-white">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#0EA5A0]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#0E7490]/20 blur-3xl pointer-events-none" />
          
          {/* Subtle Medical-Tech Grid Pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="clinical-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#clinical-grid)" />
          </svg>

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group focus:outline-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5A0] to-[#0D9488] text-white flex items-center justify-center shadow-md shadow-[#0EA5A0]/20 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight text-white flex items-baseline gap-2">
                  <span>MOVRA</span>
                  <span className="text-[10px] font-bold text-[#0EA5A0] tracking-widest uppercase">
                    HEALTH
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                  Patna Clinical Hub
                </p>
              </div>
            </Link>

            {/* Clinical Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#0EA5A0] animate-pulse" />
              <span>Evidence-Based Home Rehabilitation</span>
            </div>
          </div>

          {/* Center Brand Statements & Minimal Abstract Clinical Visual */}
          <div className="relative z-10 my-10 space-y-8">
            <div className="space-y-3">
              <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-[1.15]">
                Smarter recovery.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5A0] via-teal-300 to-emerald-400">
                  Better rehabilitation.
                </span>
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
                AI-assisted rehabilitation with clinician-guided care, continuous Range-of-Motion analysis, and certified home physical therapy.
              </p>
            </div>

            {/* Minimalist Abstract Clinical Vector: ECG + ROM Biomechanical Line */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#0EA5A0]" />
                  Active Kinematic Telemetry
                </span>
                <span className="text-[#0EA5A0] font-semibold text-[11px]">
                  Clinical Guardrails Active
                </span>
              </div>

              {/* Minimal Vector Curve */}
              <div className="h-16 relative flex items-center">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 320 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0EA5A0" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#0EA5A0" stopOpacity="1" />
                      <stop offset="75%" stopColor="#34D399" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#0EA5A0" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  {/* Subtle baseline grid line */}
                  <line x1="0" y1="30" x2="320" y2="30" stroke="#1E293B" strokeDasharray="3 3" />
                  {/* Biomechanical ROM + ECG Pulse Curve */}
                  <path
                    d="M0 30 Q 30 30, 50 28 T 80 32 T 110 30 L 130 30 L 140 10 L 150 48 L 160 22 L 170 30 L 200 30 C 230 15, 270 20, 320 12"
                    stroke="url(#lineGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Key Milestone Nodes */}
                  <circle cx="150" cy="48" r="3" fill="#0EA5A0" />
                  <circle cx="270" cy="20" r="3" fill="#34D399" />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-[11px]">
                <div>
                  <div className="text-slate-400">Target Range</div>
                  <div className="text-white font-bold text-xs">0° – 120° Flexion</div>
                </div>
                <div>
                  <div className="text-slate-400">Patna Care Team</div>
                  <div className="text-white font-bold text-xs">On-Call Physiotherapist</div>
                </div>
              </div>
            </div>

            {/* Key Clinical Pillars */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Stethoscope className="w-4 h-4 text-[#0EA5A0] shrink-0" />
                <span>Supervised by certified clinical physiotherapists</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#0EA5A0] shrink-0" />
                <span>Enterprise encryption &amp; patient data isolation</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-[#0EA5A0] shrink-0" />
                <span>Personalized AI recovery twin &amp; guided home exercise</span>
              </div>
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>MOVRA Clinical Platform</span>
            <span>Patna, Bihar</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Clean, Focused Healthcare Authentication Form*/}
        {/* ========================================================= */}
        <div className="lg:col-span-7 xl:col-span-7 p-6 sm:p-10 xl:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-[420px] w-full mx-auto space-y-6">
            {/* Mobile Header (Brand Mark shown on small screens) */}
            <div className="lg:hidden text-center space-y-2 mb-2">
              <Link to="/" className="inline-flex items-center gap-2.5 focus:outline-none">
                <div className="w-9 h-9 rounded-xl bg-[#07111F] text-white flex items-center justify-center shadow-sm">
                  <Activity className="w-5 h-5 text-[#0EA5A0] stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-black tracking-tight text-slate-900 leading-none">
                    MOVRA
                  </div>
                  <span className="text-[10px] text-[#0EA5A0] font-bold uppercase tracking-wider">
                    Patna Clinical Hub
                  </span>
                </div>
              </Link>
            </div>

            {/* Screen Title & Subtitle */}
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#07111F] tracking-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Form Slot */}
            <div className="pt-1">
              {children}
            </div>

            {/* Clinical Security Notice */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>256-bit encrypted clinical connection • Patna Hub</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
