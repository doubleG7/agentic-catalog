import axios, { AxiosInstance, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { AuthUtils, SecurityUtils } from '../utils/security';

class ApiClient {
  private client: AxiosInstance;
  private useMockFallback: boolean;

  constructor() {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007/api/v1';
    this.useMockFallback = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';
    
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor with secure headers
    this.client.interceptors.request.use(
      (config) => {
        // Add secure headers including auth token and CSRF protection
        const secureHeaders = AuthUtils.getSecureHeaders();
        Object.entries(secureHeaders).forEach(([key, value]) => {
          config.headers[key] = value;
        });
        
        // Sanitize request data if present
        if (config.data && typeof config.data === 'object') {
          config.data = SecurityUtils.sanitizeFormData(config.data);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor with secure error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Sanitize error messages to prevent information disclosure
        const message = SecurityUtils.sanitizeErrorMessage(error.response?.data || error);
        
        if (error.response?.status === 401) {
          toast.error('Authentication required');
          // Clear tokens and redirect to login
          AuthUtils.clearSecureToken();
          // Handle logout or redirect
        } else if (error.response?.status === 403) {
          toast.error('Access forbidden');
        } else if (error.response?.status >= 500) {
          toast.error('Server error occurred');
        } else {
          toast.error(message);
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  shouldUseMockFallback(): boolean {
    return this.useMockFallback;
  }

  isServerAvailable(): boolean {
    // This can be enhanced with an actual health check
    return true;
  }
}

export const apiClient = new ApiClient();