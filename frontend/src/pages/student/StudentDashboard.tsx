import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle,
  FileText,
  Calendar,
  Award
} from 'lucide-react';
import { studentAPI } from '../../services/api';
import { StudentDashboard as StudentDashboardType, StudentProfile } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<StudentDashboardType | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, profRes] = await Promise.allSettled([
        studentAPI.getDashboard(),
        studentAPI.getProfile(),
      ]);

      if (dashRes.status === 'fulfilled') {
        const data = dashRes.value.data?.data || dashRes.value.data;
        setDashboard(data);
      }

      if (profRes.status === 'fulfilled') {
        const profData = profRes.value.data?.data || profRes.value.data;
        setProfile(profData);
      }
    } catch {
      // Handled by axios interceptor
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" label="INITIALIZING CANDIDATE RECORD..." />;
  }

  const isProfileComplete = profile ? profile.profileComplete : dashboard?.profileComplete ?? false;
  const studentName = profile?.fullName || 'Candidate';

  return (
    <div className="space-y-8">
      {/* Top Brutalist Console Banner */}
      <div className="bg-white border-2 border-black p-6 lg:p-8 shadow-brutal flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-black font-black mb-2">
            <span className="w-2.5 h-2.5 bg-cobalt border border-black inline-block"></span>
            <span>CANDIDATE DOSSIER // PLACEMENT CYCLE 2026</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-black uppercase tracking-tight">
            WELCOME, {studentName}.
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-xs font-bold">
            <span className="bg-canvas border border-black px-2.5 py-1">
              ROLL: {profile?.rollNumber || 'PENDING'}
            </span>
            <span className="bg-canvas border border-black px-2.5 py-1">
              BRANCH: {profile?.branch || 'GENERAL'}
            </span>
            <span className="bg-yellow-300 border border-black px-2.5 py-1">
              CGPA: {profile?.cgpa ? profile.cgpa.toFixed(2) : '0.00'} / 10.0
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/student/jobs"
            className="btn-primary text-xs py-3 px-5 inline-flex items-center"
          >
            <Briefcase className="h-4 w-4 mr-2" />
            <span>BROWSE ACTIVE DRIVES</span>
          </Link>
        </div>
      </div>

      {/* Profile Incomplete Warning Banner */}
      {!isProfileComplete ? (
        <div className="bg-yellow-300 border-2 border-black p-5 shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 bg-black text-yellow-300 border border-black flex-shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-heading font-black text-sm uppercase tracking-wide text-black">
                [ACTION REQUIRED] ACADEMIC PROFILE INCOMPLETE
              </h4>
              <p className="text-xs text-black font-semibold mt-1 font-mono">
                Provide your verified CGPA, branch, technical skills, and upload your PDF resume to unlock automated job eligibility filtering.
              </p>
            </div>
          </div>
          <Link
            to="/student/profile"
            className="bg-black text-white hover:bg-cobalt text-xs font-mono font-black py-2.5 px-4 border-2 border-black flex-shrink-0 inline-flex items-center uppercase tracking-wider transition-all"
          >
            <span>COMPLETE NOW</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        </div>
      ) : (
        <div className="bg-emerald-100 border-2 border-black p-4 shadow-brutal flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-emerald-800" />
            <span className="font-mono text-xs font-black uppercase text-emerald-900">
              PROFILE VERIFIED — AUTOMATED CRITERIA MATCHING ACTIVE
            </span>
          </div>
          <Link to="/student/profile" className="font-mono text-xs font-black text-black underline uppercase">
            EDIT PROFILE
          </Link>
        </div>
      )}

      {/* 4 Brutalist Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          index="01"
          title="Eligible Drives"
          value={dashboard?.eligibleJobCount ?? 0}
          subtitle="Matching your CGPA & branch criteria"
        />
        <StatCard
          index="02"
          title="Applications"
          value={dashboard?.totalApplications ?? 0}
          subtitle="Submitted across corporate openings"
        />
        <StatCard
          index="03"
          title="Shortlisted"
          value={dashboard?.shortlistedCount ?? 0}
          subtitle="Cleared for technical interview rounds"
        />
        <StatCard
          index="04"
          title="Upcoming Rounds"
          value={dashboard?.upcomingInterviews ?? 0}
          subtitle="Scheduled corporate live assessments"
        />
      </div>

      {/* Two Column Section: Quick Actions & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Actions (5 Cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-black p-6 shadow-brutal space-y-4">
          <div className="pb-3 border-b-2 border-black flex items-center justify-between">
            <span className="font-heading font-black text-sm uppercase tracking-wider text-black">
              CANDIDATE ACTIONS
            </span>
            <span className="font-mono text-[10px] font-black bg-black text-white px-2 py-0.5">
              SHORTCUTS
            </span>
          </div>

          <div className="space-y-2.5">
            <Link
              to="/student/profile"
              className="p-3.5 bg-canvas border-2 border-black flex items-center justify-between group hover:bg-cobalt hover:text-white transition-all shadow-[2px_2px_0px_#0A0A0A]"
            >
              <div>
                <p className="text-xs font-heading font-black uppercase tracking-wide">
                  Update Profile & Resume
                </p>
                <p className="font-mono text-[10px] text-gray-600 group-hover:text-blue-100">
                  Update skills, CGPA & PDF credentials
                </p>
              </div>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/student/jobs"
              className="p-3.5 bg-canvas border-2 border-black flex items-center justify-between group hover:bg-cobalt hover:text-white transition-all shadow-[2px_2px_0px_#0A0A0A]"
            >
              <div>
                <p className="text-xs font-heading font-black uppercase tracking-wide">
                  Explore Active Drives
                </p>
                <p className="font-mono text-[10px] text-gray-600 group-hover:text-blue-100">
                  Apply before portal deadlines lock
                </p>
              </div>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/student/applications"
              className="p-3.5 bg-canvas border-2 border-black flex items-center justify-between group hover:bg-cobalt hover:text-white transition-all shadow-[2px_2px_0px_#0A0A0A]"
            >
              <div>
                <p className="text-xs font-heading font-black uppercase tracking-wide">
                  Application Pipeline
                </p>
                <p className="font-mono text-[10px] text-gray-600 group-hover:text-blue-100">
                  Track recruiter review & status changes
                </p>
              </div>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/student/placement"
              className="p-3.5 bg-canvas border-2 border-black flex items-center justify-between group hover:bg-cobalt hover:text-white transition-all shadow-[2px_2px_0px_#0A0A0A]"
            >
              <div>
                <p className="text-xs font-heading font-black uppercase tracking-wide">
                  Placement Offer Status
                </p>
                <p className="font-mono text-[10px] text-gray-600 group-hover:text-blue-100">
                  View cleared corporate placement letters
                </p>
              </div>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Recent Notifications (7 Cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-black p-6 shadow-brutal space-y-4">
          <div className="pb-3 border-b-2 border-black flex items-center justify-between">
            <span className="font-heading font-black text-sm uppercase tracking-wider text-black">
              DISPATCHES & ALERTS
            </span>
            <Link
              to="/student/notifications"
              className="font-mono text-xs font-black text-cobalt hover:text-black uppercase underline"
            >
              VIEW ALL DISPATCHES →
            </Link>
          </div>

          {dashboard?.recentNotifications && dashboard.recentNotifications.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recentNotifications.slice(0, 4).map((notif) => (
                <div key={notif.id} className="p-3.5 bg-canvas border-2 border-black shadow-[2px_2px_0px_#0A0A0A]">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <p className={`text-xs font-heading font-black uppercase ${notif.read ? 'text-gray-700' : 'text-cobalt'}`}>
                      {notif.title}
                    </p>
                    <span className="font-mono text-[10px] font-bold text-gray-600 bg-white px-2 py-0.5 border border-black">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal font-medium font-sans">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="NO RECENT DISPATCHES"
              description="Drive announcements and interview schedule notifications from placement admins will be broadcasted here."
            />
          )}
        </div>

      </div>
    </div>
  );
}
