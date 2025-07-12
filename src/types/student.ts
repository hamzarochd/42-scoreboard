import { OnlineStatus } from './common';

export interface Student {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  avatar: string;
  level: number;
  promoYear: number;
  wallet: number;
  evaluationPoints: number;
  status: OnlineStatus;
  profileUrl: string;
  campus: string;
  cursusUsers: Array<{
    cursusId: number;
    level: number;
    grade?: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    finalMark?: number;
    status: 'finished' | 'in_progress' | 'searching_a_group';
  }>;
}

export interface StudentFilters {
  search: string;
  promoYear: number | 'all';
  sortBy: 'level' | 'name' | 'login';
  sortOrder: 'asc' | 'desc';
}

export interface StudentStats {
  totalCount: number;
  averageLevel: number;
  highestLevel: number;
  onlineCount: number;
}
