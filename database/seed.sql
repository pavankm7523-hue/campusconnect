-- CampusConnect Seed Data
-- Run after schema.sql
-- BCrypt hash for "Admin@123" (10 rounds)

USE campusconnect;

-- ============================================================
-- SEED: Admin user (BCrypt hash of "Admin@123")
-- ============================================================
INSERT IGNORE INTO users (email, password, role) VALUES
('admin@campusconnect.edu', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8ikvVr50gVe.pXxTZAY8XYpBKVtaK', 'ADMIN'),
('recruiter1@tcs.com',      '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8ikvVr50gVe.pXxTZAY8XYpBKVtaK', 'RECRUITER'),
('recruiter2@infosys.com',  '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8ikvVr50gVe.pXxTZAY8XYpBKVtaK', 'RECRUITER'),
('student1@college.edu',    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8ikvVr50gVe.pXxTZAY8XYpBKVtaK', 'STUDENT'),
('student2@college.edu',    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8ikvVr50gVe.pXxTZAY8XYpBKVtaK', 'STUDENT');

-- All passwords are: Admin@123

-- ============================================================
-- SEED: Companies
-- ============================================================
INSERT IGNORE INTO companies (name, description, industry, website) VALUES
('Tata Consultancy Services', 'TCS is a leading global IT services and consulting company.', 'Information Technology', 'https://www.tcs.com'),
('Infosys', 'Infosys is a global leader in next-generation digital services and consulting.', 'Information Technology', 'https://www.infosys.com'),
('Wipro', 'Wipro Limited is a leading technology services and consulting company.', 'Information Technology', 'https://www.wipro.com'),
('Accenture', 'Accenture is a global professional services company with expertise in digital, cloud and security.', 'Consulting', 'https://www.accenture.com'),
('Amazon', 'Amazon is a global e-commerce and cloud computing company.', 'Technology', 'https://www.amazon.com');

-- ============================================================
-- SEED: Recruiters
-- ============================================================
INSERT IGNORE INTO recruiters (user_id, full_name, designation, phone, company_id, approved) VALUES
((SELECT id FROM users WHERE email='recruiter1@tcs.com'), 'Rajesh Kumar', 'HR Manager', '9876543210', (SELECT id FROM companies WHERE name='Tata Consultancy Services'), TRUE),
((SELECT id FROM users WHERE email='recruiter2@infosys.com'), 'Priya Sharma', 'Talent Acquisition Lead', '9876543211', (SELECT id FROM companies WHERE name='Infosys'), TRUE);

-- ============================================================
-- SEED: Students
-- ============================================================
INSERT IGNORE INTO students (user_id, full_name, roll_number, branch, cgpa, graduation_year, phone, skills, profile_complete) VALUES
((SELECT id FROM users WHERE email='student1@college.edu'), 'Arjun Mehta', 'CS2021001', 'CSE', 8.5, 2025, '9123456789', 'Java,Spring Boot,React,MySQL', TRUE),
((SELECT id FROM users WHERE email='student2@college.edu'), 'Priya Nair', 'CS2021002', 'IT', 7.8, 2025, '9123456790', 'Python,Django,React,PostgreSQL', TRUE);

-- ============================================================
-- SEED: Jobs
-- ============================================================
INSERT IGNORE INTO jobs (title, description, company_id, posted_by, min_cgpa, eligible_branches, eligible_graduation_years, required_skills, package_offered, job_type, location, application_deadline, status, total_positions) VALUES
(
  'Software Engineer',
  'We are looking for talented software engineers to join our growing team. You will work on cutting-edge technologies and solve complex business problems.',
  (SELECT id FROM companies WHERE name='Tata Consultancy Services'),
  (SELECT id FROM recruiters WHERE user_id=(SELECT id FROM users WHERE email='recruiter1@tcs.com')),
  7.0,
  'CSE,IT,ECE',
  '2025,2026',
  'Java,Spring Boot,MySQL',
  '7-9 LPA',
  'FULL_TIME',
  'Chennai, Hyderabad, Bangalore',
  DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY),
  'OPEN',
  50
),
(
  'Systems Engineer',
  'Join Infosys as a Systems Engineer and work with Fortune 500 clients across the globe on digital transformation projects.',
  (SELECT id FROM companies WHERE name='Infosys'),
  (SELECT id FROM recruiters WHERE user_id=(SELECT id FROM users WHERE email='recruiter2@infosys.com')),
  6.5,
  'CSE,IT,ECE,EEE,ME',
  '2025',
  'Java,Python,SQL',
  '6-8 LPA',
  'FULL_TIME',
  'Pune, Bangalore, Mysore',
  DATE_ADD(CURRENT_DATE, INTERVAL 20 DAY),
  'OPEN',
  100
);

-- ============================================================
-- SEED: Sample Application
-- ============================================================
INSERT IGNORE INTO applications (job_id, student_id, status) VALUES
(
  (SELECT id FROM jobs WHERE title='Software Engineer' LIMIT 1),
  (SELECT id FROM students WHERE roll_number='CS2021001'),
  'APPLIED'
);

-- ============================================================
-- SEED: Sample Notifications
-- ============================================================
INSERT IGNORE INTO notifications (user_id, title, message, type) VALUES
((SELECT id FROM users WHERE email='student1@college.edu'), 'Welcome to CampusConnect!', 'Your account has been created. Complete your profile to start applying for jobs.', 'INFO'),
((SELECT id FROM users WHERE email='student1@college.edu'), 'New Job Posted', 'TCS has posted a new Software Engineer position. Check your eligibility!', 'JOB'),
((SELECT id FROM users WHERE email='student2@college.edu'), 'Welcome to CampusConnect!', 'Your account has been created. Complete your profile to start applying for jobs.', 'INFO');
