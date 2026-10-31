import { useState, useEffect, useCallback } from 'react';
import { 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  Building2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import { RecruiterProfile } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function AdminRecruiters() {
  const [recruiters, setRecruiters] = useState<RecruiterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  const fetchRecruiters = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getRecruiters();
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setRecruiters(data);
      } else if (data?.content) {
        setRecruiters(data.content);
      } else {
        setRecruiters([]);
      }
    } catch {
      setRecruiters([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

  const handleApprove = async (id: number) => {
    setApprovingId(id);
    try {
      await adminAPI.approveRecruiter(id);
      toast.success('Recruiter account approved successfully');
      setRecruiters((prev) =>
        prev.map((r) => (r.id === id ? { ...r, approved: true } : r))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve recruiter');
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" label="QUERYING RECRUITER CLEARANCES..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
            // ENTERPRISE ACCOUNT AUDIT
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
            RECRUITER ACCOUNTS
          </h1>
          <p className="font-mono text-xs text-gray-700 font-bold mt-1">
            Verify corporate credentials, assess affiliated enterprises, and grant portal clearance.
          </p>
        </div>

        <div className="font-mono text-xs font-black bg-yellow-300 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#0A0A0A] self-start sm:self-auto">
          REGISTERED LEADS: {recruiters.length}
        </div>
      </div>

      {recruiters.length > 0 ? (
        <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-canvas border-b-2 border-black font-black text-black uppercase">
                  <th className="px-6 py-4">RECRUITER NAME</th>
                  <th className="px-6 py-4">AFFILIATED ENTERPRISE</th>
                  <th className="px-6 py-4">DESIGNATION</th>
                  <th className="px-6 py-4">CONTACT CREDENTIALS</th>
                  <th className="px-6 py-4">SECURITY CLEARANCE</th>
                  <th className="px-6 py-4 text-right">ADMIN DECISION</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {recruiters.map((r) => (
                  <tr key={r.id} className="hover:bg-canvas transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-heading font-black text-sm uppercase text-black">{r.fullName || 'RECRUITER'}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-black font-bold uppercase">
                        <Building2 className="h-4 w-4 text-black" />
                        <span>{r.companyName || 'UNASSIGNED'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-bold text-gray-700 uppercase">
                      {r.designation || 'TALENT LEAD'}
                    </td>

                    <td className="px-6 py-4 text-xs font-bold text-black">
                      <p>{r.email}</p>
                      <p className="text-gray-600 font-mono text-[10px]">{r.phone || 'PHONE UNLISTED'}</p>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {r.approved ? (
                        <span className="badge-green flex items-center space-x-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>APPROVED</span>
                        </span>
                      ) : (
                        <span className="badge-yellow flex items-center space-x-1 w-fit">
                          <Clock className="h-3 w-3" />
                          <span>PENDING CLEARANCE</span>
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap font-bold">
                      {!r.approved ? (
                        <button
                          onClick={() => handleApprove(r.id)}
                          disabled={approvingId === r.id}
                          className="btn-primary text-xs py-1.5 px-3 bg-emerald-700 hover:bg-black font-mono font-bold"
                        >
                          {approvingId === r.id ? 'CLEARING...' : 'GRANT CLEARANCE'}
                        </button>
                      ) : (
                        <span className="font-mono text-[10px] text-emerald-800 uppercase font-black bg-emerald-100 border border-emerald-800 px-2 py-0.5">
                          AUTHORIZED
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
          icon={UserCheck}
          title="NO RECRUITERS AWAITING CLEARANCE"
          description="There are currently no corporate recruiters awaiting review or registered on the platform."
        />
      )}
    </div>
  );
}
