# CampusConnect — Master Development & QA Checklist (HACK-P410)

## Phase 1 — Project Audit & System Health
- [x] Comprehensive codebase inspection (Frontend, Backend, DB, Docs)
- [x] Identify root causes of student registration bug (Mixed content, missing relative proxy base, lack of toast deduplication)
- [x] Create TASKS.md tracking checklist
- [x] Verify Maven compilation (`mvn clean compile`)
- [x] Verify test suite execution (`mvn test` — 15/15 tests passing, 0 failures)
- [x] Verify packaging (`mvn clean package` — target JAR verified)

## Phase 2 — Modern Brutalist Design Pivot (Design Direction C)
- [x] Establish Modern Brutalist typography (`Space Grotesk` / `Syne` / `JetBrains Mono` / `Plus Jakarta Sans`)
- [x] Define high-contrast brutalist color tokens: Warm off-white (`#F4F1EA`), Deep black (`#0A0A0A`), Electric cobalt (`#0038FF`), Charcoal (`#1F1F1F`), 2px–3px solid black borders, hard drop-shadows (`shadow-[4px_4px_0px_#0A0A0A]`)
- [x] Redesign Homepage with asymmetric split-layout hero:
  - [x] Bold headline: `YOUR NEXT OPPORTUNITY STARTS HERE.`
  - [x] Live product software console preview
  - [x] Distinctive sections: Students (01), Recruiters (02), Placement Cell (03), Metrics (04), Protocol (05)
  - [x] Interactive eligibility test tool
  - [x] Clearly labeled sample statistics
- [x] Redesign Student Dashboard with brutalist aesthetic & practical architecture
- [x] Redesign Recruiter Dashboard with brutalist candidate review pipeline
- [x] Redesign Admin Dashboard with brutalist placement audit metrics

## Phase 3 — Fix Student & Recruiter Production Registration Failure
- [x] Identified root cause: Vercel static routing lacked an API reverse proxy rule, causing `POST /api/auth/register/*` to return `405 Method Not Allowed`
- [x] Configured Cloudflare edge tunnel and Vercel `vercel.json` API routing to proxy `/api/*` directly to live backend
- [x] Updated Spring Boot `SecurityConfig.java` & `CorsConfig.java` to support `allowedOriginPatterns("*")`
- [x] Configured file-backed database (`jdbc:h2:file:./data/campusconnect`) ensuring complete data persistence across backend restarts
- [x] Deployed updated frontend with verified environment variables to Vercel production: `https://campusconnect-portal-alpha.vercel.app`
- [x] Pushed source repository to GitHub: `https://github.com/pavankm7523-hue/campusconnect`
- [x] End-to-end verified on live Vercel URL: student registration, duplicate email check (409), duplicate roll number check (409), student login, dashboard retrieval, recruiter registration, and post-restart persistence

## Phase 4 — Fix Recruiter Registration
- [x] Inspect and verify `registerRecruiter` endpoint
- [x] Ensure company association (existing vs new company creation) works reliably
- [x] Prevent duplicate recruiter emails
- [x] Verify approval state and admin approval flow

## Phase 5 — Authentication, Security & Production Hardening
- [x] Verify BCrypt password hashing (no plaintext storage)
- [x] Verify JWT token generation & expiration (HS512 algorithm)
- [x] Secure protected routes on frontend and backend
- [x] Restrict demo credentials behind explicit development toggle (hidden in production)
- [x] Verify role-based authorization (STUDENT, RECRUITER, ADMIN)

## Phase 6 — Complete Student Module
- [x] Student Profile management (roll number, branch, CGPA, graduation year, skills)
- [x] Resume upload & replacement (PDF storage)
- [x] Job listings & search filters
- [x] Detailed eligibility criteria breakdown (CGPA, branch, grad year, skills)
- [x] Job applications & withdrawal
- [x] Interview schedules view
- [x] Placement result announcement card
- [x] Notification center & unread count badge

## Phase 7 — Complete Recruiter Module
- [x] Recruiter profile & company details
- [x] Job posting with granular eligibility criteria
- [x] Applicant review & status updates (Shortlist / Reject with notes)
- [x] Interview scheduling with venue & timing
- [x] Interview outcome updates (Passed / Failed)

## Phase 8 — Complete Admin Module
- [x] Placement cell dashboard with real database stats
- [x] Student management & CSV export
- [x] Recruiter management & account approval toggle
- [x] Company management (CRUD)
- [x] Recruitment drive management
- [x] Job and application monitoring
- [x] Broadcast notification dispatch

## Phase 9 — Backend Eligibility Engine
- [x] Enforce CGPA threshold check
- [x] Enforce branch whitelist check
- [x] Enforce graduation year check
- [x] Enforce required skills check
- [x] Return criteria breakdown (satisfied vs failed)

## Phase 10 — Database & MySQL Configuration
- [x] Verify relational schema, foreign keys, indexes, and constraints
- [x] Verify H2 in-memory mode for development
- [x] Verify MySQL production configuration (`application-prod.yml` and environment variables)
- [x] Test CRUD persistence across all 10 entities

## Phase 11 — Backend Build, Compilation & Unit Tests
- [x] Run `mvn clean compile` (0 compilation errors)
- [x] Run `mvn test` (all 15 unit tests passing, 0 failures)
- [x] Run `mvn clean package` (executable JAR generation verified)

## Phase 12 — API Testing & Postman Collection
- [x] Verify Swagger / OpenAPI at `/swagger-ui/index.html`
- [x] Verify Postman collection in `tests/CampusConnect.postman_collection.json`
- [x] Verify standard HTTP status codes (200, 201, 400, 401, 403, 404, 409)

## Phase 13 — Frontend & Backend Integration
- [x] Ensure no localhost URL hardcoding
- [x] Verify seamless token refresh / logout on 401
- [x] Test end-to-end workflows from UI

## Phase 14 — Deployment (Vercel & Cloud Backend)
- [x] Deploy updated brutalist frontend to Vercel: `https://campusconnect-portal-alpha.vercel.app`
- [x] Verify SPA routing with `vercel.json`
- [x] Verify Dockerfile and Render blueprint

## Phase 15 & 16 — Hackathon Deliverables & Documentation
- [x] Update README.md with comprehensive sections & Modern Brutalist showcase
- [x] Architecture diagram & ER diagram
- [x] 8–12 Slide PPT presentation outline (`docs/presentation.md`)
- [x] 3–5 Minute demo video script (`docs/demo-script.md`)
- [x] High-resolution application screenshots (`screenshots/desktop_home.png`, `desktop_login.png`, `desktop_register.png`, `mobile_home.png`)

## Phase 17 — Final Quality Assurance
- [x] Automated verification of all checklist items (100% Complete)
