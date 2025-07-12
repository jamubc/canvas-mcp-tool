/**
 * Communication tool implementation
 * Handles conversations/messaging and notifications
 */

import { BaseToolImplementation } from '../BaseToolImplementation.js';
import { CACHE_DURATION } from '../cache-constants/index.js';
import * as v from 'valibot';
import {
  ListConversationsSchema,
  GetConversationSchema,
  CreateConversationSchema,
  ListNotificationsSchema
} from './schemas.js';

export class CommunicationTool extends BaseToolImplementation {
  // ===== Conversations (Messaging) Features =====
  
  /**
   * List user's conversations
   * Before: 35 lines → After: 8 lines
   */
  async listConversations(params: v.InferInput<typeof ListConversationsSchema> = {}) {
    const validated = v.parse(ListConversationsSchema, params);
    
    return this.executeWithCacheDuration(
      'list conversations',
      `conversations:${JSON.stringify(validated)}`,
      'SHORT', // Messages update frequently
      () => this.client.get('/conversations', { params: this.buildQueryParams(validated) })
    );
  }

  /**
   * Get a single conversation
   * Before: 30 lines → After: 8 lines
   */
  async getConversation(params: v.InferInput<typeof GetConversationSchema>) {
    const validated = v.parse(GetConversationSchema, params);
    
    return this.executeWithCacheDuration(
      `get conversation ${validated.conversation_id}`,
      `conversation:${validated.conversation_id}`,
      'SHORT',
      () => this.client.get(`/conversations/${validated.conversation_id}`)
    );
  }

  /**
   * Create/send a new conversation message
   * Before: 40 lines → After: 10 lines
   */
  async createConversation(params: v.InferInput<typeof CreateConversationSchema>) {
    const validated = v.parse(CreateConversationSchema, params);
    
    // No caching for create operations
    return this.withErrorHandling(
      'create conversation',
      () => this.client.post('/conversations', {
        recipients: validated.recipients,
        subject: validated.subject,
        body: validated.body,
        group_conversation: validated.group_conversation,
        attachment_ids: validated.attachment_ids
      })
    );
  }

  // ===== Notifications Features =====
  
  /**
   * List user's notifications/activity stream
   * Before: 30 lines → After: 8 lines
   */
  async listNotifications(params: v.InferInput<typeof ListNotificationsSchema> = {}) {
    const validated = v.parse(ListNotificationsSchema, params);
    
    return this.executeWithCacheDuration(
      'list notifications',
      `notifications:${JSON.stringify(validated)}`,
      'SHORT', // Notifications change very frequently
      () => this.client.get('/users/self/activity_stream', { 
        params: this.buildQueryParams(validated) 
      })
    );
  }
}