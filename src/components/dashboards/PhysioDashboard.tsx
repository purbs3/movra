import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  LogOut, 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Search, 
  Activity, 
  User, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Check, 
  X, 
  RefreshCw,
  Bell,
  Compass,
  FileText,
  Dumbbell,
  Receipt,
  CreditCard,
  Sliders,
  Menu,
  ChevronRight,
  ShieldCheck,
  Inbox
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { BookingRequest, ClinicalAppointment, AppointmentStatusType } from '../../types';

// Physio Sub-components
import { PhysioSidebar } from '../physio/PhysioSidebar';
import { PhysioScheduleView } from '../physio/PhysioScheduleView';
import { PhysioBookingRequestsView } from '../physio/PhysioBookingRequestsView';
import { PhysioAppointmentsView } from '../physio/PhysioAppointmentsView';
import { PhysioHomeVisitsRouteView } from '../physio/PhysioHomeVisitsRouteView';
import { PhysioPatientsDirectoryView } from '../physio/PhysioPatientsDirectoryView';
import { PhysioClinicalWorkspaceView } from '../physio/PhysioClinicalWorkspaceView';
import { PhysioHomeProgramView } from '../physio/PhysioHomeProgramView';
import { PhysioEarningsView } from '../physio/PhysioEarningsView';
import { PhysioReportsView } from '../physio/PhysioReportsView';
import { PhysioFollowUpsView } from '../physio/PhysioFollowUpsView';
import { PhysioServiceAvailabilityView } from '../physio/PhysioServiceAvailabilityView';
import { PhysioPatientMessagesView } from '../physio/PhysioPatientMessagesView';
import { PhysioReceiptModal } from '../physio/PhysioReceiptModal';
import { PhysioNotificationsModal } from '../physio/PhysioNotificationsModal';
import { ActiveVisitModal } from '../physio/ActiveVisitModal';
import { PatientClinicalProfileModal } from '../physio/PatientClinicalProfileModal';

// Reusing existing ProgressView
import { ProgressView } from '../ProgressView';

interface PhysioDashboardProps {
  onLogout: () => void;
  activeTab?: string;
  onOpenPatientView?: (patientId: string) => void;
}

