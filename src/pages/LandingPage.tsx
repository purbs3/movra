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
  ChevronDown,
  TrendingUp, 
  Volume2, 
  Heart, 
  Users, 
  Check, 
  Brain, 
  Baby, 
  Award,
  Star,
  MessageCircle,
  Play,
  FileText,
  UserCheck,
  Compass,
  CornerDownRight,
  HelpCircle,
  X,
  ExternalLink
} from 'lucide-react';
import { MOVRA_CONFIG, ServiceItem, PhysioProfile } from '../config/movraConfig';
import { BookingRequest } from '../types';

interface LandingPageProps {
  onStartBooking?: (data: Partial<BookingRequest>) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartBooking }) => {
  const navigate = useNavigate();

  // Booking Flow State (4 Steps)
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCondition, setSelectedCondition] = useState('Knee & Joint Pain');
  const [selectedArea, setSelectedArea] = useState('Kankarbagh');
  const [patientAddress, setPatientAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('58');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Active Service Modal / Drawer State
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);

  // Active FAQ Accordion State
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Handle WhatsApp Booking Handoff
  const handleWhatsAppBooking = (customMessage?: string) => {
    const message = customMessage || `${MOVRA_CONFIG.brand.whatsappDefaultMessage} (Condition: ${selectedCondition}, Area: ${selectedArea}, Preferred Date: ${preferredDate})`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${MOVRA_CONFIG.brand.whatsappNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Submit Booking Form
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim()) {
      setBookingError('Please enter your full name and phone number to confirm the booking.');
      return;
    }
    setBookingError(null);
    setIsSubmitting(true);

    const bookingPayload: Partial<BookingRequest> = {
      name: patientName.trim(),
      phone: patientPhone.trim(),
      age: patientAge,
      condition: selectedCondition,
      location: `${patientAddress ? patientAddress + ', ' : ''}${selectedArea}, Patna`,
      service: 'Home Visit Physiotherapy',
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      message: clinicalNotes.trim(),
      status: 'PENDING'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      if (onStartBooking) {
        onStartBooking(bookingPayload);
      } else {
        setBookingSuccess(true);
      }
    }, 400);
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 selection:bg-teal-100 selection:text-teal-900">
      {/* ======================================================== */}
      {/* 1. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section id="hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Clinical Position Tag */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200/90 rounded-lg px-3 py-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-teal-600"></span>
              <span>Evidence-Based Home Care in Patna</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-teal-800 font-bold">Licensed BPT / MPT Clinicians</span>
            </div>

            {/* Core Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12]">
              Physiotherapy, delivered to your home.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl">
              Evidence-based rehabilitation with qualified physiotherapists, structured care plans, and intelligent recovery tracking — right where you heal best.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={() => scrollToSection('booking-section')}
                className="px-7 py-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-teal-400" />
                <span>Book Home Visit</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                className="px-6 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>See How MOVRA Works</span>
              </button>

              <button
                onClick={() => handleWhatsAppBooking()}
                className="px-4 py-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200/90 transition-all flex items-center justify-center gap-2"
                title="Book via WhatsApp handoff"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Book via WhatsApp</span>
              </button>
            </div>

            {/* Capability Indicators */}
            <div className="pt-3 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-700 stroke-[2.5]" />
                <span>Zero clinic travel for post-op patients</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-700 stroke-[2.5]" />
                <span>Bedside goniometry &amp; manual therapy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-teal-700 stroke-[2.5]" />
                <span>Clinical oversight between home visits</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column: Realistic Clinical Bedside Interaction Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-[0_12px_40px_rgba(15,23,42,0.06)] p-6 space-y-5">
              {/* Clinical Session Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Clinical Home Assessment</h2>
                    <p className="text-[11px] text-slate-500">Dr. Ananya Iyer, PT · Kankarbagh</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    Day 14 Post-Op
                  </span>
                </div>
              </div>

              {/* Realistic Knee Extension Metric Dial */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Active Knee Flexion Measurement</span>
                  <span className="font-mono text-slate-500 text-[11px]">Clinical Target: 120°</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-slate-950 font-mono tracking-tight">88°</span>
                    <span className="text-xs font-semibold text-teal-800 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +14° since Day 7 visit
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-700 rounded-full" style={{ width: '73%' }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Initial Baseline: 45°</span>
                  <span>Extension Lag: -3° (Clearing)</span>
                </div>
              </div>

              {/* Prescribed Protocol Summary */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">Today's Home Protocol</span>
                  <span className="text-[11px] text-teal-700 font-semibold">3 of 4 Completed</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-800">Seated Active Heel Slides</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">3 sets · 10 reps</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium text-slate-800">Terminal Knee Extension</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">5-sec hold</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center"></div>
                      <span className="font-medium text-slate-700">Straight Leg Raises</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">Evening routine</span>
                  </div>
                </div>
              </div>

              {/* Clinician Oversight Statement */}
              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/60 flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-teal-800 shrink-0" />
                <p className="text-xs text-teal-900 leading-relaxed font-medium">
                  Supervised by licensed physical therapists. Every protocol is adjusted to patient tolerance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. TRUST STRIP (Section 4)                               */}
      {/* ======================================================== */}
      <section className="bg-white border-y border-slate-200/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 items-start">
            <div className="space-y-1.5 text-left">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 mb-2">
                <Award className="w-4 h-4 text-teal-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Qualified Physiotherapists</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Licensed BPT and MPT clinicians with verified clinical credentials.
              </p>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 mb-2">
                <FileText className="w-4 h-4 text-teal-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Structured Care Plans</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Objective milestone pathways designed around your specific diagnosis.
              </p>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 mb-2">
                <MapPin className="w-4 h-4 text-teal-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Home-Based Rehabilitation</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Safe, bedside physical therapy without traffic or clinic waiting rooms.
              </p>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 mb-2">
                <Activity className="w-4 h-4 text-teal-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Recovery Tracking</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Daily exercise adherence and pain tracking visible to your physiotherapist.
              </p>
            </div>

            <div className="space-y-1.5 text-left col-span-2 md:col-span-1">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 mb-2">
                <Heart className="w-4 h-4 text-teal-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Patient-Centered Care</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Compassionate one-on-one sessions adapted to individual recovery pace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. SERVICES (Section 5 - 8 Categories)                    */}
      {/* ======================================================== */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-left max-w-2xl space-y-2 mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Specialized Home Programs</p>
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Clinical Rehabilitation Services
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Evidence-based physical therapy protocols delivered to your home by specialized practitioners.
          </p>
        </div>

        {/* 8 Clean Refined Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOVRA_CONFIG.services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-teal-50 flex items-center justify-center text-slate-800 group-hover:text-teal-800 transition-colors">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    {srv.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {srv.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {srv.shortDesc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveServiceModal(srv)}
                  className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Program</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-slate-400 font-medium">{srv.sessionDuration}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. HOW MOVRA WORKS (Section 6 - 5 Steps Timeline)         */}
      {/* ======================================================== */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Step-by-Step Experience</p>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              How MOVRA Works
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              From your first symptom consultation to independent mobility, we make home rehabilitation seamless.
            </p>
          </div>

          {/* Desktop Horizontal / Mobile Vertical 5-Step Process */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {MOVRA_CONFIG.howItWorksSteps.map((s, idx) => (
              <div 
                key={s.step} 
                className="relative bg-slate-50/70 p-5 rounded-xl border border-slate-200/70 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black font-mono text-slate-900 block mb-2">
                    {s.step}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 font-normal">
                    {s.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                  {s.clinicalDetail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. MOVRA INTELLIGENCE (Section 7)                         */}
      {/* ======================================================== */}
      <section id="movra-intelligence" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-12">
          <div className="text-left max-w-3xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Assistive Technology Layer</p>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              MOVRA Intelligence
            </h2>
            <p className="text-base text-slate-600 font-medium">
              Technology that supports better rehabilitation — without replacing clinical judgment.
            </p>
          </div>

          {/* Clinical Pipeline Architecture Diagram */}
          <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-10 border border-slate-800 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {MOVRA_CONFIG.intelligencePipeline.map((p, idx) => (
                <div 
                  key={p.step} 
                  className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono text-teal-400 block">Step 0{p.step}</span>
                    <h3 className="text-sm font-bold text-white">{p.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Role: {p.role}
                  </div>
                </div>
              ))}
            </div>

            {/* Core Architectural Guardrail Statement */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
                <p className="text-xs text-slate-300 font-medium">
                  <strong>Clinical Governance Notice:</strong> AI assists the care team with symptom organization, compliance logs, and documentation drafts. Final clinical decisions remain with qualified physiotherapists.
                </p>
              </div>
              <button
                onClick={() => scrollToSection('team')}
                className="text-xs font-bold text-teal-400 hover:text-teal-300 shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>View Clinical Team</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. CLINICAL CREDIBILITY (Section 13)                      */}
      {/* ======================================================== */}
      <section id="credibility" className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Evidence-Based Foundation</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Built Around Clinical Rehabilitation
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              MOVRA combines professional physiotherapy with structured digital tools to make rehabilitation more accessible, trackable, and convenient.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { title: "Musculoskeletal (MSK)", desc: "Spine, disc, and joint biomechanics" },
              { title: "Neurological", desc: "Motor relearning and gait facilitation" },
              { title: "Sports Rehabilitation", desc: "Ligament and return-to-play protocols" },
              { title: "Post-Operative Care", desc: "TKA, THA, and surgical recovery" },
              { title: "Geriatric Mobility", desc: "Fall prevention and safe ambulation" },
              { title: "Functional Mobility", desc: "Posture, transfer, and stair stamina" }
            ].map((f, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-left space-y-1">
                <span className="text-xs font-bold text-slate-900 block">{f.title}</span>
                <span className="text-[11px] text-slate-500 leading-tight block">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. MEET YOUR PHYSIOTHERAPIST (Section 12)                */}
      {/* ======================================================== */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-12">
          <div className="text-left max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Licensed Clinical Team</p>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Meet Your Physiotherapist
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Qualified physiotherapists dedicated to home visits across Patna. Verified credentials, structured protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOVRA_CONFIG.physiotherapists.map((pt) => (
              <div 
                key={pt.id} 
                className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-2xs space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{pt.name}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{pt.qualification}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      Verified PT
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {pt.bio}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Experience:</span>
                      <span className="font-semibold text-slate-800">{pt.experienceYears}+ Years</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Service Areas:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">{pt.serviceAreas.join(', ')}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Next Slot:</span>
                      <span className="font-semibold text-teal-800">{pt.nextSlot}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => scrollToSection('booking-section')}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-400" />
                  <span>Book Visit with {pt.name.split(' ')[1] || 'Physio'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. TRANSPARENT PRICING (Section 14)                      */}
      {/* ======================================================== */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-left max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Clear &amp; Configurable Rates</p>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Transparent Home Visit Pricing
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              No hidden travel fees or clinic surcharges. Everything required for evidence-based home recovery is included.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Initial Assessment Tier */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">First Session</span>
                  <h3 className="text-lg font-bold text-slate-900">{MOVRA_CONFIG.pricing.initialAssessment.label}</h3>
                  <p className="text-xs text-slate-500 mt-1">{MOVRA_CONFIG.pricing.initialAssessment.subtitle}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-950">
                    {MOVRA_CONFIG.pricing.initialAssessment.currency}{MOVRA_CONFIG.pricing.initialAssessment.amount}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ {MOVRA_CONFIG.pricing.initialAssessment.duration}</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs">
                  {MOVRA_CONFIG.pricing.initialAssessment.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-600">
                      <Check className="w-3.5 h-3.5 text-teal-700 mt-0.5 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => scrollToSection('booking-section')}
                className="w-full py-3 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Book Initial Assessment
              </button>
            </div>

            {/* Follow-Up Session Tier */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200/80 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Per-Visit</span>
                  <h3 className="text-lg font-bold text-slate-900">{MOVRA_CONFIG.pricing.followUpSession.label}</h3>
                  <p className="text-xs text-slate-500 mt-1">{MOVRA_CONFIG.pricing.followUpSession.subtitle}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-950">
                    {MOVRA_CONFIG.pricing.followUpSession.currency}{MOVRA_CONFIG.pricing.followUpSession.amount}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/ {MOVRA_CONFIG.pricing.followUpSession.duration}</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs">
                  {MOVRA_CONFIG.pricing.followUpSession.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-600">
                      <Check className="w-3.5 h-3.5 text-teal-700 mt-0.5 shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => scrollToSection('booking-section')}
                className="w-full py-3 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Book Follow-Up Visit
              </button>
            </div>

            {/* 6-Session Pathway */}
            <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-teal-400 uppercase tracking-wider">Package</span>
                    <span className="text-[10px] font-bold text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                      {MOVRA_CONFIG.pricing.packageTier.savings}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{MOVRA_CONFIG.pricing.packageTier.label}</h3>
                  <p className="text-xs text-slate-400 mt-1">{MOVRA_CONFIG.pricing.packageTier.subtitle}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">
                    {MOVRA_CONFIG.pricing.packageTier.currency}{MOVRA_CONFIG.pricing.packageTier.amount}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ {MOVRA_CONFIG.pricing.packageTier.sessionsCount} Sessions</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                    <span>Dedicated primary physiotherapist throughout</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                    <span>Continuous daily recovery tracking &amp; chat</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />
                    <span>Flexible session rescheduling without penalty</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => scrollToSection('booking-section')}
                className="w-full py-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 font-extrabold text-xs transition-colors cursor-pointer"
              >
                Inquire for 6-Session Pathway
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. PATIENT STORIES (Section 15 - Clearly Marked Demo)    */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="space-y-12">
          <div className="text-left max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Recovery Experiences</p>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Patient Recovery Pathways
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Realistic rehabilitation timelines observed across home physiotherapy protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOVRA_CONFIG.demoPatientStories.map((story) => (
              <div 
                key={story.id} 
                className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                      {story.tag}
                    </span>
                    <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                      {story.condition}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{story.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                  <span className="font-bold text-slate-800 block">{story.patientProfile}</span>
                  <span className="text-[11px] text-teal-700 font-medium block">
                    Outcome: {story.recoveryHighlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. BOOKING EXPERIENCE (Section 10 - Streamlined 4 Steps)  */}
      {/* ======================================================== */}
      <section id="booking-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-md space-y-8">
            <div className="text-left space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Step-by-Step Scheduling</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Book a Home Physiotherapy Visit
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Choose your condition and preferred date. A clinical coordinator will confirm therapist arrival within 2 hours.
              </p>
            </div>

            {bookingSuccess ? (
              <div className="p-8 rounded-xl bg-teal-50/80 border border-teal-200 space-y-4 text-center">
                <div className="w-12 h-12 rounded-full bg-teal-700 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Home Visit Request Submitted</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{patientName}</strong>. Your home visit request for <strong>{selectedCondition}</strong> in <strong>{selectedArea}</strong> on <strong>{preferredDate} at {preferredTime}</strong> has been received. Our clinical coordinator will call {patientPhone} to confirm clinician assignment.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => handleWhatsAppBooking(`Hi MOVRA team, I just submitted a booking for ${patientName} (${selectedCondition}) in ${selectedArea}. Please confirm arrival time.`)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Follow Up on WhatsApp</span>
                  </button>
                  <button
                    onClick={() => { setBookingSuccess(false); setBookingStep(1); }}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
                  >
                    Book another session
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {bookingError && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800">
                    {bookingError}
                  </div>
                )}

                {/* Step 1: Select your problem */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Step 1: Select your condition / recovery area
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      'Back / Neck Pain',
                      'Knee & Joint Pain',
                      'Sports Injury',
                      'Stroke / Neuro Rehabilitation',
                      'Post-operative Rehabilitation',
                      'Geriatric / Balance',
                      'Other General Condition'
                    ].map((cond) => (
                      <button
                        type="button"
                        key={cond}
                        onClick={() => setSelectedCondition(cond)}
                        className={`p-3 rounded-lg border text-left font-semibold transition-colors cursor-pointer ${
                          selectedCondition === cond 
                            ? 'bg-slate-950 text-white border-slate-950 shadow-2xs' 
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Location in Patna */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                      Step 2: Service Area (Patna)
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                    >
                      {MOVRA_CONFIG.coverageAreas.map((area) => (
                        <option key={area.id} value={area.name}>
                          {area.name} (Coverage Active)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                      House / Flat / Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 302, Green Meadows, Road No 4"
                      value={patientAddress}
                      onChange={(e) => setPatientAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                    />
                  </div>
                </div>

                {/* Step 3: Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                      Step 3: Preferred Date
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wider">
                      Preferred Time Slot
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                    >
                      <option value="09:00 AM">09:00 AM – 10:00 AM</option>
                      <option value="10:30 AM">10:30 AM – 11:30 AM</option>
                      <option value="12:00 PM">12:00 PM – 01:00 PM</option>
                      <option value="04:00 PM">04:00 PM – 05:00 PM</option>
                      <option value="05:30 PM">05:30 PM – 06:30 PM</option>
                      <option value="07:00 PM">07:00 PM – 08:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Patient Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98201 44829"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Patient Age
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 58"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Brief Surgery / Symptom Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Knee replacement surgery performed 12 days ago; doctor advised starting bedside passive flexion..."
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-normal text-slate-900 outline-none focus:bg-white focus:border-teal-700"
                  />
                </div>

                {/* Booking Summary Box (Step 4 Review) */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-2">
                  <span className="font-bold text-slate-900 block">Booking Summary:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                    <div>Condition: <strong className="text-slate-800 block truncate">{selectedCondition}</strong></div>
                    <div>Location: <strong className="text-slate-800 block">{selectedArea}, Patna</strong></div>
                    <div>Slot: <strong className="text-slate-800 block">{preferredDate}</strong></div>
                    <div>Session Fee: <strong className="text-slate-800 block">₹{MOVRA_CONFIG.pricing.initialAssessment.amount} (Pay after visit)</strong></div>
                  </div>
                </div>

                {/* Primary Confirmation Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-teal-400" />
                    <span>{isSubmitting ? 'Submitting Request...' : 'Confirm Home Visit'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWhatsAppBooking()}
                    className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Book via WhatsApp Instead</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 11. FAQ ACCORDION (Section 16 - 9 Detailed Items)         */}
      {/* ======================================================== */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="space-y-10">
          <div className="text-left space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-800">Clear Answers</p>
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 font-medium">
              Everything you need to know about our home visit operations and clinical practices.
            </p>
          </div>

          <div className="space-y-3">
            {MOVRA_CONFIG.faqs.map((faq, index) => {
              const isOpen = expandedFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-xl border border-slate-200/90 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaqIndex(isOpen ? null : index)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-teal-900 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-teal-700' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed font-normal border-t border-slate-100 animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 12. FOOTER (Section 19)                                  */}
      {/* ======================================================== */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Brand Column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-slate-950 flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-white tracking-tight">MOVRA</span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Movement. Rehabilitation. Recovery.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm font-normal">
                Professional home-based physiotherapy platform delivering qualified clinicians and structured recovery tracking across Patna, Bihar.
              </p>
              <div className="text-xs text-slate-500 space-y-0.5 pt-2">
                <p>Helpline: {MOVRA_CONFIG.brand.supportPhone}</p>
                <p>Coverage: Kankarbagh, Boring Road, Rajendra Nagar, Bailey Road &amp; Patliputra</p>
              </div>
            </div>

            {/* Services Links */}
            <div className="md:col-span-3 space-y-2.5 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">Clinical Services</h3>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">Back &amp; Neck Pain</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">Knee &amp; Joint Rehabilitation</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">Post-Operative TKA &amp; THA</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">Neurological Stroke Care</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">Geriatric Balance &amp; Falls</button></li>
              </ul>
            </div>

            {/* Navigation & Portal Links */}
            <div className="md:col-span-4 space-y-2.5 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">Platform Access</h3>
              <ul className="space-y-1.5 text-slate-400">
                <li><Link to="/login" className="hover:text-white transition-colors">Patient Login</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Physiotherapist Portal</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Register as Patient</Link></li>
                <li><button onClick={() => scrollToSection('booking-section')} className="hover:text-white transition-colors cursor-pointer">Book a Visit</button></li>
                <li><button onClick={() => handleWhatsAppBooking()} className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer">
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </button></li>
              </ul>
            </div>
          </div>

          {/* Clinical Disclaimer & Copyright */}
          <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
            <p className="text-[11px] text-slate-500 max-w-2xl leading-relaxed">
              <strong className="text-slate-400 font-semibold">Clinical Notice:</strong> MOVRA is a technology-enabled healthcare platform. AI and digital tools support exercise tracking and symptom documentation. All physical examinations, clinical diagnostics, and hands-on therapy are conducted by licensed physiotherapists.
            </p>
            <p className="text-[11px] text-slate-500 font-mono shrink-0">
              © {new Date().getFullYear()} MOVRA. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* SERVICE DETAIL MODAL (Explore Interaction)               */}
      {/* ======================================================== */}
      {activeServiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                  {activeServiceModal.category}
                </span>
                <h3 className="text-xl font-bold text-slate-950 mt-0.5">
                  {activeServiceModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveServiceModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeServiceModal.fullDesc}
            </p>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-900 block">Common Diagnoses Treated:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeServiceModal.commonConditions.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-900 block">Clinical Protocol Highlights:</span>
              {activeServiceModal.clinicalApproach.map((app, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span>{app}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Session Duration: {activeServiceModal.sessionDuration}</span>
              <button
                onClick={() => {
                  setSelectedCondition(activeServiceModal.title);
                  setActiveServiceModal(null);
                  scrollToSection('booking-section');
                }}
                className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Book This Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
