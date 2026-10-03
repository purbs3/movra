import React from 'react';
import { X, Download, Printer, CheckCircle2, ShieldCheck, Stethoscope } from 'lucide-react';

interface PhysioReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: {
    reference_id: string;
    patient_name: string;
    service: string;
    date: string;
    physiotherapist: string;
    amount: number;
    payment_method: string;
    payment_status: string;
    clinic_address?: string;
  } | null;
}

export const PhysioReceiptModal: React.FC<PhysioReceiptModalProps> = ({
  isOpen,
  onClose,
  receiptData
}) => {
  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black">
              M
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight">MOVRA</span>
                <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider bg-teal-50 px-1.5 py-0.5 rounded">
                  Clinical Care
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Movement & Rehabilitation Care</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Official Receipt No:</span>
            <span className="font-mono font-bold text-slate-800">{receiptData.reference_id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Date of Service:</span>
            <span className="font-bold text-slate-800">{receiptData.date}</span>
          </div>

          <div className="h-px bg-slate-200 my-1" />

          <div className="space-y-2">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Patient Name</span>
              <span className="font-bold text-slate-800 text-sm">{receiptData.patient_name}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Service Delivered</span>
              <span className="font-medium text-slate-700">{receiptData.service}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Attending Physiotherapist</span>
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                {receiptData.physiotherapist || 'Dr. Ananya Iyer, PT'}
              </span>
            </div>
          </div>

          <div className="h-px bg-slate-200 my-1" />

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Payment Method:</span>
            <span className="font-bold text-slate-700">{receiptData.payment_method}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="font-extrabold text-slate-800">Total Consultation Fee:</span>
            <span className="font-extrabold text-teal-700 text-base">₹{receiptData.amount}</span>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-slate-500 text-[11px]">Payment Status:</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {receiptData.payment_status}
            </span>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-[11px] text-teal-900 leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <span>
            MOVRA Home Visit Physiotherapy record. Verified treatment session administered by licensed rehabilitation practitioner.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
