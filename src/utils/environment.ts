import { 
  Environment, 
  PromotionStatus, 
  Version, 
  PromotionRequest, 
  VersionableItem,
  DeploymentConfig 
} from '../types/versioning';
import { SecurityUtils } from './security';

/**
 * Environment and version management utilities
 */
export class EnvironmentManager {
  private static deploymentConfigs: Record<Environment, DeploymentConfig> = {
    [Environment.DEVELOPMENT]: {
      environment: Environment.DEVELOPMENT,
      apiEndpoint: import.meta.env.VITE_DEV_API_URL || 'http://localhost:3001/api/v1',
      requiresApproval: false,
      approvalRoles: [],
      autoPromoteOnSuccess: false,
      rollbackOnFailure: false,
      notificationChannels: ['dev-slack']
    },
    [Environment.QA]: {
      environment: Environment.QA,
      apiEndpoint: import.meta.env.VITE_QA_API_URL || 'https://qa-api.example.com/api/v1',
      requiresApproval: true,
      approvalRoles: ['developer', 'qa_lead'],
      autoPromoteOnSuccess: false,
      rollbackOnFailure: true,
      healthCheckEndpoint: '/health',
      notificationChannels: ['qa-slack', 'dev-slack']
    },
    [Environment.STAGING]: {
      environment: Environment.STAGING,
      apiEndpoint: import.meta.env.VITE_STAGING_API_URL || 'https://staging-api.example.com/api/v1',
      requiresApproval: true,
      approvalRoles: ['qa_lead', 'product_manager'],
      autoPromoteOnSuccess: false,
      rollbackOnFailure: true,
      healthCheckEndpoint: '/health',
      notificationChannels: ['product-slack', 'qa-slack']
    },
    [Environment.PRODUCTION]: {
      environment: Environment.PRODUCTION,
      apiEndpoint: import.meta.env.VITE_PROD_API_URL || 'https://api.example.com/api/v1',
      requiresApproval: true,
      approvalRoles: ['product_manager', 'admin'],
      autoPromoteOnSuccess: false,
      rollbackOnFailure: true,
      healthCheckEndpoint: '/health',
      notificationChannels: ['prod-alerts', 'product-slack']
    }
  };

