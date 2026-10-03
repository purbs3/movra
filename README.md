# MOVRA - Movement & Rehabilitation Care

A modern, clinical Full-Stack home physiotherapy web application built with **React (Vite) + Tailwind CSS** on the frontend and **FastAPI + SQLAlchemy** on the backend.

---

## 1. Public Patient Homepage Experience (`src/components/public/PublicHomePage.tsx`)

When an unauthenticated patient opens MOVRA for the first time, they are welcomed by an app-like public homepage rather than a login wall:

1. **Header**:
   - Left: MOVRA logo + "MOVRA" & "Movement & Rehabilitation Care"
   - Right: "Book Visit" CTA
2. **Hero Section**:
   - **Headline**: *"Physiotherapy Care, Delivered to Your Home."*
   - **Subheadline**: *"Personalized physiotherapy and rehabilitation from qualified professionals, at your home."*
   - **Primary Action**: "Book a Home Visit" (smoothly scrolls to the booking form)
   - **Quick Actions**: "Call Now" (`tel:+919820144829`) & "Chat on WhatsApp"
   - **Trust Indicators**:
     - ✓ Qualified Physiotherapy Care
     - ✓ Home Visit Available
     - ✓ Personalized Treatment
     - ✓ Progress Tracking
3. **Care You Can Trust (Trust Section)**:
   - 6 healthcare cards: Qualified Physiotherapists, Personalized Treatment Plans, Home-Based Rehabilitation, Progress Monitoring, Patient Education, Follow-up Support.
   - Core clinical statement: *"Your treatment is guided by a physiotherapist and supported by technology. AI-assisted physiotherapy support."*
4. **Meet Your Physiotherapist**:
   - Professional profile for **Dr. Ananya Iyer, PT** (BPT, MPT • 8+ Years Experience in Ortho & Neuro Rehabilitation, Metro Home Visit Zone).
   - "View Profile" modal & "Book Home Visit" actions.
5. **Physiotherapy Services**:
   - Cards covering **Orthopedic**, **Neurological**, **Pediatric**, **Geriatric**, **Sports**, and **Post-Operative** rehabilitation.
6. **How MOVRA Works**:
   - Simple 4-step onboarding flow: 01 Book a Home Visit ➔ 02 Assessment ➔ 03 Personalized Plan ➔ 04 Track Progress.
7. **Why Choose MOVRA?**:
   - Home-Based Care, Personalized Care, Progress Tracking, AI-Assisted Support, and Easy Communication.
8. **Book a Physiotherapy Home Visit (Interactive Form)**:
   - Name, Mobile Number, Age, Preferred Date, Preferred Time, Location / Area, Condition / Main Concern, Additional Note.
   - **No login required** to fill the form.
9. **Sticky Mobile Bottom CTA**:
   - Mobile-fixed bar with "Book Home Visit", "Call", and "WhatsApp" quick actions.
   - NO traditional website footer.

---

## 2. Frictionless Booking & Authentication Flow

```
Patient opens MOVRA
       ↓
Public MOVRA Homepage (NO login page shown)
       ↓
"Book a Home Visit"
       ↓
Booking Form (Fills Name, Mobile, Date, Time, Location, Condition)
       ↓
"Continue Booking"
       ↓
If not authenticated:
Modal: "Create your MOVRA account"
(Preserves entered booking details, allows Sign Up or Sign In)
       ↓
Return to Booking Review: "Confirm Home Visit"
       ↓
"Confirm Booking" (Calls POST /api/bookings)
       ↓
"Booking Request Sent"
(Shows Patient Name, Service, Date, Time, Location, Reference ID e.g. MOV-BK-7492)
       ↓
Patient Dashboard
(Displays "Upcoming Appointment" card at top + "My Bookings" list)
```

---

## 3. Patient Dashboard Enhancements (`src/components/DashboardView.tsx`)

- **"Upcoming Appointment" Card**:
  - Featured at the top of the patient dashboard.
  - Displays Home Visit Session, Date, Time, and Status badge (`Pending Confirmation` / `Confirmed`).
  - Actions: "View Booking Details" & "Contact MOVRA".
- **"My Bookings" Modal**:
  - Organized tabs: **Upcoming**, **Completed**, and **Cancelled**.
  - Displays Reference ID, service, therapist, date/time, and location.
  - "Book New Visit" button.

---

## 4. Clinician & Admin Booking Management (`PhysioDashboard.tsx` & `AdminDashboard.tsx`)

- Added **"Booking Requests" / "Visits"** tab in both Physiotherapist and Admin portals.
- Clinicians can review incoming home visit requests, inspect location and condition notes.
- Actions:
  - **Confirm Visit**: updates status to `CONFIRMED` in real-time.
  - **Cancel Visit**: marks as `CANCELLED`.
  - **Call Patient** (`tel:...`) & **WhatsApp Patient** (prefilled friendly greeting).

---

## 5. API Endpoints

### Bookings (`backend/routes/booking_routes.py`)
- `POST /api/bookings`: Create a new home visit request.
- `GET /api/bookings/my`: Retrieve patient bookings.
- `GET /api/bookings`: List all bookings for Clinicians & Admin.
- `PATCH /api/bookings/{id}/status`: Update status (`CONFIRMED`, `CANCELLED`, `COMPLETED`).

---

## 6. Pre-Seeded Test Credentials

| Role | Email | Password | Assigned Portal |
|---|---|---|---|
| **Patient** | `patient@movra.ai` | `Patient@12345` | Public Home / Patient Dashboard (Upcoming Visit, AI Physio, Progress, Learn, Profile) |
| **Physiotherapist** | `physio@movra.ai` | `Physio@12345` | Clinician Portal (Caseload, Alerts, Booking Requests, Progress) |
| **Admin** | `admin@movra.ai` | `Admin@12345` | Universal Admin Portal (All-Access: Patient + Physio + Scraper & Consultant) |

---

## Quick Start (Run Locally)

### 1. Python FastAPI Backend (Port 8000)
```bash
cd backend
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed_admin.py           # Auto-creates users and tables
uvicorn main:app --reload --port 8000
```

### 2. React Frontend (Port 3000)
```bash
npm install
npm run dev
```
Open `http://localhost:3000`. You will immediately see the public MOVRA home page.
