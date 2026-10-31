import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentLayout from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentJobs from './pages/student/StudentJobs';
import JobDetail from './pages/student/JobDetail';
import StudentApplications from './pages/student/StudentApplications';
import StudentInterviews from './pages/student/StudentInterviews';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentPlacement from './pages/student/StudentPlacement';
import RecruiterLayout from './pages/recruiter/RecruiterLayout';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import CreateJob from './pages/recruiter/CreateJob';
import RecruiterApplicants from './pages/recruiter/RecruiterApplicants';
import RecruiterInterviews from './pages/recruiter/RecruiterInterviews';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminRecruiters from './pages/admin/AdminRecruiters';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminJobs from './pages/admin/AdminJobs';
import AdminApplications from './pages/admin/AdminApplications';
import AdminDrives from './pages/admin/AdminDrives';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminNotifications from './pages/admin/AdminNotifications';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { isAuthenticated, user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== allowedRole) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated && user ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated && user ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace /> : <RegisterPage />} />
      
      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute allowedRole="STUDENT"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="jobs" element={<StudentJobs />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="interviews" element={<StudentInterviews />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="placement" element={<StudentPlacement />} />
      </Route>
      
      {/* Recruiter Routes */}
      <Route path="/recruiter" element={<ProtectedRoute allowedRole="RECRUITER"><RecruiterLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<RecruiterDashboard />} />
        <Route path="jobs" element={<RecruiterJobs />} />
        <Route path="jobs/create" element={<CreateJob />} />
        <Route path="jobs/:id/applicants" element={<RecruiterApplicants />} />
        <Route path="interviews" element={<RecruiterInterviews />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="recruiters" element={<AdminRecruiters />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="drives" element={<AdminDrives />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
