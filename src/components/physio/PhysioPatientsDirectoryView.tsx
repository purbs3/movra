import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Calendar, 
  Activity, 
  Phone, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

interface PhysioPatientsDirectoryViewProps {
  patients: any[];
  onViewPatient: (patientId: string) => void;
  onStartAssessment?: (patientId: string) => void;
}

export const PhysioPatientsDirectoryView: React.FC<PhysioPatientsDirectoryViewProps> = ({
  patients,
  onViewPatient,
  onStartAssessment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Active',
    'New',
    'Follow-up',
    'Completed',
    'Orthopedic',
    'Neurological',
    'Pediatric',
    'Geriatric',
    'Sports',
    'Post-operative'
  ];

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.area && p.area.toLowerCase().includes(searchQuery.toLowerCase()));

    if (activeCategory === 'All') return matchesSearch;
    if (activeCategory === 'Active') return matchesSearch && p.status !== 'Completed';
    if (activeCategory === 'Completed') return matchesSearch && p.status === 'Completed';
    if (activeCategory === 'Follow-up') return matchesSearch && (p.next_visit || p.status === 'Needs Review');
    
    // Category matching
    const cat = (p.category || '').toLowerCase();
    return matchesSearch && cat.includes(activeCategory.toLowerCase());
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header and Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-700" />
              <span>Patient Directory & Caseload</span>
            </h2>
            <p className="text-xs text-slate-500">
              Access complete longitudinal clinical records, outcome goniometry, and care plans
            </p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60 self-start sm:self-auto">
            {filteredPatients.length} Active Records
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, phone number (+91), or clinical diagnosis..."
            className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Patient Cards */}
      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-sm">No Patients Found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search query or selecting a different category filter.
            </p>
          </div>
        ) : (
          filteredPatients.map((p) => {
            const isAlert = p.status === 'Needs Review';
            const isExcellent = p.status === 'Excellent';

            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3.5 hover:border-teal-300 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900">{p.name}</h3>
                        <span className="text-xs text-slate-400 font-medium">({p.age}y · {p.gender || 'Patient'})</span>
                      </div>
                      <p className="text-xs text-teal-700 font-semibold mt-0.5">{p.condition}</p>
                      <p className="text-[11px] text-slate-500">{p.phone} · {p.area || 'Home Care'}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isAlert
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : isExcellent
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-teal-50 text-teal-700 border border-teal-200'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                {/* Telemetry Snapshot: Last Visit, Next Visit, ROM, Compliance */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Visit</span>
                    <span className="font-bold text-slate-700">{p.last_visit || '12 Oct 2026'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Next Visit</span>
                    <span className="font-bold text-teal-700">{p.next_visit || '15 Oct 2026'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Active ROM</span>
                    <span className="font-bold text-slate-700">{p.rom || '88° Flexion'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Adherence</span>
                    <span className="font-bold text-emerald-600">{p.compliance || '94%'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${p.phone}`}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      title="Call Patient"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    {onStartAssessment && (
                      <button
                        onClick={() => onStartAssessment(p.id)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                      >
                        <span>Assessment</span>
                      </button>
                    )}

                    <button
                      onClick={() => onViewPatient(p.id)}
                      className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Patient</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
