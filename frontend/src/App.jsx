import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import StudentProfilePage from './pages/StudentProfilePage';
import SkillsExperiencePage from './pages/SkillsExperiencePage';
import AssessmentsPage from './pages/AssessmentsPage';
import PredictionDashboardPage from './pages/PredictionDashboardPage';
import CompaniesPage from './pages/CompaniesPage';
import SkillGapPage from './pages/SkillGapPage';
import ReportsPage from './pages/ReportsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span>Authenticating with Oriental Portal...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-slate-50 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Admin Only Route Wrapper
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-slate-50 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Public Layout Wrapper with Navbar & Footer
const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <LandingPage />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <AuthPage />
          </PublicLayout>
        }
      />
      <Route
        path="/register"
        element={
          <PublicLayout>
            <AuthPage />
          </PublicLayout>
        }
      />

      {/* Student Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PredictionDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/prediction"
        element={
          <ProtectedRoute>
            <PredictionDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <StudentProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <StudentProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills-experience"
        element={
          <ProtectedRoute>
            <SkillsExperiencePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessments"
        element={
          <ProtectedRoute>
            <AssessmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies"
        element={
          <ProtectedRoute>
            <CompaniesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skill-gap"
        element={
          <ProtectedRoute>
            <SkillGapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin / TPO Protected Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
