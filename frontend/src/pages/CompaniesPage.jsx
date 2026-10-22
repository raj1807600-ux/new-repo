import React, { useState, useEffect } from 'react';
import { companyAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Calendar,
  MapPin,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Award,
  Layers,
  X
} from 'lucide-react';

const CompaniesPage = () => {
  const { student, isAdmin } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCompanyModal, setSelectedCompanyModal] = useState(null);

  useEffect(() => {
    fetchCompaniesList();
  }, [tierFilter, statusFilter]);

  const fetchCompaniesList = async () => {
    setLoading(true);
    try {
      const res = await companyAPI.getCompanies({
        tier: tierFilter || undefined,
        status: statusFilter || undefined,
        search: search || undefined
      });
      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCompaniesList();
  };

  const getStatusBadge = (status) => {
    if (status === 'Eligible') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Eligible</span>
        </span>
      );
    }
    if (status === 'Almost Eligible') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Almost Eligible</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>Not Eligible</span>
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">
            Company Placement Drives & Eligibility Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time evaluation against corporate criteria, minimum CGPA, backlog rules, and mandatory skill stacks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
            Total Drives: <strong className="text-slate-900">{companies.length}</strong>
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company or role..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
          />
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
          >
            <option value="">All Tiers</option>
            <option value="Tier 1">Tier 1 (4 - 8 LPA)</option>
            <option value="Dream">Dream (8 - 12 LPA)</option>
            <option value="Super Dream">Super Dream (12+ LPA)</option>
          </select>

          {!isAdmin && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-700"
            >
              <option value="">All Eligibility Statuses</option>
              <option value="Eligible">Eligible (Green)</option>
              <option value="Almost Eligible">Almost Eligible (Yellow)</option>
              <option value="Not Eligible">Not Eligible (Red)</option>
            </select>
          )}

          {(tierFilter || statusFilter || search) && (
            <button
              onClick={() => { setTierFilter(''); setStatusFilter(''); setSearch(''); }}
              className="text-xs text-teal-600 hover:underline"
            >
              Reset
            </button>
          )}
        </div>

      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">
          Filtering placement drives...
        </div>
      ) : companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((c) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md hover:border-teal-300 transition-all"
            >
              <div className="space-y-3">
                
                {/* Top status & Tier row */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {c.tier}
                  </span>
                  {!isAdmin && c.student_status && getStatusBadge(c.student_status)}
                </div>

                {/* Company Name & Role */}
                <div>
                  <h3 className="font-bold text-base text-slate-900">{c.name}</h3>
                  <p className="text-xs font-semibold text-teal-700 mt-0.5">{c.job_role}</p>
                  <p className="text-xs text-slate-500">{c.industry}</p>
                </div>

                {/* Package & Location */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Package</span>
                    <span className="font-extrabold text-slate-900">{c.ctc_formatted}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Match Score</span>
                    <span className="font-extrabold text-teal-700">{c.match_percentage || 80}%</span>
                  </div>
                </div>

                {/* Cutoffs snapshot */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Min CGPA Cutoff:</span>
                    <span className="font-semibold text-slate-800">{c.criteria?.min_cgpa || 6.5}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Max Active Backlogs:</span>
                    <span className="font-semibold text-slate-800">{c.criteria?.max_active_backlogs || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Drive Status:</span>
                    <span className="font-semibold text-emerald-600">{c.drive_status}</span>
                  </div>
                </div>

                {/* Required Skills Badges */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Required Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {c.required_skills?.slice(0, 4).map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-100 text-slate-700">
                        {sk.skill_name}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Drive: {c.drive_date ? new Date(c.drive_date).toLocaleDateString() : 'Upcoming'}
                </span>
                <button
                  onClick={() => setSelectedCompanyModal(c)}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                >
                  <span>Criteria Breakdown</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No Companies Found</h3>
          <p className="text-xs text-slate-500">Try changing your search or filter parameters.</p>
        </div>
      )}

      {/* ELIGIBILITY BREAKDOWN MODAL */}
      {selectedCompanyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-xl w-full rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 px-2 py-0.5 rounded bg-teal-50">
                  {selectedCompanyModal.tier}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">{selectedCompanyModal.name}</h3>
                <p className="text-xs text-slate-500">{selectedCompanyModal.job_role} • {selectedCompanyModal.ctc_formatted}</p>
              </div>

              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Eligibility Evaluation */}
            {selectedCompanyModal.eligibility && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Your Eligibility Verdict</span>
                  {getStatusBadge(selectedCompanyModal.student_status)}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    {selectedCompanyModal.eligibility.cgpa_eligible ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span>CGPA Criteria ({selectedCompanyModal.criteria?.min_cgpa})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedCompanyModal.eligibility.backlog_eligible ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span>Backlog Policy (Max {selectedCompanyModal.criteria?.max_active_backlogs})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedCompanyModal.eligibility.branch_eligible ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span>Branch Cutoff</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedCompanyModal.eligibility.tenth_twelfth_eligible ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span>10th / 12th Percentages</span>
                  </div>
                </div>

                {selectedCompanyModal.eligibility.reasons?.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Feedback Details:</span>
                    {selectedCompanyModal.eligibility.reasons.map((r, i) => (
                      <p key={i} className="text-[11px] text-slate-600">• {r}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selection Process */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-1">
                Recruitment Selection Stages
              </h4>
              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                {selectedCompanyModal.selection_process || '1. Online Aptitude & Coding Round\n2. Technical Interview\n3. HR Interview'}
              </p>
            </div>

            {/* Required Skills */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                Mandatory & Preferred Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCompanyModal.required_skills?.map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                    {sk.skill_name} ({sk.importance})
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CompaniesPage;
