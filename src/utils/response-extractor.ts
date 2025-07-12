/**
 * Simple utility to extract data from axios responses
 * Prevents circular reference errors in JSON serialization
 */
export function extractResponseData(response: any): any {
  return response?.data ?? response;
}