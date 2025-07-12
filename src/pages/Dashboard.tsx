import { useState } from 'react';
import { Users, GraduationCap, LogOut } from 'lucide-react';
import { useAuth, useStudents, usePoolers } from '@/hooks';
import { 
  LoadingSpinner, 
  StudentList,
  SearchBar,
  Select,
  SortControls
} from '@/components';
import { PROMO_YEARS, POOL_MONTHS, SORT_OPTIONS } from '@/utils/constants';

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
  } = useStudents();

  // Poolers data and filters
  const {
    poolers,
    loading: poolersLoading,
    error: poolersError,
    filters: poolerFilters,
    updateFilter: updatePoolerFilter,
    resetFilters: resetPoolerFilters,
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
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/leeters-background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Header */}
      <header className="glass-header shadow-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <img 
                src="/logo.png" 
                alt="LEETERS Logo" 
                className="h-8 md:h-10 w-auto"
              />
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="text-xs md:text-sm text-dark-500 hidden sm:block">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 text-dark-500 hover:text-accent-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Tab Navigation */}
        <div className="mb-6 md:mb-8">
          <div className="flex rounded-lg overflow-hidden shadow-lg glass-tab">
            <button
              onClick={() => setViewType('students')}
              className={`flex-1 flex items-center justify-center space-x-2 md:space-x-3 px-4 md:px-6 py-3 md:py-4 transition-all duration-300 ${
                viewType === 'students'
                  ? 'bg-accent-500/20 text-accent-500 font-semibold backdrop-blur-sm border-accent-500/40'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-base md:text-lg">Students</span>
            </button>
            <button
              onClick={() => setViewType('poolers')}
              className={`flex-1 flex items-center justify-center space-x-2 md:space-x-3 px-4 md:px-6 py-3 md:py-4 transition-all duration-300 ${
                viewType === 'poolers'
                  ? 'bg-accent-500/20 text-accent-500 font-semibold backdrop-blur-sm border-accent-500/40'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Users className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-base md:text-lg">Poolers</span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="glass-panel rounded-lg shadow-xl p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6">Filtri</h2>
          
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ${
            viewType === 'poolers' ? 'lg:grid-cols-5' : ''
          }`}>
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-white mb-2 md:mb-3">Cerca</label>
              <SearchBar
                value={viewType === 'students' ? studentFilters.search : poolerFilters.search}
                onChange={(value) => 
                  viewType === 'students' 
                    ? updateStudentFilter('search', value)
                    : updatePoolerFilter('search', value)
                }
                placeholder={`Cerca ${viewType}...`}
              />
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2 md:mb-3">
                {viewType === 'students' ? 'Anno Promo' : 'Anno Pool'}
              </label>
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
                label=""
              />
            </div>

            {/* Month Filter - Only for poolers */}
            {viewType === 'poolers' && (
              <div>
                <label className="block text-sm font-medium text-white mb-2 md:mb-3">Mese Pool</label>
                <Select
                  value={poolerFilters.poolMonth || 'all'}
                  onChange={(value) => updatePoolerFilter('poolMonth', value === 'all' ? undefined : value)}
                  options={[
                    { value: 'all', label: 'Tutti i Mesi' },
                    ...POOL_MONTHS.map(month => ({ value: month.value, label: month.label }))
                  ]}
                  label=""
                />
              </div>
            )}

            {/* Sort Controls */}
            <div className={`sm:col-span-2 ${viewType === 'poolers' ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
              <label className="block text-sm font-medium text-white mb-2 md:mb-3">Ordinamento</label>
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
          <div className="mt-4 md:mt-6 flex justify-end">
            <button
              onClick={() => viewType === 'students' ? resetStudentFilters() : resetPoolerFilters()}
              className="text-sm text-accent-500 hover:text-accent-400 transition-colors font-medium"
            >
              Reset Filtri
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text={`Caricamento ${viewType}...`} />
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <StudentList
            students={viewType === 'students' ? students : undefined}
            poolers={viewType === 'poolers' ? poolers : undefined}
            type={viewType}
          />
        )}
      </main>
    </div>
  );
}
