import { useState } from 'react';
import { Users, GraduationCap, LogOut } from 'lucide-react';
import { useAuth, useStudents, usePoolers } from '@/hooks';
import { 
  LoadingSpinner, 
  ThemeToggle, 
  ScoreboardGrid, 
  StatsPanel,
  SearchBar,
  Select,
  SortControls
} from '@/components';
import { PROMO_YEARS, SORT_OPTIONS } from '@/utils/constants';

/**
 * Main dashboard page showing scoreboard
 */
export function Dashboard() {
  const { user, logout } = useAuth();
  const [viewType, setViewType] = useState<'students' | 'poolers'>('students');

  // Students data and filters
  const {
    students,
    loading: studentsLoading,
    error: studentsError,
    filters: studentFilters,
    updateFilter: updateStudentFilter,
    resetFilters: resetStudentFilters,
    stats: studentStats,
  } = useStudents();

  // Poolers data and filters
  const {
    poolers,
    loading: poolersLoading,
    error: poolersError,
    filters: poolerFilters,
    updateFilter: updatePoolerFilter,
    resetFilters: resetPoolerFilters,
    stats: poolerStats,
    poolYears,
  } = usePoolers();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isLoading = viewType === 'students' ? studentsLoading : poolersLoading;
  const error = viewType === 'students' ? studentsError : poolersError;

  const getPromoYearOptions = () => [
    { value: 'all', label: 'All Promotions' },
    ...PROMO_YEARS.map(year => ({ value: year.toString(), label: year.toString() }))
  ];

  const getPoolYearOptions = () => [
    { value: 'all', label: 'All Pool Years' },
    ...poolYears.map(year => ({ value: year.toString(), label: year.toString() }))
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">42</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                42 Scoreboard
              </h1>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewType('students')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                viewType === 'students'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Students</span>
            </button>
            <button
              onClick={() => setViewType('poolers')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                viewType === 'poolers'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Poolers</span>
            </button>
          </div>
        </div>

        {/* Statistics Panel */}
        <StatsPanel
          studentStats={viewType === 'students' ? studentStats : undefined}
          poolerStats={viewType === 'poolers' ? poolerStats : undefined}
          type={viewType}
        />

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <SearchBar
              value={viewType === 'students' ? studentFilters.search : poolerFilters.search}
              onChange={(value) => 
                viewType === 'students' 
                  ? updateStudentFilter('search', value)
                  : updatePoolerFilter('search', value)
              }
              placeholder={`Search ${viewType}...`}
            />

            {/* Year Filter */}
            <Select
              value={
                viewType === 'students' 
                  ? studentFilters.promoYear.toString()
                  : poolerFilters.poolYear.toString()
              }
              onChange={(value) => 
                viewType === 'students'
                  ? updateStudentFilter('promoYear', value === 'all' ? 'all' : parseInt(value))
                  : updatePoolerFilter('poolYear', value === 'all' ? 'all' : parseInt(value))
              }
              options={viewType === 'students' ? getPromoYearOptions() : getPoolYearOptions()}
              label={viewType === 'students' ? 'Promotion Year' : 'Pool Year'}
            />

            {/* Sort Controls */}
            <div className="md:col-span-2">
              <SortControls
                sortBy={viewType === 'students' ? studentFilters.sortBy : poolerFilters.sortBy}
                sortOrder={viewType === 'students' ? studentFilters.sortOrder : poolerFilters.sortOrder}
                onSortByChange={(sortBy) =>
                  viewType === 'students'
                    ? updateStudentFilter('sortBy', sortBy as any)
                    : updatePoolerFilter('sortBy', sortBy as any)
                }
                onSortOrderChange={(sortOrder) =>
                  viewType === 'students'
                    ? updateStudentFilter('sortOrder', sortOrder)
                    : updatePoolerFilter('sortOrder', sortOrder)
                }
                options={SORT_OPTIONS}
              />
            </div>
          </div>

          {/* Reset Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => viewType === 'students' ? resetStudentFilters() : resetPoolerFilters()}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text={`Loading ${viewType}...`} />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <ScoreboardGrid
            students={viewType === 'students' ? students : undefined}
            poolers={viewType === 'poolers' ? poolers : undefined}
            type={viewType}
          />
        )}
      </main>
    </div>
  );
}
