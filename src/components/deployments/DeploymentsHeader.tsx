import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface DeploymentsHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const DeploymentsHeader: React.FC<DeploymentsHeaderProps> = ({
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight"
        >
          Deployments
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
        >
          Manage deployments across Development, QA, Staging, and Production environments
        </motion.p>
      </div>
      <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
        <Button
          variant="outline"
          onClick={onRefresh}
          loading={isRefreshing}
          className="bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );
};