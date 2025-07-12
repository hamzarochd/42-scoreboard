import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { simpleAuth } from '@/services/simpleAuth';

export const SimpleDebugAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [serverEnv, setServerEnv] = useState<any>(null);
  const [loadingServerEnv, setLoadingServerEnv] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');
    const config = simpleAuth.getConfig();

    setDebugInfo({
      urlParams: {
        code: code ? `${code.substring(0, 10)}...` : null,
        error,
        state,
        hasCode: !!code,
        hasState: !!state,
      },
      currentUrl: window.location.href,
      origin: window.location.origin,
      pathname: window.location.pathname,
      config: config,
      localStorage: {
        hasAccessToken: !!localStorage.getItem('access_token'),
        hasUserData: !!localStorage.getItem('user_data'),
        oauthState: sessionStorage.getItem('oauth_state'),
      },
      environment: {
        isDev: import.meta.env.DEV,
        mode: import.meta.env.MODE,
        useRealApi: import.meta.env.VITE_USE_REAL_API,
        clientId: import.meta.env.VITE_42_CLIENT_ID ? 'Set' : 'Missing',
        redirectUri: import.meta.env.VITE_42_REDIRECT_URI || 'Using default',
        baseUrl: import.meta.env.VITE_42_API_BASE_URL || 'Using default',
      },
      timestamp: new Date().toISOString(),
    });
  }, [searchParams]);

  const testServerEnv = async () => {
    setLoadingServerEnv(true);
    try {
      const response = await fetch('/api/debug-env');
      if (response.ok) {
        const data = await response.json();
        setServerEnv(data);
      } else {
        setServerEnv({ 
          error: 'Failed to fetch server environment',
          status: response.status,
          isDev: import.meta.env.DEV,
          note: import.meta.env.DEV ? 'Serverless functions may not work in development' : 'Check Vercel deployment'
        });
      }
    } catch (error) {
      setServerEnv({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isDev: import.meta.env.DEV,
        note: import.meta.env.DEV ? 'This is expected in development mode' : 'Network or deployment issue'
      });
    } finally {
      setLoadingServerEnv(false);
    }
  };

  const testOAuthFlow = () => {
    console.log('🧪 Testing OAuth flow...');
    simpleAuth.login();
  };

  const clearAuth = () => {
    simpleAuth.logout();
    sessionStorage.clear();
    window.location.reload();
  };

  const testDirectApi = async () => {
    console.log('🧪 Testing direct API access...');
    
    try {
      const config = simpleAuth.getConfig();
      
      // Test API reachability
      const testUrl = `${config.baseUrl}/oauth/authorize?client_id=${config.clientId}&response_type=code&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=public&state=test`;
      
      console.log('Generated OAuth URL:', testUrl);
      
      // Try to ping the API
      const response = await fetch(`${config.baseUrl}/v2/campus`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('API ping response:', {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
    } catch (error) {
      console.error('API test failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🔍 Enhanced Debug Authentication
          </h1>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={testOAuthFlow}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Test OAuth Flow
            </button>
            
            <button
              onClick={testServerEnv}
              disabled={loadingServerEnv}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loadingServerEnv ? 'Testing...' : 'Test Server Env'}
            </button>
            
            <button
              onClick={testDirectApi}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Test API Access
            </button>
            
            <button
              onClick={clearAuth}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear Auth Data
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* URL Parameters */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                URL Parameters & State
              </h2>
              <pre className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
                {JSON.stringify(debugInfo.urlParams, null, 2)}
              </pre>
            </div>

            {/* OAuth Configuration */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                OAuth Configuration
              </h2>
              <pre className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                {JSON.stringify(debugInfo.config, null, 2)}
              </pre>
            </div>

            {/* Environment Variables */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Client Environment
              </h2>
              <pre className="text-sm text-yellow-700 dark:text-yellow-300 whitespace-pre-wrap">
                {JSON.stringify(debugInfo.environment, null, 2)}
              </pre>
            </div>

            {/* Local Storage */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                Storage State
              </h2>
              <pre className="text-sm text-purple-700 dark:text-purple-300 whitespace-pre-wrap">
                {JSON.stringify(debugInfo.localStorage, null, 2)}
              </pre>
            </div>

            {/* Server Environment */}
            {serverEnv && (
              <div className="lg:col-span-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                  Server Environment
                </h2>
                <pre className="text-sm text-indigo-700 dark:text-indigo-300 whitespace-pre-wrap">
                  {JSON.stringify(serverEnv, null, 2)}
                </pre>
              </div>
            )}

            {/* Current URL Info */}
            <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                URL Information
              </h2>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div><strong>Current URL:</strong> {debugInfo.currentUrl}</div>
                <div><strong>Origin:</strong> {debugInfo.origin}</div>
                <div><strong>Pathname:</strong> {debugInfo.pathname}</div>
                <div><strong>Timestamp:</strong> {debugInfo.timestamp}</div>
              </div>
            </div>

          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Login
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
