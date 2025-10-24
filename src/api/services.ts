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
import { PromotionRequest, Environment } from '../types/versioning';

// Determine if we should use mock data based on environment variable
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';
const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

/**
 * Helper function to make API calls with optional mock fallback
 */
async function apiCallWithFallback<T>(
  apiCall: () => Promise<T>,
  mockFallback: () => Promise<T>
): Promise<T> {
  if (USE_MOCK_DATA) {
    return mockFallback();
  }

  if (ENABLE_MOCK_FALLBACK) {
    try {
      return await apiCall();
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return mockFallback();
    }
  }

  return apiCall();
}

export class InstructionsApi {
  async getAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<Instruction>> {
    return apiCallWithFallback(
      // Real API call
      async () => {
        const response = await apiClient.get<{ success: boolean; data: PaginatedResponse<Instruction> }>('/instructions', params);
        return response.data;
      },
      // Mock fallback
      async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredInstructions = [...mockInstructions];
        
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
    );
  }

  async getById(id: string): Promise<ApiResponse<Instruction>> {
    return apiCallWithFallback(
      async () => apiClient.get<ApiResponse<Instruction>>(`/instructions/${id}`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const instruction = mockInstructions.find(i => i.id === id);
        if (!instruction) {
          throw new Error('Instruction not found');
        }
        return { data: instruction, success: true };
      }
    );
  }

  async create(data: CreateInstructionRequest): Promise<ApiResponse<Instruction>> {
    return apiCallWithFallback(
      async () => apiClient.post<ApiResponse<Instruction>>('/instructions', data),
      async () => {
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
    );
  }

  async update(id: string, data: UpdateInstructionRequest): Promise<ApiResponse<Instruction>> {
    return apiCallWithFallback(
      async () => apiClient.put<ApiResponse<Instruction>>(`/instructions/${id}`, data),
      async () => {
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
    );
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiCallWithFallback(
      async () => apiClient.delete<ApiResponse<void>>(`/instructions/${id}`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
        const index = mockInstructions.findIndex(i => i.id === id);
        if (index === -1) {
          throw new Error('Instruction not found');
        }
        mockInstructions.splice(index, 1);
        return { data: undefined, success: true, message: 'Instruction deleted successfully' };
      }
    );
  }

  async getRelated(id: string): Promise<ApiResponse<Instruction[]>> {
    return apiCallWithFallback(
      async () => apiClient.get<ApiResponse<Instruction[]>>(`/instructions/${id}/related`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { data: [], success: true };
      }
    );
  }
}

export class PromptsApi {
  async getAll(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<Prompt>> {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get<{ success: boolean; data: PaginatedResponse<Prompt> }>('/prompts', params);
        return response.data;
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredPrompts = [...mockPrompts];
        
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
    );
  }

  async getById(id: string): Promise<ApiResponse<Prompt>> {
    return apiCallWithFallback(
      async () => apiClient.get<ApiResponse<Prompt>>(`/prompts/${id}`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const prompt = mockPrompts.find(p => p.id === id);
        if (!prompt) {
          throw new Error('Prompt not found');
        }
        return { data: prompt, success: true };
      }
    );
  }

  async create(data: CreatePromptRequest): Promise<ApiResponse<Prompt>> {
    return apiCallWithFallback(
      async () => apiClient.post<ApiResponse<Prompt>>('/prompts', data),
      async () => {
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
    );
  }

  async update(id: string, data: UpdatePromptRequest): Promise<ApiResponse<Prompt>> {
    return apiCallWithFallback(
      async () => apiClient.put<ApiResponse<Prompt>>(`/prompts/${id}`, data),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        const index = mockPrompts.findIndex(p => p.id === id);
        if (index === -1) {
          throw new Error('Prompt not found');
        }
        const updatedPrompt = {
          ...mockPrompts[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        mockPrompts[index] = updatedPrompt;
        return { data: updatedPrompt, success: true, message: 'Prompt updated successfully' };
      }
    );
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return apiCallWithFallback(
      async () => apiClient.delete<ApiResponse<void>>(`/prompts/${id}`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
        const index = mockPrompts.findIndex(p => p.id === id);
        if (index === -1) {
          throw new Error('Prompt not found');
        }
        mockPrompts.splice(index, 1);
        return { data: undefined, success: true, message: 'Prompt deleted successfully' };
      }
    );
  }

  async getRelated(id: string): Promise<ApiResponse<Prompt[]>> {
    return apiCallWithFallback(
      async () => apiClient.get<ApiResponse<Prompt[]>>(`/prompts/${id}/related`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { data: [], success: true };
      }
    );
  }
}

export class HealthApi {
  async getStatus(): Promise<HealthStatus> {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get<HealthStatus>('/health');
        return response;
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockHealthStatus;
      }
    );
  }
}

/**
 * Promotion API for deployment workflow
 */
export class PromotionsApi {
  async getPending(): Promise<ApiResponse<PromotionRequest[]>> {
    return apiCallWithFallback(
      async () => apiClient.get<ApiResponse<PromotionRequest[]>>('/promotions/pending'),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { data: [], success: true };
      }
    );
  }

  async getHistory(itemType: string, itemId: string): Promise<ApiResponse<PromotionRequest[]>> {
    return apiCallWithFallback(
      async () => apiClient.get<ApiResponse<PromotionRequest[]>>(`/promotions/history/${itemType}/${itemId}`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { data: [], success: true };
      }
    );
  }

  async create(data: {
    itemType: 'INSTRUCTION' | 'PROMPT';
    itemId: string;
    fromEnvironment: Environment;
    toEnvironment: Environment;
    reason: string;
    changesSummary: string;
    scheduledAt?: string;
  }): Promise<ApiResponse<PromotionRequest>> {
    return apiCallWithFallback(
      async () => apiClient.post<ApiResponse<PromotionRequest>>('/promotions', data),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newPromotion: PromotionRequest = {
          id: Math.random().toString(36).substr(2, 9),
          itemId: data.itemId,
          itemType: data.itemType.toLowerCase() as 'instruction' | 'prompt',
          fromEnvironment: data.fromEnvironment,
          toEnvironment: data.toEnvironment,
          version: { major: 1, minor: 0, patch: 0 },
          requestedBy: 'current-user',
          requestedAt: new Date().toISOString(),
          reason: data.reason,
          changesSummary: data.changesSummary,
          approvals: [],
          status: import('../types/versioning').then(m => m.PromotionStatus.PENDING_REVIEW) as any,
          scheduledDeployment: data.scheduledAt,
        };
        return { data: newPromotion, success: true, message: 'Promotion request created successfully' };
      }
    );
  }

