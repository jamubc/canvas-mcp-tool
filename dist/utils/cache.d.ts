export declare class Cache {
    private cache;
    private enabled;
    private defaultTTL;
    constructor();
    set<T>(key: string, data: T, ttl?: number): void;
    get<T>(key: string): T | null;
    delete(key: string): void;
    clear(): void;
    size(): number;
}
export declare const cache: Cache;
//# sourceMappingURL=cache.d.ts.map