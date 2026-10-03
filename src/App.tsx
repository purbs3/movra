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
  PublicHomePage 
} from './components/public/PublicHomePage';
import { 
  BookingAuthModal 
} from './components/public/BookingAuthModal';
import { 
  BookingConfirmModal 
} from './components/public/BookingConfirmModal';
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
  UserRole,
  BookingRequest 
} from './types';
import { Activity, ShieldCheck, Sparkles, LogOut, User as UserIcon, ShieldAlert, Stethoscope, Users, Home } from 'lucide-react';

export default function App() {
  const { user, role, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  
  // Page view mode:
  // When patient opens for the first time, show 'public' homepage! (NOT Login or Signup)
  const [pageView, setPageView] = useState<'public' | 'dashboard' | 'auth'>('public');

  // Auth navigation state when directly signing in/up
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot-password'>('login');
  
  // Tab navigation state typed to TabType
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Booking Flow State
  const [activeBookingData, setActiveBookingData] = useState<Partial<BookingRequest>>({
    name: '',
    phone: '',
    age: '45',
    location: '',
    condition: 'Knee Pain / Post-Op Recovery',
    service: 'Home Visit Physiotherapy',
    preferred_date: new Date().toISOString().split('T')[0],
    preferred_time: '10:00 AM',
    message: ''
  });
  const [isBookingAuthModalOpen, setIsBookingAuthModalOpen] = useState(false);
  const [isBookingConfirmModalOpen, setIsBookingConfirmModalOpen] = useState(false);
  
  const [planData, setPlanData] = useState<TodayPlanData>(FALLBACK_TODAY_PLAN);
  const [retainedContext, setRetainedContext] = useState<RetainedContextItem[]>(FALLBACK_RETAINED_CONTEXT);
  const [memoryEnabled, setMemoryEnabled] = useState<boolean>(true);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState<boolean>(false);
  const [isDevDrawerOpen, setIsDevDrawerOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Sync default tab when user role loads
  useEffect(() => {
    if (role === 'admin') {
      setCurrentTab('admin');
      setPageView('dashboard');
    } else if (role === 'physiotherapist') {
      setCurrentTab('physio-dashboard');
      setPageView('dashboard');
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
    setPageView('dashboard');
    if (assignedRole === 'admin') {
      window.history.replaceState(null, '', '/admin-dashboard');
      setCurrentTab('admin');
    } else if (assignedRole === 'physiotherapist') {
      window.history.replaceState(null, '', '/physio-dashboard');
      setCurrentTab('physio-dashboard');
    } else {
      window.history.replaceState(null, '', '/dashboard');
      setCurrentTab('dashboard');
    }
  };

  // ========================================================
  // BOOKING JOURNEY HANDLERS
  // ========================================================
  const handleStartBooking = (formData: Partial<BookingRequest>) => {
    setActiveBookingData(formData);

    // If patient is NOT logged in: show the authentication modal first
    // while preserving all entered booking data!
    if (!isAuthenticated) {
      setIsBookingAuthModalOpen(true);
    } else {
      // If already logged in: open the booking confirmation modal directly
      setIsBookingConfirmModalOpen(true);
    }
  };

  const handleBookingAuthSuccess = () => {
    setIsBookingAuthModalOpen(false);
    // Proceed directly to booking confirmation with preserved data
    setIsBookingConfirmModalOpen(true);
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
  // 1. PUBLIC HOMEPAGE (First screen shown to patients)
  // -----------------------------------------------------------------------
  if (pageView === 'public') {
    return (
      <>
        <PublicHomePage
          onStartBooking={handleStartBooking}
          onNavigateToAuth={() => {
            setPageView('auth');
            setAuthView('login');
          }}
          isAuthenticated={isAuthenticated}
          onNavigateToDashboard={() => setPageView('dashboard')}
        />

        {/* Step 2: Authentication Modal (Preserves booking data!) */}
        {isBookingAuthModalOpen && (
          <BookingAuthModal
            isOpen={isBookingAuthModalOpen}
            onClose={() => setIsBookingAuthModalOpen(false)}
            bookingData={activeBookingData}
            onAuthSuccess={handleBookingAuthSuccess}
          />
        )}

        {/* Step 3: Review & Confirm Modal */}
        {isBookingConfirmModalOpen && (
          <BookingConfirmModal
            isOpen={isBookingConfirmModalOpen}
            onClose={() => setIsBookingConfirmModalOpen(false)}
            bookingData={activeBookingData}
            onBookingConfirmed={(b) => {
              // Successfully booked!
            }}
            onNavigateToDashboard={() => {
              setIsBookingConfirmModalOpen(false);
              setPageView('dashboard');
              setCurrentTab('dashboard');
            }}
            onBackToHome={() => {
              setIsBookingConfirmModalOpen(false);
              setPageView('public');
            }}
          />
        )}
      </>
    );
  }

  // -----------------------------------------------------------------------
  // 2. DIRECT AUTHENTICATION SCREENS (Sign in / Sign up)
  // -----------------------------------------------------------------------
  if (pageView === 'auth' && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-2xs">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <button
              onClick={() => setPageView('public')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/30">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 block">
                  MOVRA
                </span>
                <span className="text-[10px] text-teal-700 font-semibold block">
                  Home Visit Physiotherapy
                </span>
              </div>
            </button>
            <button
              onClick={() => setPageView('public')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Back to Home
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-6 px-4">
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
      </div>
    );
  }

  // -----------------------------------------------------------------------
  // 3. AUTHENTICATED PATIENT & CLINICIAN DASHBOARD
  // -----------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Navigation Bar with Role, Patient Name & Switch to Public Home */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPageView('public')}
              title="Return to Public Home"
              className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/30 hover:opacity-90 transition-opacity"
            >
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900 flex items-center gap-1">
                MOVRA <span className="text-teal-600 text-xs font-semibold">AI Physio</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium truncate max-w-[140px]">
                {user?.full_name || 'Patient'} ({user?.role || 'patient'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPageView('public')}
              className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <Home className="w-3 h-3 text-teal-600" />
              <span>Public Home</span>
            </button>

            <BackendStatusBadge
              isOnline={isBackendOnline}
              onOpenDevInfo={() => setIsDevDrawerOpen(true)}
              onRefresh={verifyBackend}
              isChecking={isCheckingBackend}
            />

            <button
              onClick={() => {
                logout();
                setPageView('public');
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin All-Access Quick Jump Strip (Only for Admin) */}
        {role === 'admin' && (
          <div className="max-w-md mx-auto mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="font-extrabold text-purple-900 flex items-center gap-1 text-[10px] uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
              Admin All-Access:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentTab('admin')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  currentTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  currentTab === 'dashboard' || currentTab === 'chat' || currentTab === 'learn'
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                }`}
              >
                Patient
              </button>
              <button
                onClick={() => setCurrentTab('physio-dashboard')}
                className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                  currentTab === 'physio-dashboard' || currentTab === 'physio-alerts'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                }`}
              >
                Physio
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Role Content Router */}
      <main className={`flex-1 w-full mx-auto bg-slate-50 shadow-xs ${
        role === 'physiotherapist' || (role === 'admin' && (currentTab === 'physio-dashboard' || currentTab === 'physio-alerts' || currentTab === 'admin'))
          ? 'max-w-6xl'
          : 'max-w-md border-x border-slate-200/60'
      }`}>
        {/* 1. Admin Dashboard View */}
        {currentTab === 'admin' && (
          <ProtectedRoute
            allowedRoles={['admin']}
            onRedirectToLogin={() => {
              setPageView('auth');
              setAuthView('login');
            }}
            onRedirectToDashboard={(r) => handleAuthSuccess(r)}
          >
            <AdminDashboard onLogout={logout} activeTab="admin_overview" />
          </ProtectedRoute>
        )}

        {/* 2. Physio Caseload & Alerts Views */}
        {(currentTab === 'physio-dashboard' || currentTab === 'physio-alerts') && (
          <ProtectedRoute
            allowedRoles={['physiotherapist', 'admin']}
            onRedirectToLogin={() => {
              setPageView('auth');
              setAuthView('login');
            }}
            onRedirectToDashboard={(r) => handleAuthSuccess(r)}
          >
            <PhysioDashboard 
              onLogout={logout} 
              activeTab={currentTab === 'physio-alerts' ? 'alerts' : 'caseload'} 
            />
          </ProtectedRoute>
        )}

        {/* 3. Patient Home Dashboard */}
        {currentTab === 'dashboard' && (
          <ProtectedRoute
            allowedRoles={['patient', 'admin']}
            onRedirectToLogin={() => {
              setPageView('auth');
              setAuthView('login');
            }}
            onRedirectToDashboard={(r) => handleAuthSuccess(r)}
          >
            <DashboardView
              planData={planData}
              onStartExercise={(ex) => {}}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              onNavigateToChat={() => setCurrentTab('chat')}
              onToggleExerciseComplete={handleToggleExercise}
              onOpenBookVisit={() => {
                setPageView('public');
                setTimeout(() => {
                  const el = document.getElementById('booking-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            />
          </ProtectedRoute>
        )}

        {/* 4. AI Physio Chat */}
        {currentTab === 'chat' && (
          <ProtectedRoute
            allowedRoles={['patient', 'admin']}
            onRedirectToLogin={() => {
              setPageView('auth');
              setAuthView('login');
            }}
            onRedirectToDashboard={(r) => handleAuthSuccess(r)}
          >
            <ChatView
              messages={messages}
              onSendMessage={handleSendMessage}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              memoryEnabled={memoryEnabled}
              isLoading={isChatLoading}
            />
          </ProtectedRoute>
        )}

        {/* 5. Progress Telemetry */}
        {currentTab === 'progress' && (
          <ProtectedRoute
            allowedRoles={['patient', 'physiotherapist', 'admin']}
            onRedirectToLogin={() => {
              setPageView('auth');
              setAuthView('login');
            }}
            onRedirectToDashboard={(r) => handleAuthSuccess(r)}
          >
            <ProgressView planData={planData} />
          </ProtectedRoute>
        )}

        {/* 6. Patient Education / Learn */}
        {currentTab === 'learn' && (
          <ProtectedRoute
            allowedRoles={['patient', 'admin']}
            onRedirectToLogin={() => {
              setPageView('auth');
              setAuthView('login');
            }}
            onRedirectToDashboard={(r) => handleAuthSuccess(r)}
          >
            <LearnView />
          </ProtectedRoute>
        )}

        {/* 7. Patient Subscription Plans */}
        {currentTab === 'subscription' && (
          <ProtectedRoute
            allowedRoles={['patient', 'admin']}
            onRedirectToLogin={() => {
              setPageView('auth');
              setAuthView('login');
            }}
            onRedirectToDashboard={(r) => handleAuthSuccess(r)}
          >
            <SubscriptionView onBack={() => setCurrentTab('profile')} />
          </ProtectedRoute>
        )}

        {/* 8. Profile View */}
        {currentTab === 'profile' && (
          <ProtectedRoute
            allowedRoles={['patient', 'physiotherapist', 'admin']}
            onRedirectToLogin={() => {
              setPageView('auth');
              setAuthView('login');
            }}
            onRedirectToDashboard={(r) => handleAuthSuccess(r)}
          >
            {role === 'physiotherapist' ? (
              <PhysioDashboard onLogout={logout} activeTab="profile" />
            ) : (
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
      <div className={role === 'physiotherapist' ? 'md:hidden' : ''}>
        <BottomNav
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          role={role || 'patient'}
          memoryEnabled={memoryEnabled}
        />
      </div>

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

      {/* Booking Confirm Modal if triggered from Dashboard */}
      {isBookingConfirmModalOpen && (
        <BookingConfirmModal
          isOpen={isBookingConfirmModalOpen}
          onClose={() => setIsBookingConfirmModalOpen(false)}
          bookingData={activeBookingData}
          onBookingConfirmed={(b) => {
            // Updated
          }}
          onNavigateToDashboard={() => {
            setIsBookingConfirmModalOpen(false);
            setCurrentTab('dashboard');
          }}
          onBackToHome={() => {
            setIsBookingConfirmModalOpen(false);
            setPageView('public');
          }}
        />
      )}
    </div>
  );
}