  async approve(id: string, comments?: string): Promise<ApiResponse<PromotionRequest>> {
    return apiCallWithFallback(
      async () => apiClient.post<ApiResponse<PromotionRequest>>(`/promotions/${id}/approve`, { comments }),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { 
          data: {} as PromotionRequest, 
          success: true, 
          message: 'Promotion approved successfully' 
        };
      }
    );
  }

  async reject(id: string, comments: string): Promise<ApiResponse<PromotionRequest>> {
    return apiCallWithFallback(
      async () => apiClient.post<ApiResponse<PromotionRequest>>(`/promotions/${id}/reject`, { comments }),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { 
          data: {} as PromotionRequest, 
          success: true, 
          message: 'Promotion rejected successfully' 
        };
      }
    );
  }

  async deploy(id: string): Promise<ApiResponse<PromotionRequest>> {
    return apiCallWithFallback(
      async () => apiClient.post<ApiResponse<PromotionRequest>>(`/promotions/${id}/deploy`, {}),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { 
          data: {} as PromotionRequest, 
          success: true, 
          message: 'Deployment completed successfully' 
        };
      }
    );
  }
}

/**
 * Ratings API for rating instructions, prompts, and collections
 */
export class RatingsApi {
  async rateInstruction(id: string, rating: number, comment?: string): Promise<ApiResponse<any>> {
    return apiCallWithFallback(
      async () => apiClient.post<ApiResponse<any>>(`/ratings/instructions/${id}`, { rating, comment }),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { 
          data: { rating, comment }, 
          stats: { average: rating, count: 1, userRating: rating },
          success: true, 
          message: 'Rating saved successfully' 
        };
      }
    );
  }

  async ratePrompt(id: string, rating: number, comment?: string): Promise<ApiResponse<any>> {
    return apiCallWithFallback(
      async () => apiClient.post<ApiResponse<any>>(`/ratings/prompts/${id}`, { rating, comment }),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { 
          data: { rating, comment }, 
          stats: { average: rating, count: 1, userRating: rating },
          success: true, 
          message: 'Rating saved successfully' 
        };
      }
    );
  }

  async rateCollection(id: string, rating: number, comment?: string): Promise<ApiResponse<any>> {
    return apiCallWithFallback(
      async () => apiClient.post<ApiResponse<any>>(`/ratings/collections/${id}`, { rating, comment }),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { 
          data: { rating, comment }, 
          stats: { average: rating, count: 1, userRating: rating },
          success: true, 
          message: 'Rating saved successfully' 
        };
      }
    );
  }

  async getInstructionStats(id: string): Promise<ApiResponse<{ average: number; count: number; userRating?: number }>> {
    return apiCallWithFallback(
      async () => apiClient.get<ApiResponse<any>>(`/ratings/instructions/${id}/stats`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return { 
          data: { average: 0, count: 0 },
          success: true 
        };
      }
    );
  }

  async getPromptStats(id: string): Promise<ApiResponse<{ average: number; count: number; userRating?: number }>> {
    return apiCallWithFallback(
      async () => apiClient.get<ApiResponse<any>>(`/ratings/prompts/${id}/stats`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return { 
          data: { average: 0, count: 0 },
          success: true 
        };
      }
    );
  }

  async getCollectionStats(id: string): Promise<ApiResponse<{ average: number; count: number; userRating?: number }>> {
    return apiCallWithFallback(
      async () => apiClient.get<ApiResponse<any>>(`/ratings/collections/${id}/stats`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return { 
          data: { average: 0, count: 0 },
          success: true 
        };
      }
    );
  }

  async deleteRating(itemType: 'instruction' | 'prompt' | 'collection', id: string): Promise<ApiResponse<void>> {
    return apiCallWithFallback(
      async () => apiClient.delete<ApiResponse<void>>(`/ratings/${itemType}/${id}`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return { 
          data: undefined,
          success: true, 
          message: 'Rating deleted successfully' 
        };
      }
    );
  }

  async getMyRatings(): Promise<ApiResponse<any[]>> {
    return apiCallWithFallback(
      async () => apiClient.get<ApiResponse<any[]>>('/ratings/my-ratings'),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        return { 
          data: [],
          success: true 
        };
      }
    );
  }
}

