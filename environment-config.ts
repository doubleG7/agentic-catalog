/**
 * Environment Configuration
 * 
 * This file contains the comprehensive setup for multi-environment
 * deployment with versioning for prompts, instructions, and collections.
 */

export const ENVIRONMENT_CONFIG = {
  // Environment-specific API endpoints
  apiEndpoints: {
    development: process.env.VITE_DEV_API_URL || 'http://localhost:3001/api/v1',
    qa: process.env.VITE_QA_API_URL || 'https://qa-api.yourcompany.com/api/v1',
    staging: process.env.VITE_STAGING_API_URL || 'https://staging-api.yourcompany.com/api/v1',
    production: process.env.VITE_PROD_API_URL || 'https://api.yourcompany.com/api/v1'
  },

  // Approval workflow configuration
  approvalWorkflows: {
    development: {
      required: false,
      approvers: [],
      autoPromote: true
    },
    qa: {
      required: true,
      approvers: ['developer', 'qa_lead'],
      autoPromote: false,
      requiresTests: true
    },
    staging: {
      required: true,
      approvers: ['qa_lead', 'product_manager'],
      autoPromote: false,
      requiresTests: true,
      requiresDocumentation: true
    },
    production: {
      required: true,
      approvers: ['product_manager', 'admin'],
      autoPromote: false,
      requiresTests: true,
      requiresDocumentation: true,
      requiresSecurityReview: true,
      scheduledDeploymentOnly: true
    }
  },

  // Versioning strategy
  versioning: {
    strategy: 'semantic', // semantic | timestamp | custom
    autoIncrement: {
      development: 'patch',
      qa: 'minor',
      staging: 'minor',
      production: 'major'
    },
    prereleaseLabels: {
      development: 'dev',
      qa: 'alpha',
      staging: 'beta',
      production: null
    }
  },

  // Rollback policies
  rollbackPolicies: {
    development: {
      enabled: true,
      automatic: false,
      retentionDays: 7
    },
    qa: {
      enabled: true,
      automatic: true,
      retentionDays: 30,
      rollbackOnFailure: true
    },
    staging: {
      enabled: true,
      automatic: true,
      retentionDays: 90,
      rollbackOnFailure: true,
      requiresApproval: false
    },
    production: {
      enabled: true,
      automatic: false,
      retentionDays: 365,
      rollbackOnFailure: false,
      requiresApproval: true,
      emergencyRollbackContacts: ['admin', 'product_manager']
    }
  },

  // Notification channels
  notifications: {
    development: ['dev-slack'],
    qa: ['qa-slack', 'dev-slack'],
    staging: ['product-slack', 'qa-slack'],
    production: ['prod-alerts', 'product-slack', 'exec-notifications']
  },

  // Security policies
  security: {
    development: {
      requiresSecurityScan: false,
      allowDirectEdit: true,
      requiresApproval: false
    },
    qa: {
      requiresSecurityScan: true,
      allowDirectEdit: false,
      requiresApproval: true,
      sensitiveDataChecks: true
    },
    staging: {
      requiresSecurityScan: true,
      allowDirectEdit: false,
      requiresApproval: true,
      sensitiveDataChecks: true,
      complianceChecks: true
    },
    production: {
      requiresSecurityScan: true,
      allowDirectEdit: false,
      requiresApproval: true,
      sensitiveDataChecks: true,
      complianceChecks: true,
      auditLogging: true,
      encryptionRequired: true
    }
  }
};

/**
 * Recommended Implementation Strategy
 */
export const IMPLEMENTATION_STRATEGY = {
  // Phase 1: Basic Environment Support (Week 1-2)
  phase1: {
    tasks: [
      'Add environment field to existing types',
      'Create basic environment badge UI',
      'Implement environment-based API routing',
      'Add version tracking to items'
    ],
    deliverables: [
      'Items can be tagged with environments',
      'Basic promotion between dev -> qa',
      'Version display in UI'
    ]
  },

  // Phase 2: Approval Workflows (Week 3-4)
  phase2: {
    tasks: [
      'Implement approval request system',
      'Create approval UI components',
      'Add notification system',
      'Implement basic rollback'
    ],
    deliverables: [
      'Full approval workflow for staging/prod',
      'Email/Slack notifications',
      'One-click rollback functionality'
    ]
  },

  // Phase 3: Advanced Features (Week 5-6)
  phase3: {
    tasks: [
      'Implement scheduled deployments',
      'Add comprehensive audit logging',
      'Create deployment dashboard',
      'Implement A/B testing support'
    ],
    deliverables: [
      'Production-ready deployment pipeline',
      'Full audit trail',
      'Deployment analytics',
      'Feature flagging for gradual rollouts'
    ]
  },

  // Phase 4: Enterprise Features (Week 7-8)
  phase4: {
    tasks: [
      'Add compliance reporting',
      'Implement advanced security scanning',
      'Create multi-tenant support',
      'Add performance monitoring'
    ],
    deliverables: [
      'SOC2/ISO27001 compliance features',
      'Automated security validation',
      'Customer-specific environments',
      'Real-time performance metrics'
    ]
  }
};

