import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Users, 
  Check, 
  Plus, 
  X, 
  ArrowLeft 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { recruiterAPI } from '../../services/api';

const BRANCH_OPTIONS = [
  { code: 'CSE', label: 'Computer Science & Engineering' },
  { code: 'IT', label: 'Information Technology' },
  { code: 'ECE', label: 'Electronics & Communication' },
  { code: 'EEE', label: 'Electrical & Electronics' },
  { code: 'ME', label: 'Mechanical Engineering' },
  { code: 'CE', label: 'Civil Engineering' },
  { code: 'AIDS', label: 'AI & Data Science' },
  { code: 'AIML', label: 'AI & Machine Learning' },
  { code: 'DS', label: 'Data Science' },
];

const GRAD_YEAR_OPTIONS = [2024, 2025, 2026, 2027, 2028];

export default function CreateJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    minCgpa: 7.0,
    eligibleBranches: ['CSE', 'IT', 'ECE'],
    eligibleGraduationYears: [2025],
    requiredSkills: ['Java', 'SQL', 'Data Structures'],
    packageOffered: '',
    jobType: 'FULL_TIME',
    location: '',
    applicationDeadline: '',
    totalPositions: 5,
    status: 'OPEN',
  });

  const handleBranchToggle = (branchCode: string) => {
    setFormData((prev) => {
      const exists = prev.eligibleBranches.includes(branchCode);
      return {
        ...prev,
        eligibleBranches: exists
          ? prev.eligibleBranches.filter((b) => b !== branchCode)
          : [...prev.eligibleBranches, branchCode],
      };
    });
  };

  const handleYearToggle = (year: number) => {
    setFormData((prev) => {
      const exists = prev.eligibleGraduationYears.includes(year);
      return {
        ...prev,
        eligibleGraduationYears: exists
          ? prev.eligibleGraduationYears.filter((y) => y !== year)
          : [...prev.eligibleGraduationYears, year],
      };
    });
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const trimmed = skillInput.trim().replace(/^,+|,+$/g, '');
    if (!trimmed) return;
    if (formData.requiredSkills.includes(trimmed)) {
      toast.error('Skill already in list');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, trimmed],
    }));
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    if (formData.eligibleBranches.length === 0) {
      toast.error('Please select at least one eligible branch');
      return;
    }

    if (formData.eligibleGraduationYears.length === 0) {
      toast.error('Please select at least one eligible graduation batch');
      return;
    }

    setLoading(true);
    try {
      await recruiterAPI.createJob({
        ...formData,
        minCgpa: Number(formData.minCgpa),
        totalPositions: Number(formData.totalPositions),
      });
      toast.success('Job posting created successfully!');
      navigate('/recruiter/jobs');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create job posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Brutalist Header */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex items-center space-x-4">
        <button
          type="button"
          onClick={() => navigate('/recruiter/jobs')}
          className="p-3 border-2 border-black bg-canvas hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_#0A0A0A]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-0.5">
            // CREATE DRIVE REQUISITION
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
            POST CAMPUS VACANCY
          </h1>
          <p className="font-mono text-xs text-gray-700 font-bold mt-0.5">
            Configure job specifications and automated candidate eligibility cutoffs.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Information */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="font-heading font-black text-base uppercase text-black">
              1. Position Specifications
            </h2>
            <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5 uppercase">
              MANDATORY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Official Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Associate Software Development Engineer (SDE-1)"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Engagement Type
              </label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="input-field text-xs font-mono font-bold"
              >
                <option value="FULL_TIME">FULL TIME</option>
                <option value="INTERNSHIP">INTERNSHIP</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Compensation / CTC *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-black" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 14.5 LPA or ₹50,000/month"
                  value={formData.packageOffered}
                  onChange={(e) => setFormData({ ...formData, packageOffered: e.target.value })}
                  className="input-field pl-10 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Work Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-black" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore / Hyderabad / Hybrid"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field pl-10 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Total Open Seats
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-3.5 h-4 w-4 text-black" />
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.totalPositions}
                  onChange={(e) => setFormData({ ...formData, totalPositions: parseInt(e.target.value) || 1 })}
                  className="input-field pl-10 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Application Deadline *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-black" />
                <input
                  type="date"
                  required
                  value={formData.applicationDeadline}
                  onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                  className="input-field pl-10 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Listing Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field text-xs font-mono font-bold"
              >
                <option value="OPEN">OPEN (ACCEPTING APPLICATIONS)</option>
                <option value="DRAFT">DRAFT</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
                Job Overview & Eligibility Context *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Outline core responsibilities, technology stack expectations, and assessment procedure..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field text-xs font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="card space-y-5">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="font-heading font-black text-base uppercase text-black">
              2. Candidate Eligibility Engine Constraints
            </h2>
            <span className="font-mono text-[10px] font-bold bg-yellow-300 text-black border border-black px-2 py-0.5 uppercase">
              ENFORCED AT APPLICATION
            </span>
          </div>

          <div>
            <label className="block font-mono text-xs font-black uppercase text-black mb-1.5">
              Minimum Academic CGPA (0.00 – 10.00)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              required
              value={formData.minCgpa}
              onChange={(e) => setFormData({ ...formData, minCgpa: parseFloat(e.target.value) || 0 })}
              className="input-field text-xs font-mono font-bold max-w-xs"
              placeholder="7.5"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-black uppercase text-black mb-2">
              Eligible Engineering Disciplines (Branches)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BRANCH_OPTIONS.map((branch) => {
                const checked = formData.eligibleBranches.includes(branch.code);
                return (
                  <label
                    key={branch.code}
                    className={`flex items-center space-x-2.5 p-3 border-2 border-black text-xs font-mono font-bold cursor-pointer transition-all ${
                      checked
                        ? 'bg-cobalt text-white shadow-[2px_2px_0px_#0A0A0A]'
                        : 'bg-canvas hover:bg-white text-black'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleBranchToggle(branch.code)}
                      className="h-4 w-4 accent-black"
                    />
                    <span>{branch.code}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-black uppercase text-black mb-2">
              Eligible Graduation Batches
            </label>
            <div className="flex flex-wrap gap-3">
              {GRAD_YEAR_OPTIONS.map((year) => {
                const checked = formData.eligibleGraduationYears.includes(year);
                return (
                  <label
                    key={year}
                    className={`flex items-center space-x-2 px-4 py-2 border-2 border-black text-xs font-mono font-bold cursor-pointer transition-all ${
                      checked
                        ? 'bg-yellow-300 text-black shadow-[2px_2px_0px_#0A0A0A]'
                        : 'bg-canvas hover:bg-white text-black'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleYearToggle(year)}
                      className="h-4 w-4 accent-black"
                    />
                    <span>CLASS OF {year}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Required Skills */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h2 className="font-heading font-black text-base uppercase text-black">
              3. Required Technical Competencies
            </h2>
            <span className="font-mono text-[10px] font-bold bg-black text-white px-2 py-0.5 uppercase">
              SKILL CRITERIA
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="e.g. React, Java, Spring Boot, MySQL (Press Enter)"
              className="input-field text-xs font-mono flex-1"
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
            {formData.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center space-x-2 px-3 py-1 font-mono text-xs font-black uppercase bg-canvas text-black border-2 border-black shadow-[2px_2px_0px_#0A0A0A]"
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
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/recruiter/jobs')}
            className="btn-secondary text-xs px-6 py-3 font-mono font-bold"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-xs px-8 py-3.5 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>TRANSMITTING OPENING...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>PUBLISH CAMPUS OPENING</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
