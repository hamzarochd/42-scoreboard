/**
 * 42 School OAuth2 Configuration
 * Complete OAuth2 implementation with PKCE and security best practices
 */

export interface OAuth2Config {
  clientId: string;
  clientSecret?: string; // Only for server-side
  redirectUri: string;
  baseUrl: string;
  scope: string;
  tokenEndpoint: string;
  authorizeEndpoint: string;
  userInfoEndpoint: string;
  revokeEndpoint: string;
}

export interface OAuth2State {
  state: string;
  codeVerifier?: string; // For PKCE
  timestamp: number;
  redirectTo?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  created_at: number;
}

export interface UserProfile {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_full_name: string;
  usual_first_name: string;
  url: string;
  phone: string;
  displayname: string;
  kind: string;
  image: {
    link: string;
    versions: {
      large: string;
      medium: string;
      small: string;
      micro: string;
    };
  };
  staff: boolean;
  correction_point: number;
  pool_month: string;
  pool_year: string;
  location: string;
  wallet: number;
  anonymize_date: string;
  data_erasure_date: string;
  created_at: string;
  updated_at: string;
  alumnized_at: string;
  alumni: boolean;
  active: boolean;
  campus: Array<{
    id: number;
    name: string;
    time_zone: string;
    language: {
      id: number;
      name: string;
      identifier: string;
    };
    users_count: number;
    vogsphere_id: number;
    country: string;
    address: string;
    zip: string;
    city: string;
    website: string;
    facebook: string;
    twitter: string;
    active: boolean;
    public: boolean;
    email_extension: string;
    default_hidden_phone: boolean;
  }>;
  cursus_users: Array<{
    grade: string;
    level: number;
    skills: Array<{
      id: number;
      name: string;
      level: number;
    }>;
    blackholed_at: string;
    id: number;
    begin_at: string;
    end_at: string;
    cursus_id: number;
    has_coalition: boolean;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      login: string;
      url: string;
    };
    cursus: {
      id: number;
      created_at: string;
      name: string;
      slug: string;
      kind: string;
    };
  }>;
}

// Environment configuration
export const createOAuth2Config = (): OAuth2Config => {
  const baseUrl = 'https://api.intra.42.fr';
  
  return {
    clientId: import.meta.env.VITE_42_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_42_CLIENT_SECRET || '', // Server-side only
    redirectUri: import.meta.env.VITE_42_REDIRECT_URI || `${window.location.origin}/auth/callback`,
    baseUrl,
    scope: 'public',
    tokenEndpoint: `${baseUrl}/oauth/token`,
    authorizeEndpoint: `${baseUrl}/oauth/authorize`,
    userInfoEndpoint: `${baseUrl}/v2/me`,
    revokeEndpoint: `${baseUrl}/oauth/token/revoke`,
  };
};

// CSRF State Management
export const generateSecureState = (): OAuth2State => {
  const state = crypto.getRandomValues(new Uint8Array(32))
    .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
  
  return {
    state,
    timestamp: Date.now(),
  };
};

// PKCE Implementation (for enhanced security)
export const generatePKCE = async () => {
  const codeVerifier = crypto.getRandomValues(new Uint8Array(32))
    .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
  
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: 'S256'
  };
};

// Rate limiting configuration for 42 API
export const RATE_LIMITS = {
  requestsPerSecond: 2,
  requestsPerHour: 1200,
  burstLimit: 10,
} as const;

// Security headers for API calls
export const SECURITY_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
} as const;
