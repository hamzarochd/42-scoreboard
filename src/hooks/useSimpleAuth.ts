import { useState, useEffect } from 'react';
import { User } from '@/types';
import { simpleAuth } from '@/services/simpleAuth';

export const useSimpleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      try {
        if (simpleAuth.isLoggedIn()) {
          const userData = simpleAuth.getCurrentUser();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        simpleAuth.logout(); // Clear invalid data
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    simpleAuth.login();
  };

  const logout = () => {
    simpleAuth.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};
