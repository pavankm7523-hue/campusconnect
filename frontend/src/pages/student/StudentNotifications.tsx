import { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentAPI } from '../../services/api';
import { Notification } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getNotifications();
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await studentAPI.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      await studentAPI.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All dispatches cleared');
    } catch {
      toast.error('Failed to mark all as read');
    } finally {
      setActionLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return <LoadingSpinner size="lg" label="SYNCHRONIZING SYSTEM DISPATCHES..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
              DISPATCHES
            </h1>
            {unreadCount > 0 && (
              <span className="font-mono text-xs font-black bg-yellow-300 text-black border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#0A0A0A]">
                {unreadCount} UNREAD
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-gray-700 font-bold mt-1">
            Recruitment cycle announcements, shortlist dispatches, and schedule releases.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={actionLoading}
            className="btn-secondary text-xs px-4 py-2.5 flex items-center space-x-2 self-start sm:self-auto font-mono"
          >
            <CheckCheck className="h-4 w-4 text-black" />
            <span>MARK ALL READ</span>
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="bg-white border-2 border-black shadow-brutal divide-y-2 divide-black overflow-hidden">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.read && handleMarkAsRead(item.id)}
              className={`p-5 flex items-start space-x-4 transition-colors cursor-pointer ${
                item.read ? 'bg-white hover:bg-canvas' : 'bg-yellow-50 hover:bg-yellow-100/70 border-l-4 border-l-cobalt'
              }`}
            >
              <div
                className={`p-2.5 border-2 border-black flex-shrink-0 ${
                  item.read ? 'bg-canvas text-black' : 'bg-black text-white shadow-[2px_2px_0px_#0038FF]'
                }`}
              >
                <Bell className="h-5 w-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm uppercase font-heading ${item.read ? 'font-bold text-black' : 'font-black text-cobalt'}`}>
                    {item.title}
                  </h4>
                  <span className="font-mono text-[10px] font-bold text-gray-600 bg-canvas px-2 py-0.5 border border-black whitespace-nowrap">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'RECENT'}
                  </span>
                </div>

                <p className="text-xs text-charcoal font-medium mt-1 leading-relaxed font-sans">{item.message}</p>

                {!item.read && (
                  <span className="inline-block mt-2 font-mono text-[10px] font-black uppercase text-black bg-yellow-300 px-2 py-0.5 border border-black">
                    CLICK TO ACKNOWLEDGE
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="NO ACTIVE DISPATCHES"
          description="Your dispatch register is cleared. Future placement directives and schedules will appear here."
        />
      )}
    </div>
  );
}
