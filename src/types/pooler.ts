import { OnlineStatus } from './common';

export interface Pooler {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  avatar: string;
  level: number;
  poolMonth: string; // e.g., "September 2024"
  poolYear: number;
  status: OnlineStatus;
  profileUrl: string;
  campus: string;
  poolStartDate: string;
  poolEndDate: string;
  projects: Array<{
    id: string;
    name: string;
    finalMark?: number;
    status: 'finished' | 'in_progress' | 'searching_a_group';
  }>;
}

export interface PoolerFilters {
  search: string;
  poolYear: number | 'all';
  sortBy: 'level' | 'name' | 'login';
  sortOrder: 'asc' | 'desc';
}

export interface PoolerStats {
  totalCount: number;
  averageLevel: number;
  highestLevel: number;
  onlineCount: number;
  inProgressCount: number;
}
