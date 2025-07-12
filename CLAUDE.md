fastmcp is a TypeScript framework for building MCP servers.

YOU MUST FOLLOW THE CODING RULES:
- **DRY**: Centralize shared logic in `src/`
  - Shared caching and TTL behavior: `src/cache-constants`
  - Constants & types: `src/cache-constants/index.ts`, `src/formatters/types.ts`
  - Formatter orchestration: `src/formatters/FormatterFacade.ts`
  - Core tool logic: `src/BaseTool.ts`, `src/BaseToolImplementation.ts`
  - Generic utilities: `src/utils/response-extractor.ts`, `src/utils/validationUtils.ts`
- **KISS**: Use utility functions over classes where possible.  
- **YAGNI**: Avoid speculative abstractions (only implement what’s explicitly needed).  

Use Valibot not ZOD. 

For schemas use: Standard Schema (https://standardschema.dev/). 


