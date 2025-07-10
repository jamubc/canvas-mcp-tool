import { z } from 'zod';
declare const ConfigSchema: z.ZodObject<{
    canvas: z.ZodObject<{
        apiUrl: z.ZodString;
        apiToken: z.ZodString;
        apiVersion: z.ZodDefault<z.ZodString>;
        timeout: z.ZodDefault<z.ZodNumber>;
        maxRetries: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        apiUrl: string;
        apiToken: string;
        apiVersion: string;
        timeout: number;
        maxRetries: number;
    }, {
        apiUrl: string;
        apiToken: string;
        apiVersion?: string | undefined;
        timeout?: number | undefined;
        maxRetries?: number | undefined;
    }>;
    cache: z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        ttl: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        ttl: number;
    }, {
        enabled?: boolean | undefined;
        ttl?: number | undefined;
    }>;
    logging: z.ZodObject<{
        level: z.ZodDefault<z.ZodEnum<["debug", "info", "warn", "error"]>>;
        enabled: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        level: "debug" | "info" | "warn" | "error";
    }, {
        enabled?: boolean | undefined;
        level?: "debug" | "info" | "warn" | "error" | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    canvas: {
        apiUrl: string;
        apiToken: string;
        apiVersion: string;
        timeout: number;
        maxRetries: number;
    };
    cache: {
        enabled: boolean;
        ttl: number;
    };
    logging: {
        enabled: boolean;
        level: "debug" | "info" | "warn" | "error";
    };
}, {
    canvas: {
        apiUrl: string;
        apiToken: string;
        apiVersion?: string | undefined;
        timeout?: number | undefined;
        maxRetries?: number | undefined;
    };
    cache: {
        enabled?: boolean | undefined;
        ttl?: number | undefined;
    };
    logging: {
        enabled?: boolean | undefined;
        level?: "debug" | "info" | "warn" | "error" | undefined;
    };
}>;
export type Config = z.infer<typeof ConfigSchema>;
export declare const config: {
    canvas: {
        apiUrl: string;
        apiToken: string;
        apiVersion: string;
        timeout: number;
        maxRetries: number;
    };
    cache: {
        enabled: boolean;
        ttl: number;
    };
    logging: {
        enabled: boolean;
        level: "debug" | "info" | "warn" | "error";
    };
};
export declare function validateConfig(): void;
export declare function getCanvasClientConfig(): {
    apiUrl: string;
    apiToken: string;
    apiVersion: string;
    timeout: number;
    maxRetries: number;
};
export {};
//# sourceMappingURL=index.d.ts.map