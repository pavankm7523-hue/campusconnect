import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';
import { studentAPI } from '../../services/api';
import { Job, EligibilityResult } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const [jobRes, eligRes] = await Promise.allSettled([
        studentAPI.getJobById(jobId),
        studentAPI.checkEligibility(jobId),
      ]);

      if (jobRes.status === 'fulfilled') {
        const jData = jobRes.value.data?.data || jobRes.value.data;
        setJob(jData);
      }

      if (eligRes.status === 'fulfilled') {
        const eData = eligRes.value.data?.data || eligRes.value.data;
        setEligibility(eData);
      }
    } catch {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    try {
      await studentAPI.applyForJob(job.id);
      toast.success('Application submitted successfully!');
      setJob({ ...job, applied: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" label="EVALUATING DRIVE CRITERIA..." />;
  }

  if (!job) {
    return (
      <div className="bg-white border-2 border-black p-12 text-center shadow-brutal max-w-xl mx-auto">
        <h2 className="font-heading font-black text-xl text-black uppercase">OPPORTUNITY NOT LOCATED</h2>
        <p className="font-mono text-xs text-gray-600 mt-2">The specified placement drive ID is either invalid or decommissioned.</p>
        <Link to="/student/jobs" className="btn-primary mt-6 inline-block text-xs">
          RETURN TO DIRECTORY
        </Link>
      </div>
    );
  }

  const isEligible = eligibility !== null ? eligibility.eligible : job.eligible;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 font-mono text-xs font-black text-black hover:text-cobalt uppercase"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>← RETURN TO DRIVE DIRECTORY</span>
      </button>

      {/* Main Job Banner */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-brutal">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-black">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 bg-black text-white border-2 border-black shadow-[3px_3px_0px_#0038FF] flex items-center justify-center flex-shrink-0">
              <Building2 className="h-7 w-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
                  {job.title}
                </h1>
                <StatusBadge status={job.status || 'OPEN'} />
              </div>
              <p className="font-mono text-sm text-cobalt font-black uppercase mt-1">
                {job.companyName}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-3 font-mono text-xs text-gray-700 font-bold">
                <span className="flex items-center space-x-1.5 bg-canvas border border-black px-2 py-0.5">
                  <MapPin className="h-3.5 w-3.5 text-black" />
                  <span>{job.location || 'PAN-INDIA'}</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-canvas border border-black px-2 py-0.5">
                  <DollarSign className="h-3.5 w-3.5 text-black" />
                  <span className="text-black font-black">{job.packageOffered || 'STANDARD CTC'}</span>
                </span>
                <span className="flex items-center space-x-1.5 bg-canvas border border-black px-2 py-0.5">
                  <Briefcase className="h-3.5 w-3.5 text-black" />
                  <span>{job.jobType || 'FULL TIME'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2.5">
            {job.applied ? (
              <span className="badge-blue text-xs px-4 py-2 font-black">
                CANDIDACY RECORDED
              </span>
            ) : (
              <button
                onClick={handleApply}
                disabled={!isEligible || applying || job.status === 'CLOSED'}
                className="btn-primary px-6 py-3 text-xs"
              >
                {applying ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                    <span>TRANSMITTING...</span>
                  </div>
                ) : (
                  <span>APPLY FOR DRIVE</span>
                )}
              </button>
            )}

            {!isEligible && !job.applied && (
              <p className="font-mono text-[10px] font-black text-red-600 uppercase text-left sm:text-right max-w-xs">
                [LOCKED] ACADEMIC ELIGIBILITY THRESHOLD NOT CLEARED
              </p>
            )}
          </div>
        </div>

        {/* Quick specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="p-3 bg-canvas border-2 border-black">
            <span className="font-mono text-[10px] font-black text-gray-600 uppercase block">MINIMUM CGPA</span>
            <p className="font-mono text-base font-black text-black mt-0.5">
              {job.minCgpa ? `${job.minCgpa.toFixed(2)} / 10.0` : 'OPEN'}
            </p>
          </div>

          <div className="p-3 bg-canvas border-2 border-black">
            <span className="font-mono text-[10px] font-black text-gray-600 uppercase block">OPEN SEATS</span>
            <p className="font-mono text-base font-black text-black mt-0.5">
              {job.totalPositions || 'UNLIMITED'}
            </p>
          </div>

          <div className="p-3 bg-canvas border-2 border-black">
            <span className="font-mono text-[10px] font-black text-gray-600 uppercase block">APPLICATION DEADLINE</span>
            <p className="font-mono text-sm font-black text-red-600 mt-0.5">
              {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'ROLLING'}
            </p>
          </div>

          <div className="p-3 bg-canvas border-2 border-black">
            <span className="font-mono text-[10px] font-black text-gray-600 uppercase block">DRIVE STATUS</span>
            <p className="font-mono text-base font-black text-black mt-0.5">
              {job.status || 'ACTIVE'}
            </p>
          </div>
        </div>
      </div>

      {/* Eligibility Evaluation Banner */}
      <div className={`p-6 border-2 border-black shadow-brutal ${isEligible ? 'bg-emerald-100' : 'bg-red-100'}`}>
        <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-4">
          <div className="flex items-center space-x-2.5">
            {isEligible ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-900" />
            ) : (
              <XCircle className="h-5 w-5 text-red-900" />
            )}
            <h3 className="font-heading font-black text-sm uppercase text-black">
              AUTOMATED ELIGIBILITY AUDIT: {isEligible ? 'VERIFIED MATCH' : 'DISQUALIFIED'}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <span className="font-black text-black uppercase block mb-1.5">// SATISFIED BENCHMARKS:</span>
            {eligibility?.satisfiedCriteria && eligibility.satisfiedCriteria.length > 0 ? (
              <ul className="space-y-1.5">
                {eligibility.satisfiedCriteria.map((c, i) => (
                  <li key={i} className="flex items-center space-x-2 text-emerald-900 font-bold bg-white/70 p-1.5 border border-black">
                    <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-800" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 italic">No passed benchmarks cataloged.</p>
            )}
          </div>

          <div>
            <span className="font-black text-black uppercase block mb-1.5">// DEFICIENT BENCHMARKS:</span>
            {eligibility?.failedCriteria && eligibility.failedCriteria.length > 0 ? (
              <ul className="space-y-1.5">
                {eligibility.failedCriteria.map((c, i) => (
                  <li key={i} className="flex items-center space-x-2 text-red-900 font-bold bg-white/70 p-1.5 border border-black">
                    <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-800" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-emerald-950 font-black bg-white/80 p-2 border border-black">ALL ACADEMIC CRITERIA SATISFIED</p>
            )}
          </div>
        </div>
      </div>

      {/* Job Description & Requirements */}
      <div className="card space-y-6">
        <div>
          <h2 className="font-heading font-black text-sm uppercase text-black border-b-2 border-black pb-2 mb-3">
            ROLE SPECIFICATION & RESPONSIBILITIES
          </h2>
          <div className="text-xs font-sans text-charcoal leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>

        <div>
          <h2 className="font-heading font-black text-sm uppercase text-black border-b-2 border-black pb-2 mb-3">
            ELIGIBLE ENGINEERING BRANCHES
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.eligibleBranches && job.eligibleBranches.length > 0 ? (
              job.eligibleBranches.map((branch) => (
                <span key={branch} className="px-3 py-1 font-mono text-xs font-black uppercase bg-canvas text-black border-2 border-black shadow-[2px_2px_0px_#0A0A0A]">
                  {branch}
                </span>
              ))
            ) : (
              <span className="font-mono text-xs text-gray-500">OPEN TO ALL ACADEMIC BRANCHES</span>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-heading font-black text-sm uppercase text-black border-b-2 border-black pb-2 mb-3">
            ELIGIBLE GRADUATION BATCHES
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.eligibleGraduationYears && job.eligibleGraduationYears.length > 0 ? (
              job.eligibleGraduationYears.map((year) => (
                <span key={year} className="px-3 py-1 font-mono text-xs font-black uppercase bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0px_#0A0A0A]">
                  CLASS OF {year}
                </span>
              ))
            ) : (
              <span className="font-mono text-xs text-gray-500">ALL PASSING BATCHES</span>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-heading font-black text-sm uppercase text-black border-b-2 border-black pb-2 mb-3">
            REQUIRED TECHNICAL PROFICIENCIES
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills && job.requiredSkills.length > 0 ? (
              job.requiredSkills.map((skill) => (
                <span key={skill} className="px-3 py-1 font-mono text-xs font-black uppercase bg-canvas text-black border-2 border-black shadow-[2px_2px_0px_#0A0A0A]">
                  {skill}
                </span>
              ))
            ) : (
              <span className="font-mono text-xs text-gray-500">NO EXPLICIT SKILL PREREQUISITES</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
