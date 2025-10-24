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
import { InstructionCategory } from '../../types';

interface InstructionsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export const InstructionsFilters: React.FC<InstructionsFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="grid grid-cols-[0.3fr_30px_auto] items-center gap-10 md:gap-4">
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Search instructions..."
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
                    .split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-white dark:bg-gray-800">
            <DropdownMenuRadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
              <DropdownMenuRadioItem value="all" className="hover:bg-gray-100 dark:hover:bg-gray-700">All Categories</DropdownMenuRadioItem>
              {Object.values(InstructionCategory).map((category) => (
                <DropdownMenuRadioItem key={category} value={category} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  {category
                    .split('_')
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