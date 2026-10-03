"""
Booking Routes for Movra Platform
Handles patient home-visit physiotherapy requests, status tracking, and clinician confirmation.
"""
import random
import uuid
from datetime import datetime
from typing import Optional, List, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import desc

from database import get_db
from models import Booking, BookingStatus, User

router = APIRouter(prefix="/api/bookings", tags=["Physiotherapy Home Visit Bookings"])


class CreateBookingRequest(BaseModel):
    name: str = Field(..., example="Rahul Sharma")
    phone: str = Field(..., example="+91 98765 43210")
    age: Any = Field(..., example=64)
    location: str = Field(..., example="Bandra West, Mumbai")
    condition: str = Field(..., example="Knee Pain / Post-Op TKA")
    service: Optional[str] = Field("Home Visit Physiotherapy", example="Home Visit Physiotherapy")
    preferred_date: str = Field(..., example="2026-10-12")
    preferred_time: str = Field(..., example="10:00 AM")
    message: Optional[str] = Field(None, example="Needs assistance with post-operative knee extension protocol.")
    user_id: Optional[Any] = Field(None, example=3)


class UpdateBookingStatusRequest(BaseModel):
    status: str = Field(..., example="CONFIRMED")
    physiotherapist: Optional[str] = Field(None, example="Dr. Ananya Iyer, PT")


def generate_reference_id() -> str:
    suffix = random.randint(1000, 9999)
    return f"MOV-BK-{suffix}"


@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_booking(payload: CreateBookingRequest, db: Session = Depends(get_db)):
    """
    POST /api/bookings
    Submits a new Home Visit Physiotherapy request without requiring account upfront.
    """
    ref_id = generate_reference_id()
    
    # Try resolving user_id if string passed
    user_int_id = None
    if payload.user_id:
        try:
            user_int_id = int(payload.user_id)
        except ValueError:
            # Check by email
            matched = db.query(User).filter(User.email == str(payload.user_id).lower()).first()
            if matched:
                user_int_id = matched.id

    booking = Booking(
        reference_id=ref_id,
        user_id=user_int_id,
        name=payload.name.strip(),
        phone=payload.phone.strip(),
        age=str(payload.age).strip(),
        location=payload.location.strip(),
        condition=payload.condition.strip(),
        service=payload.service or "Home Visit Physiotherapy",
        preferred_date=payload.preferred_date.strip(),
        preferred_time=payload.preferred_time.strip(),
        message=payload.message.strip() if payload.message else None,
        status="PENDING",
        physiotherapist="Dr. Ananya Iyer, PT",
        created_at=datetime.utcnow()
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "status": "success",
        "message": "Home visit request submitted successfully. A clinician will contact you to confirm.",
        "booking": booking.to_dict()
    }


@router.get("/my")
def get_my_bookings(
    user_id: Optional[str] = Query(None),
    phone: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    GET /api/bookings/my
    Returns bookings associated with the current user, email, or phone.
    """
    query = db.query(Booking)
    matched = False

    if user_id:
        try:
            uid = int(user_id)
            query = query.filter(Booking.user_id == uid)
            matched = True
        except ValueError:
            pass

    if not matched and email:
        user_found = db.query(User).filter(User.email == email.strip().lower()).first()
        if user_found:
            query = query.filter(Booking.user_id == user_found.id)
            matched = True

    if not matched and phone:
        query = query.filter(Booking.phone.contains(phone.strip()))
        matched = True

    # If no specific filter provided, return default demo patient bookings or latest 5
    if not matched:
        bookings = db.query(Booking).order_by(desc(Booking.created_at)).limit(5).all()
    else:
        bookings = query.order_by(desc(Booking.created_at)).all()

    # If no bookings exist in DB, provide initial realistic demo booking
    if not bookings:
        demo = Booking(
            reference_id="MOV-BK-7492",
            name="Rahul Sharma",
            phone="+91 98201 44829",
            age="64",
            location="Bandra West, Mumbai",
            condition="Post-Op Knee Replacement (TKA)",
            service="Home Visit Physiotherapy",
            preferred_date="12 Oct 2026",
            preferred_time="10:00 AM",
            message="Day 14 milestone flexion and extension checkup.",
            status="PENDING",
            physiotherapist="Dr. Ananya Iyer, PT",
            created_at=datetime.utcnow()
        )
        db.add(demo)
        db.commit()
        db.refresh(demo)
        bookings = [demo]

    return {
        "status": "success",
        "bookings": [b.to_dict() for b in bookings]
    }


@router.get("")
@router.get("/")
def get_all_bookings(
    status_filter: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    GET /api/bookings
    Lists all booking requests for Physiotherapists & Admin portal.
    """
    query = db.query(Booking)
    if status_filter:
        query = query.filter(Booking.status == status_filter.upper())

    bookings = query.order_by(desc(Booking.created_at)).all()

    if not bookings:
        # Seed 2 realistic bookings if empty
        b1 = Booking(
            reference_id="MOV-BK-8812",
            name="Rahul Sharma",
            phone="+91 98201 44829",
            age="64",
            location="Bandra West, Mumbai",
            condition="Right Knee Replacement (TKA)",
            service="Home Visit Physiotherapy",
            preferred_date="12 Oct 2026",
            preferred_time="10:00 AM",
            message="Knee extension checkup and quad recruitment.",
            status="PENDING",
            physiotherapist="Dr. Ananya Iyer, PT",
            created_at=datetime.utcnow()
        )
        b2 = Booking(
            reference_id="MOV-BK-6320",
            name="Sunita Patel",
            phone="+91 98112 33456",
            age="58",
            location="Juhu, Mumbai",
            condition="Left ACL Reconstruction",
            service="Home Visit Physiotherapy",
            preferred_date="14 Oct 2026",
            preferred_time="04:30 PM",
            message="Gait retraining and transition from walker.",
            status="CONFIRMED",
            physiotherapist="Dr. Ananya Iyer, PT",
            created_at=datetime.utcnow()
        )
        db.add_all([b1, b2])
        db.commit()
        bookings = [b1, b2]

    return {
        "status": "success",
        "total": len(bookings),
        "bookings": [b.to_dict() for b in bookings]
    }


@router.patch("/{booking_id}/status")
def update_booking_status(
    booking_id: int,
    payload: UpdateBookingStatusRequest,
    db: Session = Depends(get_db)
):
    """
    PATCH /api/bookings/{booking_id}/status
    Updates the booking status (CONFIRMED, COMPLETED, CANCELLED) and therapist assignment.
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with ID {booking_id} not found."
        )

    booking.status = payload.status.upper()
    if payload.physiotherapist:
        booking.physiotherapist = payload.physiotherapist

    db.commit()
    db.refresh(booking)

    return {
        "status": "success",
        "message": f"Booking {booking.reference_id} marked as {booking.status}.",
        "booking": booking.to_dict()
    }


@router.get("/{booking_id}")
def get_booking_by_id(booking_id: int, db: Session = Depends(get_db)):
    """
    GET /api/bookings/{booking_id}
    Retrieves details for a specific booking.
    """
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking with ID {booking_id} not found."
        )
    return {
        "status": "success",
        "booking": booking.to_dict()
    }