/**
 * Database Schema Changes Needed
 */
export const SCHEMA_CHANGES = {
  instructions: {
    new_fields: [
      'version_major INTEGER DEFAULT 1',
      'version_minor INTEGER DEFAULT 0',
      'version_patch INTEGER DEFAULT 0',
      'version_prerelease VARCHAR(50)',
      'environment VARCHAR(20) DEFAULT "development"',
      'promotion_status VARCHAR(20) DEFAULT "draft"',
      'locked_at TIMESTAMP NULL',
      'locked_by VARCHAR(100) NULL',
      'lock_reason TEXT NULL',
      'parent_version_id UUID NULL',
      'deployment_history JSONB DEFAULT "[]"'
    ],
    indexes: [
      'CREATE INDEX idx_instructions_version ON instructions(version_major, version_minor, version_patch)',
      'CREATE INDEX idx_instructions_environment ON instructions(environment)',
      'CREATE INDEX idx_instructions_status ON instructions(promotion_status)'
    ]
  },

  new_tables: [
    `CREATE TABLE promotion_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      item_id UUID NOT NULL,
      item_type VARCHAR(20) NOT NULL,
      from_environment VARCHAR(20) NOT NULL,
      to_environment VARCHAR(20) NOT NULL,
      version_major INTEGER NOT NULL,
      version_minor INTEGER NOT NULL,
      version_patch INTEGER NOT NULL,
      version_prerelease VARCHAR(50),
      requested_by VARCHAR(100) NOT NULL,
      requested_at TIMESTAMP DEFAULT NOW(),
      reason TEXT NOT NULL,
      changes_summary TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'pending_review',
      approved_at TIMESTAMP NULL,
      deployed_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`,

    `CREATE TABLE approvals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      promotion_request_id UUID NOT NULL REFERENCES promotion_requests(id),
      user_id VARCHAR(100) NOT NULL,
      user_role VARCHAR(50) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      comments TEXT,
      approved_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )`,

    `CREATE TABLE deployment_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      item_id UUID NOT NULL,
      item_type VARCHAR(20) NOT NULL,
      environment VARCHAR(20) NOT NULL,
      version_major INTEGER NOT NULL,
      version_minor INTEGER NOT NULL,
      version_patch INTEGER NOT NULL,
      version_prerelease VARCHAR(50),
      deployed_by VARCHAR(100) NOT NULL,
      deployed_at TIMESTAMP DEFAULT NOW(),
      rollback_version_id UUID NULL,
      deployment_duration_ms INTEGER,
      health_check_passed BOOLEAN DEFAULT FALSE,
      metadata JSONB DEFAULT '{}'
    )`
  ]
};

/**
 * API Endpoints to Implement
 */
export const API_ENDPOINTS = {
  // Version management
  'GET /api/v1/items/:id/versions': 'Get version history',
  'POST /api/v1/items/:id/versions': 'Create new version',
  'PUT /api/v1/items/:id/lock': 'Lock item for editing',
  'DELETE /api/v1/items/:id/lock': 'Unlock item',

  // Promotion workflow
  'POST /api/v1/promotions': 'Create promotion request',
  'GET /api/v1/promotions': 'List promotion requests',
  'PUT /api/v1/promotions/:id/approve': 'Approve promotion',
  'PUT /api/v1/promotions/:id/reject': 'Reject promotion',
  'POST /api/v1/promotions/:id/deploy': 'Execute deployment',

  // Environment management
  'GET /api/v1/environments/:env/items': 'Get items in environment',
  'POST /api/v1/environments/:env/deploy': 'Deploy to environment',
  'POST /api/v1/environments/:env/rollback': 'Rollback deployment',
  'GET /api/v1/environments/:env/health': 'Environment health check',

  // Release management
  'POST /api/v1/releases': 'Create release',
  'GET /api/v1/releases': 'List releases',
  'POST /api/v1/releases/:id/deploy': 'Deploy release',
  'GET /api/v1/releases/:id/status': 'Get release status'
};

export default {
  ENVIRONMENT_CONFIG,
  IMPLEMENTATION_STRATEGY,
  SCHEMA_CHANGES,
  API_ENDPOINTS
};