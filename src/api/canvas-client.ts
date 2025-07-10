import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { CanvasError, CanvasAPIError } from '../types/errors.js';

export interface CanvasClientConfig {
  apiUrl: string;
  apiToken: string;
  apiVersion?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface CanvasResponse<T> {
  data: T;
  headers?: Record<string, string>;
  links?: {
    current?: string;
    next?: string;
    prev?: string;
    first?: string;
    last?: string;
  };
}

export class CanvasAPIClient {
  private client: AxiosInstance;
  private config: CanvasClientConfig;
  private maxRetries: number;

  constructor(config: CanvasClientConfig) {
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

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: number };

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

        if (
          error.response?.status &&
          error.response.status >= 500 &&
          originalRequest._retry < this.maxRetries
        ) {
          originalRequest._retry++;
          await this.delay(Math.pow(2, originalRequest._retry) * 1000);
          return this.client(originalRequest);
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleError(error: AxiosError): CanvasError {
    if (error.response) {
      const responseData = error.response.data as any;
      const canvasError = new CanvasAPIError(
        responseData?.message || error.message,
        error.response.status,
        responseData
      );
      return canvasError;
    } else if (error.request) {
      return new CanvasError('No response received from Canvas API');
    } else {
      return new CanvasError(error.message);
    }
  }

  private parseLinkHeader(linkHeader?: string): CanvasResponse<any>['links'] {
    if (!linkHeader) return {};

    const links: CanvasResponse<any>['links'] = {};
    const parts = linkHeader.split(',');

    parts.forEach(part => {
      const match = part.match(/<([^>]+)>; rel="([^"]+)"/);
      if (match) {
        const [, url, rel] = match;
        (links as any)[rel] = url;
      }
    });

    return links;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<CanvasResponse<T>> {
    const response = await this.client.get<T>(endpoint, { params });
    
    return {
      data: response.data,
      headers: response.headers as Record<string, string>,
      links: this.parseLinkHeader(response.headers.link as string),
    };
  }

  async post<T>(
    endpoint: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<CanvasResponse<T>> {
    const response = await this.client.post<T>(endpoint, data, config);
    
    return {
      data: response.data,
      headers: response.headers as Record<string, string>,
    };
  }

  async put<T>(
    endpoint: string,
    data?: Record<string, any>
  ): Promise<CanvasResponse<T>> {
    const response = await this.client.put<T>(endpoint, data);
    
    return {
      data: response.data,
      headers: response.headers as Record<string, string>,
    };
  }

  async delete<T>(endpoint: string): Promise<CanvasResponse<T>> {
    const response = await this.client.delete<T>(endpoint);
    
    return {
      data: response.data,
      headers: response.headers as Record<string, string>,
    };
  }

  async *paginate<T>(
    endpoint: string,
    params?: Record<string, any>
  ): AsyncGenerator<T[], void, unknown> {
    let nextUrl: string | undefined = endpoint;
    
    while (nextUrl) {
      let response: CanvasResponse<T[]>;
      
      if (nextUrl === endpoint) {
        response = await this.get<T[]>(nextUrl, params);
      } else {
        const url = new URL(nextUrl);
        const pathAndQuery = url.pathname + url.search;
        response = await this.get<T[]>(pathAndQuery);
      }
      
      yield response.data;
      
      nextUrl = response.links?.next;
    }
  }

  async getAllPages<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T[]> {
    const allData: T[] = [];
    
    for await (const page of this.paginate<T>(endpoint, params)) {
      allData.push(...page);
    }
    
    return allData;
  }

  async getFileMetadata(fileId: number): Promise<any> {
    const response = await this.get(`/files/${fileId}`);
    return response.data;
  }

  async downloadFile(url: string): Promise<Buffer> {
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