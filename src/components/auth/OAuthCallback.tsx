import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ft42AuthApi } from '@/services/ft42Api';

/**
 * OAuth Callback component for handling 42 School OAuth2 flow
 */
export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithOAuth } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/login?error=oauth_failed');
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        navigate('/login?error=no_code');
        return;
      }

      try {
        const response = await ft42AuthApi.exchangeCodeForToken(code);
        if (response.success && response.data) {
          await loginWithOAuth(response.data);
          navigate('/dashboard');
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login?error=auth_failed');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, loginWithOAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Autenticazione in corso...
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Stiamo completando il login con 42 School
          </p>
        </div>
      </div>
    </div>
  );
};
