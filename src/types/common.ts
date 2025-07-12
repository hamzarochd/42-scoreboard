// Common types used across the application
export type SortOrder = 'asc' | 'desc';

export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  search?: string;
  promoYear?: number | 'all';
  sortBy?: string;
  sortOrder?: SortOrder;
}

export type UserType = 'student' | 'pooler';

export interface OnlineStatus {
  isOnline: boolean;
  lastSeen?: Date;
  location?: string;
}
