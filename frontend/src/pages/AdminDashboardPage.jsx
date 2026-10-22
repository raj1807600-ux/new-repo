import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Building2,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Sparkles,
  BarChart3,
  Award,
  CheckCircle2,
  X,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#10b981', '#008080', '#f59e0b', '#f97316', '#ef4444'];

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [readinessFilter, setReadinessFilter] = useState('');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [showCreateCompanyModal, setShowCreateCompanyModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // New Company form
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'IT / Software Services',
    job_role: '',
    job_location: 'Bhopal / Pune / Bangalore',
    tier: 'Tier 1',
    ctc_min_lpa: 4.5,
    ctc_max_lpa: 7.5,
    min_cgpa: 6.5,
    max_active_backlogs: 0,
    eligible_branches: ['CSE', 'IT', 'EC', 'AIML'],
    required_skills: ['Java', 'SQL', 'Data Structures & Algorithms']
  });

  useEffect(() => {
    fetchAdminData();
  }, [branchFilter, readinessFilter]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, stRes] = await Promise.all([
        adminAPI.getStatistics(),
        adminAPI.getStudents({
          branch: branchFilter || undefined,
          readiness: readinessFilter || undefined,
          search: search || undefined
        })
      ]);
      setStats(statsRes.data);
      setStudents(stRes.data.students || []);
    } catch (err) {
      console.error('Error fetching admin statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdminData();
  };

  const handleStudentClick = async (studentId) => {
    try {
      const res = await adminAPI.getStudentDetail(studentId);
      setSelectedStudentDetail(res.data.student_details);
    } catch (err) {
      console.error('Error getting student detail:', err);
    }
  };

  const handleTriggerPrediction = async (studentId) => {
    try {
      await adminAPI.triggerStudentPrediction(studentId);
      setStatusMsg('AI placement model updated for candidate.');
      fetchAdminData();
      if (selectedStudentDetail) {
        handleStudentClick(studentId);
      }
    } catch (err) {
      console.error('Error triggering prediction:', err);
    }
  };

  const handleCreateCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createCompany(newCompany);
      setStatusMsg(`Placement drive created for ${newCompany.name}`);
      setShowCreateCompanyModal(false);
      fetchAdminData();
    } catch (err) {
      console.error('Error creating company:', err);
    }
  };

  if (loading && !stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading TPO institutional analytics and student cohorts...</span>
        </div>
      </div>
    );
  }

  const overview = stats?.overview || {};
  const readinessPieData = stats?.readiness_distribution
    ? Object.entries(stats.readiness_distribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-oriental-navy via-oriental-dark to-slate-900 text-white p-6 rounded-3xl border border-slate-700 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Training & Placement Cell (TPO) • OIST Bhopal</span>
          </div>
          <h1 className="font-display font-bold text-xl text-white">
            Institutional Placement Intelligence & Cohort Analytics
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time readiness monitoring, department benchmarking, and corporate recruitment drive orchestration.
          </p>
        </div>

        <button
          onClick={() => setShowCreateCompanyModal(true)}
          className="px-5 py-2.5 text-xs font-bold text-oriental-navy bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Placement Drive</span>
        </button>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Registered Students</span>
          <span className="text-3xl font-extrabold font-display text-slate-900">{overview.total_students || 0}</span>
          <span className="text-[11px] text-teal-600 font-semibold block">Across 7 Engg Branches</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Placement-Ready</span>
          <span className="text-3xl font-extrabold font-display text-emerald-600">{overview.placement_ready_percentage}%</span>
          <span className="text-[11px] text-slate-500 font-medium block">{overview.placement_ready_students} Students Strong/Ready</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Average Institutional CGPA</span>
          <span className="text-3xl font-extrabold font-display text-oriental-blue">{overview.average_cgpa || '7.5'}</span>
          <span className="text-[11px] text-slate-500 font-medium block">Avg Readiness: {overview.average_readiness_score}/100</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Interventions Needed</span>
          <span className="text-3xl font-extrabold font-display text-rose-600">{overview.students_needing_intervention || 0}</span>
          <span className="text-[11px] text-rose-600 font-medium block">Score &lt; 50% / Needs Sprint</span>
        </div>

      </div>

      {/* Row 2: Department-wise Breakdown & Readiness Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Branch Breakdown Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Department-wise Readiness Benchmark</h3>
              <p className="text-xs text-slate-500">Average placement readiness score across Oriental engineering branches.</p>
            </div>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.branch_breakdown || []} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="branch" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
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
                <Bar dataKey="avg_readiness" name="Avg Readiness Score" fill="#008080" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness Distribution Pie */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-800">Cohort Readiness Distribution</h3>
            <p className="text-xs text-slate-500">Tier distribution across student population.</p>
          </div>

          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={readinessPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {readinessPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {readinessPieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-600 truncate">{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 3: Student Directory with Filters & Drill-down */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Student Directory & Profiles</h3>
            <p className="text-xs text-slate-500">Filter students by branch or placement readiness tier.</p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student or enrollment..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none w-48 sm:w-60"
              />
            </form>

            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="">All Branches</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="AIML">AI&DS</option>
              <option value="EC">EC</option>
              <option value="ME">ME</option>
              <option value="EX">EX</option>
              <option value="CE">CE</option>
            </select>

            <select
              value={readinessFilter}
              onChange={(e) => setReadinessFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="">All Readiness Tiers</option>
              <option value="Excellent">Excellent</option>
              <option value="Strong">Strong</option>
              <option value="Moderate">Moderate</option>
              <option value="Developing">Developing</option>
              <option value="Needs Improvement">Needs Improvement</option>
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 rounded-l-lg">Student / Enrollment</th>
                <th className="px-4 py-2.5">Branch</th>
                <th className="px-4 py-2.5">CGPA</th>
                <th className="px-4 py-2.5">Backlogs</th>
                <th className="px-4 py-2.5">Placement Probability</th>
                <th className="px-4 py-2.5">Readiness Tier</th>
                <th className="px-4 py-2.5 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5">
                    <div className="font-bold text-slate-900">{st.full_name}</div>
                    <div className="text-[10px] text-teal-700 font-mono">{st.enrollment_no}</div>
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-slate-800">{st.branch}</td>
                  <td className="px-4 py-2.5 font-semibold">{st.cgpa}</td>
                  <td className="px-4 py-2.5">
                    {st.active_backlogs > 0 ? (
                      <span className="text-red-600 font-bold">{st.active_backlogs}</span>
                    ) : (
                      <span className="text-emerald-600 font-medium">0</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="font-extrabold text-teal-700">{st.placement_probability || 'N/A'}%</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      st.readiness_level === 'Excellent' || st.readiness_level === 'Strong'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : st.readiness_level === 'Moderate'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {st.readiness_level}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => handleStudentClick(st.id)}
                      className="px-3 py-1 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-all"
                    >
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* STUDENT DETAIL MODAL */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">Candidate Dossier</span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">{selectedStudentDetail.student?.full_name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedStudentDetail.student?.enrollment_no} • {selectedStudentDetail.student?.branch}</p>
              </div>

              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prediction snapshot */}
            {selectedStudentDetail.prediction && (
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-teal-300 font-bold">Placement Probability: {selectedStudentDetail.prediction.placement_probability}%</span>
                  <span className="font-semibold">{selectedStudentDetail.prediction.readiness_level}</span>
                </div>
                <p className="text-slate-300">Predicted Best-Fit Role: <strong className="text-white">{selectedStudentDetail.prediction.best_fit_role}</strong></p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Academic Summary</span>
                <p>CGPA: <strong>{selectedStudentDetail.academic?.current_cgpa}</strong></p>
                <p>Active Backlogs: <strong>{selectedStudentDetail.academic?.active_backlogs || 0}</strong></p>
                <p>Attendance: <strong>{selectedStudentDetail.academic?.attendance_percentage}%</strong></p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Portfolio</span>
                <p>Skills Logged: <strong>{selectedStudentDetail.skills?.length || 0}</strong></p>
                <p>Projects: <strong>{selectedStudentDetail.projects?.length || 0}</strong></p>
                <p>Internships: <strong>{selectedStudentDetail.internships?.length || 0}</strong></p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => handleTriggerPrediction(selectedStudentDetail.student.id)}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Re-run AI Prediction</span>
              </button>

              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE COMPANY MODAL */}
      {showCreateCompanyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Add New Placement Drive</h3>
              <button onClick={() => setShowCreateCompanyModal(false)} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompanySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Role</label>
                  <input
                    type="text"
                    required
                    value={newCompany.job_role}
                    onChange={(e) => setNewCompany({ ...newCompany, job_role: e.target.value })}
                    placeholder="e.g. Software Development Engineer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recruitment Tier</label>
                  <select
                    value={newCompany.tier}
                    onChange={(e) => setNewCompany({ ...newCompany, tier: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Tier 1">Tier 1 (4 - 8 LPA)</option>
                    <option value="Dream">Dream (8 - 12 LPA)</option>
                    <option value="Super Dream">Super Dream (12+ LPA)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CTC Min (LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCompany.ctc_min_lpa}
                    onChange={(e) => setNewCompany({ ...newCompany, ctc_min_lpa: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CTC Max (LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCompany.ctc_max_lpa}
                    onChange={(e) => setNewCompany({ ...newCompany, ctc_max_lpa: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min CGPA Cutoff</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCompany.min_cgpa}
                    onChange={(e) => setNewCompany({ ...newCompany, min_cgpa: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Active Backlogs</label>
                  <input
                    type="number"
                    value={newCompany.max_active_backlogs}
                    onChange={(e) => setNewCompany({ ...newCompany, max_active_backlogs: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateCompanyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-md"
                >
                  Publish Placement Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardPage;
