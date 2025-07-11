import { useState, useEffect, useMemo } from 'react';
import { Pooler, PoolerFilters, PoolerStats } from '@/types';
import { api } from '@/services';
import { calculatePoolerStats } from '@/utils/helpers';
import { usePersistedFilters } from './useLocalStorage';

const initialFilters: PoolerFilters = {
  search: '',
  poolYear: 'all',
  sortBy: 'level',
  sortOrder: 'desc',
};

/**
 * Hook for managing poolers data and filtering
 */
export function usePoolers() {
  const [poolers, setPoolers] = useState<Pooler[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    filters,
    updateFilter,
    resetFilters,
  } = usePersistedFilters('poolerFilters', initialFilters);

  // Fetch poolers data
  const fetchPoolers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.poolers.getPoolers(filters);
      
      if (response.success) {
        setPoolers(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch poolers');
      setPoolers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchPoolers();
  }, [filters]);

  // Calculate statistics
  const stats: PoolerStats = useMemo(() => {
    return calculatePoolerStats(poolers);
  }, [poolers]);

  // Get available pool years
  const [poolYears, setPoolYears] = useState<number[]>([]);
  
  useEffect(() => {
    const fetchPoolYears = async () => {
      try {
        const response = await api.poolers.getPoolYears();
        if (response.success) {
          setPoolYears(response.data);
        }
      } catch (err) {
        console.warn('Failed to fetch pool years:', err);
      }
    };
    
    fetchPoolYears();
  }, []);

  return {
    poolers,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    refetch: fetchPoolers,
    stats,
    poolYears,
  };
}
