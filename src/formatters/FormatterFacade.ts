import { chunkArray } from './chunkingHandler.js';
import { FormatterMode } from './types.js';

const formatEmptyResult = (message: string) => message;

const conciseFormatter = (data: any) => {
  if (Array.isArray(data)) {
    return data.map(item => {
      // Handle course objects with better formatting
      if (item.course_code || item.original_name || item.workflow_state === 'available') {
        const courseCode = item.course_code || 'NO-CODE';
        const courseName = item.name || item.original_name || 'Unnamed Course';
        const termName = item.term?.name || '';
        const enrollmentType = item.enrollments?.[0]?.type || '';
        const restricted = item.access_restricted_by_date ? ' [ACCESS RESTRICTED]' : '';
        const concluded = item.workflow_state === 'completed' ? ' [CONCLUDED]' : '';
        
        let output = `Code: ${courseCode}\n`;
        output += `Name: ${courseName}\n`;
        output += `ID: ${item.id}`;
        if (termName) output += `\nTerm: ${termName}`;
        if (enrollmentType) output += `\nRole: ${enrollmentType}`;
        output += `${restricted}${concluded}\n`;
        
        return output;
      }
      // Handle assignment objects
      if (item.due_at !== undefined && item.points_possible !== undefined) {
        const name = item.name || 'Unnamed Assignment';
        const dueDate = item.due_at ? new Date(item.due_at).toLocaleDateString() : 'No due date';
        const points = item.points_possible || 0;
        return `${name}\nDue: ${dueDate}\nPoints: ${points}\nID: ${item.id}\n`;
      }
      // Handle objects with name property
      if (item.name) {
        return `${item.name} (ID: ${item.id})`;
      }
      // Fallback to JSON
      return JSON.stringify(item);
    }).join('\n');
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