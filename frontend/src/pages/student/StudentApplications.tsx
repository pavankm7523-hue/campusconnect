import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Building2, 
  Calendar, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { studentAPI } from '../../services/api';
import { Application } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function StudentApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getApplications();
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setApplications(data);
      } else if (data?.content) {
        setApplications(data.content);
      } else {
        setApplications([]);
      }
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleWithdraw = async (appId: number) => {
    if (!window.confirm('CONFIRM APPLICATION WITHDRAWAL? This irreversible action will recall your candidacy.')) {
      return;
    }

    setWithdrawingId(appId);
    try {
      await studentAPI.withdrawApplication(appId);
      toast.success('Application retracted successfully');
      setApplications((prev) => prev.filter((a) => a.id !== appId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to withdraw application');
    } finally {
      setWithdrawingId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status?.toUpperCase() === filterStatus;
  });

  if (loading) {
    return <LoadingSpinner size="lg" label="RETRIEVING APPLICATION DOSSIERS..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
            // CANDIDACY PIPELINE
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
            MY APPLICATIONS
          </h1>
          <p className="font-mono text-xs text-gray-700 font-bold mt-1">
            Track application progression, corporate review status, and evaluation notes.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-3">
          <label className="font-mono text-xs font-black uppercase text-black">FILTER:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field text-xs font-mono font-bold w-48"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="APPLIED">APPLIED</option>
            <option value="SHORTLISTED">SHORTLISTED</option>
            <option value="SELECTED">SELECTED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>

      {filteredApplications.length > 0 ? (
        <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-canvas border-b-2 border-black font-mono text-xs font-black text-black uppercase">
                  <th className="px-6 py-4">CORPORATE ROLE & FIRM</th>
                  <th className="px-6 py-4">FILED DATE</th>
                  <th className="px-6 py-4">REVIEW STATUS</th>
                  <th className="px-6 py-4">EVALUATION NOTES</th>
                  <th className="px-6 py-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black text-xs font-mono">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-canvas transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-bold flex-shrink-0 border border-black shadow-[2px_2px_0px_#0038FF]">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <Link
                            to={`/student/jobs/${app.jobId}`}
                            className="font-heading font-black text-sm uppercase text-black hover:text-cobalt transition-colors inline-flex items-center space-x-1"
                          >
                            <span>{app.jobTitle}</span>
                            <ExternalLink className="h-3 w-3 text-black" />
                          </Link>
                          <p className="font-mono text-xs text-gray-700 font-bold uppercase">{app.companyName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-3.5 w-3.5 text-black" />
                        <span>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'RECENT'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>

                    <td className="px-6 py-4 text-xs text-charcoal max-w-xs font-sans">
                      {app.notes || <span className="text-gray-400 font-mono italic">Awaiting feedback</span>}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap font-bold">
                      {app.status?.toUpperCase() === 'APPLIED' ? (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          disabled={withdrawingId === app.id}
                          className="inline-flex items-center space-x-1 text-xs font-mono font-black text-red-600 hover:text-black uppercase border border-red-600 hover:border-black px-2 py-1 bg-white hover:bg-red-50 shadow-[1px_1px_0px_#0A0A0A] transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>{withdrawingId === app.id ? 'RETRACTING...' : 'WITHDRAW'}</span>
                        </button>
                      ) : (
                        <span className="font-mono text-[10px] text-gray-500 uppercase bg-gray-100 border border-gray-400 px-2 py-0.5">
                          LOCKED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="NO CANDIDACIES ON FILE"
          description={
            filterStatus === 'ALL'
              ? "You have not submitted candidacies to any campus recruitment drives."
              : `No candidacies match the status filter "${filterStatus}".`
          }
        />
      )}
    </div>
  );
}
