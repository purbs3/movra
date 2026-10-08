import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Loader2, 
  UserCheck, 
  Stethoscope, 
  Code2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LoginProps {
  onNavigate: (view: 'login' | 'signup' | 'forgot-password') => void;
  onSuccessRedirect: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate, onSuccessRedirect }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoDrawer, setShowDemoDrawer] = useState(false);

  // Demo accounts are gated behind an environment feature flag (disabled in production)
  const isDemoModeEnabled = import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true';

  const validateForm = (): boolean => {
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
      setError('Please enter your password.');
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
      const res = await login(email.trim().toLowerCase(), password);
      setIsLoading(false);

      if (res.success && res.role) {
        onSuccessRedirect(res.role);
      } else {
        setError(res.error || 'Authentication failed. Please verify your email and password.');
      }
    } catch {
      setIsLoading(false);
      setError('Unable to reach the authentication service. Please check your connection.');
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your recovery journey and clinical care."
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Input */}
          <div className="space-y-1.5">
            <label 
              htmlFor="login-email" 
              className="block text-xs font-bold text-slate-700 tracking-wide"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                id="login-email"
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

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="login-password" 
                className="block text-xs font-bold text-slate-700 tracking-wide"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs font-semibold text-[#0EA5A0] hover:text-teal-700 transition-colors focus:outline-none focus:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••"
                required
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full mt-2 py-3 px-4 bg-[#07111F] hover:bg-[#0D1C30] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-[0.99] cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in to MOVRA</span>
                <ArrowRight className="w-4 h-4 text-[#0EA5A0]" />
              </>
            )}
          </button>
        </form>

        {/* Visual Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-bold">
            <span className="bg-white px-3 text-slate-400">or</span>
          </div>
        </div>

        {/* Secondary Action: Create Account */}
        <div className="text-center">
          <p className="text-xs text-slate-600">
            <span>New to MOVRA? </span>
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="font-bold text-[#0EA5A0] hover:text-teal-700 transition-colors focus:outline-none underline-offset-2 hover:underline"
            >
              Create an account
            </button>
          </p>
        </div>

        {/* ========================================================= */}
        {/* DEVELOPMENT / DEMO CONTROLS                              */}
        {/* Rendered ONLY when VITE_ENABLE_DEMO_AUTH === 'true'.       */}
        {/* Discretely collapsible and NEVER exposes admin accounts. */}
        {/* ========================================================= */}
        {isDemoModeEnabled && (
          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowDemoDrawer(!showDemoDrawer)}
              className="w-full flex items-center justify-between text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors py-1 cursor-pointer focus:outline-none"
            >
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Developer Demo Helper</span>
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[#0EA5A0] font-semibold">
                {showDemoDrawer ? 'Hide' : 'Show Accounts'}
                {showDemoDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </span>
            </button>

            {showDemoDrawer && (
              <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-in fade-in duration-150">
                <p className="text-[10px] text-slate-500 leading-normal">
                  Development feature active (<code className="text-[#0EA5A0]">VITE_ENABLE_DEMO_AUTH</code>). Select a role to test:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('patient@movra.ai', 'Patient@12345')}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#0EA5A0] hover:shadow-2xs text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-slate-900 text-[11px] font-bold group-hover:text-[#0EA5A0]">
                      <UserCheck className="w-3.5 h-3.5 text-[#0EA5A0]" />
                      <span>Patient Account</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">patient@movra.ai</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill('physio@movra.ai', 'Physio@12345')}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:border-sky-500 hover:shadow-2xs text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-slate-900 text-[11px] font-bold group-hover:text-sky-600">
                      <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                      <span>Physio Account</span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">physio@movra.ai</div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;
