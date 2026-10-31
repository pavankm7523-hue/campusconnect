import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  ExternalLink 
} from 'lucide-react';
import { recruiterAPI } from '../../services/api';
import { Job, Interview, RecruiterProfile } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function RecruiterDashboard() {
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profRes, jobsRes, intRes] = await Promise.allSettled([
        recruiterAPI.getProfile(),
        recruiterAPI.getJobs(),
        recruiterAPI.getInterviews(),
      ]);

      if (profRes.status === 'fulfilled') {
        const pData = profRes.value.data?.data || profRes.value.data;
        setProfile(pData);
      }

      if (jobsRes.status === 'fulfilled') {
        const jData = jobsRes.value.data?.data || jobsRes.value.data;
        if (Array.isArray(jData)) setJobs(jData);
        else if (jData?.content) setJobs(jData.content);
      }

      if (intRes.status === 'fulfilled') {
        const iData = intRes.value.data?.data || intRes.value.data;
        if (Array.isArray(iData)) setInterviews(iData);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" label="INITIALIZING TALENT WORKSPACE..." />;
  }

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status?.toUpperCase() === 'OPEN').length;
  const totalInterviews = interviews.length;

  return (
    <div className="space-y-8">
      {/* Top Brutalist Console Banner */}
      <div className="bg-white border-2 border-black p-6 lg:p-8 shadow-brutal flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-black font-black mb-2">
            <span className="w-2.5 h-2.5 bg-cobalt border border-black inline-block"></span>
            <span>ENTERPRISE RECRUITMENT DESK // {profile?.companyName || 'CORPORATE PARTNER'}</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-black uppercase tracking-tight">
            TALENT OPERATIONS
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-xs font-bold">
            <span className="bg-canvas border border-black px-2.5 py-1">
              RECRUITER: {profile?.fullName || 'TALENT LEAD'}
            </span>
            <span className="bg-canvas border border-black px-2.5 py-1">
              TITLE: {profile?.designation || 'TALENT SPECIALIST'}
            </span>
            <span className="bg-emerald-100 border border-black px-2.5 py-1 text-emerald-950 font-black">
              STATUS: {profile?.approved ? 'APPROVED' : 'PENDING'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/recruiter/jobs/create"
            className="btn-primary text-xs py-3 px-5 inline-flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>PUBLISH NEW OPENING</span>
          </Link>
        </div>
      </div>

      {/* 4 Brutalist Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          index="01"
          title="Active Openings"
          value={activeJobs}
          subtitle="Positions currently open to student applicants"
        />
        <StatCard
          index="02"
          title="Total Drives"
          value={totalJobs}
          subtitle="All recruitment listings published this cycle"
        />
        <StatCard
          index="03"
          title="Scheduled Rounds"
          value={totalInterviews}
          subtitle="Interviews queued with verified candidates"
        />
        <StatCard
          index="04"
          title="Verification Status"
          value={profile?.approved ? 'APPROVED' : 'PENDING'}
          subtitle="Placement desk operational clearance"
        />
      </div>

      {/* Job Postings Table Dossier */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal space-y-4">
        <div className="pb-3 border-b-2 border-black flex items-center justify-between">
          <div>
            <span className="font-heading font-black text-sm uppercase tracking-wider text-black">
              ACTIVE HIRING TRACKS
            </span>
            <p className="font-mono text-xs text-gray-700 font-bold mt-0.5">
              Role openings filtered by university eligibility constraints.
            </p>
          </div>
          <Link
            to="/recruiter/jobs"
            className="font-mono text-xs font-black text-cobalt hover:text-black uppercase underline"
          >
            MANAGE ALL TRACKS →
          </Link>
        </div>

        {jobs.length > 0 ? (
          <div className="overflow-x-auto border-2 border-black">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b-2 border-black bg-canvas font-black text-black uppercase">
                  <th className="py-3 px-4">POSITION TITLE</th>
                  <th className="py-3 px-4">LOCATION</th>
                  <th className="py-3 px-4">CTC PACKAGE</th>
                  <th className="py-3 px-4">DEADLINE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">CANDIDATES</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-canvas transition-colors">
                    <td className="py-3.5 px-4 font-bold text-black">
                      <Link to={`/recruiter/jobs/${job.id}/applicants`} className="font-heading font-black text-sm uppercase hover:text-cobalt transition-colors">
                        {job.title}
                      </Link>
                      <span className="font-mono text-[10px] text-gray-600 block mt-0.5">
                        MIN CGPA: {job.minCgpa ? job.minCgpa.toFixed(2) : '0.00'} • {job.jobType || 'FULL_TIME'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal font-bold">{job.location || 'CAMPUS'}</td>
                    <td className="py-3.5 px-4 font-black text-black">{job.packageOffered || 'STANDARD'}</td>
                    <td className="py-3.5 px-4 font-bold text-red-600">{job.applicationDeadline || 'ROLLING'}</td>
                    <td className="py-3.5 px-4"><StatusBadge status={job.status || 'OPEN'} /></td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/recruiter/jobs/${job.id}/applicants`}
                        className="font-mono text-xs font-black text-cobalt hover:text-black uppercase underline inline-flex items-center space-x-1"
                      >
                        <span>REVIEW APPLICANTS</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="NO HIRING TRACKS PUBLISHED"
            description="You have not published any job descriptions for this recruitment cycle yet."
          />
        )}
      </div>
    </div>
  );
}
