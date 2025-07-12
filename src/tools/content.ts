/**
 * Content tool implementation
 * Handles pages, modules, discussions, and announcements
 */

import { BaseToolImplementation } from '../BaseToolImplementation.js';
import { CACHE_DURATION } from '../cache-constants/index.js';
import * as v from 'valibot';
import {
  ListPagesSchema,
  GetPageSchema,
  ListModulesSchema,
  GetModuleSchema,
  GetModuleItemSchema,
  ListDiscussionTopicsSchema,
  GetDiscussionTopicSchema,
  ListAnnouncementsSchema
} from './schemas.js';

export class ContentTool extends BaseToolImplementation {
  // ===== Content Pages Features =====
  
  /**
   * List content pages in a course
   * Before: 30 lines → After: 8 lines
   */
  async listPages(params: v.InferInput<typeof ListPagesSchema>) {
    const validated = v.parse(ListPagesSchema, params);
    
    return this.executeWithCacheDuration(
      `list pages for course ${validated.course_id}`,
      `pages:${validated.course_id}`,
      'MEDIUM',
      () => this.client.get(`/courses/${validated.course_id}/pages`)
    );
  }

  /**
   * Get a single content page
   * Before: 30 lines → After: 8 lines
   */
  async getPage(params: v.InferInput<typeof GetPageSchema>) {
    const validated = v.parse(GetPageSchema, params);
    
    return this.executeWithCacheDuration(
      `get page ${validated.page_url}`,
      `page:${validated.course_id}:${validated.page_url}`,
      'LONG', // Page content is relatively stable
      () => this.client.get(`/courses/${validated.course_id}/pages/${validated.page_url}`)
    );
  }

  // ===== Modules Features =====
  
  /**
   * List modules in a course
   * Before: 35 lines → After: 8 lines
   */
  async listModules(params: v.InferInput<typeof ListModulesSchema>) {
    const validated = v.parse(ListModulesSchema, params);
    
    return this.executeWithCacheDuration(
      `list modules for course ${validated.course_id}`,
      `modules:${validated.course_id}:${JSON.stringify(validated.include || [])}`,
      'LONG', // Module structure rarely changes
      () => this.client.get(`/courses/${validated.course_id}/modules`, {
        params: this.buildQueryParams({ include: validated.include })
      })
    );
  }

  /**
   * Get a single module with items
   * Before: 30 lines → After: 8 lines
   */
  async getModule(params: v.InferInput<typeof GetModuleSchema>) {
    const validated = v.parse(GetModuleSchema, params);
    
    return this.executeWithCacheDuration(
      `get module ${validated.module_id}`,
      `module:${validated.course_id}:${validated.module_id}:${JSON.stringify(validated.include || [])}`,
      'LONG',
      () => this.client.get(`/courses/${validated.course_id}/modules/${validated.module_id}`, {
        params: this.buildQueryParams({ include: validated.include })
      })
    );
  }

  /**
   * Get a single module item
   * Before: 30 lines → After: 8 lines
   */
  async getModuleItem(params: v.InferInput<typeof GetModuleItemSchema>) {
    const validated = v.parse(GetModuleItemSchema, params);
    
    return this.executeWithCacheDuration(
      `get module item ${validated.item_id}`,
      `module-item:${validated.course_id}:${validated.module_id}:${validated.item_id}`,
      'LONG',
      () => this.client.get(
        `/courses/${validated.course_id}/modules/${validated.module_id}/items/${validated.item_id}`
      )
    );
  }

  // ===== Discussions Features =====
  
  /**
   * List discussion topics in a course
   * Before: 35 lines → After: 8 lines
   */
  async listDiscussionTopics(params: v.InferInput<typeof ListDiscussionTopicsSchema>) {
    const validated = v.parse(ListDiscussionTopicsSchema, params);
    
    return this.executeWithCacheDuration(
      `list discussions for course ${validated.course_id}`,
      `discussions:${validated.course_id}`,
      'MEDIUM', // Discussions update moderately
      () => this.client.get(`/courses/${validated.course_id}/discussion_topics`)
    );
  }

  /**
   * Get a single discussion topic
   * Before: 30 lines → After: 8 lines
   */
  async getDiscussionTopic(params: v.InferInput<typeof GetDiscussionTopicSchema>) {
    const validated = v.parse(GetDiscussionTopicSchema, params);
    
    return this.executeWithCacheDuration(
      `get discussion ${validated.topic_id}`,
      `discussion:${validated.course_id}:${validated.topic_id}`,
      'SHORT', // Discussions can change frequently
      () => this.client.get(`/courses/${validated.course_id}/discussion_topics/${validated.topic_id}`)
    );
  }

  // ===== Announcements Features =====
  
  /**
   * List announcements for a course
   * Before: 30 lines → After: 8 lines
   */
  async listAnnouncements(params: v.InferInput<typeof ListAnnouncementsSchema>) {
    const validated = v.parse(ListAnnouncementsSchema, params);
    
    return this.executeWithCacheDuration(
      `list announcements for course ${validated.course_id}`,
      `announcements:${validated.course_id}`,
      'MEDIUM',
      () => this.client.get(`/courses/${validated.course_id}/announcements`)
    );
  }
}