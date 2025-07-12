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
        className="pl-3 pr-8 py-2 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 text-sm transition-all duration-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            Sort by {option.label}
          </option>
        ))}
      </select>
      
      <button
        onClick={toggleSortOrder}
        className="p-2 border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm text-white/70 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent-500/50 transition-all duration-200"
        aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
      >
        {getSortIcon()}
      </button>
    </div>
  );
}
