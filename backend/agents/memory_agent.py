"""
Memory Agent for Movra Physiotherapy Platform
Converted from reference Streamlit application (llm_app_memory.py).
Integrates Mem0 with Qdrant vector store to retain personalized patient context.
"""
import os
import time
import logging
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class MemoryAgent:
    """
    MemoryAgent manages persistent patient episodic memory using Mem0 and Qdrant.
    Configured with:
      host = 'localhost'
      port = 6333
      collection_name = 'movra_patient_memory'
    """

    def __init__(
        self,
        host: str = "localhost",
        port: int = 6333,
        collection_name: str = "movra_patient_memory"
    ):
        self.host = os.getenv("QDRANT_HOST", host)
        self.port = int(os.getenv("QDRANT_PORT", port))
        self.collection_name = os.getenv("QDRANT_COLLECTION", collection_name)
        self.memory = None
        self.memory_enabled: Dict[str, bool] = {}

        # Fallback in-memory store if Qdrant/Mem0 is not running locally
        self._fallback_store: Dict[str, List[Dict[str, Any]]] = {
            "rahul_123": [
                {
                    "id": "mem-1",
                    "text": "Sensitive to sudden flexion beyond 90°; baseline pain 3/10 during active loading.",
                    "category": "Pain Threshold",
                    "created_at": "2026-09-28"
                },
                {
                    "id": "mem-2",
                    "text": "Transitioned from 2-wheeled walker to single-point cane on Post-Op Day 18.",
                    "category": "Mobility Milestone",
                    "created_at": "2026-09-26"
                },
                {
                    "id": "mem-3",
                    "text": "Prefers 15-minute gel cold pack immediately after morning knee extension set.",
                    "category": "Cryotherapy Preference",
                    "created_at": "2026-09-22"
                },
                {
                    "id": "mem-4",
                    "text": "Mild hypertension controlled by amlodipine; no cardiovascular contraindications.",
                    "category": "Comorbidities",
                    "created_at": "2026-09-10"
                }
            ]
        }

        # Initialize Mem0 with Qdrant vector store config
        try:
            from mem0 import Memory
            config = {
                "vector_store": {
                    "provider": "qdrant",
                    "config": {
                        "collection_name": self.collection_name,
                        "host": self.host,
                        "port": self.port,
                    }
                }
            }
            self.memory = Memory.from_config(config)
            print(f"[MemoryAgent] Connected Mem0 to Qdrant at {self.host}:{self.port} [{self.collection_name}].")
        except Exception as e:
            print(f"[MemoryAgent] Mem0/Qdrant not reachable ({e}). Using resilient clinical memory store.")

    def search_memories(self, query: str, user_id: str = "rahul_123") -> List[Dict[str, Any]]:
        """
        Search relevant memories for a patient query.
        """
        if not self.is_memory_enabled(user_id):
            return []

        # 1. Try Mem0 Qdrant search
        if self.memory:
            try:
                results = self.memory.search(query=query, user_id=user_id)
                if results:
                    formatted = []
                    for item in results:
                        text = item.get("text") or item.get("memory") or str(item)
                        formatted.append({"text": text, "score": item.get("score", 1.0)})
                    return formatted
            except Exception as e:
                logger.warning(f"[MemoryAgent] Mem0 search failed ({e}); checking local store.")

        # 2. Resilient fallback retrieval
        user_memories = self._fallback_store.get(user_id, [])
        query_words = set(query.lower().split())
        matched = []

        for m in user_memories:
            text = m["text"]
            # Simple keyword overlap ranking
            if any(w in text.lower() for w in query_words) or len(user_memories) <= 3:
                matched.append(m)

        return matched if matched else user_memories[:2]

    def add_memory(self, text: str, user_id: str = "rahul_123") -> bool:
        """
        Save interaction / clinical observation to patient memory.
        """
        if not self.is_memory_enabled(user_id) or not text.strip():
            return False

        # 1. Try Mem0
        if self.memory:
            try:
                self.memory.add(text, user_id=user_id)
            except Exception as e:
                logger.warning(f"[MemoryAgent] Mem0 add failed: {e}")

        # 2. Store in local fallback repository
        if user_id not in self._fallback_store:
            self._fallback_store[user_id] = []

        new_entry = {
            "id": f"mem-{int(time.time())}",
            "text": text.strip(),
            "category": "Session Interaction",
            "created_at": time.strftime("%Y-%m-%d")
        }
        self._fallback_store[user_id].insert(0, new_entry)
        return True

    def get_all_memories(self, user_id: str = "rahul_123") -> List[Dict[str, Any]]:
        """
        Retrieve all stored memories for a user.
        """
        if self.memory:
            try:
                all_mem = self.memory.get_all(user_id=user_id)
                if all_mem and "results" in all_mem:
                    return all_mem["results"]
            except Exception as e:
                logger.warning(f"[MemoryAgent] Mem0 get_all failed: {e}")

        return self._fallback_store.get(user_id, [])

    def get_memory(self, patient_id: str = "rahul_123") -> Dict[str, Any]:
        """
        Formatted for frontend profile and memory viewers.
        """
        memories = self.get_all_memories(user_id=patient_id)
        retained = []
        for idx, m in enumerate(memories):
            text = m.get("text") or m.get("memory") or str(m)
            retained.append({
                "id": m.get("id", f"mem-{idx}"),
                "category": m.get("category", "Clinical Memory"),
                "summary": text,
                "date_logged": m.get("created_at", time.strftime("%Y-%m-%d")),
                "active": True
            })

        return {
            "patient_id": patient_id,
            "memory_enabled": self.is_memory_enabled(patient_id),
            "retained_context": retained
        }

    def save_memory(self, patient_id: str, memory_item: Dict[str, Any]) -> Dict[str, Any]:
        summary = memory_item.get("summary", "")
        self.add_memory(summary, user_id=patient_id)
        return {
            "status": "saved",
            "patient_id": patient_id,
            "summary": summary
        }

    def toggle_memory(self, user_id: str = "rahul_123", enabled: bool = True) -> Dict[str, Any]:
        self.memory_enabled[user_id] = enabled
        return {"patient_id": user_id, "memory_enabled": enabled, "status": "updated"}

    def is_memory_enabled(self, user_id: str = "rahul_123") -> bool:
        return self.memory_enabled.get(user_id, True)
