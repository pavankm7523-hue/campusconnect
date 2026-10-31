import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Search, 
  ExternalLink 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { recruiterAPI } from '../../services/api';
import { Application } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function RecruiterApplicants() {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);

  const [applicants, setApplicants] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [rejectModalApp, setRejectModalApp] = useState<Application | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const [interviewModalApp, setInterviewModalApp] = useState<Application | null>(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [venue, setVenue] = useState('Google Meet / Zoom');
  const [interviewType, setInterviewType] = useState('Technical Round 1');
  const [scheduling, setScheduling] = useState(false);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await recruiterAPI.getApplicants(jobId);
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setApplicants(data);
      } else if (data?.content) {
        setApplicants(data.content);
      } else {
        setApplicants([]);
      }
    } catch {
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (jobId) fetchApplicants();
  }, [jobId, fetchApplicants]);

  const handleShortlist = async (appId: number) => {
    try {
      await recruiterAPI.shortlistApplication(appId);
      toast.success('Applicant shortlisted successfully');
      setApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: 'SHORTLISTED' } : a))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to shortlist applicant');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalApp) return;
    setRejecting(true);
    try {
      await recruiterAPI.rejectApplication(rejectModalApp.id, { notes: rejectNotes });
      toast.success('Application marked as rejected');
      setApplicants((prev) =>
        prev.map((a) => (a.id === rejectModalApp.id ? { ...a, status: 'REJECTED', notes: rejectNotes } : a))
      );
      setRejectModalApp(null);
      setRejectNotes('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject applicant');
    } finally {
      setRejecting(false);
    }
  };

  const handleConfirmInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewModalApp || !scheduledAt) {
      toast.error('Please pick a date and time');
      return;
    }
    setScheduling(true);
    try {
      await recruiterAPI.scheduleInterview({
        applicationId: interviewModalApp.id,
        scheduledAt,
        venue,
        interviewType,
      });
      toast.success('Interview scheduled successfully');
      setInterviewModalApp(null);
      setScheduledAt('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setScheduling(false);
    }
  };

  const filteredApplicants = applicants.filter((a) => {
    const matchesStatus = filterStatus === 'ALL' || a.status?.toUpperCase() === filterStatus;
    const matchesSearch =
      !searchTerm.trim() ||
      a.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.branch?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return <LoadingSpinner size="lg" label="PARSING REGISTERED CANDIDATES..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link
            to="/recruiter/jobs"
            className="p-3 border-2 border-black bg-canvas hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_#0A0A0A]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-0.5">
              // CANDIDATE SCREENING DESK
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
              JOB APPLICANTS REGISTER
            </h1>
            <p className="font-mono text-xs text-gray-700 font-bold mt-0.5">
              Review filed resumes, inspect academic credentials, and advance candidates to interviews.
            </p>
          </div>
        </div>

        <div className="font-mono text-xs font-black bg-yellow-300 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#0A0A0A] self-start sm:self-auto">
          TOTAL CANDIDATES: {applicants.length}
        </div>
      </div>

      {/* Filters and search */}
      <div className="card flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-black" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate name, USN roll number, or engineering branch..."
            className="input-field pl-10 text-xs font-mono"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input-field text-xs font-mono font-bold w-full md:w-56"
        >
          <option value="ALL">ALL PIPELINE STAGES</option>
          <option value="APPLIED">APPLIED (NEW)</option>
          <option value="SHORTLISTED">SHORTLISTED</option>
          <option value="SELECTED">SELECTED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {/* Applicants Table */}
      {filteredApplicants.length > 0 ? (
        <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-canvas border-b-2 border-black font-black text-black uppercase">
                  <th className="px-6 py-4">CANDIDATE & IDENTIFIER</th>
                  <th className="px-6 py-4">BRANCH</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">RESUME ARCHIVE</th>
                  <th className="px-6 py-4">PIPELINE STATUS</th>
                  <th className="px-6 py-4 text-right">EVALUATION ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-canvas transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-heading font-black text-sm uppercase text-black">{app.studentName || 'STUDENT'}</p>
                        <p className="font-mono text-[10px] text-gray-700 font-bold uppercase mt-0.5">{app.rollNumber} • {app.studentEmail}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-black whitespace-nowrap">
                      {app.branch || 'GENERAL'}
                    </td>

                    <td className="px-6 py-4 font-black text-black whitespace-nowrap">
                      {app.cgpa ? `${app.cgpa.toFixed(2)} / 10.0` : 'N/A'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center space-x-1.5 font-mono text-xs font-black text-cobalt hover:text-black uppercase underline"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>INSPECT PDF</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="font-mono text-[10px] text-gray-400 italic">NOT SUBMITTED</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status || 'APPLIED'} />
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap space-x-2 font-bold">
                      {app.status?.toUpperCase() !== 'SHORTLISTED' && app.status?.toUpperCase() !== 'SELECTED' && (
                        <button
                          onClick={() => handleShortlist(app.id)}
                          className="btn-secondary text-xs py-1.5 px-3 text-emerald-800 border-2 border-black hover:bg-emerald-100"
                          title="Shortlist applicant"
                        >
                          <CheckCircle className="h-3.5 w-3.5 inline mr-1" />
                          <span>SHORTLIST</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setInterviewModalApp(app);
                          setScheduledAt(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
                        }}
                        className="btn-primary text-xs py-1.5 px-3"
                        title="Schedule an evaluation round"
                      >
                        <Calendar className="h-3.5 w-3.5 inline mr-1" />
                        <span>SCHEDULE</span>
                      </button>

                      {app.status?.toUpperCase() !== 'REJECTED' && (
                        <button
                          onClick={() => setRejectModalApp(app)}
                          className="btn-secondary text-xs py-1.5 px-2.5 text-red-600 hover:text-black hover:bg-red-100 border-2 border-black"
                          title="Reject application"
                        >
                          <XCircle className="h-3.5 w-3.5 inline" />
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
          icon={Users}
          title="NO REGISTERED CANDIDATES"
          description="There are currently no applicants matching your filters for this campus vacancy."
        />
      )}

      {/* Reject Modal */}
      {rejectModalApp && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full p-6 space-y-4 shadow-brutal-lg">
            <h3 className="font-heading font-black text-base uppercase text-black">
              REJECT CANDIDACY: {rejectModalApp.studentName}
            </h3>
            <p className="font-mono text-xs text-gray-700 font-bold">
              Record internal feedback or justification notes regarding this candidate rejection:
            </p>
            <textarea
              rows={3}
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="e.g. Candidate lacked proficiency in required Spring Boot architectural concepts..."
              className="input-field text-xs font-mono"
            />
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalApp(null)}
                className="btn-secondary text-xs px-4 py-2 font-mono font-bold"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={rejecting}
                className="btn-primary text-xs px-4 py-2 bg-red-600 hover:bg-black font-mono font-bold"
              >
                {rejecting ? 'RECORDING...' : 'CONFIRM DISQUALIFICATION'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {interviewModalApp && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-md w-full p-6 space-y-4 shadow-brutal-lg">
            <h3 className="font-heading font-black text-base uppercase text-black">
              SCHEDULE EVALUATION: {interviewModalApp.studentName}
            </h3>
            <form onSubmit={handleConfirmInterview} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  INTERVIEW DATE & TIME *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="input-field text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  ROUND IDENTIFIER *
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="input-field text-xs font-mono font-bold"
                >
                  <option value="Technical Round 1">Technical Round 1</option>
                  <option value="Technical Round 2">Technical Round 2</option>
                  <option value="Managerial Assessment">Managerial Assessment</option>
                  <option value="HR Panel Discussion">HR Panel Discussion</option>
                  <option value="Final Offer Discussion">Final Offer Discussion</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  VENUE / MEETING URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://meet.google.com/xyz or Placement Hall C"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="input-field text-xs font-mono font-bold"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setInterviewModalApp(null)}
                  className="btn-secondary text-xs px-4 py-2 font-mono font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="btn-primary text-xs px-4 py-2 font-mono font-bold"
                >
                  {scheduling ? 'TRANSMITTING...' : 'DISPATCH INVITE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
