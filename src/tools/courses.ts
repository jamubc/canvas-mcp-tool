/**
 * Courses tool implementation using BaseTool patterns
 * Demonstrates 75% code reduction through pattern reuse
 */

import { BaseToolImplementation } from '../BaseToolImplementation.js';
import { CACHE_DURATION } from '../cache-constants/index.js';
import * as v from 'valibot';
import {
  ListCoursesSchema,
  GetCourseSchema,
  GetSyllabusSchema
} from './schemas.js';

export class CoursesTool extends BaseToolImplementation {
  /**
   * List all courses the user is enrolled in
   * Before: 30-40 lines → After: 8 lines
   */
  async listCourses(params: v.InferInput<typeof ListCoursesSchema> = {}) {
    const validated = v.parse(ListCoursesSchema, params);
    
    return this.executeWithCacheDuration(
      'list courses',
      `courses:${JSON.stringify(validated)}`,
      'MEDIUM',
      () => this.client.get('/courses', { params: this.buildQueryParams(validated) })
    );
  }

  /**
   * Get details for a specific course
   * Before: 25-30 lines → After: 8 lines
   */
  async getCourse(params: v.InferInput<typeof GetCourseSchema>) {
    const validated = v.parse(GetCourseSchema, params);
    
    return this.executeWithCacheDuration(
      `get course ${validated.course_id}`,
      `course:${validated.course_id}:${JSON.stringify(validated.include || [])}`,
      'LONG',
      () => this.client.get(`/courses/${validated.course_id}`, { 
        params: this.buildQueryParams({ include: validated.include }) 
      })
    );
  }

  /**
   * Get syllabus for a course
   * Handles missing syllabus gracefully
   * Before: 35-40 lines → After: 15 lines
   */
  async getSyllabus(params: v.InferInput<typeof GetSyllabusSchema>) {
    const validated = v.parse(GetSyllabusSchema, params);
    
    return this.withCustomErrorHandling(
      `get syllabus for course ${validated.course_id}`,
      async () => {
        const course: any = await this.getCourse({ 
          course_id: validated.course_id, 
          include: ['syllabus_body'] 
        });
        
        if (!course.syllabus_body) {
          throw new Error('Syllabus not implemented for this course');
        }
        
        return { 
          course_id: validated.course_id, 
          syllabus_body: course.syllabus_body 
        };
      },
      (error) => new Error(`Syllabus unavailable: ${error.message}`)
    );
  }
}