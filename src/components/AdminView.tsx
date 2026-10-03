import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Globe, 
  Briefcase, 
  Search, 
  Sparkles, 
  Send, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink,
  Code,
  Layers,
  TrendingUp,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scraper' | 'consultant'>('scraper');

  // Scraper State
  const [scrapeUrl, setScrapeUrl] = useState('https://www.aaos.org/quality/research');
  const [scrapePrompt, setScrapePrompt] = useState('Extract post-operative knee extension protocol, flexion milestones, and cryotherapy precautions.');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<any>(null);

  // Consultant State
  const [consultQuery, setConsultQuery] = useState('What are the optimal CPT reimbursement strategies for home physiotherapy under Medicare RTM?');
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultResult, setConsultResult] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

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
      {/* Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Internal Operations & Strategy</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-1">
          Admin Intelligence
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Research web scraper (ScraperAgent) and executive strategic advisory (ConsultantAgent).
        </p>
      </div>

      {/* Mode Tabs */}
      <div className="flex p-1 bg-slate-200/70 rounded-2xl">
        <button
          type="button"
          onClick={() => setActiveTab('scraper')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'scraper'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-teal-600" />
          <span>Research Scraper</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('consultant')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'consultant'
              ? 'bg-white text-teal-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-teal-600" />
          <span>Consultant Advisory</span>
        </button>
      </div>

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
                placeholder="https://example.com/clinical-guidelines"
                required
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Information Extraction Prompt</label>
              <textarea
                value={scrapePrompt}
                onChange={(e) => setScrapePrompt(e.target.value)}
                placeholder="Specify clinical criteria, dosage, or rehab milestones to parse..."
                rows={3}
                required
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={isScraping}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
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

          {/* Scrape Result Output */}
          {scrapeResult && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-800">Scraped Findings</h3>
                <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {scrapeResult.engine}
                </span>
              </div>

              {scrapeResult.data?.key_findings && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Key Synthesized Points:
                  </span>
                  <div className="space-y-1.5">
                    {scrapeResult.data.key_findings.map((f: string, idx: number) => (
                      <div key={idx} className="p-2.5 bg-teal-50/70 border border-teal-100 rounded-xl text-xs text-teal-950 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {scrapeResult.data?.summary && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-1">Executive Summary:</span>
                  {scrapeResult.data.summary}
                </div>
              )}

              {/* Raw JSON Accordion */}
              <details className="text-[11px] text-slate-500 pt-1">
                <summary className="cursor-pointer font-bold hover:text-teal-700">
                  View Raw JSON Payload
                </summary>
                <pre className="mt-2 p-3 bg-slate-900 text-teal-300 rounded-2xl font-mono text-[10px] overflow-x-auto max-h-48">
                  {JSON.stringify(scrapeResult, null, 2)}
                </pre>
              </details>
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
                Google ADK & Perplexity Strategy
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                POST /api/admin/consult
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Business or Market Query</label>
              <textarea
                value={consultQuery}
                onChange={(e) => setConsultQuery(e.target.value)}
                placeholder="Ask about digital musculoskeletal market sizing, RTM codes, or clinical revenue models..."
                rows={3}
                required
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            {/* Quick Consultation Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'CPT 98975 & 98977 RTM Codes',
                'MSK Telerehab Market Sizing',
                'B2B Orthopedic Clinic GTM'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setConsultQuery(chip)}
                  className="text-[10px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium"
                >
                  {chip}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isConsulting}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              {isConsulting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Market Intelligence...</span>
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  <span>Consult with Google ADK</span>
                </>
              )}
            </button>
          </form>

          {/* Strategic Advice Output */}
          {consultResult && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Executive Strategy Brief
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
