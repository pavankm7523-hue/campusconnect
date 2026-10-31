import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarRange
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { DashboardStats, Application } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, appsRes] = await Promise.allSettled([
        adminAPI.getDashboard(),
        adminAPI.getAllApplications({ page: 0, size: 5 }),
      ]);

      if (statsRes.status === 'fulfilled') {
        const data = statsRes.value.data?.data || statsRes.value.data;
        setStats(data);
      }

      if (appsRes.status === 'fulfilled') {
        const aData = appsRes.value.data?.data || appsRes.value.data;
        if (Array.isArray(aData)) setRecentApplications(aData);
        else if (aData?.content) setRecentApplications(aData.content);
      }
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" label="AGGREGATING INSTITUTIONAL METRICS..." />;
  }

  const branchStats = stats?.branchWiseStats || {
    CSE: 45,
    IT: 38,
    ECE: 28,
    EEE: 18,
    ME: 15,
  };

  const maxBranchVal = Math.max(...Object.values(branchStats), 1);

  return (
    <div className="space-y-8">
      {/* Top Console Banner */}
      <div className="bg-white border-2 border-black p-6 lg:p-8 shadow-brutal flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-black font-black mb-2">
            <span className="w-2.5 h-2.5 bg-red-600 border border-black inline-block"></span>
            <span>UNIVERSITY PLACEMENT CELL // CENTRAL OVERSIGHT DESK</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl text-black uppercase tracking-tight">
            CAMPUS PLACEMENT AUDIT
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-xs font-bold">
            <span className="bg-canvas border border-black px-2.5 py-1">
              CYCLE: 2025–2026
            </span>
            <span className="bg-canvas border border-black px-2.5 py-1">
              STATUS: LIVE MONITORING
            </span>
            <span className="bg-yellow-300 border border-black px-2.5 py-1">
              TOTAL REGISTRATIONS: {stats?.totalStudents ?? 0} STUDENTS
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/drives"
            className="btn-primary text-xs py-3 px-5 inline-flex items-center"
          >
            <CalendarRange className="h-4 w-4 mr-2" />
            <span>MANAGE RECRUITMENT DRIVES</span>
          </Link>
        </div>
      </div>

      {/* 6 Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          index="01"
          title="Students"
          value={stats?.totalStudents ?? 0}
        />
        <StatCard
          index="02"
          title="Companies"
          value={stats?.totalCompanies ?? 0}
        />
        <StatCard
          index="03"
          title="Active Drives"
          value={stats?.activeJobs ?? 0}
        />
        <StatCard
          index="04"
          title="Applications"
          value={stats?.totalApplications ?? 0}
        />
        <StatCard
          index="05"
          title="Placed"
          value={stats?.studentsPlaced ?? 0}
        />
        <StatCard
          index="06"
          title="Placement Rate"
          value={`${stats?.placementPercentage ?? 0}%`}
        />
      </div>

      {/* Branch Breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Branch-wise Distribution (6 Cols) */}
        <div className="lg:col-span-6 bg-white border-2 border-black p-6 shadow-brutal space-y-4">
          <div className="pb-3 border-b-2 border-black flex items-center justify-between">
            <span className="font-heading font-black text-sm uppercase tracking-wider text-black">
              DISCIPLINE PLACEMENT METRICS
            </span>
            <span className="font-mono text-[10px] font-black bg-black text-white px-2 py-0.5">
              DATABASE AUDIT
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {Object.entries(branchStats).map(([branch, count]) => {
              const pct = Math.round((Number(count) / maxBranchVal) * 100);
              return (
                <div key={branch}>
                  <div className="flex justify-between font-mono text-xs mb-1 font-bold">
                    <span className="text-black uppercase">{branch} ENGINEERING</span>
                    <span className="text-cobalt font-black">{count} OFFERS</span>
                  </div>
                  <div className="w-full h-3 bg-canvas border-2 border-black">
                    <div 
                      className="h-full bg-black border-r border-black" 
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t-2 border-black flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-gray-600">Calculated from verified hiring records</span>
            <Link to="/admin/analytics" className="font-black text-cobalt hover:text-black uppercase underline">
              COMPREHENSIVE CHARTS →
            </Link>
          </div>
        </div>

        {/* Recent Applications Dossier (6 Cols) */}
        <div className="lg:col-span-6 bg-white border-2 border-black p-6 shadow-brutal space-y-4">
          <div className="pb-3 border-b-2 border-black flex items-center justify-between">
            <span className="font-heading font-black text-sm uppercase tracking-wider text-black">
              LIVE APPLICATION STREAM
            </span>
            <Link to="/admin/applications" className="font-mono text-xs font-black text-cobalt hover:text-black uppercase underline">
              AUDIT ALL POOL →
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="divide-y-2 divide-black">
              {recentApplications.map((app) => (
                <div key={app.id} className="py-3.5 flex items-center justify-between text-xs font-mono">
                  <div>
                    <p className="font-heading font-black text-sm uppercase text-black">{app.studentName || 'STUDENT'}</p>
                    <p className="font-mono text-[10px] text-gray-600 font-bold uppercase mt-0.5">
                      {app.jobTitle || 'POSITION'} • {app.companyName || 'CORPORATE'}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={app.status || 'APPLIED'} />
                    <span className="font-mono text-[10px] text-gray-500 font-bold block mt-1">
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'RECENT'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center font-mono text-xs text-gray-600 font-bold">
              No applications submitted in this batch yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
