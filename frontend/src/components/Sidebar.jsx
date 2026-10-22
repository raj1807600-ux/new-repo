import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  User,
  BookOpen,
  BrainCircuit,
  Building2,
  Compass,
  FileText,
  ShieldCheck,
  Award,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { student, isAdmin } = useAuth();

  const studentLinks = [
    { name: 'Placement Prediction', path: '/dashboard', icon: Sparkles, badge: 'AI Model' },
    { name: 'Profile & Academics', path: '/profile', icon: User },
    { name: 'Skills, Projects & Resume', path: '/skills-experience', icon: BookOpen },
    { name: 'Diagnostic Assessments', path: '/assessments', icon: BrainCircuit },
    { name: 'Company Eligibility', path: '/companies', icon: Building2 },
    { name: 'Skill Gap & Roadmap', path: '/skill-gap', icon: Compass, badge: 'Adaptive' },
    { name: 'Readiness Dossier', path: '/reports', icon: FileText },
  ];

  const adminLinks = [
    { name: 'Institutional Analytics', path: '/admin', icon: ShieldCheck },
    { name: 'Placement Drives & Criteria', path: '/companies', icon: Building2 },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden lg:flex">
      <div className="space-y-6">
        
        {/* Student Mini Card if student */}
        {!isAdmin && student && (
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 via-oriental-navy to-oriental-dark text-white shadow-sm border border-slate-700/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center font-bold text-teal-300">
                {student.full_name?.charAt(0) || 'S'}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-semibold text-xs text-white truncate">{student.full_name}</h4>
                <p className="text-[10px] text-teal-300 font-mono">{student.enrollment_no}</p>
                <p className="text-[10px] text-slate-400 truncate">{student.branch} • Sem {student.current_semester}</p>
              </div>
            </div>

            {/* Profile Completion Bar */}
            <div className="mt-3 pt-2.5 border-t border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-300 mb-1">
                <span>Profile Readiness</span>
                <span className="font-semibold text-teal-400">{Math.round(student.profile_completion || 75)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${student.profile_completion || 75}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {isAdmin ? 'TPO Administration' : 'Placement Modules'}
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group ${
                    isActive
                      ? 'bg-oriental-navy text-white shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-oriental-navy hover:bg-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

      </div>

      {/* Advisory Institutional Box */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>OIST Placement Cell</span>
        </div>
        <p className="text-[10px] text-slate-400">
          Continuous AI intelligence tracking placement readiness for Oriental batch of 2026.
        </p>
      </div>

    </aside>
  );
};

export default Sidebar;
