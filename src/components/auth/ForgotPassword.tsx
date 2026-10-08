import React, { useState } from 'react';
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  Lock, 
  ArrowRight, 
  Copy, 
  Check, 
  Loader2, 
  Eye, 
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { AuthLayout } from './AuthLayout';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isRequesting) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setIsRequesting(true);

    try {
      const res = await forgotPassword(email.trim().toLowerCase());
      setIsRequesting(false);

      if (res.success) {
        setRequestSuccess(res.message || 'Password reset instructions have been generated.');
        if (res.reset_token) {
          setGeneratedToken(res.reset_token);
          setTokenInput(res.reset_token);
        }
      } else {
        setError(res.error || 'Unable to process reset request. Please check the email address.');
      }
    } catch {
      setIsRequesting(false);
      setError('Could not connect to the service. Please check your internet connection.');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim() || !newPassword || isResetting) return;

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setError(null);
    setIsResetting(true);

    try {
      const res = await resetPassword(tokenInput.trim(), newPassword);
      setIsResetting(false);

      if (res.success) {
        setResetSuccess('Your password has been successfully updated! You can now sign in.');
      } else {
        setError(res.error || 'Failed to update password with provided token. The token may be expired or invalid.');
      }
    } catch {
      setIsResetting(false);
      setError('Could not connect to the server. Please check your network connection.');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AuthLayout
      title={showResetForm ? 'Set new password' : 'Reset your password'}
      subtitle={
        showResetForm
          ? 'Enter your reset token and choose a new secure password.'
          : 'Enter your registered email address to receive password recovery instructions.'
      }
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

        {/* Success Alert for Reset Completion */}
        {resetSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs space-y-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-emerald-950">Password Updated Successfully</p>
                <p className="mt-0.5 text-emerald-800 leading-relaxed">{resetSuccess}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 1: Request Reset Form                                */}
        {/* ========================================================= */}
        {!showResetForm && !resetSuccess && (
          <form onSubmit={handleRequestSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label 
                htmlFor="reset-email" 
                className="block text-xs font-bold text-slate-700 tracking-wide"
              >
                Account Email Address
              </label>
              <div className="relative">
                <input
                  id="reset-email"
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
                  disabled={isRequesting}
                  aria-required="true"
                  className="w-full py-2.5 pl-10 pr-3.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5A0]/20 focus:border-[#0EA5A0] transition-all disabled:opacity-60"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isRequesting || !email}
              className="w-full mt-2 py-3 px-4 bg-[#07111F] hover:bg-[#0D1C30] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-[0.99] cursor-pointer"
            >
              {isRequesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Generating instructions...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Instructions</span>
                  <ArrowRight className="w-4 h-4 text-[#0EA5A0]" />
                </>
              )}
            </button>

            {/* If reset instructions or testing token were generated */}
            {requestSuccess && (
              <div className="p-4 bg-teal-50/80 border border-teal-200/90 rounded-xl text-xs text-slate-800 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-[#07111F]">
                  <CheckCircle2 className="w-4 h-4 text-[#0EA5A0]" />
                  <span>Reset Instructions Generated</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {requestSuccess}
                </p>

                {generatedToken && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Verification Token (Development Mode):
                    </span>
                    <div className="p-2.5 bg-white rounded-lg border border-teal-200 flex items-center justify-between font-mono text-[11px] text-slate-800">
                      <span className="truncate max-w-[220px] font-semibold">{generatedToken}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(generatedToken)}
                        className="px-2 py-1 text-[#0EA5A0] hover:text-teal-800 flex items-center gap-1 font-sans text-[11px] font-bold rounded hover:bg-teal-50 transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="w-full py-2.5 px-3 bg-[#0EA5A0] hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Enter New Password Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        )}

        {/* ========================================================= */}
        {/* STEP 2: Update Password Form                              */}
        {/* ========================================================= */}
        {showResetForm && !resetSuccess && (
          <form onSubmit={handleResetSubmit} className="space-y-4 animate-in fade-in duration-200" noValidate>
            <div className="space-y-1.5">
              <label 
                htmlFor="reset-token" 
                className="block text-xs font-bold text-slate-700 tracking-wide"
              >
                Verification Token
              </label>
              <div className="relative">
                <input
                  id="reset-token"
                  name="token"
                  type="text"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Paste reset token here"
                  required
                  disabled={isResetting}
                  aria-required="true"
                  className="w-full py-2.5 pl-10 pr-3.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5A0]/20 focus:border-[#0EA5A0] transition-all disabled:opacity-60"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label 
                htmlFor="reset-new-password" 
                className="block text-xs font-bold text-slate-700 tracking-wide"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="reset-new-password"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  disabled={isResetting}
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

            <div className="space-y-1.5">
              <label 
                htmlFor="reset-confirm-password" 
                className="block text-xs font-bold text-slate-700 tracking-wide"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="reset-confirm-password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Re-enter new password"
                  required
                  disabled={isResetting}
                  aria-required="true"
                  className="w-full py-2.5 pl-10 pr-3.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0EA5A0]/20 focus:border-[#0EA5A0] transition-all disabled:opacity-60"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isResetting || !tokenInput || !newPassword || !confirmPassword}
              className="w-full mt-2 py-3 px-4 bg-[#07111F] hover:bg-[#0D1C30] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all active:scale-[0.99] cursor-pointer"
            >
              {isResetting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                  <span>Updating password...</span>
                </>
              ) : (
                <>
                  <span>Confirm New Password</span>
                  <ArrowRight className="w-4 h-4 text-[#0EA5A0]" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowResetForm(false);
                setError(null);
              }}
              className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Back to email request
            </button>
          </form>
        )}

        {/* Back to Sign In Link */}
        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0EA5A0] transition-colors focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Sign In</span>
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
