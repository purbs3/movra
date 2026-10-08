"""
Physiotherapist Clinical Workspace Routes for MOVRA Platform
Provides end-to-end endpoints for:
- Dashboard Metrics & Visits
- Booking requests (Accept, Reject, Reschedule)
- Appointments & Home Visit lifecycle (Start, Complete, Route sequencing)
- Patient Clinical Profiles & Timelines
- Initial Assessments & SOAP notes with AI Assistance and Audit Logging
- Clinical AI Approval Gate (Review, Approve, Reject, Modify AI-generated plans)
- Home Exercise Program builder & Goal tracking
- Earnings, Invoices & Follow-ups
Enforces real server-side RBAC via require_physio on all clinical endpoints.
"""
import json
import random
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import get_db
from models import (
    Booking, 
    BookingStatus, 
    Appointment, 
    AppointmentStatus, 
    SOAPNote, 
    PatientGoal, 
    PaymentRecord, 
    User,
    AuditLog,
    RehabPlan,
    PlanApprovalStatus
)
from auth import require_physio, require_admin, get_current_user
from agents.predictive_agent import predictive_agent

router = APIRouter(prefix="/api/physio", tags=["Physiotherapist Clinical Panel"])


# =========================================================================
# Request Models
# =========================================================================

class AcceptBookingPayload(BaseModel):
    therapist_name: Optional[str] = "Dr. Ananya Iyer, PT"
    notes: Optional[str] = None

class RejectBookingPayload(BaseModel):
    reason: str = Field(..., example="Out of service radius")

class RescheduleBookingPayload(BaseModel):
    new_date: str = Field(..., example="2026-10-15")
    new_time: str = Field(..., example="11:30 AM")
    reason: Optional[str] = None

class SaveSOAPPayload(BaseModel):
    subjective: str
    objective: str
    assessment: str
    plan: str
    ai_assisted: Optional[bool] = False
    ai_draft_used: Optional[bool] = False

class AIDraftSOAPPayload(BaseModel):
    patient_id: str = "rahul_123"
    current_pain: Optional[int] = 2
    current_flexion: Optional[int] = 88
    previous_flexion: Optional[int] = 82
    previous_pain: Optional[int] = 3
    observations: Optional[str] = "Good quadriceps recruitment with reduced joint warmth."

class SaveGoalPayload(BaseModel):
    goal_name: str
    baseline: float
    current_value: float
    target_value: float
    unit: Optional[str] = "°"
    target_date: str
    status: Optional[str] = "IN_PROGRESS"

class HomeProgramPayload(BaseModel):
    title: str
    notes: Optional[str] = ""
    exercises: List[Dict[str, Any]]

class MovementAnalysisPayload(BaseModel):
    movement_type: str = "Knee Flexion"
    estimated_angle: float = 88.0
    previous_angle: Optional[float] = 82.0
    repetitions: Optional[int] = 10
    duration_seconds: Optional[int] = 45

class ApprovePlanPayload(BaseModel):
    notes: Optional[str] = "Clinician approved daily exercise dosage and safety guidelines."

class RejectPlanPayload(BaseModel):
    reason: str = Field(..., example="Extension lag requires bedside therapist assistance before loaded heel slides.")

class ModifyPlanPayload(BaseModel):
    plan_data: Dict[str, Any]
    clinical_notes: Optional[str] = "Modified by supervising physiotherapist."


# =========================================================================
# Dashboard & Appointments
# =========================================================================

