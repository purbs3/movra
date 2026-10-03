import React, { useState } from 'react';
import { 
  Inbox, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Check, 
  X, 
  RotateCcw, 
  Eye, 
  MessageCircle, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { BookingRequest } from '../../types';

interface PhysioBookingRequestsViewProps {
  bookings: BookingRequest[];
  onAccept: (bookingId: number | string, notes?: string) => Promise<void>;
  onReject: (bookingId: number | string, reason: string) => Promise<void>;
  onReschedule: (bookingId: number | string, newDate: string, newTime: string, reason?: string) => Promise<void>;
  onViewPatient: (patientId: string) => void;
}

export const PhysioBookingRequestsView: React.FC<PhysioBookingRequestsViewProps> = ({
  bookings,
  onAccept,
  onReject,
  onReschedule,
  onViewPatient
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'RESCHEDULED' | 'REJECTED'>('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Reject Modal State
  const [rejectingBooking, setRejectingBooking] = useState<BookingRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('Outside service coverage area for requested time slot');

  // Reschedule Modal State
  const [reschedulingBooking, setReschedulingBooking] = useState<BookingRequest | null>(null);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('11:00 AM');
  const [rescheduleReason, setRescheduleReason] = useState('Prior home visit extended in adjacent district');

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  const handleConfirmAccept = async (b: BookingRequest) => {
    const id = b.id || b.reference_id!;
    setActionLoadingId(String(id));
    try {
      await onAccept(id, 'Confirmed for home rehabilitation visit.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingBooking) return;
    const id = rejectingBooking.id || rejectingBooking.reference_id!;
    setActionLoadingId(String(id));
    try {
      await onReject(id, rejectReason);
      setRejectingBooking(null);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!reschedulingBooking) return;
    const id = reschedulingBooking.id || reschedulingBooking.reference_id!;
    setActionLoadingId(String(id));
    try {
      await onReschedule(id, newDate, newTime, rescheduleReason);
      setReschedulingBooking(null);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-teal-700" />
            <span>Home Visit Booking Requests</span>
          </h2>
          <p className="text-xs text-slate-500">
            Review incoming patient requests, verify service area, and manage confirmation lifecycle
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar text-xs">
          {(['ALL', 'PENDING', 'CONFIRMED', 'RESCHEDULED', 'REJECTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap ${
                filter === tab
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200/80 space-y-2">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-sm">No Booking Requests Found</h3>
            <p className="text-xs text-slate-400">
              There are no requests matching the '{filter.toLowerCase()}' filter.
            </p>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const isLoading = actionLoadingId === String(b.id || b.reference_id);
            const isPending = b.status === 'PENDING';
            const isConfirmed = b.status === 'CONFIRMED';
            const isRejected = b.status === 'REJECTED';
            const isRescheduled = b.status === 'RESCHEDULED';

            return (
              <div
                key={b.id || b.reference_id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4 hover:border-teal-300 transition-all"
              >
                {/* Header: Name, Service, Reference, Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900">{b.name}</h3>
                      <span className="text-xs text-slate-400">({b.age} years)</span>
                    </div>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">
                      {b.service || 'Home Visit Physiotherapy'}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400">
                      Ref: {b.reference_id || `MOV-BK-${b.id}`}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      isConfirmed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isPending
                        ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                        : isRescheduled
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="font-bold">{b.preferred_date}</span>
                      <span>·</span>
                      <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{b.preferred_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{b.location}</span>
                    </div>
                  </div>

                  <div className="space-y-1 border-t sm:border-t-0 sm:border-l sm:pl-3 border-slate-200 pt-2 sm:pt-0">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Clinical Condition</span>
                    <p className="font-medium text-slate-800">{b.condition}</p>
                    {b.message && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5">"{b.message}"</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewPatient(`pt_${b.id || '101'}`)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Patient</span>
                    </button>

                    <a
                      href={`tel:${b.phone}`}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                      title="Call Patient"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                    </a>

                    <a
                      href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(b.name)}%2C%20this%20is%20Dr.%20Ananya%20from%20MOVRA%20Physiotherapy%20regarding%20your%20home%20visit.`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors"
                      title="WhatsApp Patient"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Reschedule Button */}
                    {!isRejected && (
                      <button
                        onClick={() => {
                          setReschedulingBooking(b);
                          setNewDate(b.preferred_date);
                          setNewTime(b.preferred_time);
                        }}
                        disabled={isLoading}
                        className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
                        <span>Reschedule</span>
                      </button>
                    )}

                    {/* Reject Button */}
                    {isPending && (
                      <button
                        onClick={() => setRejectingBooking(b)}
                        disabled={isLoading}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Accept Button */}
                    {b.status !== 'CONFIRMED' && (
                      <button
                        onClick={() => handleConfirmAccept(b)}
                        disabled={isLoading}
                        className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Request</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* REJECT MODAL */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Reject Booking Request</span>
              </h3>
              <button onClick={() => setRejectingBooking(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Please specify the reason for declining <strong>{rejectingBooking.name}</strong>'s home visit request:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
              placeholder="e.g., Outside coverage radius, clinician caseload full..."
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setRejectingBooking(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {reschedulingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-sky-600" />
                <span>Reschedule Home Visit</span>
              </h3>
              <button onClick={() => setReschedulingBooking(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Propose an alternative slot for <strong>{reschedulingBooking.name}</strong>:
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">New Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">New Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 11:30 AM"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Reason for Adjustment</label>
              <input
                type="text"
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setReschedulingBooking(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Back
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Save & Notify Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
