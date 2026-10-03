import React from 'react';
import { X, Bell, Calendar, CheckCircle2, Clock, AlertTriangle, MessageCircle, CreditCard, ChevronRight } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'booking' | 'visit' | 'message' | 'follow_up' | 'payment';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface PhysioNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction?: (tab: string) => void;
}

export const PhysioNotificationsModal: React.FC<PhysioNotificationsModalProps> = ({
  isOpen,
  onClose,
  onSelectAction
}) => {
  if (!isOpen) return null;

  const notifications: NotificationItem[] = [
    {
      id: 'n-1',
      type: 'booking',
      title: 'New Home Visit Request',
      description: 'Rahul Sharma submitted a request for Right Knee Replacement (TKA) in Kankarbagh.',
      time: '10 mins ago',
      read: false
    },
    {
      id: 'n-2',
      type: 'visit',
      title: 'Upcoming Visit in 30 Mins',
      description: 'Home Visit with Amit Kumar (Lower Back Pain) at Boring Road scheduled for 12:00 PM.',
      time: '35 mins ago',
      read: false
    },
    {
      id: 'n-3',
      type: 'follow_up',
      title: 'Milestone Review Due',
      description: 'Anand Verma requires Post-Op Day 10 discomfort review today.',
      time: '2 hours ago',
      read: true
    },
    {
      id: 'n-4',
      type: 'payment',
      title: 'Payment Received: ₹750',
      description: 'UPI transaction confirmed for Visit Ref #APT-1001 (Rahul Sharma).',
      time: 'Yesterday',
      read: true
    },
    {
      id: 'n-5',
      type: 'message',
      title: 'Patient Inquiry',
      description: 'Sunita Patel: "Should I continue the cold pack after evening heel slides?"',
      time: 'Yesterday',
      read: true
    }
  ];

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-teal-600" />;
      case 'visit':
        return <Clock className="w-4 h-4 text-sky-600" />;
      case 'follow_up':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-100 shadow-2xl relative max-h-[85vh] flex flex-col space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Clinical Notifications</h3>
              <p className="text-[11px] text-slate-400">Home visit alerts and patient updates</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (onSelectAction) {
                  if (n.type === 'booking') onSelectAction('requests');
                  else if (n.type === 'visit') onSelectAction('visits');
                  else if (n.type === 'follow_up') onSelectAction('follow-ups');
                  else if (n.type === 'payment') onSelectAction('earnings');
                  else if (n.type === 'message') onSelectAction('messages');
                  onClose();
                }
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                !n.read
                  ? 'bg-teal-50/40 border-teal-200/80 shadow-2xs hover:bg-teal-50'
                  : 'bg-white border-slate-200/70 hover:border-slate-300'
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                  {n.description}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 self-center" />
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 text-[11px]">All clinical updates verified</span>
          <button
            onClick={onClose}
            className="text-teal-700 font-bold hover:underline text-xs"
          >
            Mark all read
          </button>
        </div>
      </div>
    </div>
  );
};
