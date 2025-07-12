import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/oauth2Service';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface CallbackState {
  status: 'processing' | 'success' | 'error';
  message: string;
  error?: string;
}

/**
 * OAuth2 Callback Handler Component
 * Handles the OAuth2 authorization code flow callback from 42 School
 */
export const OAuth2Callback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<CallbackState>({
    status: 'processing',
    message: 'Processing authentication...'
  });

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract URL parameters
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('🔄 OAuth2 callback received:', {
          hasCode: !!code,
          hasState: !!state,
          error,
          errorDescription
        });

        // Update status
        setState({
          status: 'processing',
          message: 'Exchanging authorization code for access token...'
        });

        // Handle OAuth2 callback
        const result = await authService.handleCallback(code || '', state || '', error || undefined);

        if (result.success) {
          setState({
            status: 'success',
            message: 'Authentication successful! Redirecting...'
          });

          // Small delay to show success message
          setTimeout(() => {
            navigate(result.redirectTo || '/', { replace: true });
          }, 1500);

        } else {
          setState({
            status: 'error',
            message: 'Authentication failed',
            error: result.error || 'Unknown error occurred'
          });

          // Redirect to login after showing error
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 5000);
        }

      } catch (error) {
        console.error('❌ Callback handling error:', error);

        setState({
          status: 'error',
          message: 'Authentication failed',
          error: error instanceof Error ? error.message : 'Unexpected error occurred'
        });

        // Redirect to login after showing error
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 5000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (state.status) {
      case 'processing':
        return (
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
              Authenticating...
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {state.message}
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
              Authentication Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {state.message}
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
              Authentication Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {state.error}
            </p>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Redirecting to login page in a few seconds...
            </p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        {renderContent()}
        
        {/* Debug information (only in development) */}
        {import.meta.env.DEV && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Debug Info (Development Only)
            </h3>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>Code: {searchParams.get('code') ? 'Present' : 'Missing'}</div>
              <div>State: {searchParams.get('state') ? 'Present' : 'Missing'}</div>
              <div>Error: {searchParams.get('error') || 'None'}</div>
              <div>Status: {state.status}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
