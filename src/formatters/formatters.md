# Canvas API Response Formatters

A lightweight TypeScript utility for formatting Canvas API responses.

## What it does
- Formats Canvas API data into human-readable strings
- Handles large arrays by chunking them
- Supports concise (summary) and verbose (full JSON) modes
- Centralizes caching durations to avoid hardcoded values

## Files
- `FormatterFacade.ts` - Main entry point, handles mode switching
- `chunkingHandler.ts` - Splits large arrays into smaller chunks
- `cacheService.ts` - Defines cache duration constants
- `validationUtils.ts` - Validates input data
- `types.ts` - TypeScript interfaces

## Usage
```typescript
import { FormatterFacade } from './formatters/FormatterFacade';

// Concise mode (default)
const result = FormatterFacade.formatResponse(canvasData);

// Verbose mode
const detailed = FormatterFacade.formatResponse(canvasData, 'verbose');
```

## Design
- No classes where functions suffice (KISS)
- No duplicate code (DRY)
- Only implements what's needed (YAGNI)
- ~100 lines total vs 1000+ lines in previous implementation