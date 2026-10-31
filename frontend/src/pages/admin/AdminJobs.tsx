import { useState, useEffect, useCallback } from 'react';
import { 
  Briefcase, 
  Building2, 
  Search 
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { Job } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllJobs({ search: searchTerm });
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
  }, [searchTerm]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const filteredJobs = jobs.filter((j) => {
    if (!searchTerm.trim()) return true;
    return (
      j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading && jobs.length === 0) {
    return <LoadingSpinner size="lg" label="PARSING UNIVERSITY JOB REQUISITIONS..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
            // MASTER PLACEMENT DIRECTORY
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
            CAMPUS VACANCY AUDIT
          </h1>
          <p className="font-mono text-xs text-gray-700 font-bold mt-1">
            Institutional registry of all corporate drives, eligibility cutoffs, and compensation packages.
          </p>
        </div>

        <div className="font-mono text-xs font-black bg-yellow-300 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#0A0A0A] self-start sm:self-auto">
          CATALOGED OPENINGS: {jobs.length}
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-black" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title or enterprise name..."
            className="input-field pl-10 text-xs font-mono"
          />
        </div>
      </div>

      {/* Table */}
      {filteredJobs.length > 0 ? (
        <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-canvas border-b-2 border-black font-black text-black uppercase">
                  <th className="px-6 py-4">POSITION & CORPORATE PARTNER</th>
                  <th className="px-6 py-4">COMPENSATION (CTC)</th>
                  <th className="px-6 py-4">MIN CGPA</th>
                  <th className="px-6 py-4">SEATS</th>
                  <th className="px-6 py-4">DEADLINE</th>
                  <th className="px-6 py-4 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-canvas transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-bold text-sm border border-black shadow-[2px_2px_0px_#0038FF] flex-shrink-0">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-heading font-black text-sm uppercase text-black">{job.title}</p>
                          <p className="font-mono text-[10px] text-gray-700 font-bold uppercase mt-0.5">{job.companyName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-black text-black">
                      {job.packageOffered || 'DISCLOSED'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-black text-cobalt">
                      {job.minCgpa ? `${job.minCgpa.toFixed(2)} / 10.0` : 'OPEN'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-black">
                      {job.totalPositions || 1} SEATS
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600">
                      {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'ROLLING'}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <StatusBadge status={job.status || 'OPEN'} />
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
          title="NO VACANCIES CATALOGED"
          description="There are currently no job records matching your query."
        />
      )}
    </div>
  );
}
