import React from 'react';
import { motion } from 'framer-motion';

interface CollectionsHeaderProps {
  onCreateCollection?: () => void;
}

export const CollectionsHeader: React.FC<CollectionsHeaderProps> = () => {
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
    </motion.div>
  );
};