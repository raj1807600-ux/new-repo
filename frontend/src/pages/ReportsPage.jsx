import React, { useState, useEffect } from 'react';
import { reportsAPI, predictionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  GraduationCap,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const ReportsPage = () => {
  const { student } = useAuth();
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportAndHistory();
  }, []);

  const fetchReportAndHistory = async () => {
    setLoading(true);
    try {
      const [repRes, histRes] = await Promise.all([
        reportsAPI.getStudentReportData(),
        predictionAPI.getPredictionHistory()
      ]);
      setReport(repRes.data.report);
      setHistory(histRes.data.history || []);
    } catch (err) {
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span>Generating placement readiness dossier report...</span>
        </div>
      </div>
    );
  }

  const pred = report?.prediction;
  const academic = report?.academic;
  const sub = pred?.subscores || {};

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Action Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">
            Placement Readiness Report & Growth Timeline
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official institutional dossier compiling AI readiness scores, academic trajectory, and skill matrices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Dossier</span>
          </button>

          <a
            href={reportsAPI.getPdfDownloadUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-teal-400" />
            <span>Download Official PDF</span>
          </a>
        </div>
      </div>

      {/* Historical Prediction Growth Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 print:hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-800">Month-over-Month Readiness Growth</h3>
            <p className="text-xs text-slate-500">Progression of probability and composite score across evaluation cycles.</p>
          </div>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month_label" tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis domain={[40, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b192c',
                  borderColor: '#1e3e62',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line
                type="monotone"
                dataKey="placement_probability"
                name="Placement Probability (%)"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="readiness_score"
                name="Readiness Score (/100)"
                stroke="#008080"
                strokeWidth={2}
                dot={{ r: 3, fill: '#008080' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PRINTABLE OFFICIAL DOSSIER SHEET */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-800">
        
        {/* Dossier Institutional Header */}
        <div className="border-b-2 border-oriental-navy pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-oriental-navy text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-7 h-7 text-teal-400" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-lg text-oriental-navy tracking-tight">
                ORIENTAL INSTITUTE OF SCIENCE & TECHNOLOGY, BHOPAL
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                Training & Placement Cell • AI Placement Readiness Assessment
              </p>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            <span>Doc ID: OIST-PRP-{student?.enrollment_no}</span>
            <span className="block">{report?.generated_at}</span>
          </div>
        </div>

        {/* Candidate Profile Details Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Candidate Name</span>
            <span className="font-bold text-slate-900">{student?.full_name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Enrollment Number</span>
            <span className="font-mono font-bold text-teal-700">{student?.enrollment_no}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Branch & Degree</span>
            <span className="font-bold text-slate-900">{student?.branch} ({student?.degree})</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Semester / Batch</span>
            <span className="font-bold text-slate-900">Sem {student?.current_semester} • {student?.passing_year}</span>
          </div>
        </div>

        {/* AI Prediction Summary Highlights */}
        {pred && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  Placement Readiness Verdict
                </span>
                <h3 className="font-bold text-lg text-white mt-0.5">
                  {pred.readiness_level} Readiness ({pred.placement_probability}% Probability)
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Best-Fit Job Role</span>
                <span className="text-sm font-extrabold text-teal-300">{pred.best_fit_role}</span>
              </div>
            </div>

            {/* Subscores Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
              {[
                { label: 'Academic', val: sub.academic || 80 },
                { label: 'Technical', val: sub.technical || 75 },
                { label: 'Coding', val: sub.coding || 70 },
                { label: 'Communication', val: sub.communication || 85 },
                { label: 'Projects', val: sub.projects || 88 },
                { label: 'Internships', val: sub.internships || 60 },
                { label: 'Certifications', val: sub.certifications || 55 },
                { label: 'Resume ATS', val: sub.resume || 82 }
              ].map((s, i) => (
                <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[9px] text-slate-400 uppercase block truncate">{s.label}</span>
                  <span className="font-extrabold text-teal-300 text-xs mt-0.5 block">{s.val}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Academic & Skills Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Academic Records */}
          <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Academic Parameters
            </h4>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between"><span>Current CGPA:</span><strong className="text-slate-900">{academic?.current_cgpa}</strong></div>
              <div className="flex justify-between"><span>10th Standard %:</span><strong>{academic?.tenth_percentage}%</strong></div>
              <div className="flex justify-between"><span>12th Standard %:</span><strong>{academic?.twelfth_percentage}%</strong></div>
              <div className="flex justify-between"><span>Active Backlogs:</span><strong className={academic?.active_backlogs > 0 ? 'text-red-600' : 'text-emerald-600'}>{academic?.active_backlogs || 0}</strong></div>
              <div className="flex justify-between"><span>Overall Attendance:</span><strong>{academic?.attendance_percentage}%</strong></div>
            </div>
          </div>

          {/* Key Mastered Skills */}
          <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Technical Skill Matrix
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {report?.skills?.slice(0, 10).map((sk, idx) => (
                <span key={idx} className="px-2 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-semibold">
                  {sk.skill_name} ({sk.proficiency})
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Projects Summary */}
        {report?.projects?.length > 0 && (
          <div className="p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Verified Project Portfolio
            </h4>
            <div className="space-y-2">
              {report.projects.slice(0, 2).map((p, idx) => (
                <div key={idx} className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{p.title}</span>
                    <p className="text-slate-500 text-[11px]">{p.technologies}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {p.complexity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legal Advisory Footer */}
        <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 leading-relaxed flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p>{report?.disclaimer}</p>
        </div>

      </div>

    </div>
  );
};

export default ReportsPage;
