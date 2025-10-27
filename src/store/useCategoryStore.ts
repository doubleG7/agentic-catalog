import { create } from 'zustand';
import { InstructionCategory, PromptCategory } from '../types';

interface CategoryStats {
  category: string;
  count: number;
  displayName: string;
}

interface CategoryStore {
  instructionCategories: CategoryStats[];
  promptCategories: CategoryStats[];
  isLoading: boolean;
  error: string | null;
  
  setInstructionCategories: (categories: CategoryStats[]) => void;
  setPromptCategories: (categories: CategoryStats[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Helper functions
  getInstructionCategoryCount: (category: string) => number;
  getPromptCategoryCount: (category: string) => number;
}

/**
 * Format enum values for display
 * e.g., BUSINESS -> Business, CODE_GENERATION -> Code Generation
 */
const formatCategoryName = (category: string): string => {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Global category store
 * Manages instruction and prompt categories fetched from the backend
 */
export const useCategoryStore = create<CategoryStore>((set, get) => ({
  instructionCategories: [],
  promptCategories: [],
  isLoading: false,
  error: null,

  setInstructionCategories: (categories) => set({ instructionCategories: categories }),
  setPromptCategories: (categories) => set({ promptCategories: categories }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  getInstructionCategoryCount: (category: string) => {
    const categories = get().instructionCategories;
    const found = categories.find(c => c.category === category);
    return found?.count || 0;
  },

  getPromptCategoryCount: (category: string) => {
    const categories = get().promptCategories;
    const found = categories.find(c => c.category === category);
    return found?.count || 0;
  },
}));

/**
 * Initialize categories from enum values
 * Used as default when API data is not yet available
 */
export const getDefaultInstructionCategories = (): CategoryStats[] => {
  return Object.values(InstructionCategory).map(category => ({
    category,
    displayName: formatCategoryName(category),
    count: 0,
  }));
};

export const getDefaultPromptCategories = (): CategoryStats[] => {
  return Object.values(PromptCategory).map(category => ({
    category,
    displayName: formatCategoryName(category),
    count: 0,
  }));
};
