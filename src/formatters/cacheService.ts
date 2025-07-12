import { CACHE_DURATION } from '../cache-constants/index.js';

export { CACHE_DURATION }; // Re-export for formatter use

export const fetchWithCache = async (
  key: string, 
  ttl = CACHE_DURATION.MEDIUM // Use constant as default
) => {
  // Implementation
};