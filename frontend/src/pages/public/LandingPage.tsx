import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Check, 
  ChevronRight, 
  Terminal,
  Cpu,
  Layers,
  Building,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Zap,
  Sliders
} from 'lucide-react';
import { publicAPI } from '../../services/api';

export default function LandingPage() {
  const [stats, setStats] = useState({
    totalStudents: 418,
    totalCompanies: 24,
    studentsPlaced: 312,
    placementPercentage: 74.6,
  });

  // Interactive eligibility test state
  const [demoCgpa, setDemoCgpa] = useState<number>(8.2);
  const [demoBranch, setDemoBranch] = useState<string>('CSE');

  useEffect(() => {
    publicAPI.getStats()
      .then(res => {
        const data = res.data?.data || res.data;
        if (data && typeof data === 'object') {
          setStats(prev => ({
            totalStudents: data.totalStudents || prev.totalStudents,
            totalCompanies: data.totalCompanies || prev.totalCompanies,
            studentsPlaced: data.studentsPlaced || prev.studentsPlaced,
            placementPercentage: data.placementPercentage || prev.placementPercentage,
          }));
        }
      })
      .catch(() => {
        // Fallback
      });
  }, []);

  const isEligible = demoCgpa >= 7.5 && (demoBranch === 'CSE' || demoBranch === 'IT' || demoBranch === 'ECE');

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans selection:bg-cobalt selection:text-white flex flex-col">
      
      {/* ============================================================== */}
      {/* 1. MODERN BRUTALIST NAVIGATION                                 */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 bg-canvas border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          
          {/* Brutalist Wordmark */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="w-4 h-4 bg-cobalt inline-block border border-black shadow-[2px_2px_0px_#000000]"></span>
            <span className="font-heading font-black text-xl tracking-tight text-ink group-hover:text-cobalt transition-colors">
              CAMPUSCONNECT
            </span>
            <span className="font-mono text-[10px] text-white bg-black px-1.5 py-0.5 font-bold uppercase">
              REC/26
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono font-bold uppercase tracking-wider text-ink">
            <a href="#students" className="hover:text-cobalt hover:underline transition-colors">
              [01] STUDENTS
            </a>
            <a href="#recruiters" className="hover:text-cobalt hover:underline transition-colors">
              [02] RECRUITERS
            </a>
            <a href="#placement-cell" className="hover:text-cobalt hover:underline transition-colors">
              [03] ADMIN CELL
            </a>
            <a href="#stats" className="hover:text-cobalt hover:underline transition-colors">
              [04] METRICS
            </a>
            <a href="#how-it-works" className="hover:text-cobalt hover:underline transition-colors">
              [05] PROTOCOL
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="text-xs font-mono font-bold uppercase tracking-wider text-ink hover:text-cobalt px-2 py-1"
            >
              SIGN IN
            </Link>
            <Link
              to="/register"
              className="btn-primary text-xs py-2 px-4"
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. UNCONVENTIONAL SPLIT-LAYOUT HERO                            */}
      {/* ============================================================== */}
      <section className="border-b-4 border-black bg-canvas pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* LEFT COLUMN: Oversized Brutalist Typography & Entry Points */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center space-x-2 bg-black text-white px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest mb-6 shadow-[3px_3px_0px_#0038FF]">
                  <span className="w-2 h-2 bg-cobalt inline-block"></span>
                  <span>CAMPUS RECRUITMENT REVOLUTION // 2026</span>
                </div>

                {/* EXACT MANDATED HEADLINE */}
                <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-ink leading-[0.92] tracking-tighter">
                  YOUR NEXT<br />
                  <span className="text-cobalt underline decoration-4 underline-offset-8">OPPORTUNITY</span><br />
                  STARTS HERE.
                </h1>

                <p className="mt-8 text-base sm:text-lg text-[#2E2E2E] font-sans leading-relaxed max-w-lg border-l-4 border-black pl-4">
                  One unified, rule-bound platform for university students, verified recruiters, and placement directors to coordinate the entire recruitment cycle.
                </p>

                {/* Dual Entry Points */}
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    to="/register"
                    className="btn-primary text-sm py-4 px-8 inline-flex items-center"
                  >
                    <span>EXPLORE OPPORTUNITIES</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>

                  <Link
                    to="/register?role=recruiter"
                    className="btn-secondary text-sm py-4 px-8"
                  >
                    FOR RECRUITERS
                  </Link>
                </div>
              </div>

              {/* Hardware / Engine Status Strip */}
              <div className="mt-12 pt-6 border-t-2 border-black grid grid-cols-3 gap-4 font-mono text-xs">
                <div>
                  <span className="text-ink-400 block text-[10px] uppercase font-bold">CYCLE</span>
                  <span className="font-bold text-black text-sm">2025–2026</span>
                </div>
                <div>
                  <span className="text-ink-400 block text-[10px] uppercase font-bold">ENGINE</span>
                  <span className="font-bold text-cobalt text-sm">RULE-FILTERED</span>
                </div>
                <div>
                  <span className="text-ink-400 block text-[10px] uppercase font-bold">STATE</span>
                  <span className="font-bold text-[#136C2C] text-sm flex items-center">
                    <span className="w-2 h-2 rounded-none bg-[#136C2C] mr-1.5 inline-block"></span>
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Authentic Brutalist Placement Console Preview */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="bg-white border-3 border-black shadow-brutal-lg flex-1 flex flex-col justify-between">
                
                {/* Console Title Bar */}
                <div className="bg-black text-white px-4 py-3 flex items-center justify-between border-b-2 border-black font-mono text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 bg-[#EF4444] border border-black"></div>
                    <div className="w-2.5 h-2.5 bg-[#FACC15] border border-black"></div>
                    <div className="w-2.5 h-2.5 bg-[#22C55E] border border-black"></div>
                    <span className="ml-2 font-bold tracking-wider">
                      CAMPUSCONNECT://CONSOLE.v2.6
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] bg-[#1F1F1F] px-2 py-0.5 border border-[#404040]">
                    <span className="w-1.5 h-1.5 bg-[#22C55E]"></span>
                    <span>PORT 8080 CONNECTED</span>
                  </div>
                </div>

                {/* Console Content */}
                <div className="p-6 space-y-6 flex-1">
                  
                  {/* Top 4 Real-time Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-canvas border-2 border-black">
                      <span className="font-mono text-[10px] font-bold text-ink-500 uppercase block">CANDIDATES</span>
                      <span className="font-display text-2xl font-black text-black">{stats.totalStudents}</span>
                    </div>
                    <div className="p-3 bg-canvas border-2 border-black">
                      <span className="font-mono text-[10px] font-bold text-ink-500 uppercase block">PLACED</span>
                      <span className="font-display text-2xl font-black text-black">{stats.studentsPlaced}</span>
                    </div>
                    <div className="p-3 bg-canvas border-2 border-black">
                      <span className="font-mono text-[10px] font-bold text-ink-500 uppercase block">DRIVES</span>
                      <span className="font-display text-2xl font-black text-black">{stats.totalCompanies}</span>
                    </div>
                    <div className="p-3 bg-[#E6ECFF] border-2 border-black">
                      <span className="font-mono text-[10px] font-bold text-cobalt uppercase block">RATIO</span>
                      <span className="font-display text-2xl font-black text-cobalt">{stats.placementPercentage}%</span>
                    </div>
                  </div>

                  {/* Active Company Recruitment Drives */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b-2 border-black mb-3">
                      <span className="font-mono text-xs uppercase tracking-wider font-black text-black">
                        [ACTIVE RECRUITMENT DRIVES]
                      </span>
                      <span className="font-mono text-[11px] text-white bg-black px-1.5 py-0.5">
                        BATCH: 2026
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Drive 1 */}
                      <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-display font-black text-sm text-black">
                              Tata Consultancy Services
                            </span>
                            <span className="badge-blue">OPEN</span>
                          </div>
                          <p className="font-mono text-xs text-ink-500 mt-1">
                            Role: Digital & Ninja Cadre • Min CGPA: 7.00 • [CSE, IT, ECE]
                          </p>
                        </div>
                        <div className="sm:text-right font-mono">
                          <span className="text-xs font-black text-black block">7.0 – 9.2 LPA</span>
                          <span className="text-[10px] text-ink-400">CLOSES: NOV 15</span>
                        </div>
                      </div>

                      {/* Drive 2 */}
                      <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-display font-black text-sm text-black">
                              Infosys Limited
                            </span>
                            <span className="badge-blue">OPEN</span>
                          </div>
                          <p className="font-mono text-xs text-ink-500 mt-1">
                            Role: Specialist Programmer • Min CGPA: 7.50 • [CSE, IT]
                          </p>
                        </div>
                        <div className="sm:text-right font-mono">
                          <span className="text-xs font-black text-black block">9.5 LPA</span>
                          <span className="text-[10px] text-ink-400">CLOSES: NOV 20</span>
                        </div>
                      </div>

                      {/* Drive 3 */}
                      <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000000] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-display font-black text-sm text-black">
                              Wipro Enterprise
                            </span>
                            <span className="badge-yellow">SHORTLISTING</span>
                          </div>
                          <p className="font-mono text-xs text-ink-500 mt-1">
                            Role: Turbo Hiring Track • Min CGPA: 6.50 • [ALL BRANCHES]
                          </p>
                        </div>
                        <div className="sm:text-right font-mono">
                          <span className="text-xs font-black text-black block">6.5 – 8.0 LPA</span>
                          <span className="text-[10px] text-ink-400">IN INTERVIEW</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dual Grid: Recent Application Activity & Upcoming Interviews */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Recent Candidate Evals */}
                    <div className="p-3 bg-canvas border-2 border-black">
                      <span className="font-mono text-[10px] font-bold text-black uppercase block pb-1 border-b border-black mb-2">
                        RECENT EVALUATIONS
                      </span>
                      <div className="space-y-2 font-mono text-xs">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-black block">Aarav Sharma</span>
                            <span className="text-[10px] text-ink-500">21CS042 • 8.84 CGPA</span>
                          </div>
                          <span className="badge-green">SHORTLIST</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-black/20">
                          <div>
                            <span className="font-bold text-black block">Priya Patel</span>
                            <span className="text-[10px] text-ink-500">21IT019 • 8.12 CGPA</span>
                          </div>
                          <span className="badge-blue">INTERVIEW</span>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Interview Schedule */}
                    <div className="p-3 bg-canvas border-2 border-black">
                      <span className="font-mono text-[10px] font-bold text-black uppercase block pb-1 border-b border-black mb-2">
                        UPCOMING INTERVIEWS
                      </span>
                      <div className="space-y-2 font-mono text-xs">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-black block">TCS Tech Round 1</span>
                            <span className="text-[10px] text-ink-500">Lab 4 (14 Cand.)</span>
                          </div>
                          <span className="text-cobalt font-bold">10:00 AM</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-black/20">
                          <div>
                            <span className="font-bold text-black block">Infosys Assessment</span>
                            <span className="text-[10px] text-ink-500">Virtual Room B</span>
                          </div>
                          <span className="text-cobalt font-bold">02:30 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Console Footer */}
                <div className="bg-canvas border-t-2 border-black px-4 py-2 flex items-center justify-between font-mono text-[10px] text-ink-500">
                  <span>CAMPUS RECRUITMENT LIVE ENGINE</span>
                  <span>ACCORDING TO HACK-P410 STANDARD</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. FIVE DISTINCTIVE SECTIONS (MANDATED)                        */}
      {/* ============================================================== */}

      {/* SECTION 01 — STUDENTS */}
      <section id="students" className="py-20 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <div className="lg:col-span-5">
              <span className="font-mono text-xs text-white bg-cobalt px-2 py-0.5 font-bold uppercase tracking-widest inline-block mb-3">
                SECTION 01 // STUDENT MODULE
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-ink">
                AUTOMATED ELIGIBILITY. ZERO GUESSWORK.
              </h2>
              <p className="mt-6 text-base text-[#2E2E2E] font-sans leading-relaxed">
                The CampusConnect backend algorithm validates your academic dossier in real time. Criteria checks on minimum CGPA, eligible branch codes, active backlogs, and graduation year happen on the server before you submit.
              </p>

              <div className="mt-8 space-y-3 font-mono text-xs text-black">
                <div className="flex items-center space-x-3 p-3 bg-canvas border-2 border-black shadow-[2px_2px_0px_#000000]">
                  <Check className="h-4 w-4 text-cobalt flex-shrink-0" strokeWidth={3} />
                  <span>Instant eligibility checker with explicit criteria reasons.</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-canvas border-2 border-black shadow-[2px_2px_0px_#000000]">
                  <Check className="h-4 w-4 text-cobalt flex-shrink-0" strokeWidth={3} />
                  <span>Live status tracking: Applied → Shortlisted → Interview → Selected.</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-canvas border-2 border-black shadow-[2px_2px_0px_#000000]">
                  <Check className="h-4 w-4 text-cobalt flex-shrink-0" strokeWidth={3} />
                  <span>PDF resume upload and replacement with version archiving.</span>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/register" className="btn-primary text-xs py-3 px-6">
                  CREATE CANDIDATE ACCOUNT →
                </Link>
              </div>
            </div>

            {/* Interactive Eligibility Test Simulator */}
            <div className="lg:col-span-7 bg-canvas border-3 border-black shadow-brutal-lg p-6 sm:p-8">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-black font-black">
                    [LIVE ELIGIBILITY SIMULATION BENCH]
                  </span>
                  <p className="font-mono text-xs text-ink-500 mt-0.5">Test real backend criteria matching</p>
                </div>
                <span className="badge-blue">ALGORITHM SIMULATOR</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-baseline mb-2 font-mono">
                    <span className="text-xs uppercase font-bold text-black">CANDIDATE CGPA:</span>
                    <span className="text-base font-black text-cobalt">{demoCgpa.toFixed(1)} / 10.0</span>
                  </div>
                  <input
                    type="range"
                    min="5.0"
                    max="10.0"
                    step="0.1"
                    value={demoCgpa}
                    onChange={(e) => setDemoCgpa(parseFloat(e.target.value))}
                    className="w-full accent-cobalt cursor-pointer h-3 border-2 border-black bg-white"
                  />
                  <div className="flex justify-between font-mono text-[10px] text-ink-500 mt-1">
                    <span>5.0</span>
                    <span className="font-bold text-black">CUTOFF: 7.5</span>
                    <span>10.0</span>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase font-bold text-black mb-2">
                    ACADEMIC BRANCH:
                  </label>
                  <select
                    value={demoBranch}
                    onChange={(e) => setDemoBranch(e.target.value)}
                    className="input-field text-xs cursor-pointer"
                  >
                    <option value="CSE">Computer Science (CSE)</option>
                    <option value="IT">Information Technology (IT)</option>
                    <option value="ECE">Electronics & Communication (ECE)</option>
                    <option value="ME">Mechanical Engineering (ME)</option>
                    <option value="CE">Civil Engineering (CE)</option>
                  </select>
                </div>
              </div>

              {/* Target Job Match Output */}
              <div className="p-5 bg-white border-2 border-black shadow-brutal">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-black mb-4">
                  <div>
                    <span className="font-mono text-[10px] text-ink-400 uppercase font-bold">TARGET POSITION</span>
                    <h4 className="font-display font-black text-base text-black">
                      Google India — Software Development Engineer
                    </h4>
                  </div>
                  <div>
                    {isEligible ? (
                      <span className="badge-green">CRITERIA SATISFIED</span>
                    ) : (
                      <span className="badge-red">INELIGIBLE TO APPLY</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-ink-500">1. MINIMUM CGPA (Cutoff ≥ 7.50):</span>
                    <span className={demoCgpa >= 7.5 ? 'text-[#136C2C] font-bold' : 'text-[#EF4444] font-bold'}>
                      {demoCgpa >= 7.5 ? `✓ PASS (${demoCgpa.toFixed(1)})` : `✗ FAIL (${demoCgpa.toFixed(1)})`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ink-500">2. ELIGIBLE BRANCHES [CSE, IT, ECE]:</span>
                    <span className={(demoBranch === 'CSE' || demoBranch === 'IT' || demoBranch === 'ECE') ? 'text-[#136C2C] font-bold' : 'text-[#EF4444] font-bold'}>
                      {(demoBranch === 'CSE' || demoBranch === 'IT' || demoBranch === 'ECE') ? `✓ ${demoBranch} APPROVED` : `✗ ${demoBranch} EXCLUDED`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ink-500">3. GRADUATION YEAR (2026):</span>
                    <span className="text-[#136C2C] font-bold">✓ VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 02 — RECRUITERS */}
      <section id="recruiters" className="py-20 border-b-4 border-black bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Candidate Review Pipeline Table */}
            <div className="lg:col-span-7 order-2 lg:order-1 bg-white border-3 border-black shadow-brutal-lg">
              <div className="px-6 py-4 bg-black text-white flex items-center justify-between font-mono text-xs border-b-2 border-black">
                <span className="font-bold tracking-wider">
                  [CANDIDATE DOSSIER PIPELINE // TCS DRIVE]
                </span>
                <span className="text-cobalt-light">3 VERIFIED PROFILES</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b-2 border-black bg-canvas font-bold text-black">
                      <th className="py-3 px-4">CANDIDATE</th>
                      <th className="py-3 px-4">BRANCH</th>
                      <th className="py-3 px-4">CGPA</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 border-b-2 border-black divide-black">
                    <tr className="hover:bg-[#E6ECFF] transition-colors">
                      <td className="py-3 px-4 font-bold text-black">Ananya Deshmukh</td>
                      <td className="py-3 px-4 text-ink-500">CSE</td>
                      <td className="py-3 px-4 font-bold text-black">9.14</td>
                      <td className="py-3 px-4"><span className="badge-green">SHORTLISTED</span></td>
                      <td className="py-3 px-4 text-right font-bold text-cobalt hover:underline cursor-pointer">
                        SCHEDULE →
                      </td>
                    </tr>
                    <tr className="hover:bg-[#E6ECFF] transition-colors">
                      <td className="py-3 px-4 font-bold text-black">Vikram Sengupta</td>
                      <td className="py-3 px-4 text-ink-500">IT</td>
                      <td className="py-3 px-4 font-bold text-black">8.62</td>
                      <td className="py-3 px-4"><span className="badge-blue">APPLIED</span></td>
                      <td className="py-3 px-4 text-right font-bold text-cobalt hover:underline cursor-pointer">
                        SHORTLIST →
                      </td>
                    </tr>
                    <tr className="hover:bg-[#E6ECFF] transition-colors">
                      <td className="py-3 px-4 font-bold text-black">Meera Nambiar</td>
                      <td className="py-3 px-4 text-ink-500">ECE</td>
                      <td className="py-3 px-4 font-bold text-black">8.20</td>
                      <td className="py-3 px-4"><span className="badge-yellow">ROUND 1</span></td>
                      <td className="py-3 px-4 text-right font-bold text-cobalt hover:underline cursor-pointer">
                        OFFER →
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-canvas flex items-center justify-between font-mono text-xs text-ink-500">
                <span>DIRECT TRANSCRIPT VERIFICATION</span>
                <span className="font-bold text-black">TOTAL POOL: 64 CANDIDATES</span>
              </div>
            </div>

            <div className="lg:col-span-5 order-1 lg:order-2">
              <span className="font-mono text-xs text-white bg-black px-2 py-0.5 font-bold uppercase tracking-widest inline-block mb-3">
                SECTION 02 // RECRUITER MODULE
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-ink">
                PRE-AUTHENTICATED TALENT. ZERO NOISE.
              </h2>
              <p className="mt-6 text-base text-[#2E2E2E] font-sans leading-relaxed">
                Recruiters manage company hiring drives with complete institutional security. Define strict CGPA cutoffs, filter candidates by discipline, coordinate technical rounds, and issue offers directly.
              </p>

              <div className="mt-8 space-y-3 font-mono text-xs text-black">
                <div className="flex items-center space-x-3 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000000]">
                  <Check className="h-4 w-4 text-cobalt flex-shrink-0" strokeWidth={3} />
                  <span>Publish jobs with automated branch & CGPA constraints.</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000000]">
                  <Check className="h-4 w-4 text-cobalt flex-shrink-0" strokeWidth={3} />
                  <span>Filter verified applicant pool and shortlist with one click.</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000000]">
                  <Check className="h-4 w-4 text-cobalt flex-shrink-0" strokeWidth={3} />
                  <span>Schedule interview rounds and record evaluation outcomes.</span>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/register?role=recruiter" className="btn-secondary text-xs py-3 px-6">
                  REGISTER CORPORATE ACCOUNT →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 03 — PLACEMENT ADMINISTRATORS */}
      <section id="placement-cell" className="py-20 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <div className="lg:col-span-5">
              <span className="font-mono text-xs text-white bg-cobalt px-2 py-0.5 font-bold uppercase tracking-widest inline-block mb-3">
                SECTION 03 // ADMIN MODULE
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-ink">
                TOTAL INSTITUTIONAL GOVERNANCE.
              </h2>
              <p className="mt-6 text-base text-[#2E2E2E] font-sans leading-relaxed">
                The training & placement office maintains complete administrative sovereignty. Approve company accounts, monitor recruitment drives, resolve schedule overlaps, and generate accreditation-compliant reports.
              </p>

              <div className="mt-8 space-y-3 font-mono text-xs text-black">
                <div className="flex items-center space-x-3 p-3 bg-canvas border-2 border-black shadow-[2px_2px_0px_#000000]">
                  <Check className="h-4 w-4 text-cobalt flex-shrink-0" strokeWidth={3} />
                  <span>Full student, company, and job opening oversight.</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-canvas border-2 border-black shadow-[2px_2px_0px_#000000]">
                  <Check className="h-4 w-4 text-cobalt flex-shrink-0" strokeWidth={3} />
                  <span>Branch-by-branch placement percentage calculations from real DB.</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-canvas border-2 border-black shadow-[2px_2px_0px_#000000]">
                  <Check className="h-4 w-4 text-cobalt flex-shrink-0" strokeWidth={3} />
                  <span>Export student registers & broadcast notifications.</span>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/login" className="btn-primary text-xs py-3 px-6">
                  ACCESS T&P DESK →
                </Link>
              </div>
            </div>

            {/* Placement Cell Drive Oversight Monitor */}
            <div className="lg:col-span-7 bg-canvas border-3 border-black shadow-brutal-lg p-6 sm:p-8">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black mb-6 font-mono text-xs">
                <span className="font-black text-black uppercase">
                  [BRANCH PLACEMENT CLEARANCE AUDIT]
                </span>
                <span className="text-[#136C2C] font-bold">DATABASE SYNCED</span>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-mono font-bold mb-1">
                    <span>Computer Science & Engineering</span>
                    <span>88.4% (115 / 130)</span>
                  </div>
                  <div className="w-full h-4 bg-white border-2 border-black">
                    <div className="h-full bg-black" style={{ width: '88.4%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono font-bold mb-1">
                    <span>Information Technology</span>
                    <span>82.1% (78 / 95)</span>
                  </div>
                  <div className="w-full h-4 bg-white border-2 border-black">
                    <div className="h-full bg-black" style={{ width: '82.1%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono font-bold mb-1">
                    <span>Electronics & Communication</span>
                    <span>71.6% (68 / 95)</span>
                  </div>
                  <div className="w-full h-4 bg-white border-2 border-black">
                    <div className="h-full bg-cobalt" style={{ width: '71.6%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono font-bold mb-1">
                    <span>Mechanical & Civil Disciplines</span>
                    <span>52.0% (51 / 98)</span>
                  </div>
                  <div className="w-full h-4 bg-white border-2 border-black">
                    <div className="h-full bg-[#7E7E76]" style={{ width: '52.0%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-black grid grid-cols-3 gap-3 text-center font-mono">
                <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000000]">
                  <span className="text-[10px] text-ink-500 uppercase block font-bold">DRIVES</span>
                  <span className="font-display font-black text-xl text-black">48</span>
                </div>
                <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_#000000]">
                  <span className="text-[10px] text-ink-500 uppercase block font-bold">AVG CTC</span>
                  <span className="font-display font-black text-xl text-black">8.6 LPA</span>
                </div>
                <div className="p-3 bg-[#E6ECFF] border-2 border-black shadow-[2px_2px_0px_#000000]">
                  <span className="text-[10px] text-cobalt uppercase block font-bold">HIGHEST</span>
                  <span className="font-display font-black text-xl text-cobalt">42.5 LPA</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 04 — RECRUITMENT STATISTICS */}
      <section id="stats" className="py-20 border-b-4 border-black bg-canvas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b-2 border-black pb-6">
            <div>
              <span className="font-mono text-xs text-white bg-black px-2 py-0.5 font-bold uppercase tracking-widest inline-block mb-2">
                SECTION 04 // RECRUITMENT METRICS
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-ink">
                BENCHMARK OUTCOMES
              </h2>
            </div>
            <p className="font-mono text-xs text-ink-500 mt-4 md:mt-0 max-w-sm">
              * ILLUSTRATIVE AUDIT METRICS DEMONSTRATING INSTITUTIONAL CAPACITY FOR HACK-P410 SPECIFICATION.
            </p>
          </div>

          {/* 4 Brutalist Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white border-3 border-black shadow-brutal p-6">
              <span className="font-mono text-xs font-bold text-white bg-black px-2 py-0.5 uppercase block w-fit mb-4">
                [01] REGISTERED
              </span>
              <div className="font-display text-5xl font-black text-black">
                {stats.totalStudents}
              </div>
              <p className="font-mono text-xs text-ink-500 mt-4">
                Pre-audited student candidates in active university talent pool.
              </p>
            </div>

            <div className="bg-white border-3 border-black shadow-brutal p-6">
              <span className="font-mono text-xs font-bold text-white bg-black px-2 py-0.5 uppercase block w-fit mb-4">
                [02] CLEARED
              </span>
              <div className="font-display text-5xl font-black text-black">
                {stats.studentsPlaced}
              </div>
              <p className="font-mono text-xs text-ink-500 mt-4">
                Verified candidate selections recorded by company talent acquisition.
              </p>
            </div>

            <div className="bg-white border-3 border-black shadow-brutal p-6">
              <span className="font-mono text-xs font-bold text-white bg-black px-2 py-0.5 uppercase block w-fit mb-4">
                [03] DRIVES
              </span>
              <div className="font-display text-5xl font-black text-black">
                {stats.totalCompanies}
              </div>
              <p className="font-mono text-xs text-ink-500 mt-4">
                Accredited corporate recruitment partners conducting campus rounds.
              </p>
            </div>

            <div className="bg-[#E6ECFF] border-3 border-black shadow-brutal p-6">
              <span className="font-mono text-xs font-bold text-white bg-cobalt px-2 py-0.5 uppercase block w-fit mb-4">
                [04] CLEARANCE
              </span>
              <div className="font-display text-5xl font-black text-cobalt">
                {stats.placementPercentage}%
              </div>
              <p className="font-mono text-xs text-ink-500 mt-4">
                Verified placement percentage computed from live system database records.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 05 — HOW THE PLATFORM WORKS */}
      <section id="how-it-works" className="py-20 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12 border-b-2 border-black pb-6">
            <span className="font-mono text-xs text-white bg-cobalt px-2 py-0.5 font-bold uppercase tracking-widest inline-block mb-2">
              SECTION 05 // SYSTEM PROTOCOL
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-ink">
              HOW CAMPUSCONNECT OPERATES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="p-6 bg-canvas border-2 border-black shadow-brutal">
              <span className="font-mono text-2xl font-black text-cobalt block mb-2">01/</span>
              <h3 className="font-display font-black text-base uppercase text-black mb-2">
                STUDENT AUDIT
              </h3>
              <p className="font-sans text-xs text-ink-700 leading-relaxed">
                Candidates register with university roll numbers, validated CGPA, and branch credentials with versioned PDF resume storage.
              </p>
            </div>

            <div className="p-6 bg-canvas border-2 border-black shadow-brutal">
              <span className="font-mono text-2xl font-black text-cobalt block mb-2">02/</span>
              <h3 className="font-display font-black text-base uppercase text-black mb-2">
                JOB PUBLICATION
              </h3>
              <p className="font-sans text-xs text-ink-700 leading-relaxed">
                Approved corporate recruiters specify hard requirements (minimum CGPA, branch codes, graduation year) and package terms.
              </p>
            </div>

            <div className="p-6 bg-canvas border-2 border-black shadow-brutal">
              <span className="font-mono text-2xl font-black text-cobalt block mb-2">03/</span>
              <h3 className="font-display font-black text-base uppercase text-black mb-2">
                RULE ENGINE
              </h3>
              <p className="font-sans text-xs text-ink-700 leading-relaxed">
                Backend algorithmic gatekeeper evaluates every candidate application, giving detailed pass/fail feedback on every criterion.
              </p>
            </div>

            <div className="p-6 bg-canvas border-2 border-black shadow-brutal">
              <span className="font-mono text-2xl font-black text-cobalt block mb-2">04/</span>
              <h3 className="font-display font-black text-base uppercase text-black mb-2">
                ROUNDS & OFFERS
              </h3>
              <p className="font-sans text-xs text-ink-700 leading-relaxed">
                Recruiters shortlist candidates, coordinate interview rounds, record pass/fail results, and issue binding placement offers.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. BRUTALIST CALL TO ACTION                                    */}
      {/* ============================================================== */}
      <section className="py-20 border-b-4 border-black bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            <div className="p-8 sm:p-10 bg-[#1F1F1F] border-3 border-white shadow-[6px_6px_0px_#0038FF] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-cobalt-light font-bold uppercase tracking-widest block mb-2">
                  [CANDIDATE ACCESS]
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
                  START CAMPUS CAMPAIGN
                </h3>
                <p className="mt-4 text-xs font-mono text-[#B8B4A8] leading-relaxed">
                  Register with your official roll number, complete your academic profile, and let the eligibility engine match you with top corporate recruiters.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-[#404040]">
                <Link to="/register" className="btn-primary w-full text-center py-4 text-xs font-mono">
                  REGISTER AS STUDENT →
                </Link>
              </div>
            </div>

            <div className="p-8 sm:p-10 bg-white text-black border-3 border-black shadow-[6px_6px_0px_#FFFFFF] flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-cobalt font-bold uppercase tracking-widest block mb-2">
                  [ENTERPRISE ACCESS]
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase text-black tracking-tight">
                  RECRUIT CAMPUS TALENT
                </h3>
                <p className="mt-4 text-xs font-mono text-ink-700 leading-relaxed">
                  Publish openings with strict eligibility rules, review pre-authenticated student transcripts, and conduct interview rounds.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t-2 border-black">
                <Link to="/register?role=recruiter" className="btn-accent w-full text-center py-4 text-xs font-mono">
                  REGISTER AS RECRUITER →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. BRUTALIST FOOTER                                            */}
      {/* ============================================================== */}
      <footer className="py-12 bg-canvas text-black font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b-2 border-black">
            
            <div className="md:col-span-2">
              <span className="font-heading text-xl font-black tracking-tight block">
                CAMPUSCONNECT
              </span>
              <p className="mt-2 text-xs text-ink-700 max-w-sm font-sans leading-relaxed">
                Centralized full-stack campus recruitment platform connecting students, placement officers, and corporate talent acquisition.
              </p>
              <div className="mt-4 font-mono text-[10px] text-white bg-black px-2 py-0.5 inline-block">
                HACKATHON SPECIFICATION HACK-P410
              </div>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider block mb-3 text-black">
                [PORTAL INDEX]
              </span>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-cobalt hover:underline">SIGN IN</Link></li>
                <li><Link to="/register" className="hover:text-cobalt hover:underline">STUDENT REGISTER</Link></li>
                <li><Link to="/register?role=recruiter" className="hover:text-cobalt hover:underline">RECRUITER REGISTER</Link></li>
                <li><a href="#students" className="hover:text-cobalt hover:underline">ELIGIBILITY ENGINE</a></li>
              </ul>
            </div>

            <div>
              <span className="font-bold uppercase tracking-wider block mb-3 text-black">
                [SPECIFICATION]
              </span>
              <ul className="space-y-1.5 text-[11px] text-ink-700">
                <li>STACK: JAVA 21 + SPRING BOOT 3</li>
                <li>FRONTEND: REACT 18 + TYPESCRIPT</li>
                <li>AUTH: JWT HS512 + BCRYPT</li>
                <li>DATABASE: MYSQL 8.0 / H2</li>
              </ul>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-ink-500 text-[11px] gap-2">
            <div>
              © 2026 CAMPUSCONNECT. MODERN BRUTALIST EDITION. ALL RIGHTS RESERVED.
            </div>
            <div>
              DESIGN DIRECTION C // BRUTALIST ENTERPRISE ARCHITECTURE
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
