import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AppLayout } from './layouts/AppLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Authenticated Application Views
import { DashboardView } from './components/DashboardView';
import { ChatView } from './components/ChatView';
import { ProgressView } from './components/ProgressView';
import { ProfileView } from './components/ProfileView';
import { LearnView } from './components/LearnView';
import { SubscriptionView } from './components/SubscriptionView';
import { PhysioDashboard } from './components/dashboards/PhysioDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

// Booking Modals
import { BookingAuthModal } from './components/public/BookingAuthModal';
import { BookingConfirmModal } from './components/public/BookingConfirmModal';

// Context & API
import { useAuth } from './context/AuthContext';
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

export default function App() {
  const { user, role, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Booking Flow State
  const [activeBookingData, setActiveBookingData] = useState<Partial<BookingRequest>>({
    name: '',
    phone: '',
    age: '45',
    location: 'Kankarbagh, Patna',
    condition: 'Knee Pain / Post-Op Recovery',
    service: 'Home Visit Physiotherapy',
    preferred_date: new Date().toISOString().split('T')[0],
    preferred_time: '10:00 AM',
    message: ''
  });
  const [isBookingAuthModalOpen, setIsBookingAuthModalOpen] = useState(false);
  const [isBookingConfirmModalOpen, setIsBookingConfirmModalOpen] = useState(false);

  // Clinical Telemetry & Memory
  const [planData, setPlanData] = useState<TodayPlanData>(FALLBACK_TODAY_PLAN);
  const [retainedContext, setRetainedContext] = useState<RetainedContextItem[]>(FALLBACK_RETAINED_CONTEXT);
  const [memoryEnabled, setMemoryEnabled] = useState<boolean>(true);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean>(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState<boolean>(false);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Chat Messages
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
    const interval = setInterval(verifyBackend, 20000);
    return () => clearInterval(interval);
  }, [verifyBackend]);

  // Handle post-login redirection based on role
  const handleAuthSuccess = (assignedRole: UserRole) => {
    if (assignedRole === 'admin') {
      navigate('/admin-dashboard');
    } else if (assignedRole === 'physiotherapist') {
      navigate('/physio-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  // ========================================================
  // BOOKING JOURNEY HANDLERS
  // ========================================================
  const handleStartBooking = (formData: Partial<BookingRequest>) => {
    setActiveBookingData(formData);
    if (!isAuthenticated) {
      setIsBookingAuthModalOpen(true);
    } else {
      setIsBookingConfirmModalOpen(true);
    }
  };

  const handleBookingAuthSuccess = () => {
    setIsBookingAuthModalOpen(false);
    setIsBookingConfirmModalOpen(true);
  };

  // Chat message submission
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

  // Toggle Exercise Complete
  const handleToggleExercise = (id: string) => {
    setPlanData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((e) => (e.id === id ? { ...e, completed: !e.completed } : e))
    }));
  };

  // Toggle AI Clinical Memory
  const handleToggleMemory = async (enabled: boolean) => {
    setMemoryEnabled(enabled);
  };

  // Add Item to Clinical Memory
  const handleAddMemoryItem = async (category: string, summary: string) => {
    const newItem: RetainedContextItem = {
      id: `ctx-${Date.now()}`,
      category,
      summary,
      date_logged: new Date().toISOString().split('T')[0],
      active: true
    };
    setRetainedContext((prev) => [newItem, ...prev]);
  };

  // Handle voice consultation message
  const handleVoiceMessageAdded = (message: any) => {
    if (message.user) {
      setMessages((prev) => [
        ...prev,
        {
          id: `voice-usr-${Date.now()}`,
          sender: 'user',
          text: message.user,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
    if (message.ai) {
      setMessages((prev) => [
        ...prev,
        {
          id: `voice-ai-${Date.now()}`,
          sender: 'ai',
          text: message.ai,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: ['Live Voice Physio Protocol']
        }
      ]);
    }
  };

  return (
    <>
      <Routes>
        {/* ======================================================== */}
        {/* PART 1: PUBLIC ROUTES (NO BOTTOMNAV)                    */}
        {/* ======================================================== */}
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={<LandingPage onStartBooking={handleStartBooking} />}
          />
          <Route
            path="/login"
            element={
              <Login
                onNavigate={(view) => navigate(`/${view}`)}
                onSuccessRedirect={handleAuthSuccess}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <Signup
                onNavigate={(view) => navigate(`/${view}`)}
                onSuccessRedirect={handleAuthSuccess}
              />
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ForgotPassword
                onNavigate={(view) => navigate(`/${view}`)}
              />
            }
          />
        </Route>

        {/* ======================================================== */}
        {/* PART 2: PROTECTED ROUTES (WITH APPLAYOUT & BOTTOMNAV)    */}
        {/* ======================================================== */}
        <Route
          element={
            <AppLayout
              memoryEnabled={memoryEnabled}
              isBackendOnline={isBackendOnline}
              onRefreshBackend={verifyBackend}
              onNewVoiceMessage={handleVoiceMessageAdded}
            />
          }
        >
          {/* Patient Home Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={['patient', 'admin']}
                onRedirectToLogin={() => navigate('/login')}
                onRedirectToDashboard={(r) => handleAuthSuccess(r)}
              >
                <DashboardView
                  planData={planData}
                  onStartExercise={(ex) => {}}
                  onOpenVoiceModal={() => {}}
                  onNavigateToChat={() => navigate('/chat')}
                  onToggleExerciseComplete={handleToggleExercise}
                  onOpenBookVisit={() => {
                    navigate('/');
                    setTimeout(() => {
                      const el = document.getElementById('booking-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 150);
                  }}
                />
              </ProtectedRoute>
            }
          />

          {/* AI Physio Chat View */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute
                allowedRoles={['patient', 'admin']}
                onRedirectToLogin={() => navigate('/login')}
                onRedirectToDashboard={(r) => handleAuthSuccess(r)}
              >
                <ChatView
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onOpenVoiceModal={() => {}}
                  memoryEnabled={memoryEnabled}
                  isLoading={isChatLoading}
                />
              </ProtectedRoute>
            }
          />

          {/* Progress & Goniometric Trajectory */}
          <Route
            path="/progress"
            element={
              <ProtectedRoute
                allowedRoles={['patient', 'physiotherapist', 'admin']}
                onRedirectToLogin={() => navigate('/login')}
                onRedirectToDashboard={(r) => handleAuthSuccess(r)}
              >
                <ProgressView planData={planData} />
              </ProtectedRoute>
            }
          />

          {/* Patient Education / Learn */}
          <Route
            path="/learn"
            element={
              <ProtectedRoute
                allowedRoles={['patient', 'admin']}
                onRedirectToLogin={() => navigate('/login')}
                onRedirectToDashboard={(r) => handleAuthSuccess(r)}
              >
                <LearnView />
              </ProtectedRoute>
            }
          />

          {/* Patient Subscription & Memberships */}
          <Route
            path="/subscription"
            element={
              <ProtectedRoute
                allowedRoles={['patient', 'admin']}
                onRedirectToLogin={() => navigate('/login')}
                onRedirectToDashboard={(r) => handleAuthSuccess(r)}
              >
                <SubscriptionView onBack={() => navigate('/profile')} />
              </ProtectedRoute>
            }
          />

          {/* Physiotherapist Dashboard */}
          <Route
            path="/physio-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={['physiotherapist', 'admin']}
                onRedirectToLogin={() => navigate('/login')}
                onRedirectToDashboard={(r) => handleAuthSuccess(r)}
              >
                <PhysioDashboard onLogout={logout} activeTab="caseload" />
              </ProtectedRoute>
            }
          />

          {/* Admin Control Center */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute
                allowedRoles={['admin']}
                onRedirectToLogin={() => navigate('/login')}
                onRedirectToDashboard={(r) => handleAuthSuccess(r)}
              >
                <AdminDashboard onLogout={logout} activeTab="admin_overview" />
              </ProtectedRoute>
            }
          />

          {/* Profile View (Role-aware) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                allowedRoles={['patient', 'physiotherapist', 'admin']}
                onRedirectToLogin={() => navigate('/login')}
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
                    onOpenDevDrawer={() => {}}
                    isBackendOnline={isBackendOnline}
                    onOpenSubscription={() => navigate('/subscription')}
                  />
                )}
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Booking Auth Modal */}
      {isBookingAuthModalOpen && (
        <BookingAuthModal
          isOpen={isBookingAuthModalOpen}
          onClose={() => setIsBookingAuthModalOpen(false)}
          onAuthSuccess={handleBookingAuthSuccess}
          bookingData={activeBookingData}
        />
      )}

      {/* Booking Confirmation Modal */}
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
            navigate('/dashboard');
          }}
          onBackToHome={() => {
            setIsBookingConfirmModalOpen(false);
            navigate('/');
          }}
        />
      )}
    </>
  );
}
