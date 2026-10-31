# CampusConnect — Architecture Deep Dive

## System Overview

CampusConnect follows a **3-tier architecture** with clear separation between presentation, business logic, and data layers.

```
Presentation Layer  →  React SPA (Browser)
Business Logic      →  Spring Boot REST API
Data Layer          →  MySQL 8.0
```

## Security Architecture

```
Request ──► CORS Filter ──► JwtAuthFilter ──► Spring Security
                                │                     │
                          Extract JWT              Role Check
                          Validate Sig             @PreAuthorize
                          Check Expiry             or manual check
                                │                     │
                          Set Auth in           Reject 403 / Allow
                         SecurityContext
```

## Eligibility Engine

```
checkEligibility(studentId, jobId)
        │
        ├─ Load Student (CGPA, branch, graduationYear, skills[])
        ├─ Load Job (minCgpa, eligibleBranches[], eligibleYears[], requiredSkills[])
        │
        ├─ Check 1: student.cgpa >= job.minCgpa
        │     PASS → add "CGPA: 8.5 >= 7.0 ✓" to satisfiedCriteria
        │     FAIL → add "CGPA: 6.0 < 7.0 ✗" to failedCriteria
        │
        ├─ Check 2: student.branch IN job.eligibleBranches
        │
        ├─ Check 3: student.graduationYear IN job.eligibleGraduationYears
        │
        ├─ Check 4: job.requiredSkills ⊆ student.skills (if skills configured)
        │
        └─ Return EligibilityResponse { eligible, satisfiedCriteria, failedCriteria }
```

## Application Lifecycle

```
Student applies ──► APPLIED
                        │
              Recruiter reviews
                        │
        ┌───────────────┼───────────────┐
      SHORTLISTED    ON_HOLD        REJECTED
        │
   Interview Scheduled
        │
   Interview Outcome
        │
   ┌────┴────┐
 PASSED    FAILED
   │
 SELECTED
   │
 Admin creates PlacementResult
   │
 PLACED
```

## JWT Token Structure

```json
{
  "sub": "student@college.edu",
  "role": "STUDENT",
  "userId": 42,
  "iat": 1700000000,
  "exp": 1700086400
}
```

## File Upload Flow

```
Student uploads resume
        │
  POST /api/student/resume (multipart/form-data)
        │
  Validate: PDF/DOC/DOCX only, max 5MB
        │
  Save to: backend/uploads/resumes/{uuid}_{originalFilename}
        │
  Update students.resume_url in DB
        │
  Serve via: GET /api/files/{filename}
```

## CORS Configuration

Allowed origins: `http://localhost:5173`, `http://localhost:3000`
Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Allowed headers: Authorization, Content-Type, Accept
Exposed headers: Authorization
Allow credentials: true
Max age: 3600s
