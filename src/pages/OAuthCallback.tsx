import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common';
import { ft42AuthApi } from '@/services/ft42Api';
import { useAuth } from '@/hooks';

/**
 * OAuth Callback page component
 * Handles the callback from OAuth provider and processes authentication
 */
export function OAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectTo, { replace: true });
      return;
    }

    handleCallback();
  }, [location, navigate, isAuthenticated]);

  const handleCallback = async () => {
    console.log('OAuth Callback - Processing authentication...');
    
    try {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const state = urlParams.get('state');

      console.log('OAuth Callback - URL params:', {
        code: code ? 'present' : 'not present',
        error,
        state,
        fullUrl: location.pathname + location.search
      });

      // Handle error from OAuth provider
      if (error) {
        console.error('OAuth provider error:', error);
        setError(`Authentication failed: ${error}`);
        setIsProcessing(false);
        return;
      }

      // Validate required parameters
      if (!code) {
        console.error('OAuth callback missing code parameter');
        setError('Invalid authentication response - missing authorization code');
        setIsProcessing(false);
        return;
      }

      // Validate state parameter for security (if stored in sessionStorage)
      const storedState = sessionStorage.getItem('oauthState');
      if (storedState && state !== storedState) {
        console.error('OAuth state mismatch:', { received: state, expected: storedState });
        setError('Invalid authentication response - state mismatch');
        setIsProcessing(false);
        sessionStorage.removeItem('oauthState');
        return;
      }

      // Clean up state from storage
      sessionStorage.removeItem('oauthState');

      console.log('OAuth Callback - Starting token exchange...');
      
      // Exchange authorization code for token
      const response = await ft42AuthApi.exchangeCodeForToken(code);
      
      if (response.success) {
        console.log('OAuth Callback - Authentication successful');
        
        // Get redirect destination
        const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
        sessionStorage.removeItem('redirectAfterLogin');
        
        console.log('OAuth Callback - Redirecting to:', redirectTo);
        
        // Redirect to intended destination
        navigate(redirectTo, { replace: true });
      } else {
        console.error('OAuth Callback - Token exchange failed:', response);
        setError('Authentication failed - unable to verify credentials');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('OAuth Callback - Unexpected error:', error);
      setError('Authentication failed - please try again');
      setIsProcessing(false);
    }
  };

  const handleRetryLogin = () => {
    navigate('/login', { replace: true });
  };

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
      <div className="glass-panel rounded-lg shadow-xl p-8 text-center max-w-md mx-4">
        {isProcessing ? (
          <>
            <LoadingSpinner size="lg" text="Processing authentication..." />
            <p className="mt-4 text-white">
              Connecting to 42 School API...
            </p>
            <p className="mt-2 text-gray-300 text-sm">
              Please wait while we verify your credentials
            </p>
          </>
        ) : error ? (
          <>
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-4">
              Authentication Failed
            </h2>
            <p className="text-gray-300 mb-6">
              {error}
            </p>
            <button
              onClick={handleRetryLogin}
              className="w-full bg-leeters-gold hover:bg-yellow-500 text-black font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
