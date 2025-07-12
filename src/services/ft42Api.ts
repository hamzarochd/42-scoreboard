import { 
  Student, 
  Pooler, 
  User, 
  StudentFilters,
  PoolerFilters,
  ApiResponse 
} from '@/types';

/**
 * 42 School API Configuration
 * You need to set these environment variables or replace with your actual API credentials
 */
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_42_API_BASE_URL || 'https://api.intra.42.fr',
  clientId: import.meta.env.VITE_42_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_42_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_42_REDIRECT_URI || 'http://localhost:5173/auth/callback',
};

/**
 * OAuth2 Token Management
 */
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    this.accessToken = localStorage.getItem('42_access_token');
    this.refreshToken = localStorage.getItem('42_refresh_token');
    const expiry = localStorage.getItem('42_token_expiry');
    this.tokenExpiry = expiry ? parseInt(expiry) : null;
  }

  private saveTokensToStorage() {
    if (this.accessToken) {
      localStorage.setItem('42_access_token', this.accessToken);
    }
    if (this.refreshToken) {
      localStorage.setItem('42_refresh_token', this.refreshToken);
    }
    if (this.tokenExpiry) {
      localStorage.setItem('42_token_expiry', this.tokenExpiry.toString());
    }
  }

  setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = Date.now() + (expiresIn * 1000);
    this.saveTokensToStorage();
  }

  getAccessToken(): string | null {
    if (this.isTokenExpired()) {
      return null;
    }
    return this.accessToken;
  }

  private isTokenExpired(): boolean {
    if (!this.tokenExpiry) return true;
    return Date.now() >= this.tokenExpiry - 60000; // 1 minute buffer
  }

  async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) return null;

    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: API_CONFIG.clientId,
          client_secret: API_CONFIG.clientSecret,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      this.setTokens(data.access_token, data.refresh_token, data.expires_in);
      return data.access_token;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return null;
    }
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('42_access_token');
    localStorage.removeItem('42_refresh_token');
    localStorage.removeItem('42_token_expiry');
  }
}

const tokenManager = new TokenManager();

/**
 * HTTP Client with automatic token handling
 */
class ApiClient {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let accessToken = tokenManager.getAccessToken();
    
