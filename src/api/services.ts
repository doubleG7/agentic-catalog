import { apiClient } from './client';
import { mockInstructions, mockPrompts, mockHealthStatus } from '../data/mockData';
import {
  Instruction,
  Prompt,
  CreateInstructionRequest,
  CreatePromptRequest,
  UpdateInstructionRequest,
  UpdatePromptRequest,
  ApiResponse,
  PaginatedResponse,
  HealthStatus,
} from '../types';

// Flag to enable/disable mock mode
const USE_MOCK_DATA = true;

export class InstructionsApi {
  async getAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<Instruction>> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredInstructions = [...mockInstructions];
      
      // Apply filters
      if (params?.category) {
        filteredInstructions = filteredInstructions.filter(
          instruction => instruction.category === params.category
        );
      }
      
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredInstructions = filteredInstructions.filter(
          instruction => 
            instruction.title.toLowerCase().includes(searchLower) ||
            instruction.description.toLowerCase().includes(searchLower) ||
            instruction.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredInstructions.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total: filteredInstructions.length,
        page,
        limit,
        totalPages: Math.ceil(filteredInstructions.length / limit)
      };
    }
    
    return apiClient.get<PaginatedResponse<Instruction>>('/instructions', params);
  }

  async getById(id: string): Promise<ApiResponse<Instruction>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const instruction = mockInstructions.find(i => i.id === id);
      if (!instruction) {
        throw new Error('Instruction not found');
      }
      return { data: instruction, success: true };
    }
    
    return apiClient.get<ApiResponse<Instruction>>(`/instructions/${id}`);
  }

  async create(data: CreateInstructionRequest): Promise<ApiResponse<Instruction>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newInstruction: Instruction = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockInstructions.unshift(newInstruction);
      return { data: newInstruction, success: true, message: 'Instruction created successfully' };
    }
    
    return apiClient.post<ApiResponse<Instruction>>('/instructions', data);
  }

  async update(id: string, data: UpdateInstructionRequest): Promise<ApiResponse<Instruction>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = mockInstructions.findIndex(i => i.id === id);
      if (index === -1) {
        throw new Error('Instruction not found');
      }
      const updatedInstruction = {
        ...mockInstructions[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      mockInstructions[index] = updatedInstruction;
      return { data: updatedInstruction, success: true, message: 'Instruction updated successfully' };
    }
    
    return apiClient.put<ApiResponse<Instruction>>(`/instructions/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = mockInstructions.findIndex(i => i.id === id);
      if (index === -1) {
        throw new Error('Instruction not found');
      }
      mockInstructions.splice(index, 1);
      return { data: undefined, success: true, message: 'Instruction deleted successfully' };
    }
    
    return apiClient.delete<ApiResponse<void>>(`/instructions/${id}`);
  }

  async getRelated(id: string): Promise<ApiResponse<Instruction[]>> {
    return apiClient.get<ApiResponse<Instruction[]>>(`/instructions/${id}/related`);
  }
}

export class PromptsApi {
  async getAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<Prompt>> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredPrompts = [...mockPrompts];
      
      // Apply filters
      if (params?.category) {
        filteredPrompts = filteredPrompts.filter(
          prompt => prompt.category === params.category
        );
      }
      
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        filteredPrompts = filteredPrompts.filter(
          prompt => 
            prompt.title.toLowerCase().includes(searchLower) ||
            prompt.description.toLowerCase().includes(searchLower) ||
            prompt.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      // Apply pagination
      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredPrompts.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total: filteredPrompts.length,
        page,
        limit,
        totalPages: Math.ceil(filteredPrompts.length / limit)
      };
    }
    
    return apiClient.get<PaginatedResponse<Prompt>>('/prompts', params);
  }

  async getById(id: string): Promise<ApiResponse<Prompt>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const prompt = mockPrompts.find(p => p.id === id);
      if (!prompt) {
        throw new Error('Prompt not found');
      }
      return { data: prompt, success: true };
    }
    
    return apiClient.get<ApiResponse<Prompt>>(`/prompts/${id}`);
  }

  async create(data: CreatePromptRequest): Promise<ApiResponse<Prompt>> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newPrompt: Prompt = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockPrompts.unshift(newPrompt);
      return { data: newPrompt, success: true, message: 'Prompt created successfully' };
    }
    
    return apiClient.post<ApiResponse<Prompt>>('/prompts', data);
  }

  async update(id: string, data: UpdatePromptRequest): Promise<ApiResponse<Prompt>> {
    return apiClient.put<ApiResponse<Prompt>>(`/prompts/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/prompts/${id}`);
  }

  async getRelated(id: string): Promise<ApiResponse<Prompt[]>> {
    return apiClient.get<ApiResponse<Prompt[]>>(`/prompts/${id}/related`);
  }
}

export class HealthApi {
  async getStatus(): Promise<HealthStatus> {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockHealthStatus;
    }
    
    return apiClient.get<HealthStatus>('/health');
  }
}

// Export singleton instances
export const instructionsApi = new InstructionsApi();
export const promptsApi = new PromptsApi();
export const healthApi = new HealthApi();