// Export singleton instances
export const instructionsApi = new InstructionsApi();
export const promptsApi = new PromptsApi();
export const healthApi = new HealthApi();
export const promotionsApi = new PromotionsApi();
export const ratingsApi = new RatingsApi();

export class CollectionsApi {
  async getAllCollections(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<any[]> {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.get<{ success: boolean; data: any[] }>('/collections', params);
        return response.data;
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [];
      }
    );
  }

  async getById(id: string): Promise<ApiResponse<any>> {
    return apiCallWithFallback(
      async () => apiClient.get<ApiResponse<any>>(`/collections/${id}`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 300));
        throw new Error('Collection not found');
      }
    );
  }

  async createCollection(data: any): Promise<any> {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.post<ApiResponse<any>>('/collections', data);
        return response.data;
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        const newCollection = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return newCollection;
      }
    );
  }

  async updateCollection(id: string, data: any): Promise<any> {
    return apiCallWithFallback(
      async () => {
        const response = await apiClient.put<ApiResponse<any>>(`/collections/${id}`, data);
        return response.data;
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return {
          id,
          ...data,
          updatedAt: new Date().toISOString(),
        };
      }
    );
  }

  async deleteCollection(id: string): Promise<ApiResponse<void>> {
    return apiCallWithFallback(
      async () => apiClient.delete<ApiResponse<void>>(`/collections/${id}`),
      async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return { data: undefined, success: true, message: 'Collection deleted successfully' };
      }
    );
  }
}

export const collectionApi = new CollectionsApi();
