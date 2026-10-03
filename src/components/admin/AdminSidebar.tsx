import React, { useState } from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  ToggleLeft, 
  Users, 
  Stethoscope, 
  UserCheck, 
  Calendar, 
  Clock, 
  Compass, 
  ShieldCheck, 
  FileText, 
  Layers, 
  MapPin, 
  CreditCard, 
  Sparkles, 
  Globe, 
  Briefcase, 
  DollarSign, 
  Bell, 
  Lock, 
  Terminal, 
  Activity, 
  AlertOctagon, 
  LogOut, 
  ChevronDown,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  pendingBookingsCount?: number;
  pendingPhysiosCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  pendingBookingsCount = 3,
  pendingPhysiosCount = 1
}) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    platform: true,
    users: true,
    operations: true,
    services: false,
    system: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col h-full shadow-xl select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white font-black flex items-center justify-center shadow-md shadow-purple-900/40">
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white tracking-tight">MOVRA</span>
              <span className="text-[10px] font-bold text-purple-300 bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-700/60 uppercase">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Platform Control Center</p>
          </div>
        </div>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 text-xs">
        {/* 1. Core Overview & Master Switchboard */}
        <div className="space-y-1">
          <button
            onClick={() => onSelectTab('overview')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl font-bold transition-all ${
              currentTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              <span>Admin Dashboard</span>
            </div>
          </button>

          <button
            onClick={() => onSelectTab('platform-control')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl font-bold transition-all ${
              currentTab === 'platform-control'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-emerald-300 hover:text-white hover:bg-emerald-950/30 border border-emerald-500/20'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ToggleLeft className="w-4 h-4 text-emerald-400" />
              <span>Master Switchboard</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-bold uppercase">
              LIVE
            </span>
          </button>
        </div>

        {/* 2. User Governance */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection('users')}
            className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 hover:text-slate-200"
          >
            <span>User Governance</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSections.users ? '' : '-rotate-90'}`} />
          </button>

          {openSections.users && (
            <div className="space-y-1 pl-1">
              <button
                onClick={() => onSelectTab('patients')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'patients' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>Patient Control</span>
              </button>

              <button
                onClick={() => onSelectTab('physiotherapists')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'physiotherapists' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                  <span>Physiotherapists</span>
                </div>
                {pendingPhysiosCount > 0 && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full font-bold">
                    {pendingPhysiosCount} verify
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectTab('admins')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'admins' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Admins & SuperAdmin</span>
              </button>
            </div>
          )}
        </div>

        {/* 3. Operations & Dispatches */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection('operations')}
            className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 hover:text-slate-200"
          >
            <span>Operations & Visits</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSections.operations ? '' : '-rotate-90'}`} />
          </button>

          {openSections.operations && (
            <div className="space-y-1 pl-1">
              <button
                onClick={() => onSelectTab('bookings')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'bookings' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Booking Requests</span>
                </div>
                {pendingBookingsCount > 0 && (
                  <span className="text-[9px] px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded-full font-extrabold">
                    {pendingBookingsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => onSelectTab('appointments')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'appointments' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Appointments Timeline</span>
              </button>

              <button
                onClick={() => onSelectTab('home-visits')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'home-visits' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Home Visit Transit</span>
              </button>
            </div>
          )}
        </div>

        {/* 4. Platform Catalog & Settings */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection('services')}
            className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 hover:text-slate-200"
          >
            <span>Platform Catalog</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSections.services ? '' : '-rotate-90'}`} />
          </button>

          {openSections.services && (
            <div className="space-y-1 pl-1">
              <button
                onClick={() => onSelectTab('services')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'services' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Services Management</span>
              </button>

              <button
                onClick={() => onSelectTab('service-areas')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'service-areas' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Coverage Service Areas</span>
              </button>

              <button
                onClick={() => onSelectTab('pricing')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'pricing' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pricing & Fees</span>
              </button>

              <button
                onClick={() => onSelectTab('features')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'features' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Feature Flags (14)</span>
              </button>

              <button
                onClick={() => onSelectTab('ai-control')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'ai-control' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Models & Safety</span>
              </button>

              <button
                onClick={() => onSelectTab('content')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'content' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-teal-400" />
                <span>Public Home Content</span>
              </button>
            </div>
          )}
        </div>

        {/* 5. Finance & Revenue */}
        <div className="space-y-1">
          <button
            onClick={() => onSelectTab('payments')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl font-bold transition-all ${
              currentTab === 'payments' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Payments & Revenue</span>
          </button>
        </div>

        {/* 6. System Governance & Diagnostics */}
        <div className="space-y-1">
          <button
            onClick={() => toggleSection('system')}
            className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 hover:text-slate-200"
          >
            <span>System Governance</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSections.system ? '' : '-rotate-90'}`} />
          </button>

          {openSections.system && (
            <div className="space-y-1 pl-1">
              <button
                onClick={() => onSelectTab('audit-logs')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'audit-logs' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>Audit Logs</span>
              </button>

              <button
                onClick={() => onSelectTab('system-health')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'system-health' ? 'bg-slate-800 text-white border-l-2 border-purple-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>System Health</span>
              </button>

              <button
                onClick={() => onSelectTab('maintenance')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
                  currentTab === 'maintenance' ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30' : 'text-rose-400 hover:bg-rose-950/30'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Emergency Kill Switch</span>
              </button>
            </div>
          )}
        </div>

        {/* 7. Existing AI Research Tools (Preserved) */}
        <div className="space-y-1 pt-2 border-t border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
            Research AI Agents
          </span>
          <button
            onClick={() => onSelectTab('scraper')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
              currentTab === 'scraper' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>ScraperAgent</span>
          </button>
          <button
            onClick={() => onSelectTab('consultant')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all ${
              currentTab === 'consultant' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-teal-400" />
            <span>ConsultantAgent</span>
          </button>
        </div>
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <button
          onClick={onLogout}
          className="w-full py-2.5 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors border border-rose-800/40"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </aside>
  );
};
