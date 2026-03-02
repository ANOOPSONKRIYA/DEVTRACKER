# DevTrackr - 21 Day Execution Plan

## Table of Contents

- [1) Plan Objective](#1-plan-objective)
- [2) Delivery Strategy](#2-delivery-strategy)
- [3) Detailed Day-by-Day Plan](#3-detailed-day-by-day-plan)
- [4) Milestones & Exit Criteria](#4-milestones--exit-criteria)
- [5) Risk Register (Compact)](#5-risk-register-compact)
- [6) Weekly Review Cadence](#6-weekly-review-cadence)
- [7) Final Success Checklist](#7-final-success-checklist)

## 1) Plan Objective

Deliver a production-ready MVP of **DevTrackr** in 21 days with:
- Complete authentication and core CRUD workflows
- Reliable analytics and streak tracking
- Clean UI/UX and stable deployment

---

## 2) Delivery Strategy

The work is split into 4 phases:
1. **Foundation (Day 1-4)**
2. **Core Product (Day 5-12)**
3. **Analytics & Experience (Day 13-17)**
4. **Stabilization & Launch (Day 18-21)**

Each day has:
- **Primary Goal**
- **Deliverables**
- **Definition of Done (DoD)**

---

## 3) Detailed Day-by-Day Plan

### Phase 1 - Foundation (Day 1-4)

### Day 1 - Project Setup & Baseline
**Primary Goal**
- Initialize frontend + backend and establish development workflow.

**Deliverables**
- Git repository initialized
- Frontend scaffolded (`Vite + React + Tailwind`)
- Backend scaffolded (`Express`)
- MongoDB connection configured
- Base folder structure created

**DoD**
- Frontend and backend both run locally
- Health endpoint returns success

### Day 2 - Data Modeling
**Primary Goal**
- Implement data models and verify persistence.

**Deliverables**
- Schemas: `User`, `DailyLog`, `DSAEntry`, `ProjectEntry`
- Model validation rules added
- Seed/test route for insert-read check

**DoD**
- Data can be created and fetched from MongoDB successfully

### Day 3 - Authentication Backend
**Primary Goal**
- Build secure auth APIs.

**Deliverables**
- Register API
- Login API
- Password hashing (`bcrypt`)
- JWT issuance and verification middleware
- Protected route example

**DoD**
- Valid login returns token; protected endpoint rejects invalid token

### Day 4 - Authentication Frontend
**Primary Goal**
- Complete full auth flow on the UI.

**Deliverables**
- Login and Register pages
- Form validation
- Token storage and auth state handling
- Protected route guards

**DoD**
- User can register, login, and access protected pages

---

### Phase 2 - Core Product (Day 5-12)

### Day 5 - Dashboard Shell
**Deliverables**
- Sidebar, topbar, responsive dashboard layout
- Placeholder metric cards

**DoD**
- Dashboard layout is reusable and responsive

### Day 6 - Daily Logs Backend
**Deliverables**
- Daily log CRUD APIs
- Required fields: `date`, `hours`, `description`, `tags`, `links`

**DoD**
- CRUD endpoints pass manual API tests

### Day 7 - Daily Logs Frontend
**Deliverables**
- Add/edit/delete log forms
- Logs list with API integration

**DoD**
- End-to-end log CRUD works from UI

### Day 8 - Streak Engine
**Deliverables**
- Streak calculation logic
- Current streak API + dashboard card integration

**DoD**
- Streak updates correctly with daily entries

### Day 9 - DSA Tracker Backend
**Deliverables**
- DSA CRUD APIs for `problemName`, `platform`, `difficulty`, `status`

**DoD**
- DSA endpoints stable and validated

### Day 10 - DSA Tracker Frontend
**Deliverables**
- DSA table/list UI
- Filter by difficulty/platform
- Solved count card

**DoD**
- DSA workflow feels complete and usable

### Day 11 - Project Showcase Backend
**Deliverables**
- Project CRUD APIs
- Fields: `title`, `techStack`, `githubUrl`, `liveUrl`, `description`

**DoD**
- Projects can be persisted and queried per user

### Day 12 - Project Showcase Frontend
**Deliverables**
- Project grid/cards
- Add/edit/delete project flow

**DoD**
- Core MVP feature set fully operational

---

### Phase 3 - Analytics & Experience (Day 13-17)

### Day 13 - Metrics API Layer
**Deliverables**
- Summary metrics endpoints:
	- total logs
	- total hours
	- total DSA solved
	- project count

**DoD**
- Metrics return accurate values for user data

### Day 14 - Visual Analytics
**Deliverables**
- Charts with `Recharts` (or `Chart.js`)
- Weekly hours trend
- Activity chart
- DSA difficulty distribution

**DoD**
- Charts render correctly with real API data

### Day 15 - Search & Filtering
**Deliverables**
- Log search by tags/keywords
- DSA filters by platform/difficulty
- Sorting by date

**DoD**
- Users can quickly locate historical records

### Day 16 - UI Polish
**Deliverables**
- Improved spacing and consistency
- Loading states and empty states
- Toast notifications
- Optional dark mode

**DoD**
- Product feels clean and coherent across pages

### Day 17 - Profile Summary Page
**Deliverables**
- User info panel
- Join date and progress summary
- Skill/tag frequency snapshot

**DoD**
- Profile reflects live user progress data

---

### Phase 4 - Stabilization & Launch (Day 18-21)

### Day 18 - Refactor & Code Quality
**Deliverables**
- Reusable UI components
- API service abstraction in frontend
- Remove dead code and debug logs

**DoD**
- Cleaner architecture with no behavior regressions

### Day 19 - Error Handling Hardening
**Deliverables**
- Backend global error middleware
- Standard error response format
- Frontend error boundaries/messages

**DoD**
- Failures are recoverable and user-friendly

### Day 20 - Deployment
**Deliverables**
- Backend deploy (Render/Railway)
- Frontend deploy (Vercel)
- Production environment variables and CORS config

**DoD**
- Public URL is live and core flows function in production

### Day 21 - Documentation & Demo Assets
**Deliverables**
- Project README with setup instructions
- Architecture and features summary
- Screenshots + short demo video

**DoD**
- Portfolio-ready project package completed

---

## 4) Milestones & Exit Criteria

| Milestone | Day | Exit Criteria |
|---|---:|---|
| M1 Foundation Complete | 4 | Full auth flow working end-to-end |
| M2 MVP Complete | 12 | Logs, DSA, Projects CRUD complete |
| M3 Insights Complete | 17 | Metrics + charts + search available |
| M4 Launch Complete | 21 | Deployed app + docs + demo assets |

---

## 5) Risk Register (Compact)

| Risk | Impact | Mitigation |
|---|---|---|
| Scope creep | Delays launch | Freeze MVP scope after Day 1 |
| Auth integration issues | Blocks protected flows | Build auth early (Day 3-4) |
| Data model churn | Rework APIs/UI | Finalize schemas on Day 2 |
| Deployment failures | Launch delay | Dry-run deploy before Day 20 |

---

## 6) Weekly Review Cadence

- **End of Week 1 (Day 7):** Auth + daily logs complete
- **End of Week 2 (Day 14):** Full MVP + analytics visuals
- **End of Week 3 (Day 21):** Production launch + documentation

---

## 7) Final Success Checklist

- [ ] Authentication is secure and stable
- [ ] All CRUD modules are fully functional
- [ ] Dashboard metrics are accurate
- [ ] Analytics charts render real data
- [ ] App is deployed with working production config
- [ ] README, screenshots, and demo are completed