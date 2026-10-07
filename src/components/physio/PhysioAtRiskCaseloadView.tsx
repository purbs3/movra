import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Send, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Activity, 
  Eye, 
  X,
  Search,
  Filter,
  Check
} from 'lucide-react';
import { api } from '../../services/api';

interface PhysioAtRiskCaseloadViewProps {
  onViewPatient: (patientId: string) => void;
  onScheduleAppointment?: (patient: any) => void;
}

export const PhysioAtRiskCaseloadView: React.FC<PhysioAtRiskCaseloadViewProps> = ({
  onViewPatient,
  onScheduleAppointment
}) => {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');
  const [reminderModalPatient, setReminderModalPatient] = useState<any | null>(null);
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderType, setReminderType] = useState<'whatsapp' | 'sms' | 'app'>('whatsapp');
  const [reminderSentStatus, setReminderSentStatus] = useState<string | null>(null);

  const fetchAtRisk = () => {
    setIsLoading(true);
    api.getAtRiskPatients().then((res) => {
      if (res && res.patients) {
        setPatients(res.patients);
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchAtRisk();
  }, []);

  const filteredPatients = patients.filter((p) => {
    if (selectedFilter === 'ALL') return true;
    return p.risk_level === selectedFilter;
  });

  const handleOpenReminder = (patient: any) => {
    setReminderModalPatient(patient);
    setReminderSentStatus(null);
    setReminderMessage(
      `Hello ${patient.patient_name.split(' ')[0]}, this is Dr. Ananya Iyer from MOVRA. We noticed you haven't logged your physical therapy exercises recently. How is your recovery feeling today? Please let us know if you are experiencing any pain.`
    );
  };

  const handleSendReminder = async () => {
    if (!reminderModalPatient) return;
    await api.sendPatientReminder(reminderModalPatient.patient_id, reminderType, reminderMessage);
    
    // Also trigger direct WhatsApp handoff if selected
    if (reminderType === 'whatsapp') {
      const encoded = encodeURIComponent(reminderMessage);
      window.open(`https://wa.me/919820144829?text=${encoded}`, '_blank', 'noopener,noreferrer');
    }

    setReminderSentStatus(`Reminder dispatched successfully to ${reminderModalPatient.patient_name} via ${reminderType.toUpperCase()}.`);
    setTimeout(() => {
      setReminderModalPatient(null);
      setReminderSentStatus(null);
    }, 1800);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header & Risk Level Filter Chips */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Predictive Dropout Alerts</span>
              </h2>
              <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Caseload Retention Risk
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Patients flagged algorithmically based on missed exercise streaks, negative chat sentiment, and step drop velocity.
            </p>
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold self-start sm:self-auto">
            {(['ALL', 'HIGH', 'MODERATE', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedFilter(lvl)}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  selectedFilter === lvl 
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {lvl === 'ALL' ? 'All Caseload' : `${lvl} Risk`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Cards List */}
      {isLoading ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 space-y-2">
          <Activity className="w-6 h-6 text-teal-700 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Scanning caseload telemetry and memory sentiment...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <p className="text-xs font-bold text-slate-700">No patients currently flagged in this filter category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPatients.map((patient) => {
            const isHigh = patient.risk_level === 'HIGH';
            const isMod = patient.risk_level === 'MODERATE';

            return (
              <div
                key={patient.patient_id}
                className={`bg-white rounded-3xl p-5 border shadow-2xs space-y-4 transition-all ${
                  isHigh 
                    ? 'border-rose-200 hover:border-rose-300' 
                    : isMod 
                    ? 'border-amber-200 hover:border-amber-300' 
                    : 'border-slate-200 hover:border-teal-200'
                }`}
              >
                {/* Header Strip with Risk Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs ${
                      isHigh ? 'bg-rose-700' : isMod ? 'bg-amber-600' : 'bg-teal-700'
                    }`}>
                      {patient.patient_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900">{patient.patient_name}</h3>
                        <span className="text-[11px] font-mono text-slate-400">ID: {patient.patient_id}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold">{patient.condition}</p>
                      <p className="text-[11px] text-slate-500">Last active: {patient.last_active}</p>
                    </div>
                  </div>

                  {/* Red/Amber/Green Risk Badge */}
                  <div className="text-right space-y-1">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full border uppercase tracking-wider ${
                      isHigh
                        ? 'bg-rose-50 text-rose-800 border-rose-300'
                        : isMod
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-rose-600 animate-pulse' : isMod ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                      <span>{patient.risk_score}% · {patient.risk_level} RISK</span>
                    </span>
                  </div>
                </div>

                {/* Risk Factor Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Days Since Log</span>
                    <span className={`font-bold ${patient.days_since_last_log > 2 ? 'text-rose-700' : 'text-slate-800'}`}>
                      {patient.days_since_last_log} Days Inactive
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Step Reduction</span>
                    <span className={`font-bold ${patient.step_drop_percentage > 20 ? 'text-rose-700' : 'text-slate-800'}`}>
                      -{patient.step_drop_percentage}% Trend
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Missed Streaks</span>
                    <span className={`font-bold ${patient.missed_streaks > 0 ? 'text-amber-700' : 'text-slate-800'}`}>
                      {patient.missed_streaks} Missed Days
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Memory Sentiment</span>
                    <span className={`font-bold ${patient.negative_sentiment ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {patient.negative_sentiment ? 'Distress Flagged' : 'Stable'}
                    </span>
                  </div>
                </div>

                {/* Clinical Reasoning & Sentiment Context */}
                <div className="text-xs space-y-1.5 p-3 rounded-2xl bg-white border border-slate-100">
                  <div className="text-slate-700">
                    <strong className="text-slate-900">Risk Reasoning: </strong>
                    <span>{patient.reasoning}</span>
                  </div>
                  {patient.sentiment_quote && (
                    <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl">
                      "{patient.sentiment_quote}"
                    </div>
                  )}
                  <div className="text-teal-800 font-semibold text-[11px] pt-1">
                    Recommended Action: {patient.recommended_action}
                  </div>
                </div>

                {/* Action Bar with Send Reminder Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => onViewPatient(patient.patient_id)}
                    className="text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Clinical Records</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenReminder(patient)}
                      className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-teal-400" />
                      <span>Send Reminder</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Send Reminder Modal */}
      {reminderModalPatient && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                  Adherence Nudge Dispatch
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  Send Recovery Reminder to {reminderModalPatient.patient_name}
                </h3>
              </div>
              <button
                onClick={() => setReminderModalPatient(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reminderSentStatus ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{reminderSentStatus}</span>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Channel Select */}
                <div>
                  <label className="block text-slate-600 font-bold mb-1.5">Dispatch Channel:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setReminderType('whatsapp')}
                      className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        reminderType === 'whatsapp' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReminderType('app')}
                      className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        reminderType === 'app' ? 'bg-teal-50 text-teal-900 border-teal-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5 text-teal-600" />
                      <span>In-App Push</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReminderType('sms')}
                      className={`p-2.5 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        reminderType === 'sms' ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                      <span>Direct SMS</span>
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-slate-600 font-bold mb-1.5">Personalized Message:</label>
                  <textarea
                    rows={4}
                    value={reminderMessage}
                    onChange={(e) => setReminderMessage(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 font-normal outline-none focus:bg-white focus:border-teal-700 leading-relaxed"
                  />
                </div>

                {/* Submit Action */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReminderModalPatient(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendReminder}
                    className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-teal-400" />
                    <span>Confirm &amp; Send</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
