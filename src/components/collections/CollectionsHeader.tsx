import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface CollectionsHeaderProps {
  onCreateCollection: () => void;
}

export const CollectionsHeader: React.FC<CollectionsHeaderProps> = ({
  onCreateCollection
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:flex md:items-center md:justify-between"
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Collections
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Organize and manage connected instructions and prompts from your flow visualizations.
        </p>
      </div>
      <div className="mt-4 flex md:ml-4 md:mt-0">
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