
/**
 * Barrel file for centralizing tool exports.
 * Follows DRY principle by providing a single point of access to all tools.
 */

export { AssignmentsTool } from './assignments.js';
export { CoursesTool } from './courses.js';
export { FilesDashboardTool } from './files-dashboard.js';
export { UserProfileTool } from './user-profile.js';
export { CommunicationTool } from './communication.js';
export { ContentTool } from './content.js';
export { AssessmentTool } from './assessment.js';

export * from './schemas.js';

