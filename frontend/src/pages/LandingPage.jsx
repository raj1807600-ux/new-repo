import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  TrendingUp,
  Building2,
  BrainCircuit,
  Compass,
  FileCheck,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  BarChart3,
  Layers,
  Briefcase
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. Hero Section with Institutional Gradient & Campus Branding */}
      <section className="relative overflow-hidden bg-oriental-navy text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Abstract background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Oriental Group of Institutes • OIST Bhopal</span>
              </div>

              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                Know Your Placement Readiness <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-teal-300 via-cyan-200 to-emerald-400 bg-clip-text text-transparent">
                  Before the Placement Drive.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                AI-powered placement intelligence engineered for Oriental students. Evaluate multi-modal employability, predict company eligibility, analyze skill gaps, project CGPA trajectories, and follow a personalized 6-week preparation roadmap.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/register"
                  className="px-6 py-3 text-sm font-semibold text-oriental-navy bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 rounded-xl shadow-lg shadow-teal-500/25 flex items-center gap-2 group transition-all duration-150"
                >
                  <span>Check My Readiness</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all duration-150"
                >
                  Explore Platform
                </Link>
              </div>

              {/* Advisory Disclaimer Notice */}
              <div className="pt-2 flex items-center gap-2 text-[11px] text-amber-300/90">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Predictions are advisory estimates based on student data and do not guarantee placement.</span>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-oriental-dark/95 border border-slate-700/80 shadow-2xl p-6 backdrop-blur-xl">
                
                {/* Header of Simulated Card */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center font-bold text-teal-300 text-sm">
                      PS
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Priyanshu Sharma</h4>
                      <p className="text-[10px] text-teal-400 font-mono">0105CS211045 • OIST CSE</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Strong Readiness
                  </span>
                </div>

                {/* Score Showcase */}
                <div className="grid grid-cols-2 gap-4 my-5">
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Placement Probability
                    </span>
                    <span className="text-3xl font-extrabold font-display text-emerald-400">82%</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Top 10% in Cohort</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                      Readiness Score
                    </span>
                    <span className="text-3xl font-extrabold font-display text-teal-400">83.5</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">Scale: 0 - 100</span>
                  </div>
                </div>

                {/* Dimensions breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-[11px]">Academic & SGPA Trajectory</span>
                    <span className="font-semibold text-white">7.84 CGPA (Est. 8.02)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-[11px]">Eligible Company Drives</span>
                    <span className="font-semibold text-teal-300">8 Active / 2 Dream</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-[11px]">Predicted Best-Fit Role</span>
                    <span className="font-semibold text-emerald-300">Software Developer</span>
                  </div>
                </div>

                {/* Interactive Action Prompt */}
                <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Ensemble ML Model v1.0</span>
                  <Link to="/login" className="text-xs font-semibold text-teal-300 hover:text-teal-200 flex items-center gap-1">
                    Live Demo View <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Key Institutional Highlights & Metrics */}
      <section className="bg-white border-y border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-oriental-navy block">
                17 Acres
              </span>
              <span className="text-xs font-medium text-slate-600 mt-1 block">
                State-of-the-art Bhopal Campus
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-teal-700 block">
                150+
              </span>
              <span className="text-xs font-medium text-slate-600 mt-1 block">
                Visiting Corporate Recruiters
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-oriental-blue block">
                ₹18 LPA
              </span>
              <span className="text-xs font-medium text-slate-600 mt-1 block">
                Highest Placement Package
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-700 block">
                100%
              </span>
              <span className="text-xs font-medium text-slate-600 mt-1 block">
                Placement Assistance Support
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. The 6-Step Placement Readiness Journey */}
      <section id="journey" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-2">
              Comprehensive Journey
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-oriental-navy">
              How the Placement Intelligence System Works
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              From academic ingestion to predictive AI assessment and personalized preparation roadmaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-2">Profile & Academic Ingestion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your 10th, 12th/Diploma, and semester-wise SGPAs. The platform tracks your academic velocity and calculates real-time CGPA metrics.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-oriental-blue border border-blue-100 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-2">Diagnostic Assessments</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take standardized aptitude, core computer science, coding/DSA, and communication diagnostic tests designed around TCS, Infosys, and Cisco patterns.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-2">AI Placement Prediction</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our Scikit-Learn ensemble model evaluates your composite multi-modal features to compute placement probability, readiness level, and best-fit roles.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-2">Company Eligibility Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluate live corporate eligibility rules across CGPA cutoffs, backlog history, eligible branches, and required technical proficiencies.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center font-bold text-lg mb-4">
                5
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-2">Skill-Gap & 6-Week Roadmap</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identify your primary gap domains against target job roles and follow an adaptive, week-by-week sprint with practice sheets and mock tests.
              </p>
            </div>

            {/* Step 6 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold text-lg mb-4">
                6
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-2">Dossier & TPO Intelligence</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate verified PDF placement readiness reports for college drives while TPOs monitor cohort analytics, readiness trends, and branch performance.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Core Features Showcase */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-2">
                Predictive Architecture
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-oriental-navy mb-4">
                Not Just a Percentage. <br />
                A Complete Employability Profile.
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Standard platforms only look at marks. The Oriental Placement Intelligence System evaluates 16+ multi-modal dimensions across academic trajectory, practical projects, internships, ATS resume structure, and cognitive assessment performance.
              </p>

              <div className="space-y-3">
                {[
                  'Multi-Model Ensemble (Random Forest + Gradient Boosting + Logistic Regression)',
                  'Dynamic SGPA velocity and final CGPA trajectory forecasting',
                  'Deterministic company eligibility rules (CGPA, backlogs, branch, skills)',
                  'ATS resume formatting and technical keyword audit',
                  'Actionable 6-week week-by-week intervention roadmap',
                  'TPO departmental analytics and cohort intervention tracking'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  to="/register"
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
                >
                  Start Assessment Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Feature Graphic Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <BrainCircuit className="w-6 h-6 text-teal-600" />
                <h4 className="font-bold text-sm text-slate-800">ML Prediction Engine</h4>
                <p className="text-xs text-slate-600">Calibrated placement probability and role suitability classification.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h4 className="font-bold text-sm text-slate-800">Academic Trajectory</h4>
                <p className="text-xs text-slate-600">Semester SGPA progression and projected final graduation CGPA.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <Building2 className="w-6 h-6 text-amber-600" />
                <h4 className="font-bold text-sm text-slate-800">Company Matcher</h4>
                <p className="text-xs text-slate-600">Live eligibility checker against 15+ top corporate placement drives.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <FileCheck className="w-6 h-6 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-800">ATS Resume Scanner</h4>
                <p className="text-xs text-slate-600">Live resume audit for technical keywords and recruiter formatting.</p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Institutional CTA Banner */}
      <section className="bg-gradient-to-r from-oriental-navy via-oriental-dark to-slate-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <GraduationCap className="w-12 h-12 text-teal-400 mx-auto" />
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight">
            Ready to Evaluate Your Placement Readiness?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Join students from CSE, IT, EC, ME, EX, CE, and AI&DS at Oriental Institute of Science & Technology, Bhopal.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="px-8 py-3.5 text-sm font-semibold text-oriental-navy bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 rounded-xl shadow-xl shadow-teal-500/20 inline-flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
