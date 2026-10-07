import { 
  Activity, 
  Brain, 
  Heart, 
  Baby, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Stethoscope, 
  Award,
  Zap,
  TrendingUp,
  FileText,
  UserCheck
} from 'lucide-react';

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  commonConditions: string[];
  clinicalApproach: string[];
  sessionDuration: string;
}

export interface PhysioProfile {
  id: string;
  name: string;
  qualification: string;
  registrationNumber: string;
  experienceYears: number;
  homeVisitsCompleted: number;
  specialties: string[];
  bio: string;
  serviceAreas: string[];
  availableToday: boolean;
  nextSlot: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'clinical' | 'booking' | 'technology';
}

export const MOVRA_CONFIG = {
  brand: {
    name: "MOVRA",
    tagline: "Movement. Rehabilitation. Recovery.",
    category: "Technology-enabled home rehabilitation and physiotherapy platform",
    positioning: "Professional physiotherapy, delivered to your home — powered by clinical expertise and intelligent recovery tracking.",
    launchCity: "Patna, Bihar",
    supportPhone: "+91 98201 44829",
    whatsappNumber: "919820144829",
    whatsappDefaultMessage: "Hi, I would like to book a MOVRA home physiotherapy visit.",
  },

  // Centralized, configurable pricing (as requested in Section 14)
  pricing: {
    initialAssessment: {
      amount: 749,
      currency: "₹",
      duration: "60 Mins",
      label: "Comprehensive Initial Assessment",
      subtitle: "In-home subjective evaluation, physical goniometry, and custom recovery roadmap",
      inclusions: [
        "In-home physical assessment by licensed PT",
        "Range-of-motion (ROM) & posture evaluation",
        "Personalized digital recovery plan & exercises",
        "Initial hands-on therapeutic treatment",
        "Access to daily recovery tracking & video guides"
      ]
    },
    followUpSession: {
      amount: 599,
      currency: "₹",
      duration: "45 Mins",
      label: "Rehabilitation & Follow-up Session",
      subtitle: "Hands-on joint mobilization, progressive kinetic training, and milestone review",
      inclusions: [
        "Hands-on manual therapy & guided exercises",
        "Progress check against clinical milestone targets",
        "Adjustment of home exercise difficulty",
        "Pain tracking and mobility progression log",
        "Direct continuous clinician communication"
      ]
    },
    packageTier: {
      amount: 3299,
      currency: "₹",
      sessionsCount: 6,
      label: "6-Session Structured Recovery Pathway",
      savings: "Save ₹400+",
      subtitle: "Recommended for post-surgical, stroke, or chronic lumbar rehabilitation"
    }
  },

  coverageAreas: [
    { id: "kankarbagh", name: "Kankarbagh", available: true, avgResponseHours: 2 },
    { id: "boring_road", name: "Boring Road", available: true, avgResponseHours: 2 },
    { id: "rajendra_nagar", name: "Rajendra Nagar", available: true, avgResponseHours: 2 },
    { id: "bailey_road", name: "Bailey Road", available: true, avgResponseHours: 3 },
    { id: "patliputra", name: "Patliputra Colony", available: true, avgResponseHours: 3 },
    { id: "fraser_road", name: "Fraser Road", available: true, avgResponseHours: 2 },
    { id: "anisabad", name: "Anisabad", available: true, avgResponseHours: 4 }
  ],

  // 8 Specific Clinical Categories (Section 5)
  services: [
    {
      id: "back-neck",
      title: "Back & Neck Pain",
      category: "Spine & Posture",
      shortDesc: "Targeted decompression, McKenzie mobilization, and spinal core re-education.",
      fullDesc: "Comprehensive home rehabilitation for acute spasm, chronic lumbar spondylosis, cervical radiculopathy, and sciatica. We identify underlying postural biomechanics to restore painless daily sitting and ambulation.",
      commonConditions: ["Lumbar Disc Bulge & Sciatica", "Cervical Spondylosis", "Postural Muscle Spasm", "Thoracic Stiffness"],
      clinicalApproach: ["McKenzie mechanical diagnosis", "Segmental core stabilization", "Ergonomic home workstation adjustment"],
      sessionDuration: "45–60 mins"
    },
    {
      id: "knee-joint",
      title: "Knee & Joint Rehabilitation",
      category: "Musculoskeletal & Arthroplasty",
      shortDesc: "Evidence-based joint mobilization, quadriceps retraining, and cartilage loading.",
      fullDesc: "Designed for osteoarthritis, patellofemoral pain, and joint impingements. Focuses on rebuilding synovial joint mobility and reducing mechanical stress on articular surfaces without hospital travel.",
      commonConditions: ["Osteoarthritis Grade II–IV", "Patellar Tendinopathy", "Meniscal Tear Recovery", "Frozen Joint Capsule"],
      clinicalApproach: ["Supervised kinetic chain loading", "Cryo-compression integration", "Active-assisted goniometric tracking"],
      sessionDuration: "45–60 mins"
    },
    {
      id: "sports-injury",
      title: "Sports Injury Rehabilitation",
      category: "Athletic Recovery",
      shortDesc: "Ligament rehabilitation, return-to-sport protocols, and neuromuscular retraining.",
      fullDesc: "Accelerated rehabilitation following ACL reconstruction, ankle syndesmosis sprains, rotator cuff strains, and hamstring tears. Structured progression through eccentric loading and plyometrics.",
      commonConditions: ["ACL & Meniscus Reconstruction", "Ankle Sprain & Chronic Instability", "Rotator Cuff Tendinopathy", "Tennis/Golfer's Elbow"],
      clinicalApproach: ["Progressive eccentric loading", "Proprioception & balance retraining", "Functional return-to-activity testing"],
      sessionDuration: "50 mins"
    },
    {
      id: "neuro-rehab",
      title: "Neurological Rehabilitation",
      category: "Neuro-Motor Re-education",
      shortDesc: "Neuroplasticity facilitation, reciprocal gait training, and spasticity care.",
      fullDesc: "Bedside motor relearning for stroke survivors (hemiplegia), Parkinson’s disease balance retraining, and peripheral neuropathy. Designed specifically for safe, familiar home environments.",
      commonConditions: ["Post-Stroke Hemiparesis", "Parkinson's Disease Balance Rehab", "Bell's Palsy Facial Re-education", "Foot Drop & Peripheral Neuropathy"],
      clinicalApproach: ["PNF neuromuscular facilitation", "Task-oriented gait practice", "Caregiver transfer training"],
      sessionDuration: "60 mins"
    },
    {
      id: "post-operative",
      title: "Post-operative Rehabilitation",
      category: "Surgical Recovery",
      shortDesc: "Early mobilization, surgical swelling management, and milestone progression.",
      fullDesc: "Safe, infection-controlled rehabilitation following Total Knee Replacement (TKA), Hip Replacement, and spinal decompression. Removes the painful burden of clinic commute during early post-op days.",
      commonConditions: ["Total Knee Replacement (TKA)", "Total Hip Arthroplasty (THA)", "Spine Decompression / Fusion", "Post-Fracture ORIF"],
      clinicalApproach: ["Early active-assisted ROM", "DVT prevention & circulation pumps", "Terminal extension towel roll protocols"],
      sessionDuration: "50–60 mins"
    },
    {
      id: "geriatric",
      title: "Geriatric Rehabilitation",
      category: "Active Aging & Balance",
      shortDesc: "Gentle fall prevention, osteo-preservation, and independent mobility maintenance.",
      fullDesc: "Compassionate bedside therapy for seniors struggling with frailty, balance instability, fear of falling, or post-hospitalization deconditioning. Enhances safe transfers and dignity in daily life.",
      commonConditions: ["Balance Disorders & Fall Risk", "Severe Age-Related Sarcopenia", "Post-Fracture Bedside Care", "Generalized Deconditioning"],
      clinicalApproach: ["Berg balance functional training", "Home environment hazard inspection", "Safe walker & cane transition"],
      sessionDuration: "45 mins"
    },
    {
      id: "mobility-balance",
      title: "Mobility & Balance",
      category: "Vestibular & Functional Movement",
      shortDesc: "Postural righting reflexes, gait symmetry correction, and dynamic balance drills.",
      fullDesc: "Focused kinetic training to clear extension lags, correct limping gait patterns, and restore confident unassisted standing and stair navigation.",
      commonConditions: ["Vestibular Equilibrium Disorders", "Antalgic / Compensatory Limp", "Stair Navigation Hesitancy", "Core Instability"],
      clinicalApproach: ["Static to dynamic balance transitions", "Visual-vestibular integration", "Metronome-paced gait retraining"],
      sessionDuration: "45 mins"
    },
    {
      id: "general-physio",
      title: "General Physiotherapy",
      category: "Physical Health & Wellness",
      shortDesc: "Ergonomic alignment, myofascial release, and preventive kinetic conditioning.",
      fullDesc: "Address postural strains, desk-work tightness, recurring muscular knots, and chronic stiffness with structured hands-on therapy and evidence-based home routines.",
      commonConditions: ["Upper Cross Syndrome (Tech Neck)", "Thoracic Kyphosis Stiffness", "Myofascial Trigger Points", "Chronic Muscle Fatigue"],
      clinicalApproach: ["Soft tissue mobilization", "Postural alignment correction", "Sustained flexibility protocols"],
      sessionDuration: "45 mins"
    }
  ],

  // 5-Step Process (Section 6)
  howItWorksSteps: [
    {
      step: "01",
      title: "Tell us your problem",
      description: "Complete a simple 2-minute intake detailing your symptoms, affected joints, and preferred visit slot.",
      clinicalDetail: "Our clinical intake system organizes symptom history before the clinician arrives."
    },
    {
      step: "02",
      title: "Get matched with a physiotherapist",
      description: "We match you with a qualified, licensed physiotherapist specializing in your specific condition in Patna.",
      clinicalDetail: "Verified BPT/MPT clinicians with background verification and orthopedic or neuro credentials."
    },
    {
      step: "03",
      title: "Receive a home assessment",
      description: "The clinician arrives at your doorstep equipped with clinical assessment tools, goniometers, and therapeutic gear.",
      clinicalDetail: "Detailed subjective examination, objective ROM measurement, and initial treatment in your home comfort."
    },
    {
      step: "04",
      title: "Follow your personalized rehabilitation plan",
      description: "Receive a structured recovery pathway with clear exercise goals, video references, and prescribed daily sets.",
      clinicalDetail: "Evidence-based protocols adjusted dynamically as your range of motion improves."
    },
    {
      step: "05",
      title: "Track your recovery",
      description: "Log daily exercise completion and track your pain and mobility improvements with intelligent recovery telemetry.",
      clinicalDetail: "Objective data trends shared with your physiotherapist for continuous clinical oversight."
    }
  ],

  // MOVRA Intelligence Pipeline (Section 7)
  intelligencePipeline: [
    {
      step: "1",
      name: "Patient Intake",
      desc: "Intelligent symptom & history capture prior to consultation.",
      role: "Assistive"
    },
    {
      step: "2",
      name: "Clinical Assessment",
      desc: "Hands-on subjective & goniometric exam by licensed PT.",
      role: "Human Clinician"
    },
    {
      step: "3",
      name: "Personalized Plan",
      desc: "Evidence-based exercise protocol tailored to diagnosis.",
      role: "Collaborative"
    },
    {
      step: "4",
      name: "Recovery Tracking",
      desc: "Daily adherence, rep counts, and subjective pain metrics.",
      role: "Assistive"
    },
    {
      step: "5",
      name: "Progress Insights",
      desc: "Objective ROM trends, compliance velocity, and recovery curve.",
      role: "Assistive"
    },
    {
      step: "6",
      name: "Physiotherapist Review",
      desc: "Clinician evaluates telemetry, adjusts regimen, and conducts visits.",
      role: "Human Clinician"
    }
  ],

  // Verified Clinician Team (Section 12)
  physiotherapists: [
    {
      id: "pt-ananya",
      name: "Dr. Ananya Iyer",
      qualification: "BPT, MPT (Orthopedic & Neuro Rehabilitation)",
      registrationNumber: "PT-IN-88921-A",
      experienceYears: 8,
      homeVisitsCompleted: 1240,
      specialties: ["Post-TKA Knee Mobility", "Spinal Disc Rehabilitation", "Post-Stroke Gait Retraining"],
      bio: "8+ years specializing in post-surgical knee arthroplasty and neurological recovery. Committed to bringing clinic-grade rehabilitation directly to home patients.",
      serviceAreas: ["Kankarbagh", "Rajendra Nagar", "Boring Road"],
      availableToday: true,
      nextSlot: "Today • 4:30 PM"
    },
    {
      id: "pt-rakesh",
      name: "Dr. Rakesh Ranjan",
      qualification: "BPT, MIAP (Musculoskeletal & Sports Therapy)",
      registrationNumber: "PT-IN-74120-B",
      experienceYears: 6,
      homeVisitsCompleted: 980,
      specialties: ["Lumbar Spondylosis", "Sports Ligament Rehab", "Cervical Radiculopathy"],
      bio: "Certified manual therapist focusing on spine mobilization and athletic joint restoration. Trained in advanced McKenzie mechanical diagnostic techniques.",
      serviceAreas: ["Bailey Road", "Patliputra Colony", "Boring Road"],
      availableToday: true,
      nextSlot: "Tomorrow • 10:00 AM"
    },
    {
      id: "pt-neha",
      name: "Dr. Neha Kumari",
      qualification: "BPT, MPT (Geriatric & Pediatric Physiotherapy)",
      registrationNumber: "PT-IN-91340-C",
      experienceYears: 7,
      homeVisitsCompleted: 1120,
      specialties: ["Geriatric Balance & Fall Prevention", "Developmental Motor Retraining", "Osteoarthritis Care"],
      bio: "Specializes in elderly bedside rehabilitation, Parkinson's stability drills, and pediatric milestone facilitation in home family settings.",
      serviceAreas: ["Kankarbagh", "Fraser Road", "Anisabad"],
      availableToday: false,
      nextSlot: "Tomorrow • 11:30 AM"
    }
  ],

  // Frequently Asked Questions (Section 16)
  faqs: [
    {
      category: "general",
      question: "What is MOVRA?",
      answer: "MOVRA is a technology-enabled home rehabilitation and physiotherapy platform. We deliver qualified physiotherapists to your doorstep in Patna, supported by structured recovery tracking, personalized exercise plans, and clinical telemetry to help patients recover safely at home."
    },
    {
      category: "general",
      question: "How does home physiotherapy work?",
      answer: "After booking a visit, a licensed physiotherapist arrives at your home at the scheduled time with specialized assessment and therapeutic equipment. They evaluate your mobility, provide hands-on manual therapy, and set up your digital recovery roadmap."
    },
    {
      category: "clinical",
      question: "Who provides the treatment?",
      answer: "All treatments are provided exclusively by qualified, degree-holding physiotherapists (BPT / MPT) with verified credentials and clinical experience in musculoskeletal, post-operative, and neurological rehabilitation."
    },
    {
      category: "clinical",
      question: "What conditions can MOVRA help with?",
      answer: "We support recovery for post-operative joint surgeries (knee and hip replacements), back and neck pain (sciatica, disc herniation), sports injuries (ACL, sprains), neurological conditions (stroke, Parkinson's), and geriatric balance/fall prevention."
    },
    {
      category: "booking",
      question: "How is the physiotherapist assigned?",
      answer: "Physiotherapists are matched based on clinical specialty required for your specific condition (e.g., post-op knee specialist for TKA) and geographical proximity within Patna to ensure timely arrivals."
    },
    {
      category: "booking",
      question: "Can I reschedule a session?",
      answer: "Yes. You can reschedule any session up to 4 hours before the scheduled time through the patient dashboard or by contacting our clinical coordinator helpline."
    },
    {
      category: "technology",
      question: "How does recovery tracking work?",
      answer: "Your physiotherapist prescribes daily exercise protocols on the MOVRA platform. You can log completed sets, record pain levels, and track range-of-motion progress. The data is visible to your physiotherapist to monitor recovery velocity between home visits."
    },
    {
      category: "technology",
      question: "Does MOVRA replace a doctor or physiotherapist?",
      answer: "No. Technology in MOVRA is strictly an assistive layer that supports symptom organization, exercise adherence, and progress tracking. All clinical examinations, diagnosis reviews, manual therapy, and treatment decisions remain exclusively with licensed healthcare professionals."
    },
    {
      category: "clinical",
      question: "How is patient information handled?",
      answer: "Patient medical data, clinical notes, and recovery logs are encrypted, treated with strict confidentiality, and only accessible to your assigned care team in accordance with healthcare privacy standards."
    }
  ],

  // Clearly marked demo patient stories (Section 15)
  demoPatientStories: [
    {
      id: "demo-1",
      isDemo: true,
      tag: "Patient Story — Demo",
      patientProfile: "64-year-old male • Patna",
      condition: "Post-Total Knee Arthroplasty (TKA)",
      quote: "Travelling to a clinic during the second week after knee surgery was painful and exhausting. Having Dr. Ananya visit at home while using MOVRA to track my daily 88° flexion progress gave my family immense peace of mind.",
      recoveryHighlight: "Flexion progressed from 45° to 98° over 3 weeks of home care"
    },
    {
      id: "demo-2",
      isDemo: true,
      tag: "Patient Story — Demo",
      patientProfile: "42-year-old professional • Boring Road",
      condition: "Lumbar Disc Herniation & Sciatica",
      quote: "The structured McKenzie protocols and postural corrections done right at my home desk helped me return to normal work routine without recurring pain spikes.",
      recoveryHighlight: "Pain index dropped from 7/10 to 1/10 with zero missed sessions"
    },
    {
      id: "demo-3",
      isDemo: true,
      tag: "Patient Story — Demo",
      patientProfile: "71-year-old female • Rajendra Nagar",
      condition: "Geriatric Balance & Fall Prevention",
      quote: "Gentle, respectful bedside therapy. My mother regained the confidence to walk independently with a cane around the house after just five home sessions.",
      recoveryHighlight: "Berg Balance score improved by 34% with safe unassisted transfers"
    }
  ]
};
