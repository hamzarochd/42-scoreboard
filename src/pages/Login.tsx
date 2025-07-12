import { useEffect, useState } from 'react';
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
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);

  useEffect(() => {
    // Check if this is an OAuth callback (has 'code' parameter)
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    console.log('Login page loaded with params:', {
      code: code ? 'present' : 'not present',
      error,
      fullUrl: location.pathname + location.search
    });

    if (error) {
      console.error('OAuth error:', error);
      // Redirect to clean login page
      navigate('/login', { replace: true });
      return;
    }

    if (code) {
      console.log('Processing OAuth callback with code');
      setIsProcessingCallback(true);
      // Handle OAuth callback
      handleOAuthCallback(code);
    }
  }, [location, navigate]);

  const handleOAuthCallback = async (code: string) => {
    console.log('Starting OAuth token exchange...');
    try {
      const response = await ft42AuthApi.exchangeCodeForToken(code);
      console.log('Token exchange response:', response.success ? 'success' : 'failed');
      
      if (response.success) {
        console.log('Authentication successful, redirecting to dashboard...');
        // Redirect to dashboard after successful authentication
        navigate('/', { replace: true });
      } else {
        console.error('Token exchange failed:', response);
        throw new Error('Token exchange failed');
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      // Stay on login page but clear URL params to show login form
      setIsProcessingCallback(false);
      navigate('/login', { replace: true });
    }
  };

  // Check if this is an OAuth callback
  const urlParams = new URLSearchParams(location.search);
  const isCallback = urlParams.has('code') || isProcessingCallback;

  if (isCallback) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/leeters-background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="glass-panel rounded-lg shadow-xl p-8 text-center">
          <LoadingSpinner size="lg" text="Processing authentication..." />
          <p className="mt-4 text-white">Connecting to 42 School API...</p>
        </div>
      </div>
    );
  }

  return <LoginForm />;
}
