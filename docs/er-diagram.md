# CampusConnect ER Diagram

## Entity Relationship Description

```
USERS
  id PK
  email UNIQUE NOT NULL
  password NOT NULL (BCrypt)
  role ENUM(STUDENT, RECRUITER, ADMIN)
  created_at
  updated_at

STUDENTS
  id PK
  user_id FK → USERS.id (UNIQUE, CASCADE DELETE)
  full_name
  roll_number UNIQUE
  branch
  cgpa DECIMAL(4,2)
  graduation_year INT
  phone
  skills TEXT (comma-separated)
  resume_url
  profile_complete BOOLEAN
  created_at, updated_at

COMPANIES
  id PK
  name UNIQUE NOT NULL
  description TEXT
  industry
  website
  logo_url
  created_at, updated_at

RECRUITERS
  id PK
  user_id FK → USERS.id (UNIQUE, CASCADE DELETE)
  full_name
  designation
  phone
  company_id FK → COMPANIES.id (SET NULL on delete)
  approved BOOLEAN
  created_at, updated_at

JOBS
  id PK
  title NOT NULL
  description TEXT
  company_id FK → COMPANIES.id (CASCADE DELETE)
  posted_by FK → RECRUITERS.id (CASCADE DELETE)
  min_cgpa DECIMAL(4,2)
  eligible_branches TEXT (comma-separated)
  eligible_graduation_years TEXT (comma-separated)
  required_skills TEXT (comma-separated)
  package_offered
  job_type ENUM(FULL_TIME, INTERNSHIP)
  location
  application_deadline DATE
  status ENUM(OPEN, CLOSED, DRAFT)
  total_positions INT
  created_at, updated_at

APPLICATIONS
  id PK
  job_id FK → JOBS.id (CASCADE DELETE)
  student_id FK → STUDENTS.id (CASCADE DELETE)
  status ENUM(APPLIED, SHORTLISTED, REJECTED, SELECTED, ON_HOLD)
  applied_at TIMESTAMP
  updated_at TIMESTAMP
  notes TEXT
  UNIQUE(job_id, student_id)

INTERVIEWS
  id PK
  application_id FK → APPLICATIONS.id (UNIQUE, CASCADE DELETE)
  scheduled_at TIMESTAMP
  venue
  interview_type ENUM(ONLINE, OFFLINE)
  interviewer_notes TEXT
  outcome ENUM(PENDING, PASSED, FAILED)
  created_at, updated_at

PLACEMENT_RESULTS
  id PK
  student_id FK → STUDENTS.id (UNIQUE, CASCADE DELETE)
  company_id FK → COMPANIES.id (CASCADE DELETE)
  job_id FK → JOBS.id (CASCADE DELETE)
  package_offered
  joining_date DATE
  status ENUM(PLACED, DECLINED, PENDING)
  created_at

NOTIFICATIONS
  id PK
  user_id FK → USERS.id (CASCADE DELETE)
  title NOT NULL
  message TEXT
  is_read BOOLEAN DEFAULT FALSE
  type VARCHAR(50)
  created_at

RECRUITMENT_DRIVES
  id PK
  name NOT NULL
  company_id FK → COMPANIES.id (CASCADE DELETE)
  start_date DATE
  end_date DATE
  description TEXT
  status ENUM(UPCOMING, ACTIVE, COMPLETED)
  created_at
```

## Cardinality Summary

| Relationship | Cardinality |
|---|---|
| USER → STUDENT | 1:1 |
| USER → RECRUITER | 1:1 |
| COMPANY → RECRUITER | 1:N |
| COMPANY → JOB | 1:N |
| RECRUITER → JOB (posted_by) | 1:N |
| STUDENT → APPLICATION | 1:N |
| JOB → APPLICATION | 1:N |
| APPLICATION → INTERVIEW | 1:1 |
| STUDENT → PLACEMENT_RESULT | 1:1 |
| USER → NOTIFICATION | 1:N |
| COMPANY → RECRUITMENT_DRIVE | 1:N |

## Indexes

| Table | Index | Purpose |
|---|---|---|
| users | idx_users_email | Fast login lookup |
| students | idx_students_branch | Branch-based filtering |
| students | idx_students_cgpa | CGPA eligibility check |
| jobs | idx_jobs_status | Filter open jobs |
| applications | uq_application (job_id, student_id) | Prevent duplicates |
| notifications | idx_notifications_user | Fast notification lookup |
