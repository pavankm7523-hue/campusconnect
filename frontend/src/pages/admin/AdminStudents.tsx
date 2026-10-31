import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  ExternalLink, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  X 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../../services/api';
import { StudentProfile } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function AdminStudents() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [exporting, setExporting] = useState(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getStudents({ search: searchTerm });
      const data = res.data?.data || res.data;
      if (Array.isArray(data)) {
        setStudents(data);
      } else if (data?.content) {
        setStudents(data.content);
      } else {
        setStudents([]);
      }
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await adminAPI.exportStudents();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students_placement_roster.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Student roster exported successfully');
    } catch {
      toast.error('Failed to export students list');
    } finally {
      setExporting(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  if (loading && students.length === 0) {
    return <LoadingSpinner size="lg" label="INDEXING STUDENT CANDIDACY RECORDS..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border-2 border-black p-6 shadow-brutal flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
            // INSTITUTIONAL CANDIDATE REGISTRY
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
            STUDENT ROSTER
          </h1>
          <p className="font-mono text-xs text-gray-700 font-bold mt-1">
            Directory of all registered university candidates, graduation batches, and academic records.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="btn-secondary text-xs px-4 py-2.5 flex items-center space-x-2 self-start sm:self-auto font-mono font-bold"
        >
          <Download className="h-4 w-4 text-black" />
          <span>{exporting ? 'EXPORTING...' : 'EXPORT CSV ROSTER'}</span>
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearchSubmit} className="card p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-black" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, email, or USN roll number..."
            className="input-field pl-10 text-xs font-mono"
          />
        </div>
      </form>

      {/* Table */}
      {students.length > 0 ? (
        <div className="bg-white border-2 border-black shadow-brutal overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-canvas border-b-2 border-black font-black text-black uppercase">
                  <th className="px-6 py-4">STUDENT NAME & EMAIL</th>
                  <th className="px-6 py-4">ROLL / USN</th>
                  <th className="px-6 py-4">BRANCH</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">BATCH</th>
                  <th className="px-6 py-4">PROFILE STATUS</th>
                  <th className="px-6 py-4 text-right">DOSSIER</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-canvas transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-heading font-black text-sm uppercase text-black">{student.fullName || 'STUDENT'}</p>
                        <p className="font-mono text-[10px] text-gray-700 font-bold mt-0.5">{student.email}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-black">
                      {student.rollNumber || 'UNASSIGNED'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-charcoal font-bold">
                      {student.branch || 'GENERAL'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-black text-cobalt">
                      {student.cgpa ? `${student.cgpa.toFixed(2)} / 10.0` : '0.00'}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-bold text-black">
                      CLASS OF {student.graduationYear || 2025}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.profileComplete ? (
                        <span className="badge-green flex items-center space-x-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>COMPLETE</span>
                        </span>
                      ) : (
                        <span className="badge-yellow flex items-center space-x-1 w-fit">
                          <XCircle className="h-3 w-3" />
                          <span>INCOMPLETE</span>
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right whitespace-nowrap font-bold">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center space-x-1 border-2 border-black"
                      >
                        <Eye className="h-3.5 w-3.5 text-black" />
                        <span>VIEW DOSSIER</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="NO CANDIDATES CATALOGED"
          description="No student profiles match your search criteria in the institutional registry."
        />
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black max-w-lg w-full p-6 space-y-5 shadow-brutal-lg relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 p-1 text-black hover:bg-canvas border border-black font-black"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-4 border-b-2 border-black pb-4">
              <div className="w-14 h-14 bg-black text-white border-2 border-black flex items-center justify-center text-xl font-heading font-black shadow-[2px_2px_0px_#0038FF]">
                {selectedStudent.fullName?.charAt(0) || 'S'}
              </div>
              <div>
                <h3 className="font-heading font-black text-xl text-black uppercase">{selectedStudent.fullName}</h3>
                <p className="font-mono text-xs text-gray-700 font-bold">{selectedStudent.email}</p>
                <p className="font-mono text-xs text-gray-700 font-bold">{selectedStudent.phone || 'PHONE UNLISTED'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs bg-canvas p-4 border-2 border-black">
              <div>
                <span className="text-gray-600 block uppercase font-bold">ROLL / USN:</span>
                <span className="font-black text-black">{selectedStudent.rollNumber}</span>
              </div>
              <div>
                <span className="text-gray-600 block uppercase font-bold">ACADEMIC CGPA:</span>
                <span className="font-black text-cobalt">{selectedStudent.cgpa ? selectedStudent.cgpa.toFixed(2) : '0.00'} / 10.0</span>
              </div>
              <div>
                <span className="text-gray-600 block uppercase font-bold">DISCIPLINE:</span>
                <span className="font-black text-black uppercase">{selectedStudent.branch}</span>
              </div>
              <div>
                <span className="text-gray-600 block uppercase font-bold">BATCH:</span>
                <span className="font-black text-black uppercase">CLASS OF {selectedStudent.graduationYear}</span>
              </div>
            </div>

            <div>
              <span className="font-mono text-xs font-black uppercase text-black block mb-2">// TECHNICAL COMPETENCIES:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.skills && selectedStudent.skills.length > 0 ? (
                  selectedStudent.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 text-xs font-mono font-black uppercase bg-canvas text-black border border-black">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="font-mono text-xs text-gray-500 italic">No technical skills listed</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t-2 border-black flex items-center justify-between">
              {selectedStudent.resumeUrl ? (
                <a
                  href={selectedStudent.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary text-xs py-2 px-4 inline-flex items-center space-x-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>VIEW RESUME PDF</span>
                </a>
              ) : (
                <span className="font-mono text-xs text-gray-500 italic">NO RESUME SUBMITTED</span>
              )}

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="btn-secondary text-xs px-4 py-2 font-mono font-bold"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
