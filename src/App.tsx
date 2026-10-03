import React, { useState, useEffect, useCallback } from 'react';
import { 
  DashboardView 
} from './components/DashboardView';
import { 
  ChatView 
} from './components/ChatView';
import { 
  ProgressView 
} from './components/ProgressView';
import { 
  ProfileView 
} from './components/ProfileView';
import { 
  LearnView 
} from './components/LearnView';
import { 
  AdminView 
} from './components/AdminView';
import { 
  BottomNav, 
  TabType 
} from './components/BottomNav';
import { 
  BackendStatusBadge 
} from './components/BackendStatusBadge';
import { 
  LocalBackendDrawer 
} from './components/LocalBackendDrawer';
import { 
  VoiceModal 
} from './components/VoiceModal';
import { 
  ExerciseModal 
} from './components/ExerciseModal';
import { 
  SubscriptionView 
} from './components/SubscriptionView';
import { 
  Login 
} from './components/auth/Login';
import { 
  Signup 
} from './components/auth/Signup';
import { 
  ForgotPassword 
} from './components/auth/ForgotPassword';
import { 
  ProtectedRoute 
} from './components/auth/ProtectedRoute';
import { 
  PhysioDashboard 
} from './components/dashboards/PhysioDashboard';
import { 
  AdminDashboard 
} from './components/dashboards/AdminDashboard';
import { 
  useAuth 
} from './context/AuthContext';
import { 
  api, 
  FALLBACK_TODAY_PLAN, 
  FALLBACK_RETAINED_CONTEXT 
} from './services/api';
import { 
  TodayPlanData, 
  ChatMessage, 
  RetainedContextItem, 
  Exercise, 
  UserRole 
} from './types';
import { Activity, ShieldCheck, Sparkles, LogOut, User as UserIcon } from 'lucide-react';

