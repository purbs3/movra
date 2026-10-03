import React, { useState } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Receipt, 
  Filter, 
  Search,
  ArrowUpRight
} from 'lucide-react';
import { ClinicalTransaction } from '../../types';

interface PhysioEarningsViewProps {
  onOpenReceipt: (transaction: any) => void;
}

export const PhysioEarningsView: React.FC<PhysioEarningsViewProps> = ({
  onOpenReceipt
}) => {
  const [filterMethod, setFilterMethod] = useState<'ALL' | 'UPI' | 'Cash' | 'Online'>('ALL');

  const summary = {
    today: 1500,
    this_week: 8250,
    this_month: 34500,
    pending: 750,
    total_sessions: 46
  };

  const transactions: ClinicalTransaction[] = [
    { id: 1, date: '12 Oct 2026', patient: 'Rahul Sharma', service: 'Home Visit Physiotherapy', amount: 750, method: 'UPI', status: 'PAID' },
    { id: 2, date: '12 Oct 2026', patient: 'Amit Kumar', service: 'Home Visit Physiotherapy', amount: 750, method: 'Cash', status: 'PAID' },
    { id: 3, date: '11 Oct 2026', patient: 'Sunita Patel', service: 'Home Visit Physiotherapy', amount: 750, method: 'UPI', status: 'PAID' },
    { id: 4, date: '10 Oct 2026', patient: 'Anand Verma', service: 'Milestone Evaluation', amount: 750, method: 'Online', status: 'PENDING' },
    { id: 5, date: '09 Oct 2026', patient: 'Priya Mukherjee', service: 'Pediatric Rehabilitation', amount: 750, method: 'UPI', status: 'PAID' },
    { id: 6, date: '08 Oct 2026', patient: 'Rahul Sharma', service: 'Cryotherapy & Mobilization', amount: 750, method: 'UPI', status: 'PAID' }
  ];

  const filteredTransactions = transactions.filter((t) => {
    if (filterMethod === 'ALL') return true;
    return t.method === filterMethod;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Today's Revenue</span>
          <div className="text-xl font-extrabold text-teal-800">₹{summary.today}</div>
          <span className="text-[10px] text-teal-600 font-medium">2 Consultations</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">This Week</span>
          <div className="text-xl font-extrabold text-slate-800">₹{summary.this_week}</div>
          <span className="text-[10px] text-slate-500 font-medium">11 Home Visits</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">This Month</span>
          <div className="text-xl font-extrabold text-slate-800">₹{summary.this_month}</div>
          <span className="text-[10px] text-emerald-600 font-medium">46 Completed Visits</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pending Clearance</span>
          <div className="text-xl font-extrabold text-amber-600">₹{summary.pending}</div>
          <span className="text-[10px] text-amber-700 font-medium">1 Invoice Pending</span>
        </div>
      </div>

      {/* Transactions Ledger */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-700" />
              <span>Consultation Transactions Ledger</span>
            </h3>
            <p className="text-xs text-slate-500">Official billing and receipt records for home visit services</p>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['ALL', 'UPI', 'Cash', 'Online'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setFilterMethod(method)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  filterMethod === method
                    ? 'bg-white text-teal-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="space-y-2.5">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-teal-200 transition-all flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center font-bold text-teal-800 shrink-0">
                  ₹
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">{tx.patient}</h4>
                  <p className="text-[11px] text-slate-500">{tx.service} · {tx.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-extrabold text-slate-900">₹{tx.amount}</div>
                  <span className="text-[10px] text-slate-400">{tx.method}</span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tx.status === 'PAID'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {tx.status}
                </span>

                <button
                  onClick={() => onOpenReceipt({
                    reference_id: `REC-2026-${Number(tx.id) + 1040}`,
                    patient_name: tx.patient,
                    service: tx.service,
                    date: tx.date,
                    physiotherapist: 'Dr. Ananya Iyer, PT',
                    amount: tx.amount,
                    payment_method: tx.method,
                    payment_status: tx.status
                  })}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition-colors"
                  title="View Receipt"
                >
                  <Receipt className="w-3.5 h-3.5 text-teal-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
