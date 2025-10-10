# Environment Management & Versioning System

## 🎯 Overview

This document outlines a comprehensive approach for managing prompts, instructions, and collections across multiple environments (Dev, QA, Staging, Production) with proper versioning, approval workflows, and deployment automation.

## 🏗️ Architecture

### Environment Flow
```
Development → QA → Staging → Production
     ↓         ↓       ↓         ↓
   Draft    Alpha    Beta     Stable
```

### Key Components

1. **Versioning System** - Semantic versioning with environment-specific prerelease tags
2. **Approval Workflows** - Role-based approval for promotions
3. **Deployment Pipeline** - Automated deployment with health checks
4. **Rollback Mechanism** - Safe rollback to previous versions
5. **Audit Trail** - Complete history of all changes and deployments

## 🔄 Recommended Versioning Strategy

### Semantic Versioning
```
MAJOR.MINOR.PATCH[-PRERELEASE]

Examples:
- Development: 1.2.3-dev.20241008
- QA: 1.2.3-alpha.1
- Staging: 1.2.3-beta.1
- Production: 1.2.3
```

### Version Increment Rules
- **Development**: Auto-increment patch for each change
- **QA**: Increment minor for feature batches
- **Staging**: Increment minor for release candidates
- **Production**: Increment major for breaking changes, minor for features

## 📋 Implementation Phases

### Phase 1: Basic Environment Support (Weeks 1-2)
**Goal**: Enable environment tagging and basic promotion

**Tasks**:
- [ ] Add environment fields to data models
- [ ] Create environment badge UI components
- [ ] Implement environment-based API routing
- [ ] Add version tracking to all items
- [ ] Basic dev → qa promotion

**Deliverables**:
- Items can be tagged with environments
- Version display in UI
- Manual promotion between dev and qa

### Phase 2: Approval Workflows (Weeks 3-4)
**Goal**: Implement approval system for higher environments

**Tasks**:
- [ ] Create approval request system
- [ ] Build approval UI components
- [ ] Implement notification system (email/Slack)
- [ ] Add basic rollback functionality
- [ ] Role-based permissions

**Deliverables**:
- Full approval workflow for staging/production
- Automated notifications
- One-click rollback functionality

### Phase 3: Advanced Features (Weeks 5-6)
**Goal**: Production-ready deployment pipeline

**Tasks**:
- [ ] Implement scheduled deployments
- [ ] Add comprehensive audit logging
- [ ] Create deployment dashboard
- [ ] Health checks and monitoring
- [ ] A/B testing support

**Deliverables**:
- Production-ready deployment pipeline
- Full audit trail and compliance reporting
- Deployment analytics and monitoring

### Phase 4: Enterprise Features (Weeks 7-8)
**Goal**: Enterprise-grade features

**Tasks**:
- [ ] SOC2/ISO27001 compliance features
- [ ] Automated security scanning
- [ ] Multi-tenant environment support
- [ ] Performance monitoring and alerting
- [ ] Advanced rollback strategies

## 🚀 Quick Start Implementation

### 1. Update Data Models

```typescript
interface VersionedInstruction extends Instruction {
  version: {
    major: number;
    minor: number;
    patch: number;
    prerelease?: string;
  };
  environments: Record<Environment, {
    status: PromotionStatus;
    deployedAt?: string;
    deployedBy?: string;
    version: Version;
  }>;
  isLocked: boolean;
  promotionHistory: PromotionRequest[];
}
```

### 2. Add Environment Management Components

```tsx
import { EnvironmentPipeline, PromotionModal } from './components/environment';

const InstructionDetailPage = ({ instruction }) => {
  return (
    <div>
      <EnvironmentPipeline 
        item={instruction}
        onPromote={handlePromote}
        onRollback={handleRollback}
      />
      {/* existing content */}
    </div>
  );
};
```

### 3. Configure Environment Settings

```typescript
// environment-config.ts
export const ENVIRONMENT_CONFIG = {
  apiEndpoints: {
    development: 'http://localhost:3001/api/v1',
    qa: 'https://qa-api.example.com/api/v1',
    staging: 'https://staging-api.example.com/api/v1',
    production: 'https://api.example.com/api/v1'
  },
  // ... additional config
};
```

## 🔐 Security Considerations

### Environment Isolation
- **Development**: Open access, no approval required
- **QA**: Restricted access, developer approval required
- **Staging**: Limited access, QA lead approval required
- **Production**: Highly restricted, product manager + admin approval

### Data Protection
- Automatic sanitization of all user inputs
- Encryption of sensitive data in staging/production
- Audit logging for all changes
- Role-based access control

### Compliance Features
- SOC2 Type II audit trail
- GDPR data handling compliance
- ISO27001 security controls
- Automated security scanning

## 📊 Monitoring & Analytics

### Key Metrics
- **Deployment Frequency**: How often items are promoted
- **Lead Time**: Time from development to production
- **Failure Rate**: Percentage of failed deployments
- **Recovery Time**: Time to rollback after issues

### Dashboards
- Environment health status
- Pending approvals queue
- Deployment pipeline visualization
- Version history and lineage

## 🚨 Rollback Strategies

### Automatic Rollback Triggers
- Health check failures
- Error rate exceeding threshold
- Performance degradation
- Security vulnerability detection

### Manual Rollback Process
1. Identify issue and decide to rollback
2. Select target rollback version
3. Get required approvals (for production)
4. Execute rollback with health checks
5. Notify stakeholders of completion

## 🔧 Development Workflow

### For Developers
1. Create/modify prompts in development environment
2. Test and iterate locally
3. Submit for QA promotion when ready
4. Address feedback and re-submit if needed

### For QA Team
1. Review promotion requests in QA environment
2. Test functionality and performance
3. Approve or reject with detailed feedback
4. Monitor deployment success

### For Product Managers
1. Review staging deployments for business impact
2. Schedule production deployments
3. Monitor production health post-deployment
4. Coordinate rollbacks if issues arise

## 📚 Best Practices

### Version Management
- Use semantic versioning consistently
- Tag major breaking changes clearly
- Maintain version compatibility matrices
- Document all changes in release notes

### Deployment Process
- Always test in lower environments first
- Use feature flags for gradual rollouts
- Monitor key metrics during deployments
- Have rollback plan ready before deploying

### Collaboration
- Clear communication in promotion requests
- Detailed change summaries for reviewers
- Timely feedback on approval requests
- Post-deployment health monitoring

## 🛠️ Tools Integration

### Recommended Integrations
- **Slack**: Deployment notifications and approvals
- **Jira**: Link promotions to tickets
- **DataDog/NewRelic**: Performance monitoring
- **Sentry**: Error tracking and alerting
- **GitHub**: Source code integration

### API Webhooks
```typescript
// Example webhook for deployment notifications
POST /webhooks/deployment
{
  "event": "deployment.completed",
  "environment": "production",
  "item": { "id": "...", "type": "instruction" },
  "version": "1.2.3",
  "deployedBy": "user@example.com",
  "timestamp": "2024-10-08T12:00:00Z"
}
```

This comprehensive system provides enterprise-grade environment management with proper versioning, security, and compliance features while maintaining developer productivity and system reliability.