export default function App() {
  const { user, role, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  
  // Auth navigation state when unauthenticated
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot-password'>('login');
  
  // Tab navigation state
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const saved = localStorage.getItem('movra_auth_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u.role === 'admin') return 'admin_overview';
        if (u.role === 'physiotherapist') return 'caseload';
      } catch {}
    }
    return 'dashboard';
  });
  
  const [planData, setPlanData] = useState<TodayPlanData>(FALLBACK_TODAY_PLAN);
  const [retainedContext, setRetainedContext] = useState<RetainedContextItem[]>(FALLBACK_RETAINED_CONTEXT);
  const [memoryEnabled, setMemoryEnabled] = useState<boolean>(true);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState<boolean>(false);
  const [isDevDrawerOpen, setIsDevDrawerOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Sync default tab when user role changes
  useEffect(() => {
    if (role === 'admin') {
      setCurrentTab('admin_overview');
    } else if (role === 'physiotherapist') {
      setCurrentTab('caseload');
    } else if (role === 'patient') {
      setCurrentTab('dashboard');
    }
  }, [role]);

  // Initial Chat Messages showcasing clinical interaction
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Good morning, Rahul. I've reviewed your Day 14 knee extension records. Your active range reached 88° yesterday with steady quadriceps recruitment. You can toggle between Cloud Mode (Contextual RAG) and Private Mode (Local Deepseek) above. How is your knee feeling today?",
      timestamp: '9:00 AM',
      citations: ['Movra Care Pathway: TKA Stage 2 Protocol']
    }
  ]);

  // Check backend health on mount and periodically
  const verifyBackend = useCallback(async () => {
    setIsCheckingBackend(true);
    const online = await api.checkHealth();
    setIsBackendOnline(online);
    setIsCheckingBackend(false);

    if (online) {
      try {
        const plan = await api.getTodayPlan('rahul_123');
        setPlanData(plan);
        const mem = await api.getPatientMemory('rahul_123');
        setMemoryEnabled(mem.memory_enabled);
        setRetainedContext(mem.retained_context);
      } catch (err) {
        console.warn('Backend data refresh notice:', err);
      }
    }
  }, []);

  useEffect(() => {
    verifyBackend();
    const interval = setInterval(verifyBackend, 15000);
    return () => clearInterval(interval);
  }, [verifyBackend]);

  // Handle post-login redirection based on role
  const handleAuthSuccess = (assignedRole: UserRole) => {
    if (assignedRole === 'admin') {
      window.history.replaceState(null, '', '/admin-dashboard');
      setCurrentTab('admin_overview');
    } else if (assignedRole === 'physiotherapist') {
      window.history.replaceState(null, '', '/physio-dashboard');
      setCurrentTab('caseload');
    } else {
      window.history.replaceState(null, '', '/dashboard');
      setCurrentTab('dashboard');
    }
  };

  // Handle Chat message submission -> calls POST /api/chat or POST /api/local-chat
  const handleSendMessage = async (queryText: string, mode: 'cloud' | 'private' = 'cloud') => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      if (mode === 'private') {
        const res = await api.sendLocalChatMessage(queryText, planData.patient.id);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: res.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: res.guideline_citations,
          clinical_alert: res.clinical_alert
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const res = await api.sendChatMessage(queryText, planData.patient.id);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: res.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: res.guideline_citations,
          clinical_alert: res.clinical_alert
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      const fallbackAiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Based on Day 14 protocols, please proceed with your prescribed sets. Keep your quad contracted firmly at 0° extension.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: ['Movra Home Care Guidelines']
      };
      setMessages((prev) => [...prev, fallbackAiMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle voice recording submission from VoiceModal
  const handleVoiceMessageAdded = (userText: string, aiText: string, citations?: string[]) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `voice-usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timeStr,
      isVoiceInput: true
    };
    const aiMsg: ChatMessage = {
      id: `voice-ai-${Date.now()}`,
      sender: 'ai',
      text: aiText,
      timestamp: timeStr,
      citations: citations || ['AAOS TKA Voice Guidance Protocol']
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  // Toggle memory in backend -> POST /api/patient-memory/toggle
  const handleToggleMemory = async (enabled: boolean) => {
    setMemoryEnabled(enabled);
    await api.toggleMemory(enabled, planData.patient.id);
  };

  // Add memory item -> POST /api/patient-memory
  const handleAddMemoryItem = async (category: string, summary: string) => {
    const newItem = await api.addMemoryItem(category, summary, planData.patient.id);
    setRetainedContext((prev) => [newItem, ...prev]);
  };

  // Toggle exercise completion in state
  const handleToggleExercise = (exerciseId: string) => {
    setPlanData((prev) => {
      const updatedExercises = prev.exercises.map((ex) => {
        if (ex.id === exerciseId) {
          return { ...ex, completed: !ex.completed };
        }
        return ex;
      });
      return {
        ...prev,
        exercises: updatedExercises
      };
    });
  };

  // -----------------------------------------------------------------------
  // UNAUTHENTICATED STATE: Render Login, Signup, or Forgot Password
  // -----------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-2xs">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/30">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center gap-1">
                Movra <span className="text-teal-600 text-xs font-semibold">AI Physio</span>
              </span>
            </div>
            <BackendStatusBadge
              isOnline={isBackendOnline}
              onOpenDevInfo={() => setIsDevDrawerOpen(true)}
              onRefresh={verifyBackend}
              isChecking={isCheckingBackend}
            />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-6">
          {authView === 'login' && (
            <Login
              onNavigate={(v) => setAuthView(v)}
              onSuccessRedirect={handleAuthSuccess}
            />
          )}

          {authView === 'signup' && (
            <Signup
              onNavigate={(v) => setAuthView(v)}
              onSuccessRedirect={handleAuthSuccess}
            />
          )}

          {authView === 'forgot-password' && (
            <ForgotPassword
              onNavigate={(v) => setAuthView(v)}
            />
          )}
        </main>

        {isDevDrawerOpen && (
          <LocalBackendDrawer
            isOpen={isDevDrawerOpen}
            onClose={() => setIsDevDrawerOpen(false)}
            isOnline={isBackendOnline}
            onRefresh={verifyBackend}
          />
        )}
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // AUTHENTICATED STATE: Role-Based Dashboard Routing
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Navigation Bar with Role & Welcome */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/30">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 flex items-center gap-1">
                Movra <span className="text-teal-600 text-xs font-semibold">AI Physio</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium truncate max-w-[140px]">
                {user?.full_name} ({user?.role})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <BackendStatusBadge
              isOnline={isBackendOnline}
              onOpenDevInfo={() => setIsDevDrawerOpen(true)}
              onRefresh={verifyBackend}
              isChecking={isCheckingBackend}
            />

            <button
              onClick={logout}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Role Content Router */}
      <main className="flex-1 w-full max-w-md mx-auto bg-slate-50 border-x border-slate-200/60 shadow-xs">
        {/* ROLE 1: Physiotherapist Dashboard */}
        {role === 'physiotherapist' && (
          <ProtectedRoute
            allowedRoles={['physiotherapist']}
            onRedirectToLogin={() => setAuthView('login')}
            onRedirectToDashboard={(r) => handleAuthSuccess(r)}
          >
            {currentTab === 'progress' ? (
              <ProgressView planData={planData} />
            ) : (
              <PhysioDashboard 
                onLogout={logout} 
                activeTab={currentTab} 
              />
            )}
          </ProtectedRoute>
        )}

        {/* ROLE 2: Admin Dashboard */}
        {role === 'admin' && (
          <ProtectedRoute
            allowedRoles={['admin']}
            onRedirectToLogin={() => setAuthView('login')}
            onRedirectToDashboard={(r) => handleAuthSuccess(r)}
          >
            <AdminDashboard 
              onLogout={logout} 
              activeTab={currentTab} 
            />
          </ProtectedRoute>
        )}

        {/* ROLE 3: Patient Dashboard & Tabs */}
        {role === 'patient' && (
          <ProtectedRoute
            allowedRoles={['patient']}
            onRedirectToLogin={() => setAuthView('login')}
            onRedirectToDashboard={(r) => handleAuthSuccess(r)}
          >
            {currentTab === 'dashboard' && (
              <DashboardView
                planData={planData}
                onStartExercise={(ex) => {}}
                onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                onNavigateToChat={() => setCurrentTab('chat')}
                onToggleExerciseComplete={handleToggleExercise}
              />
            )}

            {currentTab === 'chat' && (
              <ChatView
                messages={messages}
                onSendMessage={handleSendMessage}
                onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                memoryEnabled={memoryEnabled}
                isLoading={isChatLoading}
              />
            )}

            {currentTab === 'progress' && (
              <ProgressView planData={planData} />
            )}

            {currentTab === 'learn' && (
              <LearnView />
            )}

            {currentTab === 'subscription' && (
              <SubscriptionView onBack={() => setCurrentTab('profile')} />
            )}

            {currentTab === 'profile' && (
              <ProfileView
                patient={planData.patient}
                memoryEnabled={memoryEnabled}
                onToggleMemory={handleToggleMemory}
                retainedContext={retainedContext}
                onAddMemoryItem={handleAddMemoryItem}
                onOpenDevDrawer={() => setIsDevDrawerOpen(true)}
                isBackendOnline={isBackendOnline}
                onOpenSubscription={() => setCurrentTab('subscription')}
              />
            )}
          </ProtectedRoute>
        )}
      </main>

      {/* Dynamic Role-Based Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        userRole={role || 'patient'}
        memoryEnabled={memoryEnabled}
      />

      {/* Real-time Voice Consultation Modal */}
      {isVoiceModalOpen && (
        <VoiceModal
          isOpen={isVoiceModalOpen}
          onClose={() => setIsVoiceModalOpen(false)}
          onNewMessage={handleVoiceMessageAdded}
        />
      )}

      {/* Developer Local Backend Drawer */}
      {isDevDrawerOpen && (
        <LocalBackendDrawer
          isOpen={isDevDrawerOpen}
          onClose={() => setIsDevDrawerOpen(false)}
          isOnline={isBackendOnline}
          onRefresh={verifyBackend}
        />
      )}
    </div>
  );
}
