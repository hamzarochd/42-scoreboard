import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary, ProtectedRoute, RootHandler } from '@/components';
import { Dashboard, Login, OAuthCallback, NotFound, ApiSetup, DebugAuth } from '@/pages';
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
          <Route path="/api-setup" element={<ApiSetup />} />
          <Route path="/debug" element={<DebugAuth />} />
          <Route
            path="/"
            element={
              <RootHandler>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </RootHandler>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
