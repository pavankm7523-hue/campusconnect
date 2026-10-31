import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  Building2 
} from 'lucide-react';
import { studentAPI } from '../../services/api';
import { Job, PagedResponse } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function StudentJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        page,
        size: 9,
      };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (jobTypeFilter !== 'ALL') params.jobType = jobTypeFilter;
      if (branchFilter !== 'ALL') params.branch = branchFilter;

      const res = await studentAPI.getJobs(params);
      const data = res.data?.data || res.data;

      if (Array.isArray(data)) {
        setJobs(data);
        setTotalPages(1);
      } else if (data?.content) {
        const paged = data as PagedResponse<Job>;
        setJobs(paged.content || []);
        setTotalPages(paged.totalPages || 1);
      } else {
        setJobs([]);
      }
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, jobTypeFilter, branchFilter]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchJobs();
  };

  return (
    <div className="space-y-6">
      {/* Brutalist Page Header */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
            // CORPORATE DRIVE DIRECTORY
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
            ACTIVE CAMPUS DRIVES
          </h1>
          <p className="font-mono text-xs text-gray-700 font-bold mt-1">
            Review live campus placement opportunities, check verified eligibility, and file candidacies.
          </p>
        </div>
        <div className="font-mono text-xs font-black bg-yellow-300 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#0A0A0A] self-start sm:self-auto">
          AVAILABLE DRIVES: {jobs.length}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="card space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-black" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, company name, or tech skill..."
              className="input-field pl-10 text-xs font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={jobTypeFilter}
              onChange={(e) => {
                setJobTypeFilter(e.target.value);
                setPage(0);
              }}
              className="input-field text-xs font-mono font-bold w-full sm:w-auto"
            >
              <option value="ALL">ALL CONTRACT TYPES</option>
              <option value="FULL_TIME">FULL TIME</option>
              <option value="INTERNSHIP">INTERNSHIP</option>
            </select>

            <select
              value={branchFilter}
              onChange={(e) => {
                setBranchFilter(e.target.value);
                setPage(0);
              }}
              className="input-field text-xs font-mono font-bold w-full sm:w-auto"
            >
              <option value="ALL">ALL BRANCHES</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="AIDS">AIDS</option>
            </select>

            <button type="submit" className="btn-primary text-xs px-6">
              FILTER
            </button>
          </div>
        </form>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <LoadingSpinner size="lg" label="QUERYING ACTIVE RECRUITMENT DRIVES..." />
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col justify-between hover:translate-x-0.5 hover:translate-y-0.5 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3 border-b-2 border-black pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-base flex-shrink-0 border-2 border-black shadow-[2px_2px_0px_#0038FF]">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-base text-black group-hover:text-cobalt transition-colors uppercase line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="font-mono text-xs text-gray-700 font-bold uppercase">{job.companyName}</p>
                    </div>
                  </div>
                  <StatusBadge status={job.status || 'OPEN'} />
                </div>

                <p className="text-xs text-charcoal line-clamp-2 mb-4 font-sans leading-relaxed">
                  {job.description}
                </p>

                {/* Key Attributes */}
                <div className="space-y-2 text-xs font-mono mb-4 bg-canvas border border-black p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-gray-600 font-bold">
                      <DollarSign className="h-3.5 w-3.5 text-black" />
                      <span>PACKAGE</span>
                    </span>
                    <span className="font-black text-black">{job.packageOffered || 'TBD'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-gray-600 font-bold">
                      <MapPin className="h-3.5 w-3.5 text-black" />
                      <span>LOCATION</span>
                    </span>
                    <span className="font-black text-black">{job.location || 'PAN-INDIA'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 text-gray-600 font-bold">
                      <Calendar className="h-3.5 w-3.5 text-black" />
                      <span>DEADLINE</span>
                    </span>
                    <span className="font-black text-red-600">
                      {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'ROLLING'}
                    </span>
                  </div>
                </div>

                {/* Eligibility Tag & Skills */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between font-mono text-xs font-bold">
                    <span className="text-gray-600 uppercase">ELIGIBILITY:</span>
                    {job.eligible ? (
                      <span className="badge-green flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>ELIGIBLE</span>
                      </span>
                    ) : (
                      <span className="badge-red flex items-center space-x-1">
                        <XCircle className="h-3 w-3" />
                        <span>INELIGIBLE</span>
                      </span>
                    )}
                  </div>

                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.requiredSkills.slice(0, 3).map((skill) => (
                        <span key={skill} className="font-mono text-[9px] font-black uppercase bg-canvas text-black border border-black px-1.5 py-0.5">
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <span className="font-mono text-[9px] text-gray-600 font-bold self-center">
                          +{job.requiredSkills.length - 3} MORE
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-3 border-t-2 border-black flex items-center justify-between mt-2">
                {job.applied ? (
                  <span className="badge-blue text-xs font-black">APPLIED</span>
                ) : (
                  <span className="font-mono text-[10px] font-bold text-gray-600">
                    MIN CGPA: {job.minCgpa ? job.minCgpa.toFixed(2) : '0.00'}
                  </span>
                )}

                <Link
                  to={`/student/jobs/${job.id}`}
                  className="btn-primary text-xs py-2 px-3.5 inline-flex items-center"
                >
                  <span>INSPECT DETAILS</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="NO RECRUITMENT DRIVES MATCHED"
          description="Adjust your search keywords or branch filters to inspect additional corporate vacancies."
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-3 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="btn-secondary text-xs px-4 py-2 flex items-center space-x-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>PREVIOUS</span>
          </button>
          <span className="font-mono text-xs text-black font-black bg-white border-2 border-black px-3 py-2">
            PAGE {page + 1} OF {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="btn-secondary text-xs px-4 py-2 flex items-center space-x-1"
          >
            <span>NEXT</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
