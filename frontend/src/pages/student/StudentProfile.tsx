import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  FileText, 
  Upload, 
  Check, 
  X, 
  Plus, 
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { studentAPI } from '../../services/api';
import { StudentProfile as StudentProfileType } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

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

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [profile, setProfile] = useState<StudentProfileType>({
    id: 0,
    userId: 0,
    email: '',
    fullName: '',
    rollNumber: '',
    branch: BRANCHES[0],
    cgpa: 0,
    graduationYear: 2025,
    phone: '',
    skills: [],
    resumeUrl: null,
    profileComplete: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getProfile();
      const data = res.data?.data || res.data;
      if (data) {
        setProfile({
          ...data,
          skills: Array.isArray(data.skills) ? data.skills : [],
          branch: data.branch || BRANCHES[0],
          graduationYear: data.graduationYear || 2025,
        });
      }
    } catch {
      toast.error('Failed to load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const trimmed = skillInput.trim().replace(/^,+|,+$/g, '');
    if (!trimmed) return;
    if (profile.skills.includes(trimmed)) {
      toast.error('Skill already added');
      return;
    }
    setProfile((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (profile.cgpa < 0 || profile.cgpa > 10) {
      toast.error('CGPA must be between 0.0 and 10.0');
      return;
    }

    setSaving(true);
    try {
      const res = await studentAPI.updateProfile({
        fullName: profile.fullName,
        rollNumber: profile.rollNumber,
        branch: profile.branch,
        cgpa: Number(profile.cgpa),
        graduationYear: Number(profile.graduationYear),
        phone: profile.phone,
        skills: profile.skills,
      });
      const updated = res.data?.data || res.data;
      if (updated) {
        setProfile((prev) => ({
          ...prev,
          ...updated,
          skills: Array.isArray(updated.skills) ? updated.skills : prev.skills,
        }));
      }
      toast.success('Candidate profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume file must be under 5MB');
      return;
    }

    setUploadingResume(true);
    try {
      const res = await studentAPI.uploadResume(file);
      const url = res.data?.data?.resumeUrl || res.data?.resumeUrl || res.data;
      setProfile((prev) => ({
        ...prev,
        resumeUrl: typeof url === 'string' ? url : prev.resumeUrl || file.name,
      }));
      toast.success('Resume uploaded successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" label="LOADING PROFILE RECORD..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Brutalist Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-20 h-20 bg-cobalt text-white border-2 border-black shadow-[4px_4px_0px_#0A0A0A] flex items-center justify-center text-3xl font-heading font-black">
          {profile.fullName?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase() || 'S'}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
              {profile.fullName || 'Student Dossier'}
            </h1>
            {profile.profileComplete ? (
              <span className="badge-green mt-2 sm:mt-0 self-center sm:self-auto">Profile Complete</span>
            ) : (
              <span className="badge-yellow mt-2 sm:mt-0 self-center sm:self-auto">Profile Incomplete</span>
            )}
          </div>
          <div className="font-mono text-xs font-bold text-gray-700 mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="bg-canvas border border-black px-2 py-0.5">ROLL: {profile.rollNumber || 'NOT ASSIGNED'}</span>
            <span className="bg-canvas border border-black px-2 py-0.5">BRANCH: {profile.branch || 'UNASSIGNED'}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Academic & Personal Details */}
        <div className="card space-y-5">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="font-heading font-black text-base uppercase text-black">
              1. Personal & Academic Credentials
            </h2>
            <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5 uppercase">
              REQUIRED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-black" />
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="input-field pl-10 text-sm"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Institutional Email (Locked)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="input-field pl-10 text-sm bg-gray-100 text-gray-600 cursor-not-allowed border-dashed"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                University Roll / USN *
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3.5 h-4 w-4 text-black" />
                <input
                  type="text"
                  required
                  value={profile.rollNumber}
                  onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })}
                  className="input-field pl-10 text-sm font-mono"
                  placeholder="e.g. 1RV21CS089"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Primary Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-black" />
                <input
                  type="tel"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="input-field pl-10 text-sm font-mono"
                  placeholder="e.g. 9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Academic Branch *
              </label>
              <select
                value={profile.branch}
                onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                className="input-field text-sm font-bold"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Cumulative CGPA (0.00 – 10.00) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={profile.cgpa || ''}
                onChange={(e) => setProfile({ ...profile, cgpa: parseFloat(e.target.value) || 0 })}
                className="input-field text-sm font-mono font-bold"
                placeholder="8.50"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Batch Graduation Year *
              </label>
              <select
                value={profile.graduationYear}
                onChange={(e) => setProfile({ ...profile, graduationYear: Number(e.target.value) })}
                className="input-field text-sm font-bold font-mono"
              >
                {GRADUATION_YEARS.map((y) => (
                  <option key={y} value={y}>
                    CLASS OF {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Skills Tag Management */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="font-heading font-black text-base uppercase text-black">
              2. Technical Skills & Stack
            </h2>
            <span className="font-mono text-[10px] font-bold bg-yellow-300 text-black border border-black px-2 py-0.5 uppercase">
              FOR AUTOMATED MATCHING
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type skill (e.g. React, Java, Spring Boot, MySQL) and press Enter"
                className="input-field text-sm flex-1 font-mono"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="btn-secondary text-xs px-4 flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>ADD</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center space-x-2 px-3 py-1 text-xs font-mono font-black uppercase bg-canvas text-black border-2 border-black shadow-[2px_2px_0px_#0A0A0A]"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-red-600 hover:text-black font-black"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <p className="font-mono text-xs text-gray-500 italic">No skills cataloged yet. Add your technical competencies for corporate drive screening.</p>
              )}
            </div>
          </div>
        </div>

        {/* Resume Management */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="font-heading font-black text-base uppercase text-black">
              3. Verified Resume Document
            </h2>
            <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5 uppercase">
              PDF ARCHIVE
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-2 border-dashed border-black bg-canvas">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 bg-black text-white border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#0038FF]">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading font-black text-sm uppercase text-black">
                  {profile.resumeUrl ? 'Verified Resume on File' : 'No Resume Uploaded'}
                </p>
                <p className="font-mono text-xs text-gray-600">
                  PDF format recommended (Maximum file payload: 5MB)
                </p>
                {profile.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs font-black text-cobalt hover:text-black underline mt-1 inline-flex items-center"
                  >
                    <span>VIEW CURRENT RESUME FILE</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <label
                className={`btn-primary text-xs cursor-pointer flex items-center space-x-2 ${
                  uploadingResume ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {uploadingResume ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent"></div>
                    <span>UPLOADING...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>UPLOAD PDF RESUME</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary text-xs px-8 py-3.5 flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>COMMITTING CHANGES...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>SAVE CANDIDATE PROFILE</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
