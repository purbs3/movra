import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  LogOut, 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ClipboardList,
  Sparkles,
  Search,
  Activity,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface PhysioDashboardProps {
  onLogout: () => void;
  activeTab?: string;
  onOpenPatientView?: (patientId: string) => void;
}

export const PhysioDashboard: React.FC<PhysioDashboardProps> = ({ 
  onLogout, 
  activeTab = 'caseload',
  onOpenPatientView 
}) => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'alerts' | 'ontrack'>('all');

  useEffect(() => {
    if (activeTab === 'alerts') {
      setFilterMode('alerts');
    } else if (activeTab === 'caseload') {
      setFilterMode('all');
    }
  }, [activeTab]);

  const clinicalPatients = [
    {
      id: 'rahul_123',
      name: 'Rahul Sharma',
      age: 64,
      condition: 'Right Knee Replacement (TKA)',
      post_op_day: 14,
      rom: '88° Flexion / -3° Extension',
      compliance: '94%',
      streak: '6 Days',
      status: 'On Track',
      alert: 'Routine - Day 14 Milestone Pending',
      isAlert: false
    },
    {
      id: 'patient_sunita_58',
      name: 'Sunita Patel',
      age: 58,
      condition: 'Left ACL Reconstruction',
      post_op_day: 28,
      rom: '112° Flexion / 0° Extension',
      compliance: '88%',
      streak: '4 Days',
      status: 'Excellent',
      alert: 'Transitioned to single cane',
      isAlert: false
    },
    {
      id: 'patient_anand_71',
      name: 'Anand Verma',
      age: 71,
      condition: 'Bilateral Hip Arthroplasty',
      post_op_day: 9,
      rom: '75° Flexion',
      compliance: '79%',
      streak: '2 Days',
      status: 'Needs Review',
      alert: 'Reported 5/10 discomfort after evening set',
      isAlert: true
    }
  ];

  const filteredPatients = clinicalPatients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterMode === 'alerts') return matchesSearch && p.isAlert;
    if (filterMode === 'ontrack') return matchesSearch && !p.isAlert;
    return matchesSearch;
  });

  const handleLogoutClick = () => {
    logout();
    onLogout();
  };

  // If activeTab is profile, show Clinician Profile view
  if (activeTab === 'profile') {
    return (
      <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-700 to-sky-500 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-sky-700/20">
              <Stethoscope className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">{user?.full_name || 'Dr. Ananya Iyer, PT'}</h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Licensed Physiotherapist
              </span>
              <p className="text-[11px] text-slate-400 mt-1">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Practitioner License</span>
              <span className="font-mono font-bold text-slate-800">PT-IN-88921-A</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Affiliated Clinic</span>
              <span className="font-bold text-slate-800">City Ortho Rehabilitation</span>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-rose-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Clinician Portal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-slate-900 text-white rounded-3xl p-5 shadow-lg shadow-sky-950/20 border border-sky-700/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-200">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider block">
                Clinical Practitioner Portal
              </span>
              <h1 className="text-lg font-extrabold text-white tracking-tight">
                Welcome, {user?.full_name || 'Physiotherapist'}
              </h1>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-white/10"
            title="Log out of Movra"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        <p className="text-xs text-sky-100/90 leading-relaxed">
          Manage assigned orthopedic patient caseloads, inspect ROM biometrics, and approve Agno/Gemini daily exercise prescriptions.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-sky-700/40 text-center">
          <button 
            type="button"
            onClick={() => setFilterMode('all')}
            className={`p-2 rounded-xl border text-center transition-all ${
              filterMode === 'all' ? 'bg-sky-700/50 border-sky-400' : 'bg-sky-950/50 border-sky-600/30'
            }`}
          >
            <span className="text-[10px] text-sky-300 block font-medium">Active Caseload</span>
            <span className="text-base font-extrabold text-white">18 Patients</span>
          </button>
          <div className="bg-sky-950/50 p-2 rounded-xl border border-sky-600/30">
            <span className="text-[10px] text-sky-300 block font-medium">Avg Adherence</span>
            <span className="text-base font-extrabold text-emerald-300">92.4%</span>
          </div>
          <button 
            type="button"
            onClick={() => setFilterMode('alerts')}
            className={`p-2 rounded-xl border text-center transition-all ${
              filterMode === 'alerts' ? 'bg-amber-600/40 border-amber-400' : 'bg-sky-950/50 border-sky-600/30'
            }`}
          >
            <span className="text-[10px] text-amber-300 block font-medium">Alerts</span>
            <span className="text-base font-extrabold text-amber-300">1 Review</span>
          </button>
        </div>
      </div>

      {/* Patient Caseload List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-sky-700" />
            <h2 className="font-bold text-slate-800 text-sm">
              {filterMode === 'alerts' ? 'Clinical Action Alerts' : 'Assigned Patients'}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {filteredPatients.length} active
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient name or condition..."
            className="w-full py-2 pl-9 pr-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="space-y-2.5">
          {filteredPatients.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl p-4 border transition-all space-y-2.5 ${
                p.isAlert ? 'border-amber-300 shadow-xs' : 'border-slate-200/80 shadow-2xs hover:border-sky-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                    {p.name}
                    <span className="text-[10px] text-slate-400 font-normal">({p.age}y)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">{p.condition} • Day {p.post_op_day}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  p.status === 'Needs Review'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Range of Motion:</span>
                  <span className="font-bold text-slate-700">{p.rom}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Weekly Adherence:</span>
                  <span className="font-bold text-emerald-600">{p.compliance} ({p.streak})</span>
                </div>
              </div>

              <div className="p-2 bg-slate-50 rounded-xl text-[10px] text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  {p.isAlert && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                  {p.alert}
                </span>
                <span className="font-bold text-sky-700 cursor-pointer hover:underline">
                  View Telemetry ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhysioDashboard;
