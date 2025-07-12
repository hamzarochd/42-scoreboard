import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/oauth2Service';
import { UserProfile } from '@/services/oauth2Config';

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export type UseAuthReturn = AuthState & AuthActions;

/**
 * React hook for OAuth2 authentication with 42 School
 * Provides complete authentication state and actions
 */
export const useOAuth2 = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  /**
   * Load user profile and update authentication state
   */
  const loadUser = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
      }
      
      if (!authService.isAuthenticated()) {
        setState(prev => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }));
        return;
      }

      const user = await authService.getCurrentUser();
      
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
      
    } catch (error) {
      console.error('❌ Failed to load user:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user profile';
      
      setState(prev => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      }));
      
      // If authentication failed, clear tokens
      if (errorMessage.includes('Authentication') || errorMessage.includes('401')) {
        await authService.logout();
      }
    }
  }, []);

  /**
   * Initialize authentication state on mount
   */
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Login action
   */
  const login = useCallback(async (redirectTo?: string) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await authService.initiateLogin(redirectTo);
    } catch (error) {
      console.error('❌ Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, []);

  /**
   * Logout action
   */
  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await authService.logout();
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
    } catch (error) {
      console.error('❌ Logout failed:', error);
      
      // Force clear state even if logout fails
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  /**
   * Refresh user profile
   */
  const refreshUser = useCallback(async () => {
    await loadUser(true);
  }, [loadUser]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    logout,
    refreshUser,
    clearError,
  };
};

/**
 * Hook to get authentication status without user data
 * Useful for components that only need to know if user is authenticated
 */
export const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    };

    checkAuth();
    
    // Check auth status periodically
    const interval = setInterval(checkAuth, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  return { isAuthenticated, isLoading };
};
