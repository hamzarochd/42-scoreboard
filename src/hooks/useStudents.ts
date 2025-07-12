import { useState, useEffect, useMemo } from 'react';
import { Student, StudentFilters, StudentStats } from '@/types';
import { api } from '@/services';
import { calculateStudentStats } from '@/utils/helpers';
import { usePersistedFilters } from './useLocalStorage';

const initialFilters: StudentFilters = {
  search: '',
  promoYear: 'all',
  sortBy: 'level',
  sortOrder: 'desc',
};

/**
 * Hook for managing students data and filtering
 */
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    filters,
    updateFilter,
    resetFilters,
  } = usePersistedFilters('studentFilters', initialFilters);

  // Fetch students data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.students.getStudents(filters);
      
      if (response.success && response.data) {
        setStudents(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchStudents();
  }, [filters]);

  // Calculate statistics
  const stats: StudentStats = useMemo(() => {
    return calculateStudentStats(students);
  }, [students]);

  // Get available promotion years
  const [promoYears, setPromoYears] = useState<number[]>([]);
  
  useEffect(() => {
    const fetchPromoYears = async () => {
      try {
        const response = await api.students.getPromoYears();
        if (response.success && response.data) {
          setPromoYears(response.data);
        }
      } catch (err) {
        console.warn('Failed to fetch promo years:', err);
      }
    };
    
    fetchPromoYears();
  }, []);

  return {
    students,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    refetch: fetchStudents,
    stats,
    promoYears,
  };
}
