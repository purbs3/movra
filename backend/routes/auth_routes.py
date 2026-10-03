"""
Authentication Routes for Movra Platform
Handles:
- POST /api/auth/signup: Patient & Physiotherapist registration (Admin prohibited)
- POST /api/auth/login: Credential verification & JWT issuance
- POST /api/auth/forgot-password: Password reset link generation (logged to console)
- POST /api/auth/reset-password: Password update via reset token
- GET  /api/auth/me: Current logged-in user profile
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from database import get_db
from models import User, UserRole
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    generate_reset_token,
    get_current_user,
    RoleChecker
)

router = APIRouter(prefix="/api/auth", tags=["Authentication & RBAC"])


# =========================================================================
# Pydantic Schemas
# =========================================================================

class SignupRequest(BaseModel):
    email: str = Field(..., example="patient.rahul@example.com")
    password: str = Field(..., min_length=6, example="Secret123!")
    full_name: str = Field(..., example="Rahul Sharma")
    role: str = Field(..., example="patient", description="Must be 'patient' or 'physiotherapist'")


class LoginRequest(BaseModel):
    email: str = Field(..., example="patient.rahul@example.com")
    password: str = Field(..., example="Secret123!")


class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., example="patient.rahul@example.com")


class ResetPasswordRequest(BaseModel):
    token: str = Field(..., example="reset_token_here")
    new_password: str = Field(..., min_length=6, example="NewSecret123!")


# =========================================================================
# Auth Route Handlers
# =========================================================================

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """
    POST /api/auth/signup
    Registers a new user. ONLY 'patient' and 'physiotherapist' roles are allowed.
    'admin' registrations are strictly blocked (seeded manually).
    """
    clean_email = request.email.strip().lower()
    clean_role = request.role.strip().lower()

    # Rule: ONLY patient and physiotherapist can sign up
    if clean_role not in ["patient", "physiotherapist"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration allowed only for 'patient' or 'physiotherapist' roles. Admin accounts cannot be created via public signup."
        )

    # Check if user already exists
    existing_user = db.query(User).filter(User.email == clean_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Map role
    assigned_role = UserRole.PATIENT if clean_role == "patient" else UserRole.PHYSIOTHERAPIST

    # Hash password & create user
    hashed_pwd = get_password_hash(request.password)
    new_user = User(
        email=clean_email,
        hashed_password=hashed_pwd,
        full_name=request.full_name.strip(),
        role=assigned_role,
        is_active=True,
        created_at=datetime.utcnow()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Automatically generate access token upon signup
    access_token = create_access_token(data={"sub": new_user.email, "role": clean_role})

    return {
        "status": "success",
        "message": f"Successfully registered {new_user.full_name} as {clean_role}.",
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user.to_dict()
    }


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    POST /api/auth/login
    Authenticates user with email and password. Returns signed JWT and role.
    """
    clean_email = request.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated. Please contact support."
        )

    user_role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
    access_token = create_access_token(data={"sub": user.email, "role": user_role_str})

    return {
        "status": "success",
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.to_dict(),
        "role": user_role_str
    }


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    POST /api/auth/forgot-password
    Generates a password reset token and prints the reset link to console for testing.
    """
    clean_email = request.email.strip().lower()
    user = db.query(User).filter(User.email == clean_email).first()

    # Even if user not found, return success message to prevent user enumeration
    if not user:
        return {
            "status": "success",
            "message": "If this email is registered, password reset instructions have been generated."
        }

    reset_token = generate_reset_token()
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
    db.commit()

    # Log/Print to console for testing
    reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
    print("\n" + "="*70)
    print(" [AUTH: PASSWORD RESET LINK GENERATED]")
    print(f" User:  {user.email} ({user.full_name})")
    print(f" Token: {reset_token}")
    print(f" URL:   {reset_url}")
    print("="*70 + "\n")

    return {
        "status": "success",
        "message": "Password reset link generated. Check server console logs for test link.",
        "reset_token_for_testing": reset_token,
        "reset_link": reset_url
    }


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    POST /api/auth/reset-password
    Accepts reset token and new password. Updates password in DB.
    """
    if not request.token or not request.token.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token is required."
        )

    user = db.query(User).filter(User.reset_token == request.token.strip()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset token."
        )

    # Check expiration
    if user.reset_token_expires and user.reset_token_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset token has expired. Please request a new one."
        )

    # Update password and clear token
    user.hashed_password = get_password_hash(request.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()

    return {
        "status": "success",
        "message": "Your password has been successfully reset. You can now log in."
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """
    GET /api/auth/me
    Returns current authenticated user details extracted from JWT.
    """
    return {
        "status": "success",
        "user": current_user.to_dict()
    }
