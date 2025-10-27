/**
 * Cache utility module
 * Provides generic caching functionality with TTL support
 */

/**
 * Represents a single cache entry with data and timestamp
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Configuration options for cache behavior
 */interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  enabled: boolean;
}

/**
 * Default cache configuration
 * TTL: 5 minutes, enabled by default
 */
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  enabled: true,
};

/**
 * Generic cache manager with TTL support and pattern-based invalidation
 * 
 * @example
 * const cache = new CacheManager<Instruction>({ ttl: 10 * 60 * 1000 });
 * cache.set('instruction:123', instructionData);
 * const data = cache.get('instruction:123');
 * cache.invalidateByPattern(/^instruction:/);
 */
export class CacheManager<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CACHE_CONFIG, ...config };
  }

  /**
   * Store data in cache with current timestamp
   */
  set(key: string, data: T): void {
    if (!this.config.enabled) return;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Retrieve data from cache if not expired
   * Returns null if cache is disabled, key doesn't exist, or entry is expired
   */
  get(key: string): T | null {
    if (!this.config.enabled) return null;
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.config.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Check if a key exists in cache and hasn't expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Delete a specific cache entry by key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching a regex pattern
   * Useful for invalidating related cache entries after mutations
   * 
   * @example
   * // Invalidate all list caches after create/update/delete
   * cache.invalidateByPattern(/^instructions:list:/);
   */
  invalidateByPattern(pattern: RegExp): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (pattern.test(key)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Get cache statistics for debugging
   */
  getStats(): { size: number; enabled: boolean; ttl: number } {
    return {
      size: this.cache.size,
      enabled: this.config.enabled,
      ttl: this.config.ttl,
    };
  }
}

/**
 * Cache key builder helper for consistent key generation
 */
export class CacheKeyBuilder {
  static instruction = {
    list: (params?: Record<string, any>) => `instructions:list:${JSON.stringify(params || {})}`,
    detail: (id: string) => `instructions:detail:${id}`,
    related: (id: string) => `instructions:related:${id}`,
  };

  static prompt = {
    list: (params?: Record<string, any>) => `prompts:list:${JSON.stringify(params || {})}`,
    detail: (id: string) => `prompts:detail:${id}`,
    related: (id: string) => `prompts:related:${id}`,
  };

  static collection = {
    list: (params?: Record<string, any>) => `collections:list:${JSON.stringify(params || {})}`,
    detail: (id: string) => `collections:detail:${id}`,
  };
}
