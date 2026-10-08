export type UserRole = 'patient' | 'physiotherapist' | 'admin';

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  signup: (data: { email: string; password: string; full_name: string; role: 'patient' | 'physiotherapist' }) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string; reset_token?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void | Promise<void>;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: number;
  hold_seconds: number;
  duration_minutes: number;
  completed: boolean;
  target_muscle: string;
  clinical_tip: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  icon?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  surgery: string;
  post_op_day: number;
  primary_clinician: string;
  phone?: string;
  emergency_contact?: string;
}

export interface ConsistencyDay {
  day: string;
  completed: boolean;
  date: string;
  is_today?: boolean;
}

export interface ClinicalMilestone {
  id: string;
  title: string;
  target: string;
  current_value: string;
  status: 'achieved' | 'in_progress' | 'upcoming';
  date_achieved?: string;
  clinician_note: string;
}

export interface RetainedContextItem {
  id: string;
  category: string;
  summary: string;
  date_logged: string;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  citations?: string[];
  clinical_alert?: string;
  isVoiceInput?: boolean;
  audioPath?: string;
}

export interface ProgressAnalyticsData {
  status: string;
  patient_id: string;
  analysis_narrative: string;
  metrics_summary: {
    latest_pain_level: number;
    initial_pain_level: number;
    pain_reduction_percentage: number;
    latest_flexion_degrees: number;
    flexion_gain_degrees: number;
    flexion_goal_degrees: number;
    latest_extension_degrees: number;
    extension_goal_degrees: number;
    compliance_percentage: number;
    average_daily_steps: number;
    total_tracked_days: number;
  };
  milestone_status: {
    day_14_flexion_target_achieved: boolean;
    extension_lag_clearing: boolean;
    walking_tolerance_on_track: boolean;
  };
  history: Array<{
    date: string;
    post_op_day: number;
    pain_level: number;
    flexion_degrees: number;
    extension_degrees: number;
    exercise_completed: boolean;
    daily_steps: number;
  }>;
}

export interface TodayPlanData {
  patient: PatientProfile;
  greeting?: string;
  recovery_progress_percentage: number;
  weekly_recovery_goal?: {
    percentage: number;
    label: string;
    current_flexion?: number;
    target_flexion?: number;
    current_extension?: number;
    target_extension?: number;
  };
  gamification?: {
    streak_days: number;
    streak_label: string;
    ai_accuracy_percentage: number;
    ai_accuracy_label: string;
    weekly_compliance_percentage: number;
  };
  exercise_plan?: {
    summary: string;
    exercises: Exercise[];
  };
  dietary_plan?: {
    why_this_plan_works: string;
    meal_plan: string;
    important_considerations: string[];
  };
  tips?: string[];
  metrics: {
    knee_flexion_degrees: number;
    knee_flexion_goal_degrees: number;
    knee_extension_degrees: number;
    knee_extension_goal_degrees: number;
    quad_activation_index: number;
    daily_steps: number;
  };
  exercises: Exercise[];
  consistency: {
    current_streak_days: number;
    weekly_compliance_percentage: number;
    days: ConsistencyDay[];
  };
  voice_physio_status: {
    ready: boolean;
    status_text: string;
    model_version: string;
  };
}

export interface BookingRequest {
  id?: number | string;
  reference_id?: string;
  user_id?: number | string;
  name: string;
  phone: string;
  age: number | string;
  location: string;
  condition: string;
  service?: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED' | 'REJECTED';
  physiotherapist?: string;
  created_at?: string;
}

export type AppointmentStatusType = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'RESCHEDULED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export interface ClinicalAppointment {
  id: number | string;
  reference_id: string;
  booking_id?: number;
  patient_id: string;
  patient_name: string;
  phone: string;
  age: number;
  location: string;
  area: string;
  condition: string;
  service: string;
  date: string;
  time: string;
  status: AppointmentStatusType;
  physiotherapist: string;
  fee: number;
  payment_status: 'PAID' | 'PENDING' | 'REFUNDED';
  notes?: string;
  created_at?: string;
  distance_km?: number;
  travel_time_min?: number;
}

export interface ClinicalSOAPNote {
  id?: number | string;
  patient_id: string;
  visit_id?: number | string;
  therapist_name: string;
  date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  ai_assisted?: boolean;
  ai_draft_used?: boolean;
  status: 'DRAFT' | 'FINALIZED';
  created_at?: string;
}

export interface ClinicalPatientGoal {
  id?: number | string;
  patient_id: string;
  goal_name: string;
  baseline: number;
  current_value: number;
  target_value: number;
  unit: string;
  target_date: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'ACHIEVED' | 'REVIEW_NEEDED';
}

export interface ClinicalTransaction {
  id: number | string;
  date: string;
  patient: string;
  service: string;
  amount: number;
  method: 'UPI' | 'Cash' | 'Online';
  status: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
}

export interface FeatureFlagItem {
  id?: number;
  key: string;
  name: string;
  enabled: boolean;
  description?: string;
  category: string;
  updated_by?: string;
  updated_at?: string;
}

export interface AuditLogItem {
  id: number | string;
  actor_email: string;
  action: string;
  target_type: string;
  target_id: string;
  reason?: string;
  timestamp: string;
}

export interface PlatformServiceItem {
  id: number | string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration_minutes: number;
  availability_status: string;
  is_active: boolean;
}

export interface PlatformServiceAreaItem {
  id: number | string;
  name: string;
  is_active: boolean;
  lead_time_min: number;
}

export interface AdminUserData {
  id: number | string;
  email: string;
  full_name: string;
  role: 'patient' | 'physiotherapist' | 'admin';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  phone?: string;
  condition?: string;
  area?: string;
  qualification?: string;
  license?: string;
  service_areas?: string[];
  experience?: string;
  rating?: number;
  assigned_patients?: number;
  completed_visits?: number;
  earnings?: number;
  total_visits?: number;
  lifetime_spend?: number;
  last_login?: string;
  created_at?: string;
}


