import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI, predictionAPI } from '../services/api';
import TrajectoryChart from '../components/TrajectoryChart';
import {
  User,
  GraduationCap,
  TrendingUp,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  BookOpen,
  Calendar,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';

const StudentProfilePage = () => {
  const { student, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'academics' | 'semesters'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Personal form state
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    gender: 'Male',
    date_of_birth: '',
    address: '',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    branch: 'CSE',
    degree: 'B.Tech',
    current_semester: 7,
    passing_year: 2026,
    target_role: 'Software Developer',
    bio: ''
  });

  // Academic state
  const [academicData, setAcademicData] = useState({
    current_cgpa: 7.5,
    tenth_percentage: 80.0,
    twelfth_percentage: 78.0,
    diploma_percentage: '',
    active_backlogs: 0,
    history_backlogs: 0,
    attendance_percentage: 82.0
  });

  // Semesters & Trajectory
  const [semesterRecords, setSemesterRecords] = useState([]);
  const [trajectory, setTrajectory] = useState(null);

  // New semester input row
  const [newSem, setNewSem] = useState({
    semester_number: 1,
    sgpa: 7.5,
    credits: 24.0,
    backlogs_in_sem: 0
  });

  useEffect(() => {
    fetchStudentFullData();
  }, []);

  const fetchStudentFullData = async () => {
    setLoading(true);
    try {
      const [profileRes, academicRes] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getAcademics()
      ]);

      const st = profileRes.data.student;
      setProfileData({
        full_name: st.full_name || '',
        phone: st.phone || '',
        gender: st.gender || 'Male',
        date_of_birth: st.date_of_birth || '',
        address: st.address || '',
        city: st.city || 'Bhopal',
        state: st.state || 'Madhya Pradesh',
        branch: st.branch || 'CSE',
        degree: st.degree || 'B.Tech',
        current_semester: st.current_semester || 7,
        passing_year: st.passing_year || 2026,
        target_role: st.target_role || 'Software Developer',
        bio: st.bio || ''
      });

      if (academicRes.data.academic_record) {
        const ac = academicRes.data.academic_record;
        setAcademicData({
          current_cgpa: ac.current_cgpa || 7.5,
          tenth_percentage: ac.tenth_percentage || 80.0,
          twelfth_percentage: ac.twelfth_percentage || 78.0,
          diploma_percentage: ac.diploma_percentage || '',
          active_backlogs: ac.active_backlogs || 0,
          history_backlogs: ac.history_backlogs || 0,
          attendance_percentage: ac.attendance_percentage || 82.0
        });
      }

      setSemesterRecords(academicRes.data.semester_records || []);
      setTrajectory(academicRes.data.trajectory || null);
      setNewSem((prev) => ({ ...prev, semester_number: (academicRes.data.semester_records?.length || 0) + 1 }));
    } catch (err) {
      console.error('Error fetching academic data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await studentAPI.updateProfile(profileData);
      await refreshProfile();
      setSuccessMsg('Personal profile information saved successfully.');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAcademicSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await studentAPI.saveAcademics(academicData);
      await refreshProfile();
      await fetchStudentFullData();
      setSuccessMsg('Academic records and cutoffs updated.');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to save academic records.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSemester = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await studentAPI.saveSemester(newSem);
      await refreshProfile();
      await fetchStudentFullData();
      setSuccessMsg(`Semester ${newSem.semester_number} SGPA recorded.`);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to add semester SGPA.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading student profile and academic metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header Profile Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-oriental-navy to-oriental-blue text-white flex items-center justify-center font-bold text-xl shadow-md">
            {profileData.full_name?.charAt(0) || 'S'}
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-slate-900">
              {profileData.full_name || 'Student Profile'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Enrollment: <span className="font-mono text-teal-700 font-semibold">{student?.enrollment_no}</span> • {profileData.branch} ({profileData.degree})
            </p>
          </div>
        </div>

        {/* Completion Gauge Badge */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Profile Completion</span>
            <span className="text-sm font-extrabold text-teal-600">{Math.round(student?.profile_completion || 75)}%</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'personal', label: '1. Personal Profile', icon: User },
          { id: 'academics', label: '2. Academic Cutoffs & Backlogs', icon: GraduationCap },
          { id: 'semesters', label: '3. Semester SGPA Timeline & Trajectory', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-oriental-navy text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4 text-teal-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Personal Profile */}
      {activeTab === 'personal' && (
        <form onSubmit={handleProfileSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-800">Candidate Identity & Contact</h3>
            <p className="text-xs text-slate-500">Official student registration records verified by OIST TPO cell.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profileData.full_name}
                onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={profileData.gender}
                onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={profileData.date_of_birth}
                onChange={(e) => setProfileData({ ...profileData, date_of_birth: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
              <select
                value={profileData.branch}
                onChange={(e) => setProfileData({ ...profileData, branch: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="CSE">Computer Science & Engineering (CSE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="AIML">Artificial Intelligence & ML (AI&DS)</option>
                <option value="EC">Electronics & Communication (EC)</option>
                <option value="ME">Mechanical Engineering (ME)</option>
                <option value="EX">Electrical & Electronics (EX)</option>
                <option value="CE">Civil Engineering (CE)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Semester</label>
              <select
                value={profileData.current_semester}
                onChange={(e) => setProfileData({ ...profileData, current_semester: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Placement Role</label>
              <input
                type="text"
                value={profileData.target_role}
                onChange={(e) => setProfileData({ ...profileData, target_role: e.target.value })}
                placeholder="e.g. Software Developer, Full Stack Developer"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                placeholder="Hostel / Local Address, Bhopal"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Bio</label>
            <textarea
              rows={3}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              placeholder="Brief professional profile summary highlight for recruiters..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Personal Profile'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Academic Cutoffs */}
      {activeTab === 'academics' && (
        <form onSubmit={handleAcademicSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-800">Academic Percentages & Eligibility Factors</h3>
            <p className="text-xs text-slate-500">Corporate recruiters use these strict parameters to filter drive registrations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Cumulative CGPA (Scale 10.0)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={academicData.current_cgpa}
                onChange={(e) => setAcademicData({ ...academicData, current_cgpa: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-bold text-teal-700 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">10th Standard Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                required
                value={academicData.tenth_percentage}
                onChange={(e) => setAcademicData({ ...academicData, tenth_percentage: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">12th Standard Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={academicData.twelfth_percentage}
                onChange={(e) => setAcademicData({ ...academicData, twelfth_percentage: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Active Backlogs (Current)</label>
              <input
                type="number"
                min="0"
                required
                value={academicData.active_backlogs}
                onChange={(e) => setAcademicData({ ...academicData, active_backlogs: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none font-semibold text-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">History of Backlogs (Cleared)</label>
              <input
                type="number"
                min="0"
                value={academicData.history_backlogs}
                onChange={(e) => setAcademicData({ ...academicData, history_backlogs: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Overall Attendance (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={academicData.attendance_percentage}
                onChange={(e) => setAcademicData({ ...academicData, attendance_percentage: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Update Academic Cutoffs'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Semester SGPA Timeline & Trajectory Chart */}
      {activeTab === 'semesters' && (
        <div className="space-y-6">
          
          {/* Trajectory Forecast Chart Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Academic SGPA Progression & Final CGPA Projection</h3>
                <p className="text-xs text-slate-500">
                  Statistical regression trajectory modeling based on completed semesters.
                </p>
              </div>

              {trajectory && (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Projected Graduation CGPA</span>
                    <span className="text-sm font-extrabold text-teal-700">{trajectory.projected_final_cgpa}</span>
                  </div>
                  <div className="text-right pl-3 border-l border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Sprint Potential</span>
                    <span className="text-sm font-extrabold text-emerald-600">{trajectory.best_case_final_cgpa}</span>
                  </div>
                </div>
              )}
            </div>

            <TrajectoryChart trajectoryData={trajectory?.trajectory_chart || []} />
          </div>

          {/* Add / Edit Semester SGPA Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Semester-wise SGPA Breakdown
            </h4>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5 rounded-l-lg">Semester</th>
                    <th className="px-4 py-2.5">SGPA</th>
                    <th className="px-4 py-2.5">Calculated %</th>
                    <th className="px-4 py-2.5">Credits</th>
                    <th className="px-4 py-2.5 rounded-r-lg">Backlogs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {semesterRecords.length > 0 ? (
                    semesterRecords.map((sem) => (
                      <tr key={sem.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-bold text-slate-800">Semester {sem.semester_number}</td>
                        <td className="px-4 py-2.5 font-semibold text-teal-700">{sem.sgpa}</td>
                        <td className="px-4 py-2.5">{sem.percentage}%</td>
                        <td className="px-4 py-2.5">{sem.credits}</td>
                        <td className="px-4 py-2.5">
                          {sem.backlogs_in_sem > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                              {sem.backlogs_in_sem} Backlog
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-medium">Nil</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                        No semester records added yet. Add your past semester SGPAs below.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Semester Form */}
            <form onSubmit={handleAddSemester} className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Semester</label>
                <select
                  value={newSem.semester_number}
                  onChange={(e) => setNewSem({ ...newSem, semester_number: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Sem {s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">SGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={newSem.sgpa}
                  onChange={(e) => setNewSem({ ...newSem, sgpa: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Credits</label>
                <input
                  type="number"
                  value={newSem.credits}
                  onChange={(e) => setNewSem({ ...newSem, credits: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Backlogs in Sem</label>
                <input
                  type="number"
                  min="0"
                  value={newSem.backlogs_in_sem}
                  onChange={(e) => setNewSem({ ...newSem, backlogs_in_sem: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="py-2 px-4 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Record Sem</span>
              </button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default StudentProfilePage;
