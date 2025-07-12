import { CACHE_DURATION } from './cache-constants/index.js';
import { extractResponseData } from './utils/response-extractor.js';
import { FormatterFacade } from './formatters/FormatterFacade.js';

/**
 * Abstract base class that centralizes common patterns for Canvas MCP tools.
 * Eliminates code duplication across 30+ tool methods by providing:
 * - Caching with configurable TTL
 * - Standardized error handling and logging
 * - Query parameter building utilities
 * - Combined patterns for maximum code reduction
 */
export abstract class BaseTool {
  protected readonly client: any; // CanvasAPIClient - keeping generic to avoid import issues
  protected readonly cache: any; // Cache instance
  protected readonly logger: any; // Logger instance

  constructor(client: any) {
    this.client = client;
    this.cache = this.getCache(); // Implement in subclass or use dependency injection
    this.logger = this.getLogger(); // Implement in subclass or use dependency injection
  }

  /**
   * Get cache instance - to be implemented by subclasses or injected
   */
  protected abstract getCache(): any;

  /**
   * Get logger instance - to be implemented by subclasses or injected
   */
  protected abstract getLogger(): any;

  /**
   * Execute a method with caching.
   * Eliminates 30+ instances of identical cache get/set logic.
   */
  protected async withCache<T>(
    key: string,
    ttl: number,
    fn: () => Promise<T>
  ): Promise<T> {
    const cached = this.cache.get(key) as T | undefined;
    if (cached) {
      this.logger.debug(`Cache hit for ${key}`);
      return cached;
    }

    const result = await fn();
    const cleanResult = extractResponseData(result);
    this.cache.set(key, cleanResult, ttl);
    return cleanResult;
  }

  /**
   * Execute a method with standard error handling.
   * Eliminates 25+ identical try-catch-log-throw blocks.
   */
  protected async withErrorHandling<T>(
    action: string,
    fn: () => Promise<T>
  ): Promise<T> {
    try {
      this.logger.info(`Starting ${action}`);
      return await fn();
    } catch (error) {
      this.logger.error(`Failed to ${action}`, error);
      throw error;
    }
  }

  /**
   * Build query parameters from an object.
   * Eliminates 15+ instances of parameter validation and construction.
   */
  protected buildQueryParams(params: Record<string, any>): Record<string, any> {
    const queryParams: Record<string, any> = {};
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value) && value.length > 0) {
          queryParams[key] = value;
        } else if (!Array.isArray(value)) {
          queryParams[key] = value;
        }
      }
    });
    
    return queryParams;
  }

  /**
   * Combine all patterns for maximum code reduction.
   * Reduces tool methods from 30-40 lines to 5-10 lines.
   * Returns formatted string response for MCP compatibility.
   */
  protected async executeWithPatterns<T>(
    action: string,
    cacheKey: string,
    cacheTtl: number,
    apiCall: () => Promise<T>
  ): Promise<string> {
    const result = await this.withErrorHandling(action, () =>
      this.withCache(cacheKey, cacheTtl, apiCall)
    );
    // Format the response to string for MCP
    return FormatterFacade.formatResponse(result);
  }

  /**
   * Convenience method using semantic cache durations
   * Returns formatted string response for MCP compatibility.
   */
  protected async executeWithCacheDuration<T>(
    action: string,
    cacheKey: string,
    duration: keyof typeof CACHE_DURATION,
    apiCall: () => Promise<T>
  ): Promise<string> {
    return this.executeWithPatterns(action, cacheKey, CACHE_DURATION[duration], apiCall);
  }

  /**
   * Execute a method with conditional caching
   */
  protected async withConditionalCache<T>(
    condition: boolean,
    key: string,
    ttl: number,
    fn: () => Promise<T>
  ): Promise<T> {
    if (!condition) return fn();
    return this.withCache(key, ttl, fn);
  }

  /**
   * Execute a method with custom error handling
   */
  protected async withCustomErrorHandling<T>(
    action: string,
    fn: () => Promise<T>,
    errorTransformer?: (error: any) => Error
  ): Promise<T> {
    try {
      return await this.withErrorHandling(action, fn);
    } catch (error) {
      throw errorTransformer ? errorTransformer(error) : error;
    }
  }
}