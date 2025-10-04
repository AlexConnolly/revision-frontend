import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
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
          {/* Default route redirects to materials */}
          <Route index element={<Navigate to="/materials" replace />} />
          
          {/* Main application routes */}
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="fill-the-word/:id" element={<FillTheWordPage />} />
          
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


const NotFoundPage: React.FC = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-h1 font-semibold text-text-primary mb-4">Page Not Found</h1>
      <p className="text-body text-text-secondary mb-6">The page you're looking for doesn't exist.</p>
      <Link 
        to="/materials" 
        className="px-6 py-3 rounded-soft font-medium text-warm-white transition-gentle hover:opacity-90 bg-muted-blue"
      >
        Go to Materials
      </Link>
    </div>
  </div>
);

export default AppRouter;
