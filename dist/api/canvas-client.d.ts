import { AxiosRequestConfig } from 'axios';
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
export declare class CanvasAPIClient {
    private client;
    private config;
    private maxRetries;
    constructor(config: CanvasClientConfig);
    private setupInterceptors;
    private delay;
    private handleError;
    private parseLinkHeader;
    get<T>(endpoint: string, params?: Record<string, any>): Promise<CanvasResponse<T>>;
    post<T>(endpoint: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<CanvasResponse<T>>;
    put<T>(endpoint: string, data?: Record<string, any>): Promise<CanvasResponse<T>>;
    delete<T>(endpoint: string): Promise<CanvasResponse<T>>;
    paginate<T>(endpoint: string, params?: Record<string, any>): AsyncGenerator<T[], void, unknown>;
    getAllPages<T>(endpoint: string, params?: Record<string, any>): Promise<T[]>;
    getFileMetadata(fileId: number): Promise<any>;
    downloadFile(url: string): Promise<Buffer>;
}
//# sourceMappingURL=canvas-client.d.ts.map