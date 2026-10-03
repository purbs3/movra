"""
Teaching Agent for Movra Physiotherapy Platform
Converted from reference Streamlit application (File 2).
Uses Agno and OpenAI/Gemini to generate patient-friendly educational guides,
breaking down injury recovery, biomechanics, and rehabilitation steps without heavy jargon.
"""
import os
import logging
from typing import Optional, Dict
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class TeachingAgent:
    """
    TeachingAgent (Physio Professor) generates easy-to-understand educational lessons
    for patients regarding specific injuries, post-op timelines, and recovery mechanics.
    """

    def __init__(self, openai_api_key: Optional[str] = None):
        self.openai_api_key = openai_api_key or os.getenv("OPENAI_API_KEY", "")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        self.agent = None

        try:
            from agno.agent import Agent

            model = None
            if self.openai_api_key and self.openai_api_key != "your_openai_api_key_here":
                from agno.models.openai import OpenAIChat
                model = OpenAIChat(id="gpt-4o-mini", api_key=self.openai_api_key)
            elif self.gemini_api_key and self.gemini_api_key != "your_gemini_api_key_here":
                from agno.models.google import Gemini
                model = Gemini(id="gemini-2.5-flash", api_key=self.gemini_api_key)

            if model:
                self.agent = Agent(
                    name="Physio Professor",
                    model=model,
                    instructions=[
                        "Explain the medical and physiotherapy topic in simple, encouraging terms for a recovering patient.",
                        "Break down the recovery process into 3-4 clear, chronological steps.",
                        "Highlight 'What to Expect', 'Key Milestones', and 'Things to Avoid'.",
                        "Avoid overwhelming medical jargon; use clear analogies and bullet points."
                    ],
                    markdown=True
                )
                print("[TeachingAgent] Initialized Physio Professor educational agent.")
            else:
                print("[TeachingAgent] Model key pending. Using clinical curriculum engine.")
        except Exception as e:
            print(f"[TeachingAgent] Agno initialization notice: {e}. Fallback curriculum active.")

    def generate_lesson(self, topic: str) -> str:
        """
        Creates a structured educational guide for a patient about the given topic.
        
        Args:
            topic (str): Medical topic (e.g. 'ACL Recovery', 'Total Knee Replacement', 'Meniscus Tear').
            
        Returns:
            str: Markdown educational lesson.
        """
        # 1. Try Agno model generation
        if self.agent:
            try:
                response = self.agent.run(f"Create a short educational guide for a patient about: {topic}")
                if hasattr(response, "content") and response.content:
                    return response.content
            except Exception as e:
                logger.warning(f"[TeachingAgent] Agent generation error ({e}); using curriculum repository.")

        # 2. Evidence-Based Clinical Curriculum Repository
        t = topic.lower()
        if "acl" in t:
            return (
                "# 🦵 ACL Reconstruction: Complete Patient Recovery Guide\n\n"
                "### 1. What Happened to Your Knee?\n"
                "The **Anterior Cruciate Ligament (ACL)** is a tough, diagonal cord in the center of your knee that keeps your shin bone from sliding too far forward. During surgery, your surgeon built a fresh, sturdy graft to restore total stability.\n\n"
                "### 2. The 4 Phases of Recovery\n"
                "- **Phase 1: Weeks 1-2 (Protection & Extension)**\n"
                "  - Goal: Clear joint effusion (swelling), achieve 0° full knee extension, and wake up your quadriceps with quad sets.\n"
                "- **Phase 2: Weeks 3-6 (Mobility & Normal Walking)**\n"
                "  - Goal: Reach 110-120° bend, transition away from crutches, and establish a natural heel-to-toe walking cadence.\n"
                "- **Phase 3: Months 2-4 (Strength & Balance)**\n"
                "  - Goal: Squat and lunging mechanics, stationary cycling, and single-leg balance re-education.\n"
                "- **Phase 4: Months 5-9 (Agility & Return to Sport)**\n"
                "  - Goal: Plyometrics, cutting, and jumping after passing formal functional return-to-sport testing.\n\n"
                "### 3. Golden Rule for Safe Healing\n"
                "**Straightening comes first!** If your knee can't straighten completely flat in the first few weeks, walking normally is much harder. Never sleep with a pillow beneath your bent knee."
            )
        elif "knee" in t or "tka" in t or "replacement" in t:
            return (
                "# 🦿 Total Knee Replacement (TKA): Patient Healing Guide\n\n"
                "### 1. What is an Artificial Knee?\n"
                "Your knee joint was resurfaced with smooth, medical-grade cobalt-chromium alloys and a high-density polyethylene spacer. You now have a smooth, stable hinge free of bone-on-bone arthritis.\n\n"
                "### 2. Key Milestones by Week\n"
                "- **Week 1-2 (Acute Recovery)**: Focus on managing swelling, rhythmic ankle pumps to boost blood circulation, and seated active knee extensions.\n"
                "- **Week 3-4 (Active Loading)**: Goal is 90° of knee bend, transitioning from walker to single cane, and clearing any extension lag.\n"
                "- **Week 6-8 (Functional Independence)**: Daily tasks like stair climbing, driving (when cleared by doctor), and low-impact walking for 20-30 minutes.\n\n"
                "### 3. Clinician Pro Tips\n"
                "- Ice for 15-20 minutes following your daily exercise sessions.\n"
                "- Elevate your leg above your heart level during daytime rests to drain swelling."
            )
        elif "rotator" in t or "shoulder" in t:
            return (
                "# 🦾 Rotator Cuff Healing Guide\n\n"
                "### 1. What is the Rotator Cuff?\n"
                "A team of four deep muscles that hug your arm bone securely into its shallow shoulder socket.\n\n"
                "### 2. Recovery Timeline\n"
                "- **Weeks 1-6**: Sling immobilization and gentle passive pendulums only. Protect the surgical tendon repair!\n"
                "- **Weeks 7-12**: Active-assisted mobility with pulleys and sticks. Restoring overhead reach.\n"
                "- **Month 3+**: Light resistance bands (external rotation, scaption) and scapular stabilization.\n\n"
                "### 3. Precautions\n"
                "Never reach behind your back suddenly or lift heavy items until your physiotherapist explicitly clears you."
            )
        else:
            return (
                f"# 📘 Patient Educational Guide: {topic.title()}\n\n"
                f"### Understanding {topic.title()}\n"
                "Physical rehabilitation is a biological process that relies on progressive mechanical loading. When injured or operated on, muscles, tendons, and ligaments remodel along the lines of stress applied to them.\n\n"
                "### Step-by-Step Rehabilitation Blueprint\n"
                "1. **Acute Phase (Days 1-14)**: Rest, gentle activation, swelling management, and protecting vulnerable tissues.\n"
                "2. **Sub-Acute Remodeling (Weeks 3-6)**: Progressive range of motion, isometric strengthening, and restoring natural gait or reach.\n"
                "3. **Functional Strengthening (Weeks 6-12)**: Multi-joint loading, neuromuscular control, balance, and endurance.\n\n"
                "### Key Rules for Success\n"
                "- Consistency beats intensity: Short, daily sessions yield superior tendon remodeling compared to sporadic heavy workouts.\n"
                "- Respect the 4/10 pain boundary: Discomfort is normal, but sharp pain is a signal to pause and modify."
            )
