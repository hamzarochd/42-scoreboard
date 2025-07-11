import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortOrder } from '@/types';

interface SortOption {
  value: string;
  label: string;
}

interface SortControlsProps {
  sortBy: string;
  sortOrder: SortOrder;
  onSortByChange: (sortBy: string) => void;
  onSortOrderChange: (sortOrder: SortOrder) => void;
  options: SortOption[];
}

/**
 * Sort controls component for changing sort field and order
 */
export function SortControls({
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  options,
}: SortControlsProps) {
  const toggleSortOrder = () => {
    onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') {
      return <ArrowUp className="h-4 w-4" />;
    } else if (sortOrder === 'desc') {
      return <ArrowDown className="h-4 w-4" />;
    }
    return <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            Sort by {option.label}
          </option>
        ))}
      </select>
      
      <button
        onClick={toggleSortOrder}
        className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
      >
        {getSortIcon()}
      </button>
    </div>
  );
}
