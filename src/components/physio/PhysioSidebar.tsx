import React, { useState } from 'react';
import { 
  Home, 
  Inbox, 
  Calendar, 
  Compass, 
  Users, 
  FileText, 
  Dumbbell, 
  TrendingUp, 
  MessageSquare, 
  Receipt, 
  CreditCard, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  User, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  Activity, 
  Video, 
  Target, 
  Stethoscope,
  X,
  Menu
} from 'lucide-react';

interface PhysioSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  unreadRequestsCount?: number;
  unreadNotificationsCount?: number;
}

export const PhysioSidebar: React.FC<PhysioSidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  unreadRequestsCount = 3,
  unreadNotificationsCount = 2
}) => {
  const [isClinicalExpanded, setIsClinicalExpanded] = useState(true);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'requests', label: 'Booking Requests', icon: Inbox, badge: unreadRequestsCount },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'visits', label: 'Home Visits & Routes', icon: Compass },
    { id: 'patients', label: 'Patient Directory', icon: Users },
  ];

  const clinicalSubItems = [
    { id: 'clinical-assessment', label: 'Initial Assessment', icon: FileText },
    { id: 'clinical-soap', label: 'SOAP & AI Assistant', icon: Activity },
    { id: 'movement-analysis', label: 'Movement Analysis', icon: Video },
    { id: 'goals', label: 'Goals Management', icon: Target },
  ];

  const operationalNavItems = [
    { id: 'home-program', label: 'Home Programs & Library', icon: Dumbbell },
    { id: 'progress', label: 'Progress Tracking', icon: TrendingUp },
    { id: 'messages', label: 'Patient Messages', icon: MessageSquare },
    { id: 'reports', label: 'Clinical Reports', icon: Receipt },
    { id: 'earnings', label: 'Earnings & Invoices', icon: CreditCard },
    { id: 'follow-ups', label: 'Follow-Up Watchlist', icon: AlertTriangle },
    { id: 'service-area', label: 'Service Coverage', icon: MapPin },
    { id: 'availability', label: 'Availability Schedule', icon: Clock },
    { id: 'profile', label: 'Physio Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col h-full shadow-2xs select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-600 text-white font-black flex items-center justify-center shadow-xs">
            M
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-slate-900 tracking-tight">MOVRA</span>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60 uppercase">
                Clinician
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Rehabilitation Care</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 text-xs">
        {/* Main Section */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
            Care Operations
          </span>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl font-bold transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white text-teal-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Clinical Workspace Accordion */}
        <div className="space-y-1">
          <button
            onClick={() => setIsClinicalExpanded(!isClinicalExpanded)}
            className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 hover:text-slate-600"
          >
            <span>Clinical Workspace</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isClinicalExpanded ? '' : '-rotate-90'}`} />
          </button>

          {isClinicalExpanded && (
            <div className="space-y-1 pl-1">
              {clinicalSubItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold transition-all text-xs ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tools & Management */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
            Practice Management
          </span>
          {operationalNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl font-bold transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors border border-rose-200/60"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Clinician Portal</span>
        </button>
      </div>
    </aside>
  );
};
