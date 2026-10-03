"""
Seed script to create initial admin and demo user accounts for Movra.
Run:
    python seed_admin.py
"""
import os
import sys
from datetime import datetime

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from models import User, UserRole
from auth import get_password_hash

def seed_users():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    default_users = [
        {
            "email": "admin@movra.ai",
            "password": "Admin@12345",
            "full_name": "Dr. Vikram Malhotra (Admin)",
            "role": UserRole.ADMIN
        },
        {
            "email": "physio@movra.ai",
            "password": "Physio@12345",
            "full_name": "Dr. Ananya Iyer, PT, DPT",
            "role": UserRole.PHYSIOTHERAPIST
        },
        {
            "email": "patient@movra.ai",
            "password": "Patient@12345",
            "full_name": "Rahul Sharma",
            "role": UserRole.PATIENT
        }
    ]

    print("[*] Seeding Movra User Accounts (Admin, Physio, Patient)...")

    for u_data in default_users:
        existing = db.query(User).filter(User.email == u_data["email"]).first()
        if not existing:
            new_u = User(
                email=u_data["email"],
                hashed_password=get_password_hash(u_data["password"]),
                full_name=u_data["full_name"],
                role=u_data["role"],
                is_active=True,
                created_at=datetime.utcnow()
            )
            db.add(new_u)
            print(f"  [+] Created {u_data['role'].value.upper()}: {u_data['email']} (Password: {u_data['password']})")
        else:
            print(f"  [=] Exists: {u_data['email']} ({existing.role.value if hasattr(existing.role, 'value') else existing.role})")

    db.commit()
    db.close()
    print("[*] Seeding completed successfully.")

if __name__ == "__main__":
    seed_users()
