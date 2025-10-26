export interface Instruction {
  id: string;
  title: string;
  description: string;
  content: string;
  category: InstructionCategory;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  relatedInstructions: string[];
  variables?: InstructionVariable[];
  rating?: {
    average: number; // 0-5 with decimal support (e.g., 4.5)
    count: number; // total number of ratings
    userRating?: number; // current user's rating
  };
  metadata?: {
    author?: string;
    version?: string;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    estimatedTime?: number; // in minutes
    prerequisites?: string[];
    outputs?: string[];
  };
}

export interface InstructionVariable {
  name: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT' | 'FILE' | 'URL';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  description?: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  relatedPrompts: string[];
  variables: PromptVariable[];
  rating?: {
    average: number; // 0-5 with decimal support (e.g., 4.5)
    count: number; // total number of ratings
    userRating?: number; // current user's rating
  };
}

export interface PromptVariable {
  name: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  description?: string;
}

export enum InstructionCategory {
  BUSINESS = 'BUSINESS',
  PRODUCT = 'PRODUCT',
  AGENTIC_AI = 'AGENTIC_AI',
  DEVELOPMENT = 'DEVELOPMENT',
  PROJECT_MANAGEMENT = 'PROJECT_MANAGEMENT',
  DESIGN = 'DESIGN',
  MARKETING = 'MARKETING',
  SALES = 'SALES',
  GENERAL = 'GENERAL'
}

export enum PromptCategory {
  CODE_GENERATION = 'CODE_GENERATION',
  DOCUMENTATION = 'DOCUMENTATION',
  ANALYSIS = 'ANALYSIS',
  CREATIVE = 'CREATIVE',
  PROBLEM_SOLVING = 'PROBLEM_SOLVING',
  COMMUNICATION = 'COMMUNICATION',
  RESEARCH = 'RESEARCH',
  PLANNING = 'PLANNING',
  GENERAL = 'GENERAL'
}

export interface Collection {
  id: string;
  title?: string;
  name?: string;
  description: string;
  instructions: string[];
  prompts: string[];
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  usageCount?: number;
  items?: Array<{
    id: string;
    type: 'instruction' | 'prompt';
    itemId: string;
    order: number;
  }>;
  connections?: Array<{
    from: string;
    to: string;
    type: 'instruction' | 'prompt';
  }>;
  nodePositions?: Array<{
    id: string;
    x: number;
    y: number;
    type: 'instruction' | 'prompt' | 'connector';
  }>;
  rating?: {
    average: number;
    count: number;
    userRating?: number;
  } | number;
}

export interface CreateInstructionRequest {
  title: string;
  description: string;
  content: string;
  category: InstructionCategory;
  tags: string[];
  isPublic: boolean;
  relatedInstructions: string[];
  variables?: InstructionVariable[];
  metadata?: {
    author?: string;
    version?: string;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    estimatedTime?: number;
    prerequisites?: string[];
    outputs?: string[];
  };
}

export interface CreatePromptRequest {
  title: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  isPublic: boolean;
  relatedPrompts: string[];
  variables: PromptVariable[];
}

export interface UpdateInstructionRequest extends Partial<CreateInstructionRequest> {}
export interface UpdatePromptRequest extends Partial<CreatePromptRequest> {}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  stats?: {
    average?: number;
    count?: number;
    userRating?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: 'up' | 'down';
    api: 'up' | 'down';
  };
}

export interface FlowNode {
  id: string;
  type: 'instruction' | 'prompt';
  position: { x: number; y: number };
  data: {
    label: string;
    description: string;
    category: string;
    id: string;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type: 'default';
  animated: boolean;
}