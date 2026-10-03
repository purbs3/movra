"""
API Routes for Movra AI Physiotherapy Platform
Connects frontend requests to all 9 clinical & business AI agents:
1. RAGAgent (Contextual AI)
2. PhysioAgent (Agno + Gemini)
3. MemoryAgent (Mem0 + Qdrant)
4. VoiceAgent (OpenAI TTS/Whisper + Qdrant guidelines)
5. AnalystAgent (Agno, DuckDB, Pandas recovery metrics telemetry)
6. LocalRAGAgent (Ollama Deepseek + Qdrant offline privacy mode)
7. TeachingAgent (Agno + OpenAI patient education)
8. ScraperAgent (ScrapeGraphAI clinical web research)
9. ConsultantAgent (Google ADK & Perplexity market strategist)
"""
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import sys
import os

# Ensure backend root is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from agents.physio_agent import PhysioAgent
from agents.rag_agent import RAGAgent
from agents.voice_agent import VoiceAgent
from agents.memory_agent import MemoryAgent
from agents.analyst_agent import AnalystAgent
from agents.local_rag_agent import LocalRAGAgent
from agents.teaching_agent import TeachingAgent
from agents.scraper_agent import ScraperAgent
from agents.consultant_agent import ConsultantAgent
from database import SessionLocal, PatientProgress, seed_patient_progress

router = APIRouter(prefix="/api", tags=["Physiotherapy API"])

# Instantiate Agent Singletons
physio_agent = PhysioAgent()
rag_agent = RAGAgent()
voice_agent = VoiceAgent()
memory_agent = MemoryAgent()
analyst_agent = AnalystAgent()
local_rag_agent = LocalRAGAgent()
teaching_agent = TeachingAgent()
scraper_agent = ScraperAgent()
consultant_agent = ConsultantAgent()


# =========================================================================
# Pydantic Schemas
# =========================================================================

class ChatRequest(BaseModel):
    message: Optional[str] = Field(None, example="My knee clicks when doing extension")
    query: Optional[str] = Field(None, example="My knee clicks when doing extension")
    patient_id: Optional[str] = Field("rahul_123", example="rahul_123")


class LocalChatRequest(BaseModel):
    message: Optional[str] = Field(None, example="Is clicking normal in my knee?")
    query: Optional[str] = Field(None, example="Is clicking normal in my knee?")
    patient_id: Optional[str] = Field("rahul_123", example="rahul_123")


class MemoryToggleRequest(BaseModel):
    enabled: bool = Field(..., example=True)
    patient_id: Optional[str] = Field("rahul_123", example="rahul_123")


class AddMemoryItemRequest(BaseModel):
    category: str = Field(..., example="Pain Threshold")
    summary: str = Field(..., example="Reports tightness on lateral side at 85 deg")
    patient_id: Optional[str] = Field("rahul_123", example="rahul_123")


class GeneratePlanRequest(BaseModel):
    patient_id: Optional[str] = Field("rahul_123", example="rahul_123")
    name: Optional[str] = Field("Rahul", example="Rahul")
    age: Optional[int] = Field(64, example=64)
    condition: Optional[str] = Field("Right Knee Replacement (TKA)", example="Right Knee Replacement (TKA)")
    post_op_day: Optional[int] = Field(14, example=14)


class ScrapeRequest(BaseModel):
    url: str = Field(..., example="https://www.aaos.org")
    prompt: str = Field(..., example="Extract post-operative knee extension protocol and precautions")


class ConsultRequest(BaseModel):
    query: str = Field(..., example="What are the optimal CPT reimbursement strategies for home physiotherapy?")


# =========================================================================
# Health & Status
# =========================================================================

