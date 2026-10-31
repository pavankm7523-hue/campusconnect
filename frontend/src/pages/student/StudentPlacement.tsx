import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Building2, 
  DollarSign, 
  Calendar, 
  Sparkles, 
  Briefcase, 
  ArrowRight 
} from 'lucide-react';
import { studentAPI } from '../../services/api';
import { PlacementResult } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function StudentPlacement() {
  const [placement, setPlacement] = useState<PlacementResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacementResult();
  }, []);

  const fetchPlacementResult = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getPlacementResult();
      const data = res.data?.data || res.data;
      if (data && (data.companyName || data.status === 'PLACED' || data.packageOffered)) {
        setPlacement(data);
      } else {
        setPlacement(null);
      }
    } catch {
      setPlacement(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" label="VERIFYING PLACEMENT AUDIT RECORDS..." />;
  }

  const isPlaced = placement && (placement.status?.toUpperCase() === 'PLACED' || placement.companyName);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border-2 border-black p-6 shadow-brutal">
        <div className="font-mono text-xs uppercase tracking-wider text-cobalt font-black mb-1">
          // OFFICIAL VERIFICATION RECORD
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-4xl text-black uppercase tracking-tight">
          CAMPUS PLACEMENT DOSSIER
        </h1>
        <p className="font-mono text-xs text-gray-700 font-bold mt-1">
          Certified institutional recruitment outcomes signed by the University Placement Cell.
        </p>
      </div>

      {isPlaced ? (
        <div className="bg-white border-2 border-black p-8 text-center shadow-brutal space-y-6">
          <div className="inline-flex p-4 bg-yellow-300 text-black border-2 border-black shadow-[4px_4px_0px_#0A0A0A]">
            <Award className="h-12 w-12" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-950 border-2 border-black font-mono text-xs font-black uppercase mb-3">
              <Sparkles className="h-4 w-4" />
              <span>OFFICIAL SELECTION CONFIRMED</span>
            </div>

            <h2 className="font-heading font-black text-3xl sm:text-4xl text-black uppercase">
              CONGRATULATIONS, {placement.studentName || 'CANDIDATE'}!
            </h2>
            <p className="font-mono text-xs text-gray-700 font-bold max-w-md mx-auto mt-2">
              You have formally secured an institutional offer in the 2025–2026 campus recruitment cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-left">
            <div className="bg-canvas p-4 border-2 border-black shadow-[2px_2px_0px_#0A0A0A]">
              <span className="font-mono text-[10px] font-black text-gray-600 uppercase flex items-center space-x-1">
                <Building2 className="h-3.5 w-3.5 text-black" />
                <span>EMPLOYER</span>
              </span>
              <p className="font-heading font-black text-base uppercase text-black mt-1">{placement.companyName}</p>
              <p className="font-mono text-[10px] text-gray-600 uppercase font-bold">{placement.jobTitle || 'GRADUATE TRAINEE'}</p>
            </div>

            <div className="bg-canvas p-4 border-2 border-black shadow-[2px_2px_0px_#0A0A0A]">
              <span className="font-mono text-[10px] font-black text-gray-600 uppercase flex items-center space-x-1">
                <DollarSign className="h-3.5 w-3.5 text-black" />
                <span>PACKAGE (CTC)</span>
              </span>
              <p className="font-heading font-black text-base uppercase text-emerald-700 mt-1">{placement.packageOffered || 'CONFIRMED'}</p>
              <p className="font-mono text-[10px] text-gray-600 uppercase font-bold">PER ANNUM</p>
            </div>

            <div className="bg-canvas p-4 border-2 border-black shadow-[2px_2px_0px_#0A0A0A]">
              <span className="font-mono text-[10px] font-black text-gray-600 uppercase flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5 text-black" />
                <span>JOINING TIMELINE</span>
              </span>
              <p className="font-heading font-black text-base uppercase text-black mt-1">
                {placement.joiningDate ? new Date(placement.joiningDate).toLocaleDateString() : 'SUMMER 2026'}
              </p>
              <p className="font-mono text-[10px] text-gray-600 uppercase font-bold">REPORTING DATE</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border-2 border-black p-8 sm:p-12 text-center shadow-brutal space-y-5">
          <div className="inline-flex p-4 bg-canvas text-black border-2 border-black shadow-[3px_3px_0px_#0A0A0A]">
            <Briefcase className="h-10 w-10 text-black" />
          </div>

          <div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-black uppercase">
              NO PLACEMENT OFFER RECORDED YET
            </h2>
            <p className="font-mono text-xs text-gray-700 font-bold max-w-md mx-auto mt-2 leading-relaxed">
              Your recruitment process is currently in progress. Apply for matching campus drives, clear technical assessments, and track interview calls.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/student/jobs"
              className="btn-primary text-xs px-6 py-3.5 inline-flex items-center space-x-2"
            >
              <span>EXPLORE OPEN CAMPUS DRIVES</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
