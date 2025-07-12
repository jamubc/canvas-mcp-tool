# Cache Constants

Centralized cache duration definitions to eliminate 30+ hardcoded millisecond values scattered throughout the Canvas MCP codebase.

## Problem Statement

The codebase contains **30+ hardcoded cache duration values**:
- `300000` (5 minutes) - appears 16 times
- `180000` (3 minutes) - appears 4 times  
- `600000` (10 minutes) - appears 1 time
- `3600 * 1000` (1 hour) - appears 1 time

This creates several issues:
- **Magic numbers**: Developers must calculate milliseconds mentally
- **Inconsistency**: Same duration expressed differently (`300000` vs `5 * 60 * 1000`)
- **Maintenance burden**: Changing cache strategy requires finding all instances
- **No semantic meaning**: `300000` doesn't convey intent like `CACHE_DURATION.MEDIUM`

## Solution Design

A centralized constants module that provides semantic cache durations with clear documentation.

### Implementation

```typescript
// cache-constants/index.ts

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
```

## Integration with Existing Systems

### With cacheService.ts (formatters)
The formatters already have a `cacheService.ts`. This cache-constants module should be imported there:

```typescript
// utilities/formatters/cacheService.ts
import { CACHE_DURATION } from '../../cache-constants/index.js';

export { CACHE_DURATION }; // Re-export for formatter use

export const fetchWithCache = async (
  key: string, 
  ttl = CACHE_DURATION.MEDIUM // Use constant as default
) => {
  // Implementation
};
```

### With BaseTool Pattern
```typescript
// base-tool-class/BaseTool.ts
import { CACHE_DURATION } from '../cache-constants/index.js';

export abstract class BaseTool {
  protected async cacheMethod<T>(
    key: string,
    duration: keyof typeof CACHE_DURATION,
    fn: () => Promise<T>
  ): Promise<T> {
    return this.withCache(key, CACHE_DURATION[duration], fn);
  }
}
```

## Migration Guide

### Locations of Hardcoded Values

Based on the dead code analysis, here are all locations with hardcoded cache durations:

#### 300000 (5 minutes) - 16 instances
- `tools/users.ts`: lines 38, 81
- `tools/assignments.ts`: lines 117, 148
- `tools/dashboard.ts`: lines 39, 101, 111
- `tools/courses.ts`: lines 73, 104, 136, 308, 351, 606 (and more)
- `tools/files.ts`: lines 42, 163

#### 180000 (3 minutes) - 4 instances
- `tools/courses.ts`: lines 180, 295
- `tools/courses.ts`: lines 539, 594

#### 600000 (10 minutes) - 1 instance
- `tools/courses.ts`: line 365

#### 3600 * 1000 (1 hour) - 1 instance
- `tools/files.ts`: line 160

### Before/After Examples

#### Before
```typescript
// Hardcoded magic number
cache.set(cacheKey, courses, 300000); // What does 300000 mean?

// Inline calculation
cache.set(cacheKey, profile, 3600 * 1000); // 1 hour
```

#### After
```typescript
// Semantic constant
cache.set(cacheKey, courses, CACHE_DURATION.MEDIUM);

// Clear intent
cache.set(cacheKey, profile, CACHE_DURATION.HOUR);
```

### Tool-Specific Migration

#### CoursesTool
```typescript
// Before
cache.set(cacheKey, syllabus, 600000); // 10 minutes
cache.set(cacheKey, modules, 300000); // 5 minutes

// After
cache.set(cacheKey, syllabus, CACHE_DURATION.LONG);
cache.set(cacheKey, modules, CACHE_DURATION.MEDIUM);
```

#### FilesTool
```typescript
// Before
cache.set(cacheKey, metadata, 3600 * 1000); // 1 hour

// After
cache.set(cacheKey, metadata, CACHE_DURATION.HOUR);
```

## Usage Guidelines

### When to Use Each Duration

| Duration | Use Case | Examples |
|----------|----------|----------|
| SHORT (3m) | Rapidly changing data | Active submissions, real-time grades |
| MEDIUM (5m) | Standard API responses | Course lists, assignments |
| LONG (10m) | Stable data | Course modules, syllabus |
| HOUR | Very stable data | User profiles, file metadata |
| DAY | Static data | Institution config, feature flags |

### Adding New Durations

If a new duration is needed:

1. Add to `CACHE_DURATION` object with clear documentation
2. Use semantic naming (e.g., `VERY_SHORT`, not `NINETY_SECONDS`)
3. Document the use case in comments
4. Update this documentation

## Testing Considerations

### Unit Tests
```typescript
describe('CACHE_DURATION', () => {
  it('should have correct millisecond values', () => {
    expect(CACHE_DURATION.SHORT).toBe(180000); // 3 minutes
    expect(CACHE_DURATION.MEDIUM).toBe(300000); // 5 minutes
    expect(CACHE_DURATION.LONG).toBe(600000); // 10 minutes
    expect(CACHE_DURATION.HOUR).toBe(3600000); // 1 hour
  });

  it('should be immutable', () => {
    expect(() => {
      // @ts-expect-error
      CACHE_DURATION.MEDIUM = 123;
    }).toThrow();
  });
});
```

### Integration Tests
```typescript
it('should use appropriate cache duration', async () => {
  const tool = new CoursesTool(client);
  await tool.listCourses({});
  
  expect(mockCache.set).toHaveBeenCalledWith(
    expect.any(String),
    expect.any(Array),
    CACHE_DURATION.MEDIUM
  );
});
```

## Design Principles

### DRY (Don't Repeat Yourself)
- Single source of truth for cache durations
- No duplicate millisecond calculations
- Centralized documentation

### KISS (Keep It Simple, Stupid)
- Simple object with clear property names
- No complex logic or calculations
- Direct millisecond values for performance

### YAGNI (You Aren't Gonna Need It)
- Only includes durations actually used in codebase
- No speculative "might need" durations
- Can extend when new requirements emerge

## Benefits

1. **Readability**: `CACHE_DURATION.MEDIUM` vs `300000`
2. **Maintainability**: Change durations in one place
3. **Consistency**: Same duration always expressed the same way
4. **Documentation**: Intent is clear from constant name
5. **Type Safety**: TypeScript ensures valid duration keys
6. **Testability**: Easy to mock and verify cache durations

## Migration Checklist

- [ ] Create cache-constants/index.ts
- [ ] Import in cacheService.ts (formatters)
- [ ] Import in BaseTool.ts
- [ ] Find/replace all instances of 300000
- [ ] Find/replace all instances of 180000
- [ ] Find/replace all instances of 600000
- [ ] Find/replace all instances of 3600 * 1000
- [ ] Run tests to verify behavior unchanged
- [ ] Update tool documentation