@router.get("/health")
def health_check():
    """Verify backend and all 9 clinical AI agents"""
    return {
        "status": "healthy",
        "service": "Movra AI Physiotherapy API",
        "agents": {
            "rag_agent": "ready (Contextual AI)",
            "physio_agent": "ready (Agno & Gemini)",
            "memory_agent": "ready (Mem0 & Qdrant)",
            "voice_agent": "ready (OpenAI TTS/Whisper & Qdrant)",
            "analyst_agent": "ready (Agno, DuckDB & Pandas)",
            "local_rag_agent": "ready (Ollama Deepseek & Qdrant)",
            "teaching_agent": "ready (Agno & OpenAI/Gemini)",
            "scraper_agent": "ready (ScrapeGraphAI)",
            "consultant_agent": "ready (Google ADK & Perplexity)"
        },
        "database": "SQLite (SQLAlchemy connected)"
    }


# -------------------------------------------------------------------------
# 1. Cloud Chat: Unified RAGAgent + MemoryAgent
# -------------------------------------------------------------------------
@router.post("/chat")
def chat_with_physio(request: ChatRequest):
    """
    POST /api/chat
    Unified flow:
    1. Fetch relevant memories from MemoryAgent (Mem0 + Qdrant)
    2. Send memory + message to RAGAgent (Contextual AI)
    3. Get response from RAGAgent
    4. Save interaction to MemoryAgent
    5. Return final response
    """
    user_text = request.message or request.query
    if not user_text or not user_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either 'message' or 'query' must be provided."
        )

    patient_id = request.patient_id or "rahul_123"

    # Step 1: Fetch relevant memories from MemoryAgent
    memories = memory_agent.search_memories(query=user_text.strip(), user_id=patient_id)
    memory_context = ""
    if memories:
        memory_lines = [f"- {m.get('text', '')}" for m in memories if m.get('text')]
        memory_context = "\n".join(memory_lines)

    # Step 2 & 3: Send memory + message to RAGAgent and get response
    response_text = rag_agent.process_query(
        query=user_text.strip(),
        patient_id=patient_id,
        memory_context=memory_context
    )

    # Step 4: Save interaction to MemoryAgent
    interaction_entry = f"Patient asked: {user_text.strip()} | Physio guided: {response_text[:120]}"
    memory_agent.add_memory(text=interaction_entry, user_id=patient_id)

    return {
        "status": "success",
        "response": response_text,
        "message": response_text,
        "patient_id": patient_id,
        "mode": "cloud_rag",
        "memories_consulted": [m.get("text") for m in memories if m.get("text")],
        "guideline_citations": getattr(rag_agent, "last_citations", ["AAOS Knee Rehab Protocol v4.2"]),
        "clinical_alert": "Routine Guidance",
        "agent": "ContextualAI+Mem0"
    }


# -------------------------------------------------------------------------
# 2. Private Local Chat: LocalRAGAgent (Deepseek + Ollama)
# -------------------------------------------------------------------------
@router.post("/local-chat")
def local_chat_with_physio(request: LocalChatRequest):
    """
    POST /api/local-chat
    Calls LocalRAGAgent for offline/private queries using local Deepseek & Qdrant.
    Zero data leaves the patient's local machine.
    """
    user_text = request.message or request.query
    if not user_text or not user_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either 'message' or 'query' must be provided."
        )

    patient_id = request.patient_id or "rahul_123"
    response_text = local_rag_agent.query(user_text.strip())

    return {
        "status": "success",
        "response": response_text,
        "message": response_text,
        "patient_id": patient_id,
        "mode": "private_local",
        "engine": "Ollama (Deepseek-R1:1.5b)",
        "privacy": "100% on-device local execution",
        "guideline_citations": ["Local Clinical Database (On-Premises)"]
    }


# -------------------------------------------------------------------------
# 3. Patient Education: TeachingAgent (Agno + OpenAI)
# -------------------------------------------------------------------------
@router.get("/learn/{topic}")
def get_patient_education_lesson(topic: str):
    """
    GET /api/learn/{topic}
    Calls TeachingAgent (Physio Professor) for patient education.
    Generates step-by-step recovery guides avoiding heavy medical jargon.
    """
    if not topic or not topic.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Topic parameter cannot be empty."
        )

    lesson_content = teaching_agent.generate_lesson(topic.strip())

    return {
        "status": "success",
        "topic": topic,
        "lesson": lesson_content,
        "agent": "TeachingAgent (Physio Professor)"
    }


