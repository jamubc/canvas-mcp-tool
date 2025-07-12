import { BaseTool } from './BaseTool.js';

// Simple in-memory cache implementation
class SimpleCache {
  private cache = new Map<string, { value: any; expires: number }>();

  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value as T;
  }

  set(key: string, value: any, ttl: number): void {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Simple logger implementation
class SimpleLogger {
  constructor(private name: string) {}

  info(message: string, ...args: any[]): void {
    console.log(`[${this.name}] INFO:`, message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    console.debug(`[${this.name}] DEBUG:`, message, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[${this.name}] ERROR:`, message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[${this.name}] WARN:`, message, ...args);
  }
}

// Shared cache instance
const sharedCache = new SimpleCache();

/**
 * Concrete implementation of BaseTool with real cache and logger
 */
export abstract class BaseToolImplementation extends BaseTool {
  protected getCache(): SimpleCache {
    return sharedCache;
  }

  protected getLogger(): SimpleLogger {
    return new SimpleLogger(this.constructor.name);
  }
}