import { config as loadEnv } from 'dotenv';
import { z } from 'zod';
loadEnv();
const ConfigSchema = z.object({
    canvas: z.object({
        apiUrl: z.string().url().describe('Canvas API base URL (e.g., your-schools-canvas-url.com)'),
        apiToken: z.string().min(1).describe('Canvas API access token'),
        apiVersion: z.string().default('v1').describe('Canvas API version'),
        timeout: z.number().min(1000).default(30000).describe('API request timeout in milliseconds'),
        maxRetries: z.number().min(0).max(5).default(3).describe('Maximum number of retry attempts'),
    }),
    cache: z.object({
        enabled: z.boolean().default(true).describe('Enable response caching'),
        ttl: z.number().min(0).default(300).describe('Cache TTL in seconds'),
    }),
    logging: z.object({
        level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
        enabled: z.boolean().default(true),
    }),
});
function loadConfig() {
    try {
        const config = {
            canvas: {
                apiUrl: process.env.CANVAS_API_URL || '',
                apiToken: process.env.CANVAS_API_TOKEN || '',
                apiVersion: process.env.CANVAS_API_VERSION || 'v1',
                timeout: parseInt(process.env.CANVAS_API_TIMEOUT || '30000', 10),
                maxRetries: parseInt(process.env.CANVAS_MAX_RETRIES || '3', 10),
            },
            cache: {
                enabled: process.env.CACHE_ENABLED !== 'false',
                ttl: parseInt(process.env.CACHE_TTL || '300', 10),
            },
            logging: {
                level: (process.env.LOG_LEVEL || 'info'),
                enabled: process.env.LOGGING_ENABLED !== 'false',
            },
        };
        return ConfigSchema.parse(config);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Configuration validation failed:', error.errors);
            process.exit(1);
        }
        throw error;
    }
}
export const config = loadConfig();
export function validateConfig() {
    if (!config.canvas.apiUrl) {
        throw new Error('CANVAS_API_URL environment variable is required');
    }
    if (!config.canvas.apiToken) {
        throw new Error('CANVAS_API_TOKEN environment variable is required');
    }
}
export function getCanvasClientConfig() {
    return {
        apiUrl: config.canvas.apiUrl,
        apiToken: config.canvas.apiToken,
        apiVersion: config.canvas.apiVersion,
        timeout: config.canvas.timeout,
        maxRetries: config.canvas.maxRetries,
    };
}
//# sourceMappingURL=index.js.map