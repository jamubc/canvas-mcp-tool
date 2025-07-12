/**
 * Files and Dashboard tool implementation
 * Combines file management and dashboard features
 */

import { BaseToolImplementation } from '../BaseToolImplementation.js';
import { CACHE_DURATION } from '../cache-constants/index.js';
import * as v from 'valibot';
import {
  ListFilesSchema,
  GetFileSchema,
  GetDashboardCardsSchema,
  ListCalendarEventsSchema,
  GetUpcomingAssignmentsSchema
} from './schemas.js';

export class FilesDashboardTool extends BaseToolImplementation {
  // ===== Files Features =====
  
  /**
   * List files in a course or folder
   * Before: 35 lines → After: 10 lines
   */
  async listFiles(params: v.InferInput<typeof ListFilesSchema>) {
    const validated = v.parse(ListFilesSchema, params);
    const endpoint = validated.folder_id 
      ? `/folders/${validated.folder_id}/files`
      : `/courses/${validated.course_id}/files`;
    
    return this.executeWithCacheDuration(
      `list files for ${validated.folder_id ? 'folder' : 'course'}`,
      `files:${validated.course_id}:${validated.folder_id || 'root'}`,
      'MEDIUM',
      () => this.client.get(endpoint)
    );
  }

  /**
   * List all folders in a course
   * Before: 30 lines → After: 8 lines
   */
  async listFolders(params: { course_id: number }) {
    const validated = v.parse(v.object({ course_id: v.number() }), params);
    
    return this.executeWithCacheDuration(
      `list folders for course ${validated.course_id}`,
      `folders:${validated.course_id}`,
      'LONG', // Folder structure rarely changes
      () => this.client.get(`/courses/${validated.course_id}/folders`)
    );
  }

  /**
   * Get file metadata
   * Before: 25 lines → After: 8 lines
   */
  async getFile(params: v.InferInput<typeof GetFileSchema>) {
    const validated = v.parse(GetFileSchema, params);
    
    return this.executeWithCacheDuration(
      `get file ${validated.file_id}`,
      `file:${validated.file_id}`,
      'HOUR', // File metadata is very stable
      () => this.client.get(`/files/${validated.file_id}`)
    );
  }

  // ===== Dashboard Features =====

  /**
   * Get dashboard cards (course cards)
   * Before: 30 lines → After: 7 lines
   */
  async getDashboardCards(params: v.InferInput<typeof GetDashboardCardsSchema> = {}) {
    v.parse(GetDashboardCardsSchema, params);
    
    return this.executeWithCacheDuration(
      'get dashboard cards',
      'dashboard:cards',
      'MEDIUM',
      () => this.client.get('/dashboard/dashboard_cards')
    );
  }

  /**
   * Get dashboard (user's dashboard info)
   * Before: 25 lines → After: 7 lines
   */
  async getDashboard() {
    return this.executeWithCacheDuration(
      'get dashboard',
      'dashboard:main',
      'SHORT', // Dashboard updates frequently
      () => this.client.get('/users/self/dashboard')
    );
  }

  /**
   * List calendar events
   * Before: 40 lines → After: 8 lines
   */
  async listCalendarEvents(params: any = {}) {
    // Handle both array and object parameters flexibly
    let normalizedParams = {};
    if (Array.isArray(params)) {
      // If array is passed, treat as empty params for now
      normalizedParams = {};
    } else if (params && typeof params === 'object') {
      normalizedParams = params;
    }
    
    const validated = v.parse(ListCalendarEventsSchema, normalizedParams);
    
    return this.executeWithCacheDuration(
      'list calendar events',
      `calendar:${JSON.stringify(validated)}`,
      'SHORT', // Events change frequently
      () => this.client.get('/calendar_events', { params: this.buildQueryParams(validated) })
    );
  }

  /**
   * Get upcoming assignments and events
   * Before: 35 lines → After: 8 lines
   */
  async getUpcomingAssignments(params: v.InferInput<typeof GetUpcomingAssignmentsSchema> = {}) {
    v.parse(GetUpcomingAssignmentsSchema, params);
    
    return this.executeWithCacheDuration(
      'get upcoming assignments',
      'upcoming:assignments',
      'SHORT',
      () => this.client.get('/users/self/upcoming_events')
    );
  }
}