import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  Sparkles,
  Share2,
  ChevronRight
} from 'lucide-react';

interface PhysioReportsViewProps {
  patientName?: string;
  patientId?: string;
}

export const PhysioReportsView: React.FC<PhysioReportsViewProps> = ({
  patientName = 'Rahul Sharma',
  patientId = 'rahul_123'
}) => {
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const reportTypes = [
    {
      id: 'rep-progress',
      title: 'Patient Longitudinal Progress Report',
      type: 'Progress Telemetry & Goniometry',
      date: '12 Oct 2026',
      description: 'Comprehensive 14-day joint angle recovery curve, VAS pain trajectory, and gait adherence analysis.',
      pages: '3 Pages'
    },
    {
      id: 'rep-assessment',
      title: 'Initial Clinical Assessment Report',
      type: 'Comprehensive Baseline',
      date: '19 Sep 2026',
      description: 'Baseline post-op documentation including MMT motor grading, ROM deficits, and formal rehabilitation milestones.',
      pages: '2 Pages'
    },
    {
      id: 'rep-soap',
      title: 'SOAP Clinical Documentation Summary',
      type: 'Subjective/Objective Care Logs',
      date: '12 Oct 2026',
      description: 'Full chronological clinical encounter records for referring orthopedic surgeon audit and patient records.',
      pages: '4 Pages'
    },
    {
      id: 'rep-hep',
      title: 'Home Exercise Program (HEP) Dossier',
      type: 'Patient Instruction Protocol',
      date: '12 Oct 2026',
      description: 'Prescribed activities with photographic cues, repetition counts, precautions, and cryotherapy schedules.',
      pages: '2 Pages'
    },
    {
      id: 'rep-visit',
      title: 'Home Visit Encounter Summary',
      type: 'Session Documentation',
      date: '12 Oct 2026',
      description: 'Day 14 in-person treatment summary: cryotherapy, patellar glides, and active-assisted heel slides.',
      pages: '1 Page'
    },
    {
      id: 'rep-discharge',
      title: 'Rehabilitation Discharge Summary (Draft)',
      type: 'Care Transition Plan',
      date: 'Projected: 15 Nov 2026',
      description: 'Long-term maintenance strategy, outcome measure delta, and unassisted community ambulation clearance.',
      pages: '2 Pages'
    }
  ];

  const handleGenerate = (repId: string) => {
    setIsGenerating(repId);
    setTimeout(() => {
      setIsGenerating(null);
      setSuccessNotice('Report compiled with verified clinician signature and ready for download.');
      setTimeout(() => setSuccessNotice(null), 4000);
    }, 1000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-2">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-700" />
          <span>Clinical Reports & Documentation Center</span>
        </h2>
        <p className="text-xs text-slate-500">
          Generate, audit, and export verified medical records for referring physicians, patients, and insurers.
        </p>

        {successNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {reportTypes.map((rep) => {
          const isCompiling = isGenerating === rep.id;

          return (
            <div
              key={rep.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3 hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded-md">
                    {rep.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{rep.pages}</span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900">{rep.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{rep.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Date: {rep.date}</span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedReport(rep)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                    title="Preview Report"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => handleGenerate(rep.id)}
                    disabled={isCompiling}
                    className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                  >
                    <Download className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
                    <span>{isCompiling ? 'Compiling...' : 'PDF'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* REPORT PREVIEW MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-100 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center">
                  M
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{selectedReport.title}</h3>
                  <p className="text-[11px] text-slate-500">MOVRA Clinical Documentation</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Document Header Preview */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Patient: <strong>{patientName}</strong></span>
                <span>MRN / ID: <strong>{patientId}</strong></span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Diagnosis: <strong>Right TKA (Post-Op Day 14)</strong></span>
                <span>Attending: <strong>Dr. Ananya Iyer, PT</strong></span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedReport.description}
            </p>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Electronically signed & verified under licensed rehabilitation clinical protocols.</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>

              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
