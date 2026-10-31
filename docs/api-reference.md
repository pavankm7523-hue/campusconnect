# CampusConnect — Complete REST API Reference
### HACK-P410: Campus Recruitment Portal

Base URL (Local): `http://localhost:8080/api`  
Swagger UI: `http://localhost:8080/swagger-ui.html`  
OpenAPI JSON: `http://localhost:8080/api-docs`  

---

## 1. Authentication & Account Access (`/api/auth`)

### 1.1 Register Student
- **Method:** `POST /api/auth/register/student`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "StrongPassword@123",
  "fullName": "Aarav Sharma",
  "rollNumber": "CS2025001",
  "branch": "CSE",
  "graduationYear": 2025,
  "phone": "9876543210"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Student registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "role": "STUDENT",
    "userId": 1,
    "email": "student@college.edu",
    "message": "Student registered successfully"
  }
}
```

### 1.2 Register Recruiter
- **Method:** `POST /api/auth/register/recruiter`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "recruiter@techcorp.com",
  "password": "StrongPassword@123",
  "fullName": "Siddharth Rao",
  "designation": "Talent Acquisition Partner",
  "phone": "9876543211",
  "companyName": "TechCorp Global",
  "companyDescription": "Global technology and cloud infrastructure firm",
  "companyIndustry": "Cloud Computing",
  "companyWebsite": "https://techcorp.example.com"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Recruiter registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "role": "RECRUITER",
    "userId": 2,
    "email": "recruiter@techcorp.com",
    "message": "Recruiter registered successfully. Awaiting admin approval."
  }
}
```

### 1.3 Login (Universal)
- **Method:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "student1@college.edu",
  "password": "Admin@123"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "role": "STUDENT",
    "userId": 4,
    "email": "student1@college.edu",
    "message": "Login successful"
  }
}
```

---

## 2. Student Portal Endpoints (`/api/student`)
*Header required: `Authorization: Bearer <JWT_TOKEN>` (Role: `STUDENT`)*

| Endpoint | Method | Description |
|---|---|---|
| `/api/student/dashboard` | `GET` | Retrieve student KPI summary (eligible jobs, application counters, interviews) |
| `/api/student/profile` | `GET` | View student profile details |
| `/api/student/profile` | `PUT` | Update profile (CGPA, branch, phone, skills list) |
| `/api/student/resume` | `POST` | Multipart resume upload (PDF/DOC, max 5MB) |
| `/api/student/jobs` | `GET` | List active campus job openings with filters & pagination |
| `/api/student/jobs/{jobId}` | `GET` | View job details, package, criteria |
| `/api/student/jobs/{jobId}/eligibility` | `GET` | Evaluate student eligibility against job criteria |
| `/api/student/applications/{jobId}` | `POST` | Submit job application |
| `/api/student/applications` | `GET` | View list of student's applications |
| `/api/student/applications/{id}` | `DELETE`| Withdraw application |
| `/api/student/interviews` | `GET` | View interview rounds and call letters |
| `/api/student/notifications` | `GET` | View inbox notifications |
| `/api/student/notifications/{id}/read`| `PUT`| Mark notification as read |
| `/api/student/notifications/read-all`| `PUT` | Mark all notifications as read |
| `/api/student/notifications/unread-count`| `GET`| Count unread notifications |
| `/api/student/placement-result` | `GET` | View final placement offer and package |

---

## 3. Recruiter Portal Endpoints (`/api/recruiter`)
*Header required: `Authorization: Bearer <JWT_TOKEN>` (Role: `RECRUITER`)*

| Endpoint | Method | Description |
|---|---|---|
| `/api/recruiter/profile` | `GET` | View recruiter profile and affiliated company |
| `/api/recruiter/jobs` | `GET` | List jobs posted by current recruiter |
| `/api/recruiter/jobs` | `POST` | Create a new campus recruitment job |
| `/api/recruiter/jobs/{id}` | `PUT` | Update job description, criteria, or status |
| `/api/recruiter/jobs/{id}` | `DELETE`| Delete job opening |
| `/api/recruiter/jobs/{id}/applicants`| `GET` | View student applicants with resume links |
| `/api/recruiter/applications/{id}/shortlist`| `PUT`| Shortlist student application |
| `/api/recruiter/applications/{id}/reject` | `PUT` | Reject candidate with feedback |
| `/api/recruiter/interviews` | `POST` | Schedule an interview (date, venue, mode) |
| `/api/recruiter/interviews/{id}/outcome` | `PUT` | Submit interview evaluation outcome |
| `/api/recruiter/interviews` | `GET` | List all recruiter interviews |

---

## 4. T&P Admin Portal Endpoints (`/api/admin`)
*Header required: `Authorization: Bearer <JWT_TOKEN>` (Role: `ADMIN`)*

| Endpoint | Method | Description |
|---|---|---|
| `/api/admin/dashboard` | `GET` | Placement KPIs, branch distribution, total placed |
| `/api/admin/students` | `GET` | Student directory with search & filters |
| `/api/admin/students/{id}` | `GET` | Detailed student academic record |
| `/api/admin/recruiters` | `GET` | List all recruiters and approval status |
| `/api/admin/recruiters/{id}/approve` | `PUT` | Approve company recruiter account |
| `/api/admin/companies` | `GET` | Directory of partner companies |
| `/api/admin/companies` | `POST` | Add partner company |
| `/api/admin/companies/{id}` | `PUT` | Update partner company info |
| `/api/admin/companies/{id}` | `DELETE`| Remove partner company |
| `/api/admin/jobs` | `GET` | Master list of all campus postings |
| `/api/admin/applications` | `GET` | Master list of all student applications |
| `/api/admin/applications/{id}/status`| `PUT`| Manual pipeline status update |
| `/api/admin/placement-results` | `GET` | View placement registry |
| `/api/admin/placement-results` | `POST` | Record student placement outcome |
| `/api/admin/drives` | `GET` | List recruitment drives |
| `/api/admin/drives` | `POST` | Schedule recruitment drive |
| `/api/admin/drives/{id}/status` | `PUT` | Update drive lifecycle status |
| `/api/admin/export/students` | `GET` | Download student roster as CSV file |
| `/api/admin/notifications/send` | `POST` | Broadcast campus notifications |

---

## 5. Public Discovery Endpoints (`/api/public`)

| Endpoint | Method | Description |
|---|---|---|
| `/api/public/stats` | `GET` | Aggregate placement stats for landing page |
| `/api/public/companies` | `GET` | Directory of visiting campus employers |
| `/api/public/jobs` | `GET` | Active open positions |

---

## 6. Static File Storage (`/api/files`)

| Endpoint | Method | Description |
|---|---|---|
| `/api/files/{filename}` | `GET` | Download/preview uploaded PDF resume or logo |
