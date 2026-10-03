"""
SQLAlchemy Models for Movra Platform
Includes User authentication model with Role-Based Access Control (RBAC):
- Roles: patient, physiotherapist, admin
- Subscription Tiers: free, pro, clinic
- Clinical entities: Booking, Appointment, Visit, ClinicalAssessment, SOAPNote, PatientGoal, HomeProgram, PaymentRecord
"""
import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text, Float, inspect, text
from database import Base, engine, PatientProgress


class UserRole(str, enum.Enum):
    PATIENT = "patient"
    PHYSIOTHERAPIST = "physiotherapist"
    ADMIN = "admin"


class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    CLINIC = "clinic"


class BookingStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"


class AppointmentStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    RESCHEDULED = "RESCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    NO_SHOW = "NO_SHOW"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(Enum(UserRole, values_callable=lambda obj: [e.value for e in obj]), default=UserRole.PATIENT, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Password Reset token support
    reset_token = Column(String(255), nullable=True, index=True)
    reset_token_expires = Column(DateTime, nullable=True)

    # Subscription Plans & Expiry
    subscription_tier = Column(
        Enum(SubscriptionTier, values_callable=lambda obj: [e.value for e in obj]),
        default=SubscriptionTier.FREE,
        nullable=False
    )
    subscription_expires_at = Column(DateTime, nullable=True)

    def to_dict(self):
        tier_val = (
            self.subscription_tier.value 
            if isinstance(self.subscription_tier, SubscriptionTier) 
            else str(self.subscription_tier or "free")
        )
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role.value if isinstance(self.role, UserRole) else str(self.role),
            "is_active": self.is_active,
            "subscription_tier": tier_val,
            "subscription_expires_at": self.subscription_expires_at.isoformat() if self.subscription_expires_at else None,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    reference_id = Column(String(50), unique=True, index=True, nullable=False)
    user_id = Column(Integer, nullable=True, index=True)
    name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=False)
    age = Column(String(20), nullable=False)
    location = Column(String(255), nullable=False)
    condition = Column(String(255), nullable=False)
    service = Column(String(150), default="Home Visit Physiotherapy", nullable=False)
    preferred_date = Column(String(50), nullable=False)
    preferred_time = Column(String(50), nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String(50), default="PENDING", nullable=False)
    physiotherapist = Column(String(150), default="Dr. Ananya Iyer, PT", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "reference_id": self.reference_id,
            "user_id": self.user_id,
            "name": self.name,
            "phone": self.phone,
            "age": self.age,
            "location": self.location,
            "condition": self.condition,
            "service": self.service,
            "preferred_date": self.preferred_date,
            "preferred_time": self.preferred_time,
            "message": self.message,
            "status": self.status,
            "physiotherapist": self.physiotherapist,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    reference_id = Column(String(50), unique=True, index=True, nullable=False)
    booking_id = Column(Integer, nullable=True, index=True)
    patient_id = Column(String(100), default="rahul_123", index=True, nullable=False)
    patient_name = Column(String(150), nullable=False)
    phone = Column(String(50), nullable=False)
    age = Column(Integer, default=64)
    location = Column(String(255), nullable=False)
    area = Column(String(100), default="Kankarbagh")
    condition = Column(String(255), nullable=False)
    service = Column(String(150), default="Home Visit Physiotherapy", nullable=False)
    date = Column(String(50), nullable=False)
    time = Column(String(50), nullable=False)
    status = Column(String(50), default="CONFIRMED", nullable=False)
    physiotherapist = Column(String(150), default="Dr. Ananya Iyer, PT", nullable=False)
    fee = Column(Float, default=750.0)
    payment_status = Column(String(50), default="PENDING")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "reference_id": self.reference_id,
            "booking_id": self.booking_id,
            "patient_id": self.patient_id,
            "patient_name": self.patient_name,
            "phone": self.phone,
            "age": self.age,
            "location": self.location,
            "area": self.area,
            "condition": self.condition,
            "service": self.service,
            "date": self.date,
            "time": self.time,
            "status": self.status,
            "physiotherapist": self.physiotherapist,
            "fee": self.fee,
            "payment_status": self.payment_status,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class SOAPNote(Base):
    __tablename__ = "soap_notes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    patient_id = Column(String(100), index=True, nullable=False)
    visit_id = Column(Integer, nullable=True)
    therapist_name = Column(String(150), default="Dr. Ananya Iyer, PT")
    date = Column(String(50), nullable=False)
    subjective = Column(Text, nullable=False)
    objective = Column(Text, nullable=False)
    assessment = Column(Text, nullable=False)
    plan = Column(Text, nullable=False)
    ai_assisted = Column(Boolean, default=False)
    ai_draft_used = Column(Boolean, default=False)
    status = Column(String(50), default="FINALIZED")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "visit_id": self.visit_id,
            "therapist_name": self.therapist_name,
            "date": self.date,
            "subjective": self.subjective,
            "objective": self.objective,
            "assessment": self.assessment,
            "plan": self.plan,
            "ai_assisted": self.ai_assisted,
            "ai_draft_used": self.ai_draft_used,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class PatientGoal(Base):
    __tablename__ = "patient_goals"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    patient_id = Column(String(100), index=True, nullable=False)
    goal_name = Column(String(200), nullable=False)
    baseline = Column(Float, nullable=False)
    current_value = Column(Float, nullable=False)
    target_value = Column(Float, nullable=False)
    unit = Column(String(20), default="°")
    target_date = Column(String(50), nullable=False)
    status = Column(String(50), default="IN_PROGRESS")  # NOT_STARTED, IN_PROGRESS, ACHIEVED, REVIEW_NEEDED
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "patient_id": self.patient_id,
            "goal_name": self.goal_name,
            "baseline": self.baseline,
            "current_value": self.current_value,
            "target_value": self.target_value,
            "unit": self.unit,
            "target_date": self.target_date,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class PaymentRecord(Base):
    __tablename__ = "payment_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    reference_id = Column(String(50), unique=True, index=True, nullable=False)
    patient_id = Column(String(100), index=True, nullable=False)
    patient_name = Column(String(150), nullable=False)
    service = Column(String(150), default="Home Visit Physiotherapy")
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), default="UPI")  # UPI, Cash, Online
    status = Column(String(50), default="PAID")  # PAID, PENDING, FAILED, REFUNDED
    date = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "reference_id": self.reference_id,
            "patient_id": self.patient_id,
            "patient_name": self.patient_name,
            "service": self.service,
            "amount": self.amount,
            "payment_method": self.payment_method,
            "status": self.status,
            "date": self.date,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


# Ensure tables are created
Base.metadata.create_all(bind=engine)

# Auto-migration helper for SQLite to ensure new columns and tables exist in existing databases
def migrate_user_table():
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        for table_cls in [Booking, Appointment, SOAPNote, PatientGoal, PaymentRecord]:
            if table_cls.__tablename__ not in tables:
                table_cls.__table__.create(bind=engine)
                print(f"[*] Migration: Created '{table_cls.__tablename__}' table.")

        columns = [col["name"] for col in inspector.get_columns("users")]
        with engine.connect() as conn:
            if "subscription_tier" not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(20) DEFAULT 'free' NOT NULL;"))
                print("[*] Migration: Added 'subscription_tier' column to users table.")
            if "subscription_expires_at" not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN subscription_expires_at DATETIME;"))
                print("[*] Migration: Added 'subscription_expires_at' column to users table.")
            conn.commit()
    except Exception as e:
        print(f"[*] Schema migration notice: {e}")

migrate_user_table()
