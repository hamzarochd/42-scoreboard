import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary, ProtectedRoute, PublicRoute } from '@/components';
import { Dashboard, NotFound, ApiSetup, DebugAuth, TestOAuth, SimpleDebugAuth } from '@/pages';
import { OAuth2Login } from '@/pages/OAuth2Login';
import { OAuth2Callback } from '@/components/auth/OAuth2Callback';
import { logApiMode } from '@/services';

// Log API mode on app start
logApiMode();

/**
 * Main App component with OAuth2 authentication
 */
function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <OAuth2Login />
              </PublicRoute>
            } 
          />
          
          {/* OAuth2 callback route */}
          <Route path="/auth/callback" element={<OAuth2Callback />} />
          
          {/* Debug and utility routes */}
          <Route path="/api-setup" element={<ApiSetup />} />
          <Route path="/debug" element={<SimpleDebugAuth />} />
          <Route path="/debug-old" element={<DebugAuth />} />
          <Route path="/test-oauth" element={<TestOAuth />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
