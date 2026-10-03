import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BookingRequest } from '../../types';

interface BookingAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: Partial<BookingRequest>;
  onAuthSuccess: () => void;
}

export const BookingAuthModal: React.FC<BookingAuthModalProps> = ({
  isOpen,
  onClose,
  bookingData,
  onAuthSuccess,
}) => {
  const { login, signup } = useAuth();
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');

  // Form Fields
  const [fullName, setFullName] = useState(bookingData.name || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(bookingData.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authMode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      setIsLoading(true);
      const res = await signup({
        email: email.trim().toLowerCase(),
        password,
        full_name: fullName.trim() || bookingData.name || 'Patient',
        role: 'patient',
      });
      setIsLoading(false);

      if (res.success) {
        onAuthSuccess();
      } else {
        setError(res.error || 'Failed to create your account. Please verify details.');
      }
    } else {
      // Sign In mode
      setIsLoading(true);
      const res = await login(email.trim().toLowerCase(), password);
      setIsLoading(false);

      if (res.success) {
        onAuthSuccess();
      } else {
        setError(res.error || 'Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 border border-slate-100 shadow-2xl relative overflow-hidden space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-[11px] font-bold">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Step 2: Confirm Identity</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {authMode === 'signup' ? 'Create your MOVRA account' : 'Welcome back to MOVRA'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your booking details for <span className="font-semibold text-slate-800">{bookingData.name || 'your visit'}</span> are ready. Create a free account to confirm your request and track your physiotherapy journey.
          </p>
        </div>

        {/* Preserved Booking Summary Mini-Badge */}
        <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Home Visit Request</span>
            <span className="font-bold text-slate-800">{bookingData.condition || 'General Physiotherapy'}</span>
          </div>
          <div className="text-right">
            <span className="text-teal-700 font-bold block">{bookingData.preferred_date || 'Upcoming'}</span>
            <span className="text-[11px] text-slate-500">{bookingData.preferred_time || 'Morning'}</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authMode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Patient Name"
                  required
                  className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {authMode === 'signup' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Mobile Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full py-2.5 pl-9 pr-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700">Date of Birth (Opt)</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {authMode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  minLength={6}
                  className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-teal-600/20 transition-all active:scale-98 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Securing Session...</span>
            ) : (
              <>
                <span>{authMode === 'signup' ? 'Create MOVRA Account & Continue' : 'Sign In & Confirm Visit'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch Mode Footer */}
        <div className="pt-2 border-t border-slate-100 text-center text-xs text-slate-500">
          {authMode === 'signup' ? (
            <>
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setError(null);
                }}
                className="font-bold text-teal-600 hover:text-teal-700 underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              <span>Don't have an account yet? </span>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setError(null);
                }}
                className="font-bold text-teal-600 hover:text-teal-700 underline"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingAuthModal;
