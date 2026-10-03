import React, { useState } from 'react';
import { 
  Activity, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Stethoscope, 
  ArrowRight, 
  Sparkles, 
  Home, 
  Award, 
  TrendingUp, 
  Heart, 
  ChevronRight, 
  Info, 
  BookOpen, 
  Layers, 
  Compass, 
  AlertCircle 
} from 'lucide-react';
import { BookingRequest } from '../../types';

interface PublicHomePageProps {
  onStartBooking: (formData: Partial<BookingRequest>) => void;
  onNavigateToAuth: () => void;
  isAuthenticated: boolean;
  onNavigateToDashboard: () => void;
}

export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  onStartBooking,
  onNavigateToAuth,
  isAuthenticated,
  onNavigateToDashboard,
}) => {
  // Booking Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [age, setAge] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('Knee Pain / Post-Op Recovery');
  const [service, setService] = useState('Home Visit Physiotherapy');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Selected Service Detail Modal State
  const [activeServiceModal, setActiveServiceModal] = useState<any | null>(null);
  const [isTherapistModalOpen, setIsTherapistModalOpen] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobileNumber.trim() || !location.trim() || !preferredDate) {
      setFormError('Please fill in your name, mobile number, date, and visit location.');
      return;
    }

    setFormError(null);
    onStartBooking({
      name: fullName.trim(),
      phone: mobileNumber.trim(),
      age: age.trim() || '45',
      location: location.trim(),
      condition: condition.trim(),
      service: service,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      message: message.trim(),
      status: 'PENDING'
    });
  };

  const scrollToBooking = () => {
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const servicesList = [
    {
      id: 'ortho',
      title: 'Orthopedic Physiotherapy',
      tagline: 'Joint & bone mobility rehabilitation',
      bullets: ['Back Pain', 'Neck Pain', 'Shoulder Pain', 'Knee Pain', 'Joint Pain'],
      icon: Activity,
      description: 'Targeted assessment and manual techniques to alleviate joint stiffness, muscular strain, and chronic spinal tension.'
    },
    {
      id: 'neuro',
      title: 'Neurological Rehabilitation',
      tagline: 'Functional gait and neuromuscular retraining',
      bullets: ['Stroke Rehabilitation', 'Parkinson\'s Rehabilitation', 'Neurological Mobility Training'],
      icon: Compass,
      description: 'Neuromuscular facilitation and balance stabilization to rebuild motor patterns and regain independent home ambulation.'
    },
    {
      id: 'pediatric',
      title: 'Pediatric Physiotherapy',
      tagline: 'Childhood motor development & posture',
      bullets: ['Developmental Delay', 'Cerebral Palsy', 'Pediatric Motor Development'],
      icon: Heart,
      description: 'Gentle, play-based therapeutic exercises encouraging milestone attainment, core trunk control, and coordination.'
    },
    {
      id: 'geriatric',
      title: 'Geriatric Physiotherapy',
      tagline: 'Confidence, stability & fall prevention',
      bullets: ['Mobility', 'Balance', 'Strength', 'Fall Prevention'],
      icon: ShieldCheck,
      description: 'Care tailored for seniors to maintain bone density, preserve joint ranges, prevent domestic trips, and support daily independence.'
    },
    {
      id: 'sports',
      title: 'Sports Rehabilitation',
      tagline: 'Injury recovery & return-to-activity',
      bullets: ['Sports Injuries', 'Muscle & Joint Rehabilitation', 'Return-to-Activity Support'],
      icon: TrendingUp,
      description: 'Functional biomechanical reconditioning for ligament sprains, rotator cuff strains, and safe resumption of physical activity.'
    },
    {
      id: 'postop',
      title: 'Post-Operative Rehabilitation',
      tagline: 'Surgical recovery & milestone progression',
      bullets: ['Knee Replacement (TKA)', 'Hip Surgery', 'Fracture Rehabilitation', 'Post-Op Protocol Management'],
      icon: Award,
      description: 'Structured phase-by-phase recovery following orthopedic surgery, prioritizing early extension, scar mobilization, and swelling reduction.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-28 sm:pb-24 selection:bg-teal-500 selection:text-white">
      {/* ======================================================== */}
      {/* 1. PUBLIC APP HEADER */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-600/30">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                MOVRA
              </span>
              <span className="text-[10px] text-teal-700 font-semibold tracking-wide uppercase block">
                Movement & Rehabilitation Care
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={onNavigateToDashboard}
                className="py-1.5 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
              >
                <span>My Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={scrollToBooking}
                className="py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-teal-600/20 transition-all active:scale-95"
              >
                Book Visit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-5 space-y-9">
        {/* ======================================================== */}
        {/* 2. HERO SECTION */}
        {/* ======================================================== */}
        <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-9 shadow-xl shadow-teal-950/20 border border-teal-700/40 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-[11px] font-bold">
                <Home className="w-3.5 h-3.5 text-teal-300" />
                <span>Home Visit Physiotherapy Service</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Physiotherapy Care,<br />
                <span className="text-teal-300">Delivered to Your Home.</span>
              </h1>

              <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-md">
                Personalized physiotherapy and rehabilitation from qualified professionals, at your home.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  onClick={scrollToBooking}
                  className="py-3 px-5 bg-white text-teal-900 hover:bg-teal-50 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Book a Home Visit</span>
                  <ArrowRight className="w-4 h-4 text-teal-700" />
                </button>

                <a
                  href="tel:+919820144829"
                  className="py-3 px-4 bg-teal-700/60 hover:bg-teal-700/90 border border-teal-400/30 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-300" />
                  <span>Call Now</span>
                </a>

                <a
                  href="https://wa.me/919820144829?text=Hello%20MOVRA%2C%20I%20would%20like%20to%20inquire%20about%20a%20home%20visit%20physiotherapy%20session."
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 px-4 bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Column: Professional Home Visit Visual Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-white space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-400/20 border border-teal-300/40 flex items-center justify-center text-teal-200">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Licensed Practitioner</h3>
                    <p className="text-[11px] text-teal-200">Home Clinical Assessment</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  Verified Visit
                </span>
              </div>

              <div className="space-y-2 text-xs text-teal-100">
                <div className="flex items-center justify-between p-2 rounded-xl bg-teal-950/40 border border-white/5">
                  <span className="text-teal-200">Session Type:</span>
                  <span className="font-bold text-white">1-on-1 Bedside Care</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-teal-950/40 border border-white/5">
                  <span className="text-teal-200">Equipment:</span>
                  <span className="font-bold text-white">Clinical Assessment Kit</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-teal-950/40 border border-white/5">
                  <span className="text-teal-200">Companion App:</span>
                  <span className="font-bold text-teal-300">Daily Exercise Tracking</span>
                </div>
              </div>

              <p className="text-[10px] text-teal-200/80 italic text-center pt-1">
                "Movement • Recovery • Care"
              </p>
            </div>
          </div>

          {/* Trust Indicators Bar Below Hero */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 mt-6 border-t border-teal-700/50 text-[11px] font-medium text-teal-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Qualified Physiotherapy Care</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Home Visit Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Personalized Treatment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Progress Tracking</span>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. TRUST SECTION: "Care You Can Trust" */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-extrabold text-teal-700 uppercase tracking-wider block">
              Standards & Integrity
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Care You Can Trust
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your treatment is guided by a physiotherapist and supported by technology.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                title: 'Qualified Physiotherapists',
                desc: 'Assessed and treated by licensed physical therapy graduates.',
                icon: Award,
              },
              {
                title: 'Personalized Treatment Plans',
                desc: 'Specific exercise dosing matched to your stage of mobility.',
                icon: Stethoscope,
              },
              {
                title: 'Home-Based Rehabilitation',
                desc: 'Comfortable recovery in your familiar domestic environment.',
                icon: Home,
              },
              {
                title: 'Progress Monitoring',
                desc: 'Systematic tracking of joint range of motion and comfort scores.',
                icon: TrendingUp,
              },
              {
                title: 'Patient Education',
                desc: 'Clear guidance on post-op precautions and pacing strategies.',
                icon: BookOpen,
              },
              {
                title: 'Follow-up Support',
                desc: 'Consistent clinical reviews to adjust recovery milestones.',
                icon: Heart,
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-1.5 hover:border-teal-300 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-xs text-slate-800">{card.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>

          {/* AI Clinical Role Framing Statement */}
          <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-2xl text-xs text-teal-900 flex items-start gap-2 max-w-lg mx-auto">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>
              <strong>Clinical Responsibility:</strong> All assessments and protocols are directed by qualified physiotherapists. AI provides assistant support for education, reminders, and patient telemetry.
            </span>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. PHYSIOTHERAPIST PROFILE */}
        {/* ======================================================== */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-teal-700 uppercase tracking-wider block">
              Clinical Team
            </span>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Licensed Practitioner
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Meet Your Physiotherapist
          </h2>

          <div className="flex flex-col sm:flex-row items-start gap-4 pt-1">
            {/* Photo Placeholder */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-teal-800 to-teal-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-teal-800/20 shrink-0 border-2 border-white">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>

            <div className="space-y-1.5 flex-1">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Dr. Ananya Iyer, PT
                </h3>
                <p className="text-xs font-bold text-teal-700">
                  BPT, MPT • Physiotherapist & Rehabilitation Specialist
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-0.5">
                <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">8+ Years Experience</span>
                <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium">Orthopedic & Neuro Rehab</span>
                <span className="bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md font-bold">Metro Home Visit Zone</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                "Focused on personalized rehabilitation, mobility improvement, and functional recovery through evidence-guided bedside therapy and progressive conditioning."
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsTherapistModalOpen(true)}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all text-center"
            >
              View Profile
            </button>
            <button
              onClick={scrollToBooking}
              className="py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm text-center"
            >
              Book Home Visit
            </button>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. SERVICES SECTION */}
        {/* ======================================================== */}
        <section id="services-section" className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-extrabold text-teal-700 uppercase tracking-wider block">
              Clinical Specializations
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Physiotherapy Services
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Comprehensive home-based care tailored to orthopedic, neurological, and surgical recoveries.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {servicesList.map((serviceItem) => {
              const Icon = serviceItem.icon;
              return (
                <div
                  key={serviceItem.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-3 hover:border-teal-400 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 group-hover:bg-teal-600 text-teal-700 group-hover:text-white flex items-center justify-center border border-teal-200/60 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {serviceItem.title}
                      </h3>
                      <p className="text-[11px] text-teal-700 font-medium">
                        {serviceItem.tagline}
                      </p>
                    </div>

                    <div className="space-y-1 pt-1">
                      {serviceItem.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                          <span>{bullet}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setActiveServiceModal(serviceItem)}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                    >
                      <span>Learn More</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setService(serviceItem.title);
                        scrollToBooking();
                      }}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-900"
                    >
                      Book This
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. HOW MOVRA WORKS (4-STEP ONBOARDING FLOW) */}
        {/* ======================================================== */}
        <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-extrabold text-teal-700 uppercase tracking-wider block">
              Patient Journey
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              How MOVRA Works
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              A smooth 4-step process designed for comfort and structured rehabilitation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            {[
              {
                step: '01',
                title: 'Book a Home Visit',
                desc: 'Fill your preferred date and condition without needing upfront login.',
              },
              {
                step: '02',
                title: 'Physiotherapist Assessment',
                desc: 'A qualified professional visits your home to evaluate mobility and pain.',
              },
              {
                step: '03',
                title: 'Personalized Plan',
                desc: 'Receive tailored daily bedside exercises and milestone timelines.',
              },
              {
                step: '04',
                title: 'Track Your Progress',
                desc: 'Log compliance and measure degree range of motion in the companion app.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-2 relative"
              >
                <span className="text-2xl font-black text-teal-600/30 font-mono block">
                  {item.step}
                </span>
                <h3 className="font-extrabold text-xs text-slate-900">{item.title}</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 7. WHY CHOOSE MOVRA */}
        {/* ======================================================== */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-extrabold text-teal-700 uppercase tracking-wider block">
              Clinical Advantages
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Why Choose MOVRA?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              {
                icon: Home,
                title: 'Home-Based Care',
                desc: 'Professional physiotherapy without exhausting or hazardous clinic travel.',
              },
              {
                icon: Stethoscope,
                title: 'Personalized Care',
                desc: 'Treatment calibrated to individual tolerance, comorbidities, and surgical dates.',
              },
              {
                icon: TrendingUp,
                title: 'Progress Tracking',
                desc: 'Track important rehabilitation measures and recovery angles over time.',
              },
              {
                icon: Sparkles,
                title: 'AI-Assisted Support',
                desc: 'Technology supports patient education, tracking, and clinical workflow guidance.',
              },
              {
                icon: MessageCircle,
                title: 'Easy Communication',
                desc: 'Stay smoothly connected with your care team and session schedule.',
              },
              {
                icon: ShieldCheck,
                title: 'Safe Clinical Standards',
                desc: 'Protocols aligned with published orthopedic and physical therapy literature.',
              },
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-xs text-slate-800">{card.title}</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 8. BOOKING / CONTACT SECTION */}
        {/* ======================================================== */}
        <section id="booking-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg shadow-teal-950/5 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-extrabold text-teal-700 uppercase tracking-wider block">
              Appointment Request
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Book a Physiotherapy Home Visit
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Enter your appointment details below. No account needed to get started.
            </p>
          </div>

          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Patient or Caregiver Name"
                    required
                    className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Patient Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 64"
                  min={1}
                  max={120}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Preferred Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Preferred Time Slot *</label>
                <div className="relative">
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
                  >
                    <option value="09:00 AM">09:00 AM - Morning</option>
                    <option value="10:00 AM">10:00 AM - Morning</option>
                    <option value="11:30 AM">11:30 AM - Morning</option>
                    <option value="02:00 PM">02:00 PM - Afternoon</option>
                    <option value="04:30 PM">04:30 PM - Evening</option>
                    <option value="06:00 PM">06:00 PM - Evening</option>
                  </select>
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Visit Location / Area *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bandra West / Juhu / Full Address"
                    required
                    className="w-full py-2.5 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Service Category</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
                >
                  <option value="Home Visit Physiotherapy">Home Visit Physiotherapy (General)</option>
                  <option value="Post-Operative Rehabilitation">Post-Operative Rehabilitation (Knee/Hip/Fracture)</option>
                  <option value="Orthopedic Physiotherapy">Orthopedic Physiotherapy (Joint & Spine)</option>
                  <option value="Neurological Rehabilitation">Neurological Rehabilitation (Stroke/Parkinson)</option>
                  <option value="Geriatric Mobility & Balance">Geriatric Mobility & Balance</option>
                  <option value="Sports Injury Recovery">Sports Injury Recovery</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Condition / Main Concern *</label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="e.g. Knee replacement post-op day 14 / Lower back stiffness"
                required
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Additional Clinical Note (Optional)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Any surgery details, doctor recommendations, or special instructions..."
                rows={2}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm shadow-teal-600/30 transition-all active:scale-98"
            >
              <span>Continue Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Contact Action Bar */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="text-slate-400 font-medium">Need immediate assistance?</span>
            <a
              href="tel:+919820144829"
              className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" /> Call MOVRA
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="https://wa.me/919820144829?text=Hello%20MOVRA%2C%20I%20would%20like%20to%20inquire%20about%20a%20physiotherapy%20home%20visit."
              target="_blank"
              rel="noreferrer"
              className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp MOVRA
            </a>
          </div>
        </section>
      </main>

      {/* ======================================================== */}
      {/* 9. STICKY MOBILE BOTTOM CTA BAR */}
      {/* ======================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <a
              href="tel:+919820144829"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Call MOVRA"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/919820144829?text=Hello%20MOVRA%2C%20I%20would%20like%20to%20inquire%20about%20a%20physiotherapy%20home%20visit."
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={scrollToBooking}
            className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-teal-600/20 transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            <span>Book Home Visit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {!isAuthenticated ? (
            <button
              onClick={onNavigateToAuth}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={onNavigateToDashboard}
              className="py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 transition-colors"
            >
              Dashboard
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SERVICE DETAILS MODAL */}
      {/* ======================================================== */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">{activeServiceModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveServiceModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeServiceModal.description}
            </p>

            <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-700 block text-[11px]">Primary Indications:</span>
              {activeServiceModal.bullets.map((b: string, idx: number) => (
                <div key={idx} className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setService(activeServiceModal.title);
                setActiveServiceModal(null);
                scrollToBooking();
              }}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Select & Book Visit
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* THERAPIST BIO MODAL */}
      {/* ======================================================== */}
      {isTherapistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 border border-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900">Physiotherapist Profile</h3>
              <button
                onClick={() => setIsTherapistModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Dr. Ananya Iyer, PT</strong> holds a Bachelor and Master of Physiotherapy (BPT, MPT) with specialization in post-operative orthopedic recovery and neurological mobility.
              </p>
              <p>
                She has supervised over 1,200 post-surgical home visits for total knee arthroplasty (TKA), hip reconstructions, and spinal decompressions, focusing on neuromuscular re-education and safe functional ambulation.
              </p>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200/80 rounded-2xl text-[11px] text-teal-900">
              <span className="font-bold block">Service Hours:</span>
              Monday - Saturday: 8:00 AM - 7:00 PM (Prior appointment required)
            </div>

            <button
              onClick={() => {
                setIsTherapistModalOpen(false);
                scrollToBooking();
              }}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Book Home Visit with Dr. Ananya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicHomePage;
