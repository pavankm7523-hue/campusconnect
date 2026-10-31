import { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  Search, 
  Edit3, 
  X 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import { Application } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Status edit modal
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [newStatus, setNewStatus] = useState('APPLIED');
  const [updating, setUpdating] = useState(false);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllApplications();
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

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    setUpdating(true);
    try {
      await adminAPI.updateApplicationStatus(editingApp.id, { status: newStatus });
      toast.success('Application status updated successfully');
      setApplications((prev) =>
        prev.map((a) => (a.id === editingApp.id ? { ...a, status: newStatus } : a))
      );
      setEditingApp(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === 'ALL' || app.status?.toUpperCase() === statusFilter;
    const matchesSearch =
      !searchTerm.trim() ||
      app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading && applications.length === 0) {
    return <LoadingSpinner size="lg" label="PARSING UNIVERSITY APPLICATION PIPELINE..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
            // MASTER APPLICATION POOL
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
            CANDIDATE APPLICATIONS
          </h1>
          <p className="font-mono text-xs text-gray-700 font-bold mt-1">
            Monitor university student candidacies across all drives and perform governance overrides.
          </p>
        </div>

        <div className="font-mono text-xs font-black bg-yellow-300 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#0A0A0A] self-start sm:self-auto">
          RECORDED CANDIDACIES: {applications.length}
        </div>
      </div>

      {/* Filter / Search */}
      <div className="card flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-black" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate name, USN roll number, or enterprise..."
            className="input-field pl-10 text-xs font-mono"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field text-xs font-mono font-bold w-full md:w-56"
        >
          <option value="ALL">ALL PIPELINE STAGES</option>
          <option value="APPLIED">APPLIED</option>
          <option value="SHORTLISTED">SHORTLISTED</option>
          <option value="SELECTED">SELECTED / PLACED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {/* Table */}
      {filteredApplications.length > 0 ? (
        <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-canvas border-b-2 border-black font-black text-black uppercase">
                  <th className="px-6 py-4">CANDIDATE & ROLL</th>
                  <th className="px-6 py-4">CORPORATE & ROLE</th>
                  <th className="px-6 py-4">BRANCH & CGPA</th>
                  <th className="px-6 py-4">FILED DATE</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">OVERRIDE</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-canvas transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-heading font-black text-sm uppercase text-black">{app.studentName}</p>
                        <p className="font-mono text-[10px] text-gray-700 font-bold uppercase mt-0.5">{app.rollNumber}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <p className="font-heading font-black text-sm uppercase text-black">{app.jobTitle}</p>
                        <p className="font-mono text-[10px] text-gray-700 font-bold uppercase">{app.companyName}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-black uppercase">
                      {app.branch} ({app.cgpa ? app.cgpa.toFixed(2) : '0.00'} CGPA)
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'RECENT'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status || 'APPLIED'} />
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap font-bold">
                      <button
                        onClick={() => {
                          setEditingApp(app);
                          setNewStatus(app.status?.toUpperCase() || 'APPLIED');
                        }}
                        className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center space-x-1 border-2 border-black"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-black" />
                        <span>OVERRIDE STATUS</span>
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
          icon={FileText}
          title="NO CANDIDACY RECORDS LOCATED"
          description="There are no student application records matching your search or filters."
        />
      )}

      {/* Edit Status Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-sm w-full p-6 space-y-4 shadow-brutal-lg relative">
            <button
              onClick={() => setEditingApp(null)}
              className="absolute top-4 right-4 p-1 text-black hover:bg-canvas border border-black font-black"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b-2 border-black pb-2">
              <span className="font-mono text-[10px] font-black uppercase text-cobalt block">
                // GOVERNANCE OVERRIDE
              </span>
              <h3 className="font-heading font-black text-base uppercase text-black mt-0.5">
                OVERRIDE STATUS
              </h3>
            </div>
            
            <p className="font-mono text-xs text-gray-700 font-bold">
              CANDIDATE: <span className="text-black uppercase">{editingApp.studentName}</span>
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  TARGET PIPELINE STAGE *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input-field text-xs font-mono font-bold"
                >
                  <option value="APPLIED">APPLIED</option>
                  <option value="SHORTLISTED">SHORTLISTED</option>
                  <option value="SELECTED">SELECTED / PLACED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="ON_HOLD">ON HOLD</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="btn-secondary text-xs px-4 py-2 font-mono font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary text-xs px-4 py-2 font-mono font-bold"
                >
                  {updating ? 'SAVING...' : 'SAVE STATUS'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
