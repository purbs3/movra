import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Phone, 
  MessageCircle, 
  User, 
  CheckCheck, 
  Sparkles, 
  ShieldCheck, 
  Clock,
  ChevronRight
} from 'lucide-react';

interface PhysioPatientMessagesViewProps {
  onViewPatient?: (patientId: string) => void;
}

export const PhysioPatientMessagesView: React.FC<PhysioPatientMessagesViewProps> = ({
  onViewPatient
}) => {
  const [activePatientId, setActivePatientId] = useState('rahul_123');
  const [newMessage, setNewMessage] = useState('');

  const patientThreads = [
    {
      id: 'rahul_123',
      name: 'Rahul Sharma',
      condition: 'Right TKA (Post-Op Day 14)',
      phone: '+91 98201 44829',
      unread: 0,
      lastMessage: 'Thank you doctor, the cryotherapy elevation helped immensely.',
      lastTime: '10:15 AM'
    },
    {
      id: 'patient_anand_71',
      name: 'Anand Verma',
      condition: 'Bilateral Hip Arthroplasty',
      phone: '+91 98451 90812',
      unread: 1,
      lastMessage: 'Felt slight tightness after the 3rd set of heel slides.',
      lastTime: 'Yesterday'
    },
    {
      id: 'patient_sunita_58',
      name: 'Sunita Patel',
      condition: 'Left ACL Reconstruction',
      phone: '+91 98112 33456',
      unread: 0,
      lastMessage: 'Single cane transition going well today.',
      lastTime: '09 Oct'
    }
  ];

  const [conversations, setConversations] = useState<{ [key: string]: any[] }>({
    rahul_123: [
      {
        id: 1,
        sender: 'patient',
        text: 'Good morning Dr. Ananya. Is it normal to feel a gentle pull behind my knee when doing the towel stretch?',
        time: '09:20 AM'
      },
      {
        id: 2,
        sender: 'therapist',
        text: 'Good morning Rahul. Yes, a mild stretch sensation in the hamstring/gastrocnemius tendon is completely expected as we clear the -3° extension lag. Ensure you do not bounce; maintain a steady 5-second hold.',
        time: '09:35 AM'
      },
      {
        id: 3,
        sender: 'patient',
        text: 'Thank you doctor, the cryotherapy elevation helped immensely.',
        time: '10:15 AM'
      }
    ],
    patient_anand_71: [
      {
        id: 1,
        sender: 'patient',
        text: 'Felt slight tightness after the 3rd set of heel slides.',
        time: 'Yesterday 06:40 PM'
      }
    ],
    patient_sunita_58: [
      {
        id: 1,
        sender: 'patient',
        text: 'Single cane transition going well today. Did 15 mins without fatigue.',
        time: '09 Oct 04:12 PM'
      },
      {
        id: 2,
        sender: 'therapist',
        text: 'Outstanding progress Sunita. Continue keeping weight centered over your heel strike.',
        time: '09 Oct 05:00 PM'
      }
    ]
  });

  const activePatient = patientThreads.find(p => p.id === activePatientId) || patientThreads[0];
  const activeMessages = conversations[activePatientId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: 'therapist',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => ({
      ...prev,
      [activePatientId]: [...(prev[activePatientId] || []), msg]
    }));
    setNewMessage('');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-700" />
            <span>Direct Patient Communication</span>
          </h2>
          <p className="text-xs text-slate-500">
            Therapist-verified messaging, direct phone calls, and WhatsApp integration
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Patient Conversations List */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 block px-1">Active Patient Chats</span>
          <div className="space-y-1.5">
            {patientThreads.map((pt) => {
              const isActive = pt.id === activePatientId;
              return (
                <div
                  key={pt.id}
                  onClick={() => setActivePatientId(pt.id)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                    isActive
                      ? 'bg-teal-50/80 border-teal-300 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-xs text-slate-800">{pt.name}</h4>
                    <span className="text-[10px] text-slate-400">{pt.lastTime}</span>
                  </div>
                  <p className="text-[11px] text-teal-700 font-medium truncate">{pt.condition}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-1">{pt.lastMessage}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col h-[520px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 font-extrabold flex items-center justify-center text-sm border border-teal-200">
                {activePatient.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{activePatient.name}</h3>
                <p className="text-[11px] text-teal-700 font-semibold">{activePatient.condition}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${activePatient.phone}`}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                title="Call Patient"
              >
                <Phone className="w-4 h-4 text-teal-600" />
              </a>

              <a
                href={`https://wa.me/${activePatient.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(activePatient.name)}%2C%20this%20is%20Dr.%20Ananya%20from%20MOVRA%20Physiotherapy.`}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl transition-colors"
                title="WhatsApp Patient"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </a>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {activeMessages.map((msg) => {
              const isTherapist = msg.sender === 'therapist';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isTherapist ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1 ${
                      isTherapist
                        ? 'bg-teal-700 text-white rounded-tr-none shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-75">
                      <span className="font-bold">{isTherapist ? 'Dr. Ananya (PT)' : activePatient.name}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Safety Notice */}
          <div className="px-4 py-1.5 bg-teal-50/60 border-t border-teal-100 text-[10px] text-teal-900 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span>All clinical advice sent directly from licensed physiotherapist terminal.</span>
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type clinical advice or follow-up note to patient..."
              className="flex-1 py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500/20 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
