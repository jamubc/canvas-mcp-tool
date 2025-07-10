import { z } from 'zod';
import { createLogger } from '../utils/logger.js';
import { cache } from '../utils/cache.js';
const logger = createLogger('UsersTools');
export const GetProfileSchema = z.object({
    user_id: z.union([z.number(), z.literal('self')]).optional().default('self'),
});
export const ListUsersSchema = z.object({
    course_id: z.number(),
    search_term: z.string().optional(),
    enrollment_type: z.array(z.enum(['teacher', 'student', 'ta', 'observer', 'designer'])).optional(),
    enrollment_state: z.array(z.enum(['active', 'invited', 'rejected', 'completed', 'inactive'])).optional(),
    include: z.array(z.enum(['enrollments', 'email', 'avatar_url', 'test_student'])).optional(),
});
export class UsersTools {
    client;
    constructor(client) {
        this.client = client;
    }
    async getProfile(params) {
        try {
            const userId = params.user_id || 'self';
            const cacheKey = `user:profile:${userId}`;
            const cached = cache.get(cacheKey);
            if (cached) {
                return cached;
            }
            logger.info(`Fetching profile for user ${userId}`);
            const response = await this.client.get(`/users/${userId}/profile`);
            cache.set(cacheKey, response.data, 600000); // Cache for 10 minutes
            return response.data;
        }
        catch (error) {
            logger.error(`Failed to get profile for user ${params.user_id}`, error);
            throw error;
        }
    }
    async listUsers(params) {
        try {
            const cacheKey = `users:${params.course_id}:${JSON.stringify(params)}`;
            const cached = cache.get(cacheKey);
            if (cached) {
                return cached;
            }
            logger.info(`Fetching users for course ${params.course_id}`, params);
            const queryParams = {};
            if (params.search_term) {
                queryParams.search_term = params.search_term;
            }
            if (params.enrollment_type && params.enrollment_type.length > 0) {
                queryParams.enrollment_type = params.enrollment_type;
            }
            if (params.enrollment_state && params.enrollment_state.length > 0) {
                queryParams.enrollment_state = params.enrollment_state;
            }
            if (params.include && params.include.length > 0) {
                queryParams.include = params.include;
            }
            const users = await this.client.getAllPages(`/courses/${params.course_id}/users`, queryParams);
            cache.set(cacheKey, users, 300000); // Cache for 5 minutes
            logger.info(`Fetched ${users.length} users`);
            return users;
        }
        catch (error) {
            logger.error(`Failed to list users for course ${params.course_id}`, error);
            throw error;
        }
    }
}
//# sourceMappingURL=users.js.map