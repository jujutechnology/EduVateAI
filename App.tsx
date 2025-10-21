
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import WritingCoachPage from './pages/WritingCoachPage';
import { ToastProvider } from './components/Toast';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppContext();
  return user ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAppContext();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:subjectId"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/writing-coach"
        element={
          <ProtectedRoute>
            <WritingCoachPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <ToastProvider>
          <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200">
            <AppRoutes />
          </div>
        </ToastProvider>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
