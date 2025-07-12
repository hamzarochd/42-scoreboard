import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components';
import { LoadingSpinner } from '@/components/common';
import { ft42AuthApi } from '@/services/ft42Api';

/**
 * Login page with OAuth callback handling
 */
export function Login() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is an OAuth callback (has 'code' parameter)
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      // Redirect to clean login page
      navigate('/login', { replace: true });
      return;
    }

    if (code) {
      // Handle OAuth callback
      handleOAuthCallback(code);
    }
  }, [location, navigate]);

  const handleOAuthCallback = async (code: string) => {
    try {
      const response = await ft42AuthApi.exchangeCodeForToken(code);
      if (response.success) {
        // Redirect to dashboard after successful authentication
        navigate('/', { replace: true });
      } else {
        throw new Error('Token exchange failed');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      // Redirect to clean login page on error
      navigate('/login', { replace: true });
    }
  };

  // Check if this is an OAuth callback
  const urlParams = new URLSearchParams(location.search);
  const isCallback = urlParams.has('code');

  if (isCallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <LoadingSpinner size="lg" text="Processing authentication..." />
      </div>
    );
  }

  return <LoginForm />;
}
