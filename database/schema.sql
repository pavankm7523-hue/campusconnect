-- CampusConnect Database Schema
-- MySQL 8.0+
-- Problem Statement: HACK-P410

CREATE DATABASE IF NOT EXISTS campusconnect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE campusconnect;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'RECRUITER', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: companies
-- ============================================================
CREATE TABLE IF NOT EXISTS companies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    industry VARCHAR(100),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_companies_name (name),
    INDEX idx_companies_industry (industry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: students
-- ============================================================
CREATE TABLE IF NOT EXISTS students (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) UNIQUE,
    branch VARCHAR(100),
    cgpa DECIMAL(4,2) CHECK (cgpa >= 0.0 AND cgpa <= 10.0),
    graduation_year INT,
    phone VARCHAR(20),
    skills TEXT,
    resume_url VARCHAR(500),
    profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_students_branch (branch),
    INDEX idx_students_cgpa (cgpa),
    INDEX idx_students_graduation_year (graduation_year),
    INDEX idx_students_roll_number (roll_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: recruiters
-- ============================================================
CREATE TABLE IF NOT EXISTS recruiters (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    designation VARCHAR(100),
    phone VARCHAR(20),
    company_id BIGINT UNSIGNED,
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
    INDEX idx_recruiters_company (company_id),
    INDEX idx_recruiters_approved (approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: jobs
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    company_id BIGINT UNSIGNED NOT NULL,
    posted_by BIGINT UNSIGNED NOT NULL,
    min_cgpa DECIMAL(4,2) NOT NULL DEFAULT 0.0,
    eligible_branches TEXT,
    eligible_graduation_years TEXT,
    required_skills TEXT,
    package_offered VARCHAR(100),
    job_type ENUM('FULL_TIME', 'INTERNSHIP') NOT NULL DEFAULT 'FULL_TIME',
    location VARCHAR(255),
    application_deadline DATE,
    status ENUM('OPEN', 'CLOSED', 'DRAFT') NOT NULL DEFAULT 'DRAFT',
    total_positions INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (posted_by) REFERENCES recruiters(id) ON DELETE CASCADE,
    INDEX idx_jobs_company (company_id),
    INDEX idx_jobs_status (status),
    INDEX idx_jobs_deadline (application_deadline),
    INDEX idx_jobs_job_type (job_type),
    FULLTEXT INDEX ft_jobs_title_desc (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: applications
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT UNSIGNED NOT NULL,
    student_id BIGINT UNSIGNED NOT NULL,
    status ENUM('APPLIED', 'SHORTLISTED', 'REJECTED', 'SELECTED', 'ON_HOLD') NOT NULL DEFAULT 'APPLIED',
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY uq_application (job_id, student_id),
    INDEX idx_applications_student (student_id),
    INDEX idx_applications_job (job_id),
    INDEX idx_applications_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: interviews
-- ============================================================
CREATE TABLE IF NOT EXISTS interviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT UNSIGNED NOT NULL UNIQUE,
    scheduled_at TIMESTAMP NOT NULL,
    venue VARCHAR(500),
    interview_type ENUM('ONLINE', 'OFFLINE') NOT NULL DEFAULT 'ONLINE',
    interviewer_notes TEXT,
    outcome ENUM('PENDING', 'PASSED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_interviews_scheduled_at (scheduled_at),
    INDEX idx_interviews_outcome (outcome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: placement_results
-- ============================================================
CREATE TABLE IF NOT EXISTS placement_results (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT UNSIGNED NOT NULL UNIQUE,
    company_id BIGINT UNSIGNED NOT NULL,
    job_id BIGINT UNSIGNED NOT NULL,
    package_offered VARCHAR(100),
    joining_date DATE,
    status ENUM('PLACED', 'DECLINED', 'PENDING') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_placement_status (status),
    INDEX idx_placement_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_read (is_read),
    INDEX idx_notifications_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: recruitment_drives
-- ============================================================
CREATE TABLE IF NOT EXISTS recruitment_drives (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id BIGINT UNSIGNED NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT,
    status ENUM('UPCOMING', 'ACTIVE', 'COMPLETED') NOT NULL DEFAULT 'UPCOMING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_drives_company (company_id),
    INDEX idx_drives_status (status),
    INDEX idx_drives_start_date (start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
