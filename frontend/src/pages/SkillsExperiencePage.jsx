import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentAPI, resumeAPI } from '../services/api';
import {
  BookOpen,
  Code,
  Briefcase,
  Award,
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Plus,
  AlertCircle,
  FileCheck,
  Zap,
  Github,
  Layers
} from 'lucide-react';

const SkillsExperiencePage = () => {
  const { refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('skills'); // 'skills' | 'projects' | 'internships' | 'certifications' | 'resume'
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Skills
  const [skillsCatalog, setSkillsCatalog] = useState([]);
  const [studentSkills, setStudentSkills] = useState([]);
  const [searchSkill, setSearchSkill] = useState('');
  const [newSkillForm, setNewSkillForm] = useState({
    skill_name: '',
    category: 'languages',
    proficiency: 'Intermediate',
    experience_months: 12
  });

  // Projects
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'Web Application',
    technologies: '',
    github_url: '',
    live_url: '',
    description: '',
    complexity: 'Intermediate',
    team_size: 1
  });

  // Internships & Certs
  const [internships, setInternships] = useState([]);
  const [newInternship, setNewInternship] = useState({
    company_name: '',
    role: '',
    location: 'Bhopal / Remote',
    duration_months: 3,
    technologies: '',
    description: '',
    certificate_url: ''
  });

  const [certifications, setCertifications] = useState([]);
  const [newCert, setNewCert] = useState({
    title: '',
    issuing_organization: '',
    credential_id: '',
    credential_url: '',
    skills_covered: ''
  });

  // Resume
  const [latestResume, setLatestResume] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [skillsCatRes, stSkillsRes, projRes, internRes, certRes, resRes] = await Promise.all([
        studentAPI.getSkillsCatalog(),
        studentAPI.getStudentSkills(),
        studentAPI.getProjects(),
        studentAPI.getInternships(),
        studentAPI.getCertifications(),
        resumeAPI.getLatestResume()
      ]);

      setSkillsCatalog(skillsCatRes.data.skills || []);
      setStudentSkills(stSkillsRes.data.skills || []);
      setProjects(projRes.data.projects || []);
      setInternships(internRes.data.internships || []);
      setCertifications(certRes.data.certifications || []);
      setLatestResume(resRes.data.resume || null);
    } catch (err) {
      console.error('Error fetching skills/portfolio data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Skill Handlers
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillForm.skill_name) return;
    try {
      await studentAPI.addStudentSkill(newSkillForm);
      await refreshProfile();
      await fetchAllData();
      setNewSkillForm({ skill_name: '', category: 'languages', proficiency: 'Intermediate', experience_months: 12 });
      setSuccessMsg('Skill added to profile.');
    } catch (err) {
      setErrorMsg('Failed to add skill.');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await studentAPI.deleteStudentSkill(skillId);
      await refreshProfile();
      await fetchAllData();
    } catch (err) {
      setErrorMsg('Failed to remove skill.');
    }
  };

  // Project Handlers
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.addProject(newProject);
      await refreshProfile();
      await fetchAllData();
      setNewProject({ title: '', category: 'Web Application', technologies: '', github_url: '', live_url: '', description: '', complexity: 'Intermediate', team_size: 1 });
      setSuccessMsg('Project added to portfolio.');
    } catch (err) {
      setErrorMsg('Failed to add project.');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await studentAPI.deleteProject(id);
      await refreshProfile();
      await fetchAllData();
    } catch (err) {
      setErrorMsg('Failed to delete project.');
    }
  };

  // Internship Handlers
  const handleAddInternship = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.addInternship(newInternship);
      await refreshProfile();
      await fetchAllData();
      setNewInternship({ company_name: '', role: '', location: 'Bhopal / Remote', duration_months: 3, technologies: '', description: '', certificate_url: '' });
      setSuccessMsg('Internship experience saved.');
    } catch (err) {
      setErrorMsg('Failed to save internship.');
    }
  };

  const handleDeleteInternship = async (id) => {
    try {
      await studentAPI.deleteInternship(id);
      await refreshProfile();
      await fetchAllData();
    } catch (err) {
      setErrorMsg('Failed to delete internship.');
    }
  };

  // Certification Handlers
  const handleAddCert = async (e) => {
    e.preventDefault();
    try {
      await studentAPI.addCertification(newCert);
      await refreshProfile();
      await fetchAllData();
      setNewCert({ title: '', issuing_organization: '', credential_id: '', credential_url: '', skills_covered: '' });
      setSuccessMsg('Certification recorded.');
    } catch (err) {
      setErrorMsg('Failed to add certification.');
    }
  };

  const handleDeleteCert = async (id) => {
    try {
      await studentAPI.deleteCertification(id);
      await refreshProfile();
      await fetchAllData();
    } catch (err) {
      setErrorMsg('Failed to delete certification.');
    }
  };

  // Resume Upload Handler
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    setUploadingResume(true);
    setErrorMsg('');
    try {
      const res = await resumeAPI.uploadResume(formData);
      setLatestResume(res.data.resume);
      await refreshProfile();
      setSuccessMsg('Resume uploaded and scanned for ATS keywords.');
    } catch (err) {
      setErrorMsg('Failed to process resume.');
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading skills, portfolio, and ATS resume data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-xl text-slate-900">
            Skills, Portfolio & ATS Resume Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Build your professional placement portfolio for automated company matching and skill-gap diagnosis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            {studentSkills.length} Skills
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {projects.length} Projects
          </span>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {internships.length} Internships
          </span>
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

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'skills', label: 'Technical & Soft Skills', icon: BookOpen, count: studentSkills.length },
          { id: 'projects', label: 'Projects Portfolio', icon: Code, count: projects.length },
          { id: 'internships', label: 'Internships', icon: Briefcase, count: internships.length },
          { id: 'certifications', label: 'Certifications', icon: Award, count: certifications.length },
          { id: 'resume', label: 'PDF Resume & ATS Scan', icon: FileCheck, badge: latestResume ? `${latestResume.ats_score}% ATS` : 'Pending' }
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
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-teal-500/30 text-teal-200' : 'bg-slate-200 text-slate-700'}`}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Skills */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {/* Add Skill Form */}
          <form onSubmit={handleAddSkill} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Name</label>
              <input
                type="text"
                required
                value={newSkillForm.skill_name}
                onChange={(e) => setNewSkillForm({ ...newSkillForm, skill_name: e.target.value })}
                placeholder="e.g. Java, React, Docker, SQL"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={newSkillForm.category}
                onChange={(e) => setNewSkillForm({ ...newSkillForm, category: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
              >
                <option value="languages">Languages</option>
                <option value="core_cs">Core CS / Fundamentals</option>
                <option value="backend">Backend & Frameworks</option>
                <option value="frontend">Frontend UI</option>
                <option value="database">Databases & Caching</option>
                <option value="cloud_devops">Cloud & DevOps</option>
                <option value="ai_ml">Data Science & AI</option>
                <option value="soft_skills">Soft Skills</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Proficiency Level</label>
              <select
                value={newSkillForm.proficiency}
                onChange={(e) => setNewSkillForm({ ...newSkillForm, proficiency: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-teal-700"
              >
                <option value="Beginner">Beginner (Basic knowledge)</option>
                <option value="Intermediate">Intermediate (Hands-on)</option>
                <option value="Advanced">Advanced (Strong)</option>
                <option value="Expert">Expert (Interview ready)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Experience (Months)</label>
              <input
                type="number"
                min="1"
                value={newSkillForm.experience_months}
                onChange={(e) => setNewSkillForm({ ...newSkillForm, experience_months: parseInt(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              className="py-2 px-4 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-teal-400" />
              <span>Add Skill</span>
            </button>
          </form>

          {/* Student Skills Badges Grid */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Mastered Skills Portfolio ({studentSkills.length})
            </h3>

            {studentSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {studentSkills.map((sk) => (
                  <div
                    key={sk.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 flex items-center justify-between transition-all"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{sk.skill_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-semibold">
                          {sk.proficiency}
                        </span>
                        <span className="text-[10px] text-slate-500">{sk.experience_months} mos</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteSkill(sk.skill_id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove skill"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs">
                No skills added yet. Select and add your technical skills above.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Add Project Form */}
          <form onSubmit={handleAddProject} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Add Academic / Industry Project</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. Distributed E-Commerce Microservices"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Web Application">Web Application</option>
                  <option value="AI/ML">AI / Machine Learning</option>
                  <option value="Cloud / Backend">Cloud / Backend Systems</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Core Systems">Core Systems / IoT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Complexity</label>
                <select
                  value={newProject.complexity}
                  onChange={(e) => setNewProject({ ...newProject, complexity: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-teal-700"
                >
                  <option value="Basic">Basic (CRUD / Template)</option>
                  <option value="Intermediate">Intermediate (API + DB)</option>
                  <option value="Advanced">Advanced (Architecture / Scale)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Technologies Used</label>
                <input
                  type="text"
                  required
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                  placeholder="e.g. React, Flask, PostgreSQL, Docker"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GitHub Repository Link</label>
                <input
                  type="url"
                  value={newProject.github_url}
                  onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Live Hosted URL</label>
                <input
                  type="url"
                  value={newProject.live_url}
                  onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Impact</label>
              <textarea
                rows={2}
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Describe key features, architectural choices, or latency/performance metrics..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Save Project</span>
              </button>
            </div>
          </form>

          {/* Projects List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 px-2 py-0.5 rounded bg-teal-50 border border-teal-200">
                      {p.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1.5">{p.title}</h4>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-500">{p.technologies}</span>
                  <div className="flex items-center gap-2">
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-black">
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline flex items-center gap-1">
                        <span>Live Demo</span> <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Internships */}
      {activeTab === 'internships' && (
        <div className="space-y-6">
          <form onSubmit={handleAddInternship} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Add Internship Experience</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization</label>
                <input
                  type="text"
                  required
                  value={newInternship.company_name}
                  onChange={(e) => setNewInternship({ ...newInternship, company_name: e.target.value })}
                  placeholder="e.g. Netlink Software / TCS Remote"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Designation</label>
                <input
                  type="text"
                  required
                  value={newInternship.role}
                  onChange={(e) => setNewInternship({ ...newInternship, role: e.target.value })}
                  placeholder="e.g. Software Engineering Intern"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Months)</label>
                <input
                  type="number"
                  min="1"
                  value={newInternship.duration_months}
                  onChange={(e) => setNewInternship({ ...newInternship, duration_months: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Technologies & Responsibilities</label>
              <textarea
                rows={2}
                value={newInternship.description}
                onChange={(e) => setNewInternship({ ...newInternship, description: e.target.value })}
                placeholder="Key deliverables, APIs built, database optimizations..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Save Internship</span>
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internships.map((i) => (
              <div key={i.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{i.role}</h4>
                    <p className="text-xs text-teal-700 font-semibold">{i.company_name} • {i.duration_months} Months</p>
                  </div>
                  <button onClick={() => handleDeleteInternship(i.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600">{i.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Certifications */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <form onSubmit={handleAddCert} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Add Professional Certification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Certification Title</label>
                <input
                  type="text"
                  required
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  placeholder="e.g. AWS Certified Cloud Practitioner"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  required
                  value={newCert.issuing_organization}
                  onChange={(e) => setNewCert({ ...newCert, issuing_organization: e.target.value })}
                  placeholder="e.g. Amazon Web Services / Oracle / Coursera"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Credential ID / Link</label>
                <input
                  type="text"
                  value={newCert.credential_id}
                  onChange={(e) => setNewCert({ ...newCert, credential_id: e.target.value })}
                  placeholder="Credential ID / Verification URL"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-oriental-navy hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-teal-400" />
                <span>Save Certification</span>
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {certifications.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <button onClick={() => handleDeleteCert(c.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-bold text-xs text-slate-900">{c.title}</h4>
                <p className="text-[11px] text-slate-500">{c.issuing_organization}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PDF Resume & ATS Analyzer */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          
          {/* Upload Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800">PDF Resume Uploader & AI ATS Analyzer</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Upload your single-page PDF resume to evaluate keyword density and ATS compliance against Tier-1 recruiters.
                </p>
              </div>

              <label className="px-5 py-2.5 text-xs font-semibold text-oriental-navy bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 rounded-xl shadow-md cursor-pointer flex items-center gap-2 transition-all">
                <Upload className="w-4 h-4" />
                <span>{uploadingResume ? 'Scanning...' : 'Upload PDF Resume'}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* ATS Analysis Display */}
          {latestResume ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{latestResume.filename}</h4>
                    <p className="text-[11px] text-slate-400">Uploaded • {latestResume.file_size_kb} KB</p>
                  </div>
                </div>

                {/* Score badge */}
                <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">ATS Score</span>
                    <span className="text-xl font-extrabold text-emerald-700">{latestResume.ats_score} / 100</span>
                  </div>
                </div>
              </div>

              {/* Detected Technical Keywords */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                  Detected Key Technical Proficiencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {latestResume.detected_skills?.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Optimization Recommendations */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                  ATS Optimization Suggestions
                </h4>
                <div className="space-y-2">
                  {latestResume.recommendations?.map((rec, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                      <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-sm text-slate-700">No Resume Uploaded Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload your resume above to get a breakdown of ATS parsing readiness and recruiter optimization tips.
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default SkillsExperiencePage;
