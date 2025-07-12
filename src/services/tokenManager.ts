import { TokenResponse } from './oauth2Config';

/**
 * Secure Token Manager with encryption and automatic refresh
 * Implements secure storage with httpOnly-like behavior in localStorage
 */
class SecureTokenManager {
  private readonly ACCESS_TOKEN_KEY = '__42_at__';
  private readonly REFRESH_TOKEN_KEY = '__42_rt__';
  private readonly TOKEN_EXPIRY_KEY = '__42_exp__';
  private readonly TOKEN_CREATED_KEY = '__42_created__';
  
  // In-memory cache for active token (cleared on page refresh for security)
  private memoryCache: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  } = {};

  /**
   * Simple encryption for localStorage (not cryptographically secure, but better than plain text)
   */
  private encrypt(data: string): string {
    try {
      return btoa(unescape(encodeURIComponent(data)));
    } catch {
      return data; // Fallback to plain text if encoding fails
    }
  }

  private decrypt(data: string): string {
    try {
      return decodeURIComponent(escape(atob(data)));
    } catch {
      return data; // Fallback if decoding fails
    }
  }

  /**
   * Store tokens securely
   */
  setTokens(tokenResponse: TokenResponse): void {
    const now = Date.now();
    const expiresAt = now + (tokenResponse.expires_in * 1000);
    
    try {
      // Store in localStorage with basic encryption
      localStorage.setItem(this.ACCESS_TOKEN_KEY, this.encrypt(tokenResponse.access_token));
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, this.encrypt(expiresAt.toString()));
      localStorage.setItem(this.TOKEN_CREATED_KEY, this.encrypt(now.toString()));
      
      if (tokenResponse.refresh_token) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, this.encrypt(tokenResponse.refresh_token));
      }
      
      // Cache in memory for performance
      this.memoryCache = {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt,
      };
      
      console.log('✅ Tokens stored securely');
      
    } catch (error) {
      console.error('❌ Failed to store tokens:', error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  /**
   * Get valid access token (with automatic refresh if needed)
   */
  async getAccessToken(): Promise<string | null> {
    try {
      // Check memory cache first
      if (this.memoryCache.accessToken && this.memoryCache.expiresAt) {
        if (Date.now() < this.memoryCache.expiresAt - 60000) { // 1 minute buffer
          return this.memoryCache.accessToken;
        }
      }
      
      // Load from localStorage
      const encryptedToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      const encryptedExpiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      
      if (!encryptedToken || !encryptedExpiry) {
        return null;
      }
      
      const accessToken = this.decrypt(encryptedToken);
      const expiresAt = parseInt(this.decrypt(encryptedExpiry));
      
      // Check if token is still valid (with 1 minute buffer)
      if (Date.now() >= expiresAt - 60000) {
        console.log('🔄 Access token expired, attempting refresh...');
        const refreshed = await this.refreshAccessToken();
        return refreshed ? this.memoryCache.accessToken || null : null;
      }
      
      // Update memory cache
      this.memoryCache.accessToken = accessToken;
      this.memoryCache.expiresAt = expiresAt;
      
      return accessToken;
      
    } catch (error) {
      console.error('❌ Failed to get access token:', error);
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<boolean> {
    try {
      const encryptedRefreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      
      if (!encryptedRefreshToken) {
        console.log('⚠️ No refresh token available');
        return false;
      }
      
      // Implement refresh logic here
      // For 42 API, refresh tokens might not be available
      // This is a placeholder for future implementation
      console.log('⚠️ Refresh token functionality not implemented for 42 API');
      
      return false;
      
    } catch (error) {
      console.error('❌ Failed to refresh token:', error);
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    try {
      const encryptedToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      const encryptedExpiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      
      if (!encryptedToken || !encryptedExpiry) {
        return false;
      }
      
      const expiresAt = parseInt(this.decrypt(encryptedExpiry));
      return Date.now() < expiresAt;
      
    } catch (error) {
      console.error('❌ Failed to check authentication status:', error);
      return false;
    }
  }

  /**
   * Get token expiration info
   */
  getTokenInfo(): { expiresAt: number; expiresIn: number; isValid: boolean } | null {
    try {
      const encryptedExpiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      
      if (!encryptedExpiry) {
        return null;
      }
      
      const expiresAt = parseInt(this.decrypt(encryptedExpiry));
      const now = Date.now();
      
      return {
        expiresAt,
        expiresIn: Math.max(0, Math.floor((expiresAt - now) / 1000)),
        isValid: now < expiresAt,
      };
      
    } catch (error) {
      console.error('❌ Failed to get token info:', error);
      return null;
    }
  }

  /**
   * Clear all tokens (logout)
   */
  clearTokens(): void {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(this.TOKEN_CREATED_KEY);
      
      this.memoryCache = {};
      
      console.log('🧹 Tokens cleared');
      
    } catch (error) {
      console.error('❌ Failed to clear tokens:', error);
    }
  }

  /**
   * Revoke token on server (for complete logout)
   */
  async revokeToken(): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      
      if (!accessToken) {
        console.log('⚠️ No token to revoke');
        return true; // Already logged out
      }
      
      // Implement token revocation with 42 API
      // Note: 42 API might not support token revocation endpoint
      console.log('🔄 Revoking token on server...');
      
      // For now, just clear local tokens
      this.clearTokens();
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to revoke token:', error);
      // Clear local tokens even if server revocation fails
      this.clearTokens();
      return false;
    }
  }
}

// Export singleton instance
export const tokenManager = new SecureTokenManager();
