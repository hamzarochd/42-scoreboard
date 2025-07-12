// Application constants
export const APP_NAME = '42 School Scoreboard';

// API Configuration
export const API_BASE_URL = 'https://api.intra.42.fr';
export const MOCK_API_DELAY = 500; // ms

// Authentication
export const AUTH_STORAGE_KEY = '42_scoreboard_auth';
export const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms

// OAuth2 Configuration for GitHub Codespaces
export const OAUTH2_CONFIG = {
  CLIENT_ID: 'u-s4t2ud-6b5ae25c98f81e975800cd30130f255d726649fa1f68fc4a0f5cc2168410bc65',
  REDIRECT_URI: 'https://reimagined-space-fiesta-v7jwvj6gp6rfwpvq-5174.app.github.dev/oauth/callback',
  SCOPE: 'public',
  RESPONSE_TYPE: 'code',
  AUTHORIZE_URL: 'https://api.intra.42.fr/oauth/authorize',
  TOKEN_URL: 'https://api.intra.42.fr/oauth/token',
};

// Demo credentials
export const DEMO_CREDENTIALS = {
  login: 'hmrochd',
  password: 'password',
};

// 42 School branding colors
export const COLORS = {
  primary: '#3b82f6',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
};

// Promotion years available
export const PROMO_YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Pool years/months
export const POOL_YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
export const POOL_MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

// Campus locations
export const CAMPUSES = [
  'Paris',
  'Fremont',
  'Madrid',
  'Barcelona',
  'Berlin',
  'Brussels',
  'Tokyo',
  'Seoul',
  'Istanbul',
  'Moscow',
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'level', label: 'Level' },
  { value: 'name', label: 'Name' },
  { value: 'login', label: 'Login' },
];

// Card animation delays for staggered loading
export const CARD_ANIMATION_DELAY = 50; // ms between each card

// Local storage keys
export const STORAGE_KEYS = {
  AUTH: 'auth',
  THEME: 'theme',
  FILTERS: 'filters',
} as const;
