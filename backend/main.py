"""
Movra AI Physiotherapy Platform - Backend Entry Point
FastAPI app setup, CORS configuration, and route registrations.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import sys

# Ensure backend root is in Python module path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from routes.api_routes import router as api_router
from routes.auth_routes import router as auth_router
from routes.subscription_routes import router as subscription_router
from routes.booking_routes import router as booking_router
from routes.physio_routes import router as physio_router
from routes.admin_routes import router as admin_router
from seed_admin import seed_users
from database import engine, Base
import models

app = FastAPI(
    title="Movra AI Physiotherapy API",
    description="Backend API powering AI Physio voice, clinical RAG reasoning, patient memory, Role-Based Authentication, Subscriptions, and Home Visit Bookings.",
    version="1.0.0"
)

# Initialize database schema and default admin/demo users
Base.metadata.create_all(bind=engine)
try:
    seed_users()
except Exception as e:
    print(f"[*] Seed note: {e}")

# ==========================================
# CORS CONFIGURATION
# ==========================================
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://movra-dvcs.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(auth_router)
app.include_router(subscription_router)
app.include_router(booking_router)
app.include_router(physio_router)
app.include_router(admin_router)
app.include_router(api_router)


@app.get("/")
def root():
    return {
        "platform": "Movra AI Physiotherapy Backend",
        "status": "online",
        "documentation": "/docs",
        "endpoints": [
            "GET  /api/subscription/plans (Subscription tiers & features)",
            "GET  /api/subscription/status/{user_id} (User subscription status & expiry)",
            "POST /api/subscription/upgrade (Upgrade tier & extend 30 days)",
            "POST /api/auth/login",
            "POST /api/auth/signup",
            "POST /api/chat (Cloud Mode: Contextual AI RAGAgent + MemoryAgent)",
            "POST /api/local-chat (Private Mode: Ollama Deepseek-R1 + Qdrant LocalRAGAgent)",
            "GET  /api/learn/{topic} (Patient Education: TeachingAgent / Physio Professor)",
            "POST /api/admin/scrape (Web Research: ScraperAgent / ScrapeGraphAI)",
            "POST /api/admin/consult (Business Strategy: ConsultantAgent / Google ADK & Perplexity)",
            "POST /api/voice (VoiceAgent: STT, Qdrant guidelines, OpenAI TTS)",
            "GET  /api/today-plan/{patient_id} (PhysioAgent: Agno + Gemini)",
            "GET  /api/progress/{patient_id} (AnalystAgent: DuckDB + Pandas on CSV)",
            "GET  /api/patient-memory/{patient_id} (MemoryAgent: Mem0 + Qdrant)",
            "POST /api/patient-memory",
            "POST /api/patient-memory/toggle",
            "POST /api/generate-plan"
        ],
        "message": "Movra Physiotherapy API running with 9 specialized agents."
    }


if __name__ == "__main__":
    # Render ke liye PORT environment variable zaroori hai
    port = int(os.environ.get("PORT", 8000))
    print(f"[*] Starting Movra Backend on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
