import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI, extractErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      const msg = 'Please enter both email and password';
      setErrorMsg(msg);
      toast.error(msg, { id: 'login-error' });
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.loginStudent({ email: email.trim().toLowerCase(), password });
      const payload = res.data?.data || res.data;
      const token = payload.token || payload.jwt || payload.accessToken;

      let user: User;
      if (payload.user) {
        user = payload.user;
      } else {
        let role: 'STUDENT' | 'RECRUITER' | 'ADMIN' = (payload.role || 'STUDENT').toUpperCase();
        let id = payload.id || payload.userId || 1;
        let userEmail = payload.email || email;

        if (token) {
          try {
            const base64Url = token.split('.')[1];
            if (base64Url) {
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const decoded = JSON.parse(jsonPayload);
              if (decoded.role) role = decoded.role.toUpperCase();
              if (decoded.id || decoded.userId) id = decoded.id || decoded.userId;
              if (decoded.sub) userEmail = decoded.sub;
            }
          } catch {
            // Fallback
          }
        }

        user = {
          id: Number(id),
          email: userEmail,
          role: role as 'STUDENT' | 'RECRUITER' | 'ADMIN',
        };
      }

      login(token, user);
      toast.success(`Access granted: ${user.email}`, { id: 'login-success' });

      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, 'Invalid credentials provided');
      setErrorMsg(msg);
      toast.error(msg, { id: 'login-error' });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Admin@123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-canvas text-ink font-sans selection:bg-cobalt selection:text-white">
      {/* Left Column: Modern Brutalist Poster */}
      <div className="hidden md:flex md:w-5/12 bg-[#0A0A0A] text-white p-12 lg:p-16 flex-col justify-between border-r-4 border-black">
        <div>
          <Link to="/" className="inline-flex items-baseline space-x-2 group">
            <span className="font-heading text-2xl font-black tracking-tight text-white group-hover:text-cobalt transition-colors">
              CAMPUSCONNECT
            </span>
            <span className="font-mono text-xs text-white bg-cobalt px-1.5 py-0.5 font-bold">
              AUTH-26
            </span>
          </Link>

          <div className="mt-20">
            <div className="inline-block bg-cobalt text-white font-mono text-xs px-2.5 py-1 font-bold uppercase tracking-widest mb-4 shadow-[2px_2px_0px_#FFFFFF]">
              SECURITY CLEARANCE
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl font-black uppercase leading-[1.05] text-white">
              VERIFIED GATEWAY FOR CAMPUS HIRING.
            </h2>
            <p className="mt-6 text-sm text-[#B8B4A8] leading-relaxed max-w-sm font-sans">
              Centralized placement pipeline supporting verified student dossiers, accredited corporate partners, and university training & placement desks.
            </p>

            <div className="mt-8 space-y-3 pt-6 border-t-2 border-[#2A2A2A] font-mono text-xs text-[#B8B4A8]">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-cobalt"></span>
                <span>JWT ACCESS TOKEN AUTHORIZATION</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-cobalt"></span>
                <span>BCRYPT PASSWORD HASH PERSISTENCE</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-cobalt"></span>
                <span>ROLE-BASED ENDPOINT ISOLATION</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Account Fillers for Evaluation */}
        <div className="pt-8 border-t-2 border-[#2A2A2A]">
          <span className="font-mono text-xs uppercase tracking-wider text-[#B8B4A8] font-bold block mb-3">
            EVALUATOR SHORTCUTS (PASSWORD: Admin@123):
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fillDemo('student1@college.edu')}
              className="font-mono text-xs px-3 py-1.5 bg-[#1F1F1F] hover:bg-cobalt text-white font-bold transition-all border border-[#404040] shadow-[2px_2px_0px_#000000]"
            >
              STUDENT
            </button>
            <button
              type="button"
              onClick={() => fillDemo('recruiter1@tcs.com')}
              className="font-mono text-xs px-3 py-1.5 bg-[#1F1F1F] hover:bg-cobalt text-white font-bold transition-all border border-[#404040] shadow-[2px_2px_0px_#000000]"
            >
              RECRUITER
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@campusconnect.edu')}
              className="font-mono text-xs px-3 py-1.5 bg-[#1F1F1F] hover:bg-cobalt text-white font-bold transition-all border border-[#404040] shadow-[2px_2px_0px_#000000]"
            >
              ADMIN
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Brutalist Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white border-2 border-black shadow-brutal-lg p-8 sm:p-10">
          
          <div className="mb-8 border-b-2 border-black pb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-cobalt font-bold block mb-1">
              ACCOUNT IDENTIFICATION
            </span>
            <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-ink">
              SIGN IN
            </h1>
            <p className="text-xs text-ink-500 mt-1 font-mono">
              Enter university roll email or corporate credentials.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-[#EF4444] text-white border-2 border-black shadow-brutal flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div className="font-mono text-xs">
                <span className="font-bold uppercase block">[ACCESS REFUSED]</span>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink mb-2">
                Institutional Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu or recruiter@company.com"
                className="input-field"
                disabled={loading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono text-xs uppercase tracking-wider font-bold text-ink">
                  Password
                </label>
                <span className="font-mono text-[11px] text-ink-400 font-bold">BCRYPT 10-ROUND</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-field"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-sm flex items-center justify-center space-x-2 mt-4"
            >
              {loading ? (
                <span className="font-mono text-xs uppercase tracking-wider">VERIFYING SIGNATURE...</span>
              ) : (
                <>
                  <span>AUTHENTICATE & ENTER</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t-2 border-black flex items-center justify-between text-xs font-mono">
            <span className="text-ink-500">NO ACCOUNT REGISTERED?</span>
            <Link to="/register" className="font-bold text-cobalt hover:underline">
              REGISTER HERE →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
