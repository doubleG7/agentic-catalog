import React from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Environment, PromotionStatus } from '../../types/versioning';

interface DeploymentFiltersProps {
  filterEnvironment: Environment | 'all';
  filterStatus: PromotionStatus | 'all';
  onEnvironmentChange: (environment: Environment | 'all') => void;
  onStatusChange: (status: PromotionStatus | 'all') => void;
}

export const DeploymentFilters: React.FC<DeploymentFiltersProps> = ({
  filterEnvironment,
  filterStatus,
  onEnvironmentChange,
  onStatusChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex flex-wrap items-center gap-4 card p-4"
    >
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
      </div>
      
      <select
        value={filterEnvironment}
        onChange={(e) => onEnvironmentChange(e.target.value as Environment | 'all')}
        className="text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:border-primary-500 focus:ring-primary-500"
      >
        <option value="all">All Environments</option>
        {Object.values(Environment).map(env => (
          <option key={env} value={env}>
            {env.charAt(0).toUpperCase() + env.slice(1).toLowerCase()}
          </option>
        ))}
      </select>

      <select
        value={filterStatus}
        onChange={(e) => onStatusChange(e.target.value as PromotionStatus | 'all')}
        className="text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md focus:border-primary-500 focus:ring-primary-500"
      >
        <option value="all">All Statuses</option>
        <option value={PromotionStatus.DEPLOYED}>Deployed</option>
        <option value={PromotionStatus.PENDING_REVIEW}>Pending Review</option>
        <option value={PromotionStatus.REJECTED}>Rejected</option>
        <option value={PromotionStatus.DEPRECATED}>Deprecated</option>
      </select>
    </motion.div>
  );
};