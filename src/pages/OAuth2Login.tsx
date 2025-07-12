import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOAuth2 } from '@/hooks/useOAuth2';
import { authService } from '@/services/oauth2Service';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

/**
 * Complete OAuth2 Login Page
 * Implements secure login with 42 School OAuth2
 */
export const OAuth2Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, error, login, clearError } = useOAuth2();

  // Get redirect path from location state or default to dashboard
  const redirectTo = (location.state as any)?.from?.pathname || '/';

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  const handleLogin = async () => {
    try {
      clearError();
      await login(redirectTo);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const getAuthStatus = () => {
    const status = authService.getStatus();
    return status;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Already authenticated, redirecting...
          </p>
        </div>
      </div>
    );
  }

  const status = getAuthStatus();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            42 School Scoreboard
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in with your 42 School account
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Authentication Error
                </h3>
                <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Warning */}
        {!status.config.clientId && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Configuration Required
                </h3>
                <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                  VITE_42_CLIENT_ID environment variable is not set. Please configure your OAuth2 credentials.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Button */}
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={!status.config.clientId}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-blue-500 group-hover:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 1v12h12V5H4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Sign in with 42 School
          </button>

          {/* Debug Link */}
          <div className="text-center">
            <a
              href="/debug"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Debug Authentication Issues
            </a>
          </div>
        </div>

        {/* Configuration Status */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Configuration Status
          </h3>
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Client ID:</span>
              <span className={status.config.clientId === 'Set' ? 'text-green-600' : 'text-red-600'}>
                {status.config.clientId}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Redirect URI:</span>
              <span className="text-xs truncate max-w-[200px]" title={status.config.redirectUri}>
                {status.config.redirectUri}
              </span>
            </div>
            <div className="flex justify-between">
              <span>API Base URL:</span>
              <span>{status.config.baseUrl}</span>
            </div>
            {status.token && (
              <div className="flex justify-between">
                <span>Token Status:</span>
                <span className={status.token.isValid ? 'text-green-600' : 'text-red-600'}>
                  {status.token.isValid ? 'Valid' : 'Expired'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Security Information */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            This application uses OAuth2 with PKCE for secure authentication.
            <br />
            Your credentials are never stored on our servers.
          </p>
        </div>
      </div>
    </div>
  );
};
