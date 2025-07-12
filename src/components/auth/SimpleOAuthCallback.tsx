import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { simpleAuth } from '@/services/simpleAuth';

/**
 * Simple OAuth Callback component
 */
export const SimpleOAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<string>('Processing...');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      // Check for OAuth errors
      if (error) {
        console.error('❌ OAuth error:', error);
        setError(`OAuth error: ${error}`);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Check for authorization code
      if (!code) {
        console.error('❌ No authorization code');
        setError('No authorization code received');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Check for state
      if (!state) {
        console.error('❌ No state parameter');
        setError('No state parameter received');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      setStatus('Exchanging code for token...');

      try {
        const result = await simpleAuth.handleCallback(code, state);
        
        if (result.success) {
          setStatus('Login successful! Redirecting...');
          console.log('✅ Authentication successful, redirecting to dashboard');
          setTimeout(() => navigate('/'), 1000);
        } else {
          console.error('❌ Authentication failed:', result.error);
          setError(result.error || 'Authentication failed');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('💥 Callback error:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-8 text-center">
          <div className="text-red-600 dark:text-red-400">
            <h2 className="text-2xl font-bold mb-4">Authentication Failed</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <LoadingSpinner size="lg" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Authenticating...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{status}</p>
      </div>
    </div>
  );
};
