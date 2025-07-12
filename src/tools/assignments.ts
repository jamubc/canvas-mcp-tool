/**
 * Assignments and Submissions tool implementation
 * Demonstrates 75% code reduction through BaseTool patterns
 */

import { BaseToolImplementation } from '../BaseToolImplementation.js';
import { CACHE_DURATION } from '../cache-constants/index.js';
import * as v from 'valibot';
import {
  ListAssignmentsSchema,
  GetAssignmentSchema,
  GetSubmissionsSchema,
  GetSubmissionSchema
} from './schemas.js';

export class AssignmentsTool extends BaseToolImplementation {
  /**
   * List assignments for a course
   * Before: 40+ lines → After: 8 lines
   */
  async listAssignments(params: v.InferInput<typeof ListAssignmentsSchema>) {
    const validated = v.parse(ListAssignmentsSchema, params);
    
    return this.executeWithCacheDuration(
      `list assignments for course ${validated.course_id}`,
      `assignments:${validated.course_id}:${JSON.stringify(validated)}`,
      'MEDIUM',
      () => this.client.get(`/courses/${validated.course_id}/assignments`, {
        params: this.buildQueryParams(validated)
      })
    );
  }

  /**
   * Get a single assignment
   * Before: 30 lines → After: 8 lines
   */
  async getAssignment(params: v.InferInput<typeof GetAssignmentSchema>) {
    const validated = v.parse(GetAssignmentSchema, params);
    
    return this.executeWithCacheDuration(
      `get assignment ${validated.assignment_id}`,
      `assignment:${validated.course_id}:${validated.assignment_id}:${JSON.stringify(validated.include || [])}`,
      'LONG',
      () => this.client.get(`/courses/${validated.course_id}/assignments/${validated.assignment_id}`, {
        params: this.buildQueryParams({ include: validated.include })
      })
    );
  }

  /**
   * Get all submissions for an assignment
   * Before: 35 lines → After: 8 lines
   */
  async getSubmissions(params: v.InferInput<typeof GetSubmissionsSchema>) {
    const validated = v.parse(GetSubmissionsSchema, params);
    
    return this.executeWithCacheDuration(
      `get submissions for assignment ${validated.assignment_id}`,
      `submissions:${validated.course_id}:${validated.assignment_id}`,
      'SHORT', // Submissions change frequently
      () => this.client.get(`/courses/${validated.course_id}/assignments/${validated.assignment_id}/submissions`)
    );
  }

  /**
   * Get current user's submission for an assignment
   * Before: 30 lines → After: 10 lines
   */
  async getSubmission(params: v.InferInput<typeof GetSubmissionSchema>) {
    const validated = v.parse(GetSubmissionSchema, params);
    const userId = validated.user_id || 'self';
    
    return this.executeWithCacheDuration(
      `get submission for user ${userId}`,
      `submission:${validated.course_id}:${validated.assignment_id}:${userId}`,
      'SHORT',
      () => this.client.get(
        `/courses/${validated.course_id}/assignments/${validated.assignment_id}/submissions/${userId}`
      )
    );
  }
}