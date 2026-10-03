import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Stethoscope, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  TrendingUp, 
  Volume2, 
  Heart, 
  Users, 
  Check, 
  Brain, 
  Baby, 
  Award,
  Star,
  ExternalLink,
  MessageCircle,
  Play
} from 'lucide-react';
import { BookingRequest } from '../types';

interface LandingPageProps {
  onStartBooking?: (data: Partial<BookingRequest>) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartBooking }) => {
  const navigate = useNavigate();

  // Booking Form State inside the Landing Page
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('52');
  const [selectedCondition, setSelectedCondition] = useState('Knee Pain / Post-Op Recovery');
  const [selectedArea, setSelectedArea] = useState('Kankarbagh');
  const [preferredDate, setPreferredDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Active Service Card details modal
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number | null>(null);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      setFormError('Please provide your name and phone number so our clinical coordinator can confirm.');
      return;
    }
    setFormError(null);

    const bookingPayload: Partial<BookingRequest> = {
      name: patientName.trim(),
      phone: patientPhone.trim(),
      age: patientAge,
      condition: selectedCondition,
      location: `${selectedArea}, Patna`,
      service: 'Home Visit Physiotherapy',
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      message: additionalNotes.trim(),
      status: 'PENDING'
    };

    if (onStartBooking) {
      onStartBooking(bookingPayload);
    } else {
      setBookingSuccess(true);
    }
  };

  const scrollToBooking = () => {
    const el = document.getElementById('booking-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 4 Core Specialized Clinical Services
  const services = [
    {
      id: 'ortho',
      title: 'Orthopedic Physiotherapy',
      category: 'Musculoskeletal & Post-Op',
      icon: Activity,
      color: 'from-teal-600 to-emerald-600',
      tagline: 'Joint mobilization, spinal alignment & post-surgical recovery',
      conditions: [
        'Total Knee Replacement (TKA)',
        'Hip Arthroplasty',
        'Cervical & Lumbar Spondylosis',
        'Sciatica & Chronic Disc Herniation',
        'Rotator Cuff & Frozen Shoulder'
      ],
      description: 'Evidence-based manual joint mobilization, supervised resistive kinetic training, and computer-assisted goniometry designed to rebuild pain-free functional mobility.'
    },
    {
      id: 'neuro',
      title: 'Neurological Rehabilitation',
      category: 'Central & Peripheral Neural Rehab',
      icon: Brain,
      color: 'from-cyan-600 to-blue-600',
      tagline: 'Motor relearning, gait retraining & neuromuscular facilitation',
      conditions: [
        'Post-Stroke Hemiplegia',
        'Parkinson’s Disease Balance Rehab',
        'Spinal Cord Injury Mobility',
        'Peripheral Neuropathy & Foot Drop',
        'Bell’s Palsy Facial Retraining'
      ],
      description: 'Neuroplasticity-driven therapeutic protocols focused on restoring reciprocal limb activation, postural righting reflexes, balance coordination, and functional independence at home.'
    },
    {
      id: 'pediatric',
      title: 'Pediatric Physiotherapy',
      category: 'Early Developmental Therapy',
      icon: Baby,
      color: 'from-amber-500 to-orange-500',
      tagline: 'Developmental milestones, posture correction & sensory motor play',
      conditions: [
        'Developmental Delay & Milestones',
        'Cerebral Palsy Spasticity Care',
        'Congenital Muscular Torticollis',
        'Gait Pattern Anomalies (Toe Walking)',
        'Pediatric Sports Injury Recovery'
      ],
      description: 'Compassionate, play-integrated physiotherapy designed to accelerate gross motor milestones, correct muscle imbalances, and improve coordination in the comfort of family surroundings.'
    },
    {
      id: 'geriatric',
      title: 'Geriatric Rehabilitation',
      category: 'Active Aging & Balance Care',
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      tagline: 'Fall prevention, osteo-preservation & mobility continuity',
      conditions: [
        'Severe Osteoarthritis Management',
        'Balance Disorders & Fall Prevention',
        'Post-Fracture Bedside Recovery',
        'Deconditioning & Frailty Rehab',
        'Cardiopulmonary Endurance Retraining'
      ],
      description: 'Gentle, high-safety home visits to restore strength, minimize fall risks, maintain independent transfers, and dramatically enhance quality of life for senior loved ones.'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* ======================================================== */}
      {/* 1. HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-teal-200/40 via-emerald-100/30 to-sky-100/30 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Clinical Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-teal-200/80 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-teal-900 tracking-tight">
                Verified Home Care in Patna &amp; Surrounding Areas
              </span>
              <span className="text-[10px] uppercase font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                Licensed
              </span>
            </div>

            {/* High-Impact Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Recover Faster at Home with{' '}
              <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                AI-Powered
              </span>{' '}
              Physiotherapy
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Personalized rehabilitation plans, 24/7 AI voice support, and licensed physiotherapist oversight — delivered safely to your doorstep.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={scrollToBooking}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 hover:from-teal-800 hover:to-teal-950 text-white font-extrabold text-sm shadow-xl shadow-teal-900/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-teal-300" />
                <span>Book Home Visit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-teal-900 font-extrabold text-sm border-2 border-teal-700/30 hover:border-teal-700 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Try AI Physio</span>
              </Link>
            </div>

            {/* Verified Practitioner Guarantee Text */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Licensed BPT / MPT Therapists</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Travel Burden for Patients</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Evidence-Based Goniometry</span>
              </div>
            </div>
          </div>

          {/* Right Visual: Premium App Interface Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              {/* Glassmorphic Background Card */}
              <div className="relative bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.25)] border border-teal-500/20 space-y-5">
                {/* Header Strip inside mockup */}
                <div className="flex items-center justify-between border-b border-teal-800/60 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300">
                      <Activity className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white tracking-tight">Active Telemetry</h4>
                      <p className="text-[11px] text-teal-300/80 font-medium">Day 14 • Knee Extension Protocol</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                    Live ROM
                  </span>
                </div>

                {/* Goniometer Dial Mockup */}
                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700/60 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-bold">Knee Flexion Angle</span>
                    <span className="text-teal-300 font-mono font-bold">Target: 120°</span>
                  </div>
                  
                  {/* Angle Meter */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-3xl font-black text-white font-mono">88°</span>
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> +14° this week
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full" style={{ width: '73%' }} />
                    </div>
                  </div>
                </div>

                {/* AI Physio Live Audio Consultation Card */}
                <div className="bg-gradient-to-r from-teal-900/60 to-emerald-950/60 rounded-2xl p-4 border border-teal-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-teal-200">AI Physio Voice Guidance</span>
                    </div>
                    <span className="text-[10px] text-teal-300 font-mono bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-600/40">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-900/40 p-2.5 rounded-xl border border-teal-500/10">
                    "Excellent quadriceps lock, Rahul. Maintain this 0° extension hold for 5 more seconds."
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-teal-300/70 pt-1 font-medium">
                    <span>Clinical Protocol: TKA Stage 2</span>
                    <span className="text-emerald-300">Therapist Verified ✓</span>
                  </div>
                </div>

                {/* Floating Practitioner Badge */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                    AI
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">Supervised by Dr. Ananya Iyer, PT</p>
                    <p className="text-[10px] text-teal-300 truncate">Senior Rehabilitation Consultant • City Ortho</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              </div>

              {/* Decorative accent element */}
              <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-emerald-500/20 rounded-3xl blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. TRUST SECTION */}
      {/* ======================================================== */}
      <section className="bg-white border-y border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Trust Item 1 */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-teal-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-teal-100/80 text-teal-800 flex items-center justify-center mb-3">
                <Stethoscope className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Licensed Practitioners</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Every physiotherapist is BPT/MPT certified &amp; background verified.
              </p>
            </div>

            {/* Trust Item 2 */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-teal-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">100% Secure &amp; Private</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Encrypted clinical documentation and HIPAA-compliant data security.
              </p>
            </div>

            {/* Trust Item 3 */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-teal-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-teal-100/80 text-teal-800 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">AI-Powered Care</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                24/7 intelligent exercise guidance, goniometry, and recovery memory.
              </p>
            </div>

            {/* Trust Item 4 */}
            <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-teal-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-sky-100/80 text-sky-800 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Rapid Home Visits</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Same-day &amp; scheduled visits across Kankarbagh, Boring Rd &amp; Rajendra Nagar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HOW IT WORKS (3 STEPS) */}
      {/* ======================================================== */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-teal-100 text-teal-900 tracking-wider">
            Simple 3-Step Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How Movra Rebuilds Your Mobility
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Seamless integration between clinical in-home hands-on care and intelligent daily rehabilitation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative group hover:-translate-y-1.5 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 font-black text-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Book a Physio Assessment</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Choose your date and home address. A licensed physiotherapist visits your home equipped with clinical goniometers and rehabilitation gear.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-teal-700">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Full subjective &amp; ROM diagnosis</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-7 border border-teal-200/90 shadow-[0_8px_30px_rgba(13,148,136,0.08)] relative group hover:-translate-y-1.5 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white font-black text-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md shadow-teal-700/20">
              2
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Get Your AI-Personalized Plan</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Your clinician inputs findings into Movra. Our clinical system generates a tailored home program with target angles, rep tempos, and safety guardrails.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-teal-700">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>SOAP-verified clinical protocols</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative group hover:-translate-y-1.5 transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Daily Exercises with AI Voice Guidance</h3>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Open your phone daily. AI voice counts reps, analyzes your joint range, flags compensatory movement, and automatically updates your therapist.
            </p>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-teal-700">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>24/7 real-time voice feedback</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SERVICES SECTION */}
      {/* ======================================================== */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/60 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-teal-100 text-teal-900 tracking-wider">
              Specialized Care
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Comprehensive Clinical Services
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Expert physical therapy delivered in home privacy, tailored specifically to your medical diagnosis.
            </p>
          </div>

          {/* Modern Grid with Hover Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((srv, idx) => {
              const IconComp = srv.icon;
              return (
                <div
                  key={srv.id}
                  className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-teal-400 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-5">
                    {/* Header with icon and category */}
                    <div className="flex items-start justify-between">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${srv.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                        <IconComp className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                        {srv.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-teal-800 transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-xs font-semibold text-teal-700 mt-1">
                        {srv.tagline}
                      </p>
                      <p className="text-sm text-slate-600 mt-3 leading-relaxed font-medium">
                        {srv.description}
                      </p>
                    </div>

                    {/* Conditions Treated Chips */}
                    <div className="pt-2">
                      <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block mb-2">
                        Common Conditions:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {srv.conditions.map((c, i) => (
                          <span
                            key={i}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={scrollToBooking}
                      className="text-xs font-extrabold text-teal-800 hover:text-teal-950 flex items-center gap-1.5 cursor-pointer group-hover:translate-x-1 transition-transform"
                    >
                      <span>Book Assessment for this Condition</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono font-bold text-slate-400">Home Care</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. MEET THE TEAM SECTION */}
      {/* ======================================================== */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-teal-100 text-teal-900 tracking-wider">
            Clinical Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Meet Your Home Care Clinician
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Supervised by experienced, credentialed physical therapists dedicated to home visit excellence.
          </p>
        </div>

        {/* Featured Clinician Card: Dr. Ananya Iyer */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            {/* Clinician Photo / Avatar Column */}
            <div className="md:col-span-5 bg-gradient-to-tr from-teal-900 via-teal-800 to-slate-900 p-8 flex flex-col justify-between text-white relative">
              <div className="space-y-4">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white font-black text-3xl flex items-center justify-center shadow-lg border-2 border-white/20">
                  <Stethoscope className="w-12 h-12" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-extrabold text-white">Dr. Ananya Iyer</h3>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-teal-200 mt-0.5">
                    BPT, MPT (Orthopedics &amp; Neuro Rehab)
                  </p>
                  <span className="text-[10px] font-mono text-teal-300/80 block mt-1">
                    Reg No: PT-IN-88921-A (Licensed Practitioner)
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-teal-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-200">Clinical Experience:</span>
                  <span className="font-bold font-mono text-white">8+ Years</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-200">Home Visits Completed:</span>
                  <span className="font-bold font-mono text-emerald-300">1,200+ Visits</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-200">Patient Satisfaction:</span>
                  <span className="font-bold font-mono text-amber-300">4.9 / 5.0 ★</span>
                </div>
              </div>
            </div>

            {/* Clinician Bio & Details Column */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                    Lead Consultant Physiotherapist
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Patna Service Hub</span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  "Rehabilitation produces the fastest, longest-lasting outcomes when patients can recover comfortably in their natural daily living environment. At Movra, I bring clinic-grade assessment tools right to your bedside, augmented by AI exercise tracking so you are never left guessing between our visits."
                </p>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">
                    Core Specializations:
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-700">
                    <span className="bg-slate-100 px-3 py-1.5 rounded-xl">Post-TKA &amp; Total Hip Mobility</span>
                    <span className="bg-slate-100 px-3 py-1.5 rounded-xl">Spinal Disc &amp; Sciatica Care</span>
                    <span className="bg-slate-100 px-3 py-1.5 rounded-xl">Post-Stroke Gait Retraining</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={scrollToBooking}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Home Visit with Dr. Iyer</span>
                </button>

                <a
                  href="tel:+919876543210"
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>Call Coordinator</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. INTERACTIVE BOOKING SECTION */}
      {/* ======================================================== */}
      <section id="booking-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-teal-100 text-teal-900 tracking-wider">
                Doorstep Rehabilitation
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Schedule Your Home Visit Assessment
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                Our clinical coordinator will contact you to confirm therapist arrival time.
              </p>
            </div>

            {bookingSuccess ? (
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-teal-700 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-extrabold text-teal-900">Booking Request Received!</h3>
                <p className="text-xs text-teal-700 max-w-md mx-auto">
                  Thank you, <span className="font-bold">{patientName}</span>. Your request for {selectedCondition} in {selectedArea} on {preferredDate} at {preferredTime} has been dispatched to Dr. Ananya Iyer's caseload.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setBookingSuccess(false)}
                    className="text-xs font-bold text-teal-800 underline hover:text-teal-950"
                  >
                    Submit another request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs font-bold text-slate-900 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      Contact Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 text-xs font-bold text-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      Primary Condition
                    </label>
                    <select
                      value={selectedCondition}
                      onChange={(e) => setSelectedCondition(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-600 text-xs font-bold text-slate-900 outline-none transition-all"
                    >
                      <option value="Knee Pain / Post-Op Recovery">Knee Pain / Post-Op Recovery</option>
                      <option value="Lower Back & Sciatica">Lower Back &amp; Sciatica</option>
                      <option value="Frozen Shoulder & Neck Pain">Frozen Shoulder &amp; Neck Pain</option>
                      <option value="Post-Stroke Neurological Rehab">Post-Stroke Neurological Rehab</option>
                      <option value="Geriatric Mobility & Balance">Geriatric Mobility &amp; Balance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      Service Area (Patna)
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-600 text-xs font-bold text-slate-900 outline-none transition-all"
                    >
                      <option value="Kankarbagh">Kankarbagh</option>
                      <option value="Boring Road">Boring Road</option>
                      <option value="Rajendra Nagar">Rajendra Nagar</option>
                      <option value="Bailey Road">Bailey Road</option>
                      <option value="Patliputra Colony">Patliputra Colony</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      Patient Age
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 64"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-600 text-xs font-bold text-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-600 text-xs font-bold text-slate-900 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                      Preferred Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-600 text-xs font-bold text-slate-900 outline-none transition-all"
                    >
                      <option value="09:00 AM">09:00 AM (Morning)</option>
                      <option value="10:00 AM">10:00 AM (Morning)</option>
                      <option value="12:00 PM">12:00 PM (Noon)</option>
                      <option value="04:00 PM">04:00 PM (Evening)</option>
                      <option value="06:00 PM">06:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5">
                    Specific Symptoms / Doctor's Prescription (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Right total knee replacement surgery 2 weeks ago, doctor advised starting gentle active ROM..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-600 text-xs font-medium text-slate-900 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 hover:from-teal-800 hover:to-teal-950 text-white font-extrabold text-sm shadow-lg shadow-teal-900/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-teal-300" />
                  <span>Confirm Home Visit Booking Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FOOTER */}
      {/* ======================================================== */}
      <footer id="contact" className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black">
                  <Activity className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xl font-black text-white tracking-tight">MOVRA</span>
                  <span className="text-xs text-teal-400 font-bold block -mt-1">
                    Movement &amp; Rehabilitation Care
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Next-generation home-visit physiotherapy and AI-assisted clinical rehabilitation. Bridging the gap between hands-on clinical therapy and daily home adherence.
              </p>
              <div className="pt-2 text-xs text-slate-500 font-mono">
                Patna Service Center: Kankarbagh Main Rd, Patna, Bihar
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-extrabold uppercase text-white tracking-wider">
                Clinical Services
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#services" className="hover:text-teal-400 transition-colors">Orthopedic Rehabilitation</a></li>
                <li><a href="#services" className="hover:text-teal-400 transition-colors">Neurological Physio</a></li>
                <li><a href="#services" className="hover:text-teal-400 transition-colors">Pediatric Motor Care</a></li>
                <li><a href="#services" className="hover:text-teal-400 transition-colors">Geriatric Fall Prevention</a></li>
                <li><a href="#services" className="hover:text-teal-400 transition-colors">Post-Surgical Knee &amp; Hip</a></li>
              </ul>
            </div>

            {/* Platform & Account Column */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-extrabold uppercase text-white tracking-wider">
                Access &amp; Inquiries
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-teal-400 transition-colors">Patient Sign In</Link></li>
                <li><Link to="/login" className="hover:text-teal-400 transition-colors">Physiotherapist Portal</Link></li>
                <li><Link to="/signup" className="hover:text-teal-400 transition-colors">Create Patient Account</Link></li>
                <li><a href="tel:+919876543210" className="hover:text-teal-400 transition-colors">Coordinator Helpline: +91 98765 43210</a></li>
              </ul>
            </div>
          </div>

          {/* Clinical Disclaimer & Copyright */}
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-[11px] text-slate-500 max-w-2xl text-center md:text-left">
              <strong className="text-slate-400">Clinical Safety Notice:</strong> MOVRA is an AI-assisted physiotherapy platform. AI suggestions and telemetry do not replace clinical judgment or diagnosis by a licensed medical practitioner.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              © {new Date().getFullYear()} MOVRA AI Physio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
