/**
 * User Profile and Grades tool implementation
 * Handles user profiles, grades, and student-specific features
 */

import { BaseToolImplementation } from '../BaseToolImplementation.js';
import { CACHE_DURATION } from '../cache-constants/index.js';
import * as v from 'valibot';
import {
  GetUserProfileSchema,
  GetCourseGradesSchema,
  GetUserGradesSchema,
  ListStudentCoursesSchema
} from './schemas.js';

export class UserProfileTool extends BaseToolImplementation {
  // ===== User Profile Features =====
  
  /**
   * Get user profile
   * Before: 30 lines → After: 8 lines
   */
  async getUserProfile(params: v.InferInput<typeof GetUserProfileSchema> = {}) {
    const validated = v.parse(GetUserProfileSchema, params);
    const userId = validated.user_id || 'self';
    
    return this.executeWithCacheDuration(
      `get profile for user ${userId}`,
      `profile:${userId}`,
      'HOUR', // Profile data is very stable
      () => this.client.get(`/users/${userId}/profile`)
    );
  }

  // ===== Grades Features =====
  
  /**
   * Get grades for all enrollments in a course
   * Before: 35 lines → After: 8 lines
   */
  async getCourseGrades(params: v.InferInput<typeof GetCourseGradesSchema>) {
    const validated = v.parse(GetCourseGradesSchema, params);
    
    return this.executeWithCacheDuration(
      `get grades for course ${validated.course_id}`,
      `grades:course:${validated.course_id}`,
      'SHORT', // Grades change frequently
      () => this.client.get(`/courses/${validated.course_id}/enrollments`, {
        params: { include: ['grades'] }
      })
    );
  }

  /**
   * Get current user's grades across all courses
   * Before: 30 lines → After: 8 lines
   */
  async getUserGrades(params: v.InferInput<typeof GetUserGradesSchema> = {}) {
    v.parse(GetUserGradesSchema, params);
    
    return this.executeWithCacheDuration(
      'get user grades',
      'grades:user:self',
      'SHORT',
      () => this.client.get('/users/self/enrollments', {
        params: { include: ['grades'] }
      })
    );
  }

  // ===== Student-Specific Features =====
  
  /**
   * List all active courses for current user (student view)
   * Before: 35 lines → After: 8 lines
   */
  async listStudentCourses(params: v.InferInput<typeof ListStudentCoursesSchema> = {}) {
    v.parse(ListStudentCoursesSchema, params);
    
    return this.executeWithCacheDuration(
      'list student courses',
      'student:courses:active',
      'MEDIUM',
      () => this.client.get('/courses', {
        params: { 
          enrollment_state: 'active',
          enrollment_type: 'student'
        }
      })
    );
  }
}