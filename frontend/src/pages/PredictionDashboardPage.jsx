import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { predictionAPI, companyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '../components/CircularProgress';
import ReadinessRadar from '../components/ReadinessRadar';
import TrajectoryChart from '../components/TrajectoryChart';
import {
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Building2,
  Award,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Compass,
  Zap,
  Target
} from 'lucide-react';

const PredictionDashboardPage = () => {
  const { student, refreshProfile } = useAuth();
  const [prediction, setPrediction] = useState(null);
  const [trajectory, setTrajectory] = useState(null);
  const [recommendedCompanies, setRecommendedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningModel, setRunningModel] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchDashboardIntelligence();
  }, []);

  const fetchDashboardIntelligence = async () => {
    setLoading(true);
    try {
      const [predRes, trajRes, compRes] = await Promise.all([
        predictionAPI.getLatestPrediction(),
        predictionAPI.getCGPATrajectory(),
        companyAPI.getRecommended()
      ]);

      setPrediction(predRes.data.prediction);
      setTrajectory(trajRes.data.trajectory);
      setRecommendedCompanies(compRes.data.recommendations?.slice(0, 3) || []);
    } catch (err) {
      console.error('Error fetching prediction intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRerunPrediction = async () => {
    setRunningModel(true);
    setStatusMsg('');
    try {
      const res = await predictionAPI.runPrediction();
      setPrediction(res.data.prediction);
      await refreshProfile();
      await fetchDashboardIntelligence();
      setStatusMsg('AI placement model evaluated your latest profile data.');
    } catch (err) {
      console.error('Error running prediction:', err);
    } finally {
      setRunningModel(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span>Executing placement intelligence ensemble model...</span>
        </div>
      </div>
    );
  }

  const sub = prediction?.subscores || {};

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner Alert / Re-run Trigger */}
      <div className="bg-gradient-to-r from-oriental-navy via-oriental-dark to-slate-900 text-white p-6 rounded-3xl border border-slate-700/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Placement Intelligence Engine</span>
          </div>
          <h1 className="font-display font-bold text-xl text-white">
            Placement Readiness Profile for {student?.full_name}
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Model: <span className="font-mono text-teal-300">{prediction?.model_version || 'Ensemble-v1.0 (RF+GBM)'}</span> • Confidence: <span className="font-semibold text-white">{prediction?.confidence_score}%</span>
          </p>
        </div>

        <button
          onClick={handleRerunPrediction}
          disabled={runningModel}
          className="px-5 py-2.5 text-xs font-semibold text-oriental-navy bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${runningModel ? 'animate-spin' : ''}`} />
          <span>{runningModel ? 'Running ML Model...' : 'Re-evaluate Prediction'}</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Row 1: Core Probability & Composite Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Placement Probability Circular Gauge Card */}
        <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-between text-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Estimated Employability
            </span>
            <h3 className="font-bold text-sm text-slate-800">Placement Probability</h3>
          </div>

          <CircularProgress
            percentage={prediction?.placement_probability || 78}
            readinessLevel={prediction?.readiness_level || 'Strong'}
            label="Statistical Chance of Campus Placement"
          />

          <div className="w-full pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Readiness Score</span>
            <span className="font-bold text-slate-800">{prediction?.readiness_score} / 100</span>
          </div>
        </div>

        {/* Role Matching & Alternative Recommendations */}
        <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                  Predicted Job Fit
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-0.5">
                  Best-Fit Role: <span className="text-teal-700">{prediction?.best_fit_role}</span>
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                {prediction?.readiness_level} Tier
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Based on your academic SGPA velocity, technical skill proficiencies, DSA problem-solving ratings, and project complexity, our classifier identifies strong alignment with software development engineering profiles.
            </p>

            {/* Alternative Suitable Roles */}
            <div className="mt-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                Alternative Viable Career Tracks
              </h4>
              <div className="flex flex-wrap gap-2">
                {prediction?.alternative_roles?.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5"
                  >
                    <Target className="w-3 h-3 text-teal-600" />
                    <span>{role}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/companies"
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800 transition-all"
            >
              <span>Check Eligibility</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
            </Link>
            <Link
              to="/skill-gap"
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800 transition-all"
            >
              <span>Skill Gap Analysis</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
            </Link>
            <Link
              to="/reports"
              className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-800 transition-all"
            >
              <span>Download Dossier</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
            </Link>
          </div>
        </div>

      </div>

      {/* Row 2: 8-Axis Composite Readiness Radar & Horizontal Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800">8-Axis Placement Competency Radar</h3>
              <p className="text-xs text-slate-500">Multi-modal balance across collegiate parameters.</p>
            </div>
            <span className="text-xs font-extrabold text-teal-700">{prediction?.readiness_score}/100</span>
          </div>

          <ReadinessRadar subscores={sub} />
        </div>

        {/* Horizontal Progress Bars */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-800">Sub-Score Performance Breakdown</h3>
            <p className="text-xs text-slate-500">Normalized percentage across each evaluation pillar.</p>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { label: 'Academic Standing (CGPA & Attendance)', val: sub.academic || 80, color: 'bg-blue-600' },
              { label: 'Core Technical CS (DBMS, OS, Networks)', val: sub.technical || 75, color: 'bg-teal-600' },
              { label: 'Coding & Algorithmic Problem Solving (DSA)', val: sub.coding || 70, color: 'bg-emerald-600' },
              { label: 'Communication & Interview Fluency', val: sub.communication || 85, color: 'bg-cyan-600' },
              { label: 'Projects Portfolio & Technical Depth', val: sub.projects || 88, color: 'bg-purple-600' },
              { label: 'Industry Internships', val: sub.internships || 60, color: 'bg-amber-600' },
              { label: 'Certifications & Continuous Learning', val: sub.certifications || 55, color: 'bg-indigo-600' },
              { label: 'Resume Structure & ATS Keyword Density', val: sub.resume || 82, color: 'bg-rose-600' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-slate-700 font-medium mb-1">
                  <span>{item.label}</span>
                  <span className="font-bold">{item.val}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${item.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Academic Trajectory Projection Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-800">Academic CGPA Trajectory Forecast</h3>
            <p className="text-xs text-slate-500">
              Momentum trend analysis across semesters with target graduation sprint projections.
            </p>
          </div>

          {trajectory && (
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current CGPA</span>
                <span className="font-extrabold text-slate-800 text-sm">{trajectory.current_cgpa}</span>
              </div>
              <div className="pl-3 border-l border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Projected Final</span>
                <span className="font-extrabold text-teal-700 text-sm">{trajectory.projected_final_cgpa}</span>
              </div>
              <div className="pl-3 border-l border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Sprint</span>
                <span className="font-extrabold text-emerald-600 text-sm">{trajectory.best_case_final_cgpa}</span>
              </div>
            </div>
          )}
        </div>

        <TrajectoryChart trajectoryData={trajectory?.trajectory_chart || []} />
      </div>

      {/* Row 4: Top Recommended Company Matches for Current Student */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-800">Top Recommended Placement Drives</h3>
            <p className="text-xs text-slate-500">Corporate matches ranked by eligibility and skill alignment.</p>
          </div>
          <Link to="/companies" className="text-xs font-semibold text-teal-600 hover:underline flex items-center gap-1">
            <span>View All Drives</span> <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedCompanies.map((rec) => (
            <div key={rec.company.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                    Rank #{rec.rank}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-700">{rec.match_percentage}% Match</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{rec.company.name}</h4>
                <p className="text-xs text-slate-600">{rec.company.job_role}</p>
                <p className="text-xs font-bold text-slate-800 mt-1">{rec.company.ctc_formatted}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                <span>{rec.recommendation_reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory Institutional Advisory Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Advisory Notice:</strong> Placement probability, readiness scores, and company matches are predictive estimates generated by AI models based on available academic records, test scores, and profile information. They serve as diagnostic preparation tools and do not guarantee final hiring by corporate recruiters.
        </p>
      </div>

    </div>
  );
};

export default PredictionDashboardPage;
