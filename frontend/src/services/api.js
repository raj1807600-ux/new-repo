import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('oriental_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global auth error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on unauthorized if not on public auth endpoint
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
        localStorage.removeItem('oriental_token');
        localStorage.removeItem('oriental_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
};

export const studentAPI = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  getAcademics: () => api.get('/student/academics'),
  saveAcademics: (data) => api.post('/student/academics', data),
  saveSemester: (data) => api.post('/student/academics/semesters', data),
  
  // Skills & Portfolio
  getSkillsCatalog: (category) => api.get('/skills', { params: { category } }),
  getStudentSkills: () => api.get('/student/skills'),
  addStudentSkill: (data) => api.post('/student/skills', data),
  deleteStudentSkill: (skillId) => api.delete(`/student/skills/${skillId}`),

  getCertifications: () => api.get('/student/certifications'),
  addCertification: (data) => api.post('/student/certifications', data),
  deleteCertification: (id) => api.delete(`/student/certifications/${id}`),

  getInternships: () => api.get('/student/internships'),
  addInternship: (data) => api.post('/student/internships', data),
  deleteInternship: (id) => api.delete(`/student/internships/${id}`),

  getProjects: () => api.get('/student/projects'),
  addProject: (data) => api.post('/student/projects', data),
  deleteProject: (id) => api.delete(`/student/projects/${id}`),
};

export const resumeAPI = {
  uploadResume: (formData) => api.post('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getLatestResume: () => api.get('/resumes/latest'),
  downloadUrl: (id) => `/api/resumes/download/${id}`,
};

export const assessmentAPI = {
  getAssessments: (category) => api.get('/assessments', { params: { category } }),
  getAssessmentDetail: (id, includeAnswers = false) => api.get(`/assessments/${id}`, { params: { include_answers: includeAnswers } }),
  submitAssessment: (id, data) => api.post(`/assessments/${id}/submit`, data),
  getStudentResults: () => api.get('/student/assessment-results'),
};

export const predictionAPI = {
  runPrediction: () => api.post('/prediction/run'),
  getLatestPrediction: () => api.get('/prediction/latest'),
  getPredictionHistory: () => api.get('/prediction/history'),
  getCGPATrajectory: () => api.get('/prediction/cgpa'),
};

export const companyAPI = {
  getCompanies: (params) => api.get('/companies', { params }),
  getCompanyDetail: (id) => api.get(`/companies/${id}`),
  getRecommended: () => api.get('/companies/recommended'),
};

export const skillGapAPI = {
  getSkillGap: (targetRole) => api.get('/skill-gap', { params: { target_role: targetRole } }),
  setTargetRole: (targetRole) => api.post('/skill-gap/target-role', { target_role: targetRole }),
  toggleRoadmapTask: (taskId) => api.post(`/skill-gap/roadmap-task/${taskId}/toggle`),
};

export const reportsAPI = {
  getStudentReportData: () => api.get('/reports/student'),
  getPdfDownloadUrl: () => '/api/reports/student/pdf',
};

export const adminAPI = {
  getStatistics: () => api.get('/admin/statistics'),
  getStudents: (params) => api.get('/admin/students', { params }),
  getStudentDetail: (id) => api.get(`/admin/students/${id}`),
  triggerStudentPrediction: (id) => api.post(`/admin/students/${id}/predict`),
  createCompany: (data) => api.post('/admin/companies', data),
  updateCompany: (id, data) => api.put(`/admin/companies/${id}`, data),
  deleteCompany: (id) => api.delete(`/admin/companies/${id}`),
};

export default api;
