import { config } from '../config/index.js';
import { createLogger } from './logger.js';

const logger = createLogger('Cache');

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class Cache {
  private cache: Map<string, CacheEntry<any>>;
  private enabled: boolean;
  private defaultTTL: number;

  constructor() {
    this.cache = new Map();
    this.enabled = config.cache.enabled;
    this.defaultTTL = config.cache.ttl * 1000; // Convert to milliseconds
  }

  set<T>(key: string, data: T, ttl?: number): void {
    if (!this.enabled) return;

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, entry);
    logger.debug(`Cache set: ${key}`);
  }

  get<T>(key: string): T | null {
    if (!this.enabled) return null;

    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      logger.debug(`Cache miss: ${key}`);
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      logger.debug(`Cache expired: ${key}`);
      return null;
    }

    logger.debug(`Cache hit: ${key}`);
    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
    logger.debug(`Cache delete: ${key}`);
  }

  clear(): void {
    this.cache.clear();
    logger.debug('Cache cleared');
  }

  size(): number {
    return this.cache.size;
  }
}

export const cache = new Cache();