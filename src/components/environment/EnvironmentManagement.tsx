import React, { useState } from 'react';
import { 
  GitBranch, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Lock,
  Unlock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Input';
import { 
  Environment, 
  PromotionStatus, 
  Version, 
  VersionableItem,
  PromotionRequest 
} from '../../types/versioning';
import { EnvironmentManager, VersionManager, ReleaseManager } from '../../utils/environment';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface EnvironmentBadgeProps {
  environment: Environment;
  status: PromotionStatus;
  version?: Version;
  isActive?: boolean;
}

/**
 * Environment status badge component
 */
export const EnvironmentBadge: React.FC<EnvironmentBadgeProps> = ({ 
  environment, 
  status, 
  version,
  isActive = false 
}) => {
  const getEnvironmentColor = (env: Environment) => {
    switch (env) {
      case Environment.DEVELOPMENT:
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
      case Environment.QA:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case Environment.STAGING:
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700';
      case Environment.PRODUCTION:
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status: PromotionStatus) => {
    switch (status) {
      case PromotionStatus.DEPLOYED:
        return <CheckCircle className="h-3 w-3" />;
      case PromotionStatus.PENDING_REVIEW:
        return <Clock className="h-3 w-3" />;
      case PromotionStatus.REJECTED:
        return <XCircle className="h-3 w-3" />;
      case PromotionStatus.DEPRECATED:
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border
      ${getEnvironmentColor(environment)}
      ${isActive ? 'ring-2 ring-offset-1 ring-current' : ''}
    `}>
      {getStatusIcon(status)}
      <span className="font-semibold">{environment.toUpperCase()}</span>
      {version && (
        <span className="opacity-75">
          v{VersionManager.versionToString(version)}
        </span>
      )}
    </div>
  );
};

interface EnvironmentPipelineProps {
  item: VersionableItem;
  onPromote: (toEnvironment: Environment) => void;
  onRollback: (environment: Environment) => void;
}

/**
 * Visual pipeline showing deployment status across environments
 */
export const EnvironmentPipeline: React.FC<EnvironmentPipelineProps> = ({
  item,
  onPromote,
  onRollback
}) => {
  const environments = [
    Environment.DEVELOPMENT,
    Environment.QA,
    Environment.STAGING,
    Environment.PRODUCTION
  ];

  const currentEnv = EnvironmentManager.getCurrentEnvironment();

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Deployment Pipeline</h3>
        <div className="flex items-center gap-2">
          {item.isLocked ? (
            <div className="flex items-center gap-1 text-amber-600">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Locked</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-green-600">
              <Unlock className="h-4 w-4" />
              <span className="text-sm font-medium">Unlocked</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        {environments.map((env, index) => {
          const envConfig = item.environments[env];
          const isDeployed = envConfig?.status === PromotionStatus.DEPLOYED;
          const canPromoteHere = index > 0 && 
            EnvironmentManager.canPromote(environments[index - 1], env) &&
            !item.isLocked;

          return (
            <React.Fragment key={env}>
              <div className="flex flex-col items-center space-y-2">
                <EnvironmentBadge
                  environment={env}
                  status={envConfig?.status || PromotionStatus.DRAFT}
                  version={envConfig?.version}
                  isActive={env === currentEnv}
                />
                
                {envConfig && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {envConfig.deployedAt && (
                      <div>
                        Deployed {new Date(envConfig.deployedAt).toLocaleDateString()}
                      </div>
                    )}
                    {envConfig.deployedBy && (
                      <div>by {envConfig.deployedBy}</div>
                    )}
                  </div>
                )}

                <div className="flex gap-1">
                  {canPromoteHere && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPromote(env)}
                      className="h-7 px-2 text-xs bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400"
                    >
                      Promote
                    </Button>
                  )}
                  
                  {isDeployed && envConfig?.rollbackVersion && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRollback(env)}
                      className="h-7 px-2 text-xs bg-gray-50 border-gray-400 text-red-600 hover:bg-gray-100 hover:border-gray-500 hover:text-red-700 dark:bg-gray-700 dark:border-gray-500 dark:text-red-400 dark:hover:bg-gray-600 dark:hover:border-gray-400 dark:hover:text-red-300 focus:font-bold focus:border-2 focus:border-red-500 dark:focus:border-red-400"
                    >
                      Rollback
                    </Button>
                  )}
                </div>
              </div>

              {index < environments.length - 1 && (
                <ArrowRight className="h-5 w-5 text-gray-400" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: VersionableItem;
  toEnvironment: Environment;
  onSubmit: (request: PromotionRequest) => Promise<void>;
}

/**
 * Modal for creating promotion requests
 */
export const PromotionModal: React.FC<PromotionModalProps> = ({
  isOpen,
  onClose,
  item,
  toEnvironment,
  onSubmit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmitForm = async (data: any) => {
    setIsSubmitting(true);
    try {
      const request = await ReleaseManager.createPromotionRequest(
        item,
        toEnvironment,
        'current-user', // This should come from auth context
        data.reason,
        data.changesSummary
      );

      await onSubmit(request);
      toast.success('Promotion request created successfully');
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to create promotion request');
      console.error('Promotion request error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentEnv = EnvironmentManager.getCurrentEnvironment();
  const requiredApprovers = EnvironmentManager.getRequiredApprovers(toEnvironment);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Promotion" size="lg">
      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        {/* Promotion Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Promotion Summary</h4>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <EnvironmentBadge
                environment={currentEnv}
                status={PromotionStatus.DEPLOYED}
                version={item.version}
              />
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <EnvironmentBadge
                environment={toEnvironment}
                status={PromotionStatus.PENDING_REVIEW}
                version={item.version}
              />
            </div>
          </div>
        </div>

        {/* Version Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Version
            </label>
            <div className="text-lg font-mono bg-gray-100 px-3 py-2 rounded">
              {VersionManager.versionToString(item.version)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Environment
            </label>
            <div className="text-lg font-semibold px-3 py-2">
              {toEnvironment.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Required Approvers */}
        {requiredApprovers.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Approvers
            </label>
            <div className="flex flex-wrap gap-2">
              {requiredApprovers.map(role => (
                <span 
                  key={role} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {role.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reason */}
        <Textarea
          label="Reason for Promotion *"
          {...register('reason', { required: 'Reason is required' })}
          error={errors.reason?.message as string}
          placeholder="Explain why this promotion is needed..."
          rows={3}
        />

        {/* Changes Summary */}
        <Textarea
          label="Changes Summary *"
          {...register('changesSummary', { required: 'Changes summary is required' })}
          error={errors.changesSummary?.message as string}
          placeholder="Summarize the changes being promoted..."
          rows={4}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Request Promotion
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface VersionHistoryProps {
  item: VersionableItem;
}

/**
 * Version history and promotion tracking
 */
export const VersionHistory: React.FC<VersionHistoryProps> = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Version History</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400 focus:font-bold focus:border-2 focus:border-primary-500 dark:focus:border-primary-400"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {item.promotionHistory.map((promotion) => (
            <div key={promotion.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <GitBranch className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      v{VersionManager.versionToString(promotion.version)}
                    </span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                    <EnvironmentBadge
                      environment={promotion.toEnvironment}
                      status={promotion.status}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(promotion.requestedAt).toLocaleDateString()}
                  </span>
                </div>
                
                {showDetails && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Reason:</strong> {promotion.reason}</p>
                    <p><strong>Changes:</strong> {promotion.changesSummary}</p>
                    <p><strong>Requested by:</strong> {promotion.requestedBy}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};