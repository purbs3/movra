import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Eye, 
  Check, 
  X, 
  RotateCcw, 
  Search, 
  Filter,
  User,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { ClinicalAppointment, AppointmentStatusType } from '../../types';

interface PhysioAppointmentsViewProps {
  appointments: ClinicalAppointment[];
  onStartVisit: (appointment: ClinicalAppointment) => void;
  onCompleteVisit: (appointment: ClinicalAppointment) => void;
  onViewPatient: (patientId: string) => void;
  onUpdateStatus: (appointmentId: number | string, newStatus: AppointmentStatusType) => void;
}

export const PhysioAppointmentsView: React.FC<PhysioAppointmentsViewProps> = ({
  appointments,
  onStartVisit,
  onCompleteVisit,
  onViewPatient,
  onUpdateStatus
}) => {
  const [timelineView, setTimelineView] = useState<'TODAY' | 'WEEK' | 'MONTH'>('TODAY');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const statusList: (AppointmentStatusType | 'ALL')[] = [
    'ALL',
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'PENDING',
    'RESCHEDULED',
    'CANCELLED',
    'NO_SHOW'
  ];

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch = 
      a.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.area.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || a.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-700" />
              <span>Appointment Management</span>
            </h2>
            <p className="text-xs text-slate-500">
              Complete timeline tracking for home visits across clinical phases
            </p>
          </div>

          {/* Timeline View Tabs (Today, Week, Month) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold self-start sm:self-auto">
            {(['TODAY', 'WEEK', 'MONTH'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setTimelineView(v)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timelineView === v
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {v === 'TODAY' ? 'Today' : v === 'WEEK' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, condition, area..."
              className="w-full py-1.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            />
          </div>

          {/* Status Filter Dropdown / Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto text-[11px]">
            {statusList.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2 py-1 rounded-lg font-bold shrink-0 transition-colors ${
                  selectedStatus === st
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' ? 'All' : st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-sm">No Appointments Found</h3>
            <p className="text-xs text-slate-400">
              No clinical appointments match your current search or status criteria.
            </p>
          </div>
        ) : (
          filteredAppointments.map((appt) => {
            const isInProgress = appt.status === 'IN_PROGRESS';
            const isCompleted = appt.status === 'COMPLETED';
            const isCancelled = appt.status === 'CANCELLED';
            const isNoShow = appt.status === 'NO_SHOW';

            return (
              <div
                key={appt.id}
                className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all space-y-3.5 ${
                  isInProgress
                    ? 'border-sky-400 shadow-md ring-2 ring-sky-400/20'
                    : isCompleted
                    ? 'border-slate-200/70 opacity-90'
                    : 'border-slate-200/80 shadow-2xs hover:border-teal-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/80 flex flex-col items-center justify-center text-teal-900 shrink-0">
                      <Clock className="w-4 h-4 text-teal-700 mb-0.5" />
                      <span className="text-[10px] font-extrabold">{appt.time}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900">{appt.patient_name}</h3>
                        <span className="text-xs text-slate-400">({appt.age}y)</span>
                        <span className="text-[10px] text-slate-400 font-mono">#{appt.reference_id}</span>
                      </div>
                      <p className="text-xs text-teal-700 font-semibold">{appt.condition}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{appt.area || appt.location}</span>
                        <span>·</span>
                        <span className="font-bold text-slate-700">₹{appt.fee}</span>
                        <span className={`text-[10px] font-bold px-1.5 rounded ${
                          appt.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {appt.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isInProgress
                        ? 'bg-sky-100 text-sky-800 border border-sky-300 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : isCancelled
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : isNoShow
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : appt.status === 'CONFIRMED'
                        ? 'bg-teal-50 text-teal-800 border border-teal-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {appt.status.replace('_', ' ')}
                  </span>
                </div>

                {appt.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-700">Notes:</strong> {appt.notes}
                  </p>
                )}

                {/* Bottom Actions Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewPatient(appt.patient_id)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Clinical Profile</span>
                    </button>

                    {!isCompleted && !isCancelled && (
                      <button
                        onClick={() => onUpdateStatus(appt.id, 'NO_SHOW')}
                        className="px-2 py-1.5 text-slate-400 hover:text-slate-600 font-bold text-[11px] rounded-lg transition-colors"
                      >
                        Mark No-Show
                      </button>
                    )}

                    {!isCompleted && !isCancelled && (
                      <button
                        onClick={() => onUpdateStatus(appt.id, 'CANCELLED')}
                        className="px-2 py-1.5 text-rose-600 hover:bg-rose-50 font-bold text-[11px] rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isInProgress ? (
                      <button
                        onClick={() => onCompleteVisit(appt)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Complete Visit</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onStartVisit(appt)}
                        disabled={isCompleted || isCancelled}
                        className={`px-3.5 py-1.5 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors ${
                          isCompleted
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-teal-700 hover:bg-teal-800 text-white'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isCompleted ? 'Visit Completed' : 'Start Visit'}</span>
                      </button>
                    )}
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
