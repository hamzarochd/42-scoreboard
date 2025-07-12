import { RATE_LIMITS } from './oauth2Config';

/**
 * Rate Limiter for 42 School API
 * Implements sliding window rate limiting to respect API limits:
 * - Max 2 requests per second
 * - Max 1200 requests per hour
 * - Burst protection
 */
class RateLimiter {
  private requestLog: number[] = []; // Timestamps of requests
  private hourlyRequestLog: number[] = []; // Hourly request tracking
  private lastRequestTime = 0;
  private readonly minInterval = 1000 / RATE_LIMITS.requestsPerSecond; // 500ms between requests

  /**
   * Check if a request can be made now
   */
  canMakeRequest(): { allowed: boolean; waitTime: number; reason?: string } {
    const now = Date.now();
    
    // Clean old entries (older than 1 second)
    this.requestLog = this.requestLog.filter(time => now - time < 1000);
    
    // Clean old hourly entries (older than 1 hour)
    this.hourlyRequestLog = this.hourlyRequestLog.filter(time => now - time < 3600000);
    
    // Check per-second limit
    if (this.requestLog.length >= RATE_LIMITS.requestsPerSecond) {
      const oldestRequest = Math.min(...this.requestLog);
      const waitTime = 1000 - (now - oldestRequest);
      return {
        allowed: false,
        waitTime: Math.max(0, waitTime),
        reason: 'Per-second rate limit exceeded'
      };
    }
    
    // Check hourly limit
    if (this.hourlyRequestLog.length >= RATE_LIMITS.requestsPerHour) {
      const oldestHourlyRequest = Math.min(...this.hourlyRequestLog);
      const waitTime = 3600000 - (now - oldestHourlyRequest);
      return {
        allowed: false,
        waitTime: Math.max(0, waitTime),
        reason: 'Hourly rate limit exceeded'
      };
    }
    
    // Check minimum interval between requests
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastRequest;
      return {
        allowed: false,
        waitTime,
        reason: 'Minimum interval not met'
      };
    }
    
    // Check burst limit
    const recentRequests = this.requestLog.filter(time => now - time < 500); // Last 500ms
    if (recentRequests.length >= RATE_LIMITS.burstLimit) {
      return {
        allowed: false,
        waitTime: 500,
        reason: 'Burst limit exceeded'
      };
    }
    
    return { allowed: true, waitTime: 0 };
  }

  /**
   * Record a request (call this after making a successful request)
   */
  recordRequest(): void {
    const now = Date.now();
    this.requestLog.push(now);
    this.hourlyRequestLog.push(now);
    this.lastRequestTime = now;
  }

  /**
   * Wait for the appropriate time before making a request
   */
  async waitForSlot(): Promise<void> {
    const check = this.canMakeRequest();
    
    if (!check.allowed && check.waitTime > 0) {
      console.log(`⏳ Rate limit: waiting ${check.waitTime}ms (${check.reason})`);
      await new Promise(resolve => setTimeout(resolve, check.waitTime));
      
      // Recursively check again in case multiple limits apply
      return this.waitForSlot();
    }
  }

  /**
   * Get current rate limit status
   */
  getStatus(): {
    requestsInLastSecond: number;
    requestsInLastHour: number;
    canMakeRequest: boolean;
    nextAvailableTime: number;
  } {
    const now = Date.now();
    const recentRequests = this.requestLog.filter(time => now - time < 1000);
    const hourlyRequests = this.hourlyRequestLog.filter(time => now - time < 3600000);
    
    const check = this.canMakeRequest();
    
    return {
      requestsInLastSecond: recentRequests.length,
      requestsInLastHour: hourlyRequests.length,
      canMakeRequest: check.allowed,
      nextAvailableTime: check.allowed ? now : now + check.waitTime,
    };
  }

  /**
   * Reset rate limiter (for testing or forced reset)
   */
  reset(): void {
    this.requestLog = [];
    this.hourlyRequestLog = [];
    this.lastRequestTime = 0;
    console.log('🔄 Rate limiter reset');
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();
