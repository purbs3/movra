import React from 'react';
import { Home, MessageSquare, TrendingUp, BookOpen, ShieldAlert, User, Stethoscope, Bell } from 'lucide-react';

// TabType mein naye tabs add kiye hain (physio ke liye)
export type TabType = 'dashboard' | 'chat' | 'progress' | 'learn' | 'admin' | 'profile' | 'physio-dashboard' | 'physio-alerts';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  memoryEnabled: boolean;
  role?: string; // Optional prop, agar parent component se pass karna chahein
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  memoryEnabled,
  role = (typeof window !== 'undefined' ? localStorage.getItem('role') : 'patient') || 'patient',
}) => {
  
  // 1. Saare possible tabs ki master list (with roles allowed to see them)
  const allTabs = [
    { 
      id: 'dashboard' as TabType, 
      label: 'Home', 
      icon: Home, 
      roles: ['patient'] 
    },
    { 
      id: 'chat' as TabType, 
      label: 'AI Physio', 
      icon: MessageSquare, 
      roles: ['patient'], 
      badge: memoryEnabled ? 'Memory' : undefined 
    },
    { 
      id: 'progress' as TabType, 
      label: 'Progress', 
      icon: TrendingUp, 
      roles: ['patient', 'physiotherapist'] 
    },
    { 
      id: 'learn' as TabType, 
      label: 'Learn', 
      icon: BookOpen, 
      roles: ['patient'] 
    },
    { 
      id: 'admin' as TabType, 
      label: 'Admin', 
      icon: ShieldAlert, 
      roles: ['admin'] 
    },
    // Physiotherapist ke liye specific tabs
    { 
      id: 'physio-dashboard' as TabType, 
      label: 'Caseload', 
      icon: Stethoscope, 
      roles: ['physiotherapist'] 
    },
    { 
      id: 'physio-alerts' as TabType, 
      label: 'Alerts', 
      icon: Bell, 
      roles: ['physiotherapist'] 
    },
    { 
      id: 'profile' as TabType, 
      label: 'Profile', 
      icon: User, 
      roles: ['patient', 'physiotherapist', 'admin'] 
    },
  ];

  // 2. Role ke hisaab se tabs filter karein
  const filteredTabs = allTabs.filter(tab => tab.roles.includes(role));

  // Agar kisi wajah se filteredTabs khali ho jaye, toh fallback (safety ke liye)
  const displayTabs = filteredTabs.length > 0 ? filteredTabs : allTabs.filter(t => t.roles.includes('patient'));

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        {displayTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as TabType)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 sm:px-3 rounded-xl transition-all duration-200 min-w-[56px] sm:min-w-[64px] ${
                isActive
                  ? 'text-teal-700 font-semibold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`relative p-1.5 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-teal-50 text-teal-700 shadow-2xs' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-teal-600 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