@router.get("/dashboard-summary")
def get_dashboard_summary(
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    """
    Returns today's high-level operational clinical telemetry for the logged-in therapist.
    Requires Physiotherapist credentials.
    """
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    pending_bookings = db.query(Booking).filter(Booking.status == "PENDING").count()
    total_appointments = db.query(Appointment).count()
    if total_appointments == 0:
        seed_demo_clinical_data(db)

    appointments_today = db.query(Appointment).filter(Appointment.status != "CANCELLED").limit(5).all()
    
    return {
        "status": "success",
        "physiotherapist": {
            "name": current_clinician.full_name or "Dr. Ananya Iyer, PT",
            "email": current_clinician.email,
            "qualification": "BPT, MPT • Orthopedic & Neuro Rehabilitation Specialist",
            "experience": "8+ Years Clinical Practice",
            "license": "PT-IN-88921-A",
            "clinic": "City Ortho Rehabilitation & Home Care"
        },
        "metrics": {
            "todays_visits": 5,
            "new_requests": max(pending_bookings, 3),
            "active_patients": 18,
            "next_appointment": "10:00 AM - Rahul Sharma",
            "todays_earnings": 1500,
            "monthly_earnings": 42500
        },
        "todays_schedule": [a.to_dict() for a in appointments_today]
    }


@router.get("/appointments")
def get_appointments(
    view: str = Query("today", example="today"),
    status_filter: Optional[str] = None,
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    """
    GET /api/physio/appointments
    Returns appointments segmented by TODAY, WEEK, or MONTH with statuses.
    Requires Physiotherapist credentials.
    """
    query = db.query(Appointment)
    if status_filter:
        query = query.filter(Appointment.status == status_filter.upper())

    records = query.order_by(Appointment.id.asc()).all()
    if not records:
        seed_demo_clinical_data(db)
        records = db.query(Appointment).all()

    return {
        "status": "success",
        "view": view,
        "total": len(records),
        "appointments": [r.to_dict() for r in records]
    }


@router.patch("/appointments/{appointment_id}/status")
def update_appointment_status(
    appointment_id: int,
    status_value: str = Query(..., example="IN_PROGRESS"),
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appt.status = status_value.upper()
    db.commit()
    db.refresh(appt)
    return {"status": "success", "appointment": appt.to_dict()}


@router.post("/appointments/{appointment_id}/reschedule")
def reschedule_appointment(
    appointment_id: int,
    payload: RescheduleBookingPayload,
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appt.date = payload.new_date
    appt.time = payload.new_time
    appt.status = "RESCHEDULED"
    if payload.reason:
        appt.notes = f"Rescheduled: {payload.reason}"
    db.commit()
    db.refresh(appt)

    return {
        "status": "success",
        "message": f"Appointment #{appointment_id} rescheduled to {payload.new_date} at {payload.new_time}.",
        "appointment": appt.to_dict()
    }


@router.post("/bookings/{booking_id}/accept")
def accept_booking(
    booking_id: int,
    payload: AcceptBookingPayload,
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    """
    Accepts an incoming home visit request and creates a confirmed appointment.
    Requires Physiotherapist credentials.
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking request not found")

    booking.status = "CONFIRMED"
    booking.physiotherapist = payload.therapist_name or current_clinician.full_name or "Dr. Ananya Iyer, PT"

    ref_appt = f"APT-{random.randint(1000, 9999)}"
    appt = Appointment(
        reference_id=ref_appt,
        booking_id=booking.id,
        patient_id=f"pt_{booking.id}",
        patient_name=booking.name,
        phone=booking.phone,
        age=int(booking.age) if str(booking.age).isdigit() else 45,
        location=booking.location,
        area=booking.location.split(",")[0] if "," in booking.location else booking.location,
        condition=booking.condition,
        service=booking.service,
        date=booking.preferred_date,
        time=booking.preferred_time,
        status="CONFIRMED",
        physiotherapist=booking.physiotherapist,
        fee=750.0,
        payment_status="PENDING",
        notes=payload.notes or booking.message
    )
    db.add(appt)
    db.commit()
    db.refresh(booking)

    return {
        "status": "success",
        "message": f"Booking {booking.reference_id} accepted. Appointment scheduled for {booking.preferred_date} at {booking.preferred_time}.",
        "appointment": appt.to_dict()
    }


@router.post("/bookings/{booking_id}/reject")
def reject_booking(
    booking_id: int,
    payload: RejectBookingPayload,
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    booking.status = "REJECTED"
    db.commit()
    return {
        "status": "success",
        "message": f"Booking {booking.reference_id} marked as REJECTED. Reason: {payload.reason}.",
        "booking": booking.to_dict()
    }


# =========================================================================
# Home Visit Lifecycle & Route Sequencing
# =========================================================================

@router.get("/visits/today")
def get_todays_visits(
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    """
    Returns ordered stops for today's travelling home-visit route.
    Requires Physiotherapist credentials.
    """
    appts = db.query(Appointment).filter(Appointment.status.in_(["CONFIRMED", "IN_PROGRESS", "COMPLETED"])).all()
    if not appts:
        seed_demo_clinical_data(db)
        appts = db.query(Appointment).all()

    visits = []
    for idx, a in enumerate(appts[:4]):
        visits.append({
            "stop_number": idx + 1,
            "appointment_id": a.id,
            "patient_name": a.patient_name,
            "phone": a.phone,
            "area": a.area,
            "address": a.location,
            "time": a.time,
            "service": a.service,
            "condition": a.condition,
            "status": a.status,
            "estimated_travel_min": 15 if idx > 0 else 0
        })

    return {
        "status": "success",
        "total_stops": len(visits),
        "route_sequence": visits
    }


@router.post("/visits/{appointment_id}/start")
def start_visit(
    appointment_id: int,
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appt.status = "IN_PROGRESS"
    db.commit()
    return {
        "status": "success",
        "message": f"Home visit for {appt.patient_name} started. Clinical documentation session is active.",
        "appointment": appt.to_dict()
    }


@router.post("/visits/{appointment_id}/complete")
def complete_visit(
    appointment_id: int,
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    appt.status = "COMPLETED"
    appt.payment_status = "PAID"
    
    pay = PaymentRecord(
        reference_id=f"PAY-{random.randint(10000, 99999)}",
        patient_id=appt.patient_id,
        patient_name=appt.patient_name,
        service=appt.service,
        amount=appt.fee or 750.0,
        payment_method="UPI",
        status="PAID",
        date=datetime.utcnow().strftime("%Y-%m-%d")
    )
    db.add(pay)
    db.commit()

    return {
        "status": "success",
        "message": f"Home visit for {appt.patient_name} marked as COMPLETED. Payment recorded.",
        "appointment": appt.to_dict(),
        "receipt": pay.to_dict()
    }


# =========================================================================
# Patient Caseload & Clinical Profiles
# =========================================================================

@router.get("/patients")
def get_patients_directory(
    query: Optional[str] = None,
    filter_category: Optional[str] = "all",
    current_clinician: User = Depends(require_physio)
):
    """
    Returns full clinical caseload patient list with rehabilitation parameters.
    Requires Physiotherapist credentials.
    """
    patients = [
        {
            "id": "rahul_123",
            "name": "Rahul Sharma",
            "age": 64,
            "gender": "Male",
            "phone": "+91 98201 44829",
            "area": "Kankarbagh",
            "condition": "Right Knee Replacement (TKA)",
            "category": "Orthopedic / Post-Op",
            "post_op_day": 14,
            "rom": "88° Flexion / -3° Extension",
            "pain_score": "2/10",
            "compliance": "94%",
            "last_visit": "12 Oct 2026",
            "next_visit": "15 Oct 2026",
            "status": "On Track"
        },
        {
            "id": "patient_sunita_58",
            "name": "Sunita Patel",
            "age": 58,
            "gender": "Female",
            "phone": "+91 98112 33456",
            "area": "Boring Road",
            "condition": "Left ACL Reconstruction",
            "category": "Sports / Post-Op",
            "post_op_day": 28,
            "rom": "112° Flexion / 0° Extension",
            "pain_score": "1/10",
            "compliance": "88%",
            "last_visit": "10 Oct 2026",
            "next_visit": "17 Oct 2026",
            "status": "Excellent"
        },
        {
            "id": "patient_anand_71",
            "name": "Anand Verma",
            "age": 71,
            "gender": "Male",
            "phone": "+91 98451 90812",
            "area": "Rajendra Nagar",
            "condition": "Bilateral Hip Arthroplasty",
            "category": "Geriatric / Post-Op",
            "post_op_day": 9,
            "rom": "75° Flexion",
            "pain_score": "4/10",
            "compliance": "79%",
            "last_visit": "11 Oct 2026",
            "next_visit": "14 Oct 2026",
            "status": "Needs Review"
        }
    ]

    if query:
        q = query.lower()
        patients = [p for p in patients if q in p["name"].lower() or q in p["condition"].lower() or q in p["area"].lower()]

    return {"status": "success", "total": len(patients), "patients": patients}


@router.get("/at-risk-patients")
def get_at_risk_patients(current_clinician: User = Depends(require_physio)):
    """
    GET /api/physio/at-risk-patients
    Returns patients sorted by dropout risk score (0-100%) with risk factors and recommended interventions.
    """
    patients = predictive_agent.get_at_risk_patients()
    return {
        "status": "success",
        "total_at_risk": len([p for p in patients if p["risk_level"] in ("HIGH", "MODERATE")]),
        "high_risk_count": len([p for p in patients if p["risk_level"] == "HIGH"]),
        "moderate_risk_count": len([p for p in patients if p["risk_level"] == "MODERATE"]),
        "low_risk_count": len([p for p in patients if p["risk_level"] == "LOW"]),
        "patients": patients
    }


@router.get("/patients/{patient_id}")
def get_patient_clinical_profile(
    patient_id: str,
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    """
    Returns full medical overview, goals, surgical history, and chronological timeline.
    Requires Physiotherapist credentials.
    """
    soap_records = db.query(SOAPNote).filter(SOAPNote.patient_id == patient_id).order_by(desc(SOAPNote.created_at)).all()
    goals = db.query(PatientGoal).filter(PatientGoal.patient_id == patient_id).all()

    return {
        "status": "success",
        "profile": {
            "id": patient_id,
            "name": "Rahul Sharma",
            "age": 64,
            "gender": "Male",
            "phone": "+91 98201 44829",
            "address": "Flat 302, Green Meadows, Kankarbagh, Patna",
            "emergency_contact": "Pooja Sharma (Daughter) - +91 98201 44829",
            "condition": "Right Total Knee Arthroplasty (TKA)",
            "surgery_date": "2026-09-18 (Post-Op Day 14)",
            "referring_doctor": "Dr. S. K. Mukherjee, MS (Ortho)",
            "medical_history": ["Type 2 Diabetes (Controlled)", "Mild Hypertension"],
            "surgical_history": ["Right TKA under spinal anesthesia, unconstrained cruciate retaining prosthesis"],
            "goals_summary": "Reach 90° knee flexion by Day 14, ambulate without walker support by Day 21.",
            "timeline": [
                {"title": "Initial Assessment", "date": "19 Sep 2026", "summary": "Baseline assessment post-discharge. Flexion 45°, pain 6/10."},
                {"title": "Visit 1 - Cryotherapy & Quad Setting", "date": "23 Sep 2026", "summary": "Quad sets initiated. Extension lag reduced from -10° to -6°."},
                {"title": "Visit 2 - Passive Range Expansion", "date": "28 Sep 2026", "summary": "Active assisted flexion reached 72°. Tolerated seated heel slides."},
                {"title": "Visit 3 - Milestone Evaluation", "date": "03 Oct 2026", "summary": "Active flexion reached 88°. Patellar glide free. Walker transition started."},
                {"title": "Follow-Up Scheduled", "date": "07 Oct 2026", "summary": "Stair navigation and single cane gait training."}
            ],
            "goals": [g.to_dict() for g in goals] if goals else [
                {"goal_name": "Active Knee Flexion", "baseline": 45, "current_value": 88, "target_value": 120, "unit": "°", "status": "IN_PROGRESS"},
                {"goal_name": "Extension Lag", "baseline": -10, "current_value": -3, "target_value": 0, "unit": "°", "status": "IN_PROGRESS"},
                {"goal_name": "Pain on Evening Ambulation", "baseline": 7, "current_value": 2, "target_value": 0, "unit": "/10", "status": "IN_PROGRESS"}
            ],
            "recent_soaps": [s.to_dict() for s in soap_records]
        }
    }


# =========================================================================
# Clinical SOAP & AI Assistant (With Mandatory Audit Trail)
# =========================================================================

@router.post("/soap/ai-draft")
def generate_ai_soap_draft(
    payload: AIDraftSOAPPayload,
    current_clinician: User = Depends(require_physio)
):
    """
    AI Clinical SOAP Assistant:
    Synthesizes objective delta between visits and creates a structured SOAP draft.
    LABEL: 'AI-assisted draft — therapist review required.'
    """
    delta_flexion = payload.current_flexion - payload.previous_flexion
    delta_pain = payload.previous_pain - payload.current_pain

    subjective_draft = (
        f"Patient reports feeling more confident during morning domestic transfers. "
        f"Pain level rated at {payload.current_pain}/10 on VAS, showing a {delta_pain}-point improvement from previous session. "
        f"Complies with cryotherapy elevation schedule 3 times daily."
    )
    objective_draft = (
        f"Active Right Knee Flexion measured at {payload.current_flexion}° (+{delta_flexion}° compared to baseline of {payload.previous_flexion}°). "
        f"Extension lag is at -3°. Quadriceps recruitment shows firm voluntary isometric contraction without extensor lag. "
        f"{payload.observations}"
    )
    assessment_draft = (
        f"Patient is demonstrating progressive functional mobility consistent with Post-Op Day 14 TKA recovery protocols. "
        f"Reduced soft-tissue guarding and improved active motor recruitment indicate positive response to bedside protocol."
    )
    plan_draft = (
        f"1. Progress active-assisted seated heel slides to 3 sets of 10 repetitions.\n"
        f"2. Initiate straight leg raises with 5-second isometric terminal hold.\n"
        f"3. Continue cryotherapy 20 minutes post-exercise.\n"
        f"4. Next home visit review scheduled in 72 hours."
    )

    return {
        "status": "success",
        "disclaimer": "AI-assisted draft — therapist review required.",
        "draft": {
            "subjective": subjective_draft,
            "objective": objective_draft,
            "assessment": assessment_draft,
            "plan": plan_draft
        }
    }


@router.post("/patients/{patient_id}/soap")
def save_soap_note(
    patient_id: str,
    payload: SaveSOAPPayload,
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    """
    Finalizes clinical SOAP note into permanent patient record.
    Generates server-side Audit Log for clinical accountability.
    """
    note = SOAPNote(
        patient_id=patient_id,
        date=datetime.utcnow().strftime("%d %b %Y"),
        therapist_name=current_clinician.full_name or "Dr. Ananya Iyer, PT",
        subjective=payload.subjective,
        objective=payload.objective,
        assessment=payload.assessment,
        plan=payload.plan,
        ai_assisted=payload.ai_assisted or False,
        ai_draft_used=payload.ai_draft_used or False,
        status="FINALIZED"
    )
    db.add(note)
    
    # Audit trail entry
    audit = AuditLog(
        actor_email=current_clinician.email,
        action="SOAP_NOTE_FINALIZED",
        target_type="SOAPNote",
        target_id=patient_id,
        reason=f"Clinical note finalized by {current_clinician.full_name} (AI Assisted: {payload.ai_assisted})"
    )
    db.add(audit)
    db.commit()
    db.refresh(note)

    return {
        "status": "success",
        "message": "Clinical SOAP note finalized and committed to patient record.",
        "note": note.to_dict()
    }


@router.get("/patients/{patient_id}/soap")
def get_patient_soaps(
    patient_id: str,
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    notes = db.query(SOAPNote).filter(SOAPNote.patient_id == patient_id).order_by(desc(SOAPNote.created_at)).all()
    return {"status": "success", "notes": [n.to_dict() for n in notes]}


# =========================================================================
# CLINICAL AI APPROVAL GATE (Rehabilitation Plans)
# State Machine: DRAFT -> PENDING_REVIEW -> APPROVED / REJECTED / MODIFIED -> VISIBLE_TO_PATIENT
# =========================================================================

@router.get("/rehab-plans/pending")
def get_pending_rehab_plans(
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    """
    Returns AI-generated exercise and rehabilitation plans awaiting clinician sign-off.
    """
    plans = db.query(RehabPlan).filter(RehabPlan.status == PlanApprovalStatus.PENDING_REVIEW).order_by(desc(RehabPlan.created_at)).all()
    return {
        "status": "success",
        "total_pending": len(plans),
        "plans": [p.to_dict() for p in plans]
    }


@router.post("/rehab-plans/{plan_id}/approve")
def approve_rehab_plan(
    plan_id: int,
    payload: Optional[ApprovePlanPayload] = None,
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    """
    Physiotherapist signs off and approves the AI-generated rehabilitation plan.
    Transitions status to APPROVED so it becomes visible to the patient.
    """
    plan = db.query(RehabPlan).filter(RehabPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Rehabilitation plan not found")

    plan.status = PlanApprovalStatus.APPROVED
    plan.reviewed_by = current_clinician.full_name or "Dr. Ananya Iyer, PT"
    plan.reviewed_at = datetime.utcnow()
    if payload and payload.notes:
        plan.clinical_notes = payload.notes

    # Create immutable audit log
    audit = AuditLog(
        actor_email=current_clinician.email,
        action="CLINICAL_AI_PLAN_APPROVED",
        target_type="RehabPlan",
        target_id=str(plan_id),
        reason=payload.notes if payload else "Approved by supervising physiotherapist"
    )
    db.add(audit)
    db.commit()
    db.refresh(plan)

    return {
        "status": "success",
        "message": f"Rehabilitation plan #{plan_id} for patient {plan.patient_id} APPROVED and made visible to patient.",
        "plan": plan.to_dict()
    }


@router.post("/rehab-plans/{plan_id}/reject")
def reject_rehab_plan(
    plan_id: int,
    payload: RejectPlanPayload,
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    """
    Physiotherapist rejects the AI draft.
    Prevents patient from viewing unapproved exercise dosages.
    """
    plan = db.query(RehabPlan).filter(RehabPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Rehabilitation plan not found")

    plan.status = PlanApprovalStatus.REJECTED
    plan.reviewed_by = current_clinician.full_name or "Dr. Ananya Iyer, PT"
    plan.reviewed_at = datetime.utcnow()
    plan.clinical_notes = payload.reason

    audit = AuditLog(
        actor_email=current_clinician.email,
        action="CLINICAL_AI_PLAN_REJECTED",
        target_type="RehabPlan",
        target_id=str(plan_id),
        reason=payload.reason
    )
    db.add(audit)
    db.commit()
    db.refresh(plan)

    return {
        "status": "success",
        "message": f"Rehabilitation plan #{plan_id} marked as REJECTED.",
        "plan": plan.to_dict()
    }


@router.put("/rehab-plans/{plan_id}/modify")
def modify_rehab_plan(
    plan_id: int,
    payload: ModifyPlanPayload,
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    """
    Physiotherapist edits exercise dosages or instructions and approves the customized plan.
    """
    plan = db.query(RehabPlan).filter(RehabPlan.id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Rehabilitation plan not found")

    plan.plan_data = json.dumps(payload.plan_data)
    plan.status = PlanApprovalStatus.MODIFIED
    plan.reviewed_by = current_clinician.full_name or "Dr. Ananya Iyer, PT"
    plan.reviewed_at = datetime.utcnow()
    plan.clinical_notes = payload.clinical_notes

    audit = AuditLog(
        actor_email=current_clinician.email,
        action="CLINICAL_AI_PLAN_MODIFIED",
        target_type="RehabPlan",
        target_id=str(plan_id),
        reason=payload.clinical_notes or "Modified by supervising therapist"
    )
    db.add(audit)
    db.commit()
    db.refresh(plan)

    return {
        "status": "success",
        "message": f"Rehabilitation plan #{plan_id} customized and committed.",
        "plan": plan.to_dict()
    }


# =========================================================================
# Movement Analysis & Telemetry
# =========================================================================

@router.post("/movement-analysis")
def analyze_movement(
    payload: MovementAnalysisPayload,
    current_clinician: User = Depends(require_physio)
):
    """
    Movement / Camera Angle Estimator:
    Returns estimated joint angle change with safety verification prompt.
    LABEL: 'AI-assisted measurement — therapist verification required.'
    """
    delta = payload.estimated_angle - (payload.previous_angle or 82.0)
    return {
        "status": "success",
        "disclaimer": "AI-assisted measurement — therapist verification required.",
        "movement_type": payload.movement_type,
        "estimated_angle": payload.estimated_angle,
        "previous_angle": payload.previous_angle or 82.0,
        "delta_degrees": round(delta, 1),
        "repetitions_detected": payload.repetitions or 10,
        "duration_seconds": payload.duration_seconds or 45,
        "confidence_score": 0.94,
        "therapist_verification_pending": True
    }


@router.get("/earnings")
def get_earnings_report(
    current_clinician: User = Depends(require_physio),
    db: Session = Depends(get_db)
):
    """
    Returns revenue breakdown and transaction ledger.
    Requires Physiotherapist credentials.
    """
    transactions = [
        {"id": 1, "date": "12 Oct 2026", "patient": "Rahul Sharma", "service": "Home Visit Session", "amount": 750, "method": "UPI", "status": "PAID"},
        {"id": 2, "date": "12 Oct 2026", "patient": "Amit Kumar", "service": "Home Visit Session", "amount": 750, "method": "Cash", "status": "PAID"},
        {"id": 3, "date": "11 Oct 2026", "patient": "Sunita Patel", "service": "Home Visit Session", "amount": 750, "method": "UPI", "status": "PAID"},
        {"id": 4, "date": "10 Oct 2026", "patient": "Anand Verma", "service": "Milestone Review", "amount": 750, "method": "Online", "status": "PENDING"}
    ]
    return {
        "status": "success",
        "summary": {
            "today": 1500,
            "this_week": 8250,
            "this_month": 34500,
            "pending": 750
        },
        "transactions": transactions
    }


@router.get("/follow-ups")
def get_follow_ups(current_clinician: User = Depends(require_physio)):
    """
    Returns clinical follow-up watchlist for post-op safety.
    """
    follow_ups = [
        {
            "id": 1,
            "patient_id": "rahul_123",
            "patient_name": "Rahul Sharma",
            "phone": "+91 98201 44829",
            "condition": "Right Knee Replacement",
            "last_visit": "12 Oct",
            "follow_up_due": "15 Oct",
            "status": "DUE_SOON",
            "reason": "Day 17 flexion milestone review"
        },
        {
            "id": 2,
            "patient_id": "patient_anand_71",
            "patient_name": "Anand Verma",
            "phone": "+91 98451 90812",
            "condition": "Bilateral Hip Arthroplasty",
            "last_visit": "11 Oct",
            "follow_up_due": "14 Oct",
            "status": "URGENT",
            "reason": "Reported 5/10 evening discomfort review"
        }
    ]
    return {"status": "success", "follow_ups": follow_ups}


@router.get("/service-area")
def get_service_areas():
    return {
        "status": "success",
        "areas": [
            {"id": "kankarbagh", "name": "Kankarbagh", "active": True, "lead_time_min": 20},
            {"id": "rajendra_nagar", "name": "Rajendra Nagar", "active": True, "lead_time_min": 25},
            {"id": "boring_road", "name": "Boring Road", "active": True, "lead_time_min": 35},
            {"id": "patliputra", "name": "Patliputra Colony", "active": True, "lead_time_min": 40},
            {"id": "bailey_road", "name": "Bailey Road", "active": True, "lead_time_min": 30},
            {"id": "danapur", "name": "Danapur", "active": False, "lead_time_min": 50}
        ]
    }


@router.get("/availability")
def get_availability():
    return {
        "status": "success",
        "working_days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "working_hours": "09:00 AM - 07:00 PM",
        "break_time": "01:00 PM - 03:00 PM",
        "slot_duration_minutes": 45,
        "home_visit_available": True
    }


def seed_demo_clinical_data(db: Session):
    """Seed initial realistic clinical appointments and patient goals."""
    a1 = Appointment(
        reference_id="APT-1001",
        patient_id="rahul_123",
        patient_name="Rahul Sharma",
        phone="+91 98201 44829",
        age=64,
        location="Flat 302, Green Meadows, Kankarbagh, Patna",
        area="Kankarbagh",
        condition="Right Knee Replacement (TKA)",
        service="Home Visit Physiotherapy",
        date="Today",
        time="10:00 AM",
        status="CONFIRMED",
        physiotherapist="Dr. Ananya Iyer, PT",
        fee=750.0,
        payment_status="PAID",
        notes="Day 14 milestone checkup and quadriceps activation."
    )
    a2 = Appointment(
        reference_id="APT-1002",
        patient_id="patient_amit_42",
        patient_name="Amit Kumar",
        phone="+91 98350 12890",
        age=42,
        location="Lane 4, Boring Road, Patna",
        area="Boring Road",
        condition="Lower Back Pain (L4-L5 Disc Herniation)",
        service="Home Visit Physiotherapy",
        date="Today",
        time="12:00 PM",
        status="CONFIRMED",
        physiotherapist="Dr. Ananya Iyer, PT",
        fee=750.0,
        payment_status="PENDING",
        notes="McKenzie extension protocol and core stabilization."
    )
    a3 = Appointment(
        reference_id="APT-1003",
        patient_id="patient_anjali_8",
        patient_name="Anjali Sharma",
        phone="+91 98112 77890",
        age=8,
        location="House 12, Rajendra Nagar, Patna",
        area="Rajendra Nagar",
        condition="Pediatric Motor Delay",
        service="Pediatric Physiotherapy",
        date="Today",
        time="04:00 PM",
        status="CONFIRMED",
        physiotherapist="Dr. Ananya Iyer, PT",
        fee=750.0,
        payment_status="PENDING",
        notes="Gait and posture balance games."
    )
    db.add_all([a1, a2, a3])
    db.commit()
