import { config } from '../config/index.js';
import { createLogger } from './logger.js';
const logger = createLogger('Cache');
export class Cache {
    cache;
    enabled;
    defaultTTL;
    constructor() {
        this.cache = new Map();
        this.enabled = config.cache.enabled;
        this.defaultTTL = config.cache.ttl * 1000; // Convert to milliseconds
    }
    set(key, data, ttl) {
        if (!this.enabled)
            return;
        const entry = {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.defaultTTL,
        };
        this.cache.set(key, entry);
        logger.debug(`Cache set: ${key}`);
    }
    get(key) {
        if (!this.enabled)
            return null;
        const entry = this.cache.get(key);
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
    delete(key) {
        this.cache.delete(key);
        logger.debug(`Cache delete: ${key}`);
    }
    clear() {
        this.cache.clear();
        logger.debug('Cache cleared');
    }
    size() {
        return this.cache.size;
    }
}
export const cache = new Cache();
//# sourceMappingURL=cache.js.map