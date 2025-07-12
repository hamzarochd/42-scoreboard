import React, { useState } from 'react';
import { API_CONFIG } from '@/services/ft42Api';

export const TestOAuth: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test: string, status: 'success' | 'error' | 'info', details: any) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      details,
      timestamp: new Date().toISOString()
    }]);
  };

  const testOAuthUrl = () => {
    addResult('OAuth URL Generation', 'info', 'Starting test...');
    
    try {
      const state = Math.random().toString(36).substring(7);
      const authUrl = `${API_CONFIG.baseUrl}/oauth/authorize?` +
        `client_id=${encodeURIComponent(API_CONFIG.clientId)}&` +
        `redirect_uri=${encodeURIComponent(API_CONFIG.redirectUri)}&` +
        `response_type=code&` +
        `scope=public&` +
        `state=${state}`;

      addResult('OAuth URL Generation', 'success', {
        authUrl: authUrl.substring(0, 100) + '...',
        components: {
          baseUrl: API_CONFIG.baseUrl,
          clientId: API_CONFIG.clientId.substring(0, 10) + '...',
          redirectUri: API_CONFIG.redirectUri,
          state
        }
      });

      // Open in new tab for testing
      window.open(authUrl, '_blank');
      
    } catch (error) {
      addResult('OAuth URL Generation', 'error', error);
    }
  };

  const testServerEndpoint = async () => {
    setLoading(true);
    addResult('Server Endpoint Test', 'info', 'Testing /api/debug-env...');
    
    try {
      const response = await fetch('/api/debug-env');
      const data = await response.json();
      
      if (response.ok) {
        addResult('Server Endpoint Test', 'success', data);
      } else {
        addResult('Server Endpoint Test', 'error', data);
      }
    } catch (error) {
      addResult('Server Endpoint Test', 'error', error);
    } finally {
      setLoading(false);
    }
  };

  const testDirectToken = async () => {
    const testCode = 'test_code_123';
    addResult('Direct Token Test', 'info', 'Testing direct API call...');
    
    try {
      const tokenRequest = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: API_CONFIG.clientId,
        client_secret: API_CONFIG.clientSecret,
        code: testCode,
        redirect_uri: API_CONFIG.redirectUri,
      });

      const response = await fetch(`${API_CONFIG.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: tokenRequest,
      });

      const responseText = await response.text();
      
      addResult('Direct Token Test', response.ok ? 'success' : 'error', {
        status: response.status,
        response: responseText.substring(0, 200),
        note: 'This should fail with invalid code, but shows if credentials work'
      });

    } catch (error) {
      addResult('Direct Token Test', 'error', error);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🧪 OAuth Testing Page
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button
              onClick={testOAuthUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Test OAuth URL
            </button>
            
            <button
              onClick={testServerEndpoint}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Test Server
            </button>
            
            <button
              onClick={testDirectToken}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Test Direct API
            </button>
            
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Clear Results
            </button>
          </div>

          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.status === 'success' 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                    : result.status === 'error'
                    ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                    : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {result.test}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    result.status === 'success' ? 'bg-green-200 text-green-800' :
                    result.status === 'error' ? 'bg-red-200 text-red-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(result.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {testResults.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Click a test button above to start testing OAuth functionality
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
