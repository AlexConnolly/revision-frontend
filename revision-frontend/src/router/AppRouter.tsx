import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import MaterialsPage from '../pages/MaterialsPage';
import FillTheWordPage from '../pages/FillTheWordPage';

interface AppRouterProps {
  children: React.ReactNode;
}

const AppRouter: React.FC<AppRouterProps> = ({ children }) => {
  return (
    <Router>
      <Routes>
        {/* Layout route that includes the navigation */}
        <Route path="/" element={<Layout>{children}</Layout>}>
          {/* Default route redirects to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Main application routes */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="fill-the-word/:id" element={<FillTheWordPage />} />
          
          {/* Placeholder routes for future features */}
          <Route path="study" element={<StudySessionsPage />} />
          <Route path="flashcards" element={<FlashcardsPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

// Layout component that wraps all pages with navigation
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-warm-gray">
      {children}
      <Outlet />
    </div>
  );
};

// Placeholder components for future features
const StudySessionsPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="text-6xl mb-4">🎯</div>
      <h1 className="text-h1 font-semibold text-text-primary mb-4">Study Sessions</h1>
      <p className="text-body text-text-secondary">Coming soon...</p>
    </div>
  </div>
);

const FlashcardsPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="text-6xl mb-4">🃏</div>
      <h1 className="text-h1 font-semibold text-text-primary mb-4">Flashcards</h1>
      <p className="text-body text-text-secondary">Coming soon...</p>
    </div>
  </div>
);

const ProgressPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="text-6xl mb-4">📈</div>
      <h1 className="text-h1 font-semibold text-text-primary mb-4">Progress</h1>
      <p className="text-body text-text-secondary">Coming soon...</p>
    </div>
  </div>
);

const SettingsPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="text-6xl mb-4">⚙️</div>
      <h1 className="text-h1 font-semibold text-text-primary mb-4">Settings</h1>
      <p className="text-body text-text-secondary">Coming soon...</p>
    </div>
  </div>
);

const NotFoundPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-h1 font-semibold text-text-primary mb-4">Page Not Found</h1>
      <p className="text-body text-text-secondary mb-6">The page you're looking for doesn't exist.</p>
      <Link 
        to="/dashboard" 
        className="px-6 py-3 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-muted-blue"
      >
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default AppRouter;
