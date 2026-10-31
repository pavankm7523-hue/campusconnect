import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  Calendar, 
  LogOut, 
  Menu, 
  X,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { recruiterAPI } from '../../services/api';
import { RecruiterProfile } from '../../types';

export default function RecruiterLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);

  useEffect(() => {
    recruiterAPI.getProfile()
      .then((res) => {
        const data = res.data?.data || res.data;
        if (data) setProfile(data);
      })
      .catch(() => {
        // Silently continue
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', to: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Job Openings', to: '/recruiter/jobs', icon: Briefcase },
    { name: 'Post Opening', to: '/recruiter/jobs/create', icon: PlusCircle },
    { name: 'Interviews & Schedules', to: '/recruiter/interviews', icon: Calendar },
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
            <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-cobalt">[RECRUITER DESK]</span>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 border-2 border-black bg-white hover:bg-canvas shadow-brutal transition-all"
        >
          {mobileMenuOpen ? <X className="h-5 w-5 text-black" /> : <Menu className="h-5 w-5 text-black" />}
        </button>
      </div>

      {/* Sidebar */}
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
                  RECRUITER DESK
                </span>
              </div>
            </div>
            <span className="w-2.5 h-2.5 bg-cobalt border-2 border-black"></span>
          </div>

          {/* Company Badge Card */}
          <div className="p-3.5 mx-4 mt-4 bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_#0A0A0A]">
            <span className="font-mono text-[9px] text-black uppercase tracking-wider block font-black">
              // AFFILIATED ENTERPRISE
            </span>
            <p className="font-heading font-black text-sm uppercase text-black truncate mt-0.5">
              {profile?.companyName || 'CORPORATE PARTNER'}
            </p>
            <div className="flex items-center space-x-1 mt-1 font-mono text-[10px] font-black text-emerald-950 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VERIFIED HIRING DESK</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5">
            <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest px-3 py-1 font-bold">
              // MANAGEMENT
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 text-xs transition-all border-2 ${
                    isActive
                      ? 'border-black bg-cobalt text-white font-bold shadow-[3px_3px_0px_#0A0A0A]'
                      : 'border-transparent text-charcoal font-semibold hover:border-black hover:bg-canvas'
                  }`
                }
              >
                <item.icon className="h-4 w-4" strokeWidth={2.2} />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-black bg-canvas">
          <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#0A0A0A] mb-3">
            <span className="font-mono text-[9px] text-gray-500 uppercase tracking-wider font-bold block">
              TALENT LEAD
            </span>
            <p className="text-xs font-bold text-black truncate mt-0.5">
              {profile?.fullName || user?.email}
            </p>
            <span className="font-mono text-[10px] text-cobalt font-black uppercase block mt-1">
              ROLE: RECRUITER
            </span>
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

      {/* Main Workspace */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b-2 border-black px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs font-mono font-bold">
            <span className="text-gray-500">SYS://TALENT</span>
            <span className="text-black">/</span>
            <span className="text-cobalt uppercase bg-blue-50 px-2 py-1 border border-black">RECRUITER WORKSPACE</span>
          </div>
          <div className="font-mono text-xs font-bold text-black bg-canvas px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#0A0A0A] hidden sm:inline-block">
            ENTERPRISE TALENT ACQUISITION
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
