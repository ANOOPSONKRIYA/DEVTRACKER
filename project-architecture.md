# DevTrackr - Project Architecture

## Table of Contents

- [1) Product Overview](#1-product-overview)
- [2) Goals & Scope](#2-goals--scope)
- [3) High-Level Architecture](#3-high-level-architecture)
- [4) Tech Stack](#4-tech-stack)
- [5) Functional Modules](#5-functional-modules)
- [6) Data Model (MVP)](#6-data-model-mvp)
- [7) API Boundaries](#7-api-boundaries)
- [8) Security & Quality Requirements](#8-security--quality-requirements)
- [9) Non-Functional Requirements](#9-non-functional-requirements)
- [10) Folder Structure (Suggested)](#10-folder-structure-suggested)
- [11) Success Metrics (MVP)](#11-success-metrics-mvp)
- [12) Future Roadmap](#12-future-roadmap)

## 1) Product Overview

**DevTrackr** is a developer productivity web application to track learning consistency, coding output, DSA practice, and project progress in one place.

### Vision
Help developers build discipline with measurable daily progress and meaningful analytics.

### Problem Statement
Most developers use separate tools for notes, coding logs, and problem-solving history, which causes fragmented tracking and low long-term consistency.

### Solution Summary
DevTrackr combines:
- Daily coding log and learning notes
- DSA problem tracker
- Project showcase manager
- Streak system and growth analytics

---

## 2) Goals & Scope

### In Scope (MVP)
- User authentication (Email/Password + Google OAuth)
- Personal dashboard with key metrics
- Daily log CRUD (learned topics, coding hours, links, tags)
- DSA tracker CRUD (problem, platform, difficulty, status)
- Project showcase CRUD (stack, repo, live demo)
- Basic analytics charts (activity, hours, solved problems)

### Out of Scope (Post-MVP)
- Team collaboration
- Social feed / public profiles
- AI recommendations
- Mobile app

---

## 3) High-Level Architecture

### System Style
Layered web architecture with a SPA frontend and REST API backend.

### Components
1. **Client App (React + Tailwind)**
	- UI, routing, form handling, charts, auth state
2. **API Service (Node.js + Express)**
	- Authentication, validation, business logic, analytics aggregation
3. **Data Store (MongoDB)**
	- Users, logs, DSA entries, projects
4. **External Services**
	- Google OAuth provider

### Request Flow
1. User interacts with React UI
2. Frontend sends authenticated request (JWT)
3. Express validates token + payload
4. Service layer executes business logic
5. MongoDB stores/retrieves data
6. API returns JSON response to UI

---

## 4) Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Authentication | JWT + Google OAuth |
| Charts | Recharts (or Chart.js) |
| Deployment | Vercel (frontend), Render (backend) |

---

## 5) Functional Modules

### 5.1 Authentication
- Register / Login with email-password
- OAuth login with Google
- Password hashing with `bcrypt`
- JWT access token for protected APIs

### 5.2 Dashboard
- Current streak
- Total active days
- Total coding hours
- DSA solved count
- Projects count

### 5.3 Daily Logs
- Create, read, update, delete daily entries
- Fields: `date`, `hours`, `description`, `tags[]`, `links[]`
- Support filtering by date/tag

### 5.4 DSA Tracker
- Fields: `problemName`, `platform`, `difficulty`, `status`, `date`
- Difficulty and platform-based filtering
- Solved-count aggregation

### 5.5 Project Showcase
- Fields: `title`, `description`, `techStack[]`, `githubUrl`, `liveUrl`
- CRUD and list presentation

### 5.6 Analytics
- Coding activity by week/month
- Hours trend chart
- DSA difficulty distribution
- Tag/skill frequency

---

## 6) Data Model (MVP)

### User
- `_id`
- `name`
- `email` (unique)
- `passwordHash` (nullable for OAuth users)
- `avatarUrl`
- `authProvider` (`local` | `google`)
- `createdAt`, `updatedAt`

### DailyLog
- `_id`
- `userId` (ref User)
- `date`
- `hours`
- `description`
- `tags[]`
- `links[]`
- `createdAt`, `updatedAt`

### DSAEntry
- `_id`
- `userId` (ref User)
- `problemName`
- `platform`
- `difficulty` (`Easy` | `Medium` | `Hard`)
- `status` (`Solved` | `Attempted` | `Revisit`)
- `date`
- `createdAt`, `updatedAt`

### ProjectEntry
- `_id`
- `userId` (ref User)
- `title`
- `description`
- `techStack[]`
- `githubUrl`
- `liveUrl`
- `createdAt`, `updatedAt`

---

## 7) API Boundaries

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/google/callback`

### Daily Logs
- `GET /api/logs`
- `POST /api/logs`
- `PUT /api/logs/:id`
- `DELETE /api/logs/:id`

### DSA
- `GET /api/dsa`
- `POST /api/dsa`
- `PUT /api/dsa/:id`
- `DELETE /api/dsa/:id`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Analytics
- `GET /api/analytics/summary`
- `GET /api/analytics/activity`
- `GET /api/analytics/dsa-distribution`

---

## 8) Security & Quality Requirements

### Security
- Hash passwords with `bcrypt`
- Validate JWT on protected routes
- Input validation and sanitization
- CORS allowlist + secure environment variables

### Quality
- Clear API error format
- Loading and empty states in UI
- Structured logs and centralized error middleware

---

## 9) Non-Functional Requirements

- **Performance:** dashboard APIs should respond quickly for typical user data
- **Reliability:** avoid data loss with proper schema constraints
- **Scalability:** modular service and route layers for future SaaS features
- **Maintainability:** reusable UI components + clean folder structure

---

## 10) Folder Structure (Suggested)

```text
DevTrackr/
  client/
	 src/
		components/
		pages/
		services/
		hooks/
		context/
  server/
	 src/
		config/
		models/
		routes/
		controllers/
		middleware/
		services/
```

---

## 11) Success Metrics (MVP)

- User can complete full auth flow
- User can perform CRUD on logs, DSA entries, and projects
- Dashboard and analytics render accurate counts and charts
- App is deployed and publicly accessible

---

## 12) Future Roadmap

- Public profile with shareable progress card
- GitHub API integration for commit-based activity
- Reminder notifications
- Team challenges and accountability groups