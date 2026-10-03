import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  User, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface PhysioFollowUpsViewProps {
  onScheduleAppointment?: (patient: any) => void;
  onViewPatient: (patientId: string) => void;
}

export const PhysioFollowUpsView: React.FC<PhysioFollowUpsViewProps> = ({
  onScheduleAppointment,
  onViewPatient
}) => {
  const [followUps, setFollowUps] = useState([
    {
      id: 1,
      patient_id: 'rahul_123',
      patient_name: 'Rahul Sharma',
      phone: '+91 98201 44829',
      condition: 'Right Knee Replacement (TKA)',
      last_visit: '12 Oct 2026',
      follow_up_due: '15 Oct 2026',
      status: 'DUE_SOON',
      priority: 'Routine',
      reason: 'Day 17 flexion milestone review and progression to straight leg raise without extensor lag.'
    },
    {
      id: 2,
      patient_id: 'patient_anand_71',
      patient_name: 'Anand Verma',
      phone: '+91 98451 90812',
      condition: 'Bilateral Hip Arthroplasty',
      last_visit: '11 Oct 2026',
      follow_up_due: '14 Oct 2026',
      status: 'URGENT',
      priority: 'Urgent Review',
      reason: 'Reported 5/10 evening discomfort after bedside heel slide set. Check for soft-tissue guarding.'
    },
    {
      id: 3,
      patient_id: 'patient_sunita_58',
      patient_name: 'Sunita Patel',
      phone: '+91 98112 33456',
      condition: 'Left ACL Reconstruction',
      last_visit: '10 Oct 2026',
      follow_up_due: '17 Oct 2026',
      status: 'SCHEDULED',
      priority: 'Standard',
      reason: 'Transition from single elbow crutch to independent community walking.'
    }
  ]);

  const [scheduledNotice, setScheduledNotice] = useState<string | null>(null);

  const handleQuickSchedule = (item: any) => {
    setScheduledNotice(`Follow-up appointment booked for ${item.patient_name} on ${item.follow_up_due}.`);
    setTimeout(() => setScheduledNotice(null), 4000);
    if (onScheduleAppointment) {
      onScheduleAppointment(item);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Patient Follow-Up Management Watchlist</span>
        </h2>
        <p className="text-xs text-slate-500">
          Proactively track upcoming milestone checks, post-op precautions, and care adherence check-ins
        </p>

        {scheduledNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{scheduledNotice}</span>
          </div>
        )}
      </div>

      {/* Follow-up Cards */}
      <div className="space-y-3">
        {followUps.map((item) => {
          const isUrgent = item.status === 'URGENT';

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl p-5 border transition-all space-y-3.5 ${
                isUrgent ? 'border-amber-300 shadow-md ring-1 ring-amber-300/30' : 'border-slate-200/80 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isUrgent ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-teal-50 text-teal-800 border border-teal-200'
                  }`}>
                    {item.patient_name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900">{item.patient_name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isUrgent ? 'bg-amber-100 text-amber-900' : 'bg-teal-50 text-teal-800'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">{item.condition}</p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Due Date</span>
                  <span className="font-extrabold text-slate-800">{item.follow_up_due}</span>
                </div>
              </div>

              {/* Clinical Reason */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Clinical Follow-up Objective</span>
                <p className="leading-relaxed">{item.reason}</p>
                <div className="text-[11px] text-slate-400 pt-0.5">Last Visit: {item.last_visit}</div>
              </div>

              {/* Action Buttons: Schedule, Call, Message */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${item.phone}`}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                    title="Call Patient"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                  </a>

                  <a
                    href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(item.patient_name)}%2C%20this%20is%20Dr.%20Ananya%20from%20MOVRA%20Physiotherapy%20checking%20in%20on%20your%20rehabilitation%20recovery.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors"
                    title="WhatsApp Patient"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </a>

                  <button
                    onClick={() => onViewPatient(item.patient_id)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Clinical Profile
                  </button>
                </div>

                <button
                  onClick={() => handleQuickSchedule(item)}
                  className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Visit</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
