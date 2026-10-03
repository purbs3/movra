"""
Movra AI Agents Package
Contains the 9 specialized clinical & business AI agents:
1. RAGAgent: Medical knowledge retrieval (Contextual AI)
2. PhysioAgent: Exercise & diet plan generation (Agno & Gemini)
3. MemoryAgent: Patient memory layer (Mem0 & Qdrant)
4. VoiceAgent: Voice consultation & TTS with Qdrant guideline search (OpenAI & Qdrant)
5. AnalystAgent: Recovery telemetry & CSV analytics (Agno, DuckDB, Pandas)
6. LocalRAGAgent: Offline, privacy-focused query engine (Ollama & Qdrant)
7. TeachingAgent: Patient education curriculum generator (Agno & OpenAI/Gemini)
8. ScraperAgent: Research and clinical documentation scraper (ScrapeGraphAI)
9. ConsultantAgent: Healthcare business and market strategist (Google ADK & Perplexity)
"""
from .rag_agent import RAGAgent
from .physio_agent import PhysioAgent
from .memory_agent import MemoryAgent
from .voice_agent import VoiceAgent
from .analyst_agent import AnalystAgent
from .local_rag_agent import LocalRAGAgent
from .teaching_agent import TeachingAgent
from .scraper_agent import ScraperAgent
from .consultant_agent import ConsultantAgent

__all__ = [
    "RAGAgent",
    "PhysioAgent",
    "MemoryAgent",
    "VoiceAgent",
    "AnalystAgent",
    "LocalRAGAgent",
    "TeachingAgent",
    "ScraperAgent",
    "ConsultantAgent"
]
