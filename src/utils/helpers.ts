import { Student, Pooler, SortOrder } from '@/types';

/**
 * Formats a student or pooler level to display with decimal precision
 */
export const formatLevel = (level: number): string => {
  return level.toFixed(2);
};

/**
 * Formats a number with commas for better readability
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat().format(num);
};

/**
 * Calculates the progress percentage for a given level
 */
export const getLevelProgress = (level: number): number => {
  return (level % 1) * 100;
};

/**
 * Gets the color class for level display based on level value
 */
export const getLevelColor = (level: number): string => {
  if (level >= 21) return 'text-purple-600 dark:text-purple-400';
  if (level >= 15) return 'text-red-600 dark:text-red-400';
  if (level >= 10) return 'text-orange-600 dark:text-orange-400';
  if (level >= 5) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-green-600 dark:text-green-400';
};

/**
 * Generates a mock 42 profile URL
 */
export const getProfileUrl = (login: string): string => {
  return `https://profile.intra.42.fr/users/${login}`;
};

/**
 * Generates initials from a name
 */
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Formats time ago from a date
 */
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString();
};

/**
 * Sorts students array by specified criteria
 */
export const sortStudents = (
  students: Student[],
  sortBy: 'level' | 'name' | 'login',
  sortOrder: SortOrder
): Student[] => {
  return [...students].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'level':
        comparison = a.level - b.level;
        break;
      case 'name':
        comparison = a.displayName.localeCompare(b.displayName);
        break;
      case 'login':
        comparison = a.login.localeCompare(b.login);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

/**
 * Sorts poolers array by specified criteria
 */
export const sortPoolers = (
  poolers: Pooler[],
  sortBy: 'level' | 'name' | 'login',
  sortOrder: SortOrder
): Pooler[] => {
  return [...poolers].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'level':
        comparison = a.level - b.level;
        break;
      case 'name':
        comparison = a.displayName.localeCompare(b.displayName);
        break;
      case 'login':
        comparison = a.login.localeCompare(b.login);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
};

/**
 * Filters students based on search and promo year
 */
export const filterStudents = (
  students: Student[],
  search: string,
  promoYear: number | 'all'
): Student[] => {
  return students.filter(student => {
    const matchesSearch = search === '' || 
      student.login.toLowerCase().includes(search.toLowerCase()) ||
      student.displayName.toLowerCase().includes(search.toLowerCase());
    
    const matchesPromo = promoYear === 'all' || student.promoYear === promoYear;
    
    return matchesSearch && matchesPromo;
  });
};

/**
 * Filters poolers based on search and pool year
 */
/**
 * Get month name from month number
 */
const getMonthName = (monthNumber: string): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthIndex = parseInt(monthNumber) - 1;
  return months[monthIndex] || '';
};

export const filterPoolers = (
  poolers: Pooler[],
  search: string,
  poolYear: number | 'all',
  poolMonth?: string
): Pooler[] => {
  return poolers.filter(pooler => {
    const matchesSearch = search === '' || 
      pooler.login.toLowerCase().includes(search.toLowerCase()) ||
      pooler.displayName.toLowerCase().includes(search.toLowerCase());
    
    const matchesPool = poolYear === 'all' || pooler.poolYear === poolYear;
    
    const matchesMonth = !poolMonth || pooler.poolMonth.includes(getMonthName(poolMonth));
    
    return matchesSearch && matchesPool && matchesMonth;
  });
};

/**
 * Debounce function for search input
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generates a random avatar URL using a service like Gravatar or UI Avatars
 */
export const generateAvatarUrl = (login: string): string => {
  // Using UI Avatars service for consistent, colorful avatars
  const initials = login.substring(0, 2).toUpperCase();
  const colors = ['3b82f6', '10b981', 'f59e0b', 'ef4444', '8b5cf6', '06b6d4'];
  const colorIndex = login.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];
  
  return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=fff&size=200&font-size=0.6`;
};

/**
 * Calculates statistics for students
 */
export const calculateStudentStats = (students: Student[]) => {
  if (students.length === 0) {
    return {
      totalCount: 0,
      averageLevel: 0,
      highestLevel: 0,
      onlineCount: 0,
    };
  }

  const totalLevel = students.reduce((sum, student) => sum + student.level, 0);
  const highestLevel = Math.max(...students.map(s => s.level));
  const onlineCount = students.filter(s => s.status.isOnline).length;

  return {
    totalCount: students.length,
    averageLevel: totalLevel / students.length,
    highestLevel,
    onlineCount,
  };
};

/**
 * Calculates statistics for poolers
 */
export const calculatePoolerStats = (poolers: Pooler[]) => {
  if (poolers.length === 0) {
    return {
      totalCount: 0,
      averageLevel: 0,
      highestLevel: 0,
      onlineCount: 0,
      inProgressCount: 0,
    };
  }

  const totalLevel = poolers.reduce((sum, pooler) => sum + pooler.level, 0);
  const highestLevel = Math.max(...poolers.map(p => p.level));
  const onlineCount = poolers.filter(p => p.status.isOnline).length;
  // Since all poolers are in the pool by definition, count all as in progress
  const inProgressCount = poolers.length;

  return {
    totalCount: poolers.length,
    averageLevel: totalLevel / poolers.length,
    highestLevel,
    onlineCount,
    inProgressCount,
  };
};
