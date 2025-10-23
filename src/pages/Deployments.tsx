import React, { useState, useEffect, useMemo } from 'react';
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
import { promotionsApi, instructionsApi, promptsApi } from '../api/services';
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
  const { collections } = useAppStore();
  const [selectedItem, setSelectedItem] = useState<UIVersionableItem | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [targetEnvironment, setTargetEnvironment] = useState<Environment>(Environment.QA);
  const [filterEnvironment, setFilterEnvironment] = useState<Environment | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<PromotionStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [realPendingPromotions, setRealPendingPromotions] = useState<PromotionRequest[]>([]);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);
  
  // Fetch ALL items from API without pagination limits
  const [versionableItems, setVersionableItems] = useState<UIVersionableItem[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  // Mock user role - in production this would come from auth context
  // Since ENABLE_AUTH_BYPASS=true, we're using first ADMIN user
  const currentUserRole = 'ADMIN';

  // Fetch pending promotions from API
  useEffect(() => {
    const fetchPendingPromotions = async () => {
      try {
        setIsLoadingPromotions(true);
        const response = await promotionsApi.getPending();
        console.log('📊 Pending promotions API response:', response);
        if (response.success && response.data) {
          console.log('✅ Got pending promotions:', response.data.length, response.data);
          console.log('📋 Promotion IDs:', response.data.map(p => ({ id: p.id, itemId: p.itemId, toEnv: p.toEnvironment })));
          setRealPendingPromotions(response.data);
        } else {
          console.warn('⚠️ No pending promotions data in response');
        }
      } catch (error) {
        console.error('❌ Failed to fetch pending promotions:', error);
        toast.error('Failed to load pending promotions');
      } finally {
        setIsLoadingPromotions(false);
      }
    };

    fetchPendingPromotions();
  }, []);

  // Fetch ALL instructions, prompts, and collections without pagination
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        setIsLoadingItems(true);
        
        // Fetch with large limit to get all items
        const [instructionsRes, promptsRes] = await Promise.all([
          instructionsApi.getAll({ limit: 1000 }),
          promptsApi.getAll({ limit: 1000 })
        ]);

        console.log('📦 Fetched all items:', {
          instructions: instructionsRes.data.length,
          prompts: promptsRes.data.length,
          total: instructionsRes.data.length + promptsRes.data.length
        });

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
          ...convertToVersionable(instructionsRes.data, 'instruction'),
          ...convertToVersionable(promptsRes.data, 'prompt'),
          ...convertToVersionable(collections, 'collection')
        ];

        setVersionableItems(allVersionableItems);
      } catch (error) {
        console.error('❌ Failed to fetch items:', error);
        toast.error('Failed to load deployment items');
      } finally {
        setIsLoadingItems(false);
      }
    };

    fetchAllItems();
  }, [collections]);

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
      if (!selectedItem) return;

      console.log('📤 Submitting promotion request:', {
        itemType: selectedItem.type === 'instruction' ? 'INSTRUCTION' : 'PROMPT',
        itemId: selectedItem.id,
        fromEnvironment: EnvironmentManager.getCurrentEnvironment(),
        toEnvironment: targetEnvironment,
        reason: request.reason,
        reasonLength: request.reason?.length || 0,
        changesSummary: request.changesSummary,
        changesSummaryLength: request.changesSummary?.length || 0,
        scheduledAt: request.scheduledDeployment,
      });

      // Call real API - Convert environment values to uppercase for backend
      const response = await promotionsApi.create({
        itemType: selectedItem.type === 'instruction' ? 'INSTRUCTION' : 'PROMPT',
        itemId: selectedItem.id,
        fromEnvironment: EnvironmentManager.getCurrentEnvironment().toUpperCase() as Environment,
        toEnvironment: targetEnvironment.toUpperCase() as Environment,
        reason: request.reason,
        changesSummary: request.changesSummary,
        scheduledAt: request.scheduledDeployment,
      });

      if (response.success) {
        toast.success('Promotion request submitted successfully');
        
        // Refresh pending promotions
        const pendingResponse = await promotionsApi.getPending();
        if (pendingResponse.success && pendingResponse.data) {
          setRealPendingPromotions(pendingResponse.data);
        }

        // Update local state for UI
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
                  response.data
                ]
              }
            : item
        ));
      }
    } catch (error: any) {
      console.error('❌ Failed to create promotion:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error data:', error.response?.data);
      
      // Extract validation errors from response (backend returns 'details' array)
      if (error.response?.data?.details) {
        const validationErrors = error.response.data.details
          .map((err: any) => `${err.path || err.param || 'field'}: ${err.msg || err.message}`)
          .join('\n');
        console.error('❌ Validation errors:', validationErrors);
        toast.error(`Validation failed:\n${validationErrors}`, { duration: 5000 });
      } else if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
          .map((err: any) => `${err.param || 'field'}: ${err.msg || err.message}`)
          .join('\n');
        console.error('❌ Validation errors:', validationErrors);
        toast.error(`Validation error:\n${validationErrors}`, { duration: 5000 });
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit promotion request');
      }
      
      throw error;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh pending promotions
      const response = await promotionsApi.getPending();
      if (response.success && response.data) {
        setRealPendingPromotions(response.data);
      }
      toast.success('Deployment status refreshed');
    } catch (error) {
      console.error('Failed to refresh:', error);
      toast.error('Failed to refresh deployment status');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleApprovePromotion = async (promotionId: string, comments?: string) => {
    try {
      console.log('✅ Approving promotion:', { promotionId, comments, isUUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(promotionId) });
      const response = await promotionsApi.approve(promotionId, comments);
      
      if (response.success) {
        toast.success('Promotion approved successfully');
        // Refresh pending promotions
        const pendingResponse = await promotionsApi.getPending();
        if (pendingResponse.success && pendingResponse.data) {
          setRealPendingPromotions(pendingResponse.data);
        }
      } else {
        throw new Error(response.message || 'Failed to approve promotion');
      }
    } catch (error: any) {
      console.error('❌ Failed to approve promotion:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      // Extract validation errors
      if (error.response?.data?.details) {
        const validationErrors = error.response.data.details
          .map((err: any) => `${err.param || err.field || 'field'}: ${err.msg || err.message}`)
          .join('\n');
        toast.error(`Validation failed:\n${validationErrors}`, { duration: 5000 });
      } else {
        toast.error(error.response?.data?.message || 'Failed to approve promotion');
      }
      throw error;
    }
  };

  const handleRejectPromotion = async (promotionId: string, comments: string) => {
    try {
      console.log('❌ Rejecting promotion:', { promotionId, comments });
      const response = await promotionsApi.reject(promotionId, comments);
      
      if (response.success) {
        toast.success('Promotion rejected');
        // Refresh pending promotions
        const pendingResponse = await promotionsApi.getPending();
        if (pendingResponse.success && pendingResponse.data) {
          setRealPendingPromotions(pendingResponse.data);
        }
      } else {
        throw new Error(response.message || 'Failed to reject promotion');
      }
    } catch (error: any) {
      console.error('❌ Failed to reject promotion:', error);
      toast.error(error.response?.data?.message || 'Failed to reject promotion');
      throw error;
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

  // Merge local pending with real API pending promotions using useMemo
  const realPromoPending = useMemo(() => {
    // Only process if we have items loaded
    if (isLoadingItems || versionableItems.length === 0) {
      console.log('⏳ Waiting for items to load before processing promotions');
      return [];
    }

    console.log('🔍 Processing pending promotions:', {
      realPendingPromotions: realPendingPromotions.length,
      versionableItems: versionableItems.length,
      itemIds: versionableItems.map(i => ({ id: i.id, type: i.type, title: i.title })),
      promotions: realPendingPromotions.map(p => ({ 
        id: p.id, 
        itemId: p.itemId, 
        itemType: p.itemType, 
        status: p.status 
      }))
    });

    return realPendingPromotions
      .map(promo => {
        const itemType = promo.itemType.toLowerCase(); // Convert INSTRUCTION/PROMPT to instruction/prompt
        console.log(`🔎 Looking for item: id=${promo.itemId}, apiType=${promo.itemType}, searchType=${itemType}, promotionId=${promo.id}`);
        const item = versionableItems.find(i => i.id === promo.itemId && i.type === itemType);
        
        if (!item) {
          console.warn(`⚠️ Item not found for promotion:`, { 
            promotionId: promo.id,
            itemId: promo.itemId, 
            promotionType: promo.itemType,
            searchType: itemType,
            availableItems: versionableItems.map(i => ({ id: i.id, type: i.type, title: i.title }))
          });
          return null;
        }
        
        console.log(`✅ Found item for promotion:`, { title: item.title, promotionId: promo.id });
        
        // Parse version from promotion or use item's version
        const rawVersion = promo.version || item.version || { major: 1, minor: 0, patch: 0 };
        const version: any = rawVersion; // Allow accessing both formats
        
        const mappedPromo = {
          item,
          environment: promo.toEnvironment,
          promotionId: promo.id, // Include promotion ID for approve/reject
          env: {
            environment: promo.toEnvironment,
            status: promo.status,
            version: {
              major: version.major ?? version.versionMajor ?? 1,
              minor: version.minor ?? version.versionMinor ?? 0,
              patch: version.patch ?? version.versionPatch ?? 0,
              prerelease: version.prerelease ?? version.versionPrerelease
            },
            deployedAt: promo.requestedAt,
            requestedAt: promo.requestedAt,
            requestedBy: promo.requestedBy,
            reason: promo.reason,
            changesSummary: promo.changesSummary,
            approvals: promo.approvals,
          },
        };
        
        console.log(`📦 Mapped promotion:`, { 
          itemTitle: mappedPromo.item.title, 
          promotionId: mappedPromo.promotionId,
          environment: mappedPromo.environment 
        });
        
        return mappedPromo;
      })
      .filter((p): p is { item: UIVersionableItem; environment: Environment; promotionId: string; env: any } => p !== null);
  }, [realPendingPromotions, versionableItems, isLoadingItems]);

  const allPendingPromotions = useMemo(() => {
    // Only use real API pending promotions, not local mock ones
    // Local ones don't have promotion IDs and can't be approved/rejected
    const combined = realPromoPending;
    
    console.log('📋 Final pending promotions count:', {
      local: pendingPromotions.length,
      fromAPI: realPromoPending.length,
      total: combined.length,
      note: 'Only showing API promotions (local ones have no promotion ID)',
      promotionIds: combined.map(p => ({ 
        itemTitle: p.item.title, 
        promotionId: p.promotionId, 
        hasId: !!p.promotionId,
        env: p.environment 
      }))
    });
    
    return combined;
  }, [pendingPromotions, realPromoPending]);

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
      <PendingPromotions 
        pendingPromotions={allPendingPromotions} 
        isLoading={isLoadingPromotions}
        onApprove={handleApprovePromotion}
        onReject={handleRejectPromotion}
        currentUserRole={currentUserRole}
      />

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
        pendingPromotions={realPendingPromotions.map(p => ({
          itemId: p.itemId,
          toEnvironment: p.toEnvironment,
          status: p.status
        }))}
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