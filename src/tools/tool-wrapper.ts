/**
 * Simple wrapper to format tool responses using existing FormatterFacade
 * Following KISS principle - minimal abstraction
 */

import { FormatterFacade } from '../formatters/FormatterFacade.js';

/**
 * Wrap a tool method to format its response
 */
export function wrapTool<T extends (...args: any[]) => Promise<any>>(
  method: T,
  toolName: string,
  mode: 'concise' | 'verbose' = 'concise'
): T {
  return (async (...args: Parameters<T>) => {
    const result = await method(...args);
    return FormatterFacade.formatResponse(result, mode);
  }) as T;
}