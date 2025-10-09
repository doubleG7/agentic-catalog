import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  GitBranch, 
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { 
  EnvironmentPipeline, 
  VersionHistory, 
  PromotionModal,
  EnvironmentBadge 
} from '../components/environment/EnvironmentManagement';
import { EnvironmentManager, VersionManager } from '../utils/environment';
import { 
  Environment, 
  PromotionStatus, 
  VersionableItem,
  PromotionRequest 
} from '../types/versioning';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';

const Deployments: React.FC = () => {
  const { instructions, prompts, collections } = useAppStore();
  const [selectedItem, setSelectedItem] = useState<VersionableItem | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [targetEnvironment, setTargetEnvironment] = useState<Environment>(Environment.QA);
  const [filterEnvironment, setFilterEnvironment] = useState<Environment | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<PromotionStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extended interface for UI compatibility
  interface UIVersionableItem extends VersionableItem {
    title: string;
    type: 'instruction' | 'prompt' | 'collection';
    createdAt: string;
    updatedAt: string;
  }
  
  // Convert existing items to VersionableItems (in real app this would come from API)
  const [versionableItems, setVersionableItems] = useState<UIVersionableItem[]>([]);

  useEffect(() => {
    // Simulate converting existing items to versionable items
    const convertToVersionable = (items: any[], type: 'instruction' | 'prompt' | 'collection'): UIVersionableItem[] => {
      return items.map(item => ({
        ...item,
        type,
        version: { major: 1, minor: 0, patch: 0 },
        environments: {
          [Environment.DEVELOPMENT]: {
            environment: Environment.DEVELOPMENT,
            status: PromotionStatus.DEPLOYED,
            version: { major: 1, minor: 0, patch: 0 },
            deployedAt: new Date().toISOString(),
            deployedBy: 'system',
            approvals: []
          },
          [Environment.QA]: null,
          [Environment.STAGING]: null,
          [Environment.PRODUCTION]: null
        },
        isLocked: false,
        promotionHistory: [],
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
        getVersionString: () => `${item.version?.major || 1}.${item.version?.minor || 0}.${item.version?.patch || 0}`,
        canPromoteTo: (_env: Environment) => true,
        requiresApproval: (env: Environment) => env === Environment.PRODUCTION
      }));
    };

    const allVersionableItems = [
      ...convertToVersionable(instructions, 'instruction'),
      ...convertToVersionable(prompts, 'prompt'),
      ...convertToVersionable(collections, 'collection')
    ];

    setVersionableItems(allVersionableItems);
  }, [instructions, prompts, collections]);

  const handlePromote = (item: UIVersionableItem, toEnvironment: Environment) => {
    setSelectedItem(item);
    setTargetEnvironment(toEnvironment);
    setShowPromotionModal(true);
  };

  const handleRollback = async (item: UIVersionableItem, environment: Environment) => {
    try {
      // Simulate rollback operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Rolled back ${item.title} in ${environment}`);
      
      // Update local state (in real app this would be an API call)
      setVersionableItems(prev => prev.map(i => 
        i.id === item.id 
          ? {
              ...i,
              environments: {
                ...i.environments,
                [environment]: {
                  ...i.environments[environment],
                  status: PromotionStatus.DEPLOYED,
                  rollbackVersion: i.environments[environment]?.rollbackVersion
                }
              }
            }
          : i
      ));
    } catch (error) {
      toast.error('Failed to rollback deployment');
    }
  };

  const handlePromotionRequest = async (request: PromotionRequest) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setVersionableItems(prev => prev.map(item => 
        item.id === selectedItem?.id 
          ? {
              ...item,
              environments: {
                ...item.environments,
                [targetEnvironment]: {
                  status: PromotionStatus.PENDING_REVIEW,
                  version: item.version,
                  requestedAt: new Date().toISOString(),
                  requestedBy: 'current-user'
                }
              },
              promotionHistory: [
                ...item.promotionHistory,
                {
                  id: `promo-${Date.now()}`,
                  itemId: item.id,
                  itemType: item.type,
                  version: item.version,
                  fromEnvironment: EnvironmentManager.getCurrentEnvironment(),
                  toEnvironment: targetEnvironment,
                  status: PromotionStatus.PENDING_REVIEW,
                  reason: request.reason,
                  changesSummary: request.changesSummary,
                  requestedBy: request.requestedBy,
                  requestedAt: request.requestedAt,
                  approvals: []
                }
              ]
            }
          : item
      ));

      toast.success('Promotion request submitted successfully');
    } catch (error) {
      toast.error('Failed to submit promotion request');
      throw error;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate refresh operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Deployment status refreshed');
    } catch (error) {
      toast.error('Failed to refresh deployment status');
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredItems = versionableItems.filter(item => {
    if (filterEnvironment !== 'all') {
      const envStatus = item.environments[filterEnvironment];
      if (!envStatus) return false;
    }
    
    if (filterStatus !== 'all') {
      const hasStatus = Object.values(item.environments).some(env => env && env.status === filterStatus);
      if (!hasStatus) return false;
    }
    
    return true;
  });

  const environmentStats = {
    [Environment.DEVELOPMENT]: versionableItems.filter(item => 
      item.environments[Environment.DEVELOPMENT]?.status === PromotionStatus.DEPLOYED
    ).length,
    [Environment.QA]: versionableItems.filter(item => 
      item.environments[Environment.QA]?.status === PromotionStatus.DEPLOYED
    ).length,
    [Environment.STAGING]: versionableItems.filter(item => 
      item.environments[Environment.STAGING]?.status === PromotionStatus.DEPLOYED
    ).length,
    [Environment.PRODUCTION]: versionableItems.filter(item => 
      item.environments[Environment.PRODUCTION]?.status === PromotionStatus.DEPLOYED
    ).length,
  };

  const pendingPromotions = versionableItems
    .flatMap(item => 
      Object.entries(item.environments)
        .filter(([_, env]) => env && env.status === PromotionStatus.PENDING_REVIEW)
        .map(([envName, env]) => ({ item, environment: envName as Environment, env: env! }))
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
          >
            Deployments
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-gray-500"
          >
            Manage deployments across Development, QA, Staging, and Production environments
          </motion.p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            loading={isRefreshing}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Environment Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {Object.entries(environmentStats).map(([env, count]) => (
          <div key={env} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Cloud className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {env.charAt(0).toUpperCase() + env.slice(1).toLowerCase()}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {count}
                      </div>
                      <div className="ml-2 text-sm text-gray-500">
                        deployed
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Pending Promotions */}
      {pendingPromotions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-6"
        >
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-yellow-900">
              Pending Promotions ({pendingPromotions.length})
            </h3>
          </div>
          <div className="space-y-3">
            {pendingPromotions.map(({ item, environment, env }) => (
              <div key={`${item.id}-${environment}`} className="flex items-center justify-between bg-white rounded-md p-3">
                <div className="flex items-center space-x-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">
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
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow"
      >
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <select
          value={filterEnvironment}
          onChange={(e) => setFilterEnvironment(e.target.value as Environment | 'all')}
          className="text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
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
          onChange={(e) => setFilterStatus(e.target.value as PromotionStatus | 'all')}
          className="text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value={PromotionStatus.DEPLOYED}>Deployed</option>
          <option value={PromotionStatus.PENDING_REVIEW}>Pending Review</option>
          <option value={PromotionStatus.REJECTED}>Rejected</option>
          <option value={PromotionStatus.DEPRECATED}>Deprecated</option>
        </select>
      </motion.div>

      {/* Deployment Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-6"
      >
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-lg shadow"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {item.type} • v{VersionManager.versionToString(item.version)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <EnvironmentPipeline
                item={item}
                onPromote={(env) => handlePromote(item, env)}
                onRollback={(env) => handleRollback(item, env)}
              />
            </div>

            <div className="p-6 pt-0">
              <VersionHistory item={item} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <GitBranch className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No items found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No items match the current filters.
          </p>
        </motion.div>
      )}

      {/* Promotion Modal */}
      {selectedItem && (
        <PromotionModal
          isOpen={showPromotionModal}
          onClose={() => {
            setShowPromotionModal(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          toEnvironment={targetEnvironment}
          onSubmit={handlePromotionRequest}
        />
      )}
    </div>
  );
};

export default Deployments;