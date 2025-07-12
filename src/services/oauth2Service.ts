import { 
  createOAuth2Config, 
  generateSecureState, 
  generatePKCE,
  OAuth2State,
  TokenResponse
} from './oauth2Config';
import { tokenManager } from './tokenManager';
import { apiClient } from './apiClient';

/**
 * OAuth2 Authentication Service for 42 School
 * Implements complete OAuth2 Authorization Code flow with PKCE and security best practices
 */
class OAuth2AuthService {
  private config = createOAuth2Config();
  private readonly STATE_KEY = '__42_oauth_state__';
  private readonly PKCE_KEY = '__42_pkce__';

  /**
   * Step 1: Initiate OAuth2 authorization flow
   */
  async initiateLogin(redirectTo?: string): Promise<void> {
    try {
      console.log('🚀 Initiating OAuth2 login flow...');
      
      // Validate configuration
      if (!this.config.clientId) {
        throw new Error('OAuth2 client ID not configured. Please set VITE_42_CLIENT_ID environment variable.');
      }
      
      // Generate secure state and PKCE parameters
      const state = generateSecureState();
      const pkce = await generatePKCE();
      
      // Store state and PKCE securely
      state.redirectTo = redirectTo;
      sessionStorage.setItem(this.STATE_KEY, JSON.stringify(state));
      sessionStorage.setItem(this.PKCE_KEY, JSON.stringify(pkce));
      
      // Build authorization URL
      const authUrl = new URL(this.config.authorizeEndpoint);
      authUrl.searchParams.set('client_id', this.config.clientId);
      authUrl.searchParams.set('redirect_uri', this.config.redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', this.config.scope);
      authUrl.searchParams.set('state', state.state);
      authUrl.searchParams.set('code_challenge', pkce.codeChallenge);
      authUrl.searchParams.set('code_challenge_method', pkce.codeChallengeMethod);
      
      console.log('🔗 Redirecting to authorization URL:', authUrl.toString());
      
      // Redirect to authorization server
      window.location.href = authUrl.toString();
      
    } catch (error) {
      console.error('❌ Failed to initiate OAuth2 login:', error);
      throw error;
    }
  }

  /**
   * Step 2: Handle OAuth2 callback and exchange code for token
   */
  async handleCallback(code: string, state: string, error?: string): Promise<{ success: boolean; redirectTo?: string; error?: string }> {
    try {
      console.log('🔄 Handling OAuth2 callback...');
      
      // Handle OAuth2 errors
      if (error) {
        console.error('❌ OAuth2 authorization error:', error);
        this.clearOAuthState();
        return { success: false, error: `Authorization failed: ${error}` };
      }
      
      // Validate required parameters
      if (!code) {
        console.error('❌ No authorization code received');
        this.clearOAuthState();
        return { success: false, error: 'No authorization code received' };
      }
      
      if (!state) {
        console.error('❌ No state parameter received');
        this.clearOAuthState();
        return { success: false, error: 'No state parameter received' };
      }
      
      // Retrieve and validate stored state
      const storedStateData = sessionStorage.getItem(this.STATE_KEY);
      if (!storedStateData) {
        console.error('❌ No stored OAuth state found');
        return { success: false, error: 'Invalid authentication session' };
      }
      
      const storedState: OAuth2State = JSON.parse(storedStateData);
      
      // Validate state parameter (CSRF protection)
      if (state !== storedState.state) {
        console.error('❌ State parameter mismatch - possible CSRF attack');
        this.clearOAuthState();
        return { success: false, error: 'Invalid state parameter - security check failed' };
      }
      
      // Check state timestamp (prevent replay attacks)
      const stateAge = Date.now() - storedState.timestamp;
      if (stateAge > 600000) { // 10 minutes
        console.error('❌ OAuth state expired');
        this.clearOAuthState();
        return { success: false, error: 'Authentication session expired' };
      }
      
      // Exchange authorization code for access token
      const tokenResponse = await this.exchangeCodeForToken(code);
      
      // Store tokens securely
      tokenManager.setTokens(tokenResponse);
      
      // Get redirect URL
      const redirectTo = storedState.redirectTo || '/';
      
      // Clear OAuth state
      this.clearOAuthState();
      
      console.log('✅ OAuth2 authentication successful');
      
      return { success: true, redirectTo };
      
    } catch (error) {
      console.error('❌ OAuth2 callback error:', error);
      this.clearOAuthState();
      
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Exchange authorization code for access token
   */
  private async exchangeCodeForToken(code: string): Promise<TokenResponse> {
    try {
      console.log('🔑 Exchanging authorization code for access token...');
      
      // Retrieve PKCE parameters
      const storedPKCEData = sessionStorage.getItem(this.PKCE_KEY);
      if (!storedPKCEData) {
        throw new Error('PKCE parameters not found');
      }
      
      const pkce = JSON.parse(storedPKCEData);
      
      // Prepare token request
      const tokenRequest = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        code: code,
        redirect_uri: this.config.redirectUri,
        code_verifier: pkce.codeVerifier,
      });
      
      // Add client secret if available (for confidential clients)
      if (this.config.clientSecret) {
        tokenRequest.set('client_secret', this.config.clientSecret);
      }
      
      // Make token request
      const response = await fetch(this.config.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: tokenRequest,
        credentials: 'omit',
        mode: 'cors',
      });
      
      if (!response.ok) {
        let errorMessage = `Token exchange failed: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error_description || errorData.error || errorMessage;
        } catch {
          // Could not parse error response
        }
        
        throw new Error(errorMessage);
      }
      
      const tokenResponse: TokenResponse = await response.json();
      
      // Validate token response
      if (!tokenResponse.access_token) {
        throw new Error('Invalid token response - no access token received');
      }
      
      console.log('✅ Access token received successfully');
      
      return tokenResponse;
      
    } catch (error) {
      console.error('❌ Token exchange failed:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }
      
      return await apiClient.getCurrentUser();
      
    } catch (error) {
      console.error('❌ Failed to get current user:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      console.log('👋 Logging out user...');
      
      // Revoke token on server (if supported)
      await tokenManager.revokeToken();
      
      // Clear OAuth state
      this.clearOAuthState();
      
      console.log('✅ Logout completed');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Continue with logout even if server revocation fails
      tokenManager.clearTokens();
      this.clearOAuthState();
    }
  }

  /**
   * Clear OAuth state from session storage
   */
  private clearOAuthState(): void {
    sessionStorage.removeItem(this.STATE_KEY);
    sessionStorage.removeItem(this.PKCE_KEY);
  }

  /**
   * Get authentication status and configuration
   */
  getStatus() {
    const apiStatus = apiClient.getStatus();
    
    return {
      ...apiStatus,
      oauthState: {
        hasStoredState: !!sessionStorage.getItem(this.STATE_KEY),
        hasStoredPKCE: !!sessionStorage.getItem(this.PKCE_KEY),
      },
    };
  }

  /**
   * Force token refresh (if refresh token is available)
   */
  async refreshToken(): Promise<boolean> {
    return tokenManager.refreshAccessToken();
  }
}

// Export singleton instance
export const authService = new OAuth2AuthService();
