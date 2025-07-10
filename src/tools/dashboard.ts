import { z } from 'zod';
import { CanvasAPIClient } from '../api/canvas-client.js';
import { CanvasDashboardCard, CanvasCalendarEvent } from '../types/canvas.js';
import { createLogger } from '../utils/logger.js';
import { cache } from '../utils/cache.js';

const logger = createLogger('DashboardTools');

export const GetDashboardCardsSchema = z.object({});

export const ListCalendarEventsSchema = z.object({
  type: z.enum(['event', 'assignment']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  context_codes: z.array(z.string()).optional(),
  excludes: z.array(z.enum(['assignment', 'description', 'child_events'])).optional(),
  includes: z.array(z.enum(['web_conference'])).optional(),
  important_dates: z.boolean().optional(),
  blackout_date: z.boolean().optional(),
});

export class DashboardTools {
  constructor(private client: CanvasAPIClient) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getDashboardCards(_params: z.infer<typeof GetDashboardCardsSchema>): Promise<CanvasDashboardCard[]> {
    try {
      const cacheKey = 'dashboard:cards';
      const cached = cache.get<CanvasDashboardCard[]>(cacheKey);
      
      if (cached) {
        return cached;
      }

      logger.info('Fetching dashboard cards');
      
      const response = await this.client.get<CanvasDashboardCard[]>('/dashboard/dashboard_cards');
      
      cache.set(cacheKey, response.data, 300000); // Cache for 5 minutes
      
      logger.info(`Fetched ${response.data.length} dashboard cards`);
      return response.data;
    } catch (error) {
      logger.error('Failed to get dashboard cards', error);
      throw error;
    }
  }

  async listCalendarEvents(params: z.infer<typeof ListCalendarEventsSchema>): Promise<CanvasCalendarEvent[]> {
    try {
      const cacheKey = `calendar:events:${JSON.stringify(params)}`;
      const cached = cache.get<CanvasCalendarEvent[]>(cacheKey);
      
      if (cached) {
        return cached;
      }

      logger.info('Fetching calendar events', params);
      
      const queryParams: Record<string, any> = {};
      
      if (params.type) {
        queryParams.type = params.type;
      }
      
      if (params.start_date) {
        queryParams.start_date = params.start_date;
      }
      
      if (params.end_date) {
        queryParams.end_date = params.end_date;
      }
      
      if (params.context_codes && params.context_codes.length > 0) {
        queryParams.context_codes = params.context_codes;
      }
      
      if (params.excludes && params.excludes.length > 0) {
        queryParams.excludes = params.excludes;
      }
      
      if (params.includes && params.includes.length > 0) {
        queryParams.includes = params.includes;
      }
      
      if (params.important_dates !== undefined) {
        queryParams.important_dates = params.important_dates;
      }
      
      if (params.blackout_date !== undefined) {
        queryParams.blackout_date = params.blackout_date;
      }

      // If no context codes provided, fetch from current user
      if (!params.context_codes || params.context_codes.length === 0) {
        const events = await this.client.getAllPages<CanvasCalendarEvent>(
          '/users/self/calendar_events',
          queryParams
        );
        
        cache.set(cacheKey, events, 180000); // Cache for 3 minutes
        
        logger.info(`Fetched ${events.length} calendar events`);
        return events;
      } else {
        const events = await this.client.getAllPages<CanvasCalendarEvent>(
          '/calendar_events',
          queryParams
        );
        
        cache.set(cacheKey, events, 180000); // Cache for 3 minutes
        
        logger.info(`Fetched ${events.length} calendar events`);
        return events;
      }
    } catch (error) {
      logger.error('Failed to list calendar events', error);
      throw error;
    }
  }
}