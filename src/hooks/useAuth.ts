import { useState, useEffect } from 'react';
import { AuthState } from '@/types';
import { api } from '@/services';
import { AUTH_STORAGE_KEY } from '@/utils/constants';

// Initial auth state
const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

/**
 * Custom hook for authentication logic
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  // Check for existing authentication on mount
  useEffect(() => {
    checkExistingAuth();
  }, []);

  /**
   * Check if user is already authenticated (e.g., from localStorage)
   */
  const checkExistingAuth = async () => {
    try {
      const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
      
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        
        if (parsedAuth.token && parsedAuth.user) {
          // In a real app, validate the token with the server
          // For now, we'll trust the stored data
          setAuthState({
            user: parsedAuth.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }
    } catch (error) {
      console.warn('Error checking existing auth:', error);
      // Clear invalid stored data
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    
    setAuthState(prev => ({ ...prev, isLoading: false }));
  };

  /**
   * Login function
   */
  const login = async (login: string, password: string): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Check if login method exists (mock API has it, real API doesn't)
      if ('login' in api.auth) {
        const response = await (api.auth as any).login({ login, password });
        
        if (response.success && response.data) {
          const authData = {
            user: response.data,
            token: 'mock-jwt-token', // In real app, this would come from server
            timestamp: Date.now(),
          };
          
          // Store auth data
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
          
          setAuthState({
            user: response.data,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        // For real API, redirect to OAuth
        throw new Error('Please use OAuth login for 42 School authentication');
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  /**
   * OAuth login function for 42 School authentication
   */
  const loginWithOAuth = async (user: any): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const authData = {
        user,
        token: '42-oauth-token', // Token is managed by the 42 API service
        timestamp: Date.now(),
      };
      
      // Store auth data
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  /**
   * Logout function
   */
  const logout = async (): Promise<void> => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local state and storage
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  return {
    ...authState,
    login,
    loginWithOAuth,
    logout,
  };
}
