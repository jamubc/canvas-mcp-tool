import { z } from 'zod';
import { createLogger } from '../utils/logger.js';
import { cache } from '../utils/cache.js';
const logger = createLogger('AssignmentsTools');
export const ListAssignmentsSchema = z.object({
    course_id: z.number(),
    include: z.array(z.enum(['submission', 'assignment_visibility', 'all_dates', 'overrides', 'observed_users'])).optional(),
    search_term: z.string().optional(),
    override_assignment_dates: z.boolean().optional(),
    needs_grading_count_by_section: z.boolean().optional(),
    bucket: z.enum(['past', 'overdue', 'undated', 'ungraded', 'unsubmitted', 'upcoming', 'future']).optional(),
    assignment_ids: z.array(z.number()).optional(),
    order_by: z.enum(['position', 'name', 'due_at']).optional(),
});
export const GetAssignmentSchema = z.object({
    course_id: z.number(),
    assignment_id: z.number(),
    include: z.array(z.enum(['submission', 'assignment_visibility', 'overrides', 'observed_users'])).optional(),
});
export const SubmitAssignmentSchema = z.object({
    course_id: z.number(),
    assignment_id: z.number(),
    submission_type: z.enum(['online_text_entry', 'online_url', 'online_upload', 'media_recording']),
    body: z.string().optional(),
    url: z.string().url().optional(),
    file_ids: z.array(z.number()).optional(),
    media_comment_id: z.string().optional(),
    media_comment_type: z.enum(['audio', 'video']).optional(),
});
export class AssignmentsTools {
    client;
    constructor(client) {
        this.client = client;
    }
    async listAssignments(params) {
        try {
            const cacheKey = `assignments:${params.course_id}:${JSON.stringify(params)}`;
            const cached = cache.get(cacheKey);
            if (cached) {
                return cached;
            }
            logger.info(`Fetching assignments for course ${params.course_id}`, params);
            const queryParams = {};
            if (params.include && params.include.length > 0) {
                queryParams.include = params.include;
            }
            if (params.search_term) {
                queryParams.search_term = params.search_term;
            }
            if (params.override_assignment_dates !== undefined) {
                queryParams.override_assignment_dates = params.override_assignment_dates;
            }
            if (params.needs_grading_count_by_section !== undefined) {
                queryParams.needs_grading_count_by_section = params.needs_grading_count_by_section;
            }
            if (params.bucket) {
                queryParams.bucket = params.bucket;
            }
            if (params.assignment_ids && params.assignment_ids.length > 0) {
                queryParams.assignment_ids = params.assignment_ids;
            }
            if (params.order_by) {
                queryParams.order_by = params.order_by;
            }
            const assignments = await this.client.getAllPages(`/courses/${params.course_id}/assignments`, queryParams);
            cache.set(cacheKey, assignments, 180000); // Cache for 3 minutes
            logger.info(`Fetched ${assignments.length} assignments`);
            return assignments;
        }
        catch (error) {
            logger.error(`Failed to list assignments for course ${params.course_id}`, error);
            throw error;
        }
    }
    async getAssignment(params) {
        try {
            const cacheKey = `assignment:${params.course_id}:${params.assignment_id}:${JSON.stringify(params.include)}`;
            const cached = cache.get(cacheKey);
            if (cached) {
                return cached;
            }
            logger.info(`Fetching assignment ${params.assignment_id} from course ${params.course_id}`);
            const queryParams = {};
            if (params.include && params.include.length > 0) {
                queryParams.include = params.include;
            }
            const response = await this.client.get(`/courses/${params.course_id}/assignments/${params.assignment_id}`, queryParams);
            cache.set(cacheKey, response.data, 180000); // Cache for 3 minutes
            return response.data;
        }
        catch (error) {
            logger.error(`Failed to get assignment ${params.assignment_id}`, error);
            throw error;
        }
    }
    async submitAssignment(params) {
        // COMMENTED OUT FOR SAFETY - DO NOT ENABLE WITHOUT EXPLICIT PERMISSION
        throw new Error('Assignment submission is disabled for this release. This feature is commented out to prevent accidental submissions.');
        /*
        try {
          logger.info(`Submitting assignment ${params.assignment_id} for course ${params.course_id}`);
          
          const submissionData: Record<string, any> = {
            submission: {
              submission_type: params.submission_type,
            }
          };
    
          if (params.submission_type === 'online_text_entry' && params.body) {
            submissionData.submission.body = params.body;
          }
          
          if (params.submission_type === 'online_url' && params.url) {
            submissionData.submission.url = params.url;
          }
          
          if (params.submission_type === 'online_upload' && params.file_ids) {
            submissionData.submission.file_ids = params.file_ids;
          }
          
          if (params.submission_type === 'media_recording') {
            if (params.media_comment_id) {
              submissionData.submission.media_comment_id = params.media_comment_id;
            }
            if (params.media_comment_type) {
              submissionData.submission.media_comment_type = params.media_comment_type;
            }
          }
    
          const response = await this.client.post<CanvasSubmission>(
            `/courses/${params.course_id}/assignments/${params.assignment_id}/submissions`,
            submissionData
          );
          
          // Clear cache for this assignment and course assignments
          cache.delete(`assignment:${params.course_id}:${params.assignment_id}:*`);
          cache.delete(`assignments:${params.course_id}:*`);
          
          logger.info(`Successfully submitted assignment ${params.assignment_id}`);
          return response.data;
        } catch (error) {
          logger.error(`Failed to submit assignment ${params.assignment_id}`, error);
          throw error;
        }
        */
    }
}
//# sourceMappingURL=assignments.js.map