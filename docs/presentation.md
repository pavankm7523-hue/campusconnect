# CampusConnect — Hackathon Presentation (HACK-P410)
### Centralized Campus Recruitment Management Portal

---

## Slide 1: Title & Identity
- **Project Name:** CampusConnect
- **Problem Statement ID:** HACK-P410
- **Category:** Full-Stack Web Development & Campus Placement Automation
- **Team Size:** 4 Engineering Students
- **Tagline:** Bridging Students, Corporate Recruiters, and Institutional Placement Offices into One Unified Pipeline.

---

## Slide 2: The Campus Placement Challenge
- **Current Reality:**
  - Fragmented coordination over disparate spreadsheets, WhatsApp groups, and notice boards.
  - Manual CGPA and branch eligibility verification leading to human error and student disputes.
  - Zero real-time visibility for students regarding application status and interview rounds.
  - Recruiters overwhelmed with unqualified applicants; placement offices lacking institutional analytics.
- **The Cost:**
  - Administrative bottlenecks during placement season.
  - Ineligible students taking exam slots; eligible students missing deadlines.

---

## Slide 3: The CampusConnect Architecture
- **Three-Tier Enterprise Architecture:**
  - **Client Tier:** React 18 SPA, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts.
  - **Application Tier:** Java 17, Spring Boot 3.2, Spring Security, JWT (HS512), Bean Validation.
  - **Data Tier:** MySQL 8.0, Normalized Schema (10 Entities), Foreign Key Cascades, Index Optimization.
- **Zero Mock Data:** Every counter, filter, eligibility check, and report is backed by real relational transactions.

---

## Slide 4: Dual-Gate Automatic Eligibility Engine
- **Server-Side Verification on Every Application:**
  1. **Academic Cutoff:** Real-time student CGPA $\ge$ Job Minimum CGPA.
  2. **Disciplinary Eligibility:** Student branch validated against recruiter's eligible branch list (CSE, IT, ECE, EEE, etc.).
  3. **Batch Matching:** Graduation year verification (e.g. 2025/2026 batches).
  4. **Skillset Analysis:** Automated comparison of student skill tags against required competencies.
- **Transparent Feedback:** Students receive a criteria breakdown detailing exactly why they are eligible or ineligible.

---

## Slide 5: Role-Specific Portals
- **Student Portal:**
  - Profile completion tracker, resume upload (local/cloud-ready), job discovery, 1-click application, scheduled interview call letters, final placement offers.
- **Recruiter Portal:**
  - Job creation with specific eligibility criteria, candidate screening, 1-click shortlisting/rejection with feedback notes, multi-round interview scheduler.
- **T&P Administration Console:**
  - Master candidate roster, recruiter access approval desk, company management, recruitment drives, dynamic placement charts, and 1-click CSV roster export.

---

## Slide 6: Security & Enterprise Hardening
- **Stateless Authentication:** Cryptographically signed JWT tokens with role claims.
- **Strict Role-Based Access Control (RBAC):** Student endpoints locked to `STUDENT`, management to `RECRUITER`, and institutional controls to `ADMIN`.
- **Injection & Path Traversal Prevention:** Parameterized ORM queries via Spring Data JPA; normalized path sanitization on all file downloads.
- **Environment Isolation:** Zero credentials in code; configuration driven via `.env` and Spring profiles.

---

## Slide 7: Live Demonstration & Metrics
- **Performance:** Sub-10ms response times on relational queries with indexing.
- **Client Bundle:** Production build minified with Vite and gzip compression under 240 kB.
- **Testing Coverage:** Complete Mockito & JUnit 5 test suites covering auth, eligibility, and applications; Postman collection with 20+ automated assertions.

---

## Slide 8: Future Scope & Roadmap
- Integration with college ERP systems via OAuth2/SSO.
- AI-assisted resume keyword highlighting.
- Automated interview calendar integration (Google Calendar / Microsoft 365).
- Webhook notifications via campus SMS/WhatsApp gateways.
