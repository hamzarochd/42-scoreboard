import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { simpleAuth } from '@/services/simpleAuth';

/**
 * Simple Login page component
 */
export function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSimpleAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    simpleAuth.login();
  };

  const config = simpleAuth.getConfig();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            42 School Scoreboard
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in with your 42 School account
          </p>
        </div>
        
        <div className="space-y-4">
          {!config.hasClientId && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 text-sm">
                ⚠️ Missing VITE_42_CLIENT_ID environment variable
              </p>
            </div>
          )}
          
          <button
            onClick={handleLogin}
            disabled={!config.hasClientId}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Login with 42 School
          </button>
          
          <div className="text-center">
            <a
              href="/debug"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Debug Authentication
            </a>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Configuration:
          </h3>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>Client ID: {config.clientId ? '✅ Set' : '❌ Missing'}</div>
            <div>Redirect URI: {config.redirectUri}</div>
            <div>Base URL: {config.baseUrl}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
