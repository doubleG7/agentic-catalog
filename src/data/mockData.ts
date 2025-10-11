import { Instruction, Prompt, HealthStatus, InstructionCategory, PromptCategory } from '../types';

// Mock Instructions Data
export const mockInstructions: Instruction[] = [
  {
    id: '1',
    title: 'Business Strategy Framework',
    description: 'A comprehensive framework for developing and executing business strategies in competitive markets.',
    content: `# Business Strategy Framework

## Overview
This framework provides a structured approach to developing robust business strategies that drive sustainable growth and competitive advantage.

## Key Components
1. **Market Analysis**
   - Competitor landscape assessment
   - Customer needs identification
   - Market size and growth potential

2. **Strategic Positioning**
   - Value proposition definition
   - Competitive differentiation
   - Target market segmentation

3. **Execution Planning**
   - Resource allocation
   - Timeline development
   - Success metrics definition

## Implementation Steps
1. Conduct thorough market research
2. Define strategic objectives
3. Develop action plans
4. Execute with regular monitoring
5. Adjust based on performance data

## Success Metrics
- Market share growth
- Revenue increase
- Customer satisfaction scores
- Competitive positioning improvement`,
    category: InstructionCategory.BUSINESS,
    tags: ['strategy', 'business-planning', 'market-analysis'],
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-09-20T14:30:00Z',
    isPublic: true,
    relatedInstructions: ['2'],
    rating: {
      average: 4.5,
      count: 12,
      userRating: 5
    }
  },
  {
    id: '2',
    title: 'Product Requirements Document Template',
    description: 'Standard template for creating comprehensive product requirements documents.',
    content: `# Product Requirements Document Template

## Product Overview
- **Product Name**: [Name]
- **Version**: [Version]
- **Owner**: [Product Manager]
- **Date**: [Current Date]

## Problem Statement
Clearly define the problem this product solves.

## Goals and Objectives
- Primary goals
- Secondary goals
- Success metrics

## User Stories
- As a [user type], I want [functionality] so that [benefit]

## Technical Requirements
- Performance requirements
- Security requirements
- Integration requirements

## Design Requirements
- UI/UX guidelines
- Accessibility requirements
- Responsive design needs`,
    category: InstructionCategory.PRODUCT,
    tags: ['product-management', 'documentation', 'requirements'],
    createdAt: '2025-09-10T09:15:00Z',
    updatedAt: '2025-09-18T16:45:00Z',
    isPublic: true,
    relatedInstructions: ['1'],
    rating: {
      average: 3.8,
      count: 7,
      userRating: 4
    }
  },
  {
    id: '3',
    title: 'Code Review Checklist',
    description: 'Comprehensive checklist for conducting thorough code reviews in software development.',
    content: `# Code Review Checklist

## Code Quality
- [ ] Code follows established style guidelines
- [ ] Functions are well-named and focused
- [ ] Code is properly commented
- [ ] No obvious bugs or logic errors

## Architecture & Design
- [ ] Code follows SOLID principles
- [ ] Proper separation of concerns
- [ ] Appropriate design patterns used
- [ ] No code duplication

## Testing
- [ ] Unit tests are comprehensive
- [ ] Integration tests cover key workflows
- [ ] Edge cases are handled
- [ ] Test coverage meets requirements

## Security
- [ ] Input validation is implemented
- [ ] No hardcoded credentials
- [ ] Proper authentication/authorization
- [ ] SQL injection prevention

## Performance
- [ ] No obvious performance bottlenecks
- [ ] Database queries are optimized
- [ ] Caching implemented where appropriate
- [ ] Memory usage is reasonable`,
    category: InstructionCategory.SOFTWARE_ENGINEERING,
    tags: ['code-review', 'quality-assurance', 'best-practices'],
    createdAt: '2024-01-12T11:30:00Z',
    updatedAt: '2024-01-22T13:20:00Z',
    isPublic: true,
    relatedInstructions: ['5']
  },
  {
    id: '4',
    title: 'Agile Sprint Planning Guide',
    description: 'Step-by-step guide for effective sprint planning in agile development teams.',
    content: `# Agile Sprint Planning Guide

## Pre-Planning Preparation
- Review product backlog
- Ensure user stories are refined
- Check team capacity
- Gather stakeholder feedback

## Sprint Planning Meeting
### Part 1: What will we deliver?
- Review sprint goal
- Select backlog items
- Estimate story points
- Confirm team commitment

### Part 2: How will we deliver it?
- Break down user stories into tasks
- Identify dependencies
- Assign initial task ownership
- Plan daily standups

## Sprint Artifacts
- Sprint backlog
- Sprint goal statement
- Task breakdown
- Definition of done

## Common Pitfalls to Avoid
- Over-committing team capacity
- Unclear acceptance criteria
- Missing dependencies
- Inadequate task breakdown`,
    category: InstructionCategory.PROJECT_MANAGEMENT,
    tags: ['agile', 'sprint-planning', 'project-management'],
    createdAt: '2025-09-08T14:00:00Z',
    updatedAt: '2025-09-25T10:15:00Z',
    isPublic: true,
    relatedInstructions: ['2']
  },
  {
    id: '5',
    title: 'API Design Best Practices',
    description: 'Guidelines for designing robust, scalable, and maintainable REST APIs.',
    content: `# API Design Best Practices

## RESTful Principles
- Use HTTP methods appropriately (GET, POST, PUT, DELETE)
- Design intuitive URL structures
- Return appropriate HTTP status codes
- Use consistent naming conventions

## Resource Design
- Use nouns for resource names
- Implement hierarchical relationships
- Support filtering, sorting, and pagination
- Version your APIs properly

## Error Handling
- Return meaningful error messages
- Use consistent error response format
- Include error codes for programmatic handling
- Log errors appropriately

## Security
- Implement proper authentication
- Use HTTPS for all endpoints
- Validate and sanitize input
- Implement rate limiting

## Documentation
- Provide comprehensive API documentation
- Include request/response examples
- Document error codes and messages
- Keep documentation up-to-date`,
    category: InstructionCategory.DEVELOPMENT,
    tags: ['api-design', 'rest', 'backend-development'],
    createdAt: '2025-09-14T16:20:00Z',
    updatedAt: '2025-09-21T12:40:00Z',
    isPublic: true,
    relatedInstructions: ['3']
  },
  {
    id: '6',
    title: 'UI/UX Design Principles',
    description: 'Fundamental principles for creating intuitive and user-friendly interfaces.',
    content: `# UI/UX Design Principles

## Core Principles
1. **Clarity**: Make interfaces easy to understand
2. **Consistency**: Maintain uniform design patterns
3. **Efficiency**: Minimize user effort
4. **Forgiveness**: Allow users to recover from errors

## User-Centered Design
- Understand your users' needs
- Create user personas and journey maps
- Conduct usability testing
- Iterate based on feedback

## Visual Hierarchy
- Use typography to guide attention
- Implement consistent spacing
- Apply color purposefully
- Create clear information architecture

## Accessibility
- Follow WCAG guidelines
- Ensure keyboard navigation
- Provide alt text for images
- Use sufficient color contrast

## Mobile-First Design
- Design for small screens first
- Use responsive design patterns
- Optimize touch interactions
- Consider thumb-friendly navigation`,
    category: InstructionCategory.DESIGN,
    tags: ['ui-design', 'ux-design', 'user-experience'],
    createdAt: '2025-09-16T09:45:00Z',
    updatedAt: '2026-09-23T15:30:00Z',
    isPublic: false,
    relatedInstructions: ['4']
  },
  {
    id: '7',
    title: 'Gemini Gem Development Guide',
    description: 'Comprehensive guide for creating and deploying Google Gemini AI gems with knowledge document integration.',
    content: `# Gemini Gem Development Guide

## Overview
This guide covers the complete process of developing, configuring, and deploying Google Gemini AI gems with integrated knowledge documents and custom capabilities.

## Prerequisites
- Google Cloud Platform account with Gemini API access
- Node.js 18+ or Python 3.8+
- Gemini API key and project setup
- Knowledge documents prepared and accessible

## Knowledge Document Integration

### Document Location Setup
1. **Local File System**
   - Store documents in \`./knowledge/docs/\`
   - Supported formats: PDF, DOCX, TXT, MD, HTML
   - Organize by categories and topics

2. **Cloud Storage Integration**
   - Google Cloud Storage buckets
   - AWS S3 buckets
   - Azure Blob Storage
   - Configure access credentials

3. **Database Integration**
   - Vector databases (Pinecone, Weaviate)
   - Traditional databases with full-text search
   - Elasticsearch or Solr integration

This guide provides a complete foundation for building production-ready Gemini gems with flexible knowledge document integration and robust deployment strategies.`,
    category: InstructionCategory.DEVELOPMENT,
    tags: ['gemini', 'ai-integration', 'google-cloud', 'knowledge-management', 'gem-development'],
    createdAt: '2025-10-07T10:00:00Z',
    updatedAt: '2025-10-07T10:00:00Z',
    isPublic: true,
    relatedInstructions: ['3', '5'],
    variables: [
      {
        name: 'gemName',
        type: 'text',
        required: true,
        defaultValue: 'my-gemini-gem',
        description: 'Name for your Gemini gem project'
      },
      {
        name: 'knowledgeLocationType',
        type: 'select',
        required: true,
        options: ['local', 'gcs', 's3', 'azure-blob', 'database'],
        defaultValue: 'local',
        description: 'Type of storage for knowledge documents'
      },
      {
        name: 'knowledgePath',
        type: 'text',
        required: true,
        defaultValue: './knowledge/docs/',
        description: 'Path or connection string for knowledge documents'
      },
      {
        name: 'documentFormats',
        type: 'text',
        required: false,
        defaultValue: 'pdf,docx,txt,md',
        description: 'Comma-separated list of supported document formats'
      },
      {
        name: 'geminiModel',
        type: 'select',
        required: true,
        options: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'],
        defaultValue: 'gemini-1.5-pro',
        description: 'Gemini model to use for the gem'
      },
      {
        name: 'enableMultiModal',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Enable multi-modal support (text, image, audio, video)'
      }
    ],
    metadata: {
      author: 'AI Development Team',
      version: '1.0',
      difficulty: 'advanced',
      estimatedTime: 180,
      prerequisites: ['Google Cloud Platform account', 'Gemini API access', 'Node.js or Python experience', 'Basic understanding of AI/ML concepts'],
      outputs: ['Configured Gemini gem project', 'Knowledge document integration', 'Deployment-ready gem', 'Testing and monitoring setup']
    }
  },
  {
    id: '8',
    title: 'ERP Construction Guidelines - React UI Development',
    description: 'Comprehensive guidelines for developing React applications following Trimble UI standards for ERP construction management systems.',
    content: `# ERP Construction Guidelines - React UI Development

## Project Structure
Follow this standardized project structure for all React ERP applications:

/src
  /api        ← API service clients (Axios-based)
  /components ← Shared UI components (Buttons, Forms, Modals)
  /pages      ← Route-level views (Employees, TimeEntries, Payroll, etc.)
  /hooks      ← Custom React hooks
  /types      ← TypeScript interfaces and DTOs
  /utils      ← Helper functions
  /styles     ← Tailwind config and global styles

## Required Dependencies
Ensure your package.json includes these essential packages:

{
  "dependencies": {
    "dotenv": "^16.5.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "framer-motion": "^12.23.16",
    "lucide-react": "^0.510.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}

## UI/UX & Tailwind Guidelines

### Design Principles
- **Utility-First Approach**: Use Tailwind utility classes for layout, spacing, and colors
- **Responsive Design**: Apply Tailwind's breakpoint system (sm:, md:, lg:, xl:)
- **Modal Workflows**: Use modal dialogs or slide-ins for create/edit flows
- **Visual Clarity**: Prefer dropdowns, toggles, and status badges for clear UX

### Component Standards
- All components should be TypeScript-based with proper prop interfaces
- Use consistent spacing with Tailwind's spacing scale
- Implement loading states and error boundaries
- Follow accessibility guidelines (ARIA labels, keyboard navigation)

## API Integration Standards

### HTTP Client Configuration
- **Centralized Setup**: Use Axios with a centralized \`api.ts\` or \`axiosInstance.ts\`
- **Base Configuration**: Configure base URL and request/response interceptors
- **Type Safety**: Use TypeScript interfaces for all request/response bodies

### Error Handling
- **User-Friendly Messages**: Handle errors with toasts, banners, or modals
- **Form Validation**: Include both client-side validation and server error handling
- **Loading Indicators**: Show loading states for all async operations
- **Retry Logic**: Implement retry mechanisms for failed requests

## Security and Identity

### Authentication
- **Trimble ID Integration**: Use Trimble ID for authentication
- **Token Management**: Store access tokens in secure context (not localStorage)
- **Interceptor Attachment**: Attach auth tokens via Axios interceptors

### Data Security
- **Sensitive Data**: Never store sensitive employee data (SSN, bank info) in browser memory
- **Secure Storage**: Use secure, encrypted storage for any persistent data
- **HTTPS Only**: All API communications must use HTTPS
- **Input Sanitization**: Sanitize all user inputs to prevent XSS attacks

## Routing & Navigation

### Router Configuration
- **React Router DOM**: Use react-router-dom with nested layout pattern
- **Page Mapping**: Each component under \`/pages\` maps to a specific route
- **Consistent Layout**: Use shared \`Layout.tsx\` with header/sidebar/navigation

## Testing & Development Experience

### Code Quality
- **ESLint & Prettier**: Use for consistent code formatting and linting
- **TypeScript Strict Mode**: Enable strict TypeScript configuration
- **Hot Module Reloading**: Enable HMR for faster development iteration

### Testing Strategy
- **React Testing Library**: Use for component testing
- **Unit Tests**: Cover core business logic and utility functions
- **Integration Tests**: Test API integration and user workflows
- **Accessibility Testing**: Include a11y testing in your test suite

## Optional Enhancements

### Performance Optimization
- **React Query/SWR**: Implement for caching, revalidation, and stale state handling
- **Code Splitting**: Use lazy loading for route-based code splitting
- **Bundle Analysis**: Regularly analyze bundle size and optimize

### Monitoring & Diagnostics
- **Telemetry**: Use OpenTelemetry JS SDK or LogRocket for session diagnostics
- **Error Tracking**: Implement error boundary and error tracking service
- **Performance Monitoring**: Track Core Web Vitals and user experience metrics

### Data Management
- **CSV Import/Export**: Add support for tax brackets, reports, and employee data
- **Bulk Operations**: Implement bulk data operations for efficiency
- **Data Validation**: Include robust client and server-side validation

### Feature Management
- **Feature Flags**: Use feature flags to toggle UI modules in dev/test environments
- **Environment Configuration**: Proper environment-based configuration management
- **Progressive Enhancement**: Implement features that work across different capability levels

## Best Practices Checklist

### Before Development
- [ ] Project structure follows standard guidelines
- [ ] Required dependencies are installed and configured
- [ ] TypeScript configuration is set up with strict mode
- [ ] API client is properly configured with interceptors

### During Development
- [ ] Components follow TypeScript interface patterns
- [ ] All forms include proper validation and error handling
- [ ] Responsive design is implemented using Tailwind breakpoints
- [ ] Loading states and error boundaries are in place
- [ ] Security best practices are followed for data handling

### Before Deployment
- [ ] All tests pass (unit, integration, accessibility)
- [ ] Code is properly linted and formatted
- [ ] Bundle size is optimized
- [ ] Security audit is completed
- [ ] Performance metrics meet requirements

## Troubleshooting Common Issues

### Build Issues
- Ensure all TypeScript interfaces are properly exported
- Check for circular dependencies in imports
- Verify environment variables are properly configured

### Runtime Issues
- Check network requests in browser dev tools
- Verify authentication tokens are properly attached
- Ensure error boundaries are catching and displaying errors properly

### Performance Issues
- Use React DevTools Profiler to identify bottlenecks
- Implement proper memoization for expensive computations
- Optimize re-renders with React.memo and useMemo

This guide ensures consistent, secure, and maintainable React applications for ERP construction management systems following Trimble's standards.`,
    category: InstructionCategory.DEVELOPMENT,
    tags: ['react', 'erp', 'construction', 'trimble', 'ui-guidelines', 'typescript', 'tailwind'],
    createdAt: '2025-10-07T11:00:00Z',
    updatedAt: '2025-10-07T11:00:00Z',
    isPublic: true,
    relatedInstructions: ['3', '5', '6'],
    variables: [
      {
        name: 'projectName',
        type: 'text',
        required: true,
        defaultValue: 'erp-construction-app',
        description: 'Name of the ERP construction project'
      },
      {
        name: 'apiBaseUrl',
        type: 'text',
        required: true,
        defaultValue: 'https://api.construction.trimble.com',
        description: 'Base URL for the construction API'
      },
      {
        name: 'authProvider',
        type: 'select',
        required: true,
        options: ['trimble-id', 'oauth2', 'jwt'],
        defaultValue: 'trimble-id',
        description: 'Authentication provider to use'
      },
      {
        name: 'includeTestSetup',
        type: 'boolean',
        required: false,
        defaultValue: 'true',
        description: 'Include testing configuration and examples'
      },
      {
        name: 'enableTelemetry',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Enable telemetry and monitoring setup'
      }
    ],
    metadata: {
      author: 'Trimble Construction Team',
      version: '1.0',
      difficulty: 'intermediate',
      estimatedTime: 240,
      prerequisites: ['React experience', 'TypeScript knowledge', 'Tailwind CSS familiarity', 'Basic understanding of ERP systems'],
      outputs: ['Production-ready React ERP application', 'Proper project structure', 'Security implementation', 'Testing setup']
    }
  }
];

