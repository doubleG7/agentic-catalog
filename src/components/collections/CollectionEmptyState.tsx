import React from 'react';
import { motion } from 'framer-motion';
import { Plus, GitBranch } from 'lucide-react';
import { Button } from '../ui/Button';

interface CollectionEmptyStateProps {
  searchTerm: string;
  selectedCategory: string;
  onCreateCollection: () => void;
}

export const CollectionEmptyState: React.FC<CollectionEmptyStateProps> = ({
  searchTerm,
  selectedCategory,
  onCreateCollection
}) => {
  const hasFilters = searchTerm || selectedCategory !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <GitBranch className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No collections found</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {hasFilters
          ? 'Try adjusting your search or filters.'
          : 'Create your first collection by connecting instructions and prompts in the flow visualization.'
        }
      </p>
      <div className="mt-6">
        <Button 
          onClick={onCreateCollection}
          className="bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Collection
        </Button>
      </div>
    </motion.div>
  );
};