    // Try to refresh token if expired
    if (!accessToken) {
      accessToken = await tokenManager.refreshAccessToken();
      if (!accessToken) {
        throw new Error('Authentication required');
      }
    }

    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token might be invalid, try to refresh
      accessToken = await tokenManager.refreshAccessToken();
      if (accessToken) {
        // Retry with new token
        return this.makeRequest(endpoint, options);
      } else {
        throw new Error('Authentication failed');
      }
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

const apiClient = new ApiClient();

/**
 * Data transformation utilities
 */
const transformUser = (userData: any): User => ({
  id: userData.id.toString(),
  login: userData.login,
  email: userData.email,
  firstName: userData.first_name,
  lastName: userData.last_name,
  displayName: userData.displayname,
  avatar: userData.image?.versions?.medium || userData.image?.link || '/default-avatar.png',
});

const transformStudent = (studentData: any): Student => {
  const cursusUser = studentData.cursus_users?.find((cu: any) => cu.cursus_id === 21) || studentData.cursus_users?.[0];
  
  return {
    id: studentData.id.toString(),
    login: studentData.login,
    firstName: studentData.first_name,
    lastName: studentData.last_name,
    displayName: studentData.displayname,
    email: studentData.email,
    avatar: studentData.image?.versions?.medium || studentData.image?.link || '/default-avatar.png',
    level: cursusUser?.level || 0,
    promoYear: new Date(studentData.created_at).getFullYear(),
    wallet: studentData.wallet || 0,
    evaluationPoints: studentData.correction_point || 0,
    status: {
      isOnline: !!studentData.location,
      lastSeen: studentData.updated_at ? new Date(studentData.updated_at) : undefined,
      location: studentData.location,
    },
    profileUrl: `https://profile.intra.42.fr/users/${studentData.login}`,
    campus: studentData.campus?.[0]?.name || 'Unknown',
    cursusUsers: studentData.cursus_users?.map((cu: any) => ({
      cursusId: cu.cursus_id,
      level: cu.level,
      grade: cu.grade,
    })) || [],
    projects: studentData.projects_users?.map((pu: any) => ({
      id: pu.project.id.toString(),
      name: pu.project.name,
      finalMark: pu.final_mark,
      status: pu.status,
    })) || [],
  };
};

const transformPooler = (poolerData: any): Pooler => {
  const poolCursus = poolerData.cursus_users?.find((cu: any) => cu.cursus_id === 9); // Piscine cursus ID
  
  return {
    id: poolerData.id.toString(),
    login: poolerData.login,
    firstName: poolerData.first_name,
    lastName: poolerData.last_name,
    displayName: poolerData.displayname,
    email: poolerData.email,
    avatar: poolerData.image?.versions?.medium || poolerData.image?.link || '/default-avatar.png',
    level: poolCursus?.level || 0,
    poolYear: new Date(poolerData.created_at).getFullYear(),
    poolMonth: new Date(poolerData.created_at).toLocaleString('default', { month: 'long', year: 'numeric' }),
    status: {
      isOnline: !!poolerData.location,
      lastSeen: poolerData.updated_at ? new Date(poolerData.updated_at) : undefined,
      location: poolerData.location,
    },
    profileUrl: `https://profile.intra.42.fr/users/${poolerData.login}`,
    campus: poolerData.campus?.[0]?.name || 'Unknown',
    poolStartDate: poolerData.created_at,
    poolEndDate: poolCursus?.end_at || '',
    projects: poolerData.projects_users?.map((pu: any) => ({
      id: pu.project.id.toString(),
      name: pu.project.name,
      finalMark: pu.final_mark,
      status: pu.status,
    })) || [],
  };
};

/**
 * 42 School Authentication API
 */
export const ft42AuthApi = {
  /**
   * Get OAuth2 authorization URL
   * @param state - Optional state parameter for CSRF protection
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: API_CONFIG.clientId,
      redirect_uri: API_CONFIG.redirectUri,
      response_type: 'code',
      scope: 'public',
      state: state || Math.random().toString(36).substring(7), // CSRF protection
    });
    
    return `${API_CONFIG.baseUrl}/oauth/authorize?${params.toString()}`;
  },

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: API_CONFIG.clientId,
          client_secret: API_CONFIG.clientSecret,
          code,
          redirect_uri: API_CONFIG.redirectUri,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await response.json();
      tokenManager.setTokens(
        tokenData.access_token, 
        tokenData.refresh_token, 
        tokenData.expires_in
      );

      // Get user info
      const userInfo = await apiClient.get<any>('/v2/me');
      const user = transformUser(userInfo);

      return {
        success: true,
        data: user,
        message: 'Login successful',
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error}`);
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<null>> {
    tokenManager.clearTokens();
    
    return {
      success: true,
      data: null,
      message: 'Logout successful',
    };
  },

  /**
   * Validate current token and get user info
   */
  async validateToken(): Promise<ApiResponse<User>> {
    try {
      const userInfo = await apiClient.get<any>('/v2/me');
      const user = transformUser(userInfo);

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      tokenManager.clearTokens();
      throw new Error('Invalid token');
    }
  },
};

/**
 * 42 School Students API
 */
export const ft42StudentsApi = {
  /**
   * Fetch students from 42 API
   */
  async getStudents(filters?: Partial<StudentFilters>): Promise<ApiResponse<Student[]>> {
    try {
      const params = new URLSearchParams();
      
      // Add filtering parameters
      if (filters?.search) {
        params.append('search[login]', filters.search);
      }
      
      // Add pagination
      params.append('page[size]', '100'); // Adjust as needed
      
      const endpoint = `/v2/cursus/21/users?${params.toString()}`; // 21 is the main cursus ID
      const studentsData = await apiClient.get<any[]>(endpoint);
      
      const students = studentsData.map(transformStudent);
      
      // Apply additional client-side filtering if needed
      let filteredStudents = students;
      
      if (filters?.promoYear && filters.promoYear !== 'all') {
        const year = typeof filters.promoYear === 'string' ? parseInt(filters.promoYear) : filters.promoYear;
        filteredStudents = filteredStudents.filter(s => s.promoYear === year);
      }
      
      // Apply sorting
      if (filters?.sortBy) {
        filteredStudents.sort((a, b) => {
          const aVal = a[filters.sortBy as keyof Student] as any;
          const bVal = b[filters.sortBy as keyof Student] as any;
          
          if (filters.sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      return {
        success: true,
        data: filteredStudents,
      };
    } catch (error) {
      throw new Error(`Failed to fetch students: ${error}`);
    }
  },

  /**
   * Fetch a single student by login
   */
  async getStudent(login: string): Promise<ApiResponse<Student | null>> {
    try {
      const studentData = await apiClient.get<any>(`/v2/users/${login}`);
      const student = transformStudent(studentData);

      return {
        success: true,
        data: student,
      };
    } catch (error) {
      return {
        success: true,
        data: null,
      };
    }
  },

  /**
   * Get available promotion years
   */
  async getPromoYears(): Promise<ApiResponse<number[]>> {
    // This might need to be cached or calculated differently based on your needs
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
    
    return {
      success: true,
      data: years,
    };
  },
};

/**
 * 42 School Poolers API
 */
export const ft42PoolersApi = {
  /**
   * Fetch poolers from 42 API
   */
  async getPoolers(filters?: Partial<PoolerFilters>): Promise<ApiResponse<Pooler[]>> {
    try {
      const params = new URLSearchParams();
      
      // Add filtering parameters
      if (filters?.search) {
        params.append('search[login]', filters.search);
      }
      
      // Add pagination
      params.append('page[size]', '100');
      
      const endpoint = `/v2/cursus/9/users?${params.toString()}`; // 9 is the piscine cursus ID
      const poolersData = await apiClient.get<any[]>(endpoint);
      
      const poolers = poolersData.map(transformPooler);
      
      // Apply additional client-side filtering
      let filteredPoolers = poolers;
      
      if (filters?.poolYear && filters.poolYear !== 'all') {
        const year = typeof filters.poolYear === 'string' ? parseInt(filters.poolYear) : filters.poolYear;
        filteredPoolers = filteredPoolers.filter(p => p.poolYear === year);
      }
      
      // Apply sorting
      if (filters?.sortBy) {
        filteredPoolers.sort((a, b) => {
          const aVal = a[filters.sortBy as keyof Pooler] as any;
          const bVal = b[filters.sortBy as keyof Pooler] as any;
          
          if (filters.sortOrder === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      return {
        success: true,
        data: filteredPoolers,
      };
    } catch (error) {
      throw new Error(`Failed to fetch poolers: ${error}`);
    }
  },

  /**
   * Fetch a single pooler by login
   */
  async getPooler(login: string): Promise<ApiResponse<Pooler | null>> {
    try {
      const poolerData = await apiClient.get<any>(`/v2/users/${login}`);
      const pooler = transformPooler(poolerData);

      return {
        success: true,
        data: pooler,
      };
    } catch (error) {
      return {
        success: true,
        data: null,
      };
    }
  },

  /**
   * Get available pool years
   */
  async getPoolYears(): Promise<ApiResponse<number[]>> {
    // This might need to be cached or calculated differently
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    
    return {
      success: true,
      data: years,
    };
  },
};

/**
 * Combined 42 API object
 */
export const ft42Api = {
  auth: ft42AuthApi,
  students: ft42StudentsApi,
  poolers: ft42PoolersApi,
};
