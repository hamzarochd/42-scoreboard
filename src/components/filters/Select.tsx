import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  className?: string;
}

/**
 * Custom select component
 */
export function Select({ value, onChange, options, label, className = '' }: SelectProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="custom-select block w-full pl-3 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50 appearance-none transition-all duration-200"
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-gray-900 text-white py-2 px-3"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-white/50" />
        </div>
      </div>
    </div>
  );
}
