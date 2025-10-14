import React, { useState, useEffect } from 'react';
import { 
  PromotionModal,
} from '../components/environment/EnvironmentManagement';
import { EnvironmentManager } from '../utils/environment';
import { 
  Environment, 
  PromotionStatus, 
  PromotionRequest,
  VersionableItem 
} from '../types/versioning';
import { useAppStore } from '../store/useAppStore';
import {
  DeploymentsHeader,
  EnvironmentOverview,
  PendingPromotions,
  DeploymentFilters,
  DeploymentGrid
} from '../components/deployments';
import toast from 'react-hot-toast';

// Extended interface for UI compatibility
interface UIVersionableItem extends VersionableItem {
  title: string;
  type: 'instruction' | 'prompt' | 'collection';
  createdAt: string;
  updatedAt: string;
}

const Deployments: React.FC = () => {
  const { instructions, prompts, collections } = useAppStore();
  const [selectedItem, setSelectedItem] = useState<UIVersionableItem | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [targetEnvironment, setTargetEnvironment] = useState<Environment>(Environment.QA);
  const [filterEnvironment, setFilterEnvironment] = useState<Environment | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<PromotionStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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
        i.id === item.id && i.type === item.type
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
        item.id === selectedItem?.id && item.type === selectedItem?.type
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
      <DeploymentsHeader 
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Environment Overview */}
      <EnvironmentOverview environmentStats={environmentStats} />

      {/* Pending Promotions */}
      <PendingPromotions pendingPromotions={pendingPromotions} />

      {/* Filters */}
      <DeploymentFilters
        filterEnvironment={filterEnvironment}
        filterStatus={filterStatus}
        onEnvironmentChange={setFilterEnvironment}
        onStatusChange={setFilterStatus}
      />

      {/* Deployment Items */}
      <DeploymentGrid
        items={filteredItems}
        onPromote={handlePromote}
        onRollback={handleRollback}
      />

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