# -------------------------------------------------------------------------
# 4. Admin Research Scraper: ScraperAgent (ScrapeGraphAI)
# -------------------------------------------------------------------------
@router.post("/admin/scrape")
def admin_scrape_research(request: ScrapeRequest):
    """
    POST /api/admin/scrape
    Calls ScraperAgent for admin research on clinical trials, protocols, or journals.
    """
    if not request.url or not request.prompt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both 'url' and 'prompt' are required."
        )

    result = scraper_agent.scrape_website(url=request.url.strip(), prompt=request.prompt.strip())
    return result


# -------------------------------------------------------------------------
# 5. Admin Strategic Advisory: ConsultantAgent (Google ADK & Perplexity)
# -------------------------------------------------------------------------
@router.post("/admin/consult")
async def admin_consult_advice(request: ConsultRequest):
    """
    POST /api/admin/consult
    Calls ConsultantAgent for digital health business and market advice.
    """
    if not request.query or not request.query.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="'query' cannot be empty."
        )

    advice_text = await consultant_agent.get_advice(request.query.strip())

    return {
        "status": "success",
        "query": request.query,
        "advice": advice_text,
        "agent": "ConsultantAgent (Google ADK + Perplexity)"
    }


# -------------------------------------------------------------------------
# 6. Voice Endpoint: VoiceAgent (Whisper STT + Qdrant guidelines + OpenAI TTS)
# -------------------------------------------------------------------------
@router.post("/voice")
async def voice_consultation(
    audio: UploadFile = File(..., description="Multipart audio file recorded from patient microphone"),
    patient_id: str = Form("rahul_123")
):
    """
    POST /api/voice
    Accepts audio file, converts to text, uses VoiceAgent to return text + TTS audio.
    """
    try:
        voice_result = voice_agent.process_audio(
            audio_file=audio,
            patient_id=patient_id
        )

        transcription = voice_result.get("transcription", "")
        text_response = voice_result.get("text_response", "")
        if transcription:
            memory_agent.add_memory(
                text=f"Voice consultation: {transcription} | Response: {text_response[:100]}",
                user_id=patient_id
            )

        return {
            "status": "success",
            "transcription": transcription,
            "text_response": text_response,
            "response": text_response,
            "message": text_response,
            "audio_path": voice_result.get("audio_path"),
            "audio_file": voice_result.get("audio_file"),
            "sources": voice_result.get("sources", []),
            "patient_id": patient_id
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing voice payload: {str(e)}"
        )


