import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { EnvironmentBadge } from '../environment/EnvironmentManagement';
import { Environment, PromotionStatus } from '../../types/versioning';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import toast from 'react-hot-toast';

interface UIVersionableItem {
  id: string;
  title: string;
  type: 'instruction' | 'prompt' | 'collection';
  environments: Record<Environment, any>;
}

interface PendingPromotionItem {
  item: UIVersionableItem;
  environment: Environment;
  promotionId?: string; // Real promotion ID from API
  env: {
    status: PromotionStatus;
    version: any;
    deployedAt?: string;
    requestedAt?: string;
    requestedBy?: string;
    reason?: string;
    changesSummary?: string;
  };
}

interface PendingPromotionsProps {
  pendingPromotions: PendingPromotionItem[];
  isLoading?: boolean;
  onApprove?: (promotionId: string, comments?: string) => Promise<void>;
  onReject?: (promotionId: string, comments: string) => Promise<void>;
  currentUserRole?: string;
}

export const PendingPromotions: React.FC<PendingPromotionsProps> = ({
  pendingPromotions,
  isLoading = false,
  onApprove,
  onReject,
  currentUserRole = 'USER',
}) => {
  const [selectedPromotion, setSelectedPromotion] = useState<PendingPromotionItem | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canApprove = ['ADMIN', 'PRODUCT_MANAGER', 'QA_LEAD'].includes(currentUserRole);

  const handleOpenModal = (promotion: PendingPromotionItem, action: 'approve' | 'reject') => {
    setSelectedPromotion(promotion);
    setActionType(action);
    setComments('');
    setShowApprovalModal(true);
  };

  const handleCloseModal = () => {
    setShowApprovalModal(false);
    setSelectedPromotion(null);
    setComments('');
  };

  const handleSubmit = async () => {
    if (!selectedPromotion) return;

    // Validate rejection requires comments
    if (actionType === 'reject' && comments.trim().length < 10) {
      toast.error('Rejection comments must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      // Use real promotion ID if available, otherwise fallback to composite
      const promotionId = selectedPromotion.promotionId || 
        `promo-${selectedPromotion.item.id}-${selectedPromotion.environment}`;
      
      console.log('🔍 Submitting promotion action:', {
        actionType,
        promotionId,
        hasRealId: !!selectedPromotion.promotionId,
        itemId: selectedPromotion.item.id,
        environment: selectedPromotion.environment,
        comments
      });
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(promotionId)) {
        console.error('❌ Invalid promotion ID format (not a UUID):', promotionId);
        toast.error('Invalid promotion ID. Please refresh and try again.');
        setIsSubmitting(false);
        return;
      }
      
      if (actionType === 'approve' && onApprove) {
        await onApprove(promotionId, comments || undefined);
      } else if (actionType === 'reject' && onReject) {
        await onReject(promotionId, comments);
      }

      handleCloseModal();
    } catch (error) {
      console.error('Failed to process promotion:', error);
      // Error is already handled in parent, don't show duplicate toast
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 animate-spin" />
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
            Loading pending promotions...
          </h3>
        </div>
      </div>
    );
  }

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
        {pendingPromotions.map(({ item, environment, promotionId, env }) => (
          <motion.div
            key={`${item.id}-${environment}`}
            whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-md p-4 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all hover:border-yellow-400 dark:hover:border-yellow-600 group"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-yellow-700 dark:group-hover:text-yellow-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {item.type} • Requested {env.requestedAt ? new Date(env.requestedAt).toLocaleDateString() : 'recently'}
                  {env.requestedBy && ` by ${env.requestedBy}`}
                </p>
                {env.reason && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 italic">
                    "{env.reason.substring(0, 100)}{env.reason.length > 100 ? '...' : ''}"
                  </p>
                )}
              </div>
              <EnvironmentBadge
                environment={environment}
                status={PromotionStatus.PENDING_REVIEW}
                version={env.version}
              />
            </div>
            
            {canApprove && (
              <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal({ item, environment, promotionId, env }, 'approve');
                  }}
                  className="h-8 px-3 bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal({ item, environment, promotionId, env }, 'reject');
                  }}
                  className="h-8 px-3 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
            
            {!canApprove && (
              <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Approval/Rejection Modal */}
      {selectedPromotion && (
        <Modal
          isOpen={showApprovalModal}
          onClose={handleCloseModal}
          title={`${actionType === 'approve' ? 'Approve' : 'Reject'} Promotion`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Promotion Details */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Promotion Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Item:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedPromotion.item.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedPromotion.item.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Target Environment:</span>
                  <EnvironmentBadge
                    environment={selectedPromotion.environment}
                    status={PromotionStatus.PENDING_REVIEW}
                    version={selectedPromotion.env.version}
                  />
                </div>
                {selectedPromotion.env.requestedBy && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Requested By:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedPromotion.env.requestedBy}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Reason and Changes */}
            {(selectedPromotion.env.reason || selectedPromotion.env.changesSummary) && (
              <div className="space-y-3">
                {selectedPromotion.env.reason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Reason
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                      {selectedPromotion.env.reason}
                    </div>
                  </div>
                )}
                {selectedPromotion.env.changesSummary && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Changes Summary
                    </label>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                      {selectedPromotion.env.changesSummary}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Comments */}
            <Textarea
              label={actionType === 'reject' ? 'Rejection Comments *' : 'Comments (Optional)'}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder={actionType === 'reject' ? 'Explain why this promotion is being rejected (minimum 10 characters)...' : 'Add any comments about this approval...'}
              rows={4}
              error={actionType === 'reject' && comments.length > 0 && comments.length < 10 ? 'Comments must be at least 10 characters' : undefined}
            />

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="bg-gray-50 border-gray-400 text-gray-800 hover:bg-gray-100 hover:border-gray-500 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:border-gray-400"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                loading={isSubmitting}
                className={
                  actionType === 'approve'
                    ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                    : 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600'
                }
              >
                {actionType === 'approve' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Promotion
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Promotion
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </motion.div>
  );
};