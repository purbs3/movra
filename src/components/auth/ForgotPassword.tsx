import React, { useState } from 'react';
import { 
  Activity, 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Lock,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordProps {
  onNavigate: (view: 'login' | 'signup' | 'forgot-password') => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate }) => {
  const { forgotPassword, resetPassword } = useAuth();
  
  // Step 1: Request reset link
  const [email, setEmail] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 2: Set new password
  const [showResetForm, setShowResetForm] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isRequesting) return;

    setError(null);
    setIsRequesting(true);

    const res = await forgotPassword(email.trim().toLowerCase());
    setIsRequesting(false);

    if (res.success) {
      setRequestSuccess(res.message || 'Reset instructions generated. Check console logs for link.');
      if (res.reset_token) {
        setGeneratedToken(res.reset_token);
        setTokenInput(res.reset_token);
      }
    } else {
      setError(res.error || 'Unable to process reset request.');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput || !newPassword || isResetting) return;

    setError(null);
    setIsResetting(true);

    const res = await resetPassword(tokenInput.trim(), newPassword);
    setIsResetting(false);

    if (res.success) {
      setResetSuccess('Your password has been successfully updated! You can now log in.');
    } else {
      setError(res.error || 'Failed to update password with provided token.');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center px-4 max-w-md mx-auto animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 items-center justify-center border border-teal-200 shadow-2xs mb-1">
            <KeyRound className="w-6 h-6 stroke-[2.25]" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {showResetForm
              ? 'Enter the reset token and choose a new password.'
              : 'Enter your email address to receive password reset instructions.'}
          </p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {resetSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <p className="font-bold">Password Reset Successful</p>
              <p className="mt-0.5">{resetSuccess}</p>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="mt-2 inline-flex items-center gap-1 font-bold text-teal-700 underline"
              >
                Proceed to Login <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Request Reset Form */}
        {!showResetForm && !resetSuccess && (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Account Email</label>
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

            <button
              type="submit"
              disabled={isRequesting}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-teal-600/20 transition-all active:scale-98"
            >
              {isRequesting ? (
                <span>Generating reset instructions...</span>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            {/* Simulated Server Console Notice for Testing */}
            {requestSuccess && (
              <div className="p-3.5 bg-teal-50/80 border border-teal-200 rounded-2xl text-xs text-teal-950 space-y-2 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-teal-800">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Reset Token Generated (Console Logged)</span>
                </div>
                <p className="text-[11px] text-teal-800 leading-relaxed">
                  Per project specifications, reset link was output to server terminal. For local testing, copy token below:
                </p>

                {generatedToken && (
                  <div className="p-2 bg-white rounded-xl border border-teal-200 flex items-center justify-between font-mono text-[10px] text-slate-800">
                    <span className="truncate max-w-[240px]">{generatedToken}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(generatedToken)}
                      className="p-1 text-teal-600 hover:text-teal-800 flex items-center gap-1 font-sans text-[11px] font-bold"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl transition-all shadow-2xs"
                >
                  Enter New Password Now ➔
                </button>
              </div>
            )}
          </form>
        )}

        {/* STEP 2: Update Password with Token */}
        {showResetForm && !resetSuccess && (
          <form onSubmit={handleResetSubmit} className="space-y-4 animate-in fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Reset Token</label>
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste reset token here"
                required
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full py-2.5 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isResetting}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-teal-600/20 transition-all active:scale-98"
            >
              {isResetting ? (
                <span>Updating password...</span>
              ) : (
                <span>Confirm New Password</span>
              )}
            </button>
          </form>
        )}

        {/* Back to Login Link */}
        <div className="pt-2 border-t border-slate-100 text-center text-xs">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-1 font-bold text-slate-500 hover:text-teal-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