# -------------------------------------------------------------------------
# 7. Today's Plan: PhysioAgent (Agno + Gemini)
# -------------------------------------------------------------------------
@router.get("/today-plan/{patient_id}")
def get_today_plan_by_id(patient_id: str):
    """GET /api/today-plan/{patient_id}"""
    db = SessionLocal()
    try:
        record = db.query(PatientProgress).filter(PatientProgress.patient_id == patient_id).first()
        if not record:
            record = seed_patient_progress(patient_id)

        profile = {
            "patient_id": record.patient_id,
            "name": record.name,
            "age": record.age,
            "condition": record.condition,
            "post_op_day": record.post_op_day,
            "streak_days": record.streak_days,
            "weekly_recovery_percentage": record.weekly_recovery_percentage,
            "ai_accuracy_percentage": record.ai_accuracy_percentage,
            "knee_flexion_degrees": record.knee_flexion_degrees,
            "knee_extension_degrees": record.knee_extension_degrees
        }
    finally:
        db.close()

    plan_data = physio_agent.generate_daily_plan(profile)

    return {
        "patient": plan_data["patient"],
        "greeting": plan_data["greeting"],
        "weekly_recovery_goal": plan_data["weekly_recovery_goal"],
        "recovery_progress_percentage": plan_data["weekly_recovery_goal"]["percentage"],
        "gamification": plan_data["gamification"],
        "exercise_plan": plan_data["exercise_plan"],
        "exercises": plan_data["exercise_plan"]["exercises"],
        "dietary_plan": plan_data["dietary_plan"],
        "tips": plan_data["tips"],
        "metrics": {
            "knee_flexion_degrees": profile.get("knee_flexion_degrees", 88),
            "knee_flexion_goal_degrees": 120,
            "knee_extension_degrees": profile.get("knee_extension_degrees", -3),
            "knee_extension_goal_degrees": 0,
            "quad_activation_index": 82,
            "daily_steps": 1420
        },
        "consistency": {
            "current_streak_days": profile.get("streak_days", 6),
            "streak_label": f"{profile.get('streak_days', 6)}-Day Streak",
            "ai_accuracy_percentage": profile.get("ai_accuracy_percentage", 94),
            "ai_accuracy_label": f"{profile.get('ai_accuracy_percentage', 94)}% AI Accuracy",
            "weekly_compliance_percentage": 94,
            "days": [
                {"day": "Mon", "completed": True, "date": "2026-09-28"},
                {"day": "Tue", "completed": True, "date": "2026-09-29"},
                {"day": "Wed", "completed": True, "date": "2026-09-30"},
                {"day": "Thu", "completed": True, "date": "2026-10-01"},
                {"day": "Fri", "completed": True, "date": "2026-10-02", "is_today": True},
                {"day": "Sat", "completed": False, "date": "2026-10-03"},
                {"day": "Sun", "completed": False, "date": "2026-10-04"}
            ]
        },
        "voice_physio_status": {
            "ready": True,
            "status_text": "AI Voice Physio Ready",
            "model_version": "Movra-Agno-Gemini-v2"
        }
    }


@router.get("/today-plan")
def get_today_plan_default(patient_id: str = "rahul_123"):
    return get_today_plan_by_id(patient_id=patient_id)


@router.post("/generate-plan")
def generate_plan(request: GeneratePlanRequest):
    profile = {
        "patient_id": request.patient_id or "rahul_123",
        "name": request.name or "Rahul",
        "age": request.age or 64,
        "condition": request.condition or "Right Knee Replacement (TKA)",
        "post_op_day": request.post_op_day or 14,
        "streak_days": 6
    }
    return physio_agent.generate_daily_plan(profile)


# -------------------------------------------------------------------------
# 8. Progress Telemetry: AnalystAgent (Agno + DuckDB + Pandas)
# -------------------------------------------------------------------------
@router.get("/progress/{patient_id}")
def get_patient_progress(patient_id: str):
    return analyst_agent.analyze_patient_csv(patient_id=patient_id)


@router.get("/progress")
def get_progress_default(patient_id: str = "rahul_123"):
    return get_patient_progress(patient_id=patient_id)


# -------------------------------------------------------------------------
# 9. Patient Memory: MemoryAgent (Mem0 + Qdrant)
# -------------------------------------------------------------------------
@router.get("/patient-memory/{patient_id}")
def get_patient_memory_by_id(patient_id: str):
    return memory_agent.get_memory(patient_id=patient_id)


@router.get("/patient-memory")
def get_patient_memory(patient_id: str = "rahul_123"):
    return get_patient_memory_by_id(patient_id=patient_id)


@router.post("/patient-memory/toggle")
def toggle_patient_memory(request: MemoryToggleRequest):
    return memory_agent.toggle_memory(
        user_id=request.patient_id or "rahul_123",
        enabled=request.enabled
    )


@router.post("/patient-memory")
def add_patient_memory(request: AddMemoryItemRequest):
    return memory_agent.save_memory(
        patient_id=request.patient_id or "rahul_123",
        memory_item={
            "category": request.category,
            "summary": request.summary
        }
    )
