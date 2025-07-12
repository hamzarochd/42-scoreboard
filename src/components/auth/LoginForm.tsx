import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks';
import { LoadingSpinner } from '@/components/common';
import { ft42AuthApi } from '@/services/ft42Api';
import { API_MODE } from '@/services';

/**
 * Login form component
 */
export function LoginForm() {
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, isAuthenticated } = useAuth();
  const location = useLocation();

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(credentials.login, credentials.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({ ...prev, [field]: e.target.value }));
    if (error) setError(null);
  };

  const handleOAuthLogin = () => {
    // Store current location for redirect after login
    const from = (location.state as any)?.from?.pathname || '/';
    sessionStorage.setItem('redirectAfterLogin', from);
    
    // Generate and store state for security
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauthState', state);
    
    const authUrl = ft42AuthApi.getAuthUrl(state);
    window.location.href = authUrl;
  };

  const isApiConfigured = () => {
    const clientId = import.meta.env.VITE_42_CLIENT_ID;
    return clientId && clientId !== 'your_client_id_here';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-8 max-w-sm">
            <img src="/logo.png" alt="Logo" className="w-full h-auto object-contain mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            Sign in
          </h2>
          <p className="mt-2 text-sm text-dark-500">
            {API_MODE === 'REAL' ? 
              (isApiConfigured() ? 'Usa il tuo account 42 School' : 'Configura le credenziali API per continuare') : 
              'Entra con le credenziali demo o configura l\'API 42'
            }
          </p>
        </div>

        {/* Show demo login in mock mode or as primary option */}
        {API_MODE === 'MOCK' && (
          <div className="space-y-4">
            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="login" className="block text-sm font-medium text-white mb-2">
                    Login
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-dark-400" />
                    </div>
                    <input
                      id="login"
                      name="login"
                      type="text"
                      required
                      value={credentials.login}
                      onChange={handleInputChange('login')}
                      className="input-field pl-10"
                      placeholder="Enter your login"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-dark-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={credentials.password}
                      onChange={handleInputChange('password')}
                      className="input-field pl-10 pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-dark-400 hover:text-accent-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-dark-400 hover:text-accent-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-4">
                <p className="text-sm text-accent-400">
                  <strong>Credenziali demo:</strong> hmrochd / password
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  'Accedi'
                )}
              </button>
            </form>

            {/* Optional OAuth section for mock mode */}
            {isApiConfigured() && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dark-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-black text-dark-500">Oppure</span>
                  </div>
                </div>
                
                <button
                  onClick={handleOAuthLogin}
                  className="group relative w-full flex justify-center items-center py-3 px-4 border border-dark-300 text-sm font-medium rounded-lg text-white bg-transparent hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 focus:ring-offset-black transition-all duration-200"
                >
                  <span className="mr-2">Accedi con 42 School</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* OAuth Login Button for real API mode */}
        {API_MODE === 'REAL' && isApiConfigured() && (
          <div className="space-y-4">
            <button
              onClick={handleOAuthLogin}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 focus:ring-offset-black transition-all duration-200 accent-glow"
            >
              <span className="mr-2 font-semibold">Accedi con 42 School</span>
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
