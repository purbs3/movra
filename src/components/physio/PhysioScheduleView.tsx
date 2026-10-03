import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  MessageCircle, 
  Navigation, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Inbox,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  ChevronRight
} from 'lucide-react';
import { ClinicalAppointment } from '../../types';

interface PhysioScheduleViewProps {
  schedule: ClinicalAppointment[];
  onStartVisit: (appointment: ClinicalAppointment) => void;
  onViewPatient: (patientId: string) => void;
  onNavigateRoute: (appointment: ClinicalAppointment) => void;
  onNavigateTab: (tab: string) => void;
  onOpenNotifications: () => void;
  physioProfile?: {
    name: string;
    qualification: string;
    experience: string;
    license: string;
    clinic: string;
  };
}

export const PhysioScheduleView: React.FC<PhysioScheduleViewProps> = ({
  schedule,
  onStartVisit,
  onViewPatient,
  onNavigateRoute,
  onNavigateTab,
  onOpenNotifications,
  physioProfile = {
    name: 'Dr. Ananya Iyer, PT',
    qualification: 'BPT, MPT (Rehabilitation Specialist - Editable Placeholder)',
    experience: '8+ Years Clinical Practice (Demo)',
    license: 'PT-IN-88921-A (Sample)',
    clinic: 'City Ortho Rehabilitation & Home Care'
  }
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Clinician Profile Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-teal-900/10">
                <Stethoscope className="w-7 h-7" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Active on Duty" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
                  {physioProfile.name}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/70">
                  On Duty
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {physioProfile.qualification}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                <span>{physioProfile.clinic}</span>
                <span>•</span>
                <span className="font-mono text-[10px]">{physioProfile.license}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('profile')}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 p-2 hover:bg-teal-50 rounded-xl transition-colors shrink-0"
            title="Edit Physiotherapist Profile"
          >
            Edit Profile
          </button>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Profile credentials verified for home-visit clinical practice</span>
          </span>
          <span className="text-[10px] text-slate-400 italic">Editable placeholder</span>
        </div>
      </div>

      {/* High-Level Clinical Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {/* 1. Today's Visits */}
        <div 
          onClick={() => onNavigateTab('visits')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-400 cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Today's Visits</span>
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-800">5</div>
          <p className="text-[10px] text-teal-700 font-medium">3 Completed · 2 Left</p>
        </div>

        {/* 2. New Booking Requests */}
        <div 
          onClick={() => onNavigateTab('requests')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-400 cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">New Requests</span>
            <Inbox className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-amber-600">3</div>
          <p className="text-[10px] text-slate-500">Require Therapist Review</p>
        </div>

        {/* 3. Active Patients */}
        <div 
          onClick={() => onNavigateTab('patients')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-400 cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Active Patients</span>
            <Users className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-800">18</div>
          <p className="text-[10px] text-emerald-600 font-medium">94% Care Adherence</p>
        </div>

        {/* 4. Next Appointment */}
        <div 
          onClick={() => onNavigateTab('appointments')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-400 cursor-pointer transition-all space-y-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Next Appointment</span>
            <Clock className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-xs font-extrabold text-slate-800 truncate">10:00 AM</div>
          <p className="text-[10px] text-slate-600 truncate">Rahul Sharma (TKA)</p>
        </div>

        {/* 5. Today's Earnings */}
        <div 
          onClick={() => onNavigateTab('earnings')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-teal-400 cursor-pointer transition-all space-y-1 col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Today's Earnings</span>
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700">₹1,500</div>
          <p className="text-[10px] text-slate-400">₹34,500 this month</p>
        </div>
      </div>

      {/* TODAY'S SCHEDULE SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-700" />
            <h3 className="font-extrabold text-sm text-slate-900">Today's Home Visit Schedule</h3>
          </div>
          <button
            onClick={() => onNavigateTab('routes')}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View Route Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {schedule.map((appt) => {
            const isConfirmed = appt.status === 'CONFIRMED';
            const isPending = appt.status === 'PENDING';
            const isInProgress = appt.status === 'IN_PROGRESS';
            const isCompleted = appt.status === 'COMPLETED';

            return (
              <div
                key={appt.id}
                className={`bg-white rounded-3xl p-4 sm:p-5 border transition-all space-y-3.5 ${
                  isInProgress
                    ? 'border-sky-400 shadow-md ring-2 ring-sky-400/20'
                    : 'border-slate-200/80 shadow-2xs hover:border-teal-300'
                }`}
              >
                {/* Header Row: Time, Patient Name, Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/70 flex flex-col items-center justify-center text-teal-900 shrink-0">
                      <Clock className="w-4 h-4 text-teal-700 mb-0.5" />
                      <span className="text-[10px] font-extrabold tracking-tight">{appt.time}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900">{appt.patient_name}</h4>
                        <span className="text-xs text-slate-400 font-medium">({appt.age}y)</span>
                      </div>
                      <p className="text-xs text-teal-700 font-semibold">{appt.condition}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700">{appt.area || appt.location}</span>
                        {appt.distance_km && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            · {appt.distance_km} km away
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                      isInProgress
                        ? 'bg-sky-100 text-sky-800 border border-sky-300 animate-pulse'
                        : isCompleted
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : isConfirmed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                {/* Patient Notes or Focus */}
                {appt.notes && (
                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                    <strong className="text-slate-700">Clinical Focus:</strong> {appt.notes}
                  </div>
                )}

                {/* Action Buttons: View, Start Visit, Navigate, Contact */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2 flex-wrap">
                  {/* Left: View & Contact */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onViewPatient(appt.patient_id)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                      title="View Clinical Details"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>View</span>
                    </button>

                    <a
                      href={`tel:${appt.phone}`}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      title="Call Patient"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                    </a>

                    <a
                      href={`https://wa.me/${appt.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(appt.patient_name)}%2C%20this%20is%20${encodeURIComponent(physioProfile.name)}%20from%20MOVRA%20Physiotherapy.`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors"
                      title="WhatsApp Patient"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </a>
                  </div>

                  {/* Right: Navigate & Start Visit */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigateRoute(appt)}
                      className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                      title="View Navigation Directions"
                    >
                      <Navigation className="w-3.5 h-3.5 text-sky-600" />
                      <span>Navigate</span>
                    </button>

                    <button
                      onClick={() => onStartVisit(appt)}
                      disabled={isCompleted}
                      className={`px-3.5 py-1.5 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${
                        isCompleted
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : isInProgress
                          ? 'bg-sky-600 hover:bg-sky-700 text-white'
                          : 'bg-teal-700 hover:bg-teal-800 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isInProgress ? 'Resume Visit' : isCompleted ? 'Completed' : 'Start Visit'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
