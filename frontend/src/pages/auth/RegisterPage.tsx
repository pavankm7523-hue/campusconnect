import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, extractErrorMessage } from '../../services/api';

const BRANCHES = [
  'Computer Science and Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Artificial Intelligence & Data Science (AIDS)',
  'Artificial Intelligence & Machine Learning (AIML)',
  'Data Science (DS)',
];

const GRADUATION_YEARS = [2024, 2025, 2026, 2027, 2028];

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'student';
  
  const [activeTab, setActiveTab] = useState<'student' | 'recruiter'>(initialRole);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Student form state
  const [studentData, setStudentData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    branch: BRANCHES[0],
    graduationYear: 2026,
    phone: '',
  });

  // Recruiter form state
  const [recruiterData, setRecruiterData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    designation: '',
    phone: '',
    companyName: '',
  });

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent double submit
    setFormError(null);

    // Frontend validations
    if (studentData.password !== studentData.confirmPassword) {
      const msg = 'Passwords do not match';
      setFormError(msg);
      toast.error(msg, { id: 'register-error' });
      return;
    }
    if (studentData.password.length < 6) {
      const msg = 'Password must be at least 6 characters';
      setFormError(msg);
      toast.error(msg, { id: 'register-error' });
      return;
    }
    if (studentData.phone && studentData.phone.replace(/\D/g, '').length < 10) {
      const msg = 'Phone number must have at least 10 digits';
      setFormError(msg);
      toast.error(msg, { id: 'register-error' });
      return;
    }

    try {
      setLoading(true);
      await authAPI.registerStudent({
        fullName: studentData.fullName.trim(),
        email: studentData.email.trim().toLowerCase(),
        password: studentData.password,
        rollNumber: studentData.rollNumber.trim().toUpperCase(),
        branch: studentData.branch,
        graduationYear: Number(studentData.graduationYear),
        phone: studentData.phone.trim(),
      });
      toast.success('Registration successful! Please sign in.', { id: 'register-success' });
      navigate('/login');
    } catch (err: any) {
      const msg = extractErrorMessage(err, 'Registration failed. Please check your information.');
      setFormError(msg);
      // Single deduplicated toast
      toast.error(msg, { id: 'register-error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRecruiterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setFormError(null);

    if (recruiterData.password !== recruiterData.confirmPassword) {
      const msg = 'Passwords do not match';
      setFormError(msg);
      toast.error(msg, { id: 'register-error' });
      return;
    }
    if (recruiterData.password.length < 6) {
      const msg = 'Password must be at least 6 characters';
      setFormError(msg);
      toast.error(msg, { id: 'register-error' });
      return;
    }

    try {
      setLoading(true);
      await authAPI.registerRecruiter({
        fullName: recruiterData.fullName.trim(),
        email: recruiterData.email.trim().toLowerCase(),
        password: recruiterData.password,
        designation: recruiterData.designation.trim(),
        phone: recruiterData.phone.trim(),
        companyName: recruiterData.companyName.trim(),
      });
      toast.success('Recruiter account submitted! Pending placement cell approval.', { id: 'register-success' });
      navigate('/login');
    } catch (err: any) {
      const msg = extractErrorMessage(err, 'Registration failed. Please check your information.');
      setFormError(msg);
      toast.error(msg, { id: 'register-error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans py-12 px-4 sm:px-6 lg:px-8 selection:bg-cobalt selection:text-white">
      <div className="max-w-2xl mx-auto">
        
        {/* Brand Header */}
        <div className="mb-8 border-b-2 border-ink pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Link to="/" className="inline-flex items-baseline space-x-2 group">
              <span className="font-heading text-2xl font-black tracking-tight text-ink group-hover:text-cobalt transition-colors">
                CAMPUSCONNECT
              </span>
              <span className="font-mono text-xs text-white bg-cobalt px-1.5 py-0.5 font-bold">
                REG-2026
              </span>
            </Link>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-ink mt-3">
              CREATE ACCOUNT
            </h1>
          </div>
          <div className="font-mono text-xs text-ink-500">
            EXISTING USER?{' '}
            <Link to="/login" className="font-bold text-cobalt hover:underline">
              SIGN IN HERE →
            </Link>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-2 border-ink bg-black p-1 shadow-brutal mb-8">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setFormError(null);
            }}
            className={`py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-100 ${
              activeTab === 'student'
                ? 'bg-white text-ink shadow-[2px_2px_0px_#000000]'
                : 'text-white hover:text-cobalt-light'
            }`}
          >
            [01] STUDENT ONBOARDING
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('recruiter');
              setFormError(null);
            }}
            className={`py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-100 ${
              activeTab === 'recruiter'
                ? 'bg-white text-ink shadow-[2px_2px_0px_#000000]'
                : 'text-white hover:text-cobalt-light'
            }`}
          >
            [02] RECRUITER PARTNER
          </button>
        </div>

        {/* On-Page Error Alert */}
        {formError && (
          <div className="mb-6 p-4 bg-[#EF4444] text-white border-2 border-ink shadow-brutal flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="font-mono text-xs">
              <span className="font-bold uppercase block">[REGISTRATION REJECTED]</span>
              <span>{formError}</span>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white border-2 border-ink shadow-brutal-lg p-6 sm:p-10">
          {activeTab === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="space-y-6">
              <div className="pb-3 border-b-2 border-ink flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-cobalt font-bold">
                  STUDENT CANDIDATE PROFILE
                </span>
                <span className="font-mono text-[10px] text-ink-500">AUTONOMOUS ELIGIBILITY SYNC</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentData.fullName}
                    onChange={(e) => setStudentData({ ...studentData, fullName: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="input-field"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    University Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentData.rollNumber}
                    onChange={(e) => setStudentData({ ...studentData, rollNumber: e.target.value })}
                    placeholder="e.g. 21CS042"
                    className="input-field uppercase"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    College Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={studentData.email}
                    onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                    placeholder="student@college.edu"
                    className="input-field"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={studentData.phone}
                    onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
                    placeholder="10-digit number"
                    className="input-field"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    Academic Branch *
                  </label>
                  <select
                    value={studentData.branch}
                    onChange={(e) => setStudentData({ ...studentData, branch: e.target.value })}
                    className="input-field text-xs cursor-pointer"
                    disabled={loading}
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    Graduation Year *
                  </label>
                  <select
                    value={studentData.graduationYear}
                    onChange={(e) => setStudentData({ ...studentData, graduationYear: Number(e.target.value) })}
                    className="input-field text-xs cursor-pointer"
                    disabled={loading}
                  >
                    {GRADUATION_YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={studentData.password}
                    onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="input-field"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={studentData.confirmPassword}
                    onChange={(e) => setStudentData({ ...studentData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="input-field"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="p-3 bg-canvas border border-ink font-mono text-[11px] text-ink-700">
                INFO: Profiles are verified by the campus placement desk. BCrypt password hashing active.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-sm flex items-center justify-center space-x-2 mt-4"
              >
                {loading ? (
                  <span className="font-mono text-xs uppercase tracking-wider">CREATING RECORD IN DATABASE...</span>
                ) : (
                  <>
                    <span>SUBMIT CANDIDATE DOSSIER</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRecruiterSubmit} className="space-y-6">
              <div className="pb-3 border-b-2 border-ink flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-cobalt font-bold">
                  CORPORATE HIRING ENTITY
                </span>
                <span className="font-mono text-[10px] text-ink-500">ENTERPRISE TALENT ACQUISITION</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={recruiterData.companyName}
                    onChange={(e) => setRecruiterData({ ...recruiterData, companyName: e.target.value })}
                    placeholder="e.g. Google India / TCS"
                    className="input-field"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    Recruiter Representative *
                  </label>
                  <input
                    type="text"
                    required
                    value={recruiterData.fullName}
                    onChange={(e) => setRecruiterData({ ...recruiterData, fullName: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="input-field"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    Official Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={recruiterData.email}
                    onChange={(e) => setRecruiterData({ ...recruiterData, email: e.target.value })}
                    placeholder="recruiter@company.com"
                    className="input-field"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={recruiterData.designation}
                    onChange={(e) => setRecruiterData({ ...recruiterData, designation: e.target.value })}
                    placeholder="e.g. University Hiring Lead"
                    className="input-field"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                  Official Phone Contact *
                </label>
                <input
                  type="tel"
                  required
                  value={recruiterData.phone}
                  onChange={(e) => setRecruiterData({ ...recruiterData, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={recruiterData.password}
                    onChange={(e) => setRecruiterData({ ...recruiterData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="input-field"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={recruiterData.confirmPassword}
                    onChange={(e) => setRecruiterData({ ...recruiterData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className="input-field"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="p-3 bg-canvas border border-ink font-mono text-[11px] text-ink-700">
                NOTE: Recruiter accounts are vetted by the campus placement administration before job posting privileges are activated.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-sm flex items-center justify-center space-x-2 mt-4"
              >
                {loading ? (
                  <span className="font-mono text-xs uppercase tracking-wider">REGISTERING CORPORATE DESK...</span>
                ) : (
                  <>
                    <span>SUBMIT RECRUITER REGISTRATION</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
