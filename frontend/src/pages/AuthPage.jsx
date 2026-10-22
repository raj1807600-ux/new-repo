import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  Lock,
  Mail,
  User,
  Hash,
  BookOpen,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const AuthPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: 'login' | 'register' | 'forgot'
  const isRegisterInitial = location.pathname.includes('/register');
  const [mode, setMode] = useState(isRegisterInitial ? 'register' : 'login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regData, setRegData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    enrollment_no: '',
    branch: 'CSE',
    degree: 'B.Tech',
    current_semester: 7,
    passing_year: 2026,
    cgpa: 7.5,
    tenth_percentage: 80.0,
    twelfth_percentage: 78.0,
    attendance_percentage: 82.0
  });

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick 1-click demo login helpers
  const handleQuickDemoLogin = async (role) => {
    setErrorMsg('');
    setLoading(true);
    try {
      if (role === 'student') {
        await login('student@oriental.ac.in', 'Student@123');
        navigate('/dashboard');
      } else {
        await login('admin@oriental.ac.in', 'Admin@123');
        navigate('/admin');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to login with demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (res.user.role === 'admin' || res.user.role === 'tpo') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (regData.password !== regData.confirm_password) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (regData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(regData);
      navigate('/profile');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Registration failed. Please check your fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-100">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Visual / Branding Column */}
        <div className="md:col-span-5 bg-gradient-to-br from-oriental-navy via-oriental-dark to-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-oriental-navy font-bold shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base tracking-tight text-white">
                  Oriental Institute
                </h3>
                <p className="text-[10px] text-teal-300 uppercase tracking-widest font-semibold">
                  OIST Bhopal Placement Cell
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-display font-extrabold text-2xl text-white leading-snug">
                Empowering Career Success through AI.
              </h2>
              <p className="text-slate-300 text-xs leading-relaxed">
                Log in to access your placement probability, academic trajectory, diagnostic test scores, company eligibility match, and personalized 6-week roadmap.
              </p>
            </div>

            {/* 1-Click Demo Login Shortcuts */}
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                1-Click Demo Credentials
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('student')}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-xs text-white border border-slate-700/60 flex items-center justify-between group transition-all"
                >
                  <div>
                    <span className="font-semibold block">Student Demo</span>
                    <span className="text-[10px] text-slate-400">student@oriental.ac.in</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="w-full text-left px-3 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-xs text-white border border-slate-700/60 flex items-center justify-between group transition-all"
                >
                  <div>
                    <span className="font-semibold block">TPO Admin Demo</span>
                    <span className="text-[10px] text-slate-400">admin@oriental.ac.in</span>
                  </div>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          <div className="relative z-10 pt-6 text-[10px] text-slate-400 border-t border-slate-800">
            Opp. Patel Nagar, Raisen Road, Bhopal, MP - 462021
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-8 flex flex-col justify-center">
          
          {/* Header Toggle */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-display font-bold text-xl text-oriental-navy">
                {mode === 'login' && 'Sign In to Portal'}
                {mode === 'register' && 'Student Registration'}
                {mode === 'forgot' && 'Password Recovery'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {mode === 'login' && 'Enter your institutional credentials'}
                {mode === 'register' && 'Register your Oriental student profile'}
                {mode === 'forgot' && 'Reset your placement portal password'}
              </p>
            </div>
            
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); }}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mode === 'login' ? 'bg-white text-oriental-navy shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMsg(''); }}
                className={`px-3 py-1 rounded-lg transition-all ${
                  mode === 'register' ? 'bg-white text-oriental-navy shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="enrollment@oriental.ac.in"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-medium text-teal-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* 2. Registration Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regData.full_name}
                    onChange={(e) => setRegData({ ...regData, full_name: e.target.value })}
                    placeholder="e.g. Priyanshu Sharma"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enrollment Number</label>
                  <input
                    type="text"
                    required
                    value={regData.enrollment_no}
                    onChange={(e) => setRegData({ ...regData, enrollment_no: e.target.value.toUpperCase() })}
                    placeholder="e.g. 0105CS211045"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  placeholder="student@oriental.ac.in"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
                  <select
                    value={regData.branch}
                    onChange={(e) => setRegData({ ...regData, branch: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    <option value="CSE">Computer Science & Engg (CSE)</option>
                    <option value="IT">Information Technology (IT)</option>
                    <option value="AIML">Artificial Intelligence & ML (AI&DS)</option>
                    <option value="EC">Electronics & Comm (EC)</option>
                    <option value="ME">Mechanical Engg (ME)</option>
                    <option value="EX">Electrical & Electronics (EX)</option>
                    <option value="CE">Civil Engg (CE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Semester</label>
                  <select
                    value={regData.current_semester}
                    onChange={(e) => setRegData({ ...regData, current_semester: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={regData.cgpa}
                    onChange={(e) => setRegData({ ...regData, cgpa: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Passing Year</label>
                  <input
                    type="number"
                    value={regData.passing_year}
                    onChange={(e) => setRegData({ ...regData, passing_year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={regData.confirm_password}
                    onChange={(e) => setRegData({ ...regData, confirm_password: e.target.value })}
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-semibold text-oriental-navy bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Register & Create Profile'}
              </button>
            </form>
          )}

          {/* 3. Forgot Password Form */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {forgotSent ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-xs text-emerald-900">Recovery Link Dispatched</h4>
                  <p className="text-[11px] text-emerald-700">
                    If {forgotEmail} is registered in the Oriental database, recovery instructions have been sent.
                  </p>
                  <button
                    onClick={() => { setMode('login'); setForgotSent(false); }}
                    className="mt-2 text-xs font-semibold text-teal-700 underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setForgotSent(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Registered Email</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="student@oriental.ac.in"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-md transition-all"
                  >
                    Send Recovery Link
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Return to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AuthPage;
