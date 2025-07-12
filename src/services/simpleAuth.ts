import { User, ApiResponse } from '@/types';

/**
 * Simple 42 School OAuth Configuration
 */
const OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_42_CLIENT_ID || '',
  redirectUri: import.meta.env.VITE_42_REDIRECT_URI || window.location.origin + '/oauth/callback',
  baseUrl: 'https://api.intra.42.fr',
  scope: 'public'
};

/**
 * Simple Authentication Service
 */
class SimpleAuth {
  
  /**
   * Redirect to 42 School OAuth
   */
  login() {
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);
    
    const authUrl = new URL(`${OAUTH_CONFIG.baseUrl}/oauth/authorize`);
    authUrl.searchParams.set('client_id', OAUTH_CONFIG.clientId);
    authUrl.searchParams.set('redirect_uri', OAUTH_CONFIG.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', OAUTH_CONFIG.scope);
    authUrl.searchParams.set('state', state);
    
    console.log('🚀 Redirecting to 42 OAuth:', authUrl.toString());
    window.location.href = authUrl.toString();
  }

  /**
   * Handle OAuth callback - Simple version
   */
  async handleCallback(code: string, state: string): Promise<ApiResponse<User>> {
    console.log('🔄 Handling OAuth callback...');
    
    // Verify state
    const savedState = sessionStorage.getItem('oauth_state');
    if (state !== savedState) {
      console.error('❌ State mismatch!');
      return { success: false, error: 'State verification failed' };
    }
    
    try {
      // Exchange code for token using client credentials (simplified)
      const tokenResponse = await this.exchangeCode(code);
      
      if (!tokenResponse.success || !tokenResponse.data) {
        return { 
          success: false, 
          error: tokenResponse.error || 'Token exchange failed' 
        };
      }
      
      // Get user info
      const userResponse = await this.getUserInfo(tokenResponse.data.access_token);
      
      if (userResponse.success) {
        // Store token and user data
        localStorage.setItem('access_token', tokenResponse.data.access_token);
        localStorage.setItem('user_data', JSON.stringify(userResponse.data));
        
        console.log('✅ Authentication successful!');
        return userResponse;
      }
      
      return userResponse;
      
    } catch (error) {
      console.error('💥 Authentication error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Authentication failed' 
      };
    }
  }

  /**
   * Exchange authorization code for token
   */
  private async exchangeCode(code: string): Promise<ApiResponse<{access_token: string}>> {
    console.log('🔑 Exchanging code for token...');
    
    try {
      const response = await fetch(`${OAUTH_CONFIG.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: OAUTH_CONFIG.clientId,
          code: code,
          redirect_uri: OAUTH_CONFIG.redirectUri,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Token exchange failed:', response.status, errorText);
        return { 
          success: false, 
          error: `Token exchange failed: ${response.status}` 
        };
      }

      const tokenData = await response.json();
      console.log('✅ Token received successfully');
      
      return {
        success: true,
        data: { access_token: tokenData.access_token }
      };
      
    } catch (error) {
      console.error('💥 Token exchange error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Token exchange failed' 
      };
    }
  }

  /**
   * Get user information
   */
  private async getUserInfo(accessToken: string): Promise<ApiResponse<User>> {
    console.log('👤 Fetching user info...');
    
    try {
      const response = await fetch(`${OAUTH_CONFIG.baseUrl}/v2/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error('❌ User info fetch failed:', response.status);
        return { 
          success: false, 
          error: `Failed to fetch user info: ${response.status}` 
        };
      }

      const userData = await response.json();
      console.log('✅ User info received');
      
      // Transform to our User type
      const user: User = {
        id: userData.id.toString(),
        email: userData.email,
        login: userData.login,
        firstName: userData.first_name || '',
        lastName: userData.last_name || '',
        displayName: userData.displayname || userData.login,
        avatar: userData.image?.link || '',
        campus: userData.campus?.[0]?.name || 'Unknown',
        cursus: userData.cursus_users?.[0]?.cursus?.name || 'Unknown',
        level: userData.cursus_users?.[0]?.level || 0,
        grade: userData.cursus_users?.[0]?.grade || null,
        wallet: userData.wallet || 0,
        correction_point: userData.correction_point || 0,
        pool_month: userData.pool_month || null,
        pool_year: userData.pool_year || null,
        location: userData.location || null,
        kind: userData.kind || 'student',
        staff: userData.staff || false,
        active: userData.active || true,
      };

      return {
        success: true,
        data: user
      };
      
    } catch (error) {
      console.error('💥 User info error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch user info' 
      };
    }
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Get current user data
   */
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    sessionStorage.removeItem('oauth_state');
    console.log('👋 User logged out');
  }

  /**
   * Get configuration for debugging
   */
  getConfig() {
    return {
      clientId: OAUTH_CONFIG.clientId,
      redirectUri: OAUTH_CONFIG.redirectUri,
      baseUrl: OAUTH_CONFIG.baseUrl,
      scope: OAUTH_CONFIG.scope,
      hasClientId: !!OAUTH_CONFIG.clientId,
    };
  }
}

// Export singleton instance
export const simpleAuth = new SimpleAuth();
