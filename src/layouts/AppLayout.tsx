import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Sparkles, 
  LogOut, 
  User as UserIcon, 
  ShieldAlert, 
  Stethoscope, 
  Users, 
  Home,
  Sliders,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BottomNav, TabType } from '../components/BottomNav';
import { BackendStatusBadge } from '../components/BackendStatusBadge';
import { LocalBackendDrawer } from '../components/LocalBackendDrawer';
import { VoiceModal } from '../components/VoiceModal';

interface AppLayoutProps {
  memoryEnabled?: boolean;
  isBackendOnline?: boolean;
  onRefreshBackend?: () => void;
  onNewVoiceMessage?: (msg: any) => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  memoryEnabled = true,
  isBackendOnline = false,
  onRefreshBackend = () => {},
  onNewVoiceMessage = () => {}
}) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isDevDrawerOpen, setIsDevDrawerOpen] = useState(false);

  // Map current route to TabType for BottomNav active highlighting
  const getCurrentTab = (): TabType => {
    const path = location.pathname;
    if (path.includes('/chat')) return 'chat';
    if (path.includes('/progress')) return 'progress';
    if (path.includes('/learn')) return 'learn';
    if (path.includes('/admin')) return 'admin';
    if (path.includes('/profile')) return 'profile';
    if (path.includes('/physio-dashboard') || path.includes('/physio')) return 'physio-dashboard';
    if (path.includes('/subscription')) return 'subscription';
    return 'dashboard';
  };

  const handleTabChange = (tab: TabType) => {
    switch (tab) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'chat':
        navigate('/chat');
        break;
      case 'progress':
        navigate('/progress');
        break;
      case 'learn':
        navigate('/learn');
        break;
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'physio-dashboard':
      case 'physio-alerts':
        navigate('/physio-dashboard');
        break;
      case 'subscription':
        navigate('/subscription');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Application Header for Authenticated Workspace */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 group text-left cursor-pointer"
              title="Return to Public Home"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <Activity className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-slate-900 tracking-tight leading-none block">
                  MOVRA
                </span>
                <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block">
                  Clinical Workspace
                </span>
              </div>
            </button>

            {/* Role indicator pill */}
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider hidden sm:inline-flex items-center gap-1 ${
              role === 'admin' 
                ? 'bg-purple-50 text-purple-800 border-purple-200' 
                : role === 'physiotherapist'
                ? 'bg-sky-50 text-sky-800 border-sky-200'
                : 'bg-teal-50 text-teal-800 border-teal-200'
            }`}>
              {role === 'admin' ? <ShieldAlert className="w-2.5 h-2.5" /> : role === 'physiotherapist' ? <Stethoscope className="w-2.5 h-2.5" /> : <Home className="w-2.5 h-2.5" />}
              <span>{role || 'Patient'} Mode</span>
            </span>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <BackendStatusBadge 
              isOnline={isBackendOnline}
              onOpenDevInfo={() => setIsDevDrawerOpen(true)}
              onRefresh={onRefreshBackend}
              isChecking={false}
            />

            {/* Quick Admin Role-Switch Chips if user is admin */}
            {role === 'admin' && (
              <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[10px] font-bold">
                <button
                  onClick={() => navigate('/admin-dashboard')}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    location.pathname.includes('/admin') ? 'bg-purple-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    location.pathname === '/dashboard' ? 'bg-teal-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Patient View
                </button>
                <button
                  onClick={() => navigate('/physio-dashboard')}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    location.pathname.includes('/physio') ? 'bg-sky-700 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Physio View
                </button>
              </div>
            )}

            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="p-1.5 px-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Launch AI Physio Voice Consultation"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Voice Physio</span>
            </button>

            <button
              onClick={() => setIsDevDrawerOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Open Backend Developer Drawer"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 w-full mx-auto bg-slate-50 shadow-xs ${
        role === 'physiotherapist' || role === 'admin'
          ? 'max-w-6xl'
          : 'max-w-md border-x border-slate-200/60'
      }`}>
        <Outlet />
      </main>

      {/* Authenticated Bottom Navigation Bar (ONLY in AppLayout, NEVER in PublicLayout!) */}
      <div className={role === 'physiotherapist' ? 'md:hidden' : ''}>
        <BottomNav
          currentTab={getCurrentTab()}
          onTabChange={handleTabChange}
          role={role || 'patient'}
          memoryEnabled={memoryEnabled}
        />
      </div>

      {/* Voice Consultation Modal */}
      {isVoiceModalOpen && (
        <VoiceModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onNewMessage={onNewVoiceMessage}
        />
      )}

      {/* Developer Local Backend Drawer */}
      {isDevDrawerOpen && (
        <LocalBackendDrawer
          isOpen={isDevDrawerOpen}
          onClose={() => setIsDevDrawerOpen(false)}
          isOnline={isBackendOnline}
          onRefresh={onRefreshBackend}
        />
      )}
    </div>
  );
};
