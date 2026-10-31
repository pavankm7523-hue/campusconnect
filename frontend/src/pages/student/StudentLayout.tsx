import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCircle, 
  Briefcase, 
  FileText, 
  Calendar, 
  Award, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    studentAPI.getUnreadCount()
      .then((res) => {
        const count = typeof res.data === 'number' ? res.data : (res.data?.data ?? res.data?.unreadCount ?? 0);
        setUnreadCount(count);
      })
      .catch(() => {
        // Silently ignore
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', to: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', to: '/student/profile', icon: UserCircle },
    { name: 'Browse Jobs', to: '/student/jobs', icon: Briefcase },
    { name: 'My Applications', to: '/student/applications', icon: FileText },
    { name: 'Interviews', to: '/student/interviews', icon: Calendar },
    { name: 'Placement Result', to: '/student/placement', icon: Award },
    { 
      name: 'Notifications', 
      to: '/student/notifications', 
      icon: Bell, 
      badge: unreadCount > 0 ? unreadCount : undefined 
    },
  ];

  return (
    <div className="min-h-screen bg-canvas text-charcoal flex flex-col md:flex-row font-sans selection:bg-cobalt selection:text-white">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b-2 border-black px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-heading font-black text-sm border-2 border-black shadow-[2px_2px_0px_#0038FF]">
            CC
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-sm tracking-tight text-black">CampusConnect</span>
            <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-cobalt">[STUDENT CONSOLE]</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 border-2 border-black bg-white hover:bg-canvas shadow-brutal transition-all"
        >
          {mobileMenuOpen ? <X className="h-5 w-5 text-black" /> : <Menu className="h-5 w-5 text-black" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-white border-r-2 border-black flex flex-col justify-between transition-transform duration-200 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-20 px-6 border-b-2 border-black bg-canvas flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-black text-white flex items-center justify-center font-heading font-black text-base border-2 border-black shadow-[2px_2px_0px_#0038FF]">
                CC
              </div>
              <div>
                <span className="font-heading font-black text-base tracking-tight text-black block leading-none">
                  CampusConnect
                </span>
                <span className="font-mono text-[10px] text-charcoal uppercase tracking-wider block font-bold mt-1">
                  STUDENT PORTAL
                </span>
              </div>
            </div>
            <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-black"></span>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5">
            <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest px-3 py-1 font-bold">
              // WORKSPACE
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 text-xs transition-all border-2 ${
                    isActive
                      ? 'border-black bg-cobalt text-white font-bold shadow-[3px_3px_0px_#0A0A0A]'
                      : 'border-transparent text-charcoal font-semibold hover:border-black hover:bg-canvas'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-4 w-4" strokeWidth={2.2} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-yellow-400 text-black border border-black font-black">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Profile & Sign Out Footer */}
        <div className="p-4 border-t-2 border-black bg-canvas">
          <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#0A0A0A] mb-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-wider font-bold">LOGGED IN</span>
              <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-mono font-black uppercase bg-emerald-100 text-emerald-900 border border-black">
                ACTIVE
              </span>
            </div>
            <p className="text-xs font-bold text-black truncate mt-1">{user?.email}</p>
            <div className="flex items-center space-x-1.5 mt-1 text-cobalt font-mono text-[10px] font-black uppercase">
              <ShieldCheck className="w-3 h-3" />
              <span>ROLE: STUDENT</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 text-xs font-bold text-black bg-white hover:bg-red-50 hover:text-red-600 border-2 border-black shadow-[2px_2px_0px_#0A0A0A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all uppercase tracking-wider"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>TERMINATE SESSION</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b-2 border-black px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs font-mono font-bold">
            <span className="text-gray-500">SYS://RECRUITMENT</span>
            <span className="text-black">/</span>
            <span className="text-cobalt uppercase bg-blue-50 px-2 py-1 border border-black">STUDENT CONSOLE</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-mono text-xs font-bold text-black bg-yellow-300 px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#0A0A0A] hidden sm:inline-block">
              CYCLE: 2025–2026
            </span>
          </div>
        </header>

        {/* Route Content Outlet */}
        <div className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