  /**
   * Get current environment from URL or environment variable
   */
  static getCurrentEnvironment(): Environment {
    const hostname = window.location.hostname;
    
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return Environment.DEVELOPMENT;
    } else if (hostname.includes('qa') || hostname.includes('test')) {
      return Environment.QA;
    } else if (hostname.includes('staging') || hostname.includes('stage')) {
      return Environment.STAGING;
    } else {
      return Environment.PRODUCTION;
    }
  }

  /**
   * Get deployment configuration for environment
   */
  static getDeploymentConfig(environment: Environment): DeploymentConfig {
    return this.deploymentConfigs[environment];
  }

  /**
   * Check if promotion is allowed between environments
   */
  static canPromote(from: Environment, to: Environment): boolean {
    const promotionPath: Record<Environment, Environment[]> = {
      [Environment.DEVELOPMENT]: [Environment.QA],
      [Environment.QA]: [Environment.STAGING],
      [Environment.STAGING]: [Environment.PRODUCTION],
      [Environment.PRODUCTION]: [] // No promotion from prod
    };

    return promotionPath[from]?.includes(to) || false;
  }

  /**
   * Get required approvers for environment
   */
  static getRequiredApprovers(environment: Environment): string[] {
    return this.deploymentConfigs[environment].approvalRoles;
  }

  /**
   * Validate promotion request
   */
  static validatePromotionRequest(request: PromotionRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check if promotion path is valid
    if (!this.canPromote(request.fromEnvironment, request.toEnvironment)) {
      errors.push(`Cannot promote from ${request.fromEnvironment} to ${request.toEnvironment}`);
    }

    // Check required fields
    if (!request.reason.trim()) {
      errors.push('Promotion reason is required');
    }

    if (!request.changesSummary.trim()) {
      errors.push('Changes summary is required');
    }

    // Sanitize inputs
    const sanitizedReason = SecurityUtils.sanitizeText(request.reason);
    const sanitizedSummary = SecurityUtils.sanitizeText(request.changesSummary);

    if (sanitizedReason !== request.reason) {
      errors.push('Promotion reason contains invalid characters');
    }

    if (sanitizedSummary !== request.changesSummary) {
      errors.push('Changes summary contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Version management utilities
 */
export class VersionManager {
  /**
   * Parse version string into Version object
   */
  static parseVersion(versionString: string): Version {
    const parts = versionString.split(/[.-]/);
    const [major, minor, patch, prerelease] = parts;

    return {
      major: parseInt(major) || 0,
      minor: parseInt(minor) || 0,
      patch: parseInt(patch) || 0,
      prerelease: prerelease || undefined
    };
  }

  /**
   * Convert Version object to string
   */
  static versionToString(version: Version): string {
    let versionStr = `${version.major}.${version.minor}.${version.patch}`;
    if (version.prerelease) {
      versionStr += `-${version.prerelease}`;
    }
    return versionStr;
  }

  /**
   * Compare two versions (-1: v1 < v2, 0: equal, 1: v1 > v2)
   */
  static compareVersions(v1: Version, v2: Version): number {
    if (v1.major !== v2.major) return v1.major - v2.major;
    if (v1.minor !== v2.minor) return v1.minor - v2.minor;
    if (v1.patch !== v2.patch) return v1.patch - v2.patch;

    // Handle prerelease
    if (!v1.prerelease && !v2.prerelease) return 0;
    if (v1.prerelease && !v2.prerelease) return -1;
    if (!v1.prerelease && v2.prerelease) return 1;
    
    return v1.prerelease!.localeCompare(v2.prerelease!);
  }

  /**
   * Generate next version based on change type
   */
  static incrementVersion(
    currentVersion: Version, 
    changeType: 'major' | 'minor' | 'patch' | 'prerelease',
    prereleaseType?: string
  ): Version {
    const newVersion: Version = { ...currentVersion };

    switch (changeType) {
      case 'major':
        newVersion.major += 1;
        newVersion.minor = 0;
        newVersion.patch = 0;
        newVersion.prerelease = undefined;
        break;
      case 'minor':
        newVersion.minor += 1;
        newVersion.patch = 0;
        newVersion.prerelease = undefined;
        break;
      case 'patch':
        newVersion.patch += 1;
        newVersion.prerelease = undefined;
        break;
      case 'prerelease':
        newVersion.prerelease = prereleaseType || 'alpha';
        break;
    }

    return newVersion;
  }

  /**
   * Check if version is stable (no prerelease)
   */
  static isStableVersion(version: Version): boolean {
    return !version.prerelease;
  }

  /**
   * Get version compatibility status
   */
  static getCompatibilityStatus(oldVersion: Version, newVersion: Version): {
    breaking: boolean;
    level: 'patch' | 'minor' | 'major';
    compatible: boolean;
  } {
    const comparison = this.compareVersions(newVersion, oldVersion);
    
    if (comparison === 0) {
      return { breaking: false, level: 'patch', compatible: true };
    }

    if (newVersion.major > oldVersion.major) {
      return { breaking: true, level: 'major', compatible: false };
    }

    if (newVersion.minor > oldVersion.minor) {
      return { breaking: false, level: 'minor', compatible: true };
    }

    return { breaking: false, level: 'patch', compatible: true };
  }
}

/**
 * Release management utilities
 */
export class ReleaseManager {
  /**
   * Create promotion request
   */
  static async createPromotionRequest(
    item: VersionableItem,
    toEnvironment: Environment,
    requestedBy: string,
    reason: string,
    changesSummary: string
  ): Promise<PromotionRequest> {
    const currentEnv = EnvironmentManager.getCurrentEnvironment();
    const promotionId = `promo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`Creating promotion request with ID: ${promotionId}`);

    const request: PromotionRequest = {
      id: promotionId,
      itemId: item.id,
      itemType: 'instruction', // This should be determined from item type
      fromEnvironment: currentEnv,
      toEnvironment,
      version: item.version,
      requestedBy,
      requestedAt: new Date().toISOString(),
      reason: SecurityUtils.sanitizeText(reason),
      changesSummary: SecurityUtils.sanitizeText(changesSummary),
      approvals: [],
      status: PromotionStatus.PENDING_REVIEW
    };

    // Auto-populate required approvers
    const requiredRoles = EnvironmentManager.getRequiredApprovers(toEnvironment);
    request.approvals = requiredRoles.map(role => ({
      userId: '', // Will be assigned by system
      userRole: role as any,
      status: 'pending'
    }));

    console.log(`Promotion request created: ${promotionId}, to environment: ${toEnvironment}`);

    return request;
  }

  /**
   * Execute promotion after approvals
   */
  static async executePromotion(request: PromotionRequest): Promise<{
    success: boolean;
    error?: string;
    deploymentId?: string;
  }> {
    try {
      const config = EnvironmentManager.getDeploymentConfig(request.toEnvironment);
      
      // Call deployment API
      const response = await fetch(`${config.apiEndpoint}/deployments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getDeploymentToken(request.toEnvironment)}`
        },
        body: JSON.stringify({
          itemId: request.itemId,
          itemType: request.itemType,
          version: VersionManager.versionToString(request.version),
          environment: request.toEnvironment,
          promotionId: request.id
        })
      });

      if (!response.ok) {
        throw new Error(`Deployment failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Health check if configured
      if (config.healthCheckEndpoint) {
        await this.performHealthCheck(config);
      }

      return {
        success: true,
        deploymentId: result.deploymentId
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown deployment error'
      };
    }
  }

  /**
   * Perform health check after deployment
   */
  private static async performHealthCheck(config: DeploymentConfig): Promise<boolean> {
    try {
      const response = await fetch(`${config.apiEndpoint}${config.healthCheckEndpoint}`);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Rollback deployment
   */
  static async rollbackDeployment(
    itemId: string,
    environment: Environment,
    rollbackVersion: Version
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const config = EnvironmentManager.getDeploymentConfig(environment);
      
      const response = await fetch(`${config.apiEndpoint}/rollbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getDeploymentToken(environment)}`
        },
        body: JSON.stringify({
          itemId,
          version: VersionManager.versionToString(rollbackVersion),
          environment
        })
      });

      if (!response.ok) {
        throw new Error(`Rollback failed: ${response.statusText}`);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown rollback error'
      };
    }
  }
}

/**
 * Get deployment token for environment (implement based on your auth system)
 */
function getDeploymentToken(environment: Environment): string {
  // This should integrate with your authentication system
  return (import.meta.env[`VITE_${environment.toUpperCase()}_DEPLOY_TOKEN`] as string) || '';
}