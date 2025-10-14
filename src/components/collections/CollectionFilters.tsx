import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';

interface CollectionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export const CollectionFilters: React.FC<CollectionFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Search collections..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            <option value="ai-development">AI Development</option>
            <option value="software-development">Software Development</option>
            <option value="business-strategy">Business Strategy</option>
            <option value="product-design">Product Design</option>
            <option value="ui-ux">UI/UX</option>
            <option value="api-integration">API Integration</option>
            <option value="best-practices">Best Practices</option>
            <option value="agile">Agile</option>
          </select>
        </div>
      </div>
    </div>
  );
};