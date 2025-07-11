import { 
  Student, 
  Pooler, 
  User, 
  LoginCredentials,
  StudentFilters,
  PoolerFilters,
  ApiResponse 
} from '@/types';
import { MOCK_API_DELAY, DEMO_CREDENTIALS } from '@/utils/constants';
import { 
  allMockStudents, 
  allMockPoolers, 
  demoUser 
} from './mockData';
import { 
  filterStudents, 
  filterPoolers, 
  sortStudents, 
  sortPoolers 
} from '@/utils/helpers';

/**
 * Simulates network delay for realistic API behavior
 */
const delay = (ms: number = MOCK_API_DELAY): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock Authentication API
 */
export const authApi = {
  /**
   * Simulates user login
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    await delay();
    
    if (
      credentials.login === DEMO_CREDENTIALS.login &&
      credentials.password === DEMO_CREDENTIALS.password
    ) {
      return {
        success: true,
        data: demoUser,
        message: 'Login successful',
      };
    }
    
    throw new Error('Invalid credentials');
  },

  /**
   * Simulates user logout
   */
  async logout(): Promise<ApiResponse<null>> {
    await delay(200);
    
    return {
      success: true,
      data: null,
      message: 'Logout successful',
    };
  },

  /**
   * Validates stored authentication token
   */
  async validateToken(token: string): Promise<ApiResponse<User>> {
    await delay(300);
    
    // In a real app, this would validate the JWT token
    if (token) {
      return {
        success: true,
        data: demoUser,
      };
    }
    
    throw new Error('Invalid token');
  },
};

/**
 * Mock Students API
 */
export const studentsApi = {
  /**
   * Fetches all students with optional filtering and sorting
   */
  async getStudents(filters?: Partial<StudentFilters>): Promise<ApiResponse<Student[]>> {
    await delay();
    
    let students = [...allMockStudents];
    
    if (filters) {
      const {
        search = '',
        promoYear = 'all',
        sortBy = 'level',
        sortOrder = 'desc'
      } = filters;
      
      // Apply filters
      students = filterStudents(students, search, promoYear);
      
      // Apply sorting
      students = sortStudents(students, sortBy, sortOrder);
    }
    
    return {
      success: true,
      data: students,
    };
  },

  /**
   * Fetches a single student by login
   */
  async getStudent(login: string): Promise<ApiResponse<Student | null>> {
    await delay();
    
    const student = allMockStudents.find(s => s.login === login);
    
    return {
      success: true,
      data: student || null,
    };
  },

  /**
   * Fetches available promotion years
   */
  async getPromoYears(): Promise<ApiResponse<number[]>> {
    await delay(200);
    
    const years = [...new Set(allMockStudents.map(s => s.promoYear))].sort((a, b) => b - a);
    
    return {
      success: true,
      data: years,
    };
  },
};

/**
 * Mock Poolers API
 */
export const poolersApi = {
  /**
   * Fetches all poolers with optional filtering and sorting
   */
  async getPoolers(filters?: Partial<PoolerFilters>): Promise<ApiResponse<Pooler[]>> {
    await delay();
    
    let poolers = [...allMockPoolers];
    
    if (filters) {
      const {
        search = '',
        poolYear = 'all',
        sortBy = 'level',
        sortOrder = 'desc'
      } = filters;
      
      // Apply filters
      poolers = filterPoolers(poolers, search, poolYear);
      
      // Apply sorting
      poolers = sortPoolers(poolers, sortBy, sortOrder);
    }
    
    return {
      success: true,
      data: poolers,
    };
  },

  /**
   * Fetches a single pooler by login
   */
  async getPooler(login: string): Promise<ApiResponse<Pooler | null>> {
    await delay();
    
    const pooler = allMockPoolers.find(p => p.login === login);
    
    return {
      success: true,
      data: pooler || null,
    };
  },

  /**
   * Fetches available pool years
   */
  async getPoolYears(): Promise<ApiResponse<number[]>> {
    await delay(200);
    
    const years = [...new Set(allMockPoolers.map(p => p.poolYear))].sort((a, b) => b - a);
    
    return {
      success: true,
      data: years,
    };
  },
};

/**
 * Combined API object for easy importing
 * 
 * NOTE: To switch to real API, replace these mock implementations
 * with actual HTTP calls to the 42 API endpoints:
 * 
 * Example for real implementation:
 * ```typescript
 * export const studentsApi = {
 *   async getStudents(filters) {
 *     const response = await fetch('/api/students', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify(filters),
 *     });
 *     return response.json();
 *   },
 * };
 * ```
 */
export const api = {
  auth: authApi,
  students: studentsApi,
  poolers: poolersApi,
};
