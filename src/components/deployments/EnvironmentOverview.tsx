import React from 'react';
import { motion } from 'framer-motion';
import { Cloud } from 'lucide-react';
import { Environment } from '../../types/versioning';

interface EnvironmentOverviewProps {
  environmentStats: Record<Environment, number>;
}

export const EnvironmentOverview: React.FC<EnvironmentOverviewProps> = ({
  environmentStats,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {Object.entries(environmentStats).map(([env, count]) => (
        <div key={env} className="card p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Cloud className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {env.charAt(0).toUpperCase() + env.slice(1).toLowerCase()}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {count}
                  </div>
                  <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    deployed
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};