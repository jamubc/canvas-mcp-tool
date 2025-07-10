import axios from 'axios';
import { CanvasError, CanvasAPIError } from '../types/errors.js';
export class CanvasAPIClient {
    client;
    config;
    maxRetries;
    constructor(config) {
        this.config = config;
        this.maxRetries = config.maxRetries || 3;
        this.client = axios.create({
            baseURL: `${config.apiUrl}/api/${config.apiVersion || 'v1'}`,
            timeout: config.timeout || 30000,
            headers: {
                'Authorization': `Bearer ${config.apiToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        this.client.interceptors.request.use((config) => {
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        this.client.interceptors.response.use((response) => {
            return response;
        }, async (error) => {
            const originalRequest = error.config;
            if (!originalRequest) {
                return Promise.reject(this.handleError(error));
            }
            originalRequest._retry = originalRequest._retry || 0;
            if (error.response?.status === 429 && originalRequest._retry < this.maxRetries) {
                originalRequest._retry++;
                const retryAfter = parseInt(error.response.headers['retry-after'] || '1', 10);
                await this.delay(retryAfter * 1000);
                return this.client(originalRequest);
            }
            if (error.response?.status &&
                error.response.status >= 500 &&
                originalRequest._retry < this.maxRetries) {
                originalRequest._retry++;
                await this.delay(Math.pow(2, originalRequest._retry) * 1000);
                return this.client(originalRequest);
            }
            return Promise.reject(this.handleError(error));
        });
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    handleError(error) {
        if (error.response) {
            const responseData = error.response.data;
            const canvasError = new CanvasAPIError(responseData?.message || error.message, error.response.status, responseData);
            return canvasError;
        }
        else if (error.request) {
            return new CanvasError('No response received from Canvas API');
        }
        else {
            return new CanvasError(error.message);
        }
    }
    parseLinkHeader(linkHeader) {
        if (!linkHeader)
            return {};
        const links = {};
        const parts = linkHeader.split(',');
        parts.forEach(part => {
            const match = part.match(/<([^>]+)>; rel="([^"]+)"/);
            if (match) {
                const [, url, rel] = match;
                links[rel] = url;
            }
        });
        return links;
    }
    async get(endpoint, params) {
        const response = await this.client.get(endpoint, { params });
        return {
            data: response.data,
            headers: response.headers,
            links: this.parseLinkHeader(response.headers.link),
        };
    }
    async post(endpoint, data, config) {
        const response = await this.client.post(endpoint, data, config);
        return {
            data: response.data,
            headers: response.headers,
        };
    }
    async put(endpoint, data) {
        const response = await this.client.put(endpoint, data);
        return {
            data: response.data,
            headers: response.headers,
        };
    }
    async delete(endpoint) {
        const response = await this.client.delete(endpoint);
        return {
            data: response.data,
            headers: response.headers,
        };
    }
    async *paginate(endpoint, params) {
        let nextUrl = endpoint;
        while (nextUrl) {
            let response;
            if (nextUrl === endpoint) {
                response = await this.get(nextUrl, params);
            }
            else {
                const url = new URL(nextUrl);
                const pathAndQuery = url.pathname + url.search;
                response = await this.get(pathAndQuery);
            }
            yield response.data;
            nextUrl = response.links?.next;
        }
    }
    async getAllPages(endpoint, params) {
        const allData = [];
        for await (const page of this.paginate(endpoint, params)) {
            allData.push(...page);
        }
        return allData;
    }
    async getFileMetadata(fileId) {
        const response = await this.get(`/files/${fileId}`);
        return response.data;
    }
    async downloadFile(url) {
        // Files require authentication token in header
        const response = await this.client.get(url, {
            responseType: 'arraybuffer',
            maxContentLength: 5 * 1024 * 1024 * 1024, // 5GB limit
            maxBodyLength: 5 * 1024 * 1024 * 1024,
            timeout: 300000 // 5 minute timeout for large file downloads
        });
        return Buffer.from(response.data);
    }
}
//# sourceMappingURL=canvas-client.js.map