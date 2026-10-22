import React from 'react';
import { GraduationCap, MapPin, Mail, Phone, ExternalLink, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-oriental-navy text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Institutional Identity */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-oriental-navy font-bold">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-base text-white tracking-tight">
                Oriental Placement Intelligence & Prediction System
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-lg">
              Designed specifically around the student placement ecosystem of Oriental Group of Institutes / Oriental Institute of Science and Technology (OIST), Bhopal, MP. An AI-powered decision support platform helping students and Training & Placement Officers evaluate multi-modal readiness, predict company matches, and bridge skill gaps.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-teal-400 pt-1">
              <a href="https://oriental.ac.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                Official Portal: oriental.ac.in <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <span>17-Acre Lush Green Campus</span>
            </div>
          </div>

          {/* Col 2: Institutional Campus */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs">Campus Address</h4>
            <div className="space-y-2 text-slate-400 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Oriental Campus, Opposite Patel Nagar, Raisen Road, Bhopal, MP - 462021</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>tpo@oriental.ac.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+91 755 2529015 / 2529016</span>
              </div>
            </div>
          </div>

          {/* Col 3: Key Placement Modules */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs">Core Modules</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• ML Placement Probability Model</li>
              <li>• CGPA Trajectory Forecasting</li>
              <li>• Company Eligibility Matrix</li>
              <li>• Skill-Gap & 6-Week Roadmap</li>
              <li>• ATS Resume Quality Analyzer</li>
              <li>• TPO Institutional Analytics</li>
            </ul>
          </div>

        </div>

        {/* Mandatory Advisory Disclaimer Banner */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 max-w-3xl">
            <Shield className="w-4 h-4 shrink-0" />
            <span>
              <strong>Advisory Disclaimer:</strong> Predictions, probability estimates, and recommendations are statistical decision-support aids based on student profiles and do not guarantee final campus placement.
            </span>
          </div>
          <p>© {new Date().getFullYear()} Oriental Group of Institutes. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
