import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  PlusCircle, 
  Trash2, 
  Users 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { recruiterAPI } from '../../services/api';
import { Job } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await recruiterAPI.getJobs();
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setJobs(data);
      } else if (data?.content) {
        setJobs(data.content);
      } else {
        setJobs([]);
      }
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDeleteJob = async (jobId: number) => {
    if (!window.confirm('CONFIRM LISTING DECOMMISSION? This will remove this opening and archive associated candidacies.')) {
      return;
    }

    setDeletingId(jobId);
    try {
      await recruiterAPI.deleteJob(jobId);
      toast.success('Job posting decommissioned successfully');
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete job posting');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" label="LOADING TALENT PIPELINES..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
            // ACTIVE TRACKS REGISTER
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
            CAMPUS OPENINGS
          </h1>
          <p className="font-mono text-xs text-gray-700 font-bold mt-1">
            Publish roles, evaluate student applications, and advance candidate cohorts.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/create"
          className="btn-primary text-xs px-5 py-3 flex items-center space-x-2 self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>PUBLISH NEW OPENING</span>
        </Link>
      </div>

      {/* Jobs Table */}
      {jobs.length > 0 ? (
        <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-canvas border-b-2 border-black font-black text-black uppercase">
                  <th className="px-6 py-4">POSITION TITLE & SPEC</th>
                  <th className="px-6 py-4">PACKAGE</th>
                  <th className="px-6 py-4">SEATS</th>
                  <th className="px-6 py-4">DEADLINE</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">OPERATIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-canvas transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-heading font-black text-sm uppercase text-black">{job.title}</p>
                        <p className="font-mono text-[10px] text-gray-700 font-bold uppercase mt-0.5">
                          <span>{job.jobType || 'FULL TIME'}</span>
                          <span> • </span>
                          <span>{job.location || 'CAMPUS'}</span>
                          <span> • </span>
                          <span>MIN CGPA: {job.minCgpa ? job.minCgpa.toFixed(2) : '0.00'}</span>
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-black text-black">
                      {job.packageOffered || 'DISCLOSED'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-black">
                      {job.totalPositions || 1} SEATS
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600">
                      {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'ROLLING'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={job.status || 'OPEN'} />
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2 font-bold">
                      <Link
                        to={`/recruiter/jobs/${job.id}/applicants`}
                        className="btn-primary text-xs py-1.5 px-3 inline-flex items-center space-x-1"
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>APPLICANTS</span>
                      </Link>

                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        disabled={deletingId === job.id}
                        className="btn-secondary text-xs py-1.5 px-2.5 text-red-600 hover:text-black hover:bg-red-100"
                        title="Delete opening"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="NO CAMPUS ROLES PUBLISHED"
          description="You haven't posted any jobs for students yet. Create an opening to launch your campus drive."
        />
      )}
    </div>
  );
}
