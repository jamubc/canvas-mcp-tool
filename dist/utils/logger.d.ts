export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export declare class Logger {
    private name;
    private enabled;
    private level;
    constructor(name: string);
    private shouldLog;
    private formatMessage;
    debug(message: string, data?: any): void;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, error?: any): void;
}
export declare function createLogger(name: string): Logger;
//# sourceMappingURL=logger.d.ts.map