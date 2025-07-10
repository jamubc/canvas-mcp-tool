import { z } from 'zod';
import { CanvasAPIClient } from '../api/canvas-client.js';
import { CanvasCourse } from '../types/canvas.js';
import { createLogger } from '../utils/logger.js';
import { cache } from '../utils/cache.js';

const logger = createLogger('CoursesTools');

export const ListCoursesSchema = z.object({
  enrollment_type: z.enum(['teacher', 'student', 'ta', 'observer', 'designer']).optional(),
  enrollment_state: z.enum(['active', 'invited', 'completed']).optional(),
  include: z.array(z.enum(['syllabus_body', 'term', 'course_progress', 'total_students', 'teachers'])).optional(),
});

export const GetCourseSchema = z.object({
  course_id: z.number(),
  include: z.array(z.enum(['syllabus_body', 'term', 'course_progress', 'total_students', 'teachers'])).optional(),
});

export const GetCourseModulesSchema = z.object({
  course_id: z.number(),
  include: z.array(z.enum(['items', 'content_details'])).optional(),
});

export class CoursesTools {
  constructor(private client: CanvasAPIClient) {}

  async listCourses(params: z.infer<typeof ListCoursesSchema>): Promise<CanvasCourse[]> {
    try {
      const cacheKey = `courses:${JSON.stringify(params)}`;
      const cached = cache.get<CanvasCourse[]>(cacheKey);
      
      if (cached) {
        return cached;
      }

      logger.info('Fetching user courses', params);
      
      const queryParams: Record<string, any> = {};
      
      if (params.enrollment_type) {
        queryParams.enrollment_type = params.enrollment_type;
      }
      
      if (params.enrollment_state) {
        queryParams.enrollment_state = params.enrollment_state;
      }
      
      if (params.include && params.include.length > 0) {
        queryParams.include = params.include;
      }

      const courses = await this.client.getAllPages<CanvasCourse>('/courses', queryParams);
      
      cache.set(cacheKey, courses, 300000); // Cache for 5 minutes
      
      logger.info(`Fetched ${courses.length} courses`);
      return courses;
    } catch (error) {
      logger.error('Failed to list courses', error);
      throw error;
    }
  }

  async getCourse(params: z.infer<typeof GetCourseSchema>): Promise<CanvasCourse> {
    try {
      const cacheKey = `course:${params.course_id}:${JSON.stringify(params.include)}`;
      const cached = cache.get<CanvasCourse>(cacheKey);
      
      if (cached) {
        return cached;
      }

      logger.info(`Fetching course ${params.course_id}`);
      
      const queryParams: Record<string, any> = {};
      
      if (params.include && params.include.length > 0) {
        queryParams.include = params.include;
      }

      const response = await this.client.get<CanvasCourse>(
        `/courses/${params.course_id}`,
        queryParams
      );
      
      cache.set(cacheKey, response.data, 300000); // Cache for 5 minutes
      
      return response.data;
    } catch (error) {
      logger.error(`Failed to get course ${params.course_id}`, error);
      throw error;
    }
  }

  async getCourseModules(params: z.infer<typeof GetCourseModulesSchema>): Promise<any[]> {
    try {
      const cacheKey = `modules:${params.course_id}:${JSON.stringify(params.include)}`;
      const cached = cache.get<any[]>(cacheKey);
      
      if (cached) {
        return cached;
      }

      logger.info(`Fetching modules for course ${params.course_id}`);
      
      const queryParams: Record<string, any> = {};
      
      if (params.include && params.include.length > 0) {
        queryParams.include = params.include;
      }

      const modules = await this.client.getAllPages<any>(
        `/courses/${params.course_id}/modules`,
        queryParams
      );
      
      cache.set(cacheKey, modules, 300000); // Cache for 5 minutes
      
      logger.info(`Fetched ${modules.length} modules`);
      return modules;
    } catch (error) {
      logger.error(`Failed to get modules for course ${params.course_id}`, error);
      throw error;
    }
  }
}