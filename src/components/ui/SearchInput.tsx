import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  onFilterChange?: (filters: { [key: string]: string }) => void;
  showFilters?: boolean;
  assignees?: { id: number; fullName: string }[];
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  placeholder = 'Search...',
  value,
  onChange,
  className = '',
  onFilterChange,
  showFilters = false,
  assignees = []
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filters, setFilters] = useState({
    assignee: '',
    status: ''
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  const clearSearch = () => {
    setInputValue('');
    onChange('');
  };

  const handleFilterChange = (filterType: string, filterValue: string) => {
    const newFilters = { ...filters, [filterType]: filterValue };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
    setShowFilterMenu(false);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-surface-400" />
          </div>
          <input
            type="text"
            className="input pl-10 pr-10 w-full"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleChange}
          />
          {inputValue && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={clearSearch}
            >
              <X className="w-4 h-4 text-surface-400 hover:text-surface-200" />
            </button>
          )}
        </div>

        {showFilters && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="btn btn-ghost"
            >
              Filters
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-800 border border-surface-700 rounded-lg shadow-lg z-50">
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1">
                      Assignee
                    </label>
                    <select
                      className="input w-full"
                      value={filters.assignee}
                      onChange={(e) => handleFilterChange('assignee', e.target.value)}
                    >
                      <option value="">All Assignees</option>
                      {assignees.map((assignee) => (
                        <option key={assignee.id} value={assignee.id}>
                          {assignee.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-300 mb-1">
                      Status
                    </label>
                    <select
                      className="input w-full"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;