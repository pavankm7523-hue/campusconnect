import React, { useState, useEffect, useCallback } from 'react';
import { 
  CalendarRange, 
  Plus, 
  Building2, 
  Calendar, 
  X 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import { RecruitmentDrive } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDrives() {
  const [drives, setDrives] = useState<RecruitmentDrive[]>([]);
  const [loading, setLoading] = useState(true);

  // Create modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    startDate: '',
    endDate: '',
    description: '',
    status: 'UPCOMING',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDrives = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getDrives();
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setDrives(data);
      } else if (data?.content) {
        setDrives(data.content);
      } else {
        setDrives([]);
      }
    } catch {
      setDrives([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.companyName.trim()) {
      toast.error('Drive title and company name are required');
      return;
    }

    setSubmitting(true);
    try {
      await adminAPI.createDrive(formData);
      toast.success('Recruitment drive scheduled successfully');
      setIsModalOpen(false);
      setFormData({
        name: '',
        companyName: '',
        startDate: '',
        endDate: '',
        description: '',
        status: 'UPCOMING',
      });
      fetchDrives();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create recruitment drive');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await adminAPI.updateDriveStatus(id, { status: newStatus });
      toast.success(`Drive status updated to ${newStatus}`);
      setDrives((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update drive status');
    }
  };

  if (loading && drives.length === 0) {
    return <LoadingSpinner size="lg" label="SYNCHRONIZING HIRING SEASONS..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
            // HIRING SEASONS & ACCELERATORS
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
            RECRUITMENT DRIVES
          </h1>
          <p className="font-mono text-xs text-gray-700 font-bold mt-1">
            Coordinate multi-day corporate drives, slot company assessments, and oversee candidate intake.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs px-5 py-3 flex items-center space-x-2 self-start sm:self-auto font-mono"
        >
          <Plus className="h-4 w-4" />
          <span>SCHEDULE DRIVE</span>
        </button>
      </div>

      {/* Drives Table */}
      {drives.length > 0 ? (
        <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-canvas border-b-2 border-black font-black text-black uppercase">
                  <th className="px-6 py-4">DRIVE IDENTIFIER & SCOPE</th>
                  <th className="px-6 py-4">HOSTING ENTERPRISE</th>
                  <th className="px-6 py-4">SCHEDULE TIMELINE</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4 text-right">CONTROLS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {drives.map((drive) => (
                  <tr key={drive.id} className="hover:bg-canvas transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-heading font-black text-sm uppercase text-black">{drive.name}</p>
                        <p className="font-mono text-[10px] text-gray-700 font-bold line-clamp-1 mt-0.5">{drive.description}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-black uppercase">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-black" />
                        <span>{drive.companyName}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-3.5 w-3.5 text-black" />
                        <span>
                          {drive.startDate ? new Date(drive.startDate).toLocaleDateString() : 'TBD'} –{' '}
                          {drive.endDate ? new Date(drive.endDate).toLocaleDateString() : 'TBD'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={drive.status || 'UPCOMING'} />
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2 font-bold">
                      {drive.status !== 'ACTIVE' && (
                        <button
                          onClick={() => handleUpdateStatus(drive.id, 'ACTIVE')}
                          className="btn-secondary text-xs py-1.5 px-3 text-emerald-800 hover:bg-emerald-100 border-2 border-black"
                        >
                          ACTIVATE
                        </button>
                      )}
                      {drive.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleUpdateStatus(drive.id, 'COMPLETED')}
                          className="btn-secondary text-xs py-1.5 px-3 text-black hover:bg-canvas border-2 border-black"
                        >
                          CONCLUDE
                        </button>
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
          icon={CalendarRange}
          title="NO SCHEDULED DRIVES"
          description="Click 'SCHEDULE DRIVE' above to organize your campus recruitment events."
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-lg w-full p-6 space-y-4 shadow-brutal-lg relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-black hover:bg-canvas border border-black font-black"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b-2 border-black pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-cobalt font-black block">
                // DRIVE SCHEDULE ORCHESTRATION
              </span>
              <h3 className="font-heading font-black text-xl text-black uppercase mt-0.5">
                SCHEDULE RECRUITMENT DRIVE
              </h3>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  DRIVE CODENAME / TITLE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCS Pan-India Innovator Drive 2026"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  AFFILIATED ENTERPRISE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Consultancy Services"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="input-field text-xs font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                    START DATE
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                    END DATE
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-field text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  OPERATIONAL STATUS
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field text-xs font-mono font-bold"
                >
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="ACTIVE">ACTIVE (CURRENTLY UNDERWAY)</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  SCHEDULE SYNOPSIS & INSTRUCTIONS
                </label>
                <textarea
                  rows={3}
                  placeholder="Drive rules, test venue guidelines, documentation verification..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field text-xs font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary text-xs px-4 py-2.5 font-mono font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-xs px-6 py-2.5 font-mono font-bold"
                >
                  {submitting ? 'RECORDING...' : 'CONFIRM DRIVE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
