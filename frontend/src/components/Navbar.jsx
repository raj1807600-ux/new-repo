import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  User,
  LogOut,
  Building2,
  BrainCircuit,
  BookOpen,
  BarChart3,
  Compass,
  FileText,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, student, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = isAuthenticated
    ? isAdmin
      ? [
          { name: 'TPO Intelligence', path: '/admin', icon: ShieldCheck },
          { name: 'Companies & Drives', path: '/companies', icon: Building2 },
        ]
      : [
          { name: 'Prediction', path: '/dashboard', icon: Sparkles },
          { name: 'Profile & Academics', path: '/profile', icon: User },
          { name: 'Skills & Resume', path: '/skills-experience', icon: BookOpen },
          { name: 'Assessments', path: '/assessments', icon: BrainCircuit },
          { name: 'Companies', path: '/companies', icon: Building2 },
          { name: 'Skill Gap & Roadmap', path: '/skill-gap', icon: Compass },
          { name: 'Dossier / Report', path: '/reports', icon: FileText },
        ]
    : [
        { name: 'Home', path: '/' },
        { name: 'Placement Journey', path: '/#journey' },
        { name: 'Assessment Pipeline', path: '/#assessments' },
        { name: 'Company Matching', path: '/#companies' },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-oriental-navy/95 backdrop-blur-md border-b border-slate-700/60 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Institutional Tagline */}
          <Link to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-oriental-blue to-teal-500 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-teal-200 bg-clip-text text-transparent">
                  ORIENTAL
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  OIST BHOPAL
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Placement Intelligence & Prediction
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
                    isActive(link.path)
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Auth Buttons / Profile Avatar */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
                <div className="text-right">
                  <p className="text-xs font-semibold text-white">
                    {student ? student.full_name : user.email}
                  </p>
                  <p className="text-[10px] text-teal-400">
                    {isAdmin ? 'TPO Administrator' : `${student?.branch || 'CSE'} • Sem ${student?.current_semester || 7}`}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-all duration-150"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors duration-150"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-semibold text-oriental-navy bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 rounded-lg shadow-sm shadow-teal-500/20 transition-all duration-150"
                >
                  Check Readiness
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-oriental-dark border-t border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-slate-200 bg-slate-800 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-oriental-navy bg-teal-400 rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
