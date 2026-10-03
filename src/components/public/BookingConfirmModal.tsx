import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Activity, 
  User, 
  Phone, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  RefreshCw,
  Home
} from 'lucide-react';
import { BookingRequest } from '../../types';
import { api } from '../../services/api';

interface BookingConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: Partial<BookingRequest>;
  onBookingConfirmed: (createdBooking: BookingRequest) => void;
  onNavigateToDashboard: () => void;
  onBackToHome: () => void;
}

export const BookingConfirmModal: React.FC<BookingConfirmModalProps> = ({
  isOpen,
  onClose,
  bookingData,
  onBookingConfirmed,
  onNavigateToDashboard,
  onBackToHome,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await api.createBooking({
        name: bookingData.name || 'Patient',
        phone: bookingData.phone || '+91 98765 43210',
        age: bookingData.age || 45,
        location: bookingData.location || 'Local Area',
        condition: bookingData.condition || 'General Physiotherapy',
        service: bookingData.service || 'Home Visit Physiotherapy',
        preferred_date: bookingData.preferred_date || new Date().toISOString().split('T')[0],
        preferred_time: bookingData.preferred_time || '10:00 AM',
        message: bookingData.message || '',
        user_id: bookingData.user_id,
      });

      if (res && res.booking) {
        setConfirmedBooking(res.booking);
        onBookingConfirmed(res.booking);
      } else {
        throw new Error('Could not record booking request.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 border border-slate-100 shadow-2xl relative overflow-hidden space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        {!confirmedBooking && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ======================================================== */}
        {/* STATE 1: REVIEW & CONFIRM */}
        {/* ======================================================== */}
        {!confirmedBooking ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-[11px] font-bold">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                <span>Step 3: Review Details</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Confirm Home Visit
              </h2>
              <p className="text-xs text-slate-500">
                Please review your home visit details before final confirmation.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs">
                {error}
              </div>
            )}

            {/* Structured Details Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Service</span>
                <span className="font-extrabold text-slate-800">
                  {bookingData.service || 'Home Visit Physiotherapy'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient Name</span>
                  <span className="font-bold text-slate-800">{bookingData.name} ({bookingData.age}y)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Mobile Contact</span>
                  <span className="font-bold text-slate-800 font-mono">{bookingData.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-teal-600" /> Preferred Date
                  </span>
                  <span className="font-bold text-slate-800">{bookingData.preferred_date}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-teal-600" /> Preferred Time
                  </span>
                  <span className="font-bold text-slate-800">{bookingData.preferred_time}</span>
                </div>
              </div>

              <div className="pb-1">
                <span className="text-slate-400 block text-[10px] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-600" /> Visit Location
                </span>
                <span className="font-bold text-slate-800">{bookingData.location}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px]">Condition / Concern</span>
                <span className="font-medium text-slate-700 bg-white p-2 rounded-xl border border-slate-200/60 block mt-0.5">
                  {bookingData.condition}
                </span>
              </div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-2xl text-[11px] text-teal-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                Zero advance booking fees. Our clinical coordination desk will verify address and therapist availability.
              </span>
            </div>

            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-teal-600/30 transition-all active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting Visit Request...</span>
                </>
              ) : (
                <>
                  <span>Confirm Booking Request</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* ======================================================== */
          /* STATE 2: SUCCESSFUL CONFIRMATION */
          /* ======================================================== */
          <div className="space-y-4 text-center animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center border-2 border-emerald-200 shadow-sm shadow-emerald-600/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Request Sent Successfully
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Booking Request Sent
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Your home visit request has been submitted. MOVRA will contact you to confirm the appointment.
              </p>
            </div>

            {/* Reference Badge */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 font-mono">
                <span className="text-slate-400 font-sans">Reference ID</span>
                <span className="font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {confirmedBooking.reference_id}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Patient</span>
                <span className="font-bold text-slate-800">{confirmedBooking.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Service</span>
                <span className="font-bold text-slate-800">{confirmedBooking.service}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Date & Time</span>
                <span className="font-bold text-slate-800">
                  {confirmedBooking.preferred_date} • {confirmedBooking.preferred_time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Location</span>
                <span className="font-bold text-slate-800 truncate max-w-[180px]">{confirmedBooking.location}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={onNavigateToDashboard}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-teal-600/20 transition-all active:scale-98"
              >
                <span>View My Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onBackToHome}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmModal;
