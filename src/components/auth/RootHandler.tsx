import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/common';
import { ft42AuthApi } from '@/services/ft42Api';
import { useAuth } from '@/hooks';

interface RootHandlerProps {
  children: React.ReactNode;
}

/**
 * Root handler that manages OAuth callbacks and normal navigation
 */
export function RootHandler({ children }: RootHandlerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isProcessingCallback, setIsProcessingCallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if this is an OAuth callback (has 'code' parameter)
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    console.log('Root Handler - URL params:', {
      code: code ? 'present' : 'not present',
      error,
      isAuthenticated,
      fullUrl: location.pathname + location.search
    });

    // Handle OAuth error
    if (error) {
      console.error('OAuth provider error:', error);
      setError(`Authentication failed: ${error}`);
      // Clean URL and redirect to login after showing error
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
      return;
    }

    // Handle OAuth callback
    if (code && !isAuthenticated) {
      console.log('Processing OAuth callback with code');
      setIsProcessingCallback(true);
      handleOAuthCallback(code);
    }
  }, [location, navigate, isAuthenticated]);

  const handleOAuthCallback = async (code: string) => {
    console.log('Root Handler - Starting OAuth token exchange...');
    
    try {
      // Validate state parameter for security (if stored in sessionStorage)
      const urlParams = new URLSearchParams(location.search);
      const state = urlParams.get('state');
      const storedState = sessionStorage.getItem('oauthState');
      
      if (storedState && state !== storedState) {
        console.error('OAuth state mismatch:', { received: state, expected: storedState });
        throw new Error('Invalid authentication response - state mismatch');
      }

      // Clean up state from storage
      sessionStorage.removeItem('oauthState');

      // Exchange authorization code for token
      const response = await ft42AuthApi.exchangeCodeForToken(code);
      
      if (response.success) {
        console.log('Root Handler - Authentication successful');
        
        // Get redirect destination
        const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
        sessionStorage.removeItem('redirectAfterLogin');
        
        console.log('Root Handler - Redirecting to:', redirectTo);
        
        // Clean URL and redirect to intended destination
        navigate(redirectTo, { replace: true });
      } else {
        console.error('Root Handler - Token exchange failed:', response);
        throw new Error('Authentication failed - unable to verify credentials');
      }
    } catch (error) {
      console.error('Root Handler - OAuth callback error:', error);
      
      // Enhanced error handling with user-friendly messages
      let errorMessage = 'Authentication failed';
      if (error instanceof Error) {
        if (error.message.includes('TypeError: Failed to fetch')) {
          errorMessage = 'Network error: Unable to connect to authentication service. Please check your internet connection and try again.';
        } else if (error.message.includes('invalid_grant')) {
          errorMessage = 'Authentication code expired. Please try logging in again.';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'Browser security restriction detected. Please try refreshing the page.';
        } else if (error.message.includes('state mismatch')) {
          errorMessage = 'Security validation failed. Please try logging in again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setIsProcessingCallback(false);
      
      // Clean up URL and redirect to login after error
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 5000);
    }
  };

  // Check if this is an OAuth callback
  const urlParams = new URLSearchParams(location.search);
  const isCallback = urlParams.has('code') || isProcessingCallback;

  // Show loading during callback processing
  if (isCallback && !isAuthenticated) {
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
          {isProcessingCallback ? (
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
              <p className="text-gray-400 text-sm">
                Redirecting to login page...
              </p>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
