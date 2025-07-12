import { FastMCP } from 'fastmcp';
import { fixSchemaForGemini } from './gemini-schema-fix.js';

/**
 * Extended FastMCP that fixes schemas for Google Vertex AI compatibility
 */
export class GeminiFastMCP extends FastMCP {
  constructor(options: any) {
    super(options);
    
    // Override the internal server's tool list handler
    const originalServer = (this as any).server || (this as any)._server || (this as any)['#server'];
    if (originalServer && originalServer.setRequestHandler) {
      const originalSetRequestHandler = originalServer.setRequestHandler.bind(originalServer);
      
      // Intercept ListToolsRequestSchema handler
      originalServer.setRequestHandler = (schema: any, handler: any) => {
        if (schema.method === 'tools/list' || schema.parse?.toString().includes('tools/list')) {
          // Wrap the handler to fix schemas
          const wrappedHandler = async (...args: any[]) => {
            const result = await handler(...args);
            if (result && result.tools) {
              // Fix each tool's inputSchema
              result.tools = result.tools.map((tool: any) => ({
                ...tool,
                inputSchema: fixSchemaForGemini(tool.inputSchema)
              }));
            }
            return result;
          };
          return originalSetRequestHandler(schema, wrappedHandler);
        }
        return originalSetRequestHandler(schema, handler);
      };
    }
  }
}