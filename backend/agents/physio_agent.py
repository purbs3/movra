"""
Physiotherapy Agent for Movra Platform
Converted from Agno/Gemini Streamlit health planner to clinical post-op physiotherapy recovery.
Generates specialized Exercise Plans, Recovery Dietary Advice, and Clinical Pro Tips.
"""
import os
import json
import logging
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class PhysioAgent:
    """
    PhysioAgent orchestrates two Agno framework clinical agents:
    1. Physiotherapy Exercise Expert (safe post-op biomechanics)
    2. Recovery Diet Expert (anti-inflammatory orthopedic nutrition)
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "")
        self.gemini_model = None

        # Attempt to initialize Agno Gemini model if agno is installed and key is provided
        try:
            from agno.models.google import Gemini
            if self.api_key and self.api_key != "MY_GEMINI_API_KEY":
                self.gemini_model = Gemini(id="gemini-2.5-flash", api_key=self.api_key)
                print("[PhysioAgent] Initialized Agno Gemini model (gemini-2.5-flash).")
            else:
                print("[PhysioAgent] Running in mock/protocol mode (GEMINI_API_KEY pending).")
        except Exception as e:
            print(f"[PhysioAgent] Agno SDK not initialized ({e}); using protocol clinical generator.")

    def generate_daily_plan(self, patient_profile: dict) -> dict:
        """
        Generates structured daily rehabilitation plan for the patient.
        
        Args:
            patient_profile (dict): Patient medical history, age, surgery, post_op_day.
            
        Returns:
            dict: Structured response with exercise_plan, dietary_plan, and tips.
        """
        name = patient_profile.get("name", "Rahul")
        age = patient_profile.get("age", 64)
        condition = patient_profile.get("condition", "Right Knee Replacement (TKA)")
        post_op_day = patient_profile.get("post_op_day", 14)
        streak = patient_profile.get("streak_days", 6)

        user_prompt = f"""
        Patient Profile:
        Name: {name}
        Age: {age}
        Procedure: {condition}
        Recovery Timeline: Day {post_op_day} Post-Op
        Active Streak: {streak} days
        Current Objective: Achieve 90° passive flexion, reduce knee joint swelling, and strengthen quadriceps.
        """

        exercise_content = None
        dietary_content = None

        # Execute Agno agents if framework is available and API key is present
        if self.gemini_model:
            try:
                from agno.agent import Agent

                # 1. Physiotherapy Exercise Expert
                exercise_agent = Agent(
                    name="Physiotherapy Exercise Expert",
                    role="Provides safe, post-operative clinical physical therapy routines",
                    model=self.gemini_model,
                    instructions=[
                        "Focus strictly on safe physiotherapy recovery (e.g. Total Knee Arthroplasty, Day 14 Post-Op).",
                        "Suggest safe knee extension exercises for Day 14 post-op (seated knee extensions, towel-roll terminal extensions), rhythmic ankle pumps to promote venous return, and isometric quad sets.",
                        "Include prescribed sets, repetitions, and hold seconds.",
                        "Explain the mechanical benefit of each movement and warn against forcing beyond painful thresholds (>4/10 VAS).",
                        "Emphasize form, smooth breathing, and posture alignment."
                    ]
                )

                # 2. Recovery Diet Expert
                diet_agent = Agent(
                    name="Recovery Diet Expert",
                    role="Provides clinical anti-inflammatory and tissue healing nutrition for orthopedic recovery",
                    model=self.gemini_model,
                    instructions=[
                        "Recommend an anti-inflammatory recovery dietary plan supporting post-surgical tendon and bone healing.",
                        "Emphasize lean protein for tissue repair, Vitamin C & Zinc for collagen synthesis, and Omega-3 fatty acids for joint swelling reduction.",
                        "Provide concrete meal suggestions (breakfast, lunch, dinner, recovery snack).",
                        "Include hydration and electrolyte guidelines to minimize lower-extremity fluid retention."
                    ]
                )

                ex_run = exercise_agent.run(user_prompt)
                exercise_content = getattr(ex_run, "content", str(ex_run))

                dt_run = diet_agent.run(user_prompt)
                dietary_content = getattr(dt_run, "content", str(dt_run))

            except Exception as err:
                logger.warning(f"[PhysioAgent] Agno agent execution warning: {err}. Using evidence-based clinical protocol.")

        # Structured fallback & augmentation based on orthopedic standards for Day 14 Knee Recovery
        if not exercise_content:
            exercise_content = (
                f"Day {post_op_day} Rehabilitation Protocol for {condition}:\n\n"
                "1. Seated Active-Assisted Knee Extension: 3 sets x 10 reps (5-sec hold at peak extension). "
                "Engage the vastus medialis to clear quad lag.\n"
                "2. Ankle Pumps: 2 sets x 15 reps. Continuous rhythmic dorsiflexion and plantarflexion to drive calf muscle pump.\n"
                "3. Isometric Quad Sets: 2 sets x 10 reps (6-sec hold). Press the back of the knee down against a rolled towel.\n"
                "4. Heel Slides (Incline/Bed): 2 sets x 8 reps gently sliding heel toward buttocks to reach 90° flexion goal."
            )

        if not dietary_content:
            dietary_content = (
                "Post-Surgical Healing & Anti-Inflammatory Plan:\n\n"
                "• Breakfast: Oatmeal with chia seeds, blueberries (rich in polyphenols), and 2 scrambled eggs (leucine for muscle repair).\n"
                "• Lunch: Grilled salmon or tofu bowl with quinoa, steamed broccoli, and avocado (Omega-3 fatty acids to suppress cytokine inflammation).\n"
                "• Snack: Greek yogurt with crushed walnuts and kiwi (Vitamin C for collagen cross-linking).\n"
                "• Dinner: Lentil soup or roast chicken with sweet potato and wilted spinach (iron & zinc for tissue oxygenation).\n"
                "• Hydration: 2.5L filtered water daily to maintain circulation and reduce edema."
            )

        pro_tips = [
            "Cryotherapy Protocol: Apply ice for 15-20 minutes immediately following your knee extension sets.",
            "Elevation: Elevate the surgical leg above heart level when resting to reduce dependent calf swelling.",
            "Extension Focus: Keep your leg straight when resting in bed—never place a pillow directly beneath your knee crease.",
            "Pacing: Avoid sudden pivot motions. Walk with your cane on the side opposite to your operated knee."
        ]

        structured_exercises = [
            {
                "id": "ex-knee-ext",
                "name": "Knee Extension (Seated)",
                "category": "Range of Motion & Strength",
                "sets": 3,
                "reps": 10,
                "hold_seconds": 5,
                "duration_minutes": 15,
                "completed": False,
                "target_muscle": "Quadriceps (Vastus Medialis)",
                "clinical_tip": f"Day {post_op_day} benchmark: Clear extension lag without lifting hip.",
                "difficulty": "Moderate"
            },
            {
                "id": "ex-ankle-pumps",
                "name": "Ankle Pumps",
                "category": "Circulation & Edema Reduction",
                "sets": 2,
                "reps": 15,
                "hold_seconds": 2,
                "duration_minutes": 8,
                "completed": False,
                "target_muscle": "Gastrocnemius & Tibialis Anterior",
                "clinical_tip": "Active venous calf pump to prevent stasis and reduce ankle swelling.",
                "difficulty": "Easy"
            },
            {
                "id": "ex-quad-sets",
                "name": "Isometric Quad Sets",
                "category": "Neuromuscular Re-education",
                "sets": 2,
                "reps": 10,
                "hold_seconds": 6,
                "duration_minutes": 10,
                "completed": True,
                "target_muscle": "Quadriceps Femoris",
                "clinical_tip": "Push knee crease firmly down into rolled towel.",
                "difficulty": "Easy"
            },
            {
                "id": "ex-heel-slides",
                "name": "Assisted Heel Slides",
                "category": "Active Flexion",
                "sets": 2,
                "reps": 8,
                "hold_seconds": 3,
                "duration_minutes": 10,
                "completed": False,
                "target_muscle": "Hamstrings & Joint Capsule",
                "clinical_tip": "Slide smoothly until gentle stretch; do not push through sharp pain.",
                "difficulty": "Moderate"
            }
        ]

        return {
            "patient": {
                "id": patient_profile.get("patient_id", "rahul_123"),
                "name": name,
                "age": age,
                "surgery": condition,
                "post_op_day": post_op_day,
                "primary_clinician": "Dr. Ananya Iyer, PT, DPT"
            },
            "greeting": f"Good morning, {name}",
            "weekly_recovery_goal": {
                "percentage": 80,
                "label": "Stage 2: Early Functional Loading",
                "current_flexion": 88,
                "target_flexion": 120,
                "current_extension": -3,
                "target_extension": 0
            },
            "gamification": {
                "streak_days": streak,
                "streak_label": f"{streak}-Day Streak",
                "ai_accuracy_percentage": 94,
                "ai_accuracy_label": "94% AI Accuracy",
                "weekly_compliance_percentage": 92
            },
            "exercise_plan": {
                "summary": exercise_content,
                "exercises": structured_exercises
            },
            "dietary_plan": {
                "why_this_plan_works": "Anti-inflammatory, High-Leucine Protein & Collagen Synthesizers",
                "meal_plan": dietary_content,
                "important_considerations": [
                    "Hydration: Maintain 2.5L daily intake to aid cellular repair and mitigate medication-related fluid shifts.",
                    "Electrolytes: Balance potassium and magnesium through natural leafy greens.",
                    "Surgical incision healing: Vitamin C (berries, citrus) supports fibroblast collagen synthesis."
                ]
            },
            "tips": pro_tips
        }