// Mock Prompts Data
export const mockPrompts: Prompt[] = [
  {
    id: '1',
    title: 'React Component Generator',
    description: 'Generate React functional components with TypeScript and best practices.',
    content: `Generate a React functional component with the following specifications:

Component Name: {{componentName}}
Props Interface: {{propsInterface}}
Styling Framework: {{stylingFramework}}
State Management: {{stateManagement}}

Requirements:
1. Use TypeScript with proper typing
2. Include JSDoc comments for the component and its props
3. Follow React best practices for hooks and state management
4. Include basic accessibility attributes

Additional Features:
- {{additionalFeatures}}

Please generate clean, production-ready code with proper formatting and comments.`,
    category: PromptCategory.CODE_GENERATION,
    tags: ['react', 'typescript', 'component', 'frontend'],
    createdAt: '2025-09-11T13:15:00Z',
    updatedAt: '2025-09-19T11:25:00Z',
    isPublic: true,
    relatedPrompts: ['2'],
    rating: {
      average: 4.7,
      count: 23,
      userRating: 5
    },
    variables: [
      { name: 'componentName', type: 'text', required: true },
      { name: 'propsInterface', type: 'text', required: false },
      { name: 'stylingFramework', type: 'select', required: true, options: ['Tailwind CSS', 'Styled Components', 'CSS Modules', 'Emotion'] },
      { name: 'stateManagement', type: 'select', required: false, options: ['useState', 'useReducer', 'Zustand', 'Redux'] },
      { name: 'additionalFeatures', type: 'text', required: false }
    ]
  },
  {
    id: '2',
    title: 'API Documentation Writer',
    description: 'Generate comprehensive API documentation for REST endpoints.',
    content: `Create detailed API documentation for the following endpoint:

Endpoint: {{httpMethod}} {{endpointPath}}
Description: {{endpointDescription}}
Authentication: {{authType}}

Please include:

## Endpoint Details
- HTTP Method: {{httpMethod}}
- URL: {{endpointPath}}
- Description: {{endpointDescription}}
- Authentication Required: {{authType}}

## Request Parameters
{{requestParameters}}

## Request Body (if applicable)
{{requestBody}}

## Response Format
{{responseFormat}}

## Response Codes
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Example Request
\`\`\`
{{exampleRequest}}
\`\`\`

## Example Response
\`\`\`json
{{exampleResponse}}
\`\`\`

## Error Handling
{{errorHandling}}

## Rate Limiting
{{rateLimiting}}`,
    category: PromptCategory.DOCUMENTATION,
    tags: ['api', 'documentation', 'rest', 'backend'],
    createdAt: '2025-09-13T10:30:00Z',
    updatedAt: '2025-09-20T14:50:00Z',
    isPublic: true,
    relatedPrompts: ['1'],
    variables: [
      { name: 'httpMethod', type: 'select', required: true, options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
      { name: 'endpointPath', type: 'text', required: true },
      { name: 'endpointDescription', type: 'text', required: true },
      { name: 'authType', type: 'select', required: true, options: ['None', 'API Key', 'Bearer Token', 'Basic Auth'] },
      { name: 'requestParameters', type: 'text', required: false },
      { name: 'requestBody', type: 'text', required: false },
      { name: 'responseFormat', type: 'text', required: true },
      { name: 'exampleRequest', type: 'text', required: false },
      { name: 'exampleResponse', type: 'text', required: true },
      { name: 'errorHandling', type: 'text', required: false },
      { name: 'rateLimiting', type: 'text', required: false }
    ]
  },
  {
    id: '3',
    title: 'Knowledge Document Location Picker',
    description: 'Generate a flexible system for selecting and configuring knowledge document storage locations.',
    content: `Create a knowledge document location picker system for {{applicationName}} that supports multiple storage types.

Supported Storage Types:
- {{storageTypes}}
Requirements:
- {{requirements}}
Security Level: {{securityLevel}}

Generate complete implementation with error handling and security best practices.`,
    category: PromptCategory.CODE_GENERATION,
    tags: ['document-management', 'storage-integration', 'knowledge-base', 'file-systems'],
    createdAt: '2025-10-07T09:55:00Z',
    updatedAt: '2025-10-07T09:55:00Z',
    isPublic: true,
    relatedPrompts: ['3', '1'],
    variables: [
      {
        name: 'applicationName',
        type: 'text',
        required: true,
        defaultValue: 'Knowledge Management System'
      },
      {
        name: 'storageTypes',
        type: 'text',
        required: true,
        defaultValue: 'Local File System, Google Cloud Storage, AWS S3, Azure Blob Storage, Database'
      },
      {
        name: 'requirements',
        type: 'text',
        required: true,
        defaultValue: 'Multi-format support, Real-time sync, Search capabilities'
      },
      {
        name: 'securityLevel',
        type: 'select',
        required: true,
        options: ['Basic', 'Standard', 'High', 'Enterprise'],
        defaultValue: 'Standard'
      }
    ]
  },
  {
    id: '17',
    title: 'Code Analysis & Review',
    description: 'Perform comprehensive code analysis and provide improvement suggestions.',
    content: `Please analyze the following code and provide a comprehensive review:

Programming Language: {{language}}
Code Purpose: {{codePurpose}}
Framework/Library: {{framework}}

Please provide analysis in the following areas:

## Code Quality Assessment
- Code readability and organization
- Naming conventions
- Code structure and modularity
- Comment quality and documentation

## Performance Analysis
- Identify potential performance bottlenecks
- Memory usage concerns
- Algorithm efficiency
- Database query optimization (if applicable)

## Security Review
- Input validation
- Authentication/authorization issues
- Data sanitization
- Potential vulnerabilities

## Best Practices Compliance
- Framework-specific best practices
- Design patterns usage
- Error handling
- Testing considerations

## Improvement Suggestions
Provide specific, actionable recommendations for:
1. Code refactoring opportunities
2. Performance optimizations
3. Security enhancements
4. Maintainability improvements

Rate the overall code quality on a scale of 1-10 and explain the rating.`,
    category: PromptCategory.ANALYSIS,
    tags: ['code-review', 'analysis', 'quality-assurance', 'refactoring'],
    createdAt: '2025-09-17T15:20:00Z',
    updatedAt: '2025-09-24T09:10:00Z',
    isPublic: true,
    relatedPrompts: ['1'],
    variables: [
      { name: 'language', type: 'select', required: true, options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP'] },
      { name: 'codePurpose', type: 'text', required: true },
      { name: 'framework', type: 'text', required: false },
      { name: 'codeBlock', type: 'text', required: true }
    ]
  },
  {
    id: '4',
    title: 'Competitive Analysis',
    description: 'Analyze the competitive landscape for products in specific industries and markets.',
    content: `Act as a market research analyst. Analyze the competitive landscape for {{product}} in the {{industry}} space.

Context:
- Target market: {{targetMarket}}
- Geographic focus: {{geographicFocus}}
- Budget range: {{budgetRange}}

Please provide:
1. Top 5-7 direct competitors with their key features, pricing, and market position
2. Indirect competitors or alternative solutions
3. Competitive advantages and gaps in the market
4. SWOT analysis for each major competitor
5. Market share estimates (if available)
6. Recent competitor moves (funding, features, pivots)

Format as a comparison table followed by strategic insights.`,
    category: PromptCategory.PLANNING,
    tags: ['market-research', 'competitive-analysis', 'strategy'],
    createdAt: '2025-10-04T10:00:00Z',
    updatedAt: '2025-10-04T10:00:00Z',
    isPublic: true,
    relatedPrompts: ['5', '6'],
    variables: [
      { name: 'product', type: 'text', required: true },
      { name: 'industry', type: 'text', required: true },
      { name: 'targetMarket', type: 'text', required: true },
      { name: 'geographicFocus', type: 'text', required: true },
      { name: 'budgetRange', type: 'text', required: true }
    ]
  },
  {
    id: '5',
    title: 'Market Trends Research',
    description: 'Research and analyze current market trends impacting product development.',
    content: `You are a strategic business analyst. Research and analyze current trends in {{industry}} that would impact a product focused on {{problemSolution}}.

Please cover:
1. Emerging technologies and their adoption rates
2. Consumer behavior shifts (last 2-3 years)
3. Regulatory changes or compliance requirements
4. Economic factors affecting the market
5. Industry growth projections (3-5 years)
6. Key influencers and thought leaders in this space

For each trend, indicate:
- Impact level (High/Medium/Low)
- Timeline (Immediate/Near-term/Long-term)
- Opportunity or threat assessment`,
    category: PromptCategory.RESEARCH,
    tags: ['market-research', 'trends-analysis', 'strategic-planning'],
    createdAt: '2025-10-04T10:05:00Z',
    updatedAt: '2025-10-04T10:05:00Z',
    isPublic: true,
    relatedPrompts: ['4', '6'],
    variables: [
      { name: 'industry', type: 'text', required: true },
      { name: 'problemSolution', type: 'text', required: true }
    ]
  },
  {
    id: '6',
    title: 'Gemini API Integration',
    description: 'Generate code for integrating Google Gemini API with knowledge base and custom tools.',
    content: `Create a complete Gemini API integration for {{projectType}} with knowledge document support.

Project Configuration:
- Programming Language: {{programmingLanguage}}
- Knowledge Location: {{knowledgeLocation}}
- Document Types: {{documentTypes}}
- Gemini Model: {{geminiModel}}
- Authentication Method: {{authMethod}}

Ensure code is production-ready with proper logging, monitoring, and scalability considerations.`,
    category: PromptCategory.CODE_GENERATION,
    tags: ['gemini-api', 'ai-integration', 'knowledge-base', 'google-cloud'],
    createdAt: '2025-10-07T10:00:00Z',
    updatedAt: '2025-10-07T10:00:00Z',
    isPublic: true,
    relatedPrompts: ['1', '2'],
    variables: [
      {
        name: 'projectType',
        type: 'select',
        required: true,
        options: ['Web Application', 'Mobile App', 'CLI Tool', 'API Service', 'Desktop App']
      },
      {
        name: 'programmingLanguage',
        type: 'select', 
        required: true,
        options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'C#']
      },
      {
        name: 'knowledgeLocation',
        type: 'select',
        required: true,
        options: ['Local File System', 'Google Cloud Storage', 'AWS S3', 'Azure Blob Storage', 'Database', 'Multi-Location']
      },
      {
        name: 'documentTypes',
        type: 'text',
        required: true,
        defaultValue: 'PDF, DOCX, TXT, MD'
      },
      {
        name: 'geminiModel',
        type: 'select',
        required: true,
        options: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro', 'gemini-1.5-pro-vision'],
        defaultValue: 'gemini-1.5-pro'
      },
      {
        name: 'authMethod',
        type: 'select',
        required: true,
        options: ['API Key', 'Service Account', 'OAuth 2.0', 'Application Default Credentials'],
        defaultValue: 'API Key'
      }
    ]
  },
  {
    id: '18',
    title: 'Code Review Assistant',
    description: 'Generate comprehensive code review feedback and improvement suggestions.',
    content: `Review the following code and provide detailed feedback:

Programming Language: {{language}}
Code Section: {{codeSection}}
Focus Areas: {{focusAreas}}

Please analyze:
1. Code quality and readability
2. Performance considerations
3. Security vulnerabilities
4. Best practices compliance
5. Potential bugs or issues

Provide specific recommendations for improvement.`,
    category: PromptCategory.ANALYSIS,
    tags: ['code-review', 'quality-assurance', 'feedback'],
    createdAt: '2025-10-07T10:05:00Z',
    updatedAt: '2025-10-07T10:05:00Z',
    isPublic: true,
    relatedPrompts: ['1', '3'],
    variables: [
      {
        name: 'language',
        type: 'select',
        required: true,
        options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go']
      },
      {
        name: 'codeSection',
        type: 'text',
        required: true
      },
      {
        name: 'focusAreas',
        type: 'text',
        required: false,
        defaultValue: 'Performance, Security, Maintainability'
      }
    ]
  },
  {
    id: '19',
    title: 'API Documentation Generator',
    description: 'Generate comprehensive API documentation from endpoint specifications.',
    content: `Create detailed API documentation for:

Endpoint: {{method}} {{endpoint}}
Description: {{description}}
Authentication: {{authType}}

Generate complete documentation including:
- Endpoint overview
- Request/response examples
- Error handling
- Rate limiting information
- Code samples in multiple languages

Make it developer-friendly and comprehensive.`,
    category: PromptCategory.DOCUMENTATION,
    tags: ['api', 'documentation', 'development'],
    createdAt: '2025-10-07T10:10:00Z',
    updatedAt: '2025-10-07T10:10:00Z',
    isPublic: true,
    relatedPrompts: ['3', '4'],
    variables: [
      {
        name: 'method',
        type: 'select',
        required: true,
        options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
      },
      {
        name: 'endpoint',
        type: 'text',
        required: true
      },
      {
        name: 'description',
        type: 'text',
        required: true
      },
      {
        name: 'authType',
        type: 'select',
        required: true,
        options: ['None', 'API Key', 'Bearer Token', 'OAuth 2.0'],
        defaultValue: 'API Key'
      }
    ]
  },
  {
    id: '7',
    title: 'User Demographics Study',
    description: 'Analyze demographic profiles for product users and create detailed segments.',
    content: `As a user research specialist, help me understand the demographic profile for {{product}} users.

Product description: {{productDescription}}
Initial hypothesis: {{initialHypothesis}}

Analyze:
1. Primary demographic segments (age, gender, income, education, location)
2. Psychographic profiles (values, interests, lifestyle)
3. Technology adoption patterns
4. Buying behavior and decision-making process
5. Media consumption and communication preferences
6. Pain points and needs by segment

Provide 3-4 distinct demographic segments with detailed profiles.`,
    category: PromptCategory.RESEARCH,
    tags: ['user-research', 'demographics', 'market-segmentation'],
    createdAt: '2025-10-04T10:10:00Z',
    updatedAt: '2025-10-04T10:10:00Z',
    isPublic: true,
    relatedPrompts: ['4', '5'],
    variables: [
      { name: 'product', type: 'text', required: true },
      { name: 'productDescription', type: 'text', required: true },
      { name: 'initialHypothesis', type: 'text', required: false }
    ]
  },
  {
    id: '8',
    title: 'Problem Statement Draft',
    description: 'Create clear, compelling problem statements for product development.',
    content: `Help me craft a clear, compelling problem statement for {{productIdea}}.

Context:
- Target users: {{targetUsers}}
- Current situation: {{currentSituation}}
- Pain points: {{painPoints}}
- Impact: {{impact}}

Create:
1. A one-sentence problem statement following this format:
   "{{targetUsers}} needs {{solution}} because {{problemPainPoint}}, but currently {{existingLimitation}}"

2. An expanded problem statement (2-3 paragraphs) covering:
   - Who experiences this problem
   - What the problem is
   - When/where it occurs
   - Why it matters
   - How it impacts them

3. Success metrics: How will we know when this problem is solved?`,
    category: PromptCategory.PLANNING,
    tags: ['problem-definition', 'product-strategy', 'requirements'],
    createdAt: '2025-10-04T10:15:00Z',
    updatedAt: '2025-10-04T10:15:00Z',
    isPublic: true,
    relatedPrompts: ['9', '10'],
    variables: [
      { name: 'productIdea', type: 'text', required: true },
      { name: 'targetUsers', type: 'text', required: true },
      { name: 'currentSituation', type: 'text', required: true },
      { name: 'painPoints', type: 'text', required: true },
      { name: 'impact', type: 'text', required: true },
      { name: 'solution', type: 'text', required: false },
      { name: 'problemPainPoint', type: 'text', required: false },
      { name: 'existingLimitation', type: 'text', required: false }
    ]
  },
  {
    id: '9',
    title: 'User Pain Points Analysis',
    description: 'Conduct deep analysis of user pain points for specific tasks and activities.',
    content: `Act as a user experience researcher. Conduct a deep dive into user pain points for {{userSegment}} when {{taskActivity}}.

Structure your analysis:
1. **Functional Pain Points**: What doesn't work or is inefficient?
2. **Emotional Pain Points**: What causes frustration, anxiety, or stress?
3. **Financial Pain Points**: What costs too much money or time?
4. **Process Pain Points**: What steps are too complicated or unclear?

For each pain point provide:
- Severity (Critical/High/Medium/Low)
- Frequency (Daily/Weekly/Monthly/Rarely)
- Current workarounds users employ
- Quantifiable impact (time lost, money wasted, opportunities missed)

Prioritize the top 5 pain points we should address first.`,
    category: PromptCategory.RESEARCH,
    tags: ['user-research', 'pain-points', 'ux-research'],
    createdAt: '2025-10-04T10:20:00Z',
    updatedAt: '2025-10-04T10:20:00Z',
    isPublic: true,
    relatedPrompts: ['8', '10'],
    variables: [
      { name: 'userSegment', type: 'text', required: true },
      { name: 'taskActivity', type: 'text', required: true }
    ]
  },
  {
    id: '10',
    title: 'Value Proposition Creation',
    description: 'Create compelling value propositions for products targeting specific audiences.',
    content: `You are a product strategist. Create a compelling value proposition for {{product}} targeting {{audience}}.

Product details:
- Core functionality: {{coreFunctionality}}
- Key differentiators: {{keyDifferentiators}}
- Target market: {{targetMarket}}

Develop:
1. **Main Value Proposition** (1-2 sentences):
   - What you offer
   - Who it's for
   - How it's different/better

2. **Supporting Value Propositions** (3-5 bullet points):
   - Specific benefits
   - Measurable outcomes
   - Emotional benefits

3. **Value Proposition Canvas**:
   - Customer jobs (what they're trying to accomplish)
   - Pains (negative outcomes they want to avoid)
   - Gains (positive outcomes they desire)
   - Pain relievers (how we address pains)
   - Gain creators (how we create gains)

4. Test messages for different channels (website, email, ads)`,
    category: PromptCategory.PLANNING,
    tags: ['value-proposition', 'product-strategy', 'messaging'],
    createdAt: '2025-10-04T10:25:00Z',
    updatedAt: '2025-10-04T10:25:00Z',
    isPublic: true,
    relatedPrompts: ['8', '9'],
    variables: [
      { name: 'product', type: 'text', required: true },
      { name: 'audience', type: 'text', required: true },
      { name: 'coreFunctionality', type: 'text', required: true },
      { name: 'keyDifferentiators', type: 'text', required: true },
      { name: 'targetMarket', type: 'text', required: true }
    ]
  },
  {
    id: '11',
    title: 'User Persona Development',
    description: 'Create detailed user personas for product development.',
    content: `Create detailed user personas for {{product}}. We're targeting {{marketDescription}}.

Research insights: {{existingData}}

For each persona (create 3-4), include:

**Demographics**:
- Name and photo description
- Age, gender, location
- Job title/role
- Income level
- Education
- Family situation

**Psychographics**:
- Goals and motivations
- Values and beliefs
- Frustrations and pain points
- Technology comfort level
- Preferred communication channels

**Behavioral Patterns**:
- A "day in the life" scenario
- How they currently solve this problem
- Decision-making process
- Buying criteria and objections
- Influence sources (who they trust)

**Product Relationship**:
- How they would discover our product
- What would make them try it
- What success looks like for them
- Potential barriers to adoption
- Quote that captures their mindset

Make personas realistic, specific, and actionable for product decisions.`,
    category: PromptCategory.RESEARCH,
    tags: ['user-personas', 'user-research', 'product-strategy'],
    createdAt: '2025-10-04T10:30:00Z',
    updatedAt: '2025-10-04T10:30:00Z',
    isPublic: true,
    relatedPrompts: ['12', '13'],
    variables: [
      { name: 'product', type: 'text', required: true },
      { name: 'marketDescription', type: 'text', required: true },
      { name: 'existingData', type: 'text', required: false }
    ]
  },
  {
    id: '12',
    title: 'User Journey Mapping',
    description: 'Map end-to-end user journeys for specific personas and goals.',
    content: `Map the end-to-end user journey for {{personaName}} trying to accomplish {{goal}} using {{productService}}.

Create a journey map with these stages:
1. **Awareness**: How do they become aware of the problem?
2. **Consideration**: What solutions do they explore?
3. **Decision**: How do they choose a solution?
4. **Onboarding**: First experiences with our product
5. **Usage**: Regular interaction patterns
6. **Retention**: What keeps them coming back
7. **Advocacy**: What makes them recommend us

For each stage, document:
- User actions (what they do)
- Thoughts (what they're thinking)
- Emotions (how they feel - use emotional curve)
- Pain points (what frustrates them)
- Opportunities (how we can improve)
- Touchpoints (where they interact with us)
- Success metrics (how we measure this stage)

Identify the most critical moments of truth (make-or-break experiences).`,
    category: PromptCategory.RESEARCH,
    tags: ['user-journey', 'customer-experience', 'ux-research'],
    createdAt: '2025-10-04T10:35:00Z',
    updatedAt: '2025-10-04T10:35:00Z',
    isPublic: true,
    relatedPrompts: ['11', '13'],
    variables: [
      { name: 'personaName', type: 'text', required: true },
      { name: 'goal', type: 'text', required: true },
      { name: 'productService', type: 'text', required: true }
    ]
  },
  {
    id: '13',
    title: 'Interview Question Generation',
    description: 'Generate comprehensive interview questions for user research.',
    content: `Generate interview questions for user research on {{topicProductArea}}.

Interview goals:
- {{goal1}}
- {{goal2}} 
- {{goal3}}

Target interviewees: {{targetInterviewees}}
Interview length: {{interviewLength}}

Create:
1. **Opening Questions** (5 mins): Build rapport, set context
2. **Background Questions** (10 mins): Understand their current situation
3. **Behavioral Questions** (15-20 mins): How they currently solve this problem
4. **Pain Point Exploration** (10 mins): Deep dive into frustrations
5. **Solution Validation** (10 mins): Test concepts/prototypes
6. **Closing Questions** (5 mins): Anything we missed, future contact

Format:
- Use open-ended questions ("Tell me about..." "Walk me through...")
- Avoid leading questions
- Include follow-up probes for each main question
- Mark priority questions (must-ask vs. nice-to-have)
- Add interviewer notes on what to listen for

Also provide:
- Pre-interview screener questions
- Interview guide with timing
- Note-taking template`,
    category: PromptCategory.RESEARCH,
    tags: ['user-interviews', 'research-methods', 'question-design'],
    createdAt: '2025-10-04T10:40:00Z',
    updatedAt: '2025-10-04T10:40:00Z',
    isPublic: true,
    relatedPrompts: ['11', '12'],
    variables: [
      { name: 'topicProductArea', type: 'text', required: true },
      { name: 'goal1', type: 'text', required: true },
      { name: 'goal2', type: 'text', required: false },
      { name: 'goal3', type: 'text', required: false },
      { name: 'targetInterviewees', type: 'text', required: true },
      { name: 'interviewLength', type: 'select', required: true, options: ['30 minutes', '45 minutes', '60 minutes'] }
    ]
  },
  {
    id: '14',
    title: 'Functional Requirements Documentation',
    description: 'Document functional requirements for features and products.',
    content: `Act as a business analyst. Document functional requirements for {{featureProduct}}.

Context:
- User need: {{userNeed}}
- Target users: {{targetUsers}}
- Success criteria: {{successCriteria}}

For each requirement, specify:

**Format**: 
REQ-F-[NUMBER]: [REQUIREMENT TITLE]
- **Description**: Clear, specific statement of what the system must do
- **User Story**: As a {{role}}, I want to {{action}} so that {{benefit}}
- **Priority**: Must-have / Should-have / Could-have / Won't-have (MoSCoW)
- **Acceptance Criteria**: Measurable conditions for completion
- **Dependencies**: What else is needed
- **Assumptions**: What we're assuming is true
- **Constraints**: Technical or business limitations

Categories to cover:
1. Core functionality (the essential features)
2. User management (login, profiles, permissions)
3. Data management (CRUD operations)
4. Integration requirements (APIs, third-party services)
5. Reporting and analytics
6. Search and filtering
7. Notifications and alerts

Number all requirements for traceability.`,
    category: PromptCategory.DOCUMENTATION,
    tags: ['requirements', 'functional-specs', 'product-management'],
    createdAt: '2025-10-04T10:45:00Z',
    updatedAt: '2025-10-04T10:45:00Z',
    isPublic: true,
    relatedPrompts: ['15', '16'],
    variables: [
      { name: 'featureProduct', type: 'text', required: true },
      { name: 'userNeed', type: 'text', required: true },
      { name: 'targetUsers', type: 'text', required: true },
      { name: 'successCriteria', type: 'text', required: true },
      { name: 'role', type: 'text', required: false },
      { name: 'action', type: 'text', required: false },
      { name: 'benefit', type: 'text', required: false }
    ]
  },
  {
    id: '15',
    title: 'Non-Functional Requirements',
    description: 'Document non-functional requirements and quality attributes for systems.',
    content: `Document non-functional requirements (quality attributes) for {{productSystem}}.

Cover these dimensions:

**Performance**:
- Response time targets (e.g., page load < 2 seconds)
- Throughput requirements (e.g., 1000 transactions/second)
- Concurrent user capacity
- Resource usage limits (CPU, memory, bandwidth)

**Scalability**:
- Expected growth trajectory
- Horizontal vs. vertical scaling strategy
- Peak load scenarios

**Reliability & Availability**:
- Uptime requirements (e.g., 99.9% availability)
- Mean time between failures (MTBF)
- Mean time to recovery (MTTR)
- Backup and disaster recovery

**Security**:
- Authentication requirements
- Authorization and access control
- Data encryption (at rest and in transit)
- Compliance standards ({{complianceStandards}})
- Audit logging requirements
- Penetration testing frequency

**Usability**:
- Learning curve for new users
- Accessibility standards (WCAG 2.1 Level AA)
- Supported devices and browsers
- Internationalization/localization needs

**Maintainability**:
- Code quality standards
- Documentation requirements
- Monitoring and logging
- Testing coverage targets

**Compatibility**:
- Browser support matrix
- Mobile OS versions
- Integration standards
- Legacy system support

For each requirement, specify target metrics and how we'll verify compliance.`,
    category: PromptCategory.DOCUMENTATION,
    tags: ['non-functional-requirements', 'quality-attributes', 'system-specs'],
    createdAt: '2025-10-04T10:50:00Z',
    updatedAt: '2025-10-04T10:50:00Z',
    isPublic: true,
    relatedPrompts: ['14', '16'],
    variables: [
      { name: 'productSystem', type: 'text', required: true },
      { name: 'complianceStandards', type: 'text', required: false }
    ]
  },
  {
    id: '16',
    title: 'Technical Constraints Documentation',
    description: 'Identify and document technical constraints for projects.',
    content: `Identify and document technical constraints for {{project}}.

Current environment:
- Existing tech stack: {{existingTechStack}}
- Infrastructure: {{infrastructure}}
- Team skills: {{teamSkills}}
- Budget: {{budgetConstraints}}

Document constraints in these categories:

**1. Technology Constraints**:
- Must-use technologies (company standards)
- Cannot-use technologies (licensing, security concerns)
- Legacy systems to integrate with
- Approved vendors/services only

**2. Infrastructure Constraints**:
- Data center locations (data residency laws)
- Network bandwidth limitations
- Compute resource quotas
- Storage capacity

**3. Resource Constraints**:
- Team size and skill gaps
- Timeline restrictions
- Budget limitations
- Third-party dependencies

**4. Regulatory/Compliance Constraints**:
- Industry regulations
- Data privacy laws
- Accessibility requirements
- Audit requirements

**5. Integration Constraints**:
- APIs we must use
- Data format requirements
- Authentication protocols
- Rate limits on external services

For each constraint, note:
- Why it exists (business reason, technical reason, policy)
- Impact on product decisions
- Workarounds or mitigation strategies
- Who can approve exceptions`,
    category: PromptCategory.DOCUMENTATION,
    tags: ['technical-constraints', 'project-planning', 'system-architecture'],
    createdAt: '2025-10-04T10:55:00Z',
    updatedAt: '2025-10-04T10:55:00Z',
    isPublic: true,
    relatedPrompts: ['14', '15'],
    variables: [
      { name: 'project', type: 'text', required: true },
      { name: 'existingTechStack', type: 'text', required: true },
      { name: 'infrastructure', type: 'select', required: true, options: ['Cloud', 'On-Premise', 'Hybrid'] },
      { name: 'teamSkills', type: 'text', required: true },
      { name: 'budgetConstraints', type: 'text', required: true }
    ]
  }
];

// Mock Health Status
export const mockHealthStatus: HealthStatus = {
  status: 'healthy',
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  services: {
    database: 'up',
    api: 'up'
  }
};
