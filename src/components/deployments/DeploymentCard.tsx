import React from 'react';
import { motion } from 'framer-motion';
import { EnvironmentPipeline, VersionHistory } from '../environment/EnvironmentManagement';
import { VersionManager } from '../../utils/environment';
import { Environment, PromotionStatus } from '../../types/versioning';

// Use the shared interface from types
import { VersionableItem } from '../../types/versioning';

interface UIVersionableItem extends VersionableItem {
  title: string;
  type: 'instruction' | 'prompt' | 'collection';
  createdAt: string;
  updatedAt: string;
}

interface DeploymentCardProps {
  item: UIVersionableItem;
  index: number;
  onPromote: (item: UIVersionableItem, environment: Environment) => void;
  onRollback: (item: UIVersionableItem, environment: Environment) => void;
  pendingPromotions?: Array<{ itemId: string; toEnvironment: Environment; status: PromotionStatus }>;
}

export const DeploymentCard: React.FC<DeploymentCardProps> = ({
  item,
  index,
  onPromote,
  onRollback,
  pendingPromotions = [],
}) => {
  return (
    <motion.div
      key={`${item.type}-${item.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="card"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {item.type} • v{VersionManager.versionToString(item.version)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              {item.type}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <EnvironmentPipeline
          item={item}
          onPromote={(env) => onPromote(item, env)}
          onRollback={(env) => onRollback(item, env)}
          pendingPromotions={pendingPromotions}
        />
      </div>

      <div className="p-6 pt-0">
        <VersionHistory item={item} />
      </div>
    </motion.div>
  );
};