"""
SQLAlchemy Database setup and models for Movra Physiotherapy Platform.
Stores patient rehabilitation progress, gamification stats, and streaks.
"""
import os
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./movra.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class PatientProgress(Base):
    __tablename__ = "patient_progress"

    patient_id = Column(String(64), primary_key=True, index=True)
    name = Column(String(100), default="Rahul Sharma")
    age = Column(Integer, default=64)
    condition = Column(String(150), default="Right Knee Replacement (TKA)")
    post_op_day = Column(Integer, default=14)
    streak_days = Column(Integer, default=6)
    ai_accuracy_percentage = Column(Integer, default=94)
    weekly_recovery_percentage = Column(Integer, default=80)
    knee_flexion_degrees = Column(Integer, default=88)
    knee_extension_degrees = Column(Integer, default=-3)
    completed_today_count = Column(Integer, default=1)
    total_today_count = Column(Integer, default=3)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Initialize SQLite tables
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def seed_patient_progress(patient_id: str = "rahul_123") -> PatientProgress:
    """Ensure sample patient progress data exists in SQLite"""
    db = SessionLocal()
    try:
        record = db.query(PatientProgress).filter(PatientProgress.patient_id == patient_id).first()
        if not record:
            record = PatientProgress(
                patient_id=patient_id,
                name="Rahul Sharma",
                age=64,
                condition="Right Knee Replacement (TKA)",
                post_op_day=14,
                streak_days=6,
                ai_accuracy_percentage=94,
                weekly_recovery_percentage=80,
                knee_flexion_degrees=88,
                knee_extension_degrees=-3,
                completed_today_count=1,
                total_today_count=3
            )
            db.add(record)
            db.commit()
            db.refresh(record)
        return record
    finally:
        db.close()


# Seed default patient profiles
seed_patient_progress("rahul_123")
seed_patient_progress("patient_rahul_64")
