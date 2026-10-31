import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

// If VITE_API_URL is provided, use it. Otherwise use relative path '' so Vite reverse-proxies /api to port 8080
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Helper to extract clean error message from Spring Boot error response
export function extractErrorMessage(err: any, fallback = 'Operation failed'): string {
  if (!err) return fallback;
  if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
    return 'Backend server is unreachable. Ensure the backend is active on port 8080.';
  }
  if (err.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }
  const data = err.response?.data;
  if (typeof data === 'string') return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (err.message) return err.message;
  return fallback;
}

// Request interceptor - add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusconnect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle global session expiration
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('campusconnect_token');
      localStorage.removeItem('campusconnect_user');
      const path = window.location.pathname;
      if (path !== '/login' && path !== '/register' && path !== '/') {
        toast.error('Session expired. Please sign in again.', { id: 'session-expired' });
        window.location.href = '/login';
      }
    }
    // Do not fire duplicate toasts globally here; return rejected promise to let handlers present exact contextual feedback
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  loginStudent: (data: { email: string; password: string }) => api.post('/api/auth/login', data),
  registerStudent: (data: object) => api.post('/api/auth/register/student', data),
  registerRecruiter: (data: object) => api.post('/api/auth/register/recruiter', data),
  logout: () => api.post('/api/auth/logout'),
};

// Student APIs
export const studentAPI = {
  getDashboard: () => api.get('/api/student/dashboard'),
  getProfile: () => api.get('/api/student/profile'),
  updateProfile: (data: object) => api.put('/api/student/profile', data),
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/student/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getJobs: (params?: object) => api.get('/api/student/jobs', { params }),
  getJobById: (jobId: number) => api.get(`/api/student/jobs/${jobId}`),
  checkEligibility: (jobId: number) => api.get(`/api/student/jobs/${jobId}/eligibility`),
  applyForJob: (jobId: number) => api.post(`/api/student/applications/${jobId}`),
  getApplications: (params?: object) => api.get('/api/student/applications', { params }),
  withdrawApplication: (applicationId: number) => api.delete(`/api/student/applications/${applicationId}`),
  getInterviews: () => api.get('/api/student/interviews'),
  getNotifications: () => api.get('/api/student/notifications'),
  markNotificationRead: (id: number) => api.put(`/api/student/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/api/student/notifications/read-all'),
  getUnreadCount: () => api.get('/api/student/notifications/unread-count'),
  getPlacementResult: () => api.get('/api/student/placement-result'),
};

// Recruiter APIs
export const recruiterAPI = {
  getProfile: () => api.get('/api/recruiter/profile'),
  getJobs: (params?: object) => api.get('/api/recruiter/jobs', { params }),
  createJob: (data: object) => api.post('/api/recruiter/jobs', data),
  updateJob: (id: number, data: object) => api.put(`/api/recruiter/jobs/${id}`, data),
  deleteJob: (id: number) => api.delete(`/api/recruiter/jobs/${id}`),
  getApplicants: (jobId: number, params?: object) => api.get(`/api/recruiter/jobs/${jobId}/applicants`, { params }),
  shortlistApplication: (id: number) => api.put(`/api/recruiter/applications/${id}/shortlist`),
  rejectApplication: (id: number, data: object) => api.put(`/api/recruiter/applications/${id}/reject`, data),
  scheduleInterview: (data: object) => api.post('/api/recruiter/interviews', data),
  updateInterviewOutcome: (id: number, data: object) => api.put(`/api/recruiter/interviews/${id}/outcome`, data),
  getInterviews: () => api.get('/api/recruiter/interviews'),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  getStudents: (params?: object) => api.get('/api/admin/students', { params }),
  getStudentById: (id: number) => api.get(`/api/admin/students/${id}`),
  getRecruiters: (params?: object) => api.get('/api/admin/recruiters', { params }),
  approveRecruiter: (id: number) => api.put(`/api/admin/recruiters/${id}/approve`),
  getCompanies: (params?: object) => api.get('/api/admin/companies', { params }),
  createCompany: (data: object) => api.post('/api/admin/companies', data),
  updateCompany: (id: number, data: object) => api.put(`/api/admin/companies/${id}`, data),
  deleteCompany: (id: number) => api.delete(`/api/admin/companies/${id}`),
  getAllJobs: (params?: object) => api.get('/api/admin/jobs', { params }),
  getAllApplications: (params?: object) => api.get('/api/admin/applications', { params }),
  updateApplicationStatus: (id: number, data: object) => api.put(`/api/admin/applications/${id}/status`, data),
  getPlacementResults: (params?: object) => api.get('/api/admin/placement-results', { params }),
  createPlacementResult: (data: object) => api.post('/api/admin/placement-results', data),
  getDrives: (params?: object) => api.get('/api/admin/drives', { params }),
  createDrive: (data: object) => api.post('/api/admin/drives', data),
  updateDriveStatus: (id: number, data: object) => api.put(`/api/admin/drives/${id}/status`, data),
  exportStudents: () => api.get('/api/admin/export/students'),
  sendNotification: (data: object) => api.post('/api/admin/notifications/send', data),
};

// Public APIs
export const publicAPI = {
  getStats: () => api.get('/api/public/stats'),
  getCompanies: () => api.get('/api/public/companies'),
  getJobs: (params?: object) => api.get('/api/public/jobs', { params }),
};
