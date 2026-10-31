export interface User {
  id: number;
  email: string;
  role: 'STUDENT' | 'RECRUITER' | 'ADMIN';
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface StudentProfile {
  id: number;
  userId: number;
  email: string;
  fullName: string;
  rollNumber: string;
  branch: string;
  cgpa: number;
  graduationYear: number;
  phone: string;
  skills: string[];
  resumeUrl: string | null;
  profileComplete: boolean;
}

export interface RecruiterProfile {
  id: number;
  userId: number;
  email: string;
  fullName: string;
  designation: string;
  phone: string;
  companyId: number;
  companyName: string;
  approved: boolean;
}

export interface Company {
  id: number;
  name: string;
  description: string;
  industry: string;
  website: string;
  logoUrl: string | null;
  recruiterCount: number;
  jobCount: number;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  companyId: number;
  companyName: string;
  minCgpa: number;
  eligibleBranches: string[];
  eligibleGraduationYears: number[];
  requiredSkills: string[];
  packageOffered: string;
  jobType: string;
  location: string;
  applicationDeadline: string;
  status: string;
  totalPositions: number;
  applied: boolean;
  eligible: boolean;
  createdAt: string;
}

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  cgpa: number;
  branch: string;
  resumeUrl: string | null;
  status: string;
  appliedAt: string;
  notes: string | null;
}

export interface Interview {
  id: number;
  applicationId: number;
  studentName: string;
  jobTitle: string;
  companyName: string;
  scheduledAt: string;
  venue: string;
  interviewType: string;
  outcome: string;
  interviewerNotes: string | null;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  type: string;
  createdAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalRecruiters: number;
  totalCompanies: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  studentsPlaced: number;
  studentsNotPlaced: number;
  placementPercentage: number;
  branchWiseStats: Record<string, number>;
}

export interface StudentDashboard {
  profileComplete: boolean;
  eligibleJobCount: number;
  totalApplications: number;
  shortlistedCount: number;
  upcomingInterviews: number;
  recentNotifications: Notification[];
}

export interface EligibilityResult {
  jobId: number;
  eligible: boolean;
  satisfiedCriteria: string[];
  failedCriteria: string[];
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PlacementResult {
  id: number;
  studentName: string;
  rollNumber: string;
  companyName: string;
  jobTitle: string;
  packageOffered: string;
  joiningDate: string;
  status: string;
}

export interface RecruitmentDrive {
  id: number;
  name: string;
  companyName: string;
  startDate: string;
  endDate: string;
  description: string;
  status: string;
}
