import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Loader2, 
  UserCheck, 
  Stethoscope, 
  CheckCircle2
} from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface SignupProps {
  onNavigate: (view: 'login' | 'signup' | 'forgot-password') => void;
  onSuccessRedirect: (role: UserRole) => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigate, onSuccessRedirect }) => {
  const { signup } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'patient' | 'physiotherapist'>('patient');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setError('Please enter a password.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateForm()) return;

    setError(null);
    setIsLoading(true);

    try {
      const res = await signup({
        email: email.trim().toLowerCase(),
        password,
        full_name: fullName.trim(),
        role
      });

      setIsLoading(false);

      if (res.success && res.role) {
        onSuccessRedirect(res.role);
      } else {
        setError(res.error || 'Registration failed. Please try again.');
      }
    } catch {
      setIsLoading(false);
      setError('Unable to reach the registration service. Please verify your connection.');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join MOVRA to track recovery progress or manage clinical patient pathways."
    >
      <div className="space-y-5">
        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="p-3.5 bg-rose-50/90 border border-rose-200/90 text-rose-900 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label 
              htmlFor="signup-name" 
              className="block text-xs font-bold text-slate-700 tracking-wide"
            >
              Full Name
            </label>
            <div className="relative">
              <input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Dr. Ananya Sharma or Rahul Verma"
                required
                disabled={isLoading}
                aria-required="true"
                className="w-full py-2.5 pl-10 pr-3.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5A0]/20 focus:border-[#0EA5A0] transition-all disabled:opacity-60"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label 
              htmlFor="signup-email" 
              className="block text-xs font-bold text-slate-700 tracking-wide"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="name@example.com"
                required
                disabled={isLoading}
                aria-required="true"
                className="w-full py-2.5 pl-10 pr-3.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5A0]/20 focus:border-[#0EA5A0] transition-all disabled:opacity-60"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label 
              htmlFor="signup-password" 
              className="block text-xs font-bold text-slate-700 tracking-wide"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="At least 6 characters"
                required
                minLength={6}
                disabled={isLoading}
                aria-required="true"
                className="w-full py-2.5 pl-10 pr-10 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5A0]/20 focus:border-[#0EA5A0] transition-all disabled:opacity-60"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {/* Password Requirement Hint */}
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span>Must contain at least 6 characters</span>
            </p>
          </div>

          {/* Role Selection (Segmented Clinical Cards) */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold text-slate-700 tracking-wide">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Patient Role Card */}
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'patient'
                    ? 'border-[#0EA5A0] bg-[#E8F8F6]/40 ring-1 ring-[#0EA5A0]'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <UserCheck className={`w-4 h-4 ${role === 'patient' ? 'text-[#0EA5A0]' : 'text-slate-400'}`} />
                    <span>Patient</span>
                  </div>
                  {role === 'patient' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0EA5A0]" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 leading-snug">
                  Rehabilitating at home with guided plans &amp; tracking.
                </p>
              </button>

              {/* Physiotherapist Role Card */}
              <button
                type="button"
                onClick={() => setRole('physiotherapist')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  role === 'physiotherapist'
                    ? 'border-sky-600 bg-sky-50/50 ring-1 ring-sky-600'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Stethoscope className={`w-4 h-4 ${role === 'physiotherapist' ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>Physiotherapist</span>
                  </div>
                  {role === 'physiotherapist' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 leading-snug">
                  Clinical practitioner managing visits &amp; patient care.
                </p>
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              * Note: Administrator accounts are provisioned directly by Patna clinical operations.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !fullName || !email || !password}
            className="w-full mt-2 py-3 px-4 bg-[#07111F] hover:bg-[#0D1C30] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-[0.99] cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>Creating your account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4 text-[#0EA5A0]" />
              </>
            )}
          </button>
        </form>

        {/* Secondary Action: Return to Login */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="font-bold text-[#0EA5A0] hover:text-teal-700 transition-colors focus:outline-none underline-offset-2 hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
