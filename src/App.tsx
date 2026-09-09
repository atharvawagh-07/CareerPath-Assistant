import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { AssessmentPage } from './pages/AssessmentPage';
import { CareersPage } from './pages/CareersPage';
import { CareerDetailPage } from './pages/CareerDetailPage';
import { ComparePage } from './pages/ComparePage';
import { RoadmapsPage } from './pages/RoadmapsPage';
import { RoadmapDetailPage } from './pages/RoadmapDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ReadinessPage } from './pages/ReadinessPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
          <CompareProvider>
            <ScrollToTop />
            <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/assessment" element={<AssessmentPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/careers/:slug" element={<CareerDetailPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/roadmaps" element={<RoadmapsPage />} />
                  <Route path="/roadmaps/:id" element={<RoadmapDetailPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/readiness" element={<ReadinessPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </main>
              <Footer />
              <AuthModal />
            </div>
          </CompareProvider>
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  );
}
