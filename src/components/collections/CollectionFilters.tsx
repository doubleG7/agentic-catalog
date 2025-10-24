import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../ui/dropdown-menu';

interface CollectionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

const collectionCategories = [
  'all',
  'ai-development',
  'software-development',
  'business-strategy',
  'product-design',
  'ui-ux',
  'api-integration',
  'best-practices',
  'agile',
];

export const CollectionFilters: React.FC<CollectionFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="grid grid-cols-[0.3fr_30px_auto] items-center gap-0 md:gap-4">
      <div>
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
      <div>Or</div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="md" className="gap-2">
              {selectedCategory === 'all' 
                ? 'All Categories' 
                : selectedCategory
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-white dark:bg-gray-800">
            <DropdownMenuRadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
              {collectionCategories.map((category) => (
                <DropdownMenuRadioItem key={category} value={category} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  {category === 'all'
                    ? 'All Categories'
                    : category
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};