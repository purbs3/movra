import React, { useState } from 'react';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  Search, 
  ShieldCheck, 
  Activity, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  FileSpreadsheet,
  Layers,
  ChevronRight
} from 'lucide-react';

interface AdminOverviewViewProps {
  stats: any;
  onNavigateTab: (tab: string) => void;
  onGlobalSearchSelect?: (type: string, id: string) => void;
}

export const AdminOverviewView: React.FC<AdminOverviewViewProps> = ({
  stats,
  onNavigateTab,
  onGlobalSearchSelect
}) => {
  const [globalSearch, setGlobalSearch] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Global search quick directory
  const directoryItems = [
    { type: 'Patient', title: 'Rahul Sharma', sub: 'Kankarbagh · Right TKA (Post-Op Day 14)', tab: 'patients' },
    { type: 'Patient', title: 'Amit Kumar', sub: 'Boring Road · L4-L5 Disc Herniation', tab: 'patients' },
    { type: 'Physiotherapist', title: 'Dr. Ananya Iyer, PT', sub: 'BPT, MPT · Orthopedic Specialist (PT-88921)', tab: 'physiotherapists' },
    { type: 'Booking', title: 'Ref #MOV-BK-7492', sub: 'Rahul Sharma · Home Visit · 10:00 AM', tab: 'bookings' },
    { type: 'Payment', title: 'Ref #PAY-49201', sub: 'UPI Payment ₹750 · Confirmed', tab: 'payments' }
  ];

  const searchResults = directoryItems.filter(item => 
    !globalSearch.trim() ? false :
    item.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
    item.sub.toLowerCase().includes(globalSearch.toLowerCase()) ||
    item.type.toLowerCase().includes(globalSearch.toLowerCase())
  );

  const handleExportCSV = (dataset: string) => {
    setExportNotice(`Exporting ${dataset} CSV report with verified audit metadata...`);
    setTimeout(() => {
      // Create downloadable dummy CSV blob
      const csvContent = "data:text/csv;charset=utf-8,ID,Name,Type,Status,Date\n1,Rahul Sharma,Patient,Active,2026-10-03\n2,Dr. Ananya Iyer,Physiotherapist,Active,2026-10-03\n";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `movra_${dataset.toLowerCase()}_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportNotice(null);
    }, 1200);
  };

  const pData = stats?.patients || { total: 18, active: 17, inactive: 1, growth_rate_pct: 14.2 };
  const ptData = stats?.physiotherapists || { total: 6, active: 5, pending_verification: 1, retention_rate_pct: 98.0 };
  const bData = stats?.bookings || { today_total: 8, pending: 3, confirmed_visits: 4, completed_visits: 5, cancellation_rate_pct: 3.8 };
  const rData = stats?.revenue || { today: 1500, this_month: 34500, pending_clearance: 750 };
  const alerts = stats?.alerts || [];
  const trends = stats?.growth_trends || [];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Banner & Global Search */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                MOVRA Central Command Center
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 uppercase">
                SUPERADMIN TIER
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live operational oversight across patients, visiting clinicians, booking dispatches, and clinical safety
            </p>
          </div>

          {/* Quick Export Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportCSV('Platform_Caseload')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-teal-700" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => onNavigateTab('platform-control')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Master Switchboard</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {exportNotice && (
          <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* Global Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Global search: Enter patient name, clinician ID, booking ref #MOV-BK, or diagnosis..."
            className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-purple-500/20 focus:outline-none"
          />

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 z-40 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 px-3 py-1 block">Search Results</span>
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onNavigateTab(item.tab);
                    setGlobalSearch('');
                  }}
                  className="p-2.5 rounded-xl hover:bg-purple-50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/60 px-1.5 py-0.2 rounded mr-2">
                      {item.type}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <p className="text-[11px] text-slate-500 ml-1 mt-0.5">{item.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Operational Alerts Bar */}
      {alerts.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wide">
              Action Required ({alerts.length} System Alerts)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {alerts.map((al: any) => (
              <div
                key={al.id}
                onClick={() => onNavigateTab(al.target)}
                className="p-2.5 bg-white rounded-xl border border-amber-200/80 text-amber-900 cursor-pointer hover:bg-amber-100/50 flex items-center justify-between transition-colors"
              >
                <span className="font-medium text-[11px]">{al.message}</span>
                <span className="font-bold text-amber-800 text-[10px] shrink-0 ml-2">Resolve ➔</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Primary KPI SaaS Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. Patients */}
        <div 
          onClick={() => onNavigateTab('patients')}
          className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs hover:border-purple-300 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Patients</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{pData.total}</div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-bold">{pData.active} Active</span>
            <span className="text-slate-400">{pData.inactive} Inactive</span>
          </div>
          <span className="text-[10px] text-teal-700 font-medium block pt-0.5">+{pData.growth_rate_pct}% MoM Growth</span>
        </div>

        {/* 2. Physiotherapists */}
        <div 
          onClick={() => onNavigateTab('physiotherapists')}
          className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs hover:border-purple-300 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Clinicians</span>
            <Stethoscope className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{ptData.total}</div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 font-bold">{ptData.active} Verified</span>
            <span className="text-amber-600 font-bold">{ptData.pending_verification} Review</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block pt-0.5">{ptData.retention_rate_pct}% Clinical Retention</span>
        </div>

        {/* 3. Bookings & Home Visits */}
        <div 
          onClick={() => onNavigateTab('bookings')}
          className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs hover:border-purple-300 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Home Visits</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{bData.today_total}</div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-amber-600 font-bold">{bData.pending} Pending</span>
            <span className="text-emerald-600 font-bold">{bData.confirmed_visits} Confirmed</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium block pt-0.5">{bData.completed_visits} Completed · {bData.cancellation_rate_pct}% Cancel</span>
        </div>

        {/* 4. Revenue */}
        <div 
          onClick={() => onNavigateTab('payments')}
          className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs hover:border-purple-300 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">₹{rData.this_month}</div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600 font-bold">Today: ₹{rData.today}</span>
            <span className="text-amber-600 font-bold">₹{rData.pending_clearance} Hold</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium block pt-0.5">100% UPI Direct Reconciliation</span>
        </div>
      </div>

      {/* Visual Trajectory Chart (Clean CSS Visualization) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-700" />
              <span>Patient Caseload & Home Visit Revenue Trajectory</span>
            </h3>
            <p className="text-xs text-slate-400">Monthly progression of active patients and completed visits</p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
            May 2026 – Oct 2026
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 items-end pt-4 h-44 border-b border-slate-100 pb-2">
          {trends.map((item: any, i: number) => {
            const maxRev = 40000;
            const heightPct = Math.round((item.revenue / maxRev) * 100);

            return (
              <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{item.revenue}
                </span>
                <div
                  className="w-full max-w-[36px] bg-gradient-to-t from-purple-700 to-indigo-500 rounded-t-xl transition-all duration-500 group-hover:from-purple-600 group-hover:to-indigo-400 shadow-xs"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] font-bold text-slate-500">{item.month}</span>
                <span className="text-[9px] text-purple-700 font-mono">{item.visits} visits</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-700 inline-block" />
              <span>Gross Completed Visit Revenue (₹)</span>
            </span>
          </div>
          <span className="font-bold text-slate-700">Zero Commission Deductions</span>
        </div>
      </div>
    </div>
  );
};
