import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components';
import { Dashboard, Login, NotFound, ApiSetup, DebugAuth, TestOAuth } from '@/pages';
import { SimpleOAuthCallback } from '@/components/auth/SimpleOAuthCallback';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { logApiMode } from '@/services';

// Log API mode on app start
logApiMode();

/**
 * Protected Route Component
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useSimpleAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
};

/**
 * Main App component
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/callback" element={<SimpleOAuthCallback />} />
          <Route path="/api-setup" element={<ApiSetup />} />
          <Route path="/debug" element={<DebugAuth />} />
          <Route path="/test-oauth" element={<TestOAuth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
