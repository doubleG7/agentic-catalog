import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { EnvironmentBadge } from '../environment/EnvironmentManagement';
import { Environment, PromotionStatus } from '../../types/versioning';

interface UIVersionableItem {
  id: string;
  title: string;
  type: 'instruction' | 'prompt' | 'collection';
  environments: Record<Environment, any>;
}

interface PendingPromotionItem {
  item: UIVersionableItem;
  environment: Environment;
  env: {
    status: PromotionStatus;
    version: any;
    deployedAt?: string;
  };
}

interface PendingPromotionsProps {
  pendingPromotions: PendingPromotionItem[];
}

export const PendingPromotions: React.FC<PendingPromotionsProps> = ({
  pendingPromotions,
}) => {
  if (pendingPromotions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6"
    >
      <div className="flex items-center mb-4">
        <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
          Pending Promotions ({pendingPromotions.length})
        </h3>
      </div>
      <div className="space-y-3">
        {pendingPromotions.map(({ item, environment, env }) => (
          <div key={`${item.id}-${environment}`} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-md p-3">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.type} • Requested {env.deployedAt && new Date(env.deployedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <EnvironmentBadge
              environment={environment}
              status={PromotionStatus.PENDING_REVIEW}
              version={env.version}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};