export const PhysioDashboard: React.FC<PhysioDashboardProps> = ({ 
  onLogout, 
  activeTab: externalTab = 'dashboard',
  onOpenPatientView 
}) => {
  const { user, logout } = useAuth();
  
  // Current active sub-tab
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('rahul_123');

  // Operational Data State
  const [appointments, setAppointments] = useState<ClinicalAppointment[]>([]);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals State
  const [activeVisitAppointment, setActiveVisitAppointment] = useState<ClinicalAppointment | null>(null);
  const [activeProfileModalId, setActiveProfileModalId] = useState<string | null>(null);
  const [receiptModalData, setReceiptModalData] = useState<any | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isProfileSaved, setIsProfileSaved] = useState(false);

  // Editable Clinician Profile State (Clearly marked placeholder)
  const [physioProfile, setPhysioProfile] = useState({
    name: user?.full_name || 'Dr. Ananya Iyer, PT',
    qualification: 'BPT, MPT • Orthopedic & Neuro Specialist (Editable Placeholder)',
    experience: '8+ Years Clinical Practice (Demo)',
    license: 'PT-IN-88921-A (Sample)',
    clinic: 'City Ortho Rehabilitation & Home Care',
    languages: 'English, Hindi',
    bio: 'Dedicated home visit rehabilitation clinician specializing in post-surgical recovery, joint mobilization, and motor retraining.'
  });

  // Sync external tab changes
  useEffect(() => {
    if (externalTab === 'alerts') {
      setCurrentTab('follow-ups');
    } else if (externalTab === 'caseload') {
      setCurrentTab('patients');
    } else if (externalTab === 'profile') {
      setCurrentTab('profile');
    } else if (externalTab && externalTab !== 'physio-dashboard') {
      setCurrentTab(externalTab);
    }
  }, [externalTab]);

  // Load Data from API
  const refreshAllData = async () => {
    setIsLoading(true);
    try {
      const [appts, bks, vsts, pts] = await Promise.all([
        api.getPhysioAppointments('today'),
        api.getAllBookings(),
        api.getTodaysVisits(),
        api.getPhysioPatients()
      ]);
      if (appts) setAppointments(appts);
      if (bks) setBookingRequests(bks);
      if (vsts) setVisits(vsts);
      if (pts) setPatients(pts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleLogoutClick = () => {
    logout();
    onLogout();
  };

  // Booking Actions
  const handleAcceptBooking = async (bookingId: number | string, notes?: string) => {
    await api.acceptBooking(bookingId, notes);
    setBookingRequests(prev => prev.map(b => (b.id === bookingId || b.reference_id === String(bookingId)) ? { ...b, status: 'CONFIRMED' } : b));
    refreshAllData();
  };

  const handleRejectBooking = async (bookingId: number | string, reason: string) => {
    await api.rejectBooking(bookingId, reason);
    setBookingRequests(prev => prev.map(b => (b.id === bookingId || b.reference_id === String(bookingId)) ? { ...b, status: 'REJECTED' } : b));
  };

  const handleRescheduleBooking = async (bookingId: number | string, newDate: string, newTime: string, reason?: string) => {
    await api.rescheduleBooking(bookingId, newDate, newTime, reason);
    setBookingRequests(prev => prev.map(b => (b.id === bookingId || b.reference_id === String(bookingId)) ? { ...b, preferred_date: newDate, preferred_time: newTime, status: 'RESCHEDULED' } : b));
  };

  // Appointment Status Actions
  const handleUpdateAppointmentStatus = async (appointmentId: number | string, newStatus: AppointmentStatusType) => {
    await api.updateAppointmentStatus(appointmentId, newStatus);
    setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: newStatus } : a));
  };

  // Visit Lifecycle
  const handleStartVisit = async (appointment: ClinicalAppointment) => {
    await api.startVisit(appointment.id);
    setAppointments(prev => prev.map(a => a.id === appointment.id ? { ...a, status: 'IN_PROGRESS' } : a));
    setActiveVisitAppointment(appointment);
  };

  const handleCompleteVisit = async (appointment: ClinicalAppointment) => {
    const res = await api.completeVisit(appointment.id);
    setAppointments(prev => prev.map(a => a.id === appointment.id ? { ...a, status: 'COMPLETED', payment_status: 'PAID' } : a));
    setActiveVisitAppointment(null);
    if (res && res.receipt) {
      setReceiptModalData(res.receipt);
    }
  };

  const handleViewPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    if (onOpenPatientView) {
      onOpenPatientView(patientId);
    } else {
      setActiveProfileModalId(patientId);
    }
  };

  const unreadBookingsCount = bookingRequests.filter(b => b.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pb-24 md:pb-6">
      {/* Desktop Sidebar (visible on md screens and up) */}
      <div className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
        <PhysioSidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onLogout={handleLogoutClick}
          unreadRequestsCount={unreadBookingsCount}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 max-w-5xl mx-auto w-full px-3 sm:px-6 py-4 space-y-4">
        {/* Mobile Top Header (hidden on desktop) */}
        <div className="md:hidden bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-700 text-white font-black flex items-center justify-center text-sm shadow-xs">
                M
              </div>
              <div>
                <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">MOVRA Physio Panel</h1>
                <p className="text-[11px] text-slate-500 font-medium">{physioProfile.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsNotificationsOpen(true)}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-teal-600 absolute top-1.5 right-1.5" />
              </button>

              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="p-2 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 font-bold text-xs flex items-center gap-1"
                title="Open All Features"
              >
                <Menu className="w-4 h-4" />
                <span>Menu</span>
              </button>
            </div>
          </div>

          {/* Quick Segmented Shortcut Pills for Mobile */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-bold pt-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'requests', label: 'Requests', count: unreadBookingsCount },
              { id: 'appointments', label: 'Appointments' },
              { id: 'visits', label: 'Home Visits' },
              { id: 'patients', label: 'Patients' },
              { id: 'clinical-soap', label: 'SOAP & AI' },
              { id: 'earnings', label: 'Earnings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  currentTab === tab.id
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count ? (
                  <span className="ml-1 text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-full">
                    {tab.count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Top Action Strip */}
        <div className="hidden md:flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Active View:</span>
            <span className="text-xs font-extrabold text-teal-900 capitalize bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200/60">
              {currentTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative flex items-center gap-1.5 text-xs font-bold"
            >
              <Bell className="w-4 h-4 text-teal-700" />
              <span>Notifications</span>
              <span className="w-2 h-2 rounded-full bg-teal-600 absolute -top-0.5 right-0.5" />
            </button>

            <button
              onClick={refreshAllData}
              disabled={isLoading}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 text-xs font-bold flex items-center gap-1 transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* VIEW ROUTER */}
        {/* 1. Dashboard & Today's Schedule */}
        {currentTab === 'dashboard' && (
          <PhysioScheduleView
            schedule={appointments}
            onStartVisit={handleStartVisit}
            onViewPatient={handleViewPatient}
            onNavigateRoute={() => setCurrentTab('routes')}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            physioProfile={physioProfile}
          />
        )}

        {/* 2. Booking Requests Management */}
        {currentTab === 'requests' && (
          <PhysioBookingRequestsView
            bookings={bookingRequests}
            onAccept={handleAcceptBooking}
            onReject={handleRejectBooking}
            onReschedule={handleRescheduleBooking}
            onViewPatient={handleViewPatient}
          />
        )}

        {/* 3. Appointment Lifecycle */}
        {currentTab === 'appointments' && (
          <PhysioAppointmentsView
            appointments={appointments}
            onStartVisit={handleStartVisit}
            onCompleteVisit={handleCompleteVisit}
            onViewPatient={handleViewPatient}
            onUpdateStatus={handleUpdateAppointmentStatus}
          />
        )}

        {/* 4. Home Visits & Sequence Route Planner */}
        {(currentTab === 'visits' || currentTab === 'routes') && (
          <PhysioHomeVisitsRouteView
            visits={visits}
            appointments={appointments}
            onStartVisit={handleStartVisit}
            onCompleteVisit={handleCompleteVisit}
            onViewPatient={handleViewPatient}
          />
        )}

        {/* 5. Patient Directory & Caseload */}
        {currentTab === 'patients' && (
          <PhysioPatientsDirectoryView
            patients={patients}
            onViewPatient={handleViewPatient}
            onStartAssessment={(pid) => {
              setSelectedPatientId(pid);
              setCurrentTab('clinical-assessment');
            }}
          />
        )}

        {/* 6. Clinical Workspace: Assessment, SOAP, Movement Analysis, Goals */}
        {(currentTab === 'clinical-assessment' || currentTab === 'clinical-soap' || currentTab === 'movement-analysis' || currentTab === 'goals' || currentTab === 'clinical') && (
          <PhysioClinicalWorkspaceView
            patientId={selectedPatientId}
            initialSubTab={
              currentTab === 'clinical-assessment'
                ? 'assessment'
                : currentTab === 'clinical-soap'
                ? 'soap'
                : currentTab === 'movement-analysis'
                ? 'movement'
                : currentTab === 'goals'
                ? 'goals'
                : 'timeline'
            }
          />
        )}

        {/* 7. Home Exercise Program Builder & Library */}
        {currentTab === 'home-program' && (
          <PhysioHomeProgramView
            patientId={selectedPatientId}
            patientName="Rahul Sharma"
          />
        )}

        {/* 8. Progress Telemetry */}
        {currentTab === 'progress' && (
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-700" />
              <span>Goniometry & Recovery Trajectory Analysis</span>
            </h2>
            <ProgressView
              planData={{
                patient: {
                  id: 'rahul_123',
                  name: 'Rahul Sharma',
                  age: 64,
                  surgery: 'Right Knee Replacement (TKA)',
                  post_op_day: 14,
                  primary_clinician: physioProfile.name
                },
                recovery_progress_percentage: 68,
                metrics: {
                  knee_flexion_degrees: 88,
                  knee_flexion_goal_degrees: 120,
                  knee_extension_degrees: -3,
                  knee_extension_goal_degrees: 0,
                  quad_activation_index: 82,
                  daily_steps: 2840
                },
                exercises: [],
                consistency: {
                  current_streak_days: 6,
                  weekly_compliance_percentage: 94,
                  days: []
                },
                voice_physio_status: {
                  ready: true,
                  status_text: 'Operational',
                  model_version: 'v2.1'
                }
              }}
            />
          </div>
        )}

        {/* 9. Direct Patient Messaging */}
        {currentTab === 'messages' && (
          <PhysioPatientMessagesView
            onViewPatient={handleViewPatient}
          />
        )}

        {/* 10. Clinical Reports & PDF Export */}
        {currentTab === 'reports' && (
          <PhysioReportsView
            patientName="Rahul Sharma"
            patientId={selectedPatientId}
          />
        )}

        {/* 11. Earnings & Transactions Ledger */}
        {currentTab === 'earnings' && (
          <PhysioEarningsView
            onOpenReceipt={(data) => setReceiptModalData(data)}
          />
        )}

        {/* 12. Follow-Up Management Watchlist */}
        {currentTab === 'follow-ups' && (
          <PhysioFollowUpsView
            onViewPatient={handleViewPatient}
            onScheduleAppointment={() => setCurrentTab('appointments')}
          />
        )}

        {/* 13. Service Area & Availability Settings */}
        {(currentTab === 'service-area' || currentTab === 'availability') && (
          <PhysioServiceAvailabilityView />
        )}

        {/* 14. Clinician Profile & Verification */}
        {currentTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-5 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
                  <Stethoscope className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">{physioProfile.name}</h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    Licensed Rehabilitation Specialist
                  </span>
                  <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-mono italic">Demo Placeholder</span>
            </div>

            <div className="space-y-3 text-xs pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Full Practitioner Name</label>
                  <input
                    type="text"
                    value={physioProfile.name}
                    onChange={(e) => setPhysioProfile({ ...physioProfile, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Academic Credentials & Qualifications</label>
                  <input
                    type="text"
                    value={physioProfile.qualification}
                    onChange={(e) => setPhysioProfile({ ...physioProfile, qualification: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Medical Council / PT Registration</label>
                  <input
                    type="text"
                    value={physioProfile.license}
                    onChange={(e) => setPhysioProfile({ ...physioProfile, license: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Affiliated Clinic / Center</label>
                  <input
                    type="text"
                    value={physioProfile.clinic}
                    onChange={(e) => setPhysioProfile({ ...physioProfile, clinic: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Professional Clinical Bio</label>
                <textarea
                  value={physioProfile.bio}
                  onChange={(e) => setPhysioProfile({ ...physioProfile, bio: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={handleLogoutClick}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>

              <div className="flex items-center gap-3">
                {isProfileSaved && (
                  <span className="text-xs font-bold text-teal-700 flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Credentials Updated</span>
                  </span>
                )}
                <button
                  onClick={() => {
                    setIsProfileSaved(true);
                    setTimeout(() => setIsProfileSaved(false), 3000);
                  }}
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* MODALS */}
      {/* ======================================================== */}
      {/* 1. Active Home Visit Modal */}
      {activeVisitAppointment && (
        <ActiveVisitModal
          isOpen={Boolean(activeVisitAppointment)}
          onClose={() => setActiveVisitAppointment(null)}
          appointment={activeVisitAppointment}
          onVisitCompleted={(completedAppt, receipt) => {
            setAppointments(prev => prev.map(a => a.id === completedAppt.id ? completedAppt : a));
            setActiveVisitAppointment(null);
            if (receipt) setReceiptModalData(receipt);
          }}
        />
      )}

      {/* 2. Patient Clinical Profile Modal */}
      {activeProfileModalId && (
        <PatientClinicalProfileModal
          isOpen={Boolean(activeProfileModalId)}
          onClose={() => setActiveProfileModalId(null)}
          patientId={activeProfileModalId}
          onStartVisit={(pid) => {
            setActiveProfileModalId(null);
            const foundAppt = appointments.find(a => a.patient_id === pid) || appointments[0];
            if (foundAppt) handleStartVisit(foundAppt);
          }}
        />
      )}

      {/* 3. Receipt / Invoice Modal */}
      {receiptModalData && (
        <PhysioReceiptModal
          isOpen={Boolean(receiptModalData)}
          onClose={() => setReceiptModalData(null)}
          receiptData={receiptModalData}
        />
      )}

      {/* 4. Notifications Center Modal */}
      {isNotificationsOpen && (
        <PhysioNotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onSelectAction={(tab) => setCurrentTab(tab)}
        />
      )}

      {/* 5. Mobile "All Features" Menu Sheet */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 border border-slate-100 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-700" />
                <h3 className="font-extrabold text-sm text-slate-900">Physiotherapist Workspace</h3>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Calendar },
                { id: 'requests', label: 'Booking Requests', icon: Inbox },
                { id: 'appointments', label: 'Appointments', icon: Clock },
                { id: 'visits', label: 'Home Visits', icon: Compass },
                { id: 'patients', label: 'Patient Directory', icon: Users },
                { id: 'clinical-assessment', label: 'Assessment', icon: FileText },
                { id: 'clinical-soap', label: 'SOAP & AI', icon: Activity },
                { id: 'movement-analysis', label: 'Movement Check', icon: Activity },
                { id: 'goals', label: 'Goals', icon: CheckCircle2 },
                { id: 'home-program', label: 'Exercise Program', icon: Dumbbell },
                { id: 'progress', label: 'Progress Tracking', icon: TrendingUp },
                { id: 'messages', label: 'Patient Messages', icon: MessageCircle },
                { id: 'reports', label: 'Reports & PDF', icon: Receipt },
                { id: 'earnings', label: 'Earnings & Invoices', icon: CreditCard },
                { id: 'follow-ups', label: 'Follow-ups', icon: AlertTriangle },
                { id: 'service-area', label: 'Service Coverage', icon: MapPin },
                { id: 'availability', label: 'Working Hours', icon: Clock },
                { id: 'profile', label: 'My Profile', icon: User }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsMobileDrawerOpen(false);
                    }}
                    className={`p-3 rounded-2xl flex items-center gap-2.5 text-left transition-all ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-2xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleLogoutClick}
              className="w-full py-2.5 bg-rose-50 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-rose-200 mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Portal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysioDashboard;
