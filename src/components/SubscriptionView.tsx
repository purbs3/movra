import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Zap, 
  Crown, 
  Stethoscope, 
  Activity, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Clock,
  RefreshCw,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface SubscriptionViewProps {
  onBack?: () => void;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [currentTier, setCurrentTier] = useState<string>('free');
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);
  const [upgradeSuccess, setUpgradeSuccess] = useState<{
    tier: string;
    message: string;
    txId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.email || user?.id || 'patient@movra.ai';

  // Fetch plans and current user status
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [plansData, statusData] = await Promise.all([
          api.getSubscriptionPlans(),
          api.getSubscriptionStatus(String(userId))
        ]);

        if (isMounted) {
          setPlans(plansData);
          if (statusData && statusData.subscription_tier) {
            setCurrentTier(statusData.subscription_tier);
            setExpiryDate(statusData.subscription_expires_at);
            setDaysRemaining(statusData.days_remaining);
          }
        }
      } catch (err) {
        console.warn('Subscription load notice:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleUpgrade = async (planId: string) => {
    if (isUpgrading || planId === currentTier) return;
    setIsUpgrading(planId);
    setError(null);

    try {
      const res = await api.upgradeSubscription(String(userId), planId);
      if (res && res.status === 'success') {
        setCurrentTier(res.subscription_tier);
        setExpiryDate(res.subscription_expires_at);
        setDaysRemaining(30);
        setUpgradeSuccess({
          tier: planId,
          message: res.message || `Successfully upgraded to ${planId.toUpperCase()}!`,
          txId: res.transaction_id || `tx_${Date.now()}`
        });
      } else {
        setError(res?.detail || 'Upgrade transaction could not be processed.');
      }
    } catch (err: any) {
      setError(err?.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsUpgrading(null);
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Title & Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <Crown className="w-4 h-4 text-emerald-600" />
            <span>Patient Memberships</span>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Done
            </button>
          )}
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          Recovery Plans & Pricing
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upgrade your home physiotherapy with AI Voice guidance, Deepseek local mode, and clinician reports.
        </p>
      </div>

      {/* Current Plan Status Card */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-white rounded-3xl p-5 border border-teal-800/40 shadow-lg shadow-teal-950/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">
                Your Current Tier
              </span>
              <h2 className="text-base font-extrabold text-white capitalize">
                {currentTier === 'pro' 
                  ? 'Pro Recovery AI' 
                  : currentTier === 'clinic' 
                  ? 'Clinic Concierge' 
                  : 'Free Recovery Tier'}
              </h2>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
            currentTier === 'free'
              ? 'bg-slate-800 text-slate-300 border-slate-700'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
          }`}>
            {currentTier === 'free' ? 'Basic Tier' : 'Active Plan'}
          </span>
        </div>

        <div className="pt-2 border-t border-teal-800/40 flex items-center justify-between text-xs text-teal-200/90 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>
              {expiryDate
                ? `Expires in ${daysRemaining || 30} days (${new Date(expiryDate).toLocaleDateString()})`
                : 'Standard Free Tier (No Expiration)'}
            </span>
          </div>

          {currentTier === 'free' && (
            <span className="text-[11px] text-emerald-400 font-bold">
              Upgrade for AI Voice ➔
            </span>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Modal / Banner */}
      {upgradeSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-3xl text-emerald-950 space-y-2 shadow-sm animate-in zoom-in-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-extrabold text-xs text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Subscription Activated!</span>
            </div>
            <button
              onClick={() => setUpgradeSuccess(null)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            {upgradeSuccess.message} You now have access to real-time voice consultations, telemetry analytics, and unlocked protocols.
          </p>
          <div className="p-2 bg-white/80 rounded-xl border border-emerald-200 text-[10px] font-mono text-slate-600 flex items-center justify-between">
            <span>Tx: {upgradeSuccess.txId}</span>
            <span className="font-bold text-emerald-700">Payment Succeeded</span>
          </div>
        </div>
      )}

      {/* Pricing Cards List */}
      <div className="space-y-4">
        {/* CARD 1: Free Tier */}
        <div className={`bg-white rounded-3xl p-5 border transition-all ${
          currentTier === 'free'
            ? 'border-slate-300 shadow-2xs'
            : 'border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
        } space-y-3.5`}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Standard
              </span>
              <h3 className="text-base font-extrabold text-slate-800">Free Recovery</h3>
              <p className="text-[11px] text-slate-500">Essential tools for post-op recovery</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-slate-900">$0</span>
              <span className="text-[10px] text-slate-400 block font-medium">forever</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Daily knee extensions & ankle pumps plan</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Day 1-14 Goniometer angle measurement</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Basic text guidance (5 queries/day)</span>
            </div>
          </div>

          <button
            type="button"
            disabled={currentTier === 'free'}
            className="w-full py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-200 bg-slate-100 text-slate-500 cursor-default"
          >
            {currentTier === 'free' ? 'Current Plan' : 'Free Tier'}
          </button>
        </div>

        {/* CARD 2: Pro Plan (HERO TEAL / EMERALD SCHEME) */}
        <div className={`relative bg-gradient-to-b from-teal-50/90 via-white to-emerald-50/40 rounded-3xl p-5 border-2 ${
          currentTier === 'pro'
            ? 'border-emerald-500 shadow-md shadow-emerald-500/10'
            : 'border-teal-500/80 shadow-lg shadow-teal-500/10'
        } space-y-4`}>
          {/* Most Popular Floating Pill Badge */}
          <div className="absolute -top-3 right-5">
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
              <Crown className="w-3 h-3 text-amber-300" />
              Most Popular
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                Recommended for TKA & ACL
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-1.5">
                Pro Recovery AI
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </h3>
              <p className="text-[11px] text-slate-600">Full clinical intelligence & voice coaching</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-teal-900">$19</span>
              <span className="text-[10px] text-teal-700 block font-semibold">per month</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-teal-100 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span><strong>Interactive AI Voice Physio</strong> (Real-time Whisper + TTS)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span><strong>Private Mode</strong> (Local Deepseek-R1 on device)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span><strong>DuckDB & Pandas</strong> 14-day CSV telemetry charts</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span><strong>Physio Professor</strong> complete rehabilitation guides</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Unlimited Contextual RAG with AAOS protocol citations</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleUpgrade('pro')}
            disabled={currentTier === 'pro' || isUpgrading === 'pro'}
            className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
              currentTier === 'pro'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-teal-600/20'
            }`}
          >
            {isUpgrading === 'pro' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : currentTier === 'pro' ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Your Active Subscription (30 Days)</span>
              </>
            ) : (
              <>
                <span>Upgrade to Pro ($19/mo)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* CARD 3: Clinic Concierge */}
        <div className={`bg-white rounded-3xl p-5 border transition-all ${
          currentTier === 'clinic'
            ? 'border-purple-400 shadow-md'
            : 'border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
        } space-y-3.5`}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                Clinical Supervision
              </span>
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1">
                Clinic Concierge
                <Stethoscope className="w-4 h-4 text-purple-600" />
              </h3>
              <p className="text-[11px] text-slate-500">Human physiotherapist review & RTM billing</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-slate-900">$79</span>
              <span className="text-[10px] text-slate-400 block font-medium">per month</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Everything in Pro Recovery AI</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>1-on-1 Licensed Physical Therapist bi-weekly check-in</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>CMS RTM reimbursement documentation (CPT 98975/98977)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>Direct EHR sync to your surgeon's clinic</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleUpgrade('clinic')}
            disabled={currentTier === 'clinic' || isUpgrading === 'clinic'}
            className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 ${
              currentTier === 'clinic'
                ? 'bg-purple-100 text-purple-800 border border-purple-300 cursor-default'
                : 'bg-purple-700 hover:bg-purple-800 text-white shadow-xs'
            }`}
          >
            {isUpgrading === 'clinic' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : currentTier === 'clinic' ? (
              <span>Active Clinic Plan</span>
            ) : (
              <span>Upgrade to Clinic Concierge ($79/mo)</span>
            )}
          </button>
        </div>
      </div>

      {/* Safety & Compliance Badge */}
      <div className="p-3 bg-slate-100/80 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
        <span>
          Cancel or downgrade anytime. Zero lock-in. HIPAA-aligned encrypted data storage.
        </span>
      </div>
    </div>
  );
};

export default SubscriptionView;
