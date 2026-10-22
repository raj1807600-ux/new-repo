import React, { useState, useEffect } from 'react';
import { skillGapAPI, predictionAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  Check
} from 'lucide-react';

const SkillGapPage = () => {
  const { student, refreshProfile } = useAuth();
  const [gapData, setGapData] = useState(null);
  const [roadmapTasks, setRoadmapTasks] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(student?.target_role || 'Software Developer');
  const [loading, setLoading] = useState(true);
  const [updatingRole, setUpdatingRole] = useState(false);

  useEffect(() => {
    fetchSkillGapAnalysis();
  }, []);

  const fetchSkillGapAnalysis = async (roleOverride) => {
    setLoading(true);
    try {
      const res = await skillGapAPI.getSkillGap(roleOverride || selectedRole);
      setGapData(res.data.analysis);
      setRoadmapTasks(res.data.roadmap_tasks || []);
      setAvailableRoles(res.data.available_roles || []);
      if (res.data.analysis?.target_role) {
        setSelectedRole(res.data.analysis.target_role);
      }
    } catch (err) {
      console.error('Error fetching skill gap data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (newRole) => {
    setSelectedRole(newRole);
    setUpdatingRole(true);
    try {
      const res = await skillGapAPI.setTargetRole(newRole);
      setGapData(res.data.analysis);
      setRoadmapTasks(res.data.roadmap_tasks || []);
      await predictionAPI.runPrediction();
      await refreshProfile();
    } catch (err) {
      console.error('Error changing target role:', err);
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const res = await skillGapAPI.toggleRoadmapTask(taskId);
      setRoadmapTasks((prev) =>
        prev.map((t) => (t.id === taskId ? res.data.task : t))
      );
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span>Analyzing skill gap against target role requirements...</span>
        </div>
      </div>
    );
  }

  const completedCount = roadmapTasks.filter((t) => t.is_completed).length;
  const progressPct = roadmapTasks.length > 0 ? (completedCount / roadmapTasks.length) * 100 : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Target Role Selector */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Target Competency Matrix</span>
          </div>
          <h1 className="font-display font-bold text-xl text-slate-900">
            Skill-Gap Analysis & Actionable Roadmap
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify missing technical competencies and follow your customized 6-week placement preparation schedule.
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Target Role:</span>
          <select
            value={selectedRole}
            disabled={updatingRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="px-3 py-2 text-xs font-bold text-oriental-navy bg-slate-50 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
          >
            {availableRoles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gap Diagnosis Summary Banner */}
      {gapData && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Match Metric */}
          <div className="md:col-span-4 bg-gradient-to-br from-oriental-navy to-oriental-dark text-white p-6 rounded-3xl border border-slate-700 shadow-md flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">
                Competency Match
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-extrabold font-display text-white">
                  {gapData.match_percentage}%
                </span>
                <span className="text-xs text-teal-300">Alignment</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {gapData.gap_summary}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 border border-white/10">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Primary Gap Domain</span>
              <span className="text-xs font-bold text-white mt-0.5 block">{gapData.primary_gap_area}</span>
            </div>
          </div>

          {/* Matched vs Missing Skills Cards */}
          <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            
            {/* Matched Skills */}
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-emerald-800 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mastered Skills for this Role ({gapData.matched_skills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {gapData.matched_skills?.map((sk, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-rose-800 mb-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Missing Competencies ({gapData.missing_skills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {gapData.missing_skills?.length > 0 ? (
                  gapData.missing_skills.map((sk, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      + {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 font-medium">All core technical competencies satisfied!</span>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 6-Week Progressive Actionable Roadmap */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              6-Week Personalized Preparation Roadmap
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeted week-by-week sprints designed to bridge your {gapData?.primary_gap_area || 'technical'} gap before campus drives.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Roadmap Completed</span>
              <span className="text-xs font-bold text-teal-700">{completedCount} of {roadmapTasks.length} Tasks ({Math.round(progressPct)}%)</span>
            </div>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        {/* Roadmap Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmapTasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                task.is_completed
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-slate-50 border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    task.is_completed ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-700'
                  }`}>
                    Week {task.week_number} • {task.topic}
                  </span>

                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      task.is_completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-teal-500 bg-white'
                    }`}
                  >
                    {task.is_completed && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <h4 className={`font-bold text-sm leading-snug ${task.is_completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                  {task.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {task.description}
                </p>
              </div>

              {/* Resources */}
              {task.recommended_resources?.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-500">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Recommended Practice:</span>
                  {task.recommended_resources.map((res, idx) => (
                    <p key={idx} className="truncate">• {res.name}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SkillGapPage;
