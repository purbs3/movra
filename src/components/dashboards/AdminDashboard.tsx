import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  LogOut, 
  Globe, 
  Briefcase, 
  Send, 
  RefreshCw, 
  Check, 
  Copy, 
  Users, 
  Server, 
  Database,
  Activity,
  Layers,
  Sparkles,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface AdminDashboardProps {
  onLogout: () => void;
  activeTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  activeTab: externalTab = 'admin_overview' 
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'scraper' | 'consultant' | 'overview' | 'bookings'>('overview');
  const [adminBookings, setAdminBookings] = useState<any[]>([]);

  useEffect(() => {
    if (externalTab === 'scraper') {
      setActiveTab('scraper');
    } else if (externalTab === 'consultant') {
      setActiveTab('consultant');
    } else if (externalTab === 'bookings') {
      setActiveTab('bookings');
    } else {
      setActiveTab('overview');
    }
  }, [externalTab]);

  useEffect(() => {
    api.getAllBookings().then((list) => {
      if (list) setAdminBookings(list);
    });
  }, []);

  const handleUpdateStatus = async (id: number | string, newStatus: string) => {
    await api.updateBookingStatus(id, newStatus);
    setAdminBookings(prev => prev.map(b => (b.id === id || b.reference_id === id) ? { ...b, status: newStatus } : b));
  };

  // Scraper State
  const [scrapeUrl, setScrapeUrl] = useState('https://www.aaos.org/quality/research');
  const [scrapePrompt, setScrapePrompt] = useState('Extract post-operative knee extension protocol and cryotherapy precautions.');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<any>(null);

  // Consultant State
  const [consultQuery, setConsultQuery] = useState('What are the optimal CPT reimbursement strategies for home physiotherapy under Medicare RTM?');
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultResult, setConsultResult] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleLogoutClick = () => {
    logout();
    onLogout();
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeUrl.trim() || !scrapePrompt.trim() || isScraping) return;
    setIsScraping(true);
    try {
      const res = await api.scrapeWebsite(scrapeUrl.trim(), scrapePrompt.trim());
      setScrapeResult(res);
    } catch (err) {
      console.warn('Scrape error:', err);
    } finally {
      setIsScraping(false);
    }
  };

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultQuery.trim() || isConsulting) return;
    setIsConsulting(true);
    try {
      const res = await api.getConsultantAdvice(consultQuery.trim());
      setConsultResult(res.advice);
    } catch (err) {
      console.warn('Consult error:', err);
    } finally {
      setIsConsulting(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-slate-900 text-white rounded-3xl p-5 shadow-lg shadow-purple-950/20 border border-purple-700/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                System Administration
              </span>
              <h1 className="text-lg font-extrabold text-white tracking-tight">
                Welcome, {user?.full_name || 'Admin'}
              </h1>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-white/10"
            title="Log out of Admin session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        <p className="text-xs text-purple-100/90 leading-relaxed">
          Full system authority: execute automated clinical web scraping (ScraperAgent) and consult market strategy (ConsultantAgent).
        </p>

        {/* System Telemetry Chips */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-purple-700/40 text-center">
          <div className="bg-purple-950/50 p-2 rounded-xl border border-purple-600/30">
            <span className="text-[10px] text-purple-300 block font-medium">Access Tier</span>
            <span className="text-xs font-extrabold text-emerald-400 uppercase">SUPERADMIN</span>
          </div>
          <div className="bg-purple-950/50 p-2 rounded-xl border border-purple-600/30">
            <span className="text-[10px] text-purple-300 block font-medium">Database</span>
            <span className="text-xs font-extrabold text-white">SQLite Active</span>
          </div>
          <div className="bg-purple-950/50 p-2 rounded-xl border border-purple-600/30">
            <span className="text-[10px] text-purple-300 block font-medium">RBAC Status</span>
            <span className="text-xs font-extrabold text-purple-200">Enforced</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-200/70 rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
            activeTab === 'overview'
              ? 'bg-white text-purple-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-600" />
          <span>Overview</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
            activeTab === 'bookings'
              ? 'bg-white text-purple-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-purple-600" />
          <span>Visits ({adminBookings.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('scraper')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
            activeTab === 'scraper'
              ? 'bg-white text-purple-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-purple-600" />
          <span>Scraper</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('consultant')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
            activeTab === 'consultant'
              ? 'bg-white text-purple-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-purple-600" />
          <span>Consultant</span>
        </button>
      </div>

      {/* BOOKINGS MANAGEMENT TAB */}
      {activeTab === 'bookings' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-800">Home Visit Booking Requests</h3>
            <span className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold border border-purple-200">
              {adminBookings.length} Requests
            </span>
          </div>

          <div className="space-y-3">
            {adminBookings.map((b) => (
              <div
                key={b.id || b.reference_id}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                      {b.name} ({b.age}y)
                    </h4>
                    <p className="text-[11px] text-purple-800 font-semibold">{b.service || 'Home Visit'}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Ref: {b.reference_id}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    b.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : b.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-700">
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="font-bold">{b.preferred_date}</span>
                    <span>•</span>
                    <span>{b.preferred_time}</span>
                  </div>
                  <div className="text-[11px] truncate">📍 {b.location}</div>
                  <div className="text-[11px]"><strong>Concern:</strong> {b.condition}</div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <a
                    href={`tel:${b.phone}`}
                    className="text-purple-700 hover:text-purple-900 font-bold text-[11px]"
                  >
                    📞 {b.phone}
                  </a>

                  <div className="flex items-center gap-1.5">
                    {b.status !== 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id || b.reference_id, 'CONFIRMED')}
                        className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-2xs"
                      >
                        Confirm
                      </button>
                    )}
                    {b.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleUpdateStatus(b.id || b.reference_id, 'CANCELLED')}
                        className="py-1 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4 animate-in fade-in">
          <h3 className="font-extrabold text-sm text-slate-800">Admin Control Center</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Monitor platform subscriptions, review clinical protocols, and test AI agents in real-time.
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-purple-950">Active Subscription Plans</span>
              <span className="font-bold text-purple-700">3 Tiers (Free, Pro, Clinic)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800">Registered Agents</span>
              <span className="font-bold text-slate-700">9 AI Agents Operational</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: ScraperAgent */}
      {activeTab === 'scraper' && (
        <div className="space-y-4 animate-in fade-in">
          <form onSubmit={handleScrape} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                ScrapeGraphAI Target
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                POST /api/admin/scrape
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Target Website URL</label>
              <input
                type="url"
                value={scrapeUrl}
                onChange={(e) => setScrapeUrl(e.target.value)}
                required
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Extraction Prompt</label>
              <textarea
                value={scrapePrompt}
                onChange={(e) => setScrapePrompt(e.target.value)}
                rows={3}
                required
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isScraping}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              {isScraping ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scraping with ScrapeGraphAI...</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Execute Web Scraper</span>
                </>
              )}
            </button>
          </form>

          {scrapeResult && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-800">Scraped Findings</h3>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {scrapeResult.engine}
                </span>
              </div>

              {scrapeResult.data?.key_findings && (
                <div className="space-y-1.5">
                  {scrapeResult.data.key_findings.map((f: string, idx: number) => (
                    <div key={idx} className="p-2.5 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-950 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {scrapeResult.data?.summary && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-1">Executive Summary:</span>
                  {scrapeResult.data.summary}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ConsultantAgent */}
      {activeTab === 'consultant' && (
        <div className="space-y-4 animate-in fade-in">
          <form onSubmit={handleConsult} className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Google ADK Market Strategy
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                POST /api/admin/consult
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Strategic Question</label>
              <textarea
                value={consultQuery}
                onChange={(e) => setConsultQuery(e.target.value)}
                rows={3}
                required
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isConsulting}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              {isConsulting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Strategy...</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  <span>Consult with Google ADK</span>
                </>
              )}
            </button>
          </form>

          {consultResult && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Executive Strategic Advisory
                </span>
                <button
                  onClick={() => handleCopy(consultResult)}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 p-1"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="prose prose-sm max-w-none text-slate-700 text-xs leading-relaxed space-y-2 whitespace-pre-line">
                {consultResult}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
