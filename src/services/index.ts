import { api as mockApi } from './mockApi';
import { ft42Api } from './ft42Api';

/**
 * API Configuration
 * Set USE_REAL_API to true to use the real 42 School API
 * Set to false to use mock data for development
 */
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';

/**
 * Unified API interface that switches between mock and real API
 * based on environment configuration
 */
export const api = USE_REAL_API ? ft42Api : mockApi;

/**
 * API Mode indicator for debugging
 */
export const API_MODE = USE_REAL_API ? 'REAL' : 'MOCK';

/**
 * Helper function to log API mode
 */
export const logApiMode = () => {
  console.log(`🔌 API Mode: ${API_MODE}`);
  if (USE_REAL_API) {
    console.log('📡 Using real 42 School API');
  } else {
    console.log('🎭 Using mock API for development');
  }
};

// Re-export for backward compatibility
export * from './mockApi';
export * from './mockData';
export * from './ft42Api';
export * from './simpleAuth';

// New OAuth2 system
export * from './oauth2Config';
export * from './oauth2Service';
export * from './tokenManager';
export * from './rateLimiter';
export * from './apiClient';
