import { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  Edit3 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { recruiterAPI } from '../../services/api';
import { Interview } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function RecruiterInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  // Outcome update modal
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [outcome, setOutcome] = useState('PASSED');
  const [interviewerNotes, setInterviewerNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await recruiterAPI.getInterviews();
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setInterviews(data);
      } else {
        setInterviews([]);
      }
    } catch {
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleUpdateOutcome = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;

    setUpdating(true);
    try {
      await recruiterAPI.updateInterviewOutcome(selectedInterview.id, {
        outcome,
        interviewerNotes,
      });
      toast.success('Interview outcome updated successfully');
      setInterviews((prev) =>
        prev.map((i) =>
          i.id === selectedInterview.id
            ? { ...i, outcome, interviewerNotes }
            : i
        )
      );
      setSelectedInterview(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update interview outcome');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" label="SYNCHRONIZING INTERVIEW SCHEDULES..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
            // LIVE EVALUATION PIPELINE
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
            INTERVIEWS & SCHEDULES
          </h1>
          <p className="font-mono text-xs text-gray-700 font-bold mt-1">
            Review candidate assessment sessions, access meeting links, and record round outcomes.
          </p>
        </div>

        <div className="font-mono text-xs font-black bg-yellow-300 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#0A0A0A] self-start sm:self-auto">
          QUEUED SESSIONS: {interviews.length}
        </div>
      </div>

      {/* Table */}
      {interviews.length > 0 ? (
        <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-canvas border-b-2 border-black font-black text-black uppercase">
                  <th className="px-6 py-4">CANDIDATE & ROLE</th>
                  <th className="px-6 py-4">ROUND IDENTIFIER</th>
                  <th className="px-6 py-4">SCHEDULED TIMING</th>
                  <th className="px-6 py-4">VENUE / MEETING URL</th>
                  <th className="px-6 py-4">OUTCOME</th>
                  <th className="px-6 py-4 text-right">EVALUATION</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {interviews.map((item) => (
                  <tr key={item.id} className="hover:bg-canvas transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-heading font-black text-sm uppercase text-black">{item.studentName || 'CANDIDATE'}</p>
                        <p className="font-mono text-[10px] text-gray-700 font-bold uppercase mt-0.5">{item.jobTitle}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-black uppercase">
                      {item.interviewType || 'INTERVIEW'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-black">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-3.5 w-3.5 text-black" />
                        <span>
                          {item.scheduledAt
                            ? new Date(item.scheduledAt).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'N/A'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-bold text-charcoal max-w-xs truncate">
                      {item.venue || 'VIRTUAL'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={item.outcome || 'PENDING'} />
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap font-bold">
                      <button
                        onClick={() => {
                          setSelectedInterview(item);
                          setOutcome(item.outcome || 'PASSED');
                          setInterviewerNotes(item.interviewerNotes || '');
                        }}
                        className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center space-x-1.5 border-2 border-black"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-black" />
                        <span>RECORD OUTCOME</span>
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
          icon={Calendar}
          title="NO SCHEDULED SESSIONS"
          description="You haven't scheduled any candidate evaluation rounds yet. Access Job Applicants to coordinate rounds."
        />
      )}

      {/* Outcome Update Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full p-6 space-y-4 shadow-brutal-lg">
            <h3 className="font-heading font-black text-base uppercase text-black">
              RECORD EVALUATION: {selectedInterview.studentName}
            </h3>
            <p className="font-mono text-xs text-gray-700 font-bold">
              ROLE: <span className="text-black uppercase">{selectedInterview.jobTitle}</span>
            </p>

            <form onSubmit={handleUpdateOutcome} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  EVALUATION RESULT *
                </label>
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="input-field text-xs font-mono font-bold"
                >
                  <option value="PASSED">PASSED (RECOMMENDED FOR SELECTION / NEXT ROUND)</option>
                  <option value="FAILED">FAILED (DID NOT MEET CRITERIA)</option>
                  <option value="PENDING">PENDING DELIBERATION</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  PANEL FEEDBACK & NOTES
                </label>
                <textarea
                  rows={4}
                  value={interviewerNotes}
                  onChange={(e) => setInterviewerNotes(e.target.value)}
                  placeholder="Record strengths, algorithm design efficiency, communication clarity..."
                  className="input-field text-xs font-mono"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInterview(null)}
                  className="btn-secondary text-xs px-4 py-2 font-mono font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-primary text-xs px-4 py-2 font-mono font-bold"
                >
                  {updating ? 'SAVING...' : 'COMMIT EVALUATION'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
