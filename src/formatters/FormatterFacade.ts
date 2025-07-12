import { chunkArray } from './chunkingHandler.js';
import { FormatterMode } from './types.js';

const formatEmptyResult = (message: string) => message;

const conciseFormatter = (data: any) => {
  if (Array.isArray(data)) {
    return data.map(item => 
      item.name ? `${item.name} (ID: ${item.id})` : JSON.stringify(item)
    ).join('\n');
  }
  return JSON.stringify(data, null, 2);
};

const verboseFormatter = (data: any) => {
  return JSON.stringify(data, null, 2);
};

export const FormatterFacade = {
  formatResponse: (data: any, mode: FormatterMode = 'concise') => {
    if (!data) return formatEmptyResult('No data');
    
    if (Array.isArray(data) && data.length > 100) {
      const chunked = chunkArray(data, 100);
      const formatted = mode === 'concise' 
        ? conciseFormatter(chunked.chunks)
        : verboseFormatter(chunked.chunks);
      return `${formatted}\n\n[Showing ${chunked.metadata.showing} of ${chunked.metadata.total} items]`;
    }
    
    return mode === 'concise' ? conciseFormatter(data) : verboseFormatter(data);
  }
};