import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building2, 
  Plus, 
  ExternalLink, 
  Trash2, 
  Edit, 
  Globe, 
  X 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import { Company } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Create / Edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getCompanies();
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setCompanies(data);
      } else if (data?.content) {
        setCompanies(data.content);
      } else {
        setCompanies([]);
      }
    } catch {
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleOpenCreate = () => {
    setEditingCompany(null);
    setFormData({ name: '', industry: '', website: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp: Company) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name || '',
      industry: comp.industry || '',
      website: comp.website || '',
      description: comp.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCompany) {
        await adminAPI.updateCompany(editingCompany.id, formData);
        toast.success('Company updated successfully');
      } else {
        await adminAPI.createCompany(formData);
        toast.success('Company created successfully');
      }
      setIsModalOpen(false);
      fetchCompanies();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save company details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('CONFIRM DELETION OF CORPORATE ENTITY? Associated job listings will also be decommissioned.')) return;
    try {
      await adminAPI.deleteCompany(id);
      toast.success('Company removed successfully');
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete company');
    }
  };

  if (loading && companies.length === 0) {
    return <LoadingSpinner size="lg" label="LOADING CORPORATE PARTNER ROSTER..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
            // CORPORATE RECRUITMENT PARTNERS
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
            ENTERPRISE DIRECTORY
          </h1>
          <p className="font-mono text-xs text-gray-700 font-bold mt-1">
            Accredited enterprise partners, industry sectors, and active recruitment tracks.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-primary text-xs px-5 py-3 flex items-center space-x-2 self-start sm:self-auto font-mono"
        >
          <Plus className="h-4 w-4" />
          <span>ENROLL ENTERPRISE</span>
        </button>
      </div>

      {/* Companies List */}
      {companies.length > 0 ? (
        <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-canvas border-b-2 border-black font-black text-black uppercase">
                  <th className="px-6 py-4">ENTERPRISE NAME & PROFILE</th>
                  <th className="px-6 py-4">INDUSTRY SECTOR</th>
                  <th className="px-6 py-4">DIGITAL DOMAIN</th>
                  <th className="px-6 py-4">RECRUITERS</th>
                  <th className="px-6 py-4">ACTIVE DRIVES</th>
                  <th className="px-6 py-4 text-right">OPERATIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {companies.map((comp) => (
                  <tr key={comp.id} className="hover:bg-canvas transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-heading font-black text-sm border border-black shadow-[2px_2px_0px_#0038FF] flex-shrink-0">
                          {comp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-heading font-black text-sm uppercase text-black">{comp.name}</p>
                          <p className="font-mono text-[10px] text-gray-600 line-clamp-1">{comp.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-black uppercase whitespace-nowrap">
                      {comp.industry || 'TECHNOLOGY'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      {comp.website ? (
                        <a
                          href={comp.website.startsWith('http') ? comp.website : `https://${comp.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs font-black text-cobalt hover:text-black uppercase underline flex items-center space-x-1"
                        >
                          <Globe className="h-3.5 w-3.5 text-black" />
                          <span>{comp.website.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="font-mono text-xs text-gray-400 italic">NONE</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-black">
                      {comp.recruiterCount ?? 1} LEADS
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-black">
                      {comp.jobCount ?? 0} DRIVES
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2 font-bold">
                      <button
                        onClick={() => handleOpenEdit(comp)}
                        className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center space-x-1 border-2 border-black"
                        title="Edit details"
                      >
                        <Edit className="h-3.5 w-3.5 text-black" />
                        <span>EDIT</span>
                      </button>
                      <button
                        onClick={() => handleDelete(comp.id)}
                        className="btn-secondary text-xs py-1.5 px-2.5 text-red-600 hover:text-black hover:bg-red-100 border-2 border-black"
                        title="Delete enterprise"
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
          icon={Building2}
          title="NO ENTERPRISE PARTNERS ENROLLED"
          description="Register partner corporations to begin authorizing recruiter leads and hosting campus placement drives."
        />
      )}

      {/* Create / Edit Modal */}
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
                // ENTERPRISE REGISTRATION
              </span>
              <h3 className="font-heading font-black text-xl text-black uppercase mt-0.5">
                {editingCompany ? 'UPDATE ENTERPRISE RECORD' : 'ENROLL NEW ENTERPRISE'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  COMPANY LEGAL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Consultancy Services or Google India"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  INDUSTRY SECTOR
                </label>
                <input
                  type="text"
                  placeholder="e.g. Information Technology / Fintech / Core Engineering"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="input-field text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  CORPORATE WEBSITE URL
                </label>
                <input
                  type="text"
                  placeholder="https://tcs.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="input-field text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  CORPORATE PROFILE OVERVIEW
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe organization size, market operations, and hiring scope..."
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
                  {submitting ? 'COMMITTING...' : editingCompany ? 'UPDATE RECORD' : 'ENROLL ENTERPRISE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
