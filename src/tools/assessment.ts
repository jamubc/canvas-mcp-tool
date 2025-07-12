/**
 * Assessment tool implementation
 * Handles quizzes and rubrics
 */

import { BaseToolImplementation } from '../BaseToolImplementation.js';
import { CACHE_DURATION } from '../cache-constants/index.js';
import * as v from 'valibot';
import {
  ListQuizzesSchema,
  GetQuizSchema,
  ListRubricsSchema,
  GetRubricSchema
} from './schemas.js';

export class AssessmentTool extends BaseToolImplementation {
  // ===== Quizzes Features =====
  
  /**
   * List all quizzes in a course
   * Before: 35 lines → After: 8 lines
   */
  async listQuizzes(params: v.InferInput<typeof ListQuizzesSchema>) {
    const validated = v.parse(ListQuizzesSchema, params);
    
    return this.executeWithCacheDuration(
      `list quizzes for course ${validated.course_id}`,
      `quizzes:${validated.course_id}`,
      'MEDIUM',
      () => this.client.get(`/courses/${validated.course_id}/quizzes`)
    );
  }

  /**
   * Get a single quiz
   * Before: 30 lines → After: 8 lines
   */
  async getQuiz(params: v.InferInput<typeof GetQuizSchema>) {
    const validated = v.parse(GetQuizSchema, params);
    
    return this.executeWithCacheDuration(
      `get quiz ${validated.quiz_id}`,
      `quiz:${validated.course_id}:${validated.quiz_id}`,
      'LONG', // Quiz structure is stable
      () => this.client.get(`/courses/${validated.course_id}/quizzes/${validated.quiz_id}`)
    );
  }

  // ===== Rubrics Features =====
  
  /**
   * List all rubrics in a course
   * Before: 35 lines → After: 8 lines
   */
  async listRubrics(params: v.InferInput<typeof ListRubricsSchema>) {
    const validated = v.parse(ListRubricsSchema, params);
    
    return this.executeWithCacheDuration(
      `list rubrics for course ${validated.course_id}`,
      `rubrics:${validated.course_id}`,
      'LONG', // Rubrics rarely change
      () => this.client.get(`/courses/${validated.course_id}/rubrics`)
    );
  }

  /**
   * Get a specific rubric
   * Before: 30 lines → After: 8 lines
   */
  async getRubric(params: v.InferInput<typeof GetRubricSchema>) {
    const validated = v.parse(GetRubricSchema, params);
    
    return this.executeWithCacheDuration(
      `get rubric ${validated.rubric_id}`,
      `rubric:${validated.course_id}:${validated.rubric_id}`,
      'HOUR', // Rubrics are very stable
      () => this.client.get(`/courses/${validated.course_id}/rubrics/${validated.rubric_id}`)
    );
  }
}