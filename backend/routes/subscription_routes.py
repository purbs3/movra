"""
Subscription Routes for Movra Platform
Handles:
- GET  /api/subscription/plans: Available tiers (Free, Pro, Clinic) with pricing & features
- GET  /api/subscription/status/{user_id}: Current subscription status & expiry for a user
- POST /api/subscription/upgrade: Mocks payment gateway integration, updates tier, adds 30 days
"""
import uuid
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from models import User, SubscriptionTier, UserRole

router = APIRouter(prefix="/api/subscription", tags=["Subscription Plans & Billing"])


# =========================================================================
# Subscription Plans Definition
# =========================================================================

AVAILABLE_PLANS = [
    {
        "id": "free",
        "name": "Free Recovery",
        "tagline": "Essential tools for self-paced post-op recovery",
        "price": 0,
        "currency": "USD",
        "period": "forever",
        "is_popular": False,
        "badge": "Standard",
        "features": [
            "Basic Daily Exercises (Knee Extension & Ankle Pumps)",
            "Standard AAOS Recovery Timelines",
            "Day 1-14 Mobility Angle Tracking",
            "Standard Community Support",
            "Local Offline Mode"
        ],
        "limitations": [
            "Limited AI Physio Chat (5 messages/day)",
            "No Real-time Voice Physio Consultations",
            "No Advanced DuckDB Telemetry Analytics"
        ]
    },
    {
        "id": "pro",
        "name": "Pro Recovery AI",
        "tagline": "Full clinical intelligence with voice & deep analytics",
        "price": 19,
        "currency": "USD",
        "period": "per month",
        "is_popular": True,
        "badge": "Most Popular",
        "features": [
            "Unlimited AI Physio Chat (Contextual RAG & Mem0)",
            "Private On-Device Local Deepseek Inference",
            "Interactive AI Voice Physio (Speech-to-Speech)",
            "DuckDB & Pandas 14-Day Trajectory Analytics",
            "Interactive Goniometer ROM Angle Visualization",
            "Full Patient Education Library (Physio Professor)",
            "Priority Guideline Citations & Clinical Alerts"
        ],
        "limitations": []
    },
    {
        "id": "clinic",
        "name": "Clinic Concierge",
        "tagline": "Direct 1-on-1 human physiotherapist supervision",
        "price": 79,
        "currency": "USD",
        "period": "per month",
        "is_popular": False,
        "badge": "Clinical Partner",
        "features": [
            "Everything in Pro Recovery AI",
            "Direct 1-on-1 Licensed Physical Therapist Review",
            "Monthly Remote Therapeutic Monitoring (RTM) Report",
            "CMS CPT Code (98975, 98977) Reimbursable Logs",
            "Direct Clinician EHR Integration (Epic / Cerner)",
            "24/7 Priority Emergency Clinical Triage"
        ],
        "limitations": []
    }
]


# =========================================================================
# Pydantic Schemas
# =========================================================================

class UpgradeSubscriptionRequest(BaseModel):
    user_id: Any = Field(..., example="patient@movra.ai", description="User ID, email, or patient identifier")
    plan_id: str = Field(..., example="pro", description="Must be 'pro' or 'clinic'")
    payment_method: Optional[str] = Field("card_mock", example="card_mock")


# =========================================================================
# Helper: Find User by ID, Email, or Patient ID
# =========================================================================

def find_user_flexible(user_id: Any, db: Session) -> Optional[User]:
    user_str = str(user_id).strip().lower()
    
    # Try integer ID
    if user_str.isdigit():
        u = db.query(User).filter(User.id == int(user_str)).first()
        if u:
            return u

    # Try Email
    u = db.query(User).filter(User.email == user_str).first()
    if u:
        return u

    # Try matching demo emails if 'rahul_123' or 'patient'
    if "rahul" in user_str or "patient" in user_str:
        u = db.query(User).filter(User.email == "patient@movra.ai").first()
        if u:
            return u

    # Fallback to first patient or any user
    return db.query(User).filter(User.role == UserRole.PATIENT).first() or db.query(User).first()


# =========================================================================
# Endpoints
# =========================================================================

@router.get("/plans")
def get_subscription_plans():
    """
    GET /api/subscription/plans
    Returns the list of available subscription tiers, pricing, and feature breakdowns.
    """
    return {
        "status": "success",
        "plans": AVAILABLE_PLANS
    }


@router.get("/status/{user_id}")
def get_subscription_status(user_id: str, db: Session = Depends(get_db)):
    """
    GET /api/subscription/status/{user_id}
    Returns current user's subscription tier, expiration, and active features.
    """
    user = find_user_flexible(user_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{user_id}' not found."
        )

    tier = user.subscription_tier.value if hasattr(user.subscription_tier, "value") else str(user.subscription_tier or "free")
    
    # Check if subscription has expired
    is_active = True
    days_remaining = None
    if user.subscription_expires_at:
        now = datetime.utcnow()
        if user.subscription_expires_at < now:
            is_active = False
            tier = "free"
            days_remaining = 0
        else:
            delta = user.subscription_expires_at - now
            days_remaining = max(1, delta.days)

    # Find plan metadata
    plan_meta = next((p for p in AVAILABLE_PLANS if p["id"] == tier), AVAILABLE_PLANS[0])

    return {
        "status": "success",
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "subscription_tier": tier,
        "subscription_expires_at": user.subscription_expires_at.isoformat() if user.subscription_expires_at else None,
        "is_active": is_active,
        "days_remaining": days_remaining,
        "plan_details": plan_meta
    }


@router.post("/upgrade")
def upgrade_subscription(request: UpgradeSubscriptionRequest, db: Session = Depends(get_db)):
    """
    POST /api/subscription/upgrade
    Simulates payment gateway processing (Stripe/Razorpay), updates subscription tier,
    and extends subscription_expires_at by 30 days.
    """
    clean_plan = request.plan_id.strip().lower()
    if clean_plan not in ["free", "pro", "clinic"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan_id. Must be 'free', 'pro', or 'clinic'."
        )

    user = find_user_flexible(request.user_id, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User '{request.user_id}' not found."
        )

    # Mock payment processing
    transaction_id = f"tx_movra_{uuid.uuid4().hex[:12]}"
    payment_status = "succeeded"

    # Map tier enum
    new_tier = (
        SubscriptionTier.PRO if clean_plan == "pro" 
        else SubscriptionTier.CLINIC if clean_plan == "clinic" 
        else SubscriptionTier.FREE
    )

    # Calculate 30 days extension
    now = datetime.utcnow()
    if user.subscription_expires_at and user.subscription_expires_at > now:
        # Extend from current expiration
        new_expiry = user.subscription_expires_at + timedelta(days=30)
    else:
        new_expiry = now + timedelta(days=30)

    user.subscription_tier = new_tier
    user.subscription_expires_at = new_expiry if clean_plan != "free" else None

    db.commit()
    db.refresh(user)

    plan_meta = next((p for p in AVAILABLE_PLANS if p["id"] == clean_plan), AVAILABLE_PLANS[1])

    return {
        "status": "success",
        "message": f"Successfully activated {plan_meta['name']}! 30 days added to your account.",
        "transaction_id": transaction_id,
        "payment_status": payment_status,
        "user_id": user.id,
        "email": user.email,
        "subscription_tier": clean_plan,
        "subscription_expires_at": user.subscription_expires_at.isoformat() if user.subscription_expires_at else None,
        "plan_details": plan_meta
    }
