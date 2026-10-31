# CampusConnect — Video Demonstration Script (5 Minutes)
### Problem Statement: HACK-P410 — Campus Recruitment Portal

---

## [0:00 - 0:45] Introduction & The Problem
- **Visual:** CampusConnect Landing page (`http://localhost:5173`) scrolling through hero, institutional statistics, features, and partner companies.
- **Narrator:**
  > "Hello evaluators. Welcome to CampusConnect, our submission for problem statement HACK-P410. Every academic year, training and placement cells grapple with managing hundreds of student profiles, company recruitment criteria, and interview schedules using disconnected spreadsheets and manual notices. CampusConnect is an integrated full-stack portal designed to automate the complete campus recruitment lifecycle—from initial registration and automatic eligibility filtering to final placement selection."

---

## [0:45 - 1:45] Student Journey & Automatic Eligibility
- **Visual:** Log in as student (`student1@college.edu` / `Admin@123`).
- **Narrator:**
  > "We begin by logging in as a student, Arjun Mehta. Notice the personalized dashboard displaying real-time profile completion status, active eligible jobs, submitted applications, and scheduled interviews.
  > Let's navigate to 'Browse Jobs'. When Arjun views the 'Software Engineer' position by TCS, our backend eligibility engine dynamically evaluates his profile against the recruiter's criteria: minimum CGPA 7.0 (Arjun has 8.5), branch eligibility (CSE is accepted), and graduation year (2025). The system provides a transparent checklist showing all criteria satisfied. With one click, Arjun applies. The application status updates instantly to 'Applied'."

---

## [1:45 - 2:45] Recruiter Workflow & Screening
- **Visual:** Log out and log in as corporate recruiter (`recruiter1@tcs.com` / `Admin@123`).
- **Narrator:**
  > "Now, switching to the recruiter perspective with TCS Talent Acquisition. The recruiter dashboard gives immediate visibility into posted jobs and applicant counts.
  > Under 'My Jobs', the recruiter opens applicants for the 'Software Engineer' posting. Arjun's profile appears with verified CGPA, branch, and resume access. The recruiter shortlists Arjun and schedules a technical interview for December 15th at the campus recruitment center. 
  > Following the interview, the recruiter logs into 'Interviews' and marks the outcome as 'PASSED'."

---

## [2:45 - 3:45] T&P Placement Office Administration & Analytics
- **Visual:** Log in as administrator (`admin@campusconnect.edu` / `Admin@123`).
- **Narrator:**
  > "Next, let's explore the institutional Training & Placement administration desk. Here, administrators maintain executive oversight over the entire campus ecosystem.
  > The dashboard visualizes real-time placement statistics: total registered students, partner companies, open job positions, and branch-wise placement breakdowns powered by dynamic Recharts visualizations.
  > Administrators can verify and approve recruiter accounts, manage partner companies, monitor recruitment drives, and record final placement results. With one click on 'Export CSV', the placement office downloads an institutional student report ready for accreditation audits."

---

## [3:45 - 4:30] Technical Architecture & Security
- **Visual:** Show terminal running Spring Boot backend and React Vite frontend, followed by OpenAPI Swagger UI (`http://localhost:8080/swagger-ui.html`).
- **Narrator:**
  > "Behind the scenes, CampusConnect is built on an enterprise Java 17 and Spring Boot 3 backend with stateless JWT authentication, BCrypt password hashing, and role-based authorization guards on every endpoint.
  > Our database schema comprises 10 normalized MySQL tables with foreign key cascades and composite indexes for high-throughput queries. All 15 JUnit and Mockito unit tests pass with 100% test success, and our interactive OpenAPI documentation provides full API visibility."

---

## [4:30 - 5:00] Conclusion & Wrap-up
- **Visual:** Return to landing page with team credits.
- **Narrator:**
  > "CampusConnect delivers transparency, efficiency, and data integrity to the university placement ecosystem. Thank you for your time, and we look forward to your questions."
