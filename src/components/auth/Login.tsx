import React, { useState } from 'react';
import { 
  Activity, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  UserCheck, 
  Sparkles,
  Stethoscope,
  ShieldAlert
} from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;

    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success && res.role) {
      onSuccessRedirect(res.role);
    } else {
      setError(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  // Quick fill helper for testing the 3 seeded roles
  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center px-4 max-w-md mx-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-teal-600 text-white items-center justify-center shadow-md shadow-teal-600/30 mb-1">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to Movra
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            AI-powered home physiotherapy rehabilitation & clinical practice.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full py-2.5 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-[11px] font-semibold text-teal-600 hover:text-teal-700"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full py-2.5 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-teal-600/20 transition-all active:scale-98"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In to Movra</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Bar for Testing */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Quick Fill Demo Accounts:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('patient@movra.ai', 'Patient@12345')}
              className="py-1.5 px-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] font-bold rounded-lg border border-teal-200 flex flex-col items-center gap-0.5 transition-colors"
            >
              <UserCheck className="w-3 h-3 text-teal-600" />
              <span>Patient</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('physio@movra.ai', 'Physio@12345')}
              className="py-1.5 px-2 bg-sky-50 hover:bg-sky-100 text-sky-800 text-[10px] font-bold rounded-lg border border-sky-200 flex flex-col items-center gap-0.5 transition-colors"
            >
              <Stethoscope className="w-3 h-3 text-sky-600" />
              <span>Physio</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin@movra.ai', 'Admin@12345')}
              className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-[10px] font-bold rounded-lg border border-purple-200 flex flex-col items-center gap-0.5 transition-colors"
            >
              <ShieldAlert className="w-3 h-3 text-purple-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Footer Link to Signup */}
        <div className="pt-1 text-center text-xs text-slate-500">
          <span>Don't have an account? </span>
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="font-bold text-teal-600 hover:text-teal-700"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
