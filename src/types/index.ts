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
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: number; // in minutes
    prerequisites?: string[];
    outputs?: string[];
  };
}

export interface InstructionVariable {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'file' | 'url';
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
  type: 'text' | 'number' | 'boolean' | 'select';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  description?: string;
}

export enum InstructionCategory {
  BUSINESS = 'BUSINESS',
  PRODUCT = 'PRODUCT',
  SOFTWARE_ENGINEERING = 'SOFTWARE_ENGINEERING',
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
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
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