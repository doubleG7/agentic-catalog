import DOMPurify from 'dompurify';

/**
 * Secure input sanitization utilities
 */
export class SecurityUtils {
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOW_DATA_ATTR: false,
    });
  }

  /**
   * Sanitize plain text input
   */
  static sanitizeText(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }

  /**
   * Validate and sanitize email addresses
   */
  static sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeText(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  /**
   * Sanitize user input for safe display
   */
  static sanitizeUserInput(input: string, allowHtml = false): string {
    if (allowHtml) {
      return this.sanitizeHtml(input);
    }
    return this.sanitizeText(input);
  }

  /**
   * Sanitize form data recursively
   */
  static sanitizeFormData<T extends Record<string, any>>(data: T): T {
    const sanitized = { ...data };
    
    for (const key in sanitized) {
      if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        if (Array.isArray(sanitized[key])) {
          sanitized[key] = sanitized[key].map((item: any) => 
            typeof item === 'string' ? this.sanitizeText(item) : item
          ) as T[Extract<keyof T, string>];
        } else {
          sanitized[key] = this.sanitizeFormData(sanitized[key]) as T[Extract<keyof T, string>];
        }
      } else if (typeof sanitized[key] === 'string') {
        sanitized[key] = this.sanitizeText(sanitized[key]) as T[Extract<keyof T, string>];
      }
    }
    
    return sanitized;
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Secure error message filtering
   */
  static sanitizeErrorMessage(error: any): string {
    const defaultMessage = 'An error occurred. Please try again.';
    
    if (!error) return defaultMessage;
    
    // Don't expose sensitive information
    const sensitivePatterns = [
      /password/i,
      /token/i,
      /key/i,
      /secret/i,
      /internal/i,
      /database/i,
      /sql/i,
    ];
    
    const message = error.message || error.toString() || defaultMessage;
    
    for (const pattern of sensitivePatterns) {
      if (pattern.test(message)) {
        return defaultMessage;
      }
    }
    
    return this.sanitizeText(message);
  }
}

/**
 * Secure authentication utilities
 */
export class AuthUtils {
  private static readonly TOKEN_KEY = '__app_auth_token';
  private static readonly CSRF_KEY = '__app_csrf_token';

  /**
   * Secure token storage using sessionStorage with encryption-like obfuscation
   * Note: In production, this should use httpOnly cookies
   */
  static setSecureToken(token: string): void {
    try {
      // Basic obfuscation (in production, use proper encryption)
      const obfuscated = btoa(token + ':' + Date.now());
      sessionStorage.setItem(this.TOKEN_KEY, obfuscated);
    } catch (error) {
      console.error('Failed to store token securely:', error);
    }
  }

  /**
   * Retrieve secure token
   */
  static getSecureToken(): string | null {
    try {
      const obfuscated = sessionStorage.getItem(this.TOKEN_KEY);
      if (!obfuscated) return null;
      
      const decoded = atob(obfuscated);
      const [token] = decoded.split(':');
      return token || null;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }

  /**
   * Remove token securely
   */
  static clearSecureToken(): void {
    try {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.CSRF_KEY);
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  /**
   * Set CSRF token
   */
  static setCSRFToken(token: string): void {
    try {
      sessionStorage.setItem(this.CSRF_KEY, token);
      // Also set in meta tag for server-side access
      let metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.name = 'csrf-token';
        document.head.appendChild(metaTag);
      }
      metaTag.content = token;
    } catch (error) {
      console.error('Failed to set CSRF token:', error);
    }
  }

  /**
   * Get CSRF token
   */
  static getCSRFToken(): string {
    try {
      return sessionStorage.getItem(this.CSRF_KEY) || '';
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
      return '';
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getSecureToken();
  }

  /**
   * Get secure headers for API requests
   */
  static getSecureHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };

    const token = this.getSecureToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      headers['X-CSRF-TOKEN'] = csrfToken;
    }

    return headers;
  }
}