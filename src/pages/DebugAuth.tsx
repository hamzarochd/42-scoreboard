import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_CONFIG } from '@/services/ft42Api';

export const DebugAuth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [serverEnv, setServerEnv] = useState<any>(null);
  const [loadingServerEnv, setLoadingServerEnv] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    setDebugInfo({
      code: code ? `${code.substring(0, 10)}...` : null,
      error,
      state,
      currentUrl: window.location.href,
      origin: window.location.origin,
      configuredRedirectUri: API_CONFIG.redirectUri,
      clientId: API_CONFIG.clientId,
      baseUrl: API_CONFIG.baseUrl,
      hasClientSecret: !!API_CONFIG.clientSecret,
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
        setServerEnv({ error: 'Failed to fetch server environment' });
      }
    } catch (error) {
      setServerEnv({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoadingServerEnv(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🔍 Debug Authentication
          </h1>
          
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                URL Parameters
              </h2>
              <pre className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-wrap">
                {JSON.stringify({
                  code: debugInfo.code,
                  error: debugInfo.error,
                  state: debugInfo.state,
                }, null, 2)}
              </pre>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                Configuration
              </h2>
              <pre className="text-sm text-green-700 dark:text-green-300 whitespace-pre-wrap">
                {JSON.stringify({
                  currentUrl: debugInfo.currentUrl,
                  origin: debugInfo.origin,
                  configuredRedirectUri: debugInfo.configuredRedirectUri,
                  clientId: debugInfo.clientId,
                  baseUrl: debugInfo.baseUrl,
                  hasClientSecret: debugInfo.hasClientSecret,
                }, null, 2)}
              </pre>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Environment Variables Status
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${import.meta.env.VITE_USE_REAL_API ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-yellow-700 dark:text-yellow-300">
                    VITE_USE_REAL_API: {import.meta.env.VITE_USE_REAL_API || 'false'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${import.meta.env.VITE_42_CLIENT_ID ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-yellow-700 dark:text-yellow-300">
                    VITE_42_CLIENT_ID: {import.meta.env.VITE_42_CLIENT_ID ? 'Set' : 'Not set'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${import.meta.env.VITE_42_CLIENT_SECRET ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-yellow-700 dark:text-yellow-300">
                    VITE_42_CLIENT_SECRET: {import.meta.env.VITE_42_CLIENT_SECRET ? 'Set' : 'Not set'}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${import.meta.env.VITE_42_REDIRECT_URI ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-yellow-700 dark:text-yellow-300">
                    VITE_42_REDIRECT_URI: {import.meta.env.VITE_42_REDIRECT_URI || 'Using default'}
                  </span>
                </div>
              </div>
            </div>

            {/* Server Environment Test */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                Server Environment Variables
              </h2>
              <button
                onClick={testServerEnv}
                disabled={loadingServerEnv}
                className="mb-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingServerEnv ? 'Testing...' : 'Test Server Environment'}
              </button>
              
              {serverEnv && (
                <pre className="text-sm text-purple-700 dark:text-purple-300 whitespace-pre-wrap">
                  {JSON.stringify(serverEnv, null, 2)}
                </pre>
              )}
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                Troubleshooting
              </h2>
              <div className="text-sm text-red-700 dark:text-red-300 space-y-2">
                {debugInfo.error && (
                  <p>❌ OAuth Error: {debugInfo.error}</p>
                )}
                {!debugInfo.code && !debugInfo.error && (
                  <p>⚠️ No authorization code or error in URL parameters</p>
                )}
                {debugInfo.configuredRedirectUri !== debugInfo.currentUrl?.split('?')[0] && (
                  <p>⚠️ Redirect URI mismatch detected</p>
                )}
                {!debugInfo.hasClientSecret && (
                  <p>❌ Client secret not configured</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Actions
              </h2>
              <div className="space-x-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Login
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
