import { apiClient } from '../api/client';
import { AuthUtils } from '../utils/security';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface AuthProviderInfo {
  name: string;
  supportsRefresh: boolean;
  requiresOAuth: boolean;
  authority?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    tokenType?: string;
    user: AuthUser;
  };
  message?: string;
}

export interface AuthInfoResponse {
  success: boolean;
  data?: {
    provider: AuthProviderInfo;
    config: {
      provider: string;
    };
  };
}

export class AuthService {
  private static user: AuthUser | null = null;
  private static refreshTimeout: NodeJS.Timeout | null = null;

  /**
   * Get authentication provider information
   */
  static async getAuthInfo(): Promise<AuthProviderInfo | null> {
    try {
      const response = await apiClient.get<AuthInfoResponse>('/auth/info');
      return response.data?.provider || null;
    } catch (error) {
      console.error('Failed to get auth info:', error);
      return null;
    }
  }

  /**
   * Get TrimbleID authorization URL
   */
  static async getAuthorizationUrl(redirectUri: string, state?: string): Promise<string | null> {
    try {
      const params: any = { redirect_uri: redirectUri };
      if (state) params.state = state;

      const response = await apiClient.get<{ success: boolean; data: { authUrl: string } }>(
        '/auth/authorize-url',
        params
      );
      return response.data?.authUrl || null;
    } catch (error) {
      console.error('Failed to get authorization URL:', error);
      return null;
    }
  }

  /**
   * Exchange authorization code for tokens
   */
  static async exchangeCodeForTokens(code: string, redirectUri: string): Promise<AuthUser | null> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/exchange-code', {
        code,
        redirect_uri: redirectUri,
      });

      if (response.success && response.data) {
        // Store tokens securely
        AuthUtils.setSecureToken(response.data.accessToken);
        
        if (response.data.refreshToken) {
          this.storeRefreshToken(response.data.refreshToken);
        }

        // Store user
        this.user = response.data.user;

        // Setup automatic token refresh
        if (response.data.expiresIn) {
          this.setupTokenRefresh(response.data.expiresIn);
        }

        return response.data.user;
      }

      return null;
    } catch (error) {
      console.error('Failed to exchange code for tokens:', error);
      return null;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await apiClient.post<AuthResponse>('/auth/refresh', {
        refresh_token: refreshToken,
      });

      if (response.success && response.data) {
        // Update access token
        AuthUtils.setSecureToken(response.data.accessToken);

        // Update refresh token if provided
        if (response.data.refreshToken) {
          this.storeRefreshToken(response.data.refreshToken);
        }

        // Setup next refresh
        if (response.data.expiresIn) {
          this.setupTokenRefresh(response.data.expiresIn);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Clear tokens if refresh fails
      this.logout();
      return false;
    }
  }

  /**
   * Validate current token and get user info
   */
  static async validateToken(): Promise<AuthUser | null> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data?: { valid: boolean; user: AuthUser };
      }>('/auth/validate');

      if (response.success && response.data?.valid) {
        this.user = response.data.user;
        return response.data.user;
      }

      return null;
    } catch (error) {
      console.error('Token validation failed:', error);
      return null;
    }
  }

  /**
   * Start TrimbleID OAuth flow
   */
  static async startTrimbleAuth(): Promise<void> {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const state = this.generateState();
    
    // Store state for validation
    sessionStorage.setItem('oauth_state', state);

    const authUrl = await this.getAuthorizationUrl(redirectUri, state);
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      throw new Error('Failed to get authorization URL');
    }
  }

  /**
   * Handle OAuth callback
   */
  static async handleOAuthCallback(code: string, state?: string): Promise<AuthUser | null> {
    // Validate state to prevent CSRF (only if both state and stored state exist)
    const storedState = sessionStorage.getItem('oauth_state');
    
    if (storedState) {
      // State was stored, so we expect it to match
      if (!state) {
        console.warn('OAuth state was stored but not returned from provider');
      } else if (storedState !== state) {
        console.error('State mismatch:', { stored: storedState, received: state });
        throw new Error('Invalid state parameter - possible CSRF attack');
      }
      // Clear stored state after validation
      sessionStorage.removeItem('oauth_state');
    } else if (state) {
      // State was returned but we didn't store one - this is suspicious
      console.warn('OAuth state returned but none was stored');
    }

    const redirectUri = `${window.location.origin}/auth/callback`;
    return await this.exchangeCodeForTokens(code, redirectUri);
  }

  /**
   * Logout user
   */
  static logout(): void {
    // Clear tokens
    AuthUtils.clearSecureToken();
    this.clearRefreshToken();

    // Clear user
    this.user = null;

    // Clear refresh timeout
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }

    // Redirect to home or login
    window.location.href = '/';
  }

  /**
   * Get current user
   */
  static getCurrentUser(): AuthUser | null {
    return this.user;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return AuthUtils.isAuthenticated();
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role: string): boolean {
    return this.user?.role === role;
  }

  /**
   * Check if user has permission
   */
  static hasPermission(permission: string): boolean {
    return this.user?.permissions?.includes(permission) || false;
  }

  /**
   * Setup automatic token refresh
   */
  private static setupTokenRefresh(expiresIn: number): void {
    // Clear existing timeout
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    // Refresh 5 minutes before expiry
    const refreshTime = Math.max((expiresIn - 300) * 1000, 60000);

    this.refreshTimeout = setTimeout(() => {
      this.refreshToken();
    }, refreshTime);
  }

  /**
   * Generate random state for OAuth
   */
  private static generateState(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Store refresh token
   */
  private static storeRefreshToken(token: string): void {
    try {
      const obfuscated = btoa(token + ':' + Date.now());
      sessionStorage.setItem('__app_refresh_token', obfuscated);
    } catch (error) {
      console.error('Failed to store refresh token:', error);
    }
  }

  /**
   * Get refresh token
   */
  private static getRefreshToken(): string | null {
    try {
      const obfuscated = sessionStorage.getItem('__app_refresh_token');
      if (!obfuscated) return null;

      const decoded = atob(obfuscated);
      const [token] = decoded.split(':');
      return token || null;
    } catch (error) {
      console.error('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  /**
   * Clear refresh token
   */
  private static clearRefreshToken(): void {
    try {
      sessionStorage.removeItem('__app_refresh_token');
    } catch (error) {
      console.error('Failed to clear refresh token:', error);
    }
  }

  /**
   * Initialize auth on app start
   */
  static async initialize(): Promise<AuthUser | null> {
    if (this.isAuthenticated()) {
      const user = await this.validateToken();
      if (user) {
        this.user = user;
      }
      return user;
    }
    return null;
  }
}
