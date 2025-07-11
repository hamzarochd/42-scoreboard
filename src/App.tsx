import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary, ProtectedRoute, OAuthCallback } from '@/components';
import { Dashboard, Login, NotFound } from '@/pages';
import { logApiMode } from '@/services';

// Log API mode on app start
logApiMode();

/**
 * Main App component
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
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
