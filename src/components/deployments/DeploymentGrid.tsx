import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch } from 'lucide-react';
import { DeploymentCard } from './DeploymentCard';
import { Environment } from '../../types/versioning';

// Use the shared interface from types
import { VersionableItem } from '../../types/versioning';

interface UIVersionableItem extends VersionableItem {
  title: string;
  type: 'instruction' | 'prompt' | 'collection';
  createdAt: string;
  updatedAt: string;
}

interface DeploymentGridProps {
  items: UIVersionableItem[];
  onPromote: (item: UIVersionableItem, environment: Environment) => void;
  onRollback: (item: UIVersionableItem, environment: Environment) => void;
}

export const DeploymentGrid: React.FC<DeploymentGridProps> = ({
  items,
  onPromote,
  onRollback,
}) => {
  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <GitBranch className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No items found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          No items match the current filters.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-6"
    >
      {items.map((item, index) => (
        <DeploymentCard
          key={`${item.type}-${item.id}`}
          item={item}
          index={index}
          onPromote={onPromote}
          onRollback={onRollback}
        />
      ))}
    </motion.div>
  );
};