"""
SQLAlchemy Models for Movra Platform
Includes User authentication model with Role-Based Access Control (RBAC):
- Roles: patient, physiotherapist, admin
- Subscription Tiers: free, pro, clinic
"""
import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text, inspect, text
from database import Base, engine, PatientProgress


class UserRole(str, enum.Enum):
    PATIENT = "patient"
    PHYSIOTHERAPIST = "physiotherapist"
    ADMIN = "admin"


class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    PRO = "pro"
    CLINIC = "clinic"


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


# Ensure tables are created
Base.metadata.create_all(bind=engine)

# Auto-migration helper for SQLite to ensure new columns exist in existing databases
def migrate_user_table():
    try:
        inspector = inspect(engine)
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
