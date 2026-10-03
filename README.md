# Movra - AI Physiotherapy Platform (RBAC & Subscriptions)

A modern, clinical Full-Stack home physiotherapy web application built with **React (Vite) + Tailwind CSS** on the frontend and **FastAPI + SQLAlchemy** on the backend.

Includes **Role-Based Authentication**, **Dynamic Role-Based Bottom Navigation**, **Subscription Tiers & Upgrades**, and **9 Specialized Clinical & Business AI Agents**.

---

## 1. Role-Based Bottom Navigation (`src/components/BottomNav.tsx`)

Navigation dynamically renders depending on the authenticated user's role (detected from props or `localStorage`):

| Role | Rendered Tabs & Icons | Restricted / Hidden Tabs |
|---|---|---|
| **`patient`** | **Home** (`Home`), **AI Physio** (`MessageSquare`), **Progress** (`TrendingUp`), **Learn** (`BookOpen`), **Profile** (`User`) | Admin, Caseload, Alerts |
| **`physiotherapist`** | **Caseload** (`Users`), **Alerts** (`AlertTriangle`), **Progress** (`Activity`), **Profile** (`User`) | AI Physio Chat, Learn |
| **`admin`** | **Dashboard** (`LayoutDashboard`), **Scraper** (`Globe`), **Consultant** (`Briefcase`), **Settings** (`Settings`) | Patient Exercises, Caseload |

- **Design**: Mobile-responsive, soft teal/white medical aesthetic with active indicator pills and status badges (e.g. memory pulse on AI Physio).
- **Navigation Safety**: `ProtectedRoute` prevents role switching via URL manipulation (e.g. Patients attempting to access `/admin` or `/physio-dashboard` are redirected to `/dashboard`).

---

## 2. Subscription Plans & Billing Engine

### Database Model (`backend/models.py`)
- **`SubscriptionTier` Enum**: `free`, `pro`, `clinic` (default: `free`).
- **`subscription_expires_at`**: `DateTime` (nullable, stores timestamp for 30-day billing cycles).
- **SQLite Auto-Migration (`migrate_user_table`)**:
  - Automatically executes `ALTER TABLE users ADD COLUMN subscription_tier ...` and `ALTER TABLE users ADD COLUMN subscription_expires_at ...` if running on an existing database file without dropping existing records.

### API Endpoints (`backend/routes/subscription_routes.py`)
- **`GET /api/subscription/plans`**: Returns available membership tiers, pricing, features, and limits:
  1. **Free Recovery** ($0 / forever): Basic exercises, 14-day mobility tracking, standard text support.
  2. **Pro Recovery AI** ($19 / month - *Featured Tier*): Real-time AI Voice physio (Whisper + TTS), Private On-Device Local Deepseek-R1 inference, DuckDB & Pandas 14-day CSV telemetry charts, unlimited Contextual RAG with AAOS citations, Physio Professor curriculum.
  3. **Clinic Concierge** ($79 / month): Everything in Pro + 1-on-1 human Physical Therapist bi-weekly check-ins, CMS Remote Therapeutic Monitoring (CPT 98975 / 98977) billing reports, and direct clinician EHR sync.
- **`GET /api/subscription/status/{user_id}`**: Returns current tier, days remaining, expiration date, and active feature flags.
- **`POST /api/subscription/upgrade`**:
  - Accepts `{ user_id, plan_id, payment_method }`.
  - Mocks payment gateway transaction processing (generates a unique `tx_movra_*` ID).
  - Upgrades user to requested tier and adds **30 days** to `subscription_expires_at`.

---

## 3. Subscription UI (`src/components/SubscriptionView.tsx`)

- **Current Plan Status Card**: Shows whether the patient is currently on the **Free Recovery** tier or active **Pro / Clinic** plan, along with days remaining until renewal.
- **Interactive Pricing Cards**:
  - Distinct teal/emerald highlighted styling for **Pro Recovery AI** with an elevated "Most Popular" crown badge.
  - One-click **"Upgrade to Pro ($19/mo)"** button with payment processing spinner.
- **Payment Confirmation Animation**:
  - Displays instant payment success alert with simulated transaction ID and auto-updates user's active tier in the UI.
- **Accessible from Patient Profile**: Tap **"Recovery Subscription Plans"** on the Profile screen to manage plans or upgrade anytime.

---

## Pre-Seeded Test Credentials

| Role | Email | Password | Assigned Dashboard |
|---|---|---|---|
| **Patient** | `patient@movra.ai` | `Patient@12345` | `/dashboard` (Home, AI Physio, Progress, Learn, Profile, Subscriptions) |
| **Physiotherapist** | `physio@movra.ai` | `Physio@12345` | `/physio-dashboard` (Caseload, Alerts, Progress, Profile) |
| **Admin** | `admin@movra.ai` | `Admin@12345` | `/admin-dashboard` (Dashboard, Scraper, Consultant, Settings) |

---

## Quick Start (Run Locally)

### 1. Start Python FastAPI Backend (Port 8000)

```bash
cd backend

# Create & activate Python virtual environment
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run seed script (also runs automatically on startup)
python seed_admin.py

# Launch FastAPI server
uvicorn main:app --reload --port 8000
```
- API Base: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`

### 2. Start React Frontend (Port 3000)

```bash
# In project root
npm install
npm run dev
```
- Open `http://localhost:3000`
- Test login with any demo account or register a new patient/physiotherapist.
