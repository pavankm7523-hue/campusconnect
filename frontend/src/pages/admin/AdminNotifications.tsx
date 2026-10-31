import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';

export default function AdminNotifications() {
  const [recipientType, setRecipientType] = useState<'BROADCAST_ALL' | 'STUDENTS_ONLY' | 'RECRUITERS_ONLY' | 'INDIVIDUAL'>('BROADCAST_ALL');
  const [targetEmail, setTargetEmail] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [notifType, setNotifType] = useState('INFO');
  const [sending, setSending] = useState(false);

  // Sent notifications history log
  const [sentHistory, setSentHistory] = useState<Array<{ id: number; title: string; message: string; target: string; date: string }>>([
    {
      id: 1,
      title: 'PHASE 1 PLACEMENT DRIVE REGISTRATIONS OPEN',
      message: 'All final year eligible students must submit their profiles and verify resumes by Friday.',
      target: 'ALL STUDENTS',
      date: new Date().toLocaleDateString(),
    },
    {
      id: 2,
      title: 'CORPORATE ASSESSMENT GUIDELINES 2026',
      message: 'Recruiters are requested to finalize assessment links 48 hours prior to drive start dates.',
      target: 'ALL RECRUITERS',
      date: new Date(Date.now() - 86400000).toLocaleDateString(),
    },
  ]);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required');
      return;
    }

    if (recipientType === 'INDIVIDUAL' && !targetEmail.trim()) {
      toast.error('Please enter the recipient email address');
      return;
    }

    setSending(true);
    try {
      await adminAPI.sendNotification({
        recipientType,
        targetEmail: recipientType === 'INDIVIDUAL' ? targetEmail : undefined,
        title,
        message,
        type: notifType,
      });

      toast.success('Notification dispatched successfully!');

      setSentHistory((prev) => [
        {
          id: Date.now(),
          title,
          message,
          target:
            recipientType === 'BROADCAST_ALL'
              ? 'ALL USERS'
              : recipientType === 'STUDENTS_ONLY'
              ? 'ALL STUDENTS'
              : recipientType === 'RECRUITERS_ONLY'
              ? 'ALL RECRUITERS'
              : targetEmail.toUpperCase(),
          date: new Date().toLocaleDateString(),
        },
        ...prev,
      ]);

      setTitle('');
      setMessage('');
      setTargetEmail('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to dispatch notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal">
        <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
          // BROADCAST COMMUNIQUE DESK
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
          DISPATCH DIRECTIVES
        </h1>
        <p className="font-mono text-xs text-gray-700 font-bold mt-1">
          Publish urgent bulletins, drive alerts, and assessment schedules across user cohorts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="card lg:col-span-2 space-y-5">
          <div className="flex items-center space-x-2 border-b-2 border-black pb-3">
            <Send className="h-5 w-5 text-cobalt" />
            <h3 className="font-heading font-black text-base uppercase text-black">COMPOSE COMMUNIQUE</h3>
          </div>

          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-2">
                RECIPIENT TARGET AUDIENCE *
              </label>
              <div className="grid grid-cols-2 gap-2.5 text-xs font-mono font-bold">
                <button
                  type="button"
                  onClick={() => setRecipientType('BROADCAST_ALL')}
                  className={`p-3 border-2 border-black text-left transition-all ${
                    recipientType === 'BROADCAST_ALL'
                      ? 'bg-cobalt text-white shadow-[2px_2px_0px_#0A0A0A]'
                      : 'bg-canvas hover:bg-white text-black'
                  }`}
                >
                  <p className="font-black">BROADCAST ALL</p>
                  <p className="text-[10px] opacity-80">Students & Recruiters</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRecipientType('STUDENTS_ONLY')}
                  className={`p-3 border-2 border-black text-left transition-all ${
                    recipientType === 'STUDENTS_ONLY'
                      ? 'bg-cobalt text-white shadow-[2px_2px_0px_#0A0A0A]'
                      : 'bg-canvas hover:bg-white text-black'
                  }`}
                >
                  <p className="font-black">STUDENTS ONLY</p>
                  <p className="text-[10px] opacity-80">All Candidate Batches</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRecipientType('RECRUITERS_ONLY')}
                  className={`p-3 border-2 border-black text-left transition-all ${
                    recipientType === 'RECRUITERS_ONLY'
                      ? 'bg-cobalt text-white shadow-[2px_2px_0px_#0A0A0A]'
                      : 'bg-canvas hover:bg-white text-black'
                  }`}
                >
                  <p className="font-black">RECRUITERS ONLY</p>
                  <p className="text-[10px] opacity-80">Enterprise Hiring Leads</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRecipientType('INDIVIDUAL')}
                  className={`p-3 border-2 border-black text-left transition-all ${
                    recipientType === 'INDIVIDUAL'
                      ? 'bg-cobalt text-white shadow-[2px_2px_0px_#0A0A0A]'
                      : 'bg-canvas hover:bg-white text-black'
                  }`}
                >
                  <p className="font-black">SPECIFIC ACCOUNT</p>
                  <p className="text-[10px] opacity-80">Target User Email</p>
                </button>
              </div>
            </div>

            {recipientType === 'INDIVIDUAL' && (
              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  RECIPIENT EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  placeholder="student@university.edu or recruiter@enterprise.com"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  className="input-field text-xs font-mono font-bold"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  COMMUNIQUE HEADLINE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Confirmation for Microsoft Drive"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                  PRIORITY LEVEL
                </label>
                <select
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value)}
                  className="input-field text-xs font-mono font-bold"
                >
                  <option value="INFO">GENERAL INFORMATION</option>
                  <option value="ALERT">URGENT ACTION MANDATE</option>
                  <option value="DRIVE">NEW DRIVE NOTICE</option>
                  <option value="INTERVIEW">INTERVIEW SCHEDULE UPDATE</option>
                  <option value="OFFER">PLACEMENT RESULT PUBLICATION</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1">
                MESSAGE BODY *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Compose directive to be broadcasted to user dashboard dispatches..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="input-field text-xs font-sans leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={sending}
                className="w-full btn-primary py-3 text-xs flex items-center justify-center space-x-2 font-mono"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>TRANSMITTING DIRECTIVE...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>DISPATCH ANNOUNCEMENT</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Recently Sent Announcements Log */}
        <div className="card space-y-4">
          <div className="flex items-center space-x-2 border-b-2 border-black pb-3">
            <Bell className="h-5 w-5 text-black" />
            <h3 className="font-heading font-black text-sm uppercase text-black">DISPATCH REGISTER</h3>
          </div>

          <div className="divide-y-2 divide-black text-xs font-mono">
            {sentHistory.map((item) => (
              <div key={item.id} className="py-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-xs uppercase text-black truncate max-w-[150px]">{item.title}</span>
                  <span className="font-mono text-[9px] text-gray-600 font-bold bg-canvas px-1.5 py-0.5 border border-black">{item.date}</span>
                </div>
                <p className="text-gray-700 text-xs font-sans line-clamp-2">{item.message}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[9px] font-black uppercase text-cobalt bg-blue-50 px-2 py-0.5 border border-black">
                    TARGET: {item.target}
                  </span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
