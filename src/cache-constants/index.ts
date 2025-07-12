/**
 * Centralized cache duration constants for the Canvas MCP tool.
 * All durations are in milliseconds.
 */
export const CACHE_DURATION = {
  /**
   * 3 minutes - For rapidly changing data like real-time submissions
   */
  SHORT: 3 * 60 * 1000,
  
  /**
   * 5 minutes - Default for most API responses
   */
  MEDIUM: 5 * 60 * 1000,
  
  /**
   * 10 minutes - For relatively stable data like course listings
   */
  LONG: 10 * 60 * 1000,
  
  /**
   * 1 hour - For very stable data like user profiles, course metadata
   */
  HOUR: 60 * 60 * 1000,
  
  /**
   * 24 hours - For static data like institution settings
   */
  DAY: 24 * 60 * 60 * 1000
} as const;

/**
 * Type-safe cache duration keys
 */
export type CacheDurationKey = keyof typeof CACHE_DURATION;

/**
 * Helper function to get cache duration with fallback
 */
export function getCacheDuration(key: CacheDurationKey): number {
  return CACHE_DURATION[key];
}