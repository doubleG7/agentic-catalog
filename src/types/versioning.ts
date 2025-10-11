import { Instruction, Prompt } from './index';

/**
 * Collection interface (if not exists in main types)
 */
export interface Collection {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  prompts: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  rating?: {
    average: number; // 0-5 with decimal support (e.g., 4.5)
    count: number; // total number of ratings
    userRating?: number; // current user's rating
  };
}

/**
 * Environment types for promotion workflow
 */
export enum Environment {
  DEVELOPMENT = 'development',
  QA = 'qa',
  STAGING = 'staging',
  PRODUCTION = 'production'
}

/**
 * Promotion status for tracking deployment state
 */
export enum PromotionStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  DEPLOYED = 'deployed',
  REJECTED = 'rejected',
  DEPRECATED = 'deprecated'
}

/**
 * Versioning strategy
 */
export interface Version {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string; // alpha, beta, rc
}

/**
 * Environment-specific metadata
 */
export interface EnvironmentConfig {
  environment: Environment;
  deployedAt: string;
  deployedBy: string;
  version: Version;
  status: PromotionStatus;
  approvals: Approval[];
  rollbackVersion?: Version;
}

/**
 * Approval workflow
 */
export interface Approval {
  userId: string;
  userRole: 'developer' | 'qa_lead' | 'product_manager' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approvedAt?: string;
}

/**
 * Promotion request
 */
export interface PromotionRequest {
  id: string;
  itemId: string;
  itemType: 'instruction' | 'prompt' | 'collection';
  fromEnvironment: Environment;
  toEnvironment: Environment;
  version: Version;
  requestedBy: string;
  requestedAt: string;
  reason: string;
  changesSummary: string;
  approvals: Approval[];
  status: PromotionStatus;
  scheduledDeployment?: string;
}

/**
 * Enhanced base interface for versionable items
 */
export interface VersionableItem {
  id: string;
  version: Version;
  environments: Record<Environment, EnvironmentConfig | null>;
  promotionHistory: PromotionRequest[];
  isLocked: boolean; // Prevent modifications in prod
  lockReason?: string;
  parentVersion?: Version; // For tracking lineage
  
  // Semantic versioning helpers
  getVersionString(): string;
  canPromoteTo(environment: Environment): boolean;
  requiresApproval(toEnvironment: Environment): boolean;
}

/**
 * Enhanced Instruction with environment support
 */
export interface VersionedInstruction extends Instruction, VersionableItem {
  // Environment-specific overrides
  environmentOverrides?: Partial<Record<Environment, Partial<Instruction>>>;
}

/**
 * Enhanced Prompt with environment support
 */
export interface VersionedPrompt extends Prompt, VersionableItem {
  // Environment-specific variable defaults
  environmentVariables?: Partial<Record<Environment, Record<string, any>>>;
}

/**
 * Enhanced Collection with environment support
 */
export interface VersionedCollection extends Collection, VersionableItem {
  // Track which items are included per environment
  environmentItems?: Partial<Record<Environment, {
    instructions: string[];
    prompts: string[];
  }>>;
}

/**
 * Deployment configuration
 */
export interface DeploymentConfig {
  environment: Environment;
  apiEndpoint: string;
  requiresApproval: boolean;
  approvalRoles: string[];
  autoPromoteOnSuccess?: boolean;
  rollbackOnFailure: boolean;
  healthCheckEndpoint?: string;
  notificationChannels: string[];
}

/**
 * Release management
 */
export interface Release {
  id: string;
  version: Version;
  name: string;
  description: string;
  items: {
    instructions: VersionedInstruction[];
    prompts: VersionedPrompt[];
    collections: VersionedCollection[];
  };
  environments: Record<Environment, {
    status: PromotionStatus;
    deployedAt?: string;
    deployedBy?: string;
    healthStatus?: 'healthy' | 'degraded' | 'unhealthy';
  }>;
  createdBy: string;
  createdAt: string;
  releaseNotes: string;
}