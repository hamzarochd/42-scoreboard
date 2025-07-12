import { 
  createOAuth2Config, 
  OAuth2Config, 
  UserProfile,
  SECURITY_HEADERS 
} from './oauth2Config';
import { tokenManager } from './tokenManager';
import { rateLimiter } from './rateLimiter';

/**
 * Secure API Client for 42 School API
 * Implements automatic authentication, rate limiting, and error handling
 */
class SecureAPIClient {
  private config: OAuth2Config;
  private isRefreshing = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.config = createOAuth2Config();
  }

  /**
   * Make authenticated API request with automatic retry and rate limiting
   */
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> {
    // Wait for rate limiter
    await rateLimiter.waitForSlot();
    
    try {
      // Get access token
      const accessToken = await tokenManager.getAccessToken();
      
      if (!accessToken) {
        throw new APIError('No valid access token', 401, 'UNAUTHORIZED');
      }
      
      // Prepare request
      const url = endpoint.startsWith('http') ? endpoint : `${this.config.baseUrl}${endpoint}`;
      const headers = {
        ...SECURITY_HEADERS,
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers,
      };
      
      // Make request
      const response = await fetch(url, {
        ...options,
        headers,
        // Security settings
        credentials: 'omit', // Don't send cookies
        mode: 'cors',
        cache: 'no-cache',
      });
      
      // Record successful request for rate limiting
      rateLimiter.recordRequest();
      
      // Handle response
      await this.handleResponse(response);
      
      // Parse JSON response
      const data = await response.json();
      return data as T;
      
    } catch (error) {
      // Handle specific error types
      if (error instanceof APIError) {
        // Handle 401 Unauthorized - token might be expired
        if (error.status === 401 && retryCount === 0) {
          console.log('🔄 Token expired, attempting refresh...');
          
          // Prevent multiple simultaneous refresh attempts
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshPromise = tokenManager.refreshAccessToken();
          }
          
          if (this.refreshPromise) {
            const refreshed = await this.refreshPromise;
            this.isRefreshing = false;
            this.refreshPromise = null;
            
            if (refreshed) {
              // Retry the request with new token
              return this.makeRequest<T>(endpoint, options, retryCount + 1);
            }
          }
          
          // Refresh failed, redirect to login
          throw new APIError('Authentication failed - please login again', 401, 'AUTH_EXPIRED');
        }
        
        // Handle 429 Too Many Requests
        if (error.status === 429) {
          const retryAfter = error.retryAfter || 1000;
          console.log(`⏳ Rate limited by server, waiting ${retryAfter}ms`);
          
          await new Promise(resolve => setTimeout(resolve, retryAfter));
          
          if (retryCount < 2) {
            return this.makeRequest<T>(endpoint, options, retryCount + 1);
          }
        }
        
        // Handle 5xx Server Errors
        if (error.status >= 500 && retryCount < 2) {
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`🔄 Server error, retrying in ${waitTime}ms`);
          
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return this.makeRequest<T>(endpoint, options, retryCount + 1);
        }
      }
      
      throw error;
    }
  }

  /**
   * Handle HTTP response and throw appropriate errors
   */
  private async handleResponse(response: Response): Promise<void> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorCode = 'HTTP_ERROR';
      let retryAfter: number | undefined;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorCode = errorData.code || errorCode;
      } catch {
        // Could not parse error response as JSON
      }
      
      // Extract retry-after header for 429 responses
      if (response.status === 429) {
        const retryAfterHeader = response.headers.get('Retry-After');
        retryAfter = retryAfterHeader ? parseInt(retryAfterHeader) * 1000 : undefined;
      }
      
      throw new APIError(errorMessage, response.status, errorCode, retryAfter);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined;
    return this.makeRequest<T>(endpoint, { 
      method: 'POST',
      body,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const body = data ? JSON.stringify(data) : undefined;
    return this.makeRequest<T>(endpoint, { 
      method: 'PUT',
      body,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<UserProfile> {
    return this.get<UserProfile>('/v2/me');
  }

  /**
   * Get user by ID
   */
  async getUser(userId: number): Promise<UserProfile> {
    return this.get<UserProfile>(`/v2/users/${userId}`);
  }

  /**
   * Get user projects
   */
  async getUserProjects(userId: number): Promise<any[]> {
    return this.get<any[]>(`/v2/users/${userId}/projects_users`);
  }

  /**
   * Get available cursus
   */
  async getCursus(): Promise<any[]> {
    return this.get<any[]>('/v2/cursus');
  }

  /**
   * Get campus list
   */
  async getCampus(): Promise<any[]> {
    return this.get<any[]>('/v2/campus');
  }

  /**
   * Search users
   */
  async searchUsers(query: string, page = 1, perPage = 30): Promise<any[]> {
    const params = new URLSearchParams({
      search: query,
      page: page.toString(),
      per_page: perPage.toString(),
    });
    
    return this.get<any[]>(`/v2/users?${params}`);
  }

  /**
   * Get API client status
   */
  getStatus() {
    const tokenInfo = tokenManager.getTokenInfo();
    const rateLimitStatus = rateLimiter.getStatus();
    
    return {
      authenticated: tokenManager.isAuthenticated(),
      token: tokenInfo,
      rateLimit: rateLimitStatus,
      config: {
        clientId: this.config.clientId ? 'Set' : 'Missing',
        redirectUri: this.config.redirectUri,
        baseUrl: this.config.baseUrl,
      },
    };
  }
}

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string,
    public readonly retryAfter?: number
  ) {
    super(message);
    this.name = 'APIError';
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }
}

// Export singleton instance
export const apiClient = new SecureAPIClient();
