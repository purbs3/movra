import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Plus, 
  Check, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const PhysioServiceAvailabilityView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'service_area' | 'availability'>('service_area');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Service Areas
  const [serviceAreas, setServiceAreas] = useState([
    { id: 'kankarbagh', name: 'Kankarbagh', active: true, lead_time_min: 20 },
    { id: 'rajendra_nagar', name: 'Rajendra Nagar', active: true, lead_time_min: 25 },
    { id: 'boring_road', name: 'Boring Road', active: true, lead_time_min: 35 },
    { id: 'patliputra', name: 'Patliputra Colony', active: true, lead_time_min: 40 },
    { id: 'bailey_road', name: 'Bailey Road', active: true, lead_time_min: 30 },
    { id: 'danapur', name: 'Danapur', active: false, lead_time_min: 50 }
  ]);

  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaLeadTime, setNewAreaLeadTime] = useState(25);

  // Availability Settings
  const [workingDays, setWorkingDays] = useState<string[]>([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ]);
  const [workingHoursStart, setWorkingHoursStart] = useState('09:00 AM');
  const [workingHoursEnd, setWorkingHoursEnd] = useState('07:00 PM');
  const [breakStart, setBreakStart] = useState('01:00 PM');
  const [breakEnd, setBreakEnd] = useState('03:00 PM');
  const [slotDuration, setSlotDuration] = useState(45);
  const [homeVisitsActive, setHomeVisitsActive] = useState(true);

  // Blocked Slots List
  const [blockedSlots, setBlockedSlots] = useState<string[]>([
    'Tomorrow, 02:00 PM - 03:00 PM (Emergency Clinical Review)',
    '15 Oct 2026, 01:00 PM - 02:30 PM (Hospital Surgical Rounds)'
  ]);
  const [newBlockedSlot, setNewBlockedSlot] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(prev => prev.filter(d => d !== day));
    } else {
      setWorkingDays(prev => [...prev, day]);
    }
  };

  const toggleArea = (id: string) => {
    setServiceAreas(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    const newA = {
      id: newAreaName.toLowerCase().replace(/\s+/g, '_'),
      name: newAreaName.trim(),
      active: true,
      lead_time_min: Number(newAreaLeadTime) || 30
    };
    setServiceAreas(prev => [...prev, newA]);
    setNewAreaName('');
    setSaveNotice(`Service coverage expanded to ${newA.name}.`);
    setTimeout(() => setSaveNotice(null), 3000);
  };

  const handleAddBlockedSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedSlot.trim()) return;
    setBlockedSlots(prev => [...prev, newBlockedSlot.trim()]);
    setNewBlockedSlot('');
    setSaveNotice('Appointment slot blocked on booking calendar.');
    setTimeout(() => setSaveNotice(null), 3000);
  };

  const handleSaveSettings = () => {
    setSaveNotice('Availability schedule and dispatch zones successfully updated.');
    setTimeout(() => setSaveNotice(null), 4000);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header and Sub-tabs */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-700" />
              <span>Service Area & Clinical Availability</span>
            </h2>
            <p className="text-xs text-slate-500">
              Configure geographic dispatch coverage and home visit working hours
            </p>
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('service_area')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'service_area' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
              }`}
            >
              Service Areas
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'availability' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500'
              }`}
            >
              Working Schedule
            </button>
          </div>
        </div>

        {saveNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveNotice}</span>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SERVICE AREAS */}
      {/* ======================================================== */}
      {activeTab === 'service_area' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-900 leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>
              <strong>Clinical Guardrail:</strong> Patient home visit requests are only accepted in localities actively designated by you below.
            </span>
          </div>

          {/* Active Area Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {serviceAreas.map((area) => (
              <div
                key={area.id}
                className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 hover:border-teal-300 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    area.active ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800">{area.name}</h4>
                    <span className="text-[10px] text-slate-400">~{area.lead_time_min} mins transit buffer</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleArea(area.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    area.active
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {area.active ? 'Active' : 'Inactive'}
                </button>
              </div>
            ))}
          </div>

          {/* Add New Area */}
          <form onSubmit={handleAddArea} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3 text-xs">
            <h4 className="font-extrabold text-slate-800 text-xs">Add New Local Service Area</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
                placeholder="Area Name (e.g. Ashiana Nagar)"
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl col-span-2 font-medium"
              />
              <input
                type="number"
                value={newAreaLeadTime}
                onChange={(e) => setNewAreaLeadTime(Number(e.target.value))}
                placeholder="Transit min"
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Coverage Zone</span>
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: WORKING SCHEDULE & AVAILABILITY */}
      {/* ======================================================== */}
      {activeTab === 'availability' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-5 animate-in fade-in text-xs">
          {/* Working Days */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-800 text-xs block">Operating Days</label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {daysOfWeek.map((d) => {
                const isSelected = workingDays.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {d.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hours & Breaks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Working Hours</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={workingHoursStart}
                  onChange={(e) => setWorkingHoursStart(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="text"
                  value={workingHoursEnd}
                  onChange={(e) => setWorkingHoursEnd(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Midday Rest / Travel Break</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={breakStart}
                  onChange={(e) => setBreakStart(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
                <span className="text-slate-400">to</span>
                <input
                  type="text"
                  value={breakEnd}
                  onChange={(e) => setBreakEnd(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>
          </div>

          {/* Slot Duration & Home Visit Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Appointment Slot Duration</label>
              <select
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes (Standard Home Visit)</option>
                <option value={60}>60 Minutes (Comprehensive Evaluation)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="font-extrabold text-slate-800 block">Home Visit Availability</span>
                <span className="text-[10px] text-slate-400">Enable new patient requests</span>
              </div>
              <button
                type="button"
                onClick={() => setHomeVisitsActive(!homeVisitsActive)}
                className={`px-3 py-1 rounded-xl font-bold ${
                  homeVisitsActive ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                }`}
              >
                {homeVisitsActive ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Blocked Slots Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="font-extrabold text-slate-800">Blocked Slots & Leave Windows</h4>
            <div className="space-y-1.5">
              {blockedSlots.map((slot, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-[11px] border border-slate-100">
                  <span className="text-slate-700 font-medium">{slot}</span>
                  <button
                    onClick={() => setBlockedSlots(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-rose-600 hover:text-rose-800 font-bold"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddBlockedSlot} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newBlockedSlot}
                onChange={(e) => setNewBlockedSlot(e.target.value)}
                placeholder="Block slot: e.g. Friday 04:00 PM - 05:30 PM"
                className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-slate-800 text-white font-bold rounded-xl"
              >
                Block
              </button>
            </form>
          </div>

          <button
            onClick={handleSaveSettings}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-2xl shadow-xs transition-colors"
          >
            Save Availability Schedule
          </button>
        </div>
      )}
    </div>
  );
};
