# Movra - AI Physiotherapy Platform (Full-Stack RBAC Architecture)

A clinical Full-Stack home physiotherapy web application built with **React (Vite) + Tailwind CSS** on the frontend and **Python (FastAPI)** on the backend.

Includes a complete **Role-Based Authentication & Access Control (RBAC)** system, alongside **9 specialized clinical & business AI agents**.

---

## Role-Based Access Control (RBAC) Architecture

### User Roles
1. **`patient`**: Home-based recovery patients tracking knee extension, flexion, daily plans, AI physio chat, and exercises.
2. **`physiotherapist`**: Clinical practitioners managing assigned caseloads, reviewing range of motion (ROM) adherence, and monitoring clinical alerts.
3. **`admin`**: System administrators executing web research scraping (ScrapeGraphAI), business consulting (Google ADK & Perplexity), and system governance.

> **Registration Security Rule**: Only **`patient`** and **`physiotherapist`** roles can register via `POST /api/auth/signup`. Public signup for `admin` accounts is strictly forbidden; admin accounts are seeded manually.

---

## Pre-Seeded Test Credentials

On server startup, `backend/seed_admin.py` initializes the SQLite database with the following demo credentials:

| Role | Email | Password | Assigned Dashboard |
|---|---|---|---|
| **Admin** | `admin@movra.ai` | `Admin@12345` | `/admin-dashboard` |
| **Physiotherapist** | `physio@movra.ai` | `Physio@12345` | `/physio-dashboard` |
| **Patient** | `patient@movra.ai` | `Patient@12345` | `/dashboard` |

> *Tip: On the frontend Login screen, one-click demo buttons are provided to instantly populate any of these three test accounts!*

---

## Authentication Endpoints (`backend/routes/auth_routes.py`)

- **`POST /api/auth/signup`**:
  - Request: `{ email, password, full_name, role }` (`role` must be `'patient'` or `'physiotherapist'`).
  - Hashes password using **bcrypt** via `passlib`.
  - Saves user to DB and returns signed **JWT access token** and user object.
- **`POST /api/auth/login`**:
  - Request: `{ email, password }`.
  - Verifies bcrypt hash and returns JWT token (`Bearer`), role, and user profile.
- **`POST /api/auth/forgot-password`**:
  - Request: `{ email }`.
  - Generates secure reset token, logs the test reset link to the server console (`[AUTH: PASSWORD RESET LINK GENERATED]`), and returns the token for local testing.
- **`POST /api/auth/reset-password`**:
  - Request: `{ token, new_password }`.
  - Verifies token expiration and updates the user's password in the database.
- **`GET /api/auth/me`**:
  - Requires Bearer token header.
  - Returns current logged-in user details.

---

## Frontend Architecture (`src/`)

### Authentication & Protected Routing
- **`src/context/AuthContext.tsx`**:
  - Centralized session management storing JWT access token in `localStorage` under `'movra_auth_token'`.
  - Provides `login`, `signup`, `forgotPassword`, `resetPassword`, and `logout` hooks.
  - Verifies active session on initial load via `GET /api/auth/me`.
- **`src/components/auth/ProtectedRoute.tsx`**:
  - Checks if user is authenticated: if not, redirects to `/login`.
  - Enforces role permissions: if logged in with wrong role (e.g. Patient trying to access `/admin-dashboard`), automatically redirects to their authorized dashboard.
- **`src/components/auth/Login.tsx`**: Email/password inputs, validation, quick-fill demo buttons, and links to Signup & Forgot Password.
- **`src/components/auth/Signup.tsx`**: Full name, email, password, and restricted dropdown selecting only `'Patient'` or `'Physiotherapist'`.
- **`src/components/auth/ForgotPassword.tsx`**: Email prompt with console token generator and direct password reset form.

### Dashboards
- **`/dashboard` (Patient)**:
  - Welcome greeting with patient name, 80% Recovery Goal progress bar, 6-Day Streak, and daily knee extension/ankle pump exercises.
  - Tab navigation for AI Physio Chat (Cloud/Private modes), Progress Telemetry (DuckDB + Goniometer), Learn (TeachingAgent), and Profile.
- **`/physio-dashboard` (Physiotherapist)**:
  - Welcome card for clinician, caseload summary, assigned patient table (ROM, weekly adherence, clinical alerts), and search filter.
- **`/admin-dashboard` (Admin)**:
  - Welcome card for superadmin, ScrapeGraphAI research scraper, and Google ADK strategic consultant.

---

## 9 Specialized AI Agents (`backend/agents/`)

1. **RAGAgent** (`rag_agent.py`): Contextual AI clinical knee protocol RAG.
2. **PhysioAgent** (`physio_agent.py`): Agno & Gemini exercise and diet generator.
3. **MemoryAgent** (`memory_agent.py`): Mem0 & Qdrant episodic memory layer.
4. **VoiceAgent** (`voice_agent.py`): OpenAI Whisper + TTS with Qdrant guideline search.
5. **AnalystAgent** (`analyst_agent.py`): Agno, DuckDB, and Pandas on recovery CSV telemetry.
6. **LocalRAGAgent** (`local_rag_agent.py`): On-device Ollama Deepseek-R1:1.5b inference.
7. **TeachingAgent** (`teaching_agent.py`): Patient education guide generator ("Physio Professor").
8. **ScraperAgent** (`scraper_agent.py`): ScrapeGraphAI research web scraper.
9. **ConsultantAgent** (`consultant_agent.py`): Google ADK and Perplexity market strategist.

---

## Quick Start (Run Locally)

### 1. Database Setup & FastAPI Backend (Port 8000)

```bash
cd backend

# Create & activate Python virtual environment
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install all dependencies (FastAPI, passlib, bcrypt, python-jose, SQLAlchemy, etc.)
pip install -r requirements.txt

# Run initial seed script (also runs automatically on FastAPI server startup)
python seed_admin.py

# Launch FastAPI backend
uvicorn main:app --reload --port 8000
```
- API Root: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`

### 2. React Frontend (Port 3000)

```bash
# In the project root directory
npm install
npm run dev
```
- Web Application: `http://localhost:3000`
