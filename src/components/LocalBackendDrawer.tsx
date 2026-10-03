import React, { useState } from 'react';
import { X, Terminal, Check, Copy, ExternalLink, Activity, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

// ⭐ YAHAN APNA ASLI RENDER URL DAALEIN (Aakhir mein /api zaroori hai)
const BACKEND_URL = "https://movra-backend.onrender.com/api";

interface LocalBackendDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  onRefresh: () => void;
}

export const LocalBackendDrawer: React.FC<LocalBackendDrawerProps> = ({
  isOpen,
  onClose,
  isOnline,
  onRefresh,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleTestPing = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      // Yahan BACKEND_URL use ho raha hai
      const res = await fetch(`${BACKEND_URL}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      const data = await res.json();
      setTestResult(JSON.stringify(data, null, 2));
      onRefresh();
    } catch (err: any) {
      setTestResult(
        `Could not connect to ${BACKEND_URL}/health.\nMake sure your Render backend is awake and running.\n(Error: ${err.message || 'Connection Refused'})`
      );
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-600 text-white rounded-xl">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Local FastAPI Backend Bridge</h3>
              <p className="text-xs text-slate-500">Drop your AI agents into Python & run locally</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Status Banner */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isOnline
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <div>
                <div className="font-semibold text-xs">
                  {isOnline ? 'FastAPI Connected' : 'Backend Standby (Render Free Tier)'}
                </div>
                <div className="text-[11px] opacity-80 font-mono">
                  {BACKEND_URL}
                </div>
              </div>
            </div>
            <button
              onClick={handleTestPing}
              disabled={isTesting}
              className="px-3 py-1.5 bg-white text-xs font-semibold rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              {isTesting ? 'Pinging...' : 'Ping Test'}
            </button>
          </div>

          {testResult && (
            <div className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre">
              {testResult}
            </div>
          )}

          {/* Quick Terminal Command */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              1. Configure .env & Run Backend Locally
            </div>
            <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs relative group">
              <pre className="overflow-x-auto">
{`cd backend
# Edit .env with your CONTEXTUAL_API_KEY & CONTEXTUAL_AGENT_ID
pip install -r requirements.txt
uvicorn main:app --reload --port 8000`}
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(
                    "cd backend\npip install -r requirements.txt\nuvicorn main:app --reload --port 8000",
                    1
                  )
                }
                className="absolute top-2.5 right-2.5 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="Copy commands"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Contextual AI Environment Variables */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              2. Contextual AI Configuration (.env)
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs space-y-1 text-slate-700">
              <div><span className="text-teal-700 font-bold">CONTEXTUAL_API_KEY</span>=your_key</div>
              <div><span className="text-teal-700 font-bold">CONTEXTUAL_BASE_URL</span>=https://api.contextual.ai/v1</div>
              <div><span className="text-teal-700 font-bold">CONTEXTUAL_AGENT_ID</span>=your_agent_id</div>
            </div>
          </div>

          {/* Drop-in Guide */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              3. Converted Clinical AI Agents
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-800 text-xs font-mono">
                    backend/agents/rag_agent.py
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-medium">
                    POST /api/chat
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Contextual AI RAG Agent converted from Streamlit into <code className="bg-white px-1 py-0.5 rounded text-teal-800 border">RAGAgent.process_query()</code>. Retrieves medical knowledge with post-processing.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-800 text-xs font-mono">
                    backend/agents/memory_agent.py
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-medium">
                    Mem0 + Qdrant
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Patient memory layer (<code className="bg-white px-1 py-0.5 rounded text-purple-800 border">MemoryAgent</code>) connected to Qdrant. Retains tolerances, pain limits, and past queries.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-800 text-xs font-mono">
                    backend/agents/physio_agent.py
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium">
                    Agno + Gemini
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Multi-agent clinical engine (<code className="bg-white px-1 py-0.5 rounded text-emerald-800 border">PhysioAgent</code>) combining Physiotherapy Exercise Expert and Recovery Diet Expert.
                </p>
              </div>
            </div>
          </div>

          {/* Automatic Bridge Info */}
          <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-xl text-xs text-teal-900 leading-relaxed">
            <strong>Seamless Integration:</strong> The frontend makes real fetch calls to your deployed Render backend.
            Your custom agents will instantly power this exact UI!
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <a
            href={`${BACKEND_URL}/docs`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1"
          >
            <span>Open FastAPI Swagger Docs</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium hover:bg-slate-800"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
