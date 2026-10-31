import { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Building2 
} from 'lucide-react';
import { studentAPI } from '../../services/api';
import { Interview } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function StudentInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getInterviews();
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
  };

  const now = new Date();
  const upcomingList = interviews.filter((item) => new Date(item.scheduledAt) >= now);
  const pastList = interviews.filter((item) => new Date(item.scheduledAt) < now);

  const displayedList = activeTab === 'UPCOMING' ? upcomingList : pastList;

  if (loading) {
    return <LoadingSpinner size="lg" label="RETRIEVING INTERVIEW SCHEDULES..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
            // ASSESSMENT SESSIONS
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
            INTERVIEW ROSTER
          </h1>
          <p className="font-mono text-xs text-gray-700 font-bold mt-1">
            Track technical assessments, HR evaluation panels, and corporate interviewer feedback.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-2 border-black p-1 bg-canvas shadow-[2px_2px_0px_#0A0A0A] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('UPCOMING')}
            className={`px-4 py-2 font-mono text-xs font-black uppercase transition-all ${
              activeTab === 'UPCOMING'
                ? 'bg-black text-white shadow-[2px_2px_0px_#0038FF]'
                : 'text-black hover:bg-white'
            }`}
          >
            UPCOMING ({upcomingList.length})
          </button>
          <button
            onClick={() => setActiveTab('PAST')}
            className={`px-4 py-2 font-mono text-xs font-black uppercase transition-all ${
              activeTab === 'PAST'
                ? 'bg-black text-white shadow-[2px_2px_0px_#0038FF]'
                : 'text-black hover:bg-white'
            }`}
          >
            CONCLUDED ({pastList.length})
          </button>
        </div>
      </div>

      {/* Interviews Grid */}
      {displayedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedList.map((interview) => (
            <div
              key={interview.id}
              className="bg-white border-2 border-black p-6 shadow-brutal space-y-4"
            >
              <div className="flex items-start justify-between border-b-2 border-black pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-bold border border-black shadow-[2px_2px_0px_#0038FF]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-base uppercase text-black">{interview.jobTitle}</h3>
                    <p className="font-mono text-xs text-gray-700 font-bold uppercase">{interview.companyName}</p>
                  </div>
                </div>
                <StatusBadge status={interview.outcome || 'SCHEDULED'} />
              </div>

              <div className="bg-canvas border border-black p-3.5 space-y-2 font-mono text-xs font-bold">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-gray-600">
                    <Calendar className="h-4 w-4 text-black" />
                    <span>TIMING</span>
                  </span>
                  <span className="text-black font-black">
                    {new Date(interview.scheduledAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-gray-600">
                    <MapPin className="h-4 w-4 text-black" />
                    <span>VENUE / URL</span>
                  </span>
                  <span className="text-black font-black truncate max-w-[200px]">
                    {interview.venue || 'VIRTUAL (GOOGLE MEET)'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-gray-600">
                    <Clock className="h-4 w-4 text-black" />
                    <span>ROUND TYPE</span>
                  </span>
                  <span className="text-black font-black uppercase">{interview.interviewType || 'TECHNICAL REVIEW'}</span>
                </div>
              </div>

              {interview.interviewerNotes && (
                <div className="text-xs p-3 bg-yellow-100 border border-black text-black font-mono">
                  <span className="font-black uppercase block mb-1">// INTERVIEWER EVALUATION NOTES:</span>
                  <p>{interview.interviewerNotes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title={`NO ${activeTab} INTERVIEWS`}
          description={
            activeTab === 'UPCOMING'
              ? 'No corporate assessment sessions are scheduled for your active candidacies.'
              : 'You have not attended any corporate interview sessions yet.'
          }
        />
      )}
    </div>
  );
}
