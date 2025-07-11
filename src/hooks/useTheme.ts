import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

/**
 * Hook for managing dark/light theme
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [systemTheme, setSystemTheme] = useState<Theme>('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, systemTheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
    systemTheme,